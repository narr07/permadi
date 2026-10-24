/**
 * Data kata kunci asli permadi.dev dari Search Console API (gratis, hanya baca).
 * Peluang = kueri yang sudah tampil di posisi 8–20 (halaman 2 Google): paling mudah naik ke halaman 1.
 */

import { getAccessToken } from './google-auth.mjs'

const SCOPE = 'https://www.googleapis.com/auth/webmasters.readonly'
const API = 'https://searchconsole.googleapis.com/webmasters/v3'

async function resolveSite(token) {
	const response = await fetch(`${API}/sites`, { headers: { Authorization: `Bearer ${token}` } })
	if (!response.ok)
		throw new Error(`sites HTTP ${response.status}: ${(await response.text()).slice(0, 200)}`)
	const sites = (await response.json()).siteEntry || []
	const preferred = [process.env.SEARCH_CONSOLE_SITE, 'sc-domain:permadi.dev', 'https://permadi.dev/'].filter(Boolean)
	const site = preferred.find(url => sites.some(s => s.siteUrl === url)) || sites[0]?.siteUrl
	if (!site)
		throw new Error('service account has no Search Console property; add it as a user first')
	return site
}

const isoDate = daysAgo => new Date(Date.now() - daysAgo * 864e5).toISOString().slice(0, 10)

/**
 * @returns {Promise<{ site: string, opportunities: Array<{ query, page, position, impressions, clicks }> }>} Page-2 queries, most impressions first
 */
export async function fetchSearchOpportunities(account, { days = 90, minImpressions = 10, minPosition = 8, maxPosition = 20, hostname } = {}) {
	const token = await getAccessToken(account, [SCOPE])
	const site = await resolveSite(token)

	// Data 2–3 hari terakhir belum final; akhiri rentang 3 hari lalu
	const response = await fetch(`${API}/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
		method: 'POST',
		headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			startDate: isoDate(days + 3),
			endDate: isoDate(3),
			dimensions: ['query', 'page'],
			rowLimit: 5000,
		}),
	})
	if (!response.ok)
		throw new Error(`searchAnalytics HTTP ${response.status}: ${(await response.text()).slice(0, 200)}`)

	// Satu kueri bisa tampil lewat beberapa halaman: ambil halaman dengan tayangan terbanyak
	const byQuery = new Map()
	for (const row of (await response.json()).rows || []) {
		const [query, page] = row.keys
		// Properti domain ikut memuat subdomain (mis. guru.permadi.dev); saring bila diminta
		if (hostname && new URL(page).hostname !== hostname)
			continue
		const current = byQuery.get(query)
		if (!current || row.impressions > current.impressions)
			byQuery.set(query, { query, page, position: row.position, impressions: row.impressions, clicks: row.clicks })
	}

	const opportunities = [...byQuery.values()]
		.filter(r => r.impressions >= minImpressions && r.position >= minPosition && r.position <= maxPosition)
		.sort((a, b) => b.impressions - a.impressions)
		.map(r => ({ ...r, position: Number(r.position.toFixed(1)) }))

	return { site, opportunities }
}
