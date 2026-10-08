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
		description: 'Dokumentasi teknis, portofolio karya frontend, dan studi kasus desain.',
		badge: 'PERMADI.DEV',
		category: 'PUBLIKASI TEKNIS',
	},
)
</script>

<template>
	<div
		class="relative h-full w-full flex flex-col justify-between overflow-hidden bg-[#001412] p-12 text-white"
		style="font-family: 'Permadi Body', sans-serif;"
	>
		<!-- Structural Hairline Border Frame -->
		<div class="absolute inset-5 border border-[#134e43]" />

		<!-- Top Technical Spec Ledger Strip -->
		<div class="relative w-full flex items-center justify-between border-b border-[#134e43] pb-6">
			<!-- Brand Mark & Node Identity -->
			<div class="flex items-center gap-3">
				<div class="h-3 w-3 bg-[#14b898]" />
				<span
					class="text-xs text-white font-bold tracking-[0.2em] uppercase"
					style="font-family: 'Permadi Mono', monospace;"
				>
					{{ badge || 'PERMADI.DEV' }}
				</span>
			</div>

			<!-- Category Indicator Badge -->
			<div
				class="border border-[#134e43] bg-[#002420] px-4 py-1.5 text-xs text-[#14b898] font-bold tracking-[0.15em] uppercase"
				style="font-family: 'Permadi Mono', monospace;"
			>
				{{ category || 'PUBLIKASI TEKNIS' }}
			</div>
		</div>

		<!-- Central Modular Reading Canvas -->
		<div class="relative my-auto flex flex-col justify-center py-6">
			<!-- Monumental Headline (Permadi Heading) -->
			<h1
				class="line-clamp-2 text-[52px] text-white font-black leading-[1.05] tracking-[-0.03em]"
				style="font-family: 'Permadi Heading', sans-serif;"
			>
				{{ title }}
			</h1>

			<!-- Explanatory Body Copy (Permadi Body) -->
			<p
				v-if="description"
				class="line-clamp-2 mt-5 max-w-[1000px] text-[21px] text-slate-300 font-normal leading-relaxed"
				style="font-family: 'Permadi Body', sans-serif;"
			>
				{{ description }}
			</p>
		</div>

		<!-- Bottom Colophon & Architecture Matrix -->
		<div class="relative w-full flex items-center border-t border-[#134e43] pt-5">
			<!-- Author & Role Ledger -->
			<div class="flex items-center gap-4">
				<div class="h-11 w-11 flex shrink-0 items-center justify-center border border-[#134e43] bg-[#002420]">
					<span
						class="text-base text-[#14b898] font-black tracking-tighter"
						style="font-family: 'Permadi Heading', sans-serif;"
					>
						DP
					</span>
				</div>
				<div class="flex flex-col justify-center">
					<span
						class="text-sm text-white font-bold leading-snug tracking-wider uppercase"
						style="font-family: 'Permadi Mono', monospace;"
					>
						DINAR PERMADI YUSUP
					</span>
				</div>
			</div>

		</div>
	</div>
</template>
