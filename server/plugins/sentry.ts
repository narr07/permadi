import { sentryCloudflareNitroPlugin } from '@sentry/nuxt/module/plugins'

// Di Cloudflare Workers, sentry.server.config.ts tidak dipakai; opsi dibaca per request supaya DSN dari env Worker terpakai.
export default defineNitroPlugin(sentryCloudflareNitroPlugin(() => {
	const dsn = useRuntimeConfig().public.sentry.dsn
	return {
		dsn: dsn || undefined,
		enabled: Boolean(dsn),
		dataCollection: {
			userInfo: false,
			cookies: false,
			httpHeaders: { request: { allow: ['user-agent', 'referer', 'accept-language'] }, response: false },
			httpBodies: [],
			urlQueryParams: false,
		},
		tracesSampleRate: 0.1,
	}
}))
