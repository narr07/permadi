/**
 * Istilah pencarian yang sedang naik di suatu negara, dari dataset publik Google Trends di BigQuery
 * (bigquery-public-data.google_trends). Query dibatasi beberapa hari partisi terakhir agar tetap
 * jauh di bawah jatah gratis BigQuery 1 TB/bulan.
 */

import { getAccessToken } from './google-auth.mjs'

const SCOPE = 'https://www.googleapis.com/auth/bigquery'
const TABLE = '`bigquery-public-data.google_trends.international_top_rising_terms`'

/**
 * @returns {Promise<Array<{ term: string, percentGain: number, bestRank: number, regions: number }>>} Rising terms, most widespread first
 */
export async function fetchRisingTerms(account, { country = 'ID', limit = 60 } = {}) {
	const token = await getAccessToken(account, [SCOPE])
	const query = `
WITH recent AS (
  SELECT term, percent_gain, rank, week, refresh_date, region_code
  FROM ${TABLE}
  WHERE refresh_date >= DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY)
    AND country_code = @country
)
SELECT term, MAX(percent_gain) AS percent_gain, MIN(rank) AS best_rank, COUNT(DISTINCT region_code) AS regions
FROM recent
WHERE refresh_date = (SELECT MAX(refresh_date) FROM recent)
  AND week = (SELECT MAX(week) FROM recent)
GROUP BY term
ORDER BY regions DESC, best_rank
LIMIT @limit`

	const response = await fetch(`https://bigquery.googleapis.com/bigquery/v2/projects/${account.project_id}/queries`, {
		method: 'POST',
		headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({
			query,
			useLegacySql: false,
			timeoutMs: 60000,
			// Pengaman biaya: tolak query yang memindai lebih dari 20 GB
			maximumBytesBilled: String(20 * 1024 ** 3),
			parameterMode: 'NAMED',
			queryParameters: [
				{ name: 'country', parameterType: { type: 'STRING' }, parameterValue: { value: country } },
				{ name: 'limit', parameterType: { type: 'INT64' }, parameterValue: { value: String(limit) } },
			],
		}),
	})
	if (!response.ok)
		throw new Error(`BigQuery HTTP ${response.status}: ${(await response.text()).slice(0, 300)}`)
	const data = await response.json()
	if (!data.jobComplete)
		throw new Error('BigQuery job did not finish within 60s')

	const gb = Number(data.totalBytesProcessed || 0) / 1024 ** 3
	console.log(`[Trends] BigQuery scanned ${gb.toFixed(2)} GB, ${data.rows?.length || 0} rising terms (${country})`)
	return (data.rows || []).map(({ f }) => ({
		term: f[0].v,
		percentGain: Number(f[1].v),
		bestRank: Number(f[2].v),
		regions: Number(f[3].v),
	}))
}
