<script setup lang="ts">
import type { GalleryItem } from '~~/server/api/cloudinary-gallery.get'

defineProps<{
	item: GalleryItem
	index: number
}>()

defineEmits<{ open: [] }>()

const { locale } = useI18n()

// Status muat disimpan per kartu: gambar yang selesai dimuat hanya me-render ulang kartunya sendiri,
// bukan seluruh grid seperti saat statusnya disimpan di halaman
const loaded = ref(false)
</script>

<template>
	<div
		tabindex="0"
		role="button"
		:aria-label="item.title || (locale === 'id' ? 'Buka foto' : 'Open photo')"
		class="gallery-card group flex flex-col cursor-pointer select-none justify-between border-b border-slate-200/80 p-6 transition-colors duration-200 dark:border-[#134e43] hover:(bg-[#e2f4f0] dark:bg-[#003832]) sm:p-8"
		:class="[
			index % 3 !== 2 ? 'lg:border-r' : 'lg:border-r-0',
			index % 2 !== 1 ? 'md:border-r' : 'md:border-r-0',
		]"
		@click="$emit('open')"
		@keydown.enter.prevent="$emit('open')"
		@keydown.space.prevent="$emit('open')"
	>
		<div>
			<!-- Image Frame -->
			<div class="relative mb-4 aspect-[4/3] w-full overflow-hidden border border-slate-200/80 bg-slate-100 dark:border-[#134e43] dark:bg-[#001714]">
				<!-- LQIP Pixelated Placeholder, dilepas dari DOM setelah foto asli tampil -->
				<img
					v-if="!loaded"
					:src="galleryImageUrl(item.secure_url, 'placeholder')"
					alt=""
					aria-hidden="true"
					decoding="async"
					class="pointer-events-none absolute inset-0 h-full w-full object-cover"
					style="image-rendering: pixelated;"
				>

				<!-- Cloudinary mengubah ukuran dan format per lebar srcset (w_, f_auto, q_auto:eco), bukan mengirim file asli 4000px -->
				<NuxtImg
					provider="cloudinary"
					:src="item.secure_url"
					:alt="item.title || (locale === 'id' ? 'Foto galeri' : 'Gallery photo')"
					fit="coverLimit"
					quality="auto:eco"
					sizes="xs:100vw sm:100vw md:50vw lg:400px"
					decoding="async"
					class="relative z-1 h-full w-full object-cover transition-[opacity,transform] duration-500 ease-out group-hover:scale-[1.03]"
					:class="loaded ? 'opacity-100' : 'opacity-0'"
					:loading="index < 3 ? 'eager' : 'lazy'"
					:fetchpriority="index === 0 ? 'high' : 'auto'"
					@load="loaded = true"
				/>
			</div>

			<!-- Photo Details -->
			<div
				v-if="item.tags && item.tags.length"
				class="mb-2.5 flex flex-wrap gap-1.5"
			>
				<span
					v-for="tag in item.tags.slice(0, 3)"
					:key="tag"
					class="border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-700 font-mono uppercase dark:border-[#134e43] dark:text-slate-300"
				>
					#{{ tag }}
				</span>
			</div>

			<h2 class="text-base text-slate-900 font-700 leading-snug font-heading transition-colors dark:text-slate-50 group-hover:text-brand-700 dark:group-hover:text-brand-300">
				{{ item.title }}
			</h2>
		</div>
	</div>
</template>

<style scoped>
/* Kartu di luar layar tidak di-layout dan di-paint sampai mendekati viewport;
   tinggi terakhirnya diingat (auto) sehingga scrollbar tidak melompat */
.gallery-card {
	content-visibility: auto;
	contain-intrinsic-size: auto 420px;
}
</style>
