// server/api/cloudinary-gallery.get.ts
// Fetches all images from the 'gallery' folder in Cloudinary with metadata

interface CloudinaryResource {
	public_id: string
	asset_id: string
	display_name?: string
	format: string
	version: number
	resource_type: string
	created_at: string
	width: number
	height: number
	bytes: number
	secure_url: string
	context?: {
		custom?: Record<string, string>
	}
	tags?: string[]
}

interface CloudinaryListResponse {
	resources: CloudinaryResource[]
	next_cursor?: string
}

export interface GalleryItem {
	public_id: string
	title: string
	alt: string
	image: string
	tags: string[]
	created_at: string
	width: number
	height: number
}

export default defineCachedEventHandler(
	async (_event) => {
		const { cloudName, apiKey, apiSecret } = useCloudinaryConfig()

		if (!cloudName || !apiKey || !apiSecret) {
			// Fallback jika API key belum diisi di .env
			console.warn('[Cloudinary Gallery] Cloudinary credentials not fully configured in environment.')
			return []
		}

		try {
			const authHeader = getCloudinaryAuthHeader(apiKey, apiSecret)
			const allResources: CloudinaryResource[] = []
			let nextCursor: string | undefined

			// Fetch all resources using GET /resources/image/upload with prefix
			do {
				const params = new URLSearchParams({
					prefix: 'gallery',
					type: 'upload',
					context: 'true',
					tags: 'true',
					max_results: '500',
				})

				if (nextCursor) {
					params.set('next_cursor', nextCursor)
				}

				const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?${params.toString()}`

				const response = await $fetch<CloudinaryListResponse>(url, {
					method: 'GET',
					headers: {
						Authorization: authHeader,
					},
				})

				if (response && response.resources) {
					allResources.push(...response.resources)
				}
				nextCursor = response?.next_cursor
			} while (nextCursor)

			// Map to gallery format, sorted by created_at descending
			const galleries: GalleryItem[] = allResources
				.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
				.map((resource) => {
					const context = resource.context?.custom || {}

					// Extract version from public_id URL pattern
					const versionPrefix = resource.version ? `v${resource.version}/` : ''

					// Direct CDN Delivery URLs with automatic WebP/AVIF format & smart eco compression
					// Cloudinary transforms once and caches forever on CDN (0 extra API calls / transformation credits)
					const thumbnailCdnUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_800,f_auto,q_auto:eco/${versionPrefix}${resource.public_id}.${resource.format}`
					const fullCdnUrl = `https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_1920,f_auto,q_auto:good/${versionPrefix}${resource.public_id}.${resource.format}`

					// Fallback: use readable name from public_id (e.g. "gallery/isola_v1" -> "Isola V1")
					const fallbackName = (resource.public_id.split('/').pop() || '')
						.replace(/[_-]/g, ' ')
						.replace(/\s+/g, ' ')
						.trim()
						.replace(/\b\w/g, c => c.toUpperCase())

					return {
						public_id: resource.public_id,
						title: context.caption || context.alt || resource.display_name || fallbackName || 'Permadi Gallery',
						alt: context.alt || context.caption || resource.display_name || fallbackName || 'Permadi Gallery',
						image: thumbnailCdnUrl,
						full_image: fullCdnUrl,
						secure_url: resource.secure_url,
						tags: resource.tags?.length ? resource.tags : ['desainer'],
						created_at: resource.created_at,
						width: resource.width,
						height: resource.height,
					}
				})

			return galleries
		}
		catch (err: any) {
			console.error('[Cloudinary Gallery Error]:', err?.message || err)
			return []
		}
	},
	{
		maxAge: 60 * 60 * 24, // Cache 24 hours on server/edge (Drastically saves Cloudinary API calls)
		swr: true, // Stale-while-revalidate for instantaneous responses
		name: 'cloudinary-gallery',
		getKey: () => 'gallery-all',
	},
)
