<script setup lang="ts">
const { locale, t } = useI18n()
const localePath = useLocalePath()

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

const navLinks = computed(() => [
	{ label: t('nav.home'), to: localePath('/') },
	{ label: t('nav.blog'), to: localePath('/blog') },
	{ label: t('nav.projects'), to: locale.value === 'id' ? '/id/projek' : '/en/projects' },
	{ label: t('nav.gallery'), to: locale.value === 'id' ? '/id/galeri' : '/en/gallery' },
	{ label: t('nav.about'), to: locale.value === 'id' ? '/id/tentang' : '/en/about' },
	{ label: t('nav.contact'), to: locale.value === 'id' ? '/id/kontak' : '/en/contact' },
])

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
	<footer class="mt-20 border-t border-slate-200/80 pt-10 pb-12 dark:border-slate-800/80 sm:mt-24 sm:pt-14 sm:pb-16">
		<div class="container-bento">
			<!-- Bento Grid Layout -->
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-12 md:grid-cols-12 sm:gap-5">
				<!-- Bento Card 1: Brand & Profile (7 Cols) -->
				<div class="bento-card-clean flex flex-col justify-between p-6 lg:col-span-7 md:col-span-7 sm:p-8">
					<div>
						<!-- Header Row: Logo + Status Badge -->
						<div class="mb-6 flex flex-wrap items-center justify-between gap-3">
							<NuxtLink
								:to="localePath('/')"
								class="inline-flex items-center gap-3 transition-opacity hover:opacity-85"
								aria-label="Permadi Home"
							>
								<div class="shadow-xs flex shrink-0 items-center justify-center border border-slate-200/70 rounded-2xl bg-white p-2 dark:border-slate-700/60 dark:bg-slate-800/80">
									<Logo :size="40" />
								</div>
								<div>
									<h2 class="text-base text-slate-900 font-bold leading-tight dark:text-white sm:text-lg">
										Dinar Permadi Yusup
									</h2>
									<span class="text-xs text-slate-500 font-mono dark:text-slate-400">
										@narr07 · permadi.dev
									</span>
								</div>
							</NuxtLink>

							<!-- Live Availability Badge -->
							<div class="inline-flex items-center gap-2 border border-brand-200/60 rounded-full bg-brand-100/70 px-3 py-1 text-[11px] text-brand-950 font-semibold dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300">
								<span class="status-dot animate-pulse" />
								<span>{{ locale === 'id' ? 'Tersedia untuk proyek terpilih' : 'Available for select projects' }}</span>
							</div>
						</div>

						<!-- Bio Description -->
						<p class="max-w-xl text-sm text-slate-600 leading-relaxed dark:text-slate-300 sm:text-base">
							{{ locale === 'id'
								? 'Guru SD & Web Developer yang berfokus pada eksplorasi antarmuka digital berbasis Nuxt, Flutter, dan desain grafis dengan ketelitian visual tinggi.'
								: 'Elementary teacher & web developer focused on building refined digital interfaces, Nuxt & Flutter web apps, and aesthetic graphic design.' }}
						</p>
					</div>

					<!-- Location & Local Time Pills -->
					<div class="mt-6 flex flex-wrap items-center gap-2.5 pt-4 sm:mt-8">
						<div class="shadow-xs inline-flex items-center gap-1.5 border border-slate-200/80 rounded-xl bg-slate-50/80 px-3 py-1.5 text-xs text-slate-700 font-mono dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
							<span class="i-hugeicons-location-01 text-brand-700 text-sm dark:text-brand-400" />
							<span>{{ locale === 'id' ? 'Majalengka, Jawa Barat (ID)' : 'Majalengka, West Java (ID)' }}</span>
						</div>
						<div class="shadow-xs inline-flex items-center gap-1.5 border border-slate-200/80 rounded-xl bg-slate-50/80 px-3 py-1.5 text-xs text-slate-700 font-mono dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
							<span class="i-hugeicons-clock-01 text-brand-700 text-sm dark:text-brand-400" />
							<span>{{ currentTime ? (locale === 'id' ? `${currentTime} WIB (GMT+7)` : `${currentTime} (GMT+7)`) : 'GMT+7' }}</span>
						</div>
					</div>
				</div>

				<!-- Bento Card 2: Quick Navigation (5 Cols) -->
				<div class="bento-card-outline flex flex-col justify-between p-6 lg:col-span-5 md:col-span-5 sm:p-8">
					<div>
						<div class="mb-4 flex items-center justify-between">
							<span class="kicker">
								{{ locale === 'id' ? 'Navigasi Cepat' : 'Quick Navigation' }}
							</span>
							<span class="text-xs text-slate-400 font-mono">
								01 // EXPLORE
							</span>
						</div>

						<!-- Nav Links Grid -->
						<div class="grid grid-cols-2 gap-2 sm:gap-2.5">
							<NuxtLink
								v-for="item in navLinks"
								:key="item.to"
								:to="item.to"
								class="group flex items-center justify-between border border-transparent rounded-xl bg-slate-100/60 px-3.5 py-2.5 text-xs text-slate-700 font-semibold transition-all dark:bg-slate-800/40 hover:border-brand-500/30 dark:text-slate-200 hover:bg-brand-50/80 hover:text-brand-800 dark:hover:border-brand-400/30 dark:hover:bg-brand-950/40 dark:hover:text-brand-300"
							>
								<span>{{ item.label }}</span>
								<span class="i-hugeicons-arrow-right-01 text-xs text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-700 dark:group-hover:text-brand-300" />
							</NuxtLink>
						</div>
					</div>

					<!-- Direct Contact Action -->
					<div class="mt-6 pt-4 sm:mt-8">
						<NuxtLink
							:to="locale === 'id' ? '/id/kontak' : '/en/contact'"
							class="group shadow-xs flex items-center justify-between border border-brand-300/70 rounded-xl bg-brand-500/10 px-4 py-3 text-xs text-brand-900 font-bold transition-all dark:border-brand-700/60 hover:bg-brand-500/20 dark:text-brand-200 dark:hover:bg-brand-500/15"
						>
							<div class="flex items-center gap-2">
								<span class="i-hugeicons-mail-at-sign-01 text-base text-brand-700 dark:text-brand-400" />
								<span>{{ locale === 'id' ? 'Mari Kolaborasi & Diskusi' : 'Let\'s Connect & Collaborate' }}</span>
							</div>
							<span class="i-hugeicons-arrow-right-01 text-xs transition-transform group-hover:translate-x-1" />
						</NuxtLink>
					</div>
				</div>

				<!-- Bento Card 3: Social Network & Channels (12 Cols) -->
				<div class="bento-card-subtle p-5 lg:col-span-12 md:col-span-12 sm:p-6">
					<div class="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
						<div class="flex items-center gap-3">
							<span class="kicker">
								{{ locale === 'id' ? 'Jejaring Sosial' : 'Social Channels' }}
							</span>
							<span class="hidden text-xs text-slate-400 font-mono sm:inline">
								{{ locale === 'id' ? '— Temukan saya di platform berikut:' : '— Connect with me on these platforms:' }}
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
								class="shadow-2xs group flex h-10 w-10 shrink-0 items-center justify-center border border-slate-200/80 rounded-xl bg-white text-slate-600 transition-all dark:border-slate-800 dark:bg-slate-800/80 hover:border-brand-500/40 dark:text-slate-300 hover:bg-brand-50/70 hover:text-brand-900 dark:hover:border-brand-400/40 dark:hover:bg-brand-950/60 dark:hover:text-brand-200"
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
				<div class="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200/60 bg-slate-50/60 px-6 py-4 text-xs text-slate-600 dark:border-slate-800/60 dark:bg-slate-900/40 dark:text-slate-400 lg:col-span-12 md:col-span-12 sm:flex-row">
					<!-- Copyright -->
					<div class="flex items-center gap-2 text-center sm:text-left">
						<span>© 2021–<ClientOnly fallback="2026">{{ currentYear }}</ClientOnly></span>
						<span>·</span>
						<span class="text-slate-900 font-semibold dark:text-slate-200">Dinar Permadi Yusup</span>
						<span class="hidden sm:inline">· {{ locale === 'id' ? 'Hak cipta dilindungi.' : 'All rights reserved.' }}</span>
					</div>

					<!-- Back to Top Button -->
					<button
						type="button"
						class="group inline-flex items-center gap-2 border border-slate-200/80 rounded-xl bg-white px-3.5 py-1.5 text-xs text-slate-700 font-semibold transition-all dark:border-slate-700/80 dark:bg-slate-800/80 hover:border-brand-500/50 dark:text-slate-200 hover:text-brand-800 dark:hover:border-brand-400/50 dark:hover:text-brand-300"
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
