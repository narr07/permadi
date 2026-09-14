<script setup lang="ts">
const { locale } = useI18n()

const socials = [
	{ name: 'GitHub', handle: 'narr07', url: 'https://github.com/narr07' },
	{ name: 'X / Twitter', handle: 'dinarpermadi07', url: 'https://x.com/dinarpermadi07' },
	{ name: 'Instagram', handle: 'narr07', url: 'https://www.instagram.com/narr07/' },
	{ name: 'Behance', handle: 'narr07', url: 'https://www.behance.net/narr07' },
]
</script>

<template>
	<section class="w-full bg-white dark:bg-[#001e1c]">
		<!-- Header Strip -->
		<div class="flex items-center justify-between border-b border-slate-200/80 px-6 py-4 text-[11px] font-bold tracking-[0.2em] font-mono uppercase dark:border-[#134e43] sm:px-8 sm:py-5">
			<div class="flex items-center gap-2.5 text-brand-700 dark:text-accent">
				<span class="inline-block h-2 w-2 rounded-none bg-brand-500" />
				<span>06 // HUBUNGI &amp; KOLABORASI</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="inline-block h-1.5 w-1.5 rounded-none bg-brand-500 shadow-[0_0_0_2px_#ccfbf2] dark:shadow-[0_0_0_2px_rgba(20,184,152,0.2)]" />
				<span class="text-brand-600 dark:text-brand-400">TERSEDIA PROYEK</span>
			</div>
		</div>

		<!-- 12-Column Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-12">
			<!-- Left Column: Inquiries (8 Columns) -->
			<div class="flex flex-col justify-between p-6 lg:col-span-8 lg:p-12 sm:p-10">
				<div>
					<h2 class="mb-6 text-balance text-3xl text-slate-900 font-700 leading-[0.95] tracking-[-0.03em] font-heading lg:text-6xl sm:text-5xl dark:text-slate-50">
						{{ locale === 'id' ? 'Tertarik berkolaborasi atau mendiskusikan sistem baru?' : 'Interested in collaboration or discussing a new project?' }}
					</h2>

					<p class="mb-8 max-w-[54ch] text-sm text-slate-900/75 leading-relaxed font-sans sm:text-base dark:text-slate-50/75">
						{{ locale === 'id' ? 'Terbuka untuk diajak ngobrol soal proyek frontend dengan Nuxt, aplikasi mobile pakai Flutter, desain grafis sistematis, atau ide-ide teknologi untuk dunia pendidikan.' : 'Open to chat about frontend projects with Nuxt, mobile apps using Flutter, systematic graphic design, or educational technology ideas.' }}
					</p>

					<div class="my-6">
						<a
							href="mailto:dinar@permadi.dev"
							class="group inline-flex items-center gap-3 text-2xl text-brand-700 font-bold font-mono underline decoration-brand-500/50 underline-offset-8 transition-colors sm:text-4xl dark:text-[#5eeacf] hover:text-brand-500"
						>
							<span>dinar@permadi.dev</span>
							<span class="i-ph-arrow-up-right text-2xl transition-transform duration-200 group-hover:(translate-x-1.5 -translate-y-1.5) sm:text-3xl" />
						</a>
					</div>
				</div>

				<div class="mt-8 border-t border-slate-200/60 pt-4 text-xs text-slate-900/50 font-mono dark:border-[#134e43]/60 dark:text-slate-50/50">
					WAKTU RESPON RATA-RATA: 1–2 HARI KERJA // MAJALENGKA (WIB / GMT+7)
				</div>
			</div>

			<!-- Right Column: Digital Platforms & Almamater (4 Columns) -->
			<div class="flex flex-col justify-between border-t border-slate-200/80 bg-slate-50/50 p-6 lg:col-span-4 lg:border-l lg:border-t-0 dark:border-[#134e43] dark:bg-[#002420]/40 lg:p-10 sm:p-8">
				<div>
					<div class="mb-6 border-b border-slate-200/80 pb-2 text-[11px] text-slate-900/50 font-bold tracking-[0.2em] font-mono uppercase dark:border-[#134e43] dark:text-slate-50/50">
						PLATFORM DIGITAL
					</div>

					<ul class="text-xs font-mono space-y-3">
						<li
							v-for="s in socials"
							:key="s.name"
							class="flex items-center justify-between border-b border-slate-200/60 pb-3 dark:border-[#134e43]/60"
						>
							<span class="text-slate-900/70 dark:text-slate-50/70">{{ s.name }}</span>
							<a
								:href="s.url"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 text-slate-900 font-bold transition-colors dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
							>
								<span>@{{ s.handle }}</span>
								<span class="i-ph-arrow-up-right text-[11px]" />
							</a>
						</li>
					</ul>
				</div>

				<div class="mt-8 border-t border-slate-200/80 pt-4 text-[10px] text-slate-900/50 leading-relaxed font-mono uppercase dark:border-[#134e43] dark:text-slate-50/50">
					LULUSAN UNIVERSITAS PENDIDIKAN INDONESIA (UPI) BANDUNG · PROVINSI JAWA BARAT
				</div>
			</div>
		</div>

		<!-- Swiss Colophon Strip -->
		<div class="flex flex-col items-start justify-between gap-4 border-t border-slate-200/80 bg-slate-50/70 px-6 py-6 text-[11px] text-slate-900/50 font-mono sm:flex-row sm:items-center dark:border-[#134e43] dark:bg-[#002420]/60 sm:px-8 dark:text-slate-50/50">
			<div class="leading-relaxed">
				TIPOGRAFI: GT ZIRKON &amp; GT AMERICA (GRILLI TYPE)
			</div>
			<div class="tabular-nums">
				© 2026 DINAR PERMADI YUSUP. ALL RIGHTS RESERVED.
			</div>
		</div>
	</section>
</template>
