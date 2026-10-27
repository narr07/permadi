import fs from 'node:fs'
import path from 'node:path'

export function syncBlogSlugs(rootDir = process.cwd()) {
	const enDir = path.join(rootDir, 'content/en/blog')
	const idDir = path.join(rootDir, 'content/id/blog')

	if (!fs.existsSync(enDir) || !fs.existsSync(idDir))
		return

	const enFiles = fs.readdirSync(enDir)
	const idFiles = fs.readdirSync(idDir)

	const enMap = new Map()
	for (const f of enFiles) {
		const m = f.match(/^(\d+)\.(.+)\.md$/)
		if (m)
			enMap.set(Number(m[1]), m[2])
	}

	const idMap = new Map()
	for (const f of idFiles) {
		const m = f.match(/^(\d+)\.(.+)\.md$/)
		if (m)
			idMap.set(Number(m[1]), m[2])
	}

	const pairs = []
	const allIds = Array.from(new Set([...enMap.keys(), ...idMap.keys()])).sort((a, b) => a - b)
	for (const id of allIds) {
		const en = enMap.get(id)
		const idSlug = idMap.get(id)
		if (en && idSlug) {
			pairs.push({ id, en, idSlug })
		}
	}

	const fileContent = `// AUTO-GENERATED from content/en/blog and content/id/blog
// DO NOT EDIT MANUALLY - Automatically synced during build/dev
export interface BlogSlugPair {
	id: number
	en: string
	idSlug: string
}

export const BLOG_SLUG_PAIRS: BlogSlugPair[] = ${JSON.stringify(pairs, null, '\t')}

const enToIdMap = new Map<string, string>()
const idToEnMap = new Map<string, string>()

for (const p of BLOG_SLUG_PAIRS) {
	enToIdMap.set(p.en, p.idSlug)
	idToEnMap.set(p.idSlug, p.en)
}

export function getIdBlogSlug(enSlug: string): string | undefined {
	return enToIdMap.get(enSlug)
}

export function getEnBlogSlug(idSlug: string): string | undefined {
	return idToEnMap.get(idSlug)
}

export function isEnBlogSlug(slug: string): boolean {
	return enToIdMap.has(slug)
}

export function isIdBlogSlug(slug: string): boolean {
	return idToEnMap.has(slug)
}
`

	const targetPath = path.join(rootDir, 'shared/utils/blog-slugs.ts')
	fs.writeFileSync(targetPath, fileContent, 'utf8')
}

// Execute directly if run as CLI
if (import.meta.url === `file://${process.argv[1]}`.replace(/\\/g, '/')) {
	syncBlogSlugs()
	console.log('Blog slugs synchronized successfully.')
}

