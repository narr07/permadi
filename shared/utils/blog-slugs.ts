// AUTO-GENERATED from content/en/blog and content/id/blog
// DO NOT EDIT MANUALLY - Automatically synced during build/dev
export interface BlogSlugPair {
	id: number
	en: string
	idSlug: string
}

export const BLOG_SLUG_PAIRS: BlogSlugPair[] = [
	{
		"id": 1,
		"en": "accelerated-learning-fast-learning-methods",
		"idSlug": "accelerated-learning-cara-belajar-cepat"
	},
	{
		"id": 2,
		"en": "history-of-accelerated-learning",
		"idSlug": "sejarah-accelerated-learning"
	},
	{
		"id": 3,
		"en": "position-of-accelerated-learning-education",
		"idSlug": "kedudukan-accelerated-learning-pendidikan"
	},
	{
		"id": 4,
		"en": "accelerated-learning-merdeka-curriculum",
		"idSlug": "accelerated-learning-kurikulum-merdeka"
	},
	{
		"id": 5,
		"en": "rpp-accelerated-learning-master-sd-1-pertemuan",
		"idSlug": "rpp-accelerated-learning-master-sd-1-pertemuan"
	},
	{
		"id": 6,
		"en": "differences-approach-model-strategy-method-technique-learning",
		"idSlug": "perbedaan-pendekatan-model-strategi-metode-teknik-pembelajaran"
	},
	{
		"id": 7,
		"en": "history-of-ttf-otf-fonts",
		"idSlug": "sejarah-font-ttf-otf"
	},
	{
		"id": 8,
		"en": "introduction-to-nuxt-js-vue-framework-ssr-ssg",
		"idSlug": "mengenal-nuxt-js-framework-vue-ssr-ssg"
	},
	{
		"id": 9,
		"en": "what-is-swiss-style-design",
		"idSlug": "apa-itu-swiss-style-design"
	},
	{
		"id": 10,
		"en": "history-evolution-indonesia-curriculum",
		"idSlug": "sejarah-perkembangan-kurikulum-di-indonesia"
	},
	{
		"id": 11,
		"en": "guide-to-graphic-and-ui-design-styles",
		"idSlug": "mengenal-jenis-gaya-desain-grafis-dan-ui"
	},
	{
		"id": 12,
		"en": "modern-backend-architecture-edge-serverless",
		"idSlug": "arsitektur-backend-modern-edge-serverless"
	},
	{
		"id": 13,
		"en": "types-of-innovative-learning-models",
		"idSlug": "macam-macam-model-pembelajaran-inovatif"
	},
	{
		"id": 14,
		"en": "project-based-learning-guide-and-syntax",
		"idSlug": "project-based-learning-dan-sintaks-pjbl"
	},
	{
		"id": 15,
		"en": "problem-based-learning-stages-and-syntax",
		"idSlug": "penerapan-problem-based-learning-dan-sintaks-pbl"
	},
	{
		"id": 16,
		"en": "discovery-learning-and-inquiry-stages-for-class",
		"idSlug": "sintaks-discovery-learning-dan-inquiry-di-kelas"
	},
	{
		"id": 17,
		"en": "nuxt-ui-modern-design-guide",
		"idSlug": "nuxt-ui-panduan-desain-modern"
	},
	{
		"id": 18,
		"en": "nuxt-content-and-technical-seo",
		"idSlug": "nuxt-content-dan-technical-seo"
	},
	{
		"id": 19,
		"en": "backend-architecture-and-nuxt-integration",
		"idSlug": "arsitektur-backend-dan-integrasi-nuxt"
	},
	{
		"id": 20,
		"en": "how-to-install-flutter-without-android-studio-in-2026",
		"idSlug": "cara-install-flutter-tanpa-android-studio-di-tahun-2026"
	},
	{
		"id": 21,
		"en": "syntax-problem-based-learning",
		"idSlug": "sintaks-problem-based-learning"
	},
	{
		"id": 22,
		"en": "career-guide-ui-ux-designer",
		"idSlug": "panduan-karier-ui-ux-designer"
	},
	{
		"id": 23,
		"en": "what-is-a-web-developer-guide",
		"idSlug": "panduan-apa-itu-web-developer"
	},
	{
		"id": 24,
		"en": "effective-and-efficient-study-methods",
		"idSlug": "cara-belajar-efektif-dan-efisien"
	},
	{
		"id": 25,
		"en": "primary-secondary-tertiary-color-wheel",
		"idSlug": "lingkaran-warna-primer-sekunder-tersier"
	},
	{
		"id": 26,
		"en": "understanding-web-developer-role",
		"idSlug": "peran-dan-profesi-website-developer"
	},
	{
		"id": 27,
		"en": "kinesthetic-learning-methods",
		"idSlug": "cara-belajar-kinestetik-adalah"
	},
	{
		"id": 28,
		"en": "graphic-logo-design-principles",
		"idSlug": "prinsip-grafis-logo-modern"
	},
	{
		"id": 29,
		"en": "color-theory-in-visual-arts",
		"idSlug": "teori-warna-dalam-seni-rupa"
	},
	{
		"id": 30,
		"en": "headless-nuxt-wordpress-guide",
		"idSlug": "integrasi-headless-nuxt-wordpress"
	},
	{
		"id": 31,
		"en": "critical-thinking-equation-algebra",
		"idSlug": "berpikir-kritis-diberikan-persamaan"
	}
]

const enToIdMap = new Map<string, string>()
const idToEnMap = new Map<string, string>()

for (const p of BLOG_SLUG_PAIRS) {
	enToIdMap.set(p.en, p.idSlug)
	idToEnMap.set(p.idSlug, p.en)
}

export function getIdBlogSlug(enSlug: string): string | undefined {
	return enToIdMap.get(enSlug)
}

export function getEnBlogSlug(idSlug: string): string | undefined {
	return idToEnMap.get(idSlug)
}

export function isEnBlogSlug(slug: string): boolean {
	return enToIdMap.has(slug)
}

export function isIdBlogSlug(slug: string): boolean {
	return idToEnMap.has(slug)
}
