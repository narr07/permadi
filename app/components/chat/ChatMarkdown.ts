import type { ElementNode } from 'comark'
import { defineMarkdownComponent } from '@comark/vue'
import rangi from 'comark/plugins/rangi'
import security from 'comark/plugins/security'
import ChatProseA from './prose/ChatProseA.vue'
import ChatProsePre from './prose/ChatProsePre.vue'
import ChatProseTable from './prose/ChatProseTable.vue'

// Renderer jawaban AI, mengikuti AgentComark di nuxt.com: teks model tidak dipercaya,
// jadi hanya tag markdown biasa yang dirender, sisanya dibuka jadi teks atau dibuang.
const allowedTags = [
	'p',
	'br',
	'hr',
	'span',
	'a',
	'strong',
	'em',
	'b',
	'i',
	'u',
	's',
	'del',
	'mark',
	'small',
	'sub',
	'sup',
	'kbd',
	'h1',
	'h2',
	'h3',
	'h4',
	'h5',
	'h6',
	'blockquote',
	'ul',
	'ol',
	'li',
	'code',
	'pre',
	'table',
	'thead',
	'tbody',
	'tr',
	'th',
	'td',
]

const droppedTags = new Set(['script', 'style', 'iframe', 'frame', 'object', 'embed', 'template', 'textarea', 'title', 'noscript', 'svg', 'math', 'img'])

function unwrapTag([tag, , ...children]: ElementNode): false | ElementNode {
	return droppedTags.has(tag.toLowerCase()) ? false : ['span', {}, ...children]
}

export default defineMarkdownComponent({
	name: 'ChatMarkdown',
	plugins: [
		rangi(),
		security({
			allowedTags,
			allowedProtocols: ['http', 'https', 'mailto'],
			allowDataImages: false,
			tagFallback: unwrapTag,
		}),
	],
	components: {
		a: ChatProseA,
		pre: ChatProsePre,
		table: ChatProseTable,
	},
})
