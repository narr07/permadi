<script setup lang="ts">
	defineProps<{
		eyebrow?: string
		headline?: string
		description?: string
	}>()

	function onHeaderMouseMove(e: MouseEvent) {
		const target = e.currentTarget as HTMLElement
		if (!target) return
		const rect = target.getBoundingClientRect()
		target.style.setProperty('--x', `${e.clientX - rect.left}px`)
		target.style.setProperty('--y', `${e.clientY - rect.top}px`)
	}
</script>

<template>
	<header
		class="bento-card-clean bento-spotlight relative z-10 p-6 sm:p-8 mb-8 sm:mb-10 bg-slate-50/50 dark:bg-slate-900/40"
		@mousemove="onHeaderMouseMove"
	>
		<!-- Ambient Glow Subtle Background (Clipped inside rounded frame) -->
		<div class="absolute inset-0 rounded-[20px] overflow-hidden pointer-events-none">
			<div class="absolute -right-16 -top-16 w-64 h-64 bg-brand-400/10 dark:bg-brand-400/5 rounded-full blur-3xl" />
		</div>

		<div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
			<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
			<div class="max-w-2xl">
				<!-- Top Bar: Eyebrow di kiri, Logo avatar di kanan (mobile) -->
				<div class="flex items-center justify-between gap-3 mb-3.5">
					<div
						v-if="eyebrow"
						class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100/70 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60"
					>
						<span class="status-dot animate-pulse" />
						<span>{{ eyebrow }}</span>
					</div>

					<!-- Logo Compact Badge di Mobile (Sejajar dengan Eyebrow) -->
					<div class="md:hidden shrink-0 p-1.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-xs flex items-center justify-center">
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
			<div class="hidden md:flex shrink-0 items-center justify-center">
				<div class="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/60 shadow-xs flex items-center justify-center hover:border-brand-500 dark:hover:border-brand-400 transition-colors duration-100">
					<Logo :size="84" />
				</div>
			</div>
		</div>
	</header>
</template>
