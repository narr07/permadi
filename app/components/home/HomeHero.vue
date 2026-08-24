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

withDefaults(
	defineProps<{
		hero?: HeroData
	}>(),
	{
		hero: () => ({}),
	},
)

const { locale } = useI18n()
</script>

<template>
	<div class="hero-card-clean group flex flex-col justify-between p-6 md:col-span-7 md:row-span-2 sm:p-8">
		<div>
			<!-- Status Dot Eyebrow -->
			<div
				v-if="hero.status"
				class="mb-6 flex items-center gap-2"
			>
				<span class="status-dot" />
				<span class="text-xs text-brand-300 font-semibold tracking-wide">
					{{ hero.status }}
				</span>
			</div>

			<!-- Kicker -->
			<span
				v-if="hero.kicker"
				class="kicker mb-2 block text-brand-400 font-medium"
			>
				{{ hero.kicker }}
			</span>

			<!-- Main Headline with Italic Accent -->
			<h2 class="mb-4 text-3xl text-white font-semibold leading-[1.02] tracking-tight font-heading sm:text-5xl">
				{{ hero.headline || (locale === 'id' ? 'Membangun antarmuka ' : 'Building useful ') }}
				<em
					v-if="hero.headline_italic"
					class="text-brand-300 font-normal font-serif italic"
				>
					{{ hero.headline_italic }}
				</em>
				{{ hero.headline_suffix || (locale === 'id' ? ' dengan ketelitian.' : ' with care.') }}
			</h2>

			<!-- Description -->
			<p
				v-if="hero.description"
				class="max-w-md text-sm text-slate-300 leading-relaxed sm:text-base"
				v-html="hero.description"
			/>

			<!-- Action Links -->
			<div
				v-if="hero.links?.length"
				class="mt-6 flex flex-wrap items-center gap-3 pt-2"
			>
				<NuxtLink
					v-for="link in hero.links"
					:key="link.to"
					:to="link.to"
					class="inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs transition-all"
					:class="link.variant === 'primary'
						? 'font-bold bg-brand-400 text-slate-950 hover:bg-brand-300 shadow-sm'
						: 'font-semibold border border-brand-400/40 text-brand-200 hover:bg-brand-950/60'"
				>
					{{ link.label }}
					<span
						v-if="link.icon"
						:class="link.icon"
						class="text-sm"
					/>
				</NuxtLink>
			</div>
		</div>

		<!-- Hero Meta Location & Timezone -->
		<div class="mt-8 flex items-center justify-between border-t border-brand-900/60 pt-4 text-xs text-brand-300">
			<span class="flex items-center gap-1">
				<span class="i-hugeicons-location-01 text-sm text-brand-300" />
				{{ hero.location || 'Majalengka, ID' }}
			</span>
			<span>{{ hero.timezone || 'GMT+7 / Local time' }}</span>
		</div>
	</div>
</template>
