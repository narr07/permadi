<script setup lang="ts">
	export interface HeroLink {
		label: string
		to: string
		icon?: string
		variant?: string
	}

	export interface HeroData {
		status?: string
		kicker?: string
		headline?: string
		headline_italic?: string
		headline_suffix?: string
		description?: string
		location?: string
		timezone?: string
		links?: HeroLink[]
	}

	const props = withDefaults(
		defineProps<{
			hero?: HeroData
		}>(),
		{
			hero: () => ({}),
		}
	)

	const { locale } = useI18n()
</script>

<template>
	<div class="hero-card-clean md:col-span-7 md:row-span-2 p-6 sm:p-8 flex flex-col justify-between group">
		<div>
			<!-- Status Dot Eyebrow -->
			<div v-if="hero.status" class="flex items-center gap-2 mb-6">
				<span class="status-dot" />
				<span class="text-xs uppercase tracking-widest font-semibold text-brand-300">
					{{ hero.status }}
				</span>
			</div>

			<!-- Kicker -->
			<span v-if="hero.kicker" class="kicker text-brand-400 block mb-2 font-medium">
				{{ hero.kicker }}
			</span>

			<!-- Main Headline with Italic Accent -->
			<h2 class="font-heading font-semibold text-white text-3xl sm:text-5xl leading-[1.02] tracking-tight mb-4">
				{{ hero.headline || (locale === 'id' ? 'Membangun antarmuka ' : 'Building useful ') }}
				<em v-if="hero.headline_italic" class="font-serif italic font-normal text-brand-300">
					{{ hero.headline_italic }}
				</em>
				{{ hero.headline_suffix || (locale === 'id' ? ' dengan ketelitian.' : ' with care.') }}
			</h2>

			<!-- Description -->
			<p v-if="hero.description" class="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md">
				{{ hero.description }}
			</p>

			<!-- Action Links -->
			<div v-if="hero.links?.length" class="flex flex-wrap items-center gap-3 mt-6 pt-2">
				<NuxtLink
					v-for="link in hero.links"
					:key="link.to"
					:to="link.to"
					class="px-5 py-2.5 rounded-full text-xs transition-all inline-flex items-center gap-1.5"
					:class="link.variant === 'primary'
						? 'font-bold bg-brand-400 text-slate-950 hover:bg-brand-300 shadow-sm'
						: 'font-semibold border border-brand-400/40 text-brand-200 hover:bg-brand-950/60'"
				>
					{{ link.label }}
					<span v-if="link.icon" :class="link.icon" class="text-sm" />
					<span v-else-if="link.variant === 'primary'">↗</span>
				</NuxtLink>
			</div>
		</div>

		<!-- Hero Meta Location & Timezone -->
		<div class="mt-8 pt-4 border-t border-brand-900/60 flex items-center justify-between text-xs text-brand-400/80">
			<span class="flex items-center gap-1">
				<span class="i-hugeicons-location-01 text-sm text-brand-300" />
				{{ hero.location || 'Majalengka, ID' }}
			</span>
			<span>{{ hero.timezone || 'GMT+7 / Local time' }}</span>
		</div>
	</div>
</template>
