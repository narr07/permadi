<script setup lang="ts">
	interface PhilosophyData {
		number?: string
		quote?: string
		quote_bold?: string
		label?: string
	}

	interface SkillsData {
		code_kicker?: string
		code_title?: string
		code_desc?: string
		design_kicker?: string
		design_title?: string
		design_desc?: string
	}

	defineProps<{
		philosophy?: PhilosophyData
		skillsData?: SkillsData
	}>()

	const { locale } = useI18n()
</script>

<template>
	<section class="w-full border-b border-slate-200/80 dark:border-[#134e43] bg-white dark:bg-[#001e1c]">
		<div class="grid grid-cols-1 lg:grid-cols-12">
			<!-- Philosophy & Educational Ethos (5 Columns) -->
			<div class="lg:col-span-5 p-6 sm:p-8 lg:p-10 lg:border-r border-b lg:border-b-0 border-slate-200/80 dark:border-[#134e43] flex flex-col justify-between bg-slate-50/40 dark:bg-[#002420]/30">
				<div>
					<div class="mb-6 flex items-center justify-between font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
						<span class="text-brand-700 dark:text-accent">
							03 // DOKTRIN &amp; FILOSOFI
						</span>
						<span class="text-slate-900/40 tabular-nums dark:text-slate-50/40">
							{{ philosophy?.number || 'PRINSIP 01' }}
						</span>
					</div>

					<blockquote class="my-6">
						<p class="font-heading font-700 text-2xl sm:text-3xl lg:text-[2rem] tracking-tight text-slate-900 leading-snug dark:text-slate-50 text-balance">
							“{{ philosophy?.quote || 'Desain yang baik itu tenang.' }}
							<span class="text-brand-600 block dark:text-[#5eeacf]">
								{{ philosophy?.quote_bold || 'Desain luar biasa akan selalu membekas.' }}”
							</span>
						</p>
					</blockquote>

					<p class="font-sans text-xs sm:text-sm text-slate-900/75 leading-relaxed dark:text-slate-50/75 max-w-[44ch]">
						Sebagai guru SD lulusan UPI di Majalengka, saya melihat bahwa matematika mengajarkan kebenaran yang tidak bisa ditawar, sedangkan tipografi mengajarkan cara menyampaikannya secara tertib, bersahaja, dan penuh rasa hormat pada pembaca.
					</p>
				</div>

				<div class="mt-8 pt-6 border-t border-slate-200/80 dark:border-[#134e43] flex items-center justify-between font-mono text-[11px]">
					<span class="text-slate-900/50 uppercase dark:text-slate-50/50">
						PEDAGOGI × REKAYASA DIGITAL
					</span>
					<span class="text-brand-600 font-bold dark:text-brand-400">
						UPI BANDUNG
					</span>
				</div>
			</div>

			<!-- Dual Discipline Toolkit Matrix (7 Columns) -->
			<div class="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
				<div>
					<div class="mb-6 flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-[#134e43] font-mono text-[11px] font-bold tracking-[0.2em] uppercase">
						<span class="text-brand-700 dark:text-accent">
							04 // DUAL TOOLKIT MATRIX
						</span>
						<span class="text-slate-900/40 dark:text-slate-50/40">
							DISIPLIN TEKNIS
						</span>
					</div>

					<div class="grid grid-cols-1 sm:grid-cols-2 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 dark:divide-[#134e43]">
						<!-- Column A: Logic & Software Architecture -->
						<div class="sm:pr-6">
							<div class="mb-4">
								<span class="font-mono text-[11px] text-brand-600 font-bold tracking-widest uppercase dark:text-brand-400">
									A // LOGIKA &amp; SISTEM
								</span>
								<h3 class="font-heading font-700 text-lg text-slate-900 dark:text-slate-50 mt-1">
									Software Engineering
								</h3>
							</div>

							<ul class="space-y-3 font-sans text-xs sm:text-sm text-slate-900/80 dark:text-slate-50/80">
								<li class="flex items-start gap-2.5 pb-2.5 border-b border-slate-100 dark:border-[#134e43]/60">
									<span class="font-mono text-[10px] text-brand-500 font-bold pt-0.5">01.</span>
									<div>
										<strong class="font-semibold text-slate-900 dark:text-slate-50">Nuxt 4 &amp; Vue 3</strong>
										<span class="block text-slate-900/60 text-xs dark:text-slate-50/60">SSR, Nitro Engine &amp; UnoCSS</span>
									</div>
								</li>
								<li class="flex items-start gap-2.5 pb-2.5 border-b border-slate-100 dark:border-[#134e43]/60">
									<span class="font-mono text-[10px] text-brand-500 font-bold pt-0.5">02.</span>
									<div>
										<strong class="font-semibold text-slate-900 dark:text-slate-50">Flutter &amp; Dart</strong>
										<span class="block text-slate-900/60 text-xs dark:text-slate-50/60">Cross-Platform Mobile Apps</span>
									</div>
								</li>
								<li class="flex items-start gap-2.5 pb-2.5 border-b border-slate-100 dark:border-[#134e43]/60">
									<span class="font-mono text-[10px] text-brand-500 font-bold pt-0.5">03.</span>
									<div>
										<strong class="font-semibold text-slate-900 dark:text-slate-50">Python &amp; PHP</strong>
										<span class="block text-slate-900/60 text-xs dark:text-slate-50/60">Automasi Data, API &amp; Backend</span>
									</div>
								</li>
								<li class="flex items-start gap-2.5">
									<span class="font-mono text-[10px] text-brand-500 font-bold pt-0.5">04.</span>
									<div>
										<strong class="font-semibold text-slate-900 dark:text-slate-50">Cloudflare Edge</strong>
										<span class="block text-slate-900/60 text-xs dark:text-slate-50/60">Workers, SQLite D1 &amp; Pages</span>
									</div>
								</li>
							</ul>
						</div>

						<!-- Column B: Visual Aesthetics & Editorial Craft -->
						<div class="pt-6 sm:pt-0 sm:pl-6">
							<div class="mb-4">
								<span class="font-mono text-[11px] text-[#f9bc60] font-bold tracking-widest uppercase">
									B // VISUAL &amp; GRAFIS
								</span>
								<h3 class="font-heading font-700 text-lg text-slate-900 dark:text-slate-50 mt-1">
									Graphic &amp; Editorial
								</h3>
							</div>

							<ul class="space-y-3 font-sans text-xs sm:text-sm text-slate-900/80 dark:text-slate-50/80">
								<li class="flex items-start gap-2.5 pb-2.5 border-b border-slate-100 dark:border-[#134e43]/60">
									<span class="font-mono text-[10px] text-[#f9bc60] font-bold pt-0.5">01.</span>
									<div>
										<strong class="font-semibold text-slate-900 dark:text-slate-50">Adobe Illustrator</strong>
										<span class="block text-slate-900/60 text-xs dark:text-slate-50/60">Identitas Vektor &amp; Grid Geometris</span>
									</div>
								</li>
								<li class="flex items-start gap-2.5 pb-2.5 border-b border-slate-100 dark:border-[#134e43]/60">
									<span class="font-mono text-[10px] text-[#f9bc60] font-bold pt-0.5">02.</span>
									<div>
										<strong class="font-semibold text-slate-900 dark:text-slate-50">Adobe Photoshop</strong>
										<span class="block text-slate-900/60 text-xs dark:text-slate-50/60">Komposisi Raster &amp; Media Ajar</span>
									</div>
								</li>
								<li class="flex items-start gap-2.5 pb-2.5 border-b border-slate-100 dark:border-[#134e43]/60">
									<span class="font-mono text-[10px] text-[#f9bc60] font-bold pt-0.5">03.</span>
									<div>
										<strong class="font-semibold text-slate-900 dark:text-slate-50">Figma UI Architecture</strong>
										<span class="block text-slate-900/60 text-xs dark:text-slate-50/60">Design Token &amp; Komponen Reka</span>
									</div>
								</li>
								<li class="flex items-start gap-2.5">
									<span class="font-mono text-[10px] text-[#f9bc60] font-bold pt-0.5">04.</span>
									<div>
										<strong class="font-semibold text-slate-900 dark:text-slate-50">Tipografi &amp; Tata Letak Swiss</strong>
										<span class="block text-slate-900/60 text-xs dark:text-slate-50/60">Hirarki ruang, presisi teks, dan kejelasan baca</span>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="mt-8 pt-4 border-t border-slate-200/80 dark:border-[#134e43] font-mono text-[11px] text-slate-900/50 dark:text-slate-50/50 flex items-center justify-between">
					<span>{{ locale === 'id' ? 'PRINSIP KERJA: TIDAK ADA HIASAN TANPA FUNGSI' : 'WORKING PRINCIPLE: NO ORNAMENT WITHOUT FUNCTION' }}</span>
					<span>INDEX 03–04</span>
				</div>
			</div>
		</div>
	</section>
</template>
