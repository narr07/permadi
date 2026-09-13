<script setup lang="ts">
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
		<div class="px-6 py-4 sm:px-8 sm:py-5 border-b border-slate-200/80 dark:border-[#134e43] flex items-center justify-between font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
			<div class="flex items-center gap-2.5 text-brand-700 dark:text-accent">
				<span class="w-2 h-2 rounded-none bg-brand-500 inline-block" />
				<span>06 // HUBUNGI &amp; KOLABORASI</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="w-1.5 h-1.5 rounded-none bg-brand-500 inline-block shadow-[0_0_0_2px_#ccfbf2] dark:shadow-[0_0_0_2px_rgba(20,184,152,0.2)]" />
				<span class="text-brand-600 dark:text-brand-400">TERSEDIA PROYEK</span>
			</div>
		</div>

		<!-- 12-Column Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-12">
			<!-- Left Column: Inquiries (8 Columns) -->
			<div class="lg:col-span-8 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
				<div>
					<h2 class="font-heading font-800 text-3xl sm:text-5xl lg:text-6xl tracking-[-0.03em] text-slate-900 dark:text-slate-50 leading-[0.95] text-balance mb-6">
						Tertarik berkolaborasi atau mendiskusikan sistem baru?
					</h2>

					<p class="font-sans text-sm sm:text-base text-slate-900/75 leading-relaxed max-w-[54ch] mb-8 dark:text-slate-50/75">
						Terbuka untuk konsultasi rekayasa frontend arsitektur Nuxt, pembuatan aplikasi mobile Flutter, sistem desain grafis modular, atau inisiatif teknologi pendidikan.
					</p>

					<div class="my-6">
						<a
							href="mailto:dinar@permadi.dev"
							class="group inline-flex items-center gap-3 font-mono font-bold text-2xl sm:text-4xl text-brand-700 underline underline-offset-8 decoration-brand-500/50 hover:text-brand-500 transition-colors dark:text-[#5eeacf]"
						>
							<span>dinar@permadi.dev</span>
							<span class="i-hugeicons-arrow-up-right-01 text-2xl sm:text-3xl transition-transform duration-200 group-hover:(translate-x-1.5 -translate-y-1.5)" />
						</a>
					</div>
				</div>

				<div class="font-mono text-xs text-slate-900/50 dark:text-slate-50/50 mt-8 pt-4 border-t border-slate-200/60 dark:border-[#134e43]/60">
					WAKTU RESPON RATA-RATA: 1–2 HARI KERJA // MAJALENGKA (WIB / GMT+7)
				</div>
			</div>

			<!-- Right Column: Digital Platforms & Almamater (4 Columns) -->
			<div class="lg:col-span-4 p-6 sm:p-8 lg:p-10 lg:border-l border-t lg:border-t-0 border-slate-200/80 dark:border-[#134e43] flex flex-col justify-between bg-slate-50/50 dark:bg-[#002420]/40">
				<div>
					<div class="font-mono text-[11px] font-bold tracking-[0.2em] uppercase text-slate-900/50 dark:text-slate-50/50 mb-6 pb-2 border-b border-slate-200/80 dark:border-[#134e43]">
						PLATFORM DIGITAL
					</div>

					<ul class="space-y-3 font-mono text-xs">
						<li
							v-for="s in socials"
							:key="s.name"
							class="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-[#134e43]/60"
						>
							<span class="text-slate-900/70 dark:text-slate-50/70">{{ s.name }}</span>
							<a
								:href="s.url"
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1 font-bold text-slate-900 hover:text-brand-600 transition-colors dark:text-slate-50 dark:hover:text-brand-400"
							>
								<span>@{{ s.handle }}</span>
								<span class="i-hugeicons-arrow-up-right-01 text-[11px]" />
							</a>
						</li>
					</ul>
				</div>

				<div class="mt-8 pt-4 border-t border-slate-200/80 dark:border-[#134e43] font-mono text-[10px] text-slate-900/50 dark:text-slate-50/50 uppercase leading-relaxed">
					LULUSAN UNIVERSITAS PENDIDIKAN INDONESIA (UPI) BANDUNG · PROVINSI JAWA BARAT
				</div>
			</div>
		</div>

		<!-- Swiss Colophon Strip -->
		<div class="px-6 py-6 sm:px-8 border-t border-slate-200/80 dark:border-[#134e43] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-[11px] text-slate-900/50 dark:text-slate-50/50 bg-slate-50/70 dark:bg-[#002420]/60">
			<div class="leading-relaxed">
				TIPOGRAFI: GT PRESSURA &amp; GT AMERICA (GRILLI TYPE) · KISI MODULAR 12-KOLOM
			</div>
			<div class="tabular-nums">
				© 2026 DINAR PERMADI YUSUP. ALL RIGHTS RESERVED.
			</div>
		</div>
	</section>
</template>
