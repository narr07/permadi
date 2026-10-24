/**
 * Pemanggil Gemini API untuk generator artikel: retry + fallback antar model,
 * hitung biaya per panggilan, dan catatan belanja bulanan agar kredit Google
 * Developer Program ($10/bulan) terpakai maksimal tanpa melewati anggaran.
 */

import fs from 'node:fs'
import path from 'node:path'

const API = 'https://generativelanguage.googleapis.com/v1beta/models'

// USD per 1 juta token, dari ai.google.dev/gemini-api/docs/pricing (dicek 2026-10-25).
// Entri dengan `until` berlaku sampai tanggal itu; setelahnya entri berikutnya.
// Output dihitung termasuk token thinking. perImage = harga per gambar 2K.
const PRICING = {
	'gemini-4-argon': [{ until: '2026-11-30', input: 2, output: 10 }, { input: 4, output: 20 }],
	'gemini-3.1-pro-preview': [{ input: 2, output: 12 }],
	'gemini-pro-latest': [{ input: 2, output: 12 }],
	'gemini-3.8-flash': [{ until: '2026-12-31', input: 0.75, output: 3.75 }, { input: 1.5, output: 7.5 }],
	'gemini-flash-latest': [{ until: '2026-12-31', input: 0.75, output: 3.75 }, { input: 1.5, output: 7.5 }],
	'gemini-3-pro-image': [{ input: 2, output: 12, perImage: 0.134 }],
	'gemini-nano-banana-2.1': [{ input: 1.5, output: 7.5, perImage: 0.0504 }],
}

function priceFor(model) {
	const today = new Date().toISOString().slice(0, 10)
	return PRICING[model]?.find(tier => !tier.until || today <= tier.until)
}

export function estimateCost(model, usage = {}, images = 0) {
	const price = priceFor(model)
	if (!price) {
		console.warn(`[AI] No price for ${model}; cost not tracked`)
		return 0
	}
	const imageTokens = (usage.candidatesTokensDetails || [])
		.filter(d => d.modality === 'IMAGE')
		.reduce((sum, d) => sum + (d.tokenCount || 0), 0)
	const inputTokens = (usage.promptTokenCount || 0) + (usage.toolUsePromptTokenCount || 0)
	const outputTokens = Math.max(0, (usage.candidatesTokenCount || 0) - imageTokens) + (usage.thoughtsTokenCount || 0)
	return (inputTokens * price.input + outputTokens * price.output) / 1e6 + images * (price.perImage || 0)
}

/**
 * Catatan belanja per bulan (YYYY-MM) di data/ai-spend.json, di-commit bersama artikel
 * supaya run berikutnya di GitHub Actions tahu sisa anggaran bulan ini.
 */
export function createLedger(file) {
	const month = new Date().toISOString().slice(0, 7)
	let data = {}
	try {
		data = JSON.parse(fs.readFileSync(file, 'utf8'))
	}
	catch {}
	data[month] ||= { usd: 0, runs: 0 }
	const run = { usd: 0, calls: [] }

	return {
		month,
		get spent() {
			return data[month].usd
		},
		get runUsd() {
			return run.usd
		},
		record(stage, model, usd) {
			run.usd += usd
			data[month].usd += usd
			run.calls.push({ stage, model, usd: Number(usd.toFixed(4)) })
		},
		save(label) {
			data[month].usd = Number(data[month].usd.toFixed(4))
			data[month].runs += 1
			data[month].last = { label, date: new Date().toISOString(), usd: Number(run.usd.toFixed(4)), calls: run.calls }
			fs.mkdirSync(path.dirname(file), { recursive: true })
			fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
		},
	}
}

const RETRYABLE = new Set([429, 500, 502, 503, 504])

async function callOnce({ apiKey, model, system, prompt, parts, json, search, image, timeoutMs }) {
	const body = {
		contents: [{ role: 'user', parts: parts || [{ text: prompt }] }],
		generationConfig: {},
	}
	if (system)
		body.system_instruction = { parts: [{ text: system }] }
	if (json)
		body.generationConfig.responseMimeType = 'application/json'
	if (search)
		body.tools = [{ google_search: {} }]
	if (image) {
		body.generationConfig.responseModalities = ['IMAGE']
		body.generationConfig.imageConfig = image
	}

	const response = await fetch(`${API}/${model}:generateContent`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
		body: JSON.stringify(body),
		signal: AbortSignal.timeout(timeoutMs),
	})
	if (!response.ok) {
		const err = new Error(`${model} HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`)
		err.status = response.status
		throw err
	}
	return response.json()
}

/**
 * Coba tiap model berurutan (dengan 1 retry untuk error sementara) sampai ada yang berhasil.
 * Mengembalikan { text, imageData, imageMime, model }.
 */
export async function generate(models, { ledger, stage, timeoutMs = 300000, ...options }) {
	let lastError
	for (const model of models) {
		for (let attempt = 1; attempt <= 2; attempt++) {
			try {
				const data = await callOnce({ ...options, model, timeoutMs })
				const candidate = data.candidates?.[0]
				const parts = candidate?.content?.parts || []
				const inline = parts.find(p => p.inlineData)?.inlineData
				const imageData = inline?.data
				const text = parts.filter(p => p.text && !p.thought).map(p => p.text).join('').trim()

				const usd = estimateCost(model, data.usageMetadata, imageData ? 1 : 0)
				ledger?.record(stage, model, usd)
				console.log(`[AI] ${stage} · ${model} · $${usd.toFixed(4)}`)

				if (!text && !imageData)
					throw new Error(`${model} returned no content (finishReason: ${candidate?.finishReason})`)
				return { text, imageData, imageMime: inline?.mimeType, model }
			}
			catch (err) {
				lastError = err
				console.warn(`[AI] ${stage} · ${model} attempt ${attempt} failed: ${err.message}`)
				if (!RETRYABLE.has(err.status) || attempt === 2)
					break
				await new Promise(r => setTimeout(r, 5000 * attempt))
			}
		}
	}
	throw lastError || new Error(`${stage}: all models failed`)
}

export function parseJson(text) {
	const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '')
	return JSON.parse(cleaned)
}
