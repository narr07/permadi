<script setup lang="ts">
const { locale, t } = useI18n()

const currentYear = new Date().getFullYear()

// Live local time (GMT+7 Asia/Jakarta)
const currentTime = ref('')
function updateTime() {
	currentTime.value = new Intl.DateTimeFormat(locale.value === 'id' ? 'id-ID' : 'en-US', {
		timeZone: 'Asia/Jakarta',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	}).format(new Date())
}

onMounted(() => {
	updateTime()
	const timer = setInterval(updateTime, 30000)
	onUnmounted(() => clearInterval(timer))
})

function scrollToTop() {
	if (import.meta.client) {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}
}

const socialLinks = [
	{
		name: 'GitHub',
		url: 'https://github.com/narr07',
		icon: 'i-hugeicons-github',
		ariaLabel: 'GitHub',
	},
	{
		name: 'X (Twitter)',
		url: 'https://x.com/dinarpermadi07',
		icon: 'i-hugeicons-new-twitter',
		ariaLabel: 'X (Twitter)',
	},
	{
		name: 'Instagram',
		url: 'https://www.instagram.com/narr07/',
		icon: 'i-hugeicons-instagram',
		ariaLabel: 'Instagram',
	},
	{
		name: 'Behance',
		url: 'https://www.behance.net/narr07',
		icon: 'i-hugeicons-behance-02',
		ariaLabel: 'Behance',
	},
	{
		name: 'RSS Feed',
		url: '/feed.xml',
		icon: 'i-hugeicons-rss',
		ariaLabel: 'RSS Feed',
	},
	{
		name: 'Email',
		url: 'mailto:dinar@permadi.dev',
		icon: 'i-hugeicons-mail-at-sign-01',
		ariaLabel: 'Email',
	},
]
</script>

<template>
	<footer class="mt-10 border-t border-slate-200/80 pb-12 pt-10 sm:mt-24 dark:border-slate-800/80 sm:pb-16 sm:pt-14">
		<div class="container-bento">
			<!-- Bento Grid Layout -->
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-12 md:grid-cols-12 sm:gap-5">
				<!-- Bento Card: Newsletter Subscription (12 Cols) -->
				<div class="bento-card-subtle p-6 lg:col-span-12 md:col-span-12 sm:p-7">
					<div class="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
						<div class="max-w-xl">
							<div class="mb-1.5 flex items-center gap-2">
								<span class="h-6 w-6 inline-flex items-center justify-center rounded-lg bg-brand-100 text-brand-900 dark:bg-brand-950 dark:text-brand-300">
									<span class="i-hugeicons-mail-01 text-xs" />
								</span>
								<span class="kicker text-[11px]">
									{{ t('sections.newsletter_title', 'Newsletter') }}
								</span>
							</div>
							<h3 class="text-base text-slate-900 font-bold tracking-tight sm:text-lg dark:text-white">
								{{ t('newsletter.title', 'Info Artikel Terbaru') }}
							</h3>
							<p class="mt-1 text-xs text-slate-600 sm:text-sm dark:text-slate-400">
								{{ t('newsletter.description', 'Dapatkan tulisan teknis, insight desain, dan artikel terbaru langsung di inbox email kamu. Bebas spam.') }}
							</p>
						</div>

						<div class="w-full lg:max-w-md">
							<LazyNewsletterForm hydrate-on-visible />
						</div>
					</div>
				</div>

				<div class="bento-card-subtle p-5 lg:col-span-12 md:col-span-12 sm:p-6">
					<div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
						<div class="flex items-center gap-3">
							<span class="kicker">
								{{ locale === 'id' ? 'Jejaring Sosial' : 'Social Channels' }}
							</span>
							<span class="hidden text-xs text-slate-600 font-mono sm:inline dark:text-slate-400">
								{{ locale === 'id' ? 'Temukan saya di platform berikut:' : 'Connect with me on these platforms:' }}
							</span>
						</div>

						<!-- Social Buttons Grid (Centered Icon Tiles) -->
						<div class="flex flex-wrap items-center gap-2 sm:gap-2.5">
							<a
								v-for="social in socialLinks"
								:key="social.name"
								:href="social.url"
								:target="social.url.startsWith('http') ? '_blank' : undefined"
								:rel="social.url.startsWith('http') ? 'noopener' : undefined"
								class="shadow-2xs group h-10 w-10 flex shrink-0 items-center justify-center border border-slate-200/80 rounded-xl bg-white text-slate-800 transition-all dark:border-slate-800 hover:border-brand-500/40 dark:bg-slate-800/80 hover:bg-brand-50/70 dark:text-slate-200 hover:text-brand-900 dark:hover:border-brand-400/40 dark:hover:bg-brand-950/60 dark:hover:text-brand-200"
								:title="social.name"
								:aria-label="social.ariaLabel"
							>
								<span
									:class="social.icon"
									class="text-lg transition-transform group-hover:scale-110 group-hover:text-brand-700 dark:group-hover:text-brand-400"
								/>
								<span class="sr-only">{{ social.ariaLabel }}</span>
							</a>
						</div>
					</div>
				</div>

				<!-- Bento Card 4: Meta Bar & Back to Top (12 Cols) -->
				<div class="flex flex-col items-center justify-between gap-4 border border-slate-200/70 rounded-2xl bg-slate-50/70 px-6 py-4 text-xs text-slate-700 lg:col-span-12 md:col-span-12 sm:flex-row dark:border-slate-800/70 dark:bg-slate-900/60 dark:text-slate-300">
					<!-- Copyright -->
					<div class="flex items-center gap-2 text-center sm:text-left">
						<span>© 2021–<ClientOnly fallback="2026">{{ currentYear }}</ClientOnly></span>
						<span>·</span>
						<span class="text-slate-950 font-bold dark:text-slate-100">Dinar Permadi Yusup</span>
						<span class="hidden sm:inline">· {{ locale === 'id' ? 'Hak cipta dilindungi.' : 'All rights reserved.' }}</span>
					</div>

					<!-- Back to Top Button -->
					<button
						type="button"
						class="group inline-flex items-center gap-2 border border-slate-200/90 rounded-xl bg-white px-3.5 py-1.5 text-xs text-slate-800 font-semibold transition-all dark:border-slate-700/80 hover:border-brand-500/50 dark:bg-slate-800/80 dark:text-slate-100 hover:text-brand-900 dark:hover:border-brand-400/50 dark:hover:text-brand-200"
						@click="scrollToTop"
					>
						<span>{{ locale === 'id' ? 'Kembali ke Atas' : 'Back to Top' }}</span>
						<span class="i-hugeicons-arrow-up-02 text-xs transition-transform group-hover:-translate-y-0.5" />
					</button>
				</div>
			</div>
		</div>
	</footer>
</template>
