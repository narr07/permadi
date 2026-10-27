import * as Sentry from '@sentry/nuxt'

const dsn = useRuntimeConfig().public.sentry.dsn

Sentry.init({
	dsn: dsn || undefined,
	enabled: Boolean(dsn) && !import.meta.dev,
	// Data pengunjung tidak dikirim: tanpa info pengguna/IP, cookie, isi request, dan query URL.
	dataCollection: {
		userInfo: false,
		cookies: false,
		httpHeaders: { request: { allow: ['user-agent', 'referer', 'accept-language'] }, response: false },
		httpBodies: [],
		urlQueryParams: false,
	},
	// Kuota gratis 100K transaksi per bulan; 10% kunjungan cukup untuk melihat halaman yang lambat.
	tracesSampleRate: 0.1,
	replaysSessionSampleRate: 0,
	replaysOnErrorSampleRate: 1,
})

// Replay dimuat belakangan dari CDN Sentry (diizinkan di CSP) supaya bundle awal tetap ringan, dan hanya merekam saat error.
if (dsn && !import.meta.dev) {
	Sentry.lazyLoadIntegration('replayIntegration')
		.then(replayIntegration => Sentry.addIntegration(replayIntegration({
			maskAllText: true,
			maskAllInputs: true,
			blockAllMedia: true,
		})))
		.catch(() => {})
}
