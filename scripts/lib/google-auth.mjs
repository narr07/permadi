/**
 * Token OAuth untuk service account Google tanpa dependensi tambahan:
 * tanda tangani JWT (RS256) dengan private key, tukar ke oauth2.googleapis.com/token.
 *
 * Kredensial dibaca dari GOOGLE_SERVICE_ACCOUNT_JSON: isi file JSON mentah atau base64-nya
 * (base64 lebih aman disimpan sebagai satu baris di .env dan GitHub Secrets).
 */

import crypto from 'node:crypto'

export function loadServiceAccount() {
	const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON?.trim()
	if (!raw)
		return null
	try {
		const json = raw.startsWith('{') ? raw : Buffer.from(raw, 'base64').toString('utf8')
		const account = JSON.parse(json)
		if (!account.client_email || !account.private_key)
			throw new Error('missing client_email/private_key')
		return account
	}
	catch (err) {
		console.warn(`[Google] GOOGLE_SERVICE_ACCOUNT_JSON is invalid: ${err.message}`)
		return null
	}
}

const base64url = input => Buffer.from(input).toString('base64url')

const tokenCache = new Map()

export async function getAccessToken(account, scopes) {
	const scope = scopes.join(' ')
	const cached = tokenCache.get(scope)
	if (cached && cached.expiresAt > Date.now() + 60_000)
		return cached.token

	const now = Math.floor(Date.now() / 1000)
	const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
	const claims = base64url(JSON.stringify({
		iss: account.client_email,
		scope,
		aud: 'https://oauth2.googleapis.com/token',
		iat: now,
		exp: now + 3600,
	}))
	const signature = crypto.sign('RSA-SHA256', Buffer.from(`${header}.${claims}`), account.private_key).toString('base64url')

	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			assertion: `${header}.${claims}.${signature}`,
		}),
	})
	if (!response.ok)
		throw new Error(`Google token HTTP ${response.status}: ${(await response.text()).slice(0, 200)}`)
	const data = await response.json()
	tokenCache.set(scope, { token: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 })
	return data.access_token
}
