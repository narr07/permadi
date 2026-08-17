<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'

interface FaqItem {
	q: string
	a: string
	icon?: string
}

const props = withDefaults(
	defineProps<{
		title?: string
		description?: string
		items?: FaqItem[]
		single?: boolean
		class?: any
	}>(),
	{
		title: undefined,
		description: undefined,
		items: () => [],
		single: false,
		class: undefined,
	},
)

const slots = useSlots()
const activeIndexes = ref<Set<number>>(new Set())

// Parsing slot Markdown jika FAQ ditulis sebagai heading/bold di dalam slot
function extractSlotItems(): FaqItem[] {
	if (props.items && props.items.length > 0) {
		return props.items.map((item: any) => ({
			q: item.q || item.question || item.title || '',
			a: item.a || item.answer || item.description || item.content || '',
			icon: item.icon,
		}))
	}

	const defaultSlot = slots.default?.() || []
	const parsedItems: FaqItem[] = []

	let currentQuestion = ''
	let currentAnswer = ''

	function walk(nodes: any) {
		if (!nodes)
			return
		const list = Array.isArray(nodes) ? nodes : [nodes]

		for (const node of list) {
			if (typeof node === 'string') {
				continue
			}

			// Cek apakah node adalah tag heading (h2, h3, h4, h5) atau bold paragraph pertanyaan
			const tag = typeof node.type === 'string' ? node.type : (node.tag || node.props?.tag)
			const isHeading = ['h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
			const isStrong = tag === 'strong' || (node.props && node.props.class?.includes('font-bold'))

			if (isHeading || isStrong || node.props?.label || node.props?.q || node.props?.question) {
				if (currentQuestion && currentAnswer) {
					parsedItems.push({
						q: currentQuestion.trim(),
						a: currentAnswer.trim(),
					})
					currentAnswer = ''
				}
				currentQuestion = node.props?.label || node.props?.q || node.props?.question || getText(node)
			}
			else {
				const text = getText(node)
				if (currentQuestion) {
					currentAnswer += (currentAnswer ? '\n\n' : '') + text
				}
				else if (node.children) {
					walk(node.children)
				}
			}
		}
	}

	walk(defaultSlot)

	if (currentQuestion && currentAnswer) {
		parsedItems.push({
			q: currentQuestion.trim(),
			a: currentAnswer.trim(),
		})
	}

	return parsedItems
}

function getText(vnode: any): string {
	if (!vnode)
		return ''
	if (typeof vnode === 'string')
		return vnode
	if (typeof vnode.children === 'string')
		return vnode.children
	if (Array.isArray(vnode.children)) {
		return vnode.children.map(getText).join(' ')
	}
	return ''
}

const resolvedFaqItems = computed<FaqItem[]>(() => {
	if (props.items && props.items.length > 0) {
		return props.items.map((item: any) => ({
			q: item.q || item.question || item.title || '',
			a: item.a || item.answer || item.description || '',
			icon: item.icon,
		}))
	}
	return extractSlotItems()
})

function toggleFaq(index: number) {
	if (props.single) {
		if (activeIndexes.value.has(index)) {
			activeIndexes.value.clear()
		}
		else {
			activeIndexes.value.clear()
			activeIndexes.value.add(index)
		}
	}
	else {
		if (activeIndexes.value.has(index)) {
			activeIndexes.value.delete(index)
		}
		else {
			activeIndexes.value.add(index)
		}
	}
}

// Injeksi otomatis Schema.org FAQPage untuk SEO Google Rich Snippet
useSchemaOrg([
	defineWebPage({
		'@type': 'FAQPage',
		'mainEntity': computed(() => {
			return resolvedFaqItems.value.map(item => ({
				'@type': 'Question',
				'name': item.q.replace(/^\d+\.\s*/, ''),
				'acceptedAnswer': {
					'@type': 'Answer',
					'text': item.a,
				},
			}))
		}),
	}),
])
</script>

<template>
	<section
		class="my-10 overflow-hidden border border-[#115e4f]/25 rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md transition-all duration-300 dark:border-[#134e43]/60 dark:bg-[#001c19]/70 sm:p-7"
		:class="props.class"
	>
		<!-- FAQ Section Header -->
		<div class="mb-6 flex items-start justify-between gap-4 border-b border-[#115e4f]/15 pb-5 dark:border-[#134e43]/40">
			<div class="flex items-center gap-3.5">
				<div class="h-10 w-10 flex shrink-0 items-center justify-center border border-brand-500/30 rounded-2xl bg-brand-500/10 text-brand-600 dark:border-brand-500/25 dark:bg-brand-500/15 dark:text-brand-400">
					<span class="i-hugeicons-help-circle text-xl" />
				</div>
				<div>
					<h3 class="text-lg text-slate-900 font-bold tracking-tight font-heading sm:text-xl dark:text-slate-100">
						{{ props.title || 'Frequently Asked Questions' }}
					</h3>
					<p
						v-if="props.description"
						class="mt-1 text-xs text-slate-500 font-sans sm:text-sm dark:text-slate-400"
					>
						{{ props.description }}
					</p>
				</div>
			</div>

			<span class="border border-brand-500/20 rounded-full bg-brand-500/10 px-2.5 py-1 text-[11px] text-brand-700 font-semibold tracking-wider font-mono dark:text-brand-300">
				{{ resolvedFaqItems.length }} Q&A
			</span>
		</div>

		<!-- Accordion Items List -->
		<div class="flex flex-col gap-3">
			<div
				v-for="(item, idx) in resolvedFaqItems"
				:key="idx"
				class="shadow-2xs overflow-hidden border border-[#115e4f]/20 rounded-2xl bg-white/90 transition-all duration-300 dark:border-[#134e43]/50 dark:bg-[#001412]/80"
				:class="[
					activeIndexes.has(idx)
						? 'ring-1 ring-brand-500/40 dark:ring-brand-400/30 shadow-xs'
						: 'hover:border-brand-500/35 dark:hover:border-brand-400/30',
				]"
			>
				<button
					type="button"
					class="w-full flex cursor-pointer items-center justify-between gap-4 px-4.5 py-3.5 text-left transition-colors hover:bg-brand-50/40 sm:px-5 sm:py-4 dark:hover:bg-white/5"
					:aria-expanded="activeIndexes.has(idx)"
					@click="toggleFaq(idx)"
				>
					<div class="flex items-center gap-3">
						<span
							v-if="item.icon"
							:class="item.icon"
							class="shrink-0 text-base text-brand-600 dark:text-brand-400"
						/>
						<span
							v-else
							class="h-6 w-6 flex shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-xs text-brand-700 font-bold font-mono dark:bg-brand-500/15 dark:text-brand-300"
						>
							{{ idx + 1 }}
						</span>
						<span class="text-sm text-slate-800 font-semibold font-sans sm:text-base dark:text-slate-100">
							{{ item.q }}
						</span>
					</div>

					<span
						class="i-hugeicons-arrow-down-01 shrink-0 text-base text-slate-400 transition-transform duration-300 dark:text-slate-500"
						:class="{ 'rotate-180 text-brand-500 dark:text-brand-400': activeIndexes.has(idx) }"
					/>
				</button>

				<div
					v-show="activeIndexes.has(idx)"
					class="border-t border-[#115e4f]/15 px-4.5 pb-4.5 pt-3 text-sm text-slate-600 leading-relaxed font-sans dark:border-[#134e43]/40 sm:px-5 dark:text-slate-300"
				>
					<p class="whitespace-pre-line">
						{{ item.a }}
					</p>
				</div>
			</div>
		</div>

		<!-- Fallback jika user menggunakan slot accordion langsung -->
		<div
			v-if="resolvedFaqItems.length === 0"
			class="flex flex-col gap-3"
		>
			<slot />
		</div>
	</section>
</template>
