// server/api/search.get.ts
// Pencarian blog dijalankan di SERVER (nitro), bukan di browser.
// Sebelumnya queryCollectionSearchSections() dipanggil client-side, yang
// memaksa browser mengunduh sqlite3.wasm (386 KiB) + sql_dump.txt (24 KiB).
// Memindahkannya ke server menghilangkan beban itu dari jalur kritis.
export default eventHandler(async (event) => {
  const query = getQuery(event)
  const locale = query.locale === 'en' ? 'en' : 'id'
  const part = query.part === 'navigation' || query.part === 'files' ? query.part : 'all'
  const collection = `${locale}_blog` as any

  // Cache di edge (Cloudflare): konten blog jarang berubah.
  // max-age untuk browser, s-maxage untuk CDN, stale-while-revalidate untuk refresh background.
  setHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400')

  if (part === 'navigation') {
    const navigation = await queryCollectionNavigation(event, collection, ['title', 'description'])
    return { navigation }
  }

  if (part === 'files') {
    const files = await queryCollectionSearchSections(event, collection)
    return { files }
  }

  const [navigation, files] = await Promise.all([
    queryCollectionNavigation(event, collection, ['title', 'description']),
    queryCollectionSearchSections(event, collection),
  ])
  return { navigation, files }
})
