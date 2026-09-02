<script setup lang="ts">
	export interface SkillItem {
		name: string
		icon?: string
		role?: string
		desc?: string
	}

	export interface SkillsSectionData {
		code_label?: string
		code_title?: string
		code_desc?: string
		code_items?: SkillItem[]
		design_label?: string
		design_title?: string
		design_desc?: string
		design_items?: SkillItem[]
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

	const defaultSkills = computed<SkillItem[]>(() => [
		{
			name: 'Illustrator',
			icon: '/icons/d-illustrator.svg',
			role: locale.value === 'id' ? 'Vektor & Brand' : 'Vector & Brand',
			desc:
				locale.value === 'id'
					? 'Desain logo presisi, tipografi, dan ilustrasi digital.'
					: 'Precision logo design, typography, and digital vectors.',
		},
		{
			name: 'Photoshop',
			icon: '/icons/d-photoshop.svg',
			role: 'Raster Craft',
			desc:
				locale.value === 'id'
					? 'Manipulasi visual raster dan pengolahan foto detail.'
					: 'Raster visual manipulation and detailed photo retouching.',
		},
		{
			name: 'Figma',
			icon: '/icons/d-figma.svg',
			role: locale.value === 'id' ? 'UI & Sistem' : 'UI & Systems',
			desc:
				locale.value === 'id'
					? 'Prototipe interaktif dan arsitektur desain komponen.'
					: 'Interactive prototyping and component design systems.',
		},
	])

	const displaySkills = computed(() => {
		if (props.skillsData?.design_items && props.skillsData.design_items.length > 0) {
			return props.skillsData.design_items
		}
		return defaultSkills.value
	})

	function isImagePath(icon?: string) {
		if (!icon)
			return false
		return icon.startsWith('/') || icon.endsWith('.svg') || icon.endsWith('.png') || icon.includes('.')
	}

	function getIconClass(icon?: string) {
		if (!icon)
			return 'i-hugeicons-quill-write-02'
		if (icon.startsWith('i-'))
			return icon
		if (icon.includes(':'))
			return `i-${icon.replace(':', '-')}`
		return `i-${icon}`
	}
</script>

<template>
	<div class="bento-card-clean flex flex-col justify-between p-6 md:col-span-5 sm:p-7">
		<div>
			<!-- Header Card -->
			<div class="mb-3 flex items-center justify-between">
				<span class="section-label text-brand-900 dark:text-brand-300">
					{{ skillsData.design_label || (locale === 'id' ? 'Desain Grafis & Antarmuka' : 'Graphic & Interface Design') }}
				</span>
				<span
					class="i-hugeicons-paint-board text-base text-slate-500 dark:text-slate-400"
					aria-hidden="true"
				/>
			</div>

			<h3 class="text-2xl text-slate-900 font-semibold leading-tight font-heading sm:text-3xl dark:text-white">
				{{ skillsData.design_title || 'Adobe Suite & Figma' }}
			</h3>

			<p class="mt-2 text-xs text-slate-800 leading-relaxed sm:text-sm dark:text-slate-200">
				{{ skillsData.design_desc || (locale === 'id' ? 'Merancang identitas visual presisi, karya grafis, dan sistem desain modern.' : 'Designing precise visual identity, raster/vector artwork, and modern design systems.') }}
			</p>

			<!-- Skill Items List -->
			<div class="mt-5 space-y-2.5">
				<div
					v-for="skill in displaySkills"
					:key="skill.name"
					class="flex items-center justify-between border border-slate-200/60 rounded-xl bg-slate-50/70 p-3 transition-all duration-150 sm:px-3.5 dark:border-slate-800/60 dark:bg-slate-800/40 hover:border-brand-500/40 dark:hover:border-brand-400/40 hover:bg-brand-50/40 dark:hover:bg-slate-800/80"
				>
					<div class="min-w-0 flex items-center gap-3">
						<img
							v-if="isImagePath(skill.icon)"
							:src="skill.icon"
							:alt="`${skill.name} icon`"
							width="32"
							height="32"
							loading="lazy"
							decoding="async"
							class="h-8 w-8 shrink-0 rounded-lg shadow-sm"
						>
						<span
							v-else
							:class="getIconClass(skill.icon)"
							class="h-8 w-8 shrink-0 flex items-center justify-center text-2xl text-brand-700 dark:text-brand-400"
						/>

						<div class="min-w-0">
							<h4 class="truncate text-sm text-slate-900 font-semibold font-heading dark:text-white">
								{{ skill.name }}
							</h4>
							<p class="truncate text-[11px] text-slate-700 dark:text-slate-300">
								{{ skill.desc }}
							</p>
						</div>
					</div>
					<span
						v-if="skill.role"
						class="ml-2 shrink-0 whitespace-nowrap rounded-full bg-brand-100 px-2 py-0.5 text-[10px] text-brand-900 font-mono font-medium dark:bg-brand-950/80 dark:text-brand-300"
					>
						{{ skill.role }}
					</span>
				</div>
			</div>
		</div>

		<!-- Footer Info -->
		<NuxtLink
			:to="locale === 'id' ? '/id/galeri' : '/en/gallery'"
			class="group mt-6 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-brand-900 font-bold dark:border-slate-800/60 dark:text-brand-300 hover:text-brand-950 dark:hover:text-accent"
		>
			<span>{{ locale === 'id' ? 'Detail Toolkit & Filosofi' : 'Detailed Toolkit & Philosophy' }}</span>
			<span class="i-hugeicons-arrow-right-01 text-xs transition-transform group-hover:translate-x-0.5" />
		</NuxtLink>
	</div>
</template>
