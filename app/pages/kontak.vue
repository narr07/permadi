<script setup lang="ts">
const { locale } = useI18n()
const collection = computed(() => (locale.value === 'id' ? 'pages_id' : 'pages_en'))
const currentPath = computed(() => (locale.value === 'id' ? '/id/kontak' : '/en/contact'))

const { data: page } = await useAsyncData(
	() => `kontak-page-${locale.value}`,
	() => queryCollection(collection.value).path(currentPath.value).first(),
	{ watch: [locale] },
)

function onHeaderMouseMove(e: MouseEvent) {
	const target = e.currentTarget as HTMLElement
	if (!target)
		return
	const rect = target.getBoundingClientRect()
	target.style.setProperty('--x', `${e.clientX - rect.left}px`)
	target.style.setProperty('--y', `${e.clientY - rect.top}px`)
}

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
</script>

<template>
	<div class="container-bento py-10 sm:py-14">
		<!-- Page Header with Bento Spotlight Effect -->
		<header
			class="bento-card-clean bento-spotlight relative z-10 mb-8 bg-slate-50/50 p-6 sm:mb-10 dark:bg-slate-900/40 sm:p-8"
			@mousemove="onHeaderMouseMove"
		>
			<!-- Ambient Glow Subtle Background -->
			<div class="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]">
				<div class="absolute h-64 w-64 rounded-full bg-brand-400/10 blur-3xl -right-16 -top-16 dark:bg-brand-400/5" />
			</div>

			<div class="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
				<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
				<div class="max-w-2xl">
					<div class="mb-3.5 flex items-center justify-between gap-3">
						<div class="inline-flex items-center gap-2 border border-brand-200/60 rounded-full bg-brand-100/70 px-3 py-1 text-xs text-brand-700 font-semibold dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300">
							<span class="status-dot animate-pulse" />
							<span>{{ page?.section_label || (locale === 'id' ? 'Kontak & Kolaborasi' : 'Contact & Connect') }}</span>
						</div>

						<!-- Logo Compact Badge di Mobile -->
						<div class="shadow-xs flex shrink-0 items-center justify-center border border-slate-200/70 rounded-xl bg-white p-1.5 md:hidden dark:border-slate-700/60 dark:bg-slate-800/80">
							<Logo :size="36" />
						</div>
					</div>

					<h1 class="heading-page">
						{{ page?.headline || page?.title || (locale === 'id' ? 'Kontak & Kolaborasi' : 'Contact & Collaboration') }}
					</h1>

					<p class="heading-page-sub">
						{{ page?.lead || page?.description || (locale === 'id' ? 'Tertarik berdiskusi tentang proyek baru, konsultasi frontend, atau sekadar bertukar pikiran? Silakan hubungi saya.' : 'Interested in discussing new projects, frontend consulting, or just sharing thoughts? Feel free to reach out.') }}
					</p>
				</div>

				<!-- Sisi Kanan: Interactive Logo Bento Widget (Desktop) -->
				<div class="hidden shrink-0 items-center justify-center md:flex">
					<div class="shadow-xs flex items-center justify-center border border-slate-200/70 rounded-2xl bg-white p-4 transition-colors duration-100 dark:border-slate-700/60 hover:border-brand-500 dark:bg-slate-800/80 dark:hover:border-brand-400">
						<Logo :size="84" />
					</div>
				</div>
			</div>
		</header>

		<!-- Bento Contact Grid -->
		<div class="grid grid-cols-1 mb-12 gap-4 md:grid-cols-12 sm:gap-5">
			<!-- Direct Email Bento (Hero Card Clean) -->
			<div
				v-if="page?.email_card"
				class="hero-card-clean flex flex-col justify-between p-6 md:col-span-7 sm:p-8"
			>
				<div>
					<span class="mb-3 flex items-center gap-1.5 text-xs text-brand-300 font-semibold tracking-widest uppercase">
						<span class="i-hugeicons-mail-01 text-xs" /> {{ page.email_card.label || 'Direct Inquiries' }}
					</span>
					<h3 class="text-3xl text-white font-semibold tracking-tight font-heading sm:text-5xl">
						{{ page.email_card.email || 'dinar@permadi.dev' }}
					</h3>
					<p
						v-if="page.email_card.description"
						class="mt-3 max-w-md text-sm text-slate-300 leading-relaxed"
					>
						{{ page.email_card.description }}
					</p>
				</div>
				<div class="mt-8 flex items-center justify-between border-t border-brand-900/60 pt-4">
					<a
						:href="`mailto:${page.email_card.email || 'dinar@permadi.dev'}`"
						class="inline-flex items-center gap-1.5 rounded-full bg-brand-400 px-5 py-2.5 text-xs text-slate-950 font-bold transition-all hover:bg-brand-300"
					>
						{{ page.email_card.button_text || (locale === 'id' ? 'Kirim Email Sekarang' : 'Send Email Now') }}
						<span>↗</span>
					</a>
					<span
						v-if="page.email_card.meta"
						class="text-xs text-brand-300/80"
					>
						{{ page.email_card.meta }}
					</span>
				</div>
			</div>

			<!-- Location & Status Bento -->
			<div
				v-if="page?.status_card"
				class="sand-card-clean flex flex-col justify-between p-6 md:col-span-5 sm:p-7"
			>
				<div>
					<span class="mb-3 flex items-center gap-1.5 text-xs text-slate-800 font-semibold tracking-wider font-mono uppercase">
						<span class="inline-block h-2 w-2 rounded-full bg-emerald-600" />
						{{ page.status_card.label || (locale === 'id' ? 'Status Ketersediaan' : 'Availability Status') }}
					</span>
					<h3 class="text-2xl text-slate-900 font-semibold leading-tight font-heading">
						{{ page.status_card.title || 'Open for Projects & Consulting' }}
					</h3>
					<p
						v-if="page.status_card.description"
						class="mt-2 text-xs text-slate-800 leading-relaxed sm:text-sm"
					>
						{{ page.status_card.description }}
					</p>
				</div>
				<div class="mt-6 flex items-center justify-between border-t border-slate-900/10 pt-3 text-xs text-slate-800 font-mono">
					<span
						v-if="page.status_card.location"
						class="flex items-center gap-1"
					>
						<span class="i-hugeicons-location-01 text-sm text-slate-900" />
						{{ page.status_card.location }}
					</span>
					<span v-if="page.status_card.timezone">
						{{ page.status_card.timezone }}
					</span>
				</div>
			</div>

			<!-- Social Channels Bento -->
			<div
				v-if="page?.social_card"
				class="bento-card-clean flex flex-col justify-between p-6 md:col-span-6 sm:p-7"
			>
				<div>
					<span
						v-if="page.social_card.label"
						class="section-label mb-2 block text-brand-700 dark:text-brand-400"
					>
						{{ page.social_card.label }}
					</span>
					<h3 class="text-2xl text-slate-900 font-semibold font-heading dark:text-white">
						{{ page.social_card.title || (locale === 'id' ? 'Temukan saya di platform digital' : 'Connect across the web') }}
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
						class="group block rounded-bento bg-slate-50 p-3 text-center transition-all dark:bg-slate-800/60 hover:(bg-brand-50 text-brand-800) focus-ring dark:hover:(bg-brand-950/40 text-brand-400)"
					>
						<span
							:class="item.icon || 'i-hugeicons-link-01'"
							class="mx-auto mb-1 block text-xl"
						/>
						<span class="text-xs font-semibold">{{ item.name }}</span>
					</a>
				</div>
			</div>

			<!-- Newsletter Bento -->
			<div
				v-if="page?.newsletter_card"
				class="bento-card-clean flex flex-col justify-between p-6 md:col-span-6 sm:p-7"
			>
				<div>
					<span
						v-if="page.newsletter_card.label"
						class="section-label mb-2 block text-brand-700 dark:text-brand-400"
					>
						{{ page.newsletter_card.label }}
					</span>
					<h3 class="text-2xl text-slate-900 font-semibold font-heading dark:text-white">
						{{ page.newsletter_card.title || (locale === 'id' ? 'Berlangganan Newsletter' : 'Newsletter Subscription') }}
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
