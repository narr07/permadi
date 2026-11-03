<script setup lang="ts">
interface ToolLink {
	name: string
	url: string
	icon?: string
}

interface ToolkitItem {
	name: string
	desc?: string
	tools?: ToolLink[]
}

defineProps<{
	items: ToolkitItem[]
	newTabLabel: string
}>()
</script>

<template>
	<ul class="text-xs text-slate-800 font-sans sm:text-sm dark:text-slate-200">
		<li
			v-for="item in items"
			:key="item.name"
			class="flex items-start justify-between gap-4 border-b border-slate-100 py-3 last:border-b-0 dark:border-[#134e43]/60 first:pt-0 last:pb-0"
		>
			<div class="min-w-0">
				<strong class="block text-slate-900 font-semibold dark:text-slate-50">{{ item.name }}</strong>
				<span
					v-if="item.desc"
					class="block text-xs text-slate-700 dark:text-slate-300"
				>{{ item.desc }}</span>
			</div>

			<!-- Ikon rata kanan membentuk satu kolom lurus antarbaris; ubin mengikuti set /icons/*.svg (latar #042f27, sudut 23%) -->
			<ul
				v-if="item.tools?.length"
				class="flex shrink-0 gap-1.5"
			>
				<li
					v-for="tool in item.tools"
					:key="tool.url"
				>
					<a
						:href="tool.url"
						:title="tool.name"
						target="_blank"
						rel="noopener"
						class="block rounded-[23%] outline-offset-2 transition-transform focus-visible:outline-2 hover:outline-1 focus-visible:outline-brand-500 hover:outline-brand-500 focus-visible:outline-solid hover:outline-solid hover:-translate-y-0.5 dark:hover:outline-[#5eeacf]"
					>
						<img
							v-if="tool.icon?.startsWith('/')"
							:src="tool.icon"
							alt=""
							aria-hidden="true"
							width="28"
							height="28"
							loading="lazy"
							decoding="async"
							class="block h-7 w-7"
						>
						<span
							v-else-if="tool.icon"
							aria-hidden="true"
							class="h-7 w-7 flex items-center justify-center rounded-[23%] bg-[#042f27] text-[14px] text-[#5eeacf]"
						>
							<FileTypeIcon :icon="tool.icon" />
						</span>
						<span class="sr-only">{{ tool.name }} {{ newTabLabel }}</span>
					</a>
				</li>
			</ul>
		</li>
	</ul>
</template>
