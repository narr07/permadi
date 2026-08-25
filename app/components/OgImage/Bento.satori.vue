<script setup lang="ts">
withDefaults(
	defineProps<{
		title?: string
		description?: string
		badge?: string
		category?: string
	}>(),
	{
		title: 'Permadi | Web Developer & Designer',
		description: 'Personal Portfolio, Showcase of Projects & Technical Blog of Permadi.',
		badge: 'permadi.dev',
		category: 'Portfolio & Articles',
	},
)
</script>

<template>
	<div class="relative h-full w-full flex flex-col justify-between overflow-hidden bg-[#000f0d] p-12 text-white font-sans">
		<!-- Top Bento Header Bar -->
		<div class="w-full flex items-center justify-between">
			<!-- Logo / Badge -->
			<div class="flex items-center gap-3 border border-[#134e43] rounded-full bg-[#002420] px-4 py-2">
				<div class="h-3 w-3 rounded-full bg-[#2bd4b5]" />
				<span class="text-sm text-[#2bd4b5] font-semibold tracking-wider uppercase">
					{{ badge }}
				</span>
			</div>

			<!-- Category / Section -->
			<div class="border border-white/10 rounded-full bg-white/5 px-4 py-1.5 text-xs text-slate-300 font-medium">
				{{ category }}
			</div>
		</div>

		<!-- Main Bento Content Card -->
		<div class="my-auto flex flex-col justify-center border border-[#134e43] rounded-3xl bg-[#001e1a] p-10">
			<h1 class="line-clamp-2 text-5xl text-white font-bold leading-[1.15] tracking-tight">
				{{ title }}
			</h1>
			<p
				v-if="description"
				class="line-clamp-2 mt-4 text-xl text-slate-300 font-normal leading-relaxed"
			>
				{{ description }}
			</p>
		</div>

		<!-- Bottom Bento Footer Bar -->
		<div class="w-full flex items-center justify-between border-t border-white/10 pt-4">
			<!-- Author Profile -->
			<div class="flex items-center gap-3">
				<div class="h-10 w-10 flex shrink-0 items-center justify-center overflow-hidden border border-[#134e43] rounded-full bg-[#002420]">
					<img
						src="/logo.png"
						width="40"
						height="40"
						class="h-10 w-10 rounded-full object-cover"
						alt="Permadi Logo"
					>
				</div>
				<div class="flex flex-col">
					<span class="text-sm text-white font-bold leading-tight">Permadi</span>
					<span class="text-xs text-[#2bd4b5] leading-tight">Web Developer & Designer</span>
				</div>
			</div>

			<!-- Bento Tech Pills -->
			<div class="flex items-center gap-2">
				<span class="border border-white/10 rounded-lg bg-white/5 px-3 py-1 text-xs text-slate-300 font-mono">
					Nuxt 4
				</span>
				<span class="border border-white/10 rounded-lg bg-white/5 px-3 py-1 text-xs text-slate-300 font-mono">
					Vue 3
				</span>
				<span class="border border-[#134e43] rounded-lg bg-[#002420] px-3 py-1 text-xs text-[#2bd4b5] font-mono">
					Bento UI
				</span>
			</div>
		</div>
	</div>
</template>
