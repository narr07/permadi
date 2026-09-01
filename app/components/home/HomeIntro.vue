<script setup lang="ts">
defineProps<{
	eyebrow?: string
	headline?: string
	description?: string
}>()
</script>

<template>
	<header
		class="bento-card-clean relative z-10 mb-8 bg-slate-50/70 p-6 sm:mb-10 dark:bg-slate-900/60 sm:p-8"
	>
		<div class="flex flex-col justify-between gap-6 md:flex-row md:items-center">
			<!-- Sisi Kiri: Eyebrow + Judul + Deskripsi -->
			<div class="max-w-2xl">
				<!-- Top Bar: Eyebrow di kiri, Logo di kanan pada tampilan mobile -->
				<div class="mb-3.5 flex items-center justify-between gap-3">
					<div
						v-if="eyebrow"
						class="inline-flex items-center gap-2 border border-brand-200/60 rounded-xl bg-brand-100/70 px-3 py-1 text-xs text-brand-950 font-semibold dark:border-brand-800/60 dark:bg-brand-950 dark:text-brand-300"
					>
						<span class="status-dot animate-pulse" />
						<span>{{ eyebrow }}</span>
					</div>

					<!-- Logo Compact Badge di Mobile -->
					<div class="shadow-xs flex shrink-0 items-center justify-center border border-slate-200/70 rounded-xl bg-white p-1.5 md:hidden dark:border-slate-700/60 dark:bg-slate-800/80">
						<Logo :size="48" />
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
				<div class="shadow-xs flex items-center justify-center border border-slate-200/70 rounded-2xl bg-white p-5 transition-colors duration-100 dark:border-slate-700/60 hover:border-brand-500 dark:bg-slate-800/80 dark:hover:border-brand-400">
					<Logo :size="200" />
				</div>
			</div>
		</div>
	</header>
</template>
