<script setup lang="ts">
defineProps<{
	eyebrow?: string
	headline?: string
	description?: string
}>()
</script>

<template>
	<div class="grid grid-cols-1 mb-4 items-stretch gap-4 md:grid-cols-12 sm:mb-8 sm:gap-5">
		<!-- Card 1: Text Intro dengan Eyebrow di Dalamnya (Kiri, col-span-8) -->
		<header class="bento-card-clean relative z-10 flex flex-col justify-between bg-slate-50/70 p-6 md:col-span-8 dark:bg-slate-900/60 sm:p-8">
			<div>
				<!-- Eyebrow Badge menyatu di dalam card utama -->
				<div
					v-if="eyebrow"
					class="mb-4 inline-flex items-center gap-2 border border-brand-200/60 rounded-full bg-brand-100/70 px-3.5 py-1 text-xs text-brand-950 tracking-tight font-mono dark:border-brand-800/60 dark:bg-brand-950 dark:text-accent"
				>
					<span class="status-dot" />
					<span>{{ eyebrow }}</span>
				</div>

				<h1
					v-if="headline"
					class="heading-page"
				>
					{{ headline }}
				</h1>

				<p
					v-if="description"
					class="mt-3 heading-page-sub max-w-2xl text-sm"
				>
					{{ description }}
				</p>
			</div>
		</header>

		<!-- Card 2: Logo Card Terpisah (Kanan, col-span-4) -->
		<div class="bento-card-clean relative z-10 h-full flex items-center justify-center bg-slate-50/70 p-6 md:col-span-4 dark:bg-slate-900/60 sm:p-8">
			<Logo
				:size="180"
				:interactive="true"
			/>
		</div>
	</div>
</template>

<style scoped></style>
