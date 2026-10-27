import { getEnBlogSlug, getIdBlogSlug } from '~/../shared/utils/blog-slugs'

export function useLocaleSwitch() {
	const route = useRoute()
	const switchLocalePath = useSwitchLocalePath()

	function getLocaleSwitchUrl(targetLocale: 'en' | 'id'): string {
		const path = route.path || '/'

		// 1. Blog Single Post Route
		if (path.startsWith('/blog/') || path.startsWith('/id/blog/')) {
			const slugParam = (route.params.slug as string) || path.replace(/^(\/id)?\/blog\//, '').replace(/\/$/, '')
			if (slugParam) {
				if (targetLocale === 'id') {
					const idSlug = getIdBlogSlug(slugParam) || slugParam
					return `/id/blog/${idSlug}`
				}
				else {
					const enSlug = getEnBlogSlug(slugParam) || slugParam
					return `/blog/${enSlug}`
				}
			}
		}

		// 2. Project Single Post Route
		if (path.startsWith('/projects/') || path.startsWith('/id/projek/')) {
			const slugParam = (route.params.slug as string) || path.replace(/^(\/id\/projek|\/projects)\//, '').replace(/\/$/, '')
			if (slugParam) {
				return targetLocale === 'id' ? `/id/projek/${slugParam}` : `/projects/${slugParam}`
			}
		}

		// 3. Fallback to standard nuxt-i18n switcher for static pages (/about, /contact, etc.)
		const switched = switchLocalePath(targetLocale)
		if (switched) {
			return switched
		}

		return targetLocale === 'id' ? '/id' : '/'
	}

	return {
		getLocaleSwitchUrl,
	}
}

