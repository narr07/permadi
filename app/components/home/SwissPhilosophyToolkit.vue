<script setup lang="ts">
interface PhilosophyData {
	section_label?: string
	quote?: string
	quote_bold?: string
	description?: string
}

interface SkillItem {
	name: string
	desc?: string
	icon?: string
}

interface SkillsData {
	matrix_label?: string
	code_title?: string
	code_items?: SkillItem[]
	design_title?: string
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
					<h2 class="mb-6 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
						{{ philosophy?.section_label || (locale === 'id' ? 'Prinsip' : 'Principles') }}
					</h2>

					<blockquote class="my-6">
						<p class="text-balance text-2xl text-slate-900 font-900 leading-snug tracking-tight font-heading lg:text-[2rem] sm:text-3xl dark:text-slate-50">
							“{{ philosophy?.quote || 'Desain yang baik itu tenang.' }}
							<span class="block text-brand-600 dark:text-[#5eeacf]">
								{{ philosophy?.quote_bold || 'Desain luar biasa akan selalu membekas.' }}”
							</span>
						</p>
					</blockquote>

					<p class="max-w-[44ch] text-xs text-slate-800 leading-relaxed font-sans sm:text-sm dark:text-slate-200">
						{{ philosophy?.description || (locale === 'id' ? 'Di matematika, hitungan itu pasti dan nggak bisa ngasal. Nah, desain dan tipografi itu cara saya nyajiinnya: tertib, ramah, dan nyaman dibaca siapa pun.' : 'Math teaches that numbers don\'t lie. Typography is how I present that clarity: tidy, welcoming, and easy for anyone to read.') }}
					</p>
				</div>
			</div>

			<!-- Dual Discipline Toolkit Matrix (7 Columns) -->
			<div class="flex flex-col justify-between p-6 lg:col-span-7 lg:p-10 sm:p-8">
				<div>
					<h2 class="mb-6 border-b border-slate-200/80 pb-3 text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:border-[#134e43] dark:text-accent">
						{{ skillsData?.matrix_label || (locale === 'id' ? 'Alat kerja' : 'Toolkit') }}
					</h2>

					<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 divide-y divide-slate-200/80 sm:divide-x sm:divide-y-0 dark:divide-[#134e43]">
						<!-- Column A: Logic & Software Architecture -->
						<div class="sm:pr-6">
							<div class="mb-4">
								<h3 class="text-lg text-slate-900 font-900 font-heading dark:text-slate-50">
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
									class="flex items-start"
								>
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
								<h3 class="text-lg text-slate-900 font-900 font-heading dark:text-slate-50">
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
									class="flex items-start"
								>
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
			</div>
		</div>
	</section>
</template>
