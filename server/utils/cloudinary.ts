// server/utils/cloudinary.ts
// Cloudinary configuration helper (auto-imported in server routes)

export function useCloudinaryConfig() {
	const config = useRuntimeConfig()
	return {
		cloudName: config.cloudinaryCloudName || process.env.NUXT_CLOUDINARY_CLOUD_NAME || 'daton7ry4',
		apiKey: config.cloudinaryApiKey || process.env.NUXT_CLOUDINARY_API_KEY || '',
		apiSecret: config.cloudinaryApiSecret || process.env.NUXT_CLOUDINARY_API_SECRET || '',
	}
}

/**
 * Build Basic Auth header for Cloudinary Admin API
 */
export function getCloudinaryAuthHeader(apiKey: string, apiSecret: string): string {
	const credentials = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
	return `Basic ${credentials}`
}
