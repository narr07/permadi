import type { H3Event } from 'h3'

interface FeedItem {
	title: string
	link: string
	description: string
	date: Date
	category?: string
	locale: string
}

function escapeXml(unsafe: string): string {
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case '<': return '&lt;'
			case '>': return '&gt;'
			case '&': return '&amp;'
			case '\'': return '&apos;'
			case '"': return '&quot;'
			default: return c
		}
	})
}

async function getFeedArticles(event: H3Event): Promise<FeedItem[]> {
	const domain = 'https://permadi.dev'
	let items: FeedItem[] = []

	try {
		const [idPosts, enPosts] = await Promise.all([
			(queryCollection(event, 'blog_id') as any).order('date', 'DESC').all(),
			(queryCollection(event, 'blog_en') as any).order('date', 'DESC').all(),
		])

		const rawList = [
			...idPosts.map((p: any) => ({ ...p, _locale: 'id' })),
			...enPosts.map((p: any) => ({ ...p, _locale: 'en' })),
		]

		rawList.sort((a, b) => new Date(b.date || '2025-01-01').getTime() - new Date(a.date || '2025-01-01').getTime())

		items = rawList.map((post: any) => ({
			title: post.title || 'Untitled',
			link: `${domain}/${post._locale}/blog/${post.slug}`,
			description: post.description || '',
			date: post.date ? new Date(post.date) : new Date(),
			category: post.category,
			locale: post._locale,
		}))
	}
	catch (err) {
		console.error('Error querying articles for feed:', err)
	}

	return items
}

/**
 * 1. RSS 2.0 Generator (100% Pure Native String)
 */
export async function generateRssFeed(event: H3Event): Promise<string> {
	const domain = 'https://permadi.dev'
	const articles = await getFeedArticles(event)
	const buildDate = new Date().toUTCString()

	const itemsXml = articles.map(item => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <description><![CDATA[${item.description}]]></description>
      ${item.category ? `<category>${escapeXml(item.category)}</category>` : ''}
    </item>`).join('\n')

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Permadi — Blog &amp; Articles</title>
    <link>${domain}</link>
    <description>Catatan teknis, arsitektur web modern, tipografi Golden Ratio, dan artikel portofolio oleh Permadi.</description>
    <language>id</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${domain}/feed.xml" rel="self" type="application/rss+xml"/>
${itemsXml}
  </channel>
</rss>`
}

/**
 * 2. ATOM 1.0 Generator (100% Pure Native String)
 */
export async function generateAtomFeed(event: H3Event): Promise<string> {
	const domain = 'https://permadi.dev'
	const articles = await getFeedArticles(event)
	const updatedDate = new Date().toISOString()

	const entriesXml = articles.map(item => `  <entry>
    <title>${escapeXml(item.title)}</title>
    <link href="${item.link}"/>
    <id>${item.link}</id>
    <updated>${item.date.toISOString()}</updated>
    <summary><![CDATA[${item.description}]]></summary>
    <author>
      <name>Dinar Permadi Yusup</name>
      <email>dinar@permadi.dev</email>
    </author>
    ${item.category ? `<category term="${escapeXml(item.category)}"/>` : ''}
  </entry>`).join('\n')

	return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Permadi — Blog &amp; Articles</title>
  <subtitle>Catatan teknis, arsitektur web modern, tipografi Golden Ratio, dan artikel portofolio oleh Permadi.</subtitle>
  <link href="${domain}/feed.atom" rel="self"/>
  <link href="${domain}"/>
  <updated>${updatedDate}</updated>
  <id>${domain}/</id>
  <author>
    <name>Dinar Permadi Yusup</name>
    <email>dinar@permadi.dev</email>
  </author>
${entriesXml}
</feed>`
}

/**
 * 3. JSON Feed 1.1 Generator (100% Pure Native JSON)
 */
export async function generateJsonFeed(event: H3Event) {
	const domain = 'https://permadi.dev'
	const articles = await getFeedArticles(event)

	return {
		version: 'https://jsonfeed.org/version/1.1',
		title: 'Permadi — Blog & Articles',
		home_page_url: domain,
		feed_url: `${domain}/feed.json`,
		description: 'Catatan teknis, arsitektur web modern, tipografi Golden Ratio, dan artikel portofolio oleh Permadi.',
		authors: [
			{
				name: 'Dinar Permadi Yusup',
				url: domain,
			},
		],
		items: articles.map(item => ({
			id: item.link,
			url: item.link,
			title: item.title,
			summary: item.description,
			date_published: item.date.toISOString(),
			tags: item.category ? [item.category] : undefined,
		})),
	}
}
