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

