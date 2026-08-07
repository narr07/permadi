Bisa! Data analitik pengunjung website Cloudflare Anda bisa ditampilkan di website Nuxt menggunakan **GraphQL Analytics API**. Berikut cara kerjanya:

## Konsep Singkat

Cloudflare menyediakan [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/) yang bisa Anda panggil dari backend Nuxt (server route / API route) untuk mengambil data seperti jumlah request, bandwidth, status code, dll. Data ini lalu ditampilkan di frontend Nuxt Anda.

## Langkah-langkah

**1. Buat API Token dengan permission Analytics**
- Buka dashboard → **My Profile** → **API Tokens** → Create Token
- Pilih permission: **Account → Account Analytics → Read** dan/atau **Zone → Analytics → Read**
- Simpan token dengan aman (jangan diekspos ke client/browser)

**2. Buat server route di Nuxt** (mis. `server/api/analytics.ts`) agar token tidak bocor:

```ts
export default defineEventHandler(async () => {
  const token = process.env.CF_ANALYTICS_TOKEN
  const zoneTag = process.env.CF_ZONE_ID

  const query = `
    query {
      viewer {
        zones(filter: { zoneTag: "${zoneTag}" }) {
          httpRequests1dGroups(
            filter: { date_geq: "2026-08-01", date_leq: "2026-08-07" }
            limit: 10
            orderBy: [date_ASC]
          ) {
            dimensions { date }
            sum { requests pageViews }
            uniq { uniques }
          }
        }
      }
    }`

  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  })
  return await res.json()
})
```

**3. Tampilkan di komponen Nuxt:**

```vue
<script setup>
const { data } = await useFetch('/api/analytics')
</script>

<template>
  <div>
    <div v-for="d in data?.data?.viewer?.zones?.[0]?.httpRequests1dGroups">
      {{ d.dimensions.date }} — {{ d.sum.requests }} requests
    </div>
  </div>
</template>
```

## Penting

- **Jangan pernah menaruh API token di sisi client** — selalu lewat server route Nuxt.
- Endpoint GraphQL: `https://api.cloudflare.com/client/v4/graphql`
- Dataset umum untuk traffic website: `httpRequests1dGroups` (harian) atau `httpRequestsAdaptiveGroups` (per-request).
- Anda butuh **Zone ID** domain yang ingin dianalisis (bisa dilihat di dashboard domain Anda).

## Referensi
- [GraphQL Analytics API — Getting Started](https://developers.cloudflare.com/analytics/graphql-api/getting-started/)
- [Authentication for GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/getting-started/authentication/api-token-auth/)
- [Zone Analytics docs](https://developers.cloudflare.com/analytics/account-and-zone-analytics/zone-analytics/)



Bisa! Cloudflare GraphQL Analytics API mendukung agregasi per **hari**, dan untuk **bulanan/tahunan** Anda cukup query range tanggal yang sesuai lalu jumlahkan (`sum`). Berikut contohnya:

## Dataset yang dipakai
- `httpRequests1dGroups` — data agregasi **per hari** (paling umum dipakai)

Untuk total bulanan/tahunan, tidak ada dataset terpisah — Anda query range 1 bulan / 1 tahun lalu jumlahkan hasilnya di backend Nuxt.

## Contoh Query

### 1. Pengunjung Harian (per hari)
```graphql
query {
  viewer {
    zones(filter: { zoneTag: "ZONE_ID" }) {
      httpRequests1dGroups(
        filter: { date_geq: "2026-08-01", date_leq: "2026-08-07" }
        limit: 31
        orderBy: [date_ASC]
      ) {
        dimensions { date }
        sum { requests pageViews }
        uniq { uniques }
      }
    }
  }
}
```
→ `uniq.uniques` = jumlah pengunjung unik per hari

### 2. Total Bulanan (agustus 2026)
```graphql
query {
  viewer {
    zones(filter: { zoneTag: "ZONE_ID" }) {
      httpRequests1dGroups(
        filter: { date_geq: "2026-08-01", date_leq: "2026-08-31" }
        limit: 31
      ) {
        sum { requests pageViews }
        uniq { uniques }
      }
    }
  }
}
```
→ Jumlahkan semua `sum.requests` dan `uniq.uniques` di backend untuk total bulan itu.

### 3. Total Tahunan (2026)
```graphql
query {
  viewer {
    zones(filter: { zoneTag: "ZONE_ID" }) {
      httpRequests1dGroups(
        filter: { date_geq: "2026-01-01", date_leq: "2026-12-31" }
        limit: 365
      ) {
        sum { requests pageViews }
        uniq { uniques }
      }
    }
  }
}
```
→ Jumlahkan semua untuk total setahun.

## Contoh Server Route Nuxt (`server/api/visitors.ts`)

```ts
export default defineEventHandler(async () => {
  const token = process.env.CF_ANALYTICS_TOKEN
  const zoneTag = process.env.CF_ZONE_ID

  const query = `
    query {
      viewer {
        zones(filter: { zoneTag: "${zoneTag}" }) {
          httpRequests1dGroups(
            filter: { date_geq: "2026-01-01", date_leq: "2026-12-31" }
            limit: 365
            orderBy: [date_ASC]
          ) {
            dimensions { date }
            sum { requests pageViews }
            uniq { uniques }
          }
        }
      }
    }`

  const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  })

  const json = await res.json()
  const groups = json.data.viewer.zones[0].httpRequests1dGroups

  // Hitung total harian, bulanan, tahunan
  const daily = groups.map(g => ({
    date: g.dimensions.date,
    visitors: g.uniq.uniques,
    requests: g.sum.requests
  }))

  const yearlyTotal = groups.reduce((acc, g) => acc + g.uniq.uniques, 0)

  // Total per bulan
  const monthly = {}
  for (const g of groups) {
    const month = g.dimensions.date.slice(0, 7) // "2026-08"
    monthly[month] = (monthly[month] || 0) + g.uniq.uniques
  }

  return { daily, monthly, yearlyTotal }
})
```

## Ringkasan
| Periode | Cara |
|---------|------|
| Harian | Group by `date` → tampilkan langsung |
| Bulanan | Query range 1 bulan → jumlahkan |
| Tahunan | Query range 1 tahun → jumlahkan |

## Catatan
- `uniq.uniques` = **pengunjung unik** (visitor), `sum.requests` = total request, `sum.pageViews` = total page view
- Data maksimal **~30 hari** untuk `httpRequestsAdaptiveGroups`, tapi `httpRequests1dGroups` menyimpan data **hingga 1 tahun+**
- Rate limit GraphQL: ~300 request/menit per token



Bisa banget! Karena Anda sudah pakai D1 + Nuxt, arsitektur terbaiknya:

> **Cron Trigger Worker** (jalan otomatis tiap hari) → ambil data dari GraphQL Analytics API → simpan ke D1 → Nuxt baca dari D1 untuk ditampilkan.

## Arsitektur

```
[Cron Trigger tiap jam 00:00]
        ↓
[Worker fetch GraphQL Analytics API]
        ↓
[INSERT ke D1: visitors_daily]
        ↓
[Nuxt baca dari D1 → tampilkan di frontend]
```

## 1. Buat Tabel di D1

Jalankan SQL ini di D1 Anda (via wrangler atau dashboard):

```sql
-- Tabel harian
CREATE TABLE IF NOT EXISTS visitors_daily (
  date TEXT PRIMARY KEY,       -- "2026-08-07"
  visitors INTEGER DEFAULT 0,  -- uniq.uniques
  requests INTEGER DEFAULT 0,  -- sum.requests
  page_views INTEGER DEFAULT 0 -- sum.pageViews
);

-- Tabel mingguan (opsional, bisa juga di-query dari daily)
CREATE TABLE IF NOT EXISTS visitors_weekly (
  week_start TEXT PRIMARY KEY,  -- "2026-08-04"
  week_end TEXT,
  visitors INTEGER DEFAULT 0,
  requests INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0
);

-- Tabel bulanan
CREATE TABLE IF NOT EXISTS visitors_monthly (
  month TEXT PRIMARY KEY,       -- "2026-08"
  visitors INTEGER DEFAULT 0,
  requests INTEGER DEFAULT 0,
  page_views INTEGER DEFAULT 0
);
```

## 2. Worker dengan Cron Trigger (`wrangler.toml`)

```toml
name = "analytics-collector"
main = "src/index.ts"
compatibility_date = "2026-08-07"

[triggers]
crons = [ "0 0 * * *" ] # Tiap hari jam 00:00 UTC

[[d1_databases]]
binding = "DB"
database_name = "nama-db-anda"
database_id = "id-db-anda"
```

## 3. Worker Code (`src/index.ts`)

```ts
export default {
  async scheduled(event, env) {
    const token = env.CF_ANALYTICS_TOKEN // simpan sebagai secret
    const zoneTag = env.CF_ZONE_ID

    // Ambil data kemarin
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const dateStr = yesterday.toISOString().slice(0, 10)

    const query = `
      query {
        viewer {
          zones(filter: { zoneTag: "${zoneTag}" }) {
            httpRequests1dGroups(
              filter: { date_geq: "${dateStr}", date_leq: "${dateStr}" }
              limit: 1
            ) {
              sum { requests pageViews }
              uniq { uniques }
            }
          }
        }
      }`

    const res = await fetch('https://api.cloudflare.com/client/v4/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    })

    const json = await res.json()
    const data = json.data.viewer.zones[0].httpRequests1dGroups[0]

    if (!data)
      return

    // 1. Simpan ke visitors_daily
    await env.DB.prepare(
      `INSERT OR REPLACE INTO visitors_daily (date, visitors, requests, page_views)
       VALUES (?, ?, ?, ?)`
    ).bind(
      dateStr,
      data.uniq.uniques,
      data.sum.requests,
      data.sum.pageViews
    ).run()

    // 2. Update visitors_monthly
    const month = dateStr.slice(0, 7) // "2026-08"
    await env.DB.prepare(
      `INSERT INTO visitors_monthly (month, visitors, requests, page_views)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(month) DO UPDATE SET
         visitors = visitors + excluded.visitors,
         requests = requests + excluded.requests,
         page_views = page_views + excluded.page_views`
    ).bind(month, data.uniq.uniques, data.sum.requests, data.sum.pageViews).run()

    // 3. Update visitors_weekly (minggu Senin-Minggu)
    const day = new Date(dateStr)
    const dayOfWeek = (day.getDay() + 6) % 7 // Senin=0
    const weekStart = new Date(day)
    weekStart.setDate(day.getDate() - dayOfWeek)
    const weekStartStr = weekStart.toISOString().slice(0, 10)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    const weekEndStr = weekEnd.toISOString().slice(0, 10)

    await env.DB.prepare(
      `INSERT INTO visitors_weekly (week_start, week_end, visitors, requests, page_views)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(week_start) DO UPDATE SET
         visitors = visitors + excluded.visitors,
         requests = requests + excluded.requests,
         page_views = page_views + excluded.page_views`
    ).bind(weekStartStr, weekEndStr, data.uniq.uniques, data.sum.requests, data.sum.pageViews).run()
  }
}
```

## 4. Nuxt Server Route (`server/api/stats.ts`)

Baca dari D1 (cepat, tidak perlu panggil GraphQL setiap request):

```ts
export default defineEventHandler(async (event) => {
  const db = event.context.cloudflare.env.DB

  // Harian (30 hari terakhir)
  const daily = await db.prepare(
    `SELECT * FROM visitors_daily ORDER BY date DESC LIMIT 30`
  ).all()

  // Bulanan (12 bulan terakhir)
  const monthly = await db.prepare(
    `SELECT * FROM visitors_monthly ORDER BY month DESC LIMIT 12`
  ).all()

  // Mingguan (12 minggu terakhir)
  const weekly = await db.prepare(
    `SELECT * FROM visitors_weekly ORDER BY week_start DESC LIMIT 12`
  ).all()

  // Total tahunan
  const yearly = await db.prepare(
    `SELECT substr(date,1,4) as year, SUM(visitors) as visitors, SUM(requests) as requests, SUM(page_views) as page_views
     FROM visitors_daily GROUP BY year ORDER BY year DESC`
  ).all()

  return { daily: daily.results, monthly: monthly.results, weekly: weekly.results, yearly: yearly.results }
})
```

## 5. Nuxt Component (frontend)

```vue
<script setup>
const { data } = await useFetch('/api/stats')
</script>

<template>
  <div>
    <h2>📊 Statistik Pengunjung</h2>

    <h3>Harian</h3>
    <div v-for="d in data?.daily" :key="d.date">
      {{ d.date }} — 👥 {{ d.visitors }} | 🔁 {{ d.requests }} | 👀 {{ d.page_views }}
    </div>

    <h3>Mingguan</h3>
    <div v-for="w in data?.weekly" :key="w.week_start">
      {{ w.week_start }} → {{ w.week_end }} — 👥 {{ w.visitors }}
    </div>

    <h3>Bulanan</h3>
    <div v-for="m in data?.monthly" :key="m.month">
      {{ m.month }} — 👥 {{ m.visitors }}
    </div>

    <h3>Tahunan</h3>
    <div v-for="y in data?.yearly" :key="y.year">
      {{ y.year }} — 👥 {{ y.visitors }}
    </div>
  </div>
</template>
```

## Ringkasan

| Periode | Cara Simpan | Cara Baca di Nuxt |
|---------|-------------|-------------------|
| Harian | Cron insert tiap hari ke `visitors_daily` | `SELECT * FROM visitors_daily` |
| Mingguan | Cron update `visitors_weekly` (akumulasi) | `SELECT * FROM visitors_weekly` |
| Bulanan | Cron update `visitors_monthly` (akumulasi) | `SELECT * FROM visitors_monthly` |
| Tahunan | Query dari `visitors_daily` (GROUP BY tahun) | `SELECT substr(date,1,4)...` |

## Keuntungan simpan di D1
- **Cepat** — Nuxt baca dari D1, tidak perlu panggil GraphQL setiap request
- **Hemat API quota** — GraphQL cuma dipanggil 1x per hari oleh cron
- **Riwayat permanen** — data tersimpan selamanya, GraphQL Analytics API hanya simpan ~1 tahun
- **Bisa di-query fleksibel** — filter, sort, agregasi via SQL

## Setup Secret
```bash
npx wrangler secret put CF_ANALYTICS_TOKEN
npx wrangler secret put CF_ZONE_ID
```

Referensi:
- [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/)
- [D1 Worker API](https://developers.cloudflare.com/d1/worker-api/d1-database/)
- [GraphQL Analytics API](https://developers.cloudflare.com/analytics/graphql-api/getting-started/)

Mau saya bantu buatkan repo lengkap dengan kode di atas (Worker + Nuxt), atau cek D1 database apa saja yang sudah Anda punya di akun ini?
