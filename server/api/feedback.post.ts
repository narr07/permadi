import { and, count, eq, gte, sql } from 'drizzle-orm'
import { db, schema } from 'hub:db'

// Masukan pengunjung tentang situs, tanpa login. Disimpan privat di D1 lalu dikirim ke email pemilik.
// Perlindungan spam tanpa layanan pihak ketiga: honeypot, waktu isi minimum, batas panjang, dan
// batas kiriman per IP (IP hanya disimpan sebagai hash).

const CATEGORIES = ['design', 'content', 'bug', 'other'] as const
type Category = typeof CATEGORIES[number]

const MIN_MESSAGE = 10
const MAX_MESSAGE = 2000
const MIN_FILL_MS = 3000 // bot biasanya mengirim formulir seketika setelah halaman dimuat
const MAX_PER_HOUR = 5
const NOTIFY_TO = 'dinar@permadi.dev'
const NOTIFY_FROM = 'Masukan permadi.dev <feedback@permadi.dev>'

const CATEGORY_LABEL: Record<Category, string> = {
	design: 'Tampilan',
	content: 'Isi',
	bug: 'Error',
	other: 'Lainnya',
}

interface FeedbackBody {
	category?: string
	message?: string
	email?: string
	page?: string
	locale?: string
	website?: string // honeypot: tersembunyi dari manusia, biasanya diisi bot
	elapsed?: number // milidetik sejak formulir dibuka
}

// Migrasi 0001 membuat tabel yang sama; ini cadangan bila migrasi belum diterapkan di D1 produksi
let tableReady = false
async function ensureTable() {
	if (tableReady)
		return
	await db.run(sql`CREATE TABLE IF NOT EXISTS site_feedback (
		id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
		category text NOT NULL,
		message text NOT NULL,
		email text,
		page text,
		locale text,
		ip_hash text NOT NULL,
		created_at text NOT NULL
	)`)
	tableReady = true
}

async function hashIp(ip: string, salt: string) {
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${ip}|feedback|${salt}`))
	return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('')
}

function escapeHtml(text: string) {
	return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', '\'': '&#39;' })[c]!)
}

export default defineEventHandler(async (event) => {
	const body = await readBody<FeedbackBody>(event).catch(() => null)
	if (!body)
		throw createError({ statusCode: 400, statusMessage: 'Invalid body' })

	// Bot yang mengisi honeypot atau mengirim terlalu cepat diberi jawaban sukses palsu agar tidak mencoba ulang
	if (body.website || typeof body.elapsed !== 'number' || body.elapsed < MIN_FILL_MS)
		return { ok: true }

	const category = CATEGORIES.includes(body.category as Category) ? body.category as Category : null
	const message = (body.message || '').trim()
	const email = (body.email || '').trim().slice(0, 200)
	if (!category)
		throw createError({ statusCode: 400, statusMessage: 'invalid_category' })
	if (message.length < MIN_MESSAGE || message.length > MAX_MESSAGE)
		throw createError({ statusCode: 400, statusMessage: 'invalid_message' })
	if (email && !/^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email))
		throw createError({ statusCode: 400, statusMessage: 'invalid_email' })

	const page = (body.page || '').startsWith('/') ? body.page!.slice(0, 300) : null
	const locale = body.locale === 'en' ? 'en' : 'id'

	const config = useRuntimeConfig()
	const ip = getHeader(event, 'cf-connecting-ip') || getRequestIP(event, { xForwardedFor: true }) || 'unknown'
	const ipHash = await hashIp(ip, config.sessionSalt)

	await ensureTable()

	const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
	const recent = await db
		.select({ n: count() })
		.from(schema.siteFeedback)
		.where(and(eq(schema.siteFeedback.ipHash, ipHash), gte(schema.siteFeedback.createdAt, hourAgo)))
		.get()
	if ((recent?.n ?? 0) >= MAX_PER_HOUR)
		throw createError({ statusCode: 429, statusMessage: 'rate_limited' })

	const createdAt = new Date().toISOString()
	await db.insert(schema.siteFeedback).values({ category, message, email: email || null, page, locale, ipHash, createdAt })

	// Email dikirim di latar belakang: gagal kirim tidak membatalkan masukan yang sudah tersimpan
	if (config.resendApiKey) {
		const html = `<p><strong>Kategori:</strong> ${CATEGORY_LABEL[category]}</p>
<p><strong>Halaman:</strong> ${page ? `<a href="https://permadi.dev${escapeHtml(page)}">${escapeHtml(page)}</a>` : '-'}</p>
<p><strong>Balas ke:</strong> ${email ? escapeHtml(email) : '(tidak diisi)'}</p>
<p><strong>Bahasa:</strong> ${locale}</p>
<hr>
<p style="white-space:pre-wrap">${escapeHtml(message)}</p>`
		event.waitUntil(
			resendSendEmail({
				from: NOTIFY_FROM,
				to: NOTIFY_TO,
				subject: `Masukan situs: ${CATEGORY_LABEL[category]}`,
				html,
				tags: [{ name: 'type', value: 'site_feedback' }],
			}).catch(err => console.error('[feedback] email gagal:', err)),
		)
	}

	return { ok: true }
})
