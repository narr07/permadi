<script setup lang="ts">
defineProps<{
	eyebrow?: string
	headline?: string
	description?: string
}>()
</script>

<template>
	<header
		class="bento-card-clean relative z-10 mb-8 bg-slate-50/50 p-6 sm:mb-10 dark:bg-slate-900/40 sm:p-8"
	>
		<!-- Ambient Glow Subtle Background (Clipped inside rounded frame) -->
		<div class="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]">
			<div class="absolute h-64 w-64 rounded-full bg-brand-400/10 blur-3xl -right-16 -top-16 dark:bg-brand-400/5" />
		</div>

		<div class="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
			<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
			<div class="max-w-2xl">
				<!-- Top Bar: Eyebrow di kiri, Logo avatar di kanan (mobile) -->
				<div class="mb-3.5 flex items-center justify-between gap-3">
					<div
						v-if="eyebrow"
						class="inline-flex items-center gap-2 border border-brand-200/60 rounded-xl bg-brand-100/70 px-3 py-1 text-xs text-brand-950 font-semibold dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300"
					>
						<span class="status-dot animate-pulse" />
						<span>{{ eyebrow }}</span>
					</div>

					<!-- Logo Compact Badge di Mobile (Sejajar dengan Eyebrow) -->
					<div class="shadow-xs flex shrink-0 items-center justify-center border border-slate-200/70 rounded-xl bg-white p-1.5 md:hidden dark:border-slate-700/60 dark:bg-slate-800/80">
						<Logo :size="36" />
					</div>
				</div>

				<h1
					v-if="headline"
					class="heading-page"
				>
					{{ headline }}
				</h1>

				<p
					v-if="description"
					class="heading-page-sub"
				>
					{{ description }}
				</p>
			</div>

			<!-- Sisi Kanan: Interactive Logo Bento Widget (Desktop) -->
			<div class="hidden shrink-0 items-center justify-center md:flex">
				<div class="shadow-xs flex items-center justify-center border border-slate-200/70 rounded-2xl bg-white p-4 transition-colors duration-100 dark:border-slate-700/60 hover:border-brand-500 dark:bg-slate-800/80 dark:hover:border-brand-400">
					<Logo :size="84" />
				</div>
			</div>
		</div>
	</header>
</template>
