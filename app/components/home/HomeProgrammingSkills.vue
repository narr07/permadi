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
			name: 'Nuxt & Vue 3',
			icon: '/icons/f-nuxt.svg',
			role: 'Web & SSR',
			desc:
				locale.value === 'id'
					? 'Arsitektur web modern, full-stack Nitro, dan optimasi performa tinggi.'
					: 'Modern web architecture, full-stack Nitro engine, and high performance.',
		},
		{
			name: 'Flutter & Dart',
			icon: '/icons/f-flutter.svg',
			role: 'Mobile App',
			desc:
				locale.value === 'id'
					? 'Aplikasi Android dan iOS dengan antarmuka responsif dan reaktif.'
					: 'Android and iOS applications with responsive, reactive interfaces.',
		},
		{
			name: 'Python',
			icon: '/icons/b-python.svg',
			role: locale.value === 'id' ? 'Logika & Data' : 'Logic & Data',
			desc:
				locale.value === 'id'
					? 'Komputasi numerik, otomasi skrip, dan pengolahan data terstruktur.'
					: 'Numerical computation, script automation, and structured data handling.',
		},
	])

	const displaySkills = computed(() => {
		if (props.skillsData?.code_items && props.skillsData.code_items.length > 0) {
			return props.skillsData.code_items
		}
		return defaultSkills.value
	})

	function isImagePath(icon?: string) {
		if (!icon)
			return false
		return icon.startsWith('/') || icon.endsWith('.svg') || icon.endsWith('.png') || icon.includes('.svg')
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
	<div class="bento-card-clean flex flex-col justify-between p-6 md:col-span-7 sm:p-7">
		<div>
			<!-- Header Card -->
			<div class="mb-3 flex items-center justify-between">
				<span class="section-label text-brand-900 dark:text-brand-300">
					{{ skillsData.code_label || (locale === 'id' ? 'Rekayasa Web & Aplikasi' : 'Web & Mobile Engineering') }}
				</span>
				<span
					class="i-hugeicons-code-folder text-base text-slate-500 dark:text-slate-400"
					aria-hidden="true"
				/>
			</div>

			<h3 class="text-2xl text-slate-900 font-semibold leading-tight font-heading sm:text-3xl dark:text-white">
				{{ skillsData.code_title || 'Nuxt, Flutter & Python' }}
			</h3>

			<p class="mt-2 text-xs text-slate-800 leading-relaxed sm:text-sm dark:text-slate-200">
				{{ skillsData.code_desc || (locale === 'id' ? 'Membangun aplikasi web performa tinggi, aplikasi mobile lintas platform, dan otomasi logika data.' : 'Crafting high-performance web apps, cross-platform mobile experiences, and data automation scripts.') }}
			</p>

			<!-- Skill Items List -->
			<div class="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
				<div
					v-for="skill in displaySkills"
					:key="skill.name"
					class="flex flex-col justify-between border border-slate-200/60 rounded-xl bg-slate-50/70 p-3.5 transition-all duration-150 sm:p-4 dark:border-slate-800/60 dark:bg-slate-800/40 hover:border-brand-500/40 dark:hover:border-brand-400/40 hover:bg-brand-50/40 dark:hover:bg-slate-800/80"
				>
					<div>
						<div class="mb-2.5 flex items-center justify-between gap-2">
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

							<span
								v-if="skill.role"
								class="shrink-0 whitespace-nowrap rounded-full bg-brand-100 px-2 py-0.5 text-[10px] text-brand-900 font-mono font-medium dark:bg-brand-950/80 dark:text-brand-300"
							>
								{{ skill.role }}
							</span>
						</div>
						<h4 class="text-sm text-slate-900 font-semibold font-heading dark:text-white">
							{{ skill.name }}
						</h4>
						<p class="mt-1 text-[11px] text-slate-700 leading-relaxed dark:text-slate-300">
							{{ skill.desc }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer Link -->
		<NuxtLink
			:to="locale === 'id' ? '/id/projek' : '/en/projects'"
			class="group mt-6 flex items-center justify-between border-t border-slate-200/60 pt-3 text-xs text-brand-900 font-bold dark:border-slate-800/60 dark:text-brand-300 hover:text-brand-950 dark:hover:text-yellow-600"
		>
			<span>{{ locale === 'id' ? 'Eksplorasi Studi Kasus Projek' : 'Explore Project Case Studies' }}</span>
			<span class="i-hugeicons-arrow-right-01 text-xs transition-transform group-hover:translate-x-0.5" />
		</NuxtLink>
	</div>
</template>
