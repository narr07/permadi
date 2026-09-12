<script setup lang="ts">
import { Motion } from 'motion-v'
import { computed } from 'vue'

export interface SkillItem {
	name: string
	icon?: string
	role?: string
	desc?: string
}

export interface SkillsSectionData {
	code_title?: string
	code_items?: SkillItem[]
	design_title?: string
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
	<Motion
		as="div"
		:initial="{ opacity: 0, transform: 'translateY(16px)' }"
		:while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
		:transition="{ type: 'spring', stiffness: 80, damping: 20 }"
		:in-view-options="{ margin: '-60px' }"
		class="bento-card-clean flex flex-col justify-between p-6 md:col-span-7 sm:p-7"
	>
		<!-- Grid 2 Kolom: Kiri Programming, Kanan Design -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
			<!-- Kolom Kiri: Programming -->
			<div>
				<div class="mb-3 flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-slate-800/60">
					<h3 class="text-base text-slate-900 font-bold font-heading sm:text-lg dark:text-white">
						{{ skillsData.code_title || 'Programming' }}
					</h3>
					<span
						class="i-hugeicons-code-folder text-base text-brand-600 dark:text-brand-400"
						aria-hidden="true"
					/>
				</div>

				<!-- List Ikon ke Bawah -->
				<div class="flex flex-col gap-2.5">
					<div
						v-for="skill in codeSkills"
						:key="skill.name"
						class="flex items-center gap-3 border border-slate-200/70 rounded-xl bg-slate-50/70 px-3.5 py-2.5 transition-all duration-150 dark:border-slate-800/70 hover:border-brand-500/40 dark:bg-slate-800/40 hover:bg-brand-50/40 dark:hover:border-brand-400/40 dark:hover:bg-slate-800/80"
					>
						<img
							v-if="isImagePath(skill.icon)"
							:src="skill.icon"
							:alt="`${skill.name} icon`"
							width="26"
							height="26"
							loading="lazy"
							decoding="async"
							class="h-6.5 w-6.5 shrink-0 rounded-md shadow-sm"
						>
						<span
							v-else
							:class="getIconClass(skill.icon)"
							class="h-6.5 w-6.5 flex shrink-0 items-center justify-center text-lg text-brand-700 dark:text-brand-400"
						/>
						<span class="truncate text-xs text-slate-900 font-semibold font-heading sm:text-sm dark:text-white">
							{{ skill.name }}
						</span>
					</div>
				</div>
			</div>

			<!-- Kolom Kanan: Design -->
			<div>
				<div class="mb-3 flex items-center justify-between border-b border-slate-200/60 pb-2 dark:border-slate-800/60">
					<h3 class="text-base text-slate-900 font-bold font-heading sm:text-lg dark:text-white">
						{{ skillsData.design_title || 'Design' }}
					</h3>
					<span
						class="i-hugeicons-paint-board text-base text-brand-600 dark:text-brand-400"
						aria-hidden="true"
					/>
				</div>

				<!-- List Ikon ke Bawah -->
				<div class="flex flex-col gap-2.5">
					<div
						v-for="skill in designSkills"
						:key="skill.name"
						class="flex items-center gap-3 border border-slate-200/70 rounded-xl bg-slate-50/70 px-3.5 py-2.5 transition-all duration-150 dark:border-slate-800/70 hover:border-brand-500/40 dark:bg-slate-800/40 hover:bg-brand-50/40 dark:hover:border-brand-400/40 dark:hover:bg-slate-800/80"
					>
						<img
							v-if="isImagePath(skill.icon)"
							:src="skill.icon"
							:alt="`${skill.name} icon`"
							width="26"
							height="26"
							loading="lazy"
							decoding="async"
							class="h-6.5 w-6.5 shrink-0 rounded-md shadow-sm"
						>
						<span
							v-else
							:class="getIconClass(skill.icon)"
							class="h-6.5 w-6.5 flex shrink-0 items-center justify-center text-lg text-brand-700 dark:text-brand-400"
						/>
						<span class="truncate text-xs text-slate-900 font-semibold font-heading sm:text-sm dark:text-white">
							{{ skill.name }}
						</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer Link -->
		<NuxtLink
			:to="localePath(skillsData.all_link_to || '/projek')"
			class="group mt-6 flex items-center justify-between border-t border-slate-200/60 pt-3.5 text-xs text-brand-900 font-bold dark:border-slate-800/60 dark:text-brand-300 hover:text-brand-950 dark:hover:text-accent"
		>
			<span>{{ skillsData.all_link_text || (locale === 'id' ? 'Eksplorasi Semua Karya & Studi Kasus' : 'Explore All Works & Case Studies') }}</span>
			<span class="i-hugeicons-arrow-right-01 text-xs transition-transform group-hover:translate-x-0.5" />
		</NuxtLink>
	</Motion>
</template>
