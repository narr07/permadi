<script setup lang="ts">
interface PhilosophyData {
	section_label?: string
	number?: string
	quote?: string
	quote_bold?: string
	description?: string
	pedagogy_tag?: string
	institution_tag?: string
	label?: string
}

interface SkillItem {
	name: string
	desc?: string
	icon?: string
}

interface SkillsData {
	matrix_label?: string
	matrix_tag?: string
	code_kicker?: string
	code_title?: string
	code_desc?: string
	code_tag?: string
	code_items?: SkillItem[]
	design_kicker?: string
	design_title?: string
	design_desc?: string
	design_tag?: string
	design_items?: SkillItem[]
}

defineProps<{
	philosophy?: PhilosophyData
	skillsData?: SkillsData
}>()

const { locale } = useI18n()
</script>

<template>
	<section class="w-full border-b border-slate-200/80 bg-white dark:border-[#134e43] dark:bg-[#001e1c]">
		<div class="grid grid-cols-1 lg:grid-cols-12">
			<!-- Philosophy & Educational Ethos (5 Columns) -->
			<div class="flex flex-col justify-between border-b border-slate-200/80 bg-slate-50/40 p-6 lg:col-span-5 lg:border-b-0 lg:border-r dark:border-[#134e43] dark:bg-[#002420]/30 lg:p-10 sm:p-8">
				<div>
					<div class="mb-6 flex items-center justify-between text-[11px] font-bold tracking-[0.2em] font-mono uppercase">
						<span class="text-brand-700 dark:text-accent">
							{{ philosophy?.section_label || '03 // DOKTRIN & FILOSOFI' }}
						</span>
						<span class="text-slate-600 tabular-nums dark:text-slate-400">
							{{ philosophy?.number || 'PRINSIP 01' }}
						</span>
					</div>

					<blockquote class="my-6">
						<p class="text-balance text-2xl text-slate-900 font-900 leading-snug tracking-tight font-heading lg:text-[2rem] sm:text-3xl dark:text-slate-50">
							“{{ philosophy?.quote || 'Desain yang baik itu tenang.' }}
							<span class="block text-brand-600 dark:text-[#5eeacf]">
								{{ philosophy?.quote_bold || 'Desain luar biasa akan selalu membekas.' }}”
							</span>
						</p>
					</blockquote>

					<p class="max-w-[44ch] text-xs text-slate-800 leading-relaxed font-sans sm:text-sm dark:text-slate-200">
						{{ philosophy?.description || (locale === 'id' ? 'Sebagai guru SD lulusan UPI di Majalengka, saya melihat bahwa matematika mengajarkan kebenaran yang tidak bisa ditawar, sedangkan tipografi mengajarkan cara menyampaikannya secara tertib, bersahaja, dan penuh rasa hormat pada pembaca.' : 'As an elementary school teacher graduated from UPI in Majalengka, I believe mathematics teaches non-negotiable truths, while typography teaches how to deliver them with order, modesty, and deep respect for the reader.') }}
					</p>
				</div>

				<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-6 text-[11px] font-mono dark:border-[#134e43]">
					<span class="text-slate-600 uppercase dark:text-slate-400">
						{{ philosophy?.pedagogy_tag || (locale === 'id' ? 'PEDAGOGI × REKAYASA DIGITAL' : 'PEDAGOGY × DIGITAL CRAFT') }}
					</span>
					<span class="text-brand-600 font-bold dark:text-brand-400">
						{{ philosophy?.institution_tag || 'UPI BANDUNG' }}
					</span>
				</div>
			</div>

			<!-- Dual Discipline Toolkit Matrix (7 Columns) -->
			<div class="flex flex-col justify-between p-6 lg:col-span-7 lg:p-10 sm:p-8">
				<div>
					<div class="mb-6 flex items-center justify-between border-b border-slate-200/80 pb-3 text-[11px] font-bold tracking-[0.2em] font-mono uppercase dark:border-[#134e43]">
						<span class="text-brand-700 dark:text-accent">
							{{ skillsData?.matrix_label || '04 // DUAL TOOLKIT MATRIX' }}
						</span>
						<span class="text-slate-600 dark:text-slate-400">
							{{ skillsData?.matrix_tag || (locale === 'id' ? 'DISIPLIN TEKNIS' : 'TECHNICAL DISCIPLINES') }}
						</span>
					</div>

					<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 divide-y divide-slate-200/80 sm:divide-x sm:divide-y-0 dark:divide-[#134e43]">
						<!-- Column A: Logic & Software Architecture -->
						<div class="sm:pr-6">
							<div class="mb-4">
								<span class="text-[11px] text-brand-600 font-bold tracking-widest font-mono uppercase dark:text-brand-400">
									{{ skillsData?.code_kicker || 'A // LOGIKA & SISTEM' }}
								</span>
								<h3 class="mt-1 text-lg text-slate-900 font-900 font-heading dark:text-slate-50">
									{{ skillsData?.code_title || 'Software Engineering' }}
								</h3>
							</div>

							<ul
								v-if="skillsData?.code_items && skillsData.code_items.length > 0"
								class="text-xs text-slate-800 font-sans space-y-3 sm:text-sm dark:text-slate-200"
							>
								<li
									v-for="(item, idx) in skillsData.code_items"
									:key="item.name"
									:class="{ 'border-b border-slate-100 pb-2.5 dark:border-[#134e43]/60': idx < skillsData.code_items.length - 1 }"
									class="flex items-start gap-2.5"
								>
									<span class="pt-0.5 text-[10px] text-brand-600 font-bold font-mono dark:text-brand-400">0{{ idx + 1 }}.</span>
									<div>
										<strong class="text-slate-900 font-semibold dark:text-slate-50">{{ item.name }}</strong>
										<span
											v-if="item.desc"
											class="block text-xs text-slate-700 dark:text-slate-300"
										>{{ item.desc }}</span>
									</div>
								</li>
							</ul>
						</div>

						<!-- Column B: Visual Aesthetics & Editorial Craft -->
						<div class="pt-6 sm:pl-6 sm:pt-0">
							<div class="mb-4">
								<span class="text-[11px] text-[#92400e] font-bold tracking-widest font-mono uppercase dark:text-[#f9bc60]">
									{{ skillsData?.design_kicker || 'B // VISUAL & GRAFIS' }}
								</span>
								<h3 class="mt-1 text-lg text-slate-900 font-900 font-heading dark:text-slate-50">
									{{ skillsData?.design_title || 'Graphic & Editorial' }}
								</h3>
							</div>

							<ul
								v-if="skillsData?.design_items && skillsData.design_items.length > 0"
								class="text-xs text-slate-800 font-sans space-y-3 sm:text-sm dark:text-slate-200"
							>
								<li
									v-for="(item, idx) in skillsData.design_items"
									:key="item.name"
									:class="{ 'border-b border-slate-100 pb-2.5 dark:border-[#134e43]/60': idx < skillsData.design_items.length - 1 }"
									class="flex items-start gap-2.5"
								>
									<span class="pt-0.5 text-[10px] text-[#92400e] font-bold font-mono dark:text-[#f9bc60]">0{{ idx + 1 }}.</span>
									<div>
										<strong class="text-slate-900 font-semibold dark:text-slate-50">{{ item.name }}</strong>
										<span
											v-if="item.desc"
											class="block text-xs text-slate-700 dark:text-slate-300"
										>{{ item.desc }}</span>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div class="mt-8 flex items-center justify-between border-t border-slate-200/80 pt-4 text-[11px] text-slate-600 font-mono dark:border-[#134e43] dark:text-slate-400">
					<span>{{ locale === 'id' ? 'PRINSIP KERJA: TIDAK ADA HIASAN TANPA FUNGSI' : 'WORKING PRINCIPLE: NO ORNAMENT WITHOUT FUNCTION' }}</span>
					<span>INDEX 03–04</span>
				</div>
			</div>
		</div>
	</section>
</template>
