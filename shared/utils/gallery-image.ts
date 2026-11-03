// Varian gambar galeri disusun dari secure_url Cloudinary, bukan dikirim satu per satu oleh API:
// lima URL per foto sempat menjadi lebih dari separuh payload halaman galeri
const GALLERY_TRANSFORMS = {
	// LQIP pixelate (~8 KB) selama foto asli dimuat
	placeholder: 'c_limit,w_300,e_pixelate:20,f_auto,q_auto:eco',
	// Pratinjau modal (~80-120 KB)
	preview: 'c_limit,w_1080,f_auto,q_auto:eco',
	// Resolusi penuh HD
	full: 'c_limit,w_1920,f_auto,q_auto:good',
} as const

export type GalleryImageVariant = keyof typeof GALLERY_TRANSFORMS

export function galleryImageUrl(secureUrl: string, variant: GalleryImageVariant): string {
	return secureUrl.replace('/image/upload/', `/image/upload/${GALLERY_TRANSFORMS[variant]}/`)
}

/** fl_attachment membuat Cloudinary mengirim file sebagai unduhan, dengan nama dari public_id */
export function galleryDownloadUrl(secureUrl: string, publicId: string): string {
	const filename = (publicId.split('/').pop() || 'permadi_artwork').replace(/[^\w-]/g, '_')
	return secureUrl.replace('/image/upload/', `/image/upload/fl_attachment:${filename}/`)
}
