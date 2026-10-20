#!/usr/bin/env node
/**
 * Writes every `i-vscode-icons-*` icon referenced in app/ and content/ to public/icons/vscode/<name>.svg.
 *
 * These multi-colour file-type icons only appear in code blocks, so they are served as cached <img>
 * files (see FileTypeIcon.vue) instead of living in the global UnoCSS bundle, where they cost ~50 KB
 * of render-blocking CSS on every page. uno.config.ts blocklists the class names.
 *
 * Run after adding a new file type to the icon maps:  node scripts/generate-vscode-icons.mjs
 */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { getIconData, iconToHTML, iconToSVG, replaceIDs } from '@iconify/utils'

const root = resolve(import.meta.dirname, '..')
const outDir = join(root, 'public/icons/vscode')
const ICON_RE = /i-vscode-icons-([a-z0-9]+(?:-[a-z0-9]+)*)/g

function walk(dir, exts, files = []) {
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const path = join(dir, entry.name)
		if (entry.isDirectory())
			walk(path, exts, files)
		else if (exts.some(ext => entry.name.endsWith(ext)))
			files.push(path)
	}
	return files
}

const names = new Set()
const sources = [
	...walk(join(root, 'app'), ['.vue', '.ts']),
	...walk(join(root, 'content'), ['.md', '.yml', '.yaml', '.json']),
]
for (const file of sources) {
	for (const [, name] of readFileSync(file, 'utf8').matchAll(ICON_RE))
		names.add(name)
}

const collection = JSON.parse(readFileSync(join(root, 'node_modules/@iconify-json/vscode-icons/icons.json'), 'utf8'))

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

const missing = []
for (const name of [...names].sort()) {
	const data = getIconData(collection, name)
	if (!data) {
		missing.push(name)
		continue
	}
	const { attributes, body } = iconToSVG(data)
	// Unique gradient/clip ids per file so two icons never clash if inlined together later
	const svg = iconToHTML(replaceIDs(body, `${name}-`), attributes)
	writeFileSync(join(outDir, `${name}.svg`), `${svg}\n`)
}

console.log(`[vscode-icons] wrote ${names.size - missing.length} icons to public/icons/vscode`)
if (missing.length) {
	console.error(`[vscode-icons] unknown icon names: ${missing.join(', ')}`)
	process.exitCode = 1
}
