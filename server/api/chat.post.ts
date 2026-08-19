import { createError, defineEventHandler, getHeader, readBody } from 'h3'

// Rate Limiter per IP: Maksimal 15 pesan per IP dalam jendela 1 jam (60 menit)
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 jam
const MAX_REQUESTS_PER_WINDOW = 15

interface RateLimitRecord {
	count: number
	resetTime: number
}

const ipRateLimits = new Map<string, RateLimitRecord>()

function checkRateLimit(ip: string): { allowed: boolean, remaining: number, resetInMinutes: number } {
	const now = Date.now()
	const record = ipRateLimits.get(ip)

	// Bersihkan jika sesi kadaluarsa
	if (!record || now > record.resetTime) {
		ipRateLimits.set(ip, {
			count: 1,
			resetTime: now + RATE_LIMIT_WINDOW_MS,
		})
		return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetInMinutes: 60 }
	}

	if (record.count >= MAX_REQUESTS_PER_WINDOW) {
		const resetInMinutes = Math.max(1, Math.ceil((record.resetTime - now) / (60 * 1000)))
		return { allowed: false, remaining: 0, resetInMinutes }
	}

	record.count += 1
	const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - record.count)
	const resetInMinutes = Math.max(1, Math.ceil((record.resetTime - now) / (60 * 1000)))

	return { allowed: true, remaining, resetInMinutes }
}

function getClientIp(event: any): string {
	const cfIp = getHeader(event, 'cf-connecting-ip')
	const xForwardedFor = getHeader(event, 'x-forwarded-for')
	const xRealIp = getHeader(event, 'x-real-ip')

	if (cfIp)
		return cfIp.trim()
	if (xForwardedFor)
		return xForwardedFor.split(',')[0].trim()
	if (xRealIp)
		return xRealIp.trim()
	return '127.0.0.1'
}

interface CurrentContext {
	path?: string
	title?: string
	url?: string
	content?: string
}

async function buildDynamicSystemInstruction(event: any, locale: 'id' | 'en', currentContext?: CurrentContext): Promise<string> {
	const isIndonesian = locale === 'id'
	const domain = 'https://permadi.dev'

	let projectsList = ''
	let articlesList = ''
	let activeContextSection = ''

	try {
		const projectCollection = isIndonesian ? 'projek_id' : 'projek_en'
		const blogCollection = isIndonesian ? 'blog_id' : 'blog_en'
		const projectPrefix = isIndonesian ? 'projek' : 'projects'

		const [projects, articles] = await Promise.all([
			(queryCollection(event, projectCollection) as any).order('date', 'DESC').all(),
			(queryCollection(event, blogCollection) as any).order('date', 'DESC').all(),
		])

		// Masukkan seluruh materi dan plainText isi konten ke dalam pengetahuan AI
		projectsList = projects.map((p: any, i: number) => {
			const url = `${domain}/${locale}/${projectPrefix}/${p.slug}`
			const desc = p.description || ''
			const tech = p.tools || p.tech ? `\n   - Tech Stack: ${[...(p.tools || []), ...(p.tech || [])].join(', ')}` : ''
			const rawContent = p.plainText ? `\n   - Detail Projek: ${p.plainText.slice(0, 1500)}` : ''
			return `### ${i + 1}. [${p.title}](${url})\n   - Ringkasan: ${desc}${tech}${rawContent}`
		}).join('\n\n')

		articlesList = articles.map((a: any, i: number) => {
			const url = `${domain}/${locale}/blog/${a.slug}`
			const desc = a.description || ''
			const cat = a.category ? `\n   - Kategori: ${a.category}` : ''
			const rawContent = a.plainText ? `\n   - Isi Materi & Gagasan: ${a.plainText.slice(0, 2000)}` : ''
			return `### ${i + 1}. [${a.title}](${url})${cat}\n   - Deskripsi: ${desc}${rawContent}`
		}).join('\n\n')

		// 🔍 Deteksi & Tangkap Seluruh Halaman yang Sedang Dibuka Pengunjung (Apapun Halamannya)
		if (currentContext?.path || currentContext?.content) {
			const cleanPath = (currentContext.path || '').split('?')[0].split('#')[0]
			const segments = cleanPath.split('/').filter(Boolean)
			const slug = segments[segments.length - 1] || ''

			// Cocokkan dengan artikel atau projek jika ada
			const matchedArticle = articles.find((a: any) => {
				return a.slug === slug
					|| (a.path && (a.path.endsWith(`/${slug}`) || a.path.includes(slug)))
					|| (a.stem && a.stem.includes(slug))
			})

			const matchedProject = !matchedArticle
				? projects.find((p: any) => {
						return p.slug === slug
							|| (p.path && (p.path.endsWith(`/${slug}`) || p.path.includes(slug)))
							|| (p.stem && p.stem.includes(slug))
					})
				: null

			const pageTitle = currentContext.title || matchedArticle?.title || matchedProject?.title || 'Halaman Website'
			const pageUrl = currentContext.url || `${domain}${cleanPath}`
			const rawPageContent = currentContext.content || matchedArticle?.plainText || matchedProject?.plainText || ''

			activeContextSection = isIndonesian
				? `\n\n📌 REAL-TIME KONTEKS: HALAMAN & TAMPILAN YANG SEDANG DIAKSES PENGUNJUNG SAAT INI:
- URL / Lokasi Halaman: ${pageUrl} (Path: ${cleanPath})
- Judul Halaman Browser: "${pageTitle}"
${matchedArticle ? `- Tipe Halaman: Artikel Blog (${matchedArticle.category || 'Umum'})` : ''}
${matchedProject ? `- Tipe Halaman: Portofolio Projek (${matchedProject.category || 'Web App'})` : ''}
- Teks & Informasi Lengkap yang Sedang Tampil di Layar Pengunjung:
"""
${rawPageContent}
"""`
				: `\n\n📌 REAL-TIME CONTEXT: THE EXACT PAGE & SCREEN CURRENTLY ACCESSED BY THE VISITOR:
- Page URL / Location: ${pageUrl} (Path: ${cleanPath})
- Page Title: "${pageTitle}"
${matchedArticle ? `- Page Type: Blog Article (${matchedArticle.category || 'General'})` : ''}
${matchedProject ? `- Page Type: Portfolio Project (${matchedProject.category || 'Web App'})` : ''}
- Full Text & Information Visible on the Visitor's Screen:
"""
${rawPageContent}
"""`
		}
	}
	catch (err) {
		console.warn('Gagal mengambil data dinamis dari Nuxt Content:', err)
	}

	if (isIndonesian) {
		return `Anda adalah "Permadi AI Assistant", asisten pintar resmi untuk website dan portofolio Dinar Permadi Yusup (Permadi).

BAHASA RESPON (MUTLAK):
- Anda HARUS menjawab 100% dalam BAHASA INDONESIA yang ramah, santun, terstruktur rapi, dan cerdas.

TENTANG DINAR PERMADI YUSUP:
- Peran: Frontend Web Developer, Pendidik, dan Desainer Grafis asal Indonesia.
- Email: dinar@permadi.dev
- Website: ${domain}/id
- GitHub: https://github.com/narr07
- X / Twitter: https://x.com/dinarpermadi07
- Prinsip Desain: Estetika Bento Grid, Skala Tipografi Golden Ratio, Aksesibilitas Kontras Tinggi (WCAG AA), dan performa web instan.

KEAHLIAN TEKNIS & TECH STACK:
- Frontend: Nuxt 4, Vue 3, Vite, UnoCSS, Tailwind CSS, TypeScript.
- Konten & Database: Nuxt Content v3, Cloudflare D1 (SQLite), Nuxt Studio.
- Arsitektur: Cloudflare Pages Edge SSG, Model Context Protocol (MCP), RSS/Atom Feeds.
${activeContextSection}

DATABASE PENGETAHUAN LENGKAP DARI ARTIKEL BLOG PERMADI (RAW CONTENT):
${articlesList}

DATABASE PENGETAHUAN LENGKAP DARI STUDI KASUS PROJEK (RAW CONTENT):
${projectsList}

PANDUAN MENJAWAB:
1. KESADARAN HALAMAN REAL-TIME (REAL-TIME CONTEXT AWARENESS):
   - Anda SELALU TAHU halaman apa yang sedang dibuka oleh user (apakah Beranda, Tentang Saya, Kontak, Galeri, List Blog, Detail Artikel tertentu, atau Detail Projek tertentu).
   - Jika user bertanya hal kontekstual seperti:
     * "halaman apa ini?" / "saya sedang buka apa?"
     * "inti dari halaman ini apa?" / "rangkum halaman ini"
     * "siapa yang diceritakan di sini?" / "ada info apa saja di halaman ini?"
     * atau pertanyaan apapun yang merujuk pada halaman saat ini tanpa menyebut judul secara spesifik,
     👉 JAWAB SECARA CERDAS DAN LANGSUNG berdasarkan teks pada "REAL-TIME KONTEKS" di atas!
2. Jika user bertanya materi umum atau mencari artikel/projek lain di luar halaman saat ini, gunakan database pengetahuan di atas.
3. Selalu sertakan tautan artikel/projek terkait ([Judul](url)) jika relevan.
4. Gunakan format Markdown rapi: heading kecil (###), daftar poin (bullet points), dan teks tebal (**bold**).
5. Tolak dengan sopan jika ditanya hal di luar karya/website Permadi.`
	}

	return `You are "Permadi AI Assistant", the official intelligent portfolio assistant for Dinar Permadi Yusup (known as Permadi).

LANGUAGE REQUIREMENT (MANDATORY):
- You MUST respond 100% in ENGLISH in a friendly, concise, clear, and professional tone.

ABOUT DINAR PERMADI YUSUP:
- Role: Frontend Web Developer, Educator, and Graphic Designer based in Indonesia.
- Email: dinar@permadi.dev
- Website: ${domain}/en
- GitHub: https://github.com/narr07
- X / Twitter: https://x.com/dinarpermadi07
- Core Principles: Bento Grid aesthetics, Golden Ratio typography scaling, high contrast accessibility (WCAG AA), performance-first engineering.
${activeContextSection}

COMPLETE KNOWLEDGE BASE FROM PERMADI'S BLOG ARTICLES (RAW CONTENT):
${articlesList}

COMPLETE KNOWLEDGE BASE FROM PROJECT CASE STUDIES (RAW CONTENT):
${projectsList}

ANSWERING GUIDELINES:
1. REAL-TIME CONTEXT AWARENESS (HIGH PRIORITY):
   - You ALWAYS know which page the visitor is currently looking at (Home, About, Contact, Gallery, Blog post, Project case study, etc.).
   - When visitors ask contextual questions such as "what page is this?", "what is the core summary of this page?", "summarize this page", "what info is on this screen?", or any question referring to the active page:
     👉 ANSWER DIRECTLY AND ACCURATELY based on the "REAL-TIME CONTEXT" text provided above!
2. When visitors ask deep or general questions about other articles or projects, answer based on the knowledge base above.
3. Always provide relevant clickable markdown links ([Title](url)).
4. Format with clean GitHub Markdown (headings, bullet points, bold highlights).
5. Strictly focus on Permadi's portfolio, articles, skills, and projects.`
}

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig(event)
	const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY

	if (!apiKey) {
		throw createError({
			statusCode: 500,
			statusMessage: 'GEMINI_API_KEY belum diisi di file .env atau Cloudflare environment variables.',
		})
	}

	const body = await readBody(event)
	const messages = body?.messages || []
	const locale: 'id' | 'en' = body?.locale === 'en' ? 'en' : 'id'
	const currentContext: CurrentContext | undefined = body?.currentContext

	if (!Array.isArray(messages) || messages.length === 0) {
		throw createError({
			statusCode: 400,
			statusMessage: 'Format pesan tidak valid.',
		})
	}

	// 🛡️ Pembatasan Kuota Berdasarkan IP Address (Rate Limiting)
	const clientIp = getClientIp(event)
	const rateLimit = checkRateLimit(clientIp)

	if (!rateLimit.allowed) {
		const isIndo = locale === 'id'
		throw createError({
			statusCode: 429,
			statusMessage: isIndo
				? `Batas obrolan tercapai (${MAX_REQUESTS_PER_WINDOW} pesan/jam untuk IP Anda). Silakan coba lagi dalam ${rateLimit.resetInMinutes} menit.`
				: `Rate limit reached (${MAX_REQUESTS_PER_WINDOW} messages/hour for your IP). Please try again in ${rateLimit.resetInMinutes} minutes.`,
		})
	}

	// Bangun system instruction dinamis berisi seluruh raw content artikel & projek + halaman aktif
	const systemInstruction = await buildDynamicSystemInstruction(event, locale, currentContext)

	// Format percakapan untuk Gemini REST API
	const contents = messages.map((m: { role: string, content: string }) => ({
		role: m.role === 'user' ? 'user' : 'model',
		parts: [{ text: m.content }],
	}))

	const payload = {
		systemInstruction: {
			parts: [{ text: systemInstruction }],
		},
		contents,
		generationConfig: {
			temperature: 0.7,
			maxOutputTokens: 1500,
		},
	}

	// Model aktif Google Gemini API
	const candidateModels = [
		'gemini-3.5-flash',
		'gemini-3-flash-preview',
		'gemini-3.1-flash-lite',
		'gemma-4-26b-a4b-it',
	]
	let lastErrorMsg = ''

	for (const model of candidateModels) {
		try {
			const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})

			if (!res.ok) {
				const errText = await res.text()
				lastErrorMsg = errText
				console.warn(`Model ${model} returned non-200:`, errText)
				continue
			}

			const data = await res.json()
			const parts = data.candidates?.[0]?.content?.parts || []

			// Filter out thinking tokens if any
			let replyText = parts
				.filter((p: any) => p.text && !p.thought)
				.map((p: any) => p.text)
				.join('\n')

			if (!replyText && parts.length > 0) {
				replyText = parts.map((p: any) => p.text || '').join('\n')
			}

			if (replyText) {
				return {
					role: 'assistant',
					content: replyText.trim(),
					remainingQuota: rateLimit.remaining,
				}
			}
		}
		catch (err: any) {
			lastErrorMsg = err?.message || String(err)
			console.warn(`Error calling ${model}:`, err)
		}
	}

	throw createError({
		statusCode: 500,
		statusMessage: `Gemini Error: ${lastErrorMsg || 'Gagal mendapatkan jawaban dari model Gemini.'}`,
	})
})
