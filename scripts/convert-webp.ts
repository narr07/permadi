import { execSync } from 'node:child_process'
import { readdirSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'

// Folder target yang akan dipindai secara rekursif (relatif terhadap root project)
const TARGET_DIRECTORIES = [
	'public/article',
	'public/projects',
	'public/logo',
	'public/images',
]

// Kualitas konversi WebP (0-100)
const QUALITY = 80

console.log('🚀 Memulai proses konversi gambar ke WebP...')

// Helper untuk konversi gambar (mencoba Sharp dulu, fallback ke cwebp CLI jika Sharp tidak tersedia)
async function processImageToWebp(fullPath: string, newFullPath: string): Promise<void> {
	try {
		const sharp = (await import('sharp')).default
		await sharp(fullPath)
			.webp({ quality: QUALITY })
			.toFile(newFullPath)
	}
	catch {
		// Fallback menggunakan binary cwebp CLI
		execSync(`cwebp -q ${QUALITY} "${fullPath}" -o "${newFullPath}"`, { stdio: 'pipe' })
	}
}

async function convertToWebp(dirPath: string) {
	try {
		const files = readdirSync(dirPath)

		for (const file of files) {
			const fullPath = join(dirPath, file)
			const stat = statSync(fullPath)

			// Jika sub-folder, lakukan pemindaian rekursif
			if (stat.isDirectory()) {
				await convertToWebp(fullPath)
				continue
			}

			// Filter hanya format gambar non-webp (jpg, jpeg, png, avif, tiff, gif)
			if (/\.(jpe?g|png|avif|tiff|gif)$/i.test(file)) {
				const ext = file.substring(file.lastIndexOf('.'))
				const newFile = file.replace(new RegExp(`${ext}$`, 'i'), '.webp')
				const newFullPath = join(dirPath, newFile)

				console.log(`⏳ Sedang mengonversi: ${join(dirPath, file)}`)

				try {
					await processImageToWebp(fullPath, newFullPath)
					console.log(`✅ Berhasil -> ${newFile}`)

					// Hapus file lama setelah berhasil dikonversi
					rmSync(fullPath)
					console.log(`🗑️ Dihapus file original: ${file}`)
				}
				catch (error: any) {
					console.error(`❌ Gagal konversi ${file}:`, error.message)
				}
			}
		}
	}
	catch (error: any) {
		if (error.code === 'ENOENT') {
			// Folder tidak ada, lewati
		}
		else {
			console.error(`❌ Error membaca direktori ${dirPath}:`, error.message)
		}
	}
}

async function main() {
	for (const dir of TARGET_DIRECTORIES) {
		await convertToWebp(dir)
	}
	console.log('\n🎉 Selesai! Semua gambar di folder target telah dikonversi ke WebP dan file aslinya telah dibersihkan.')
}

main()
