// server/utils/cloudinary.ts
// Cloudinary configuration helper (auto-imported in server routes)

export function useCloudinaryConfig() {
  const config = useRuntimeConfig()
  return {
    cloudName: config.cloudinaryCloudName,
    apiKey: config.cloudinaryApiKey,
    apiSecret: config.cloudinaryApiSecret,
  }
}

/**
 * Build Basic Auth header for Cloudinary Admin API
 */
export function getCloudinaryAuthHeader(apiKey: string, apiSecret: string): string {
  const credentials = btoa(`${apiKey}:${apiSecret}`)
  return `Basic ${credentials}`
}
