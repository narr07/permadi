<script setup lang="ts">
interface LinkItem {
	label: string
	to: string
	icon?: string
	variant?: string
	target?: string
}

interface SpecsData {
	status_label?: string
	status?: string
	almamater_label?: string
	almamater?: string
	location_label?: string
	location?: string
}

interface HeroData {
	author_name?: string
	author_role?: string
	specs?: SpecsData
	headline?: string
	thesis?: string
	links?: LinkItem[]
}

defineProps<{
	hero?: HeroData
	headline?: string
	description?: string
}>()

const localePath = useLocalePath()
const { locale } = useI18n()
</script>

<template>
	<section class="w-full border-b border-slate-200/80 bg-white dark:border-[#134e43] dark:bg-[#001e1c]">
		<div class="grid grid-cols-1 lg:grid-cols-12">
			<!-- Identity Rail (Col 1 to 4 on Desktop) -->
			<div class="flex flex-col justify-between border-b border-slate-200/80 bg-slate-50/50 p-6 lg:col-span-4 lg:border-b-0 lg:border-r dark:border-[#134e43] dark:bg-[#002420]/50 lg:p-10 sm:p-8">
				<div>
					<h2 class="text-3xl text-slate-900 font-900 leading-tight tracking-tight font-heading sm:text-4xl dark:text-slate-50">
						{{ hero?.author_name || 'Dinar Permadi' }}
					</h2>
					<span class="mt-1 block text-xs text-brand-600 font-medium tracking-wider font-mono uppercase dark:text-brand-400">
						{{ hero?.author_role || (locale === 'id' ? 'Guru SD & Software Developer' : 'Primary School Teacher & Software Developer') }}
					</span>
				</div>

				<div class="mt-8 border-t border-slate-200/80 pt-2 dark:border-[#134e43]">
					<div class="text-xs font-mono divide-y divide-slate-200/80 dark:divide-[#134e43]">
						<div
							v-if="hero?.specs?.status"
							class="flex items-baseline justify-between gap-4 py-2.5"
						>
							<span class="text-slate-700 dark:text-slate-300">{{ hero.specs.status_label || 'STATUS' }}</span>
							<span class="text-right text-brand-600 font-bold dark:text-brand-400">{{ hero.specs.status }}</span>
						</div>

						<div
							v-if="hero?.specs?.almamater"
							class="flex items-baseline justify-between gap-4 py-2.5"
						>
							<span class="text-slate-700 dark:text-slate-300">{{ hero.specs.almamater_label || 'ALMAMATER' }}</span>
							<span class="text-right text-slate-900 dark:text-slate-50">{{ hero.specs.almamater }}</span>
						</div>

						<div
							v-if="hero?.specs?.location"
							class="flex items-baseline justify-between gap-4 py-2.5"
						>
							<span class="text-slate-700 dark:text-slate-300">{{ hero.specs.location_label || (locale === 'id' ? 'LOKASI' : 'LOCATION') }}</span>
							<span class="text-right text-slate-900 dark:text-slate-50">{{ hero.specs.location }}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Statement (Col 5 to 12 on Desktop) -->
			<div class="flex flex-col justify-between p-6 lg:col-span-8 lg:p-12 sm:p-10">
				<div>
					<h1 class="mb-8 text-balance text-3xl text-slate-900 font-900 leading-[0.96] tracking-[-0.03em] font-heading lg:text-6xl sm:text-5xl xl:text-[4.25rem] dark:text-slate-50">
						{{ hero?.headline || headline }}
					</h1>

					<p class="mb-10 max-w-[58ch] text-base text-slate-800 leading-relaxed font-sans sm:text-lg dark:text-slate-200">
						{{ hero?.thesis || description }}
					</p>
				</div>

				<div
					v-if="hero?.links && hero.links.length > 0"
					class="flex flex-wrap items-center gap-3 border-t border-slate-200/80 pt-8 sm:gap-4 dark:border-[#134e43]"
				>
					<NuxtLink
						v-for="(link, idx) in hero.links"
						:key="link.to"
						:to="localePath(link.to)"
						:class="idx === 0 ? 'bg-brand-500 text-slate-900 hover:bg-brand-400 shadow-xs' : 'border border-slate-300 dark:border-[#134e43] text-slate-900 dark:text-slate-50 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'"
						class="flex cursor-pointer items-center rounded-none px-6 py-3.5 text-xs font-bold tracking-widest font-mono uppercase transition-all duration-150 active:scale-[0.97] hover:-translate-y-0.5"
					>
						{{ link.label }}
					</NuxtLink>
				</div>
			</div>
		</div>
	</section>
</template>
