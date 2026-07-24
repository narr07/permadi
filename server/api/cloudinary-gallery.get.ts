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
  async () => {
    const { cloudName, apiKey, apiSecret } = useCloudinaryConfig()

    if (!cloudName || !apiKey || !apiSecret) {
      throw createError({
        statusCode: 500,
        message: 'Cloudinary credentials not configured',
      })
    }

    const authHeader = getCloudinaryAuthHeader(apiKey, apiSecret)
    const allResources: CloudinaryResource[] = []
    let nextCursor: string | undefined

    // Fetch all resources using GET /resources/image/upload with prefix
    // This endpoint supports context=true and tags=true properly
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

      allResources.push(...response.resources)
      nextCursor = response.next_cursor
    } while (nextCursor)

    // Map to gallery format, sorted by created_at descending
    const galleries: GalleryItem[] = allResources
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((resource) => {
        const context = resource.context?.custom || {}

        // Extract version from public_id URL pattern
        const versionPrefix = `/v${resource.version}/`
        const imagePath = `${versionPrefix}${resource.public_id}.${resource.format}`

        // Fallback: use readable name from public_id (e.g. "gallery/isola_v1" → "Isola V1")
        const fallbackName = (resource.public_id.split('/').pop() || '')
          .replace(/[_-]/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .replace(/\b\w/g, c => c.toUpperCase())

        return {
          public_id: resource.public_id,
          title: context.caption || context.alt || resource.display_name || fallbackName || 'Permadi Gallery',
          alt: context.alt || context.caption || resource.display_name || fallbackName || 'Permadi Gallery',
          image: imagePath,
          tags: resource.tags?.length ? resource.tags : ['desainer'],
          created_at: resource.created_at,
          width: resource.width,
          height: resource.height,
        }
      })

    return galleries
  },
  {
    maxAge: 60 * 60, // Cache 1 hour
    swr: true, // Stale-while-revalidate
    name: 'cloudinary-gallery',
    getKey: () => 'gallery',
  },
)
