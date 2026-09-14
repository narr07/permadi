<script setup lang="ts">
const { locale } = useI18n()
const collection = computed(() => (locale.value === 'id' ? 'kontak_id' : 'kontak_en'))

const { data: page } = await useAsyncData(
	() => `kontak-page-${locale.value}`,
	() => queryCollection(collection.value).first(),
	{ watch: [locale] },
)

useSeoMeta({
	title: computed(() => page.value?.title),
	description: computed(() => page.value?.description),
	ogTitle: computed(() => page.value?.title),
	ogDescription: computed(() => page.value?.description),
})

defineOgImage('Bento', {
	title: page.value?.title,
	description: page.value?.description,
})

useSchemaOrg([
	defineWebPage({
		'@type': 'ContactPage',
	}),
])

function getSocialIcon(name?: string, icon?: string) {
	if (icon && icon.startsWith('i-swisspost' + '-'))
		return icon
	const n = (name || '').toLowerCase()
	if (n.includes('git'))
		return 'i-swisspost-github'
	if (n.includes('twit') || n === 'x')
		return 'i-swisspost-twitterx'
	if (n.includes('insta'))
		return 'i-swisspost-instagram'
	if (n.includes('behance'))
		return 'i-swisspost-icondesign'
	return 'i-swisspost-link'
}
</script>

<template>
	<div class="mx-auto max-w-6xl px-4 py-10 lg:px-8 sm:px-6 sm:py-14">
		<!-- Page Header -->
		<header
			class="relative z-10 mb-8 border border-slate-200/80 bg-slate-50/70 p-6 sm:mb-10 dark:border-[#134e43] dark:bg-slate-900/60 sm:p-8"
		>
			<div class="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
				<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
				<div class="max-w-2xl">
					<div class="mb-3.5 flex items-center justify-between gap-3">
						<div class="inline-flex items-center gap-1.5 border border-brand-200/60 bg-brand-100/70 px-3 py-1 text-xs text-brand-950 font-semibold dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300">
							<span class="i-swisspost-documentemail text-xs" />
							<span>{{ page?.section_label || (locale === 'id' ? 'Mari Terhubung' : 'Get in Touch') }}</span>
						</div>

						<!-- Logo Compact Badge di Mobile -->
						<div class="flex shrink-0 items-center justify-center border border-slate-200/70 bg-white p-1.5 shadow-xs md:hidden dark:border-slate-700/60 dark:bg-slate-800/80">
							<StaticLogo :size="36" />
						</div>
					</div>

					<h1 class="heading-page">
						{{ page?.headline || page?.title }}
					</h1>

					<p class="heading-page-sub">
						{{ page?.lead || page?.description }}
					</p>
				</div>

				<!-- Sisi Kanan: Interactive Logo Widget (Desktop) -->
				<div class="hidden shrink-0 items-center justify-center md:flex">
					<div class="border border-brand-500/30 bg-white p-6 shadow-sm dark:border-brand-400/20 dark:bg-[#002b27]">
						<StaticLogo :size="64" />
					</div>
				</div>
			</div>
		</header>

		<!-- Contact Grid -->
		<div class="grid grid-cols-1 mb-12 gap-4 md:grid-cols-12 sm:gap-5">
			<!-- Direct Email Card -->
			<div
				v-if="page?.email_card"
				class="relative flex flex-col justify-between border border-[#134e43] bg-[#002b27] p-6 text-[#f8fafa] md:col-span-7 sm:p-8"
			>
				<div>
					<span class="mb-3 flex items-center gap-1.5 text-xs text-brand-200 font-semibold tracking-wide">
						<span class="i-swisspost-mail text-xs text-brand-300" /> {{ page.email_card.label || (locale === 'id' ? 'Pertanyaan Langsung' : 'Direct Inquiries') }}
					</span>
					<h3 class="text-3xl text-white font-900 tracking-tight font-heading sm:text-5xl">
						{{ page.email_card.email || 'dinar@permadi.dev' }}
					</h3>
					<p
						v-if="page.email_card.description"
						class="mt-3 max-w-md text-sm text-slate-200 leading-relaxed"
					>
						{{ page.email_card.description }}
					</p>
				</div>
				<div class="mt-8 flex items-center justify-between border-t border-brand-900/60 pt-4">
					<a
						:href="`mailto:${page.email_card.email || 'dinar@permadi.dev'}`"
						class="group inline-flex cursor-pointer items-center gap-1.5 bg-brand-400 px-5 py-2.5 text-xs text-slate-950 font-bold shadow-xs transition-all duration-150 active:scale-95 hover:bg-brand-300 hover:-translate-y-0.5"
					>
						{{ page.email_card.button_text || (locale === 'id' ? 'Kirim Email Langsung' : 'Send an Email') }}
						<span class="i-swisspost-arrowupright text-xs transition-transform duration-150 group-hover:(translate-x-0.5 -translate-y-0.5)" />
					</a>
					<span
						v-if="page.email_card.meta"
						class="text-xs text-brand-200 font-medium font-mono"
					>
						{{ page.email_card.meta }}
					</span>
				</div>
			</div>

			<!-- Location & Status Card -->
			<div
				v-if="page?.status_card"
				class="relative flex flex-col justify-between border border-slate-200/80 bg-white p-6 text-slate-900 md:col-span-5 dark:border-[#134e43] dark:bg-[#002b27] sm:p-7 dark:text-slate-50"
			>
				<div>
					<span class="mb-3 flex items-center gap-1.5 text-xs text-slate-800 font-semibold tracking-wide dark:text-slate-200">
						<span class="animate-status-pulse inline-block h-2 w-2 rounded-none bg-emerald-500" />
						{{ page.status_card.label || (locale === 'id' ? 'Status Ketersediaan' : 'Availability Status') }}
					</span>
					<h3 class="text-2xl text-slate-900 font-900 leading-tight font-heading dark:text-white">
						{{ page.status_card.title }}
					</h3>
					<p
						v-if="page.status_card.description"
						class="mt-2 text-xs text-slate-700 leading-relaxed sm:text-sm dark:text-slate-300"
					>
						{{ page.status_card.description }}
					</p>
				</div>
				<div class="mt-6 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-slate-700 font-mono dark:border-slate-800/60 dark:text-slate-300">
					<span
						v-if="page.status_card.location"
						class="flex items-center gap-1.5 font-semibold"
					>
						<span class="i-swisspost-locationpin text-sm text-brand-600 dark:text-brand-400" />
						{{ page.status_card.location }}
					</span>
					<span
						v-if="page.status_card.timezone"
						class="font-medium"
					>
						{{ page.status_card.timezone }}
					</span>
				</div>
			</div>

			<!-- Social Channels -->
			<div
				v-if="page?.social_card"
				class="flex flex-col justify-between border border-slate-200/80 bg-white p-6 md:col-span-6 dark:border-[#134e43] dark:bg-[#002b27] sm:p-7"
			>
				<div>
					<span
						v-if="page.social_card.label"
						class="mb-2 block section-label text-brand-800 dark:text-brand-300"
					>
						{{ page.social_card.label }}
					</span>
					<h3 class="text-2xl text-slate-900 font-900 font-heading dark:text-white">
						{{ page.social_card.title }}
					</h3>
					<p
						v-if="page.social_card.description"
						class="mb-5 mt-1 text-xs text-slate-700 leading-relaxed sm:text-sm dark:text-slate-300"
					>
						{{ page.social_card.description }}
					</p>
				</div>
				<div
					v-if="page.social_card.items && page.social_card.items.length > 0"
					class="grid grid-cols-2 gap-2.5 sm:grid-cols-4"
				>
					<a
						v-for="item in page.social_card.items"
						:key="item.name"
						:href="item.url"
						target="_blank"
						rel="noopener"
						class="group block border border-slate-200/80 bg-slate-50 p-3 text-center text-slate-900 transition-all duration-150 active:scale-95 dark:border-[#134e43] dark:bg-slate-800/60 hover:(bg-brand-50 text-brand-950 -translate-y-0.5) dark:text-slate-100 focus-ring dark:hover:(bg-brand-950/40 text-brand-200)"
					>
						<span
							:class="getSocialIcon(item.name, item.icon)"
							class="mx-auto mb-1 block text-xl text-slate-800 transition-transform duration-150 group-hover:scale-110 dark:text-slate-200 group-hover:text-brand-950 dark:group-hover:text-brand-200"
						/>
						<span class="text-xs text-slate-900 font-semibold dark:text-slate-100">{{ item.name }}</span>
					</a>
				</div>
			</div>

			<!-- Newsletter -->
			<div
				v-if="page?.newsletter_card"
				class="flex flex-col justify-between border border-slate-200/80 bg-white p-6 md:col-span-6 dark:border-[#134e43] dark:bg-[#002b27] sm:p-7"
			>
				<div>
					<span
						v-if="page.newsletter_card.label"
						class="mb-2 block section-label text-brand-800 dark:text-brand-300"
					>
						{{ page.newsletter_card.label }}
					</span>
					<h3 class="text-2xl text-slate-900 font-900 font-heading dark:text-white">
						{{ page.newsletter_card.title }}
					</h3>
					<p
						v-if="page.newsletter_card.description"
						class="mb-5 mt-1 text-xs text-slate-700 leading-relaxed sm:text-sm dark:text-slate-300"
					>
						{{ page.newsletter_card.description }}
					</p>
				</div>
				<NewsletterForm />
			</div>
		</div>

		<article
			v-if="page"
			class="mt-8 max-w-3xl prose prose-slate dark:prose-invert"
		>
			<ContentRenderer :value="page" />
		</article>
	</div>
</template>
