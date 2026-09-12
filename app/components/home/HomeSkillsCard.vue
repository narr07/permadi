<script setup lang="ts">
import { computed } from 'vue'

export interface SkillItem {
	name: string
	icon?: string
	role?: string
	desc?: string
}

export interface SkillsSectionData {
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
	all_link_text?: string
	all_link_to?: string
}

const props = withDefaults(
	defineProps<{
		skillsData?: SkillsSectionData
	}>(),
	{
		skillsData: () => ({}),
	},
)

const { locale } = useI18n()
const localePath = useLocalePath()

const defaultCodeSkills: SkillItem[] = [
	{ name: 'Nuxt & Vue 3', icon: '/icons/f-nuxt.svg' },
	{ name: 'Flutter & Dart', icon: '/icons/f-flutter.svg' },
	{ name: 'Python', icon: '/icons/b-python.svg' },
]

const defaultDesignSkills: SkillItem[] = [
	{ name: 'Illustrator', icon: '/icons/d-illustrator.svg' },
	{ name: 'Photoshop', icon: '/icons/d-photoshop.svg' },
	{ name: 'Figma', icon: '/icons/d-figma.svg' },
]

const codeSkills = computed(() => {
	if (props.skillsData?.code_items && props.skillsData.code_items.length > 0) {
		return props.skillsData.code_items
	}
	return defaultCodeSkills
})

const designSkills = computed(() => {
	if (props.skillsData?.design_items && props.skillsData.design_items.length > 0) {
		return props.skillsData.design_items
	}
	return defaultDesignSkills
})

function isImagePath(icon?: string) {
	if (!icon)
		return false
	return icon.startsWith('/') || icon.endsWith('.svg') || icon.endsWith('.png') || icon.includes('.')
}

function getIconClass(icon?: string) {
	if (!icon)
		return 'i-hugeicons-code-folder'
	if (icon.startsWith('i-'))
		return icon
	if (icon.includes(':'))
		return `i-${icon.replace(':', '-')}`
	return `i-${icon}`
}
</script>

<template>
	<div class="flex flex-col gap-4 md:col-span-5 sm:gap-5 justify-between">
		<!-- Card 1: Programming -->
		<div class="bento-card-clean flex flex-col justify-between p-5 sm:p-6 flex-1">
			<div class="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 items-center">
				<!-- Sisi Kiri: Context & Judul -->
				<div class="sm:col-span-7 flex flex-col justify-between">
					<div>
						<h3 class="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
							{{ skillsData.code_title || 'Programming' }}
						</h3>
						<p class="mt-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
							{{ skillsData.code_desc || (locale === 'id' ? 'Membangun aplikasi web full-stack performa tinggi, aplikasi mobile lintas platform, dan otomasi logika data.' : 'Crafting high-performance web systems, cross-platform mobile apps, and data automation.') }}
						</p>
					</div>

					<div class="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
						<span class="status-dot" />
						<span>{{ skillsData.code_tag || (locale === 'id' ? 'Ekosistem Modern' : 'Modern Ecosystem') }}</span>
					</div>
				</div>

				<!-- Sisi Kanan: Daftar Chip Skill Vertikal Rapi -->
				<div class="sm:col-span-5 flex flex-col sm:items-end gap-2">
					<div
						v-for="skill in codeSkills"
						:key="skill.name"
						class="flex w-full sm:w-[155px] items-center gap-2.5 border border-slate-200/70 rounded-xl bg-slate-50/80 px-2.5 py-2 transition-all dark:border-slate-800/70 dark:bg-slate-800/40 hover:border-brand-500/40 dark:hover:border-brand-400/40"
					>
						<img
							v-if="isImagePath(skill.icon)"
							:src="skill.icon"
							:alt="`${skill.name} icon`"
							width="20"
							height="20"
							loading="lazy"
							decoding="async"
							class="h-5 w-5 shrink-0 rounded"
						>
						<span
							v-else
							:class="getIconClass(skill.icon)"
							class="h-5 w-5 flex shrink-0 items-center justify-center text-base text-brand-700 dark:text-brand-400"
						/>
						<span class="truncate text-xs font-semibold font-heading text-slate-900 dark:text-white">
							{{ skill.name }}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Card 2: Design -->
		<div class="bento-card-clean flex flex-col justify-between p-5 sm:p-6 flex-1">
			<div class="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 items-center">
				<!-- Sisi Kiri: Context & Judul -->
				<div class="sm:col-span-7 flex flex-col justify-between">
					<div>
						<h3 class="text-lg sm:text-xl font-bold font-heading text-slate-900 dark:text-white leading-tight">
							{{ skillsData.design_title || 'Design' }}
						</h3>
						<p class="mt-1.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
							{{ skillsData.design_desc || (locale === 'id' ? 'Merancang identitas visual presisi, karya grafis raster/vektor, dan desain antarmuka modern.' : 'Designing precision visual identity, raster/vector artwork, and modern interface systems.') }}
						</p>
					</div>

					<div class="mt-3 flex items-center gap-1.5 text-[11px] font-mono text-slate-500 dark:text-slate-400">
						<span class="status-dot" />
						<span>{{ skillsData.design_tag || (locale === 'id' ? 'Presisi & Harmoni' : 'Precision & Harmony') }}</span>
					</div>
				</div>

				<!-- Sisi Kanan: Daftar Chip Skill Vertikal Rapi -->
				<div class="sm:col-span-5 flex flex-col sm:items-end gap-2">
					<div
						v-for="skill in designSkills"
						:key="skill.name"
						class="flex w-full sm:w-[155px] items-center gap-2.5 border border-slate-200/70 rounded-xl bg-slate-50/80 px-2.5 py-2 transition-all dark:border-slate-800/70 dark:bg-slate-800/40 hover:border-brand-500/40 dark:hover:border-brand-400/40"
					>
						<img
							v-if="isImagePath(skill.icon)"
							:src="skill.icon"
							:alt="`${skill.name} icon`"
							width="20"
							height="20"
							loading="lazy"
							decoding="async"
							class="h-5 w-5 shrink-0 rounded"
						>
						<span
							v-else
							:class="getIconClass(skill.icon)"
							class="h-5 w-5 flex shrink-0 items-center justify-center text-base text-brand-700 dark:text-brand-400"
						/>
						<span class="truncate text-xs font-semibold font-heading text-slate-900 dark:text-white">
							{{ skill.name }}
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>


