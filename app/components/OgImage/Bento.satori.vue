<script setup lang="ts">
	withDefaults(
		defineProps<{
			title?: string
			description?: string
			badge?: string
			category?: string
		}>(),
		{
			title: 'Permadi — Web Developer & Designer',
			description: 'Personal Portfolio, Showcase of Projects & Technical Blog of Permadi.',
			badge: 'permadi.dev',
			category: 'Portfolio & Articles',
		}
	)
</script>

<template>
	<div class="w-full h-full flex flex-col justify-between p-12 bg-[#000f0d] text-white font-sans relative overflow-hidden">
		<!-- Top Bento Header Bar -->
		<div class="flex items-center justify-between w-full">
			<!-- Logo / Badge -->
			<div class="flex items-center gap-3 px-4 py-2 rounded-full bg-[#002420] border border-[#134e43]">
				<div class="w-3 h-3 rounded-full bg-[#2bd4b5]" />
				<span class="text-sm font-semibold tracking-wider text-[#2bd4b5] uppercase">
					{{ badge }}
				</span>
			</div>

			<!-- Category / Section -->
			<div class="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-slate-300">
				{{ category }}
			</div>
		</div>

		<!-- Main Bento Content Card -->
		<div class="flex flex-col justify-center my-auto p-10 rounded-3xl bg-[#001e1a] border border-[#134e43]">
			<h1 class="text-5xl font-bold text-white tracking-tight leading-[1.15] line-clamp-2">
				{{ title }}
			</h1>
			<p v-if="description" class="text-xl text-slate-300 font-normal mt-4 line-clamp-2 leading-relaxed">
				{{ description }}
			</p>
		</div>

		<!-- Bottom Bento Footer Bar -->
		<div class="flex items-center justify-between pt-4 border-t border-white/10 w-full">
			<!-- Author Profile -->
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-xl bg-[#0d947a] flex items-center justify-center text-slate-950 font-bold text-lg">
					P
				</div>
				<div class="flex flex-col">
					<span class="text-sm font-bold text-white leading-tight">Permadi</span>
					<span class="text-xs text-[#2bd4b5] leading-tight">Web Developer & Designer</span>
				</div>
			</div>

			<!-- Bento Tech Pills -->
			<div class="flex items-center gap-2">
				<span class="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
					Nuxt 4
				</span>
				<span class="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 font-mono">
					Vue 3
				</span>
				<span class="px-3 py-1 rounded-lg bg-[#002420] border border-[#134e43] text-xs text-[#2bd4b5] font-mono">
					Bento UI
				</span>
			</div>
		</div>
	</div>
</template>
