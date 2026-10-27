import { defineNitroPlugin } from 'nitropack/runtime'
import { getEnBlogSlug, getIdBlogSlug, isEnBlogSlug, isIdBlogSlug } from '../../shared/utils/blog-slugs'

export default defineNitroPlugin((nitroApp) => {
	nitroApp.hooks.hook('sitemap:input', (ctx: any) => {
		if (!ctx || !Array.isArray(ctx.urls))
			return

		const isEnSitemap = ctx.sitemapName === 'en-US' || ctx.sitemapName === 'en'
		const isIdSitemap = ctx.sitemapName === 'id-ID' || ctx.sitemapName === 'id'

		const filtered: any[] = []

		for (const rawEntry of ctx.urls) {
			const entry = typeof rawEntry === 'string' ? { loc: rawEntry } : { ...rawEntry }
			const loc = entry.loc || ''
			if (!loc)
				continue

			const pathname = new URL(loc, 'https://permadi.dev').pathname

			// 1. Filter out English blog slugs under /id/blog/
			if (pathname.startsWith('/id/blog/')) {
				const slug = pathname.replace('/id/blog/', '').replace(/\/$/, '')
				if (isEnBlogSlug(slug) && !isIdBlogSlug(slug)) {
					continue
				}
				if (isEnSitemap) {
					continue
				}
			}

			// 2. Filter out Indonesian blog slugs under /blog/
			if (pathname.startsWith('/blog/')) {
				const slug = pathname.replace('/blog/', '').replace(/\/$/, '')
				if (isIdBlogSlug(slug) && !isEnBlogSlug(slug)) {
					continue
				}
				if (isIdSitemap) {
					continue
				}
			}

			// 3. Keep locale separation clean
			if (isIdSitemap && !pathname.startsWith('/id')) {
				continue
			}
			if (isEnSitemap && pathname.startsWith('/id')) {
				continue
			}

			// 4. Attach precise alternatives
			if (pathname.startsWith('/blog/')) {
				const enSlug = pathname.replace('/blog/', '').replace(/\/$/, '')
				const idSlug = getIdBlogSlug(enSlug)
				if (idSlug) {
					entry._sitemap = 'en-US'
					entry.alternatives = [
						{ hreflang: 'en-US', href: `https://permadi.dev/blog/${enSlug}` },
						{ hreflang: 'id-ID', href: `https://permadi.dev/id/blog/${idSlug}` },
						{ hreflang: 'x-default', href: `https://permadi.dev/blog/${enSlug}` },
					]
				}
			}
			else if (pathname.startsWith('/id/blog/')) {
				const idSlug = pathname.replace('/id/blog/', '').replace(/\/$/, '')
				const enSlug = getEnBlogSlug(idSlug)
				if (enSlug) {
					entry._sitemap = 'id-ID'
					entry.alternatives = [
						{ hreflang: 'id-ID', href: `https://permadi.dev/id/blog/${idSlug}` },
						{ hreflang: 'en-US', href: `https://permadi.dev/blog/${enSlug}` },
						{ hreflang: 'x-default', href: `https://permadi.dev/blog/${enSlug}` },
					]
				}
			}
			else if (pathname.startsWith('/projects/')) {
				const projSlug = pathname.replace('/projects/', '').replace(/\/$/, '')
				entry._sitemap = 'en-US'
				entry.alternatives = [
					{ hreflang: 'en-US', href: `https://permadi.dev/projects/${projSlug}` },
					{ hreflang: 'id-ID', href: `https://permadi.dev/id/projek/${projSlug}` },
					{ hreflang: 'x-default', href: `https://permadi.dev/projects/${projSlug}` },
				]
			}
			else if (pathname.startsWith('/id/projek/')) {
				const projSlug = pathname.replace('/id/projek/', '').replace(/\/$/, '')
				entry._sitemap = 'id-ID'
				entry.alternatives = [
					{ hreflang: 'id-ID', href: `https://permadi.dev/id/projek/${projSlug}` },
					{ hreflang: 'en-US', href: `https://permadi.dev/projects/${projSlug}` },
					{ hreflang: 'x-default', href: `https://permadi.dev/projects/${projSlug}` },
				]
			}

			filtered.push(entry)
		}

		ctx.urls = filtered
	})
})

