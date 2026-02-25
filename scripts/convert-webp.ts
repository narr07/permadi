import { execSync } from 'node:child_process'
import { readdirSync, rmSync, statSync } from 'node:fs'
import { join } from 'node:path'

// Konfigurasi folder target yang ingin dikonversi secara rekursif (otomatis mengecek subfolder)
// Path harus relatif terhadap root project ini
const TARGET_DIRECTORIES = [
  'public/article',
  'public/projects',
  'public/logo',
  'public/image', // Sesuaikan ini jika nama foldernya berbeda
]

// Kualitas WebP (0-100)
const QUALITY = 80

console.log('🚀 Memulai proses konversi gambar ke WebP...')

function convertToWebp(dirPath: string) {
  try {
    const files = readdirSync(dirPath)

    for (const file of files) {
      const fullPath = join(dirPath, file)
      const stat = statSync(fullPath)

      // Cek apakah ini folder? Jika ya, masuk ke dalamnya
      if (stat.isDirectory()) {
        convertToWebp(fullPath)
        continue
      }

      // Proses hanya file .jpg, .jpeg, dan .png
      // eslint-disable-next-line regexp/no-unused-capturing-group
      if (/\.(jpe?g|png)$/i.test(file)) {
        const ext = file.substring(file.lastIndexOf('.'))
        const newFile = file.replace(new RegExp(`${ext}$`, 'i'), '.webp')
        const newFullPath = join(dirPath, newFile)

        console.log(`⏳ Sedang memproses: ${join(dirPath, file)}`)

        try {
          // Mengeksekusi command line cwebp
          execSync(`cwebp -q ${QUALITY} "${fullPath}" -o "${newFullPath}"`, { stdio: 'pipe' })

          console.log(`✅ Berhasil: -> ${newFile}`)

          // Hapus file original setelah WebP berhasil dibuat
          rmSync(fullPath)
          console.log(`🗑️ Dihapus: File original ${file}`)
        }
        catch (error: any) {
          console.error(`❌ Gagal konversi ${file}:`, error.message)
        }
      }
    }
  }
  catch (error: any) {
    if (error.code === 'ENOENT') {
      console.warn(`⚠️ Direktori tidak ditemukan, di-skip: ${dirPath}`)
    }
    else {
      console.error(`❌ Error membaca direktori ${dirPath}:`, error)
    }
  }
}

// Jalankan untuk semua target direktori
for (const dir of TARGET_DIRECTORIES) {
  convertToWebp(dir)
}

console.log('\n🎉 Selesai! Semua gambar JPG/PNG di folder target telah dikonversi ke WebP dan file lamanya telah dihapus.')
