import { defineSitemapEventHandler } from '#imports'

// Helper: generate slug from stem (e.g., "id/projek/1.sdnteja2" → "sdnteja2")
function stemToSlug(stem: string): string {
  const parts = stem.split('/')
  const filename = parts[parts.length - 1] || ''
  return filename.replace(/^\d+\./, '')
}

export default defineSitemapEventHandler(async (e) => {
  const siteUrl = 'https://permadi.dev'
  const locales = ['id', 'en']
  const urls = []

  for (const locale of locales) {
    // Blog posts
    const blogCollection = `${locale}_blog`
    const posts = await queryCollection(e, blogCollection as any)
      .select('path', 'date')
      .all()

    for (const post of posts) {
      urls.push({
        loc: post.path,
        lastmod: (post as any).date || undefined,
        images: [{ loc: `${siteUrl}/__og-image__/static${post.path}/og.png` }],
      })
    }

    // Pages
    const pagesCollection = `${locale}_pages`
    const pages = await queryCollection(e, pagesCollection as any)
      .select('path')
      .all()

    for (const page of pages) {
      urls.push({
        loc: page.path,
      })
    }

    // Projects — data collection, generate URLs from stem
    const projectCollection = `${locale}_project`
    const projects = await queryCollection(e, projectCollection as any)
      .select('stem', 'title')
      .all()

    for (const project of projects) {
      const slug = stemToSlug((project as any).stem)
      // id = /projek/slug, en = /en/project/slug
      const loc = locale === 'id' ? `/projek/${slug}` : `/en/project/${slug}`
      urls.push({
        loc,
        images: [{ loc: `${siteUrl}/__og-image__/static${loc}/og.png` }],
      })
    }
  }

  return urls
})
