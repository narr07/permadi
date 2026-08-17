<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
	error: NuxtError
}>()

const { locale } = useI18n()
const localePath = useLocalePath()

const statusCode = computed(() => props.error?.statusCode || 404)
const is404 = computed(() => statusCode.value === 404)

const errorTitle = computed(() => {
	if (is404.value) {
		return locale.value === 'id' ? 'Halaman Tidak Ditemukan' : 'Page Not Found'
	}
	return locale.value === 'id' ? 'Terjadi Kesalahan' : 'Something Went Wrong'
})

const errorDescription = computed(() => {
	if (is404.value) {
		return locale.value === 'id'
			? 'Halaman atau tautan yang Anda tuju mungkin telah dipindahkan, diubah namanya, atau sudah tidak tersedia lagi.'
			: 'The page or resource you are looking for might have been removed, renamed, or is temporarily unavailable.'
	}
	return props.error?.statusMessage
		|| (locale.value === 'id'
			? 'Sistem kami mengalami kendala teknis saat memproses permintaan ini. Silakan coba beberapa saat lagi.'
			: 'An unexpected error occurred while processing your request. Please try again in a moment.')
})

function handleClearError(redirectPath = '/') {
	clearError({ redirect: localePath(redirectPath) })
}

useHead({
	title: `${statusCode.value} — ${errorTitle.value} | Permadi`,
})
</script>

<template>
	<div class="relative min-h-screen flex flex-col justify-between overflow-hidden selection:(bg-brand-500 text-white)">
		<!-- Ambient Noise & Glowing Radial Gradients -->
		<div
			class="noise"
			aria-hidden="true"
		/>
		<div
			class="pointer-events-none absolute h-96 w-96 rounded-full bg-brand-500/15 blur-3xl -left-32 -top-32 dark:bg-brand-500/10"
			aria-hidden="true"
		/>
		<div
			class="pointer-events-none absolute h-96 w-96 rounded-full bg-teal-500/15 blur-3xl -right-32 -top-32 dark:bg-teal-400/10"
			aria-hidden="true"
		/>
		<div
			class="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 rounded-full bg-brand-600/10 blur-3xl -translate-x-1/2 dark:bg-brand-400/5"
			aria-hidden="true"
		/>

		<!-- Minimal Bento Header -->
		<header class="relative z-20 py-6">
			<div class="container-bento flex items-center justify-between">
				<button
					type="button"
					class="group inline-flex cursor-pointer items-center gap-3 rounded-2xl focus-ring"
					:aria-label="locale === 'id' ? 'Kembali ke Beranda' : 'Back to Home'"
					@click="handleClearError('/')"
				>
					<Logo size="38" />
					<span class="text-base text-slate-900 font-bold tracking-tight font-heading transition-colors dark:text-white group-hover:text-brand-700 dark:group-hover:text-brand-400">
						Permadi<span class="text-brand-600 dark:text-brand-400">.dev</span>
					</span>
				</button>

				<button
					type="button"
					class="shadow-2xs inline-flex cursor-pointer items-center gap-1.5 border border-slate-200/80 rounded-xl bg-white/80 px-3.5 py-1.5 text-xs text-slate-700 font-semibold backdrop-blur-md transition-all dark:border-[#134e43] hover:border-brand-500/40 dark:bg-[#002b27]/80 hover:bg-white dark:text-slate-200 dark:hover:bg-[#042f27]"
					@click="handleClearError('/')"
				>
					<span class="i-hugeicons-home-01 text-sm text-brand-600 dark:text-brand-400" />
					<span>{{ locale === 'id' ? 'Beranda' : 'Home' }}</span>
				</button>
			</div>
		</header>

		<!-- Main Bento Error Content -->
		<main class="relative z-10 my-auto py-10">
			<div class="container-bento max-w-4xl">
				<!-- 1. Hero Bento Card -->
				<div class="bento-card-clean relative overflow-hidden border border-slate-200/90 rounded-bento bg-white/95 p-6 shadow-lg backdrop-blur-2xl dark:border-[#134e43] dark:bg-[#002b27]/95 md:p-12 sm:p-8">
					<!-- Ambient Glow Behind Logo -->
					<div
						class="pointer-events-none absolute left-1/2 top-12 h-44 w-44 rounded-full bg-brand-400/20 blur-2xl -translate-x-1/2 dark:bg-brand-400/10"
						aria-hidden="true"
					/>

					<div class="relative z-10 flex flex-col items-center text-center">
						<!-- Interactive Logo with Bento Floating Frame -->
						<div class="bg-linear-to-b mb-6 inline-flex border border-brand-500/30 rounded-3xl from-brand-50/80 to-teal-100/40 p-4 shadow-sm backdrop-blur-md transition-transform duration-300 hover:scale-105 dark:border-brand-400/25 dark:from-[#042f27]/90 dark:to-[#001c19]/90">
							<Logo size="72" />
						</div>

						<!-- Status Code Pill -->
						<div class="mb-4 inline-flex items-center gap-2 border border-brand-300/80 rounded-full bg-brand-100/90 px-3.5 py-1 text-xs text-brand-900 font-bold tracking-wider font-mono uppercase dark:border-brand-700/60 dark:bg-brand-950/90 dark:text-brand-300">
							<span class="status-dot animate-pulse" />
							<span>ERROR {{ statusCode }}</span>
						</div>

						<!-- Heading Title -->
						<h1 class="text-3xl text-slate-900 font-extrabold leading-tight tracking-tight font-heading lg:text-5xl sm:text-4xl dark:text-white">
							{{ errorTitle }}
						</h1>

						<!-- Description -->
						<p class="mt-3.5 max-w-lg text-sm text-slate-600 leading-relaxed font-sans sm:text-base dark:text-slate-300">
							{{ errorDescription }}
						</p>

						<!-- Primary CTA Buttons -->
						<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
							<button
								type="button"
								class="inline-flex cursor-pointer items-center gap-2 border border-transparent rounded-xl bg-brand-600 px-5 py-2.5 text-sm text-white font-semibold shadow-md transition-all duration-200 active:scale-95 dark:bg-brand-500 hover:bg-brand-700 focus-ring hover:-translate-y-0.5 dark:hover:bg-brand-600"
								@click="handleClearError('/')"
							>
								<span class="i-hugeicons-home-01 text-base" />
								<span>{{ locale === 'id' ? 'Kembali ke Beranda' : 'Back to Home' }}</span>
							</button>

							<button
								type="button"
								class="inline-flex cursor-pointer items-center gap-2 border border-slate-200/80 rounded-xl bg-slate-100/90 px-4.5 py-2.5 text-sm text-slate-700 font-semibold transition-all duration-200 dark:border-[#134e43] dark:bg-[#042f27] hover:bg-white dark:text-slate-200 focus-ring hover:-translate-y-0.5 dark:hover:bg-[#073d32]"
								@click="handleClearError('/blog')"
							>
								<span class="i-hugeicons-book-open-01 text-base text-brand-600 dark:text-brand-400" />
								<span>{{ locale === 'id' ? 'Baca Artikel Blog' : 'Read Blog' }}</span>
							</button>
						</div>
					</div>
				</div>

				<!-- 2. Bento Quick Discovery Grid (4 Nav Cards) -->
				<div class="grid grid-cols-1 mt-6 gap-4 lg:grid-cols-4 sm:grid-cols-2">
					<!-- Card 1: Blog -->
					<button
						type="button"
						class="bento-card-clean group flex cursor-pointer items-center gap-3.5 bento-lift rounded-bento p-4 text-left"
						@click="handleClearError('/blog')"
					>
						<div class="h-10 w-10 flex shrink-0 items-center justify-center border border-brand-500/25 rounded-xl bg-brand-500/10 text-brand-600 dark:border-brand-400/20 dark:bg-brand-500/15 dark:text-brand-400">
							<span class="i-hugeicons-news text-xl" />
						</div>
						<div class="overflow-hidden">
							<strong class="block truncate text-sm text-slate-900 font-semibold font-heading transition-colors dark:text-white group-hover:text-brand-800 dark:group-hover:text-brand-300">
								{{ locale === 'id' ? 'Artikel Blog' : 'Blog Articles' }}
							</strong>
							<span class="block truncate text-[11px] text-slate-500 dark:text-slate-400">
								{{ locale === 'id' ? 'Tutorial & Wawasan' : 'Tutorials & Insights' }}
							</span>
						</div>
					</button>

					<!-- Card 2: Projek -->
					<button
						type="button"
						class="bento-card-clean group flex cursor-pointer items-center gap-3.5 bento-lift rounded-bento p-4 text-left"
						@click="handleClearError('/projek')"
					>
						<div class="h-10 w-10 flex shrink-0 items-center justify-center border border-teal-500/25 rounded-xl bg-teal-500/10 text-teal-600 dark:border-teal-400/20 dark:bg-teal-500/15 dark:text-teal-400">
							<span class="i-hugeicons-folder-02 text-xl" />
						</div>
						<div class="overflow-hidden">
							<strong class="block truncate text-sm text-slate-900 font-semibold font-heading transition-colors dark:text-white group-hover:text-brand-800 dark:group-hover:text-brand-300">
								{{ locale === 'id' ? 'Portofolio Projek' : 'Project Showcase' }}
							</strong>
							<span class="block truncate text-[11px] text-slate-500 dark:text-slate-400">
								{{ locale === 'id' ? 'Karya & Eksperimen' : 'Works & Experiments' }}
							</span>
						</div>
					</button>

					<!-- Card 3: Tentang -->
					<button
						type="button"
						class="bento-card-clean group flex cursor-pointer items-center gap-3.5 bento-lift rounded-bento p-4 text-left"
						@click="handleClearError('/tentang')"
					>
						<div class="h-10 w-10 flex shrink-0 items-center justify-center border border-emerald-500/25 rounded-xl bg-emerald-500/10 text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-500/15 dark:text-emerald-400">
							<span class="i-hugeicons-user-circle text-xl" />
						</div>
						<div class="overflow-hidden">
							<strong class="block truncate text-sm text-slate-900 font-semibold font-heading transition-colors dark:text-white group-hover:text-brand-800 dark:group-hover:text-brand-300">
								{{ locale === 'id' ? 'Tentang Saya' : 'About Me' }}
							</strong>
							<span class="block truncate text-[11px] text-slate-500 dark:text-slate-400">
								{{ locale === 'id' ? 'Profil & Pengalaman' : 'Profile & Journey' }}
							</span>
						</div>
					</button>

					<!-- Card 4: Kontak -->
					<button
						type="button"
						class="bento-card-clean group flex cursor-pointer items-center gap-3.5 bento-lift rounded-bento p-4 text-left"
						@click="handleClearError('/kontak')"
					>
						<div class="h-10 w-10 flex shrink-0 items-center justify-center border border-cyan-500/25 rounded-xl bg-cyan-500/10 text-cyan-600 dark:border-cyan-400/20 dark:bg-cyan-500/15 dark:text-cyan-400">
							<span class="i-hugeicons-mail-01 text-xl" />
						</div>
						<div class="overflow-hidden">
							<strong class="block truncate text-sm text-slate-900 font-semibold font-heading transition-colors dark:text-white group-hover:text-brand-800 dark:group-hover:text-brand-300">
								{{ locale === 'id' ? 'Kontak' : 'Contact' }}
							</strong>
							<span class="block truncate text-[11px] text-slate-500 dark:text-slate-400">
								{{ locale === 'id' ? 'Kirim Pesan' : 'Get in Touch' }}
							</span>
						</div>
					</button>
				</div>
			</div>
		</main>

		<!-- Footer -->
		<footer class="relative z-10 border-t border-slate-200/80 py-6 dark:border-slate-800/80">
			<div class="container-bento flex flex-col items-center justify-between gap-3 text-center text-xs text-slate-600 sm:flex-row sm:text-left dark:text-slate-400">
				<p class="font-sans">
					permadi.dev <span class="text-slate-500">© {{ new Date().getFullYear() }}</span>
				</p>
				<p class="text-[11px] text-slate-500 font-mono dark:text-slate-400">
					Permadi Deep Teal Design System
				</p>
			</div>
		</footer>
	</div>
</template>
