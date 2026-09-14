<script setup lang="ts">
interface LinkItem {
	label: string
	to: string
	icon?: string
	variant?: string
	target?: string
}

interface SpecsData {
	spec_title?: string
	status_label?: string
	status?: string
	almamater_label?: string
	almamater?: string
	location_label?: string
	location?: string
	time_label?: string
	timezone?: string
	coords_label?: string
	coordinates?: string
}

interface HeroData {
	section_number?: string
	issue_number?: string
	author_title?: string
	author_name?: string
	author_role?: string
	author_bio?: string
	specs?: SpecsData
	kicker?: string
	headline?: string
	thesis?: string
	description?: string
	links?: LinkItem[]
}

defineProps<{
	hero?: HeroData
	eyebrow?: string
	headline?: string
	description?: string
}>()

const localePath = useLocalePath()
const { locale } = useI18n()

// Live local time (WIB / GMT+7 Majalengka)
const currentTime = ref('')
function updateClock() {
	currentTime.value = new Intl.DateTimeFormat(locale.value === 'id' ? 'id-ID' : 'en-US', {
		timeZone: 'Asia/Jakarta',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		hour12: false,
	}).format(new Date())
}

onMounted(() => {
	updateClock()
	const timer = setInterval(updateClock, 1000)
	onUnmounted(() => clearInterval(timer))
})
</script>

<template>
	<section class="w-full border-b border-slate-200/80 bg-white dark:border-[#134e43] dark:bg-[#001e1c]">
		<div class="grid grid-cols-1 lg:grid-cols-12">
			<!-- Meta & Catalog Rail (Col 1 to 4 on Desktop) -->
			<div class="flex flex-col justify-between border-b border-slate-200/80 bg-slate-50/50 p-6 lg:col-span-4 lg:border-b-0 lg:border-r dark:border-[#134e43] dark:bg-[#002420]/50 lg:p-10 sm:p-8">
				<div>
					<!-- Section Heading Meta -->
					<div class="mb-6 flex items-center justify-between text-[11px] font-bold tracking-[0.2em] font-mono uppercase">
						<div class="flex items-center gap-2 text-brand-700 dark:text-accent">
							<span class="inline-block h-2 w-2 rounded-none bg-brand-500 shadow-[0_0_0_2px_#ccfbf2] dark:shadow-[0_0_0_2px_rgba(20,184,152,0.2)]" />
							<span>{{ hero?.section_number || '01 // MANIFEST' }}</span>
						</div>
						<span class="text-slate-900/40 tabular-nums dark:text-slate-50/40">{{ hero?.issue_number || 'N° 2026.01' }}</span>
					</div>

					<!-- Author Signature & Title -->
					<div class="my-6">
						<span class="mb-1.5 block text-[11px] text-slate-900/50 tracking-[0.15em] font-mono uppercase dark:text-slate-50/50">
							{{ hero?.author_title || (locale === 'id' ? 'PRAKTISI & PENDIDIK' : 'PRACTITIONER & EDUCATOR') }}
						</span>
						<h2 class="text-3xl text-slate-900 font-900 leading-tight tracking-tight font-heading sm:text-4xl dark:text-slate-50">
							{{ hero?.author_name || 'Dinar Permadi' }}
						</h2>
						<span class="mt-1 block text-xs text-brand-600 font-medium tracking-wider font-mono uppercase dark:text-brand-400">
							{{ hero?.author_role || (locale === 'id' ? 'Guru SD & Perajin Kode' : 'Primary School Teacher & Code Craftsman') }}
						</span>
					</div>

					<p class="max-w-[42ch] text-xs text-slate-900/70 leading-relaxed font-sans sm:text-sm dark:text-slate-50/70">
						{{ hero?.author_bio || hero?.description || description || (locale === 'id' ? 'Membawa ketelitian matematika dari ruang kelas ke dalam arsitektur web modern, presisi tata letak, dan rekayasa perangkat lunak.' : 'Bringing mathematical precision from the elementary classroom into modern web architecture, editorial layout, and software engineering.') }}
					</p>
				</div>

				<!-- Hairline Technical Parameters Spec Table -->
				<div class="mt-8 border-t border-slate-200/80 pt-6 dark:border-[#134e43]">
					<div class="mb-3 text-[10px] text-slate-900/40 tracking-[0.2em] font-mono uppercase dark:text-slate-50/40">
						{{ hero?.specs?.spec_title || (locale === 'id' ? 'SPESIFIKASI SISTEM' : 'SYSTEM SPECIFICATIONS') }}
					</div>

					<div class="text-xs font-mono divide-y divide-slate-200/80 dark:divide-[#134e43]">
						<div class="flex items-baseline justify-between py-2.5">
							<span class="text-slate-900/60 dark:text-slate-50/60">{{ hero?.specs?.status_label || 'STATUS' }}</span>
							<span class="flex items-center gap-1.5 text-brand-600 font-bold dark:text-brand-400">
								<span class="animate-status-pulse inline-block h-1.5 w-1.5 rounded-none bg-brand-500" />
								<span>{{ hero?.specs?.status || (locale === 'id' ? 'TERSEDIA PROYEK' : 'AVAILABLE FOR PROJECTS') }}</span>
							</span>
						</div>

						<div class="flex items-baseline justify-between py-2.5">
							<span class="text-slate-900/60 dark:text-slate-50/60">{{ hero?.specs?.almamater_label || 'ALMAMATER' }}</span>
							<span class="text-slate-900 tabular-nums dark:text-slate-50">{{ hero?.specs?.almamater || 'UPI Bandung' }}</span>
						</div>

						<div class="flex items-baseline justify-between py-2.5">
							<span class="text-slate-900/60 dark:text-slate-50/60">{{ hero?.specs?.location_label || (locale === 'id' ? 'LOKASI' : 'LOCATION') }}</span>
							<span class="text-slate-900 dark:text-slate-50">{{ hero?.specs?.location || 'Majalengka, ID' }}</span>
						</div>

						<div class="flex items-baseline justify-between py-2.5">
							<span class="text-slate-900/60 dark:text-slate-50/60">{{ hero?.specs?.time_label || (locale === 'id' ? 'WAKTU LOKAL' : 'LOCAL TIME') }}</span>
							<span class="text-slate-900 font-semibold tabular-nums dark:text-slate-50">{{ currentTime || '00:00:00' }} {{ hero?.specs?.timezone || 'WIB' }}</span>
						</div>

						<div class="flex items-baseline justify-between py-2.5">
							<span class="text-slate-900/60 dark:text-slate-50/60">{{ hero?.specs?.coords_label || (locale === 'id' ? 'KOORDINAT' : 'COORDINATES') }}</span>
							<span class="text-[11px] text-slate-900/60 tabular-nums dark:text-slate-50/60">{{ hero?.specs?.coordinates || "6°50'S 108°13'E" }}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Typographic Statement Field (Col 5 to 12 on Desktop) -->
			<div class="flex flex-col justify-between p-6 lg:col-span-8 lg:p-12 sm:p-10">
				<div>
					<!-- Section Kicker -->
					<div class="mb-6 flex items-center justify-between">
						<span class="text-[11px] text-brand-700 font-bold tracking-[0.2em] font-mono uppercase dark:text-accent">
							{{ hero?.kicker || (locale === 'id' ? '01.A // PRINSIP & VISI REKAYASA' : '01.A // PRINCIPLES & ENGINEERING VISION') }}
						</span>
					</div>

					<!-- Monumental Display Headline in GT Mechanik Poly -->
					<h1 class="mb-8 text-balance text-3xl text-slate-900 font-900 leading-[0.96] tracking-[-0.03em] font-heading lg:text-6xl sm:text-5xl xl:text-[4.25rem] dark:text-slate-50">
						{{ hero?.headline || headline || (locale === 'id' ? 'Menghubungkan logika berhitung, baris kode, dan ketelitian visual jadi satu cara kerja.' : 'Connecting numerical logic, clean code, and visual precision into one unified craft.') }}
					</h1>

					<!-- Thesis Paragraph in GT America -->
					<p class="mb-10 max-w-[58ch] text-base text-slate-900/80 leading-relaxed font-sans sm:text-lg dark:text-slate-50/80">
						{{ hero?.thesis || description || (locale === 'id' ? 'Sebagai guru SD di Majalengka, saya percaya cara berpikir yang sama dipakai di kelas dan di kode: rapi, tidak berbelit, dan tidak ada yang dipajang cuma buat gaya-gayaan. Prinsip itu yang saya bawa ke Nuxt 4, Flutter, dan tata letak ala tipografi Swiss: semuanya harus punya alasan, bukan hiasan.' : 'As an elementary school teacher in Majalengka, I believe the same mindset applies in the classroom and in code: clean, straightforward, and nothing added just for show. That is the principle I bring to Nuxt 4, Flutter, and Swiss typography: everything needs a reason, not just decoration.') }}
					</p>
				</div>

				<!-- Action Plates & Colophon Footer -->
				<div class="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200/80 pt-8 dark:border-[#134e43]">
					<div
						v-if="hero?.links && hero.links.length > 0"
						class="flex flex-wrap items-center gap-3 sm:gap-4"
					>
						<NuxtLink
							v-for="(link, idx) in hero.links"
							:key="link.to"
							:to="localePath(link.to)"
							:class="idx === 0 ? 'bg-brand-500 text-slate-900 hover:bg-brand-400 shadow-xs' : 'border border-slate-300 dark:border-[#134e43] text-slate-900 dark:text-slate-50 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'"
							class="group flex cursor-pointer items-center gap-2.5 rounded-none px-6 py-3.5 text-xs font-bold tracking-widest font-mono uppercase transition-all duration-150 active:scale-[0.97] hover:-translate-y-0.5"
						>
							<span>{{ link.label }}</span>
							<span
								:class="link.icon || (idx === 0 ? 'i-ph-arrow-up-right' : 'i-ph-arrow-right')"
								class="text-sm transition-transform duration-150 group-hover:(translate-x-0.5 -translate-y-0.5)"
							/>
						</NuxtLink>
					</div>
					<div
						v-else
						class="flex flex-wrap items-center gap-3 sm:gap-4"
					>
						<NuxtLink
							:to="localePath('/projek')"
							class="flex items-center gap-2.5 rounded-none bg-brand-500 px-6 py-3.5 text-xs text-slate-900 font-bold tracking-widest font-mono uppercase transition-all active:scale-[0.99] hover:bg-brand-400"
						>
							<span>{{ locale === 'id' ? 'JELAJAHI PROJEK' : 'EXPLORE PROJECTS' }}</span>
							<span class="i-ph-arrow-up-right text-sm" />
						</NuxtLink>

						<NuxtLink
							:to="localePath('/kontak')"
							class="flex items-center gap-2.5 border border-slate-300 rounded-none px-6 py-3.5 text-xs text-slate-900 font-bold tracking-widest font-mono uppercase transition-all active:scale-[0.99] dark:border-[#134e43] hover:border-brand-500 dark:text-slate-50 hover:text-brand-600 dark:hover:text-brand-400"
						>
							<span>{{ locale === 'id' ? 'MULAI DISKUSI' : 'START DISCUSSION' }}</span>
							<span class="i-ph-arrow-right text-sm" />
						</NuxtLink>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
