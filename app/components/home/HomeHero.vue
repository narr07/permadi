<script setup lang="ts">
import { motion } from 'motion-v'

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
	<motion.div
		:initial="{ opacity: 0, y: 20 }"
		:animate="{ opacity: 1, y: 0 }"
		:transition="{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }"
		class="group hero-card-clean flex flex-col justify-between p-6 md:col-span-7 md:row-span-2 sm:p-8"
	>
		<div>
			<motion.div
				v-if="hero.status"
				:initial="{ opacity: 0, x: -8 }"
				:animate="{ opacity: 1, x: 0 }"
				:transition="{ duration: 0.4, delay: 0.1 }"
				class="mb-6 flex items-center gap-2"
			>
				<span class="status-dot" />
				<span class="text-xs text-brand-300 font-semibold tracking-wide">
					{{ hero.status }}
				</span>
			</motion.div>

			<motion.span
				v-if="hero.kicker"
				:initial="{ opacity: 0, y: 8 }"
				:animate="{ opacity: 1, y: 0 }"
				:transition="{ duration: 0.4, delay: 0.15 }"
				class="mb-2 block kicker text-brand-400 font-medium"
			>
				{{ hero.kicker }}
			</motion.span>

			<motion.h2
				:initial="{ opacity: 0, y: 12 }"
				:animate="{ opacity: 1, y: 0 }"
				:transition="{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }"
				class="mb-4 text-3xl text-white font-semibold leading-[1.02] tracking-tight font-heading sm:text-5xl"
			>
				{{ hero.headline || (locale === 'id' ? 'Membangun antarmuka ' : 'Building useful ') }}
				<em
					v-if="hero.headline_italic"
					class="text-brand-300 font-normal font-serif italic"
				>
					{{ hero.headline_italic }}
				</em>
				{{ hero.headline_suffix || (locale === 'id' ? ' dengan ketelitian.' : ' with care.') }}
			</motion.h2>

			<motion.p
				v-if="hero.description"
				:initial="{ opacity: 0, y: 10 }"
				:animate="{ opacity: 1, y: 0 }"
				:transition="{ duration: 0.45, delay: 0.25 }"
				class="max-w-md text-sm text-slate-300 leading-relaxed sm:text-base"
				v-html="hero.description"
			/>

			<motion.div
				v-if="hero.links?.length"
				:initial="{ opacity: 0, y: 10 }"
				:animate="{ opacity: 1, y: 0 }"
				:transition="{ duration: 0.45, delay: 0.3 }"
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
			</motion.div>
		</div>

		<div class="mt-8 flex items-center justify-between border-t border-brand-900/60 pt-4 text-xs text-brand-300">
			<span class="flex items-center gap-1">
				<span class="i-hugeicons-location-01 text-sm text-brand-300" />
				{{ hero.location || 'Majalengka, ID' }}
			</span>
			<span>{{ hero.timezone || 'GMT+7 / Local time' }}</span>
		</div>
	</motion.div>
</template>
