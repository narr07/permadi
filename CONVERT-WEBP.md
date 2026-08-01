# Cara Konversi Gambar ke WebP

## Prasyarat

Pastikan `cwebp` sudah terinstall:

```bash
# Cek apakah sudah ada
which cwebp

# Jika belum, install via Homebrew (macOS)
brew install webp
```

## Konversi Semua Gambar dalam Satu Folder

### JPG → WebP

```bash
# Ganti <FOLDER> dengan path folder yang diinginkan
cd <FOLDER>

for f in *.jpg *.jpeg; do
  [ -f "$f" ] && cwebp -q 80 "$f" -o "${f%.*}.webp" && echo "✓ $f → ${f%.*}.webp"
done
```

### PNG → WebP

```bash
cd <FOLDER>

for f in *.png; do
  [ -f "$f" ] && cwebp -q 80 "$f" -o "${f%.*}.webp" && echo "✓ $f → ${f%.*}.webp"
done
```

### Semua Format Sekaligus (JPG + PNG)

```bash
cd <FOLDER>

for f in *.jpg *.jpeg *.png; do
  [ -f "$f" ] && cwebp -q 80 "$f" -o "${f%.*}.webp" && echo "✓ $f → ${f%.*}.webp"
done
```

## Penggunaan di Windows (cwebp di C:\cwebp\bin)

Jika Anda menggunakan sistem operasi Windows dan menginstal `cwebp` di `C:\cwebp\bin`, Anda dapat menggunakan script PowerShell (`.ps1`) atau script Batch (`.bat`) yang sudah disediakan di root folder.

Secara default, script ini akan memproses semua gambar (.png, .jpg, .jpeg) di dalam **seluruh subfolder** `public/` (seperti `public/article/`, `public/projects/`, dll.) secara otomatis, tetapi **mengabaikan** file gambar yang terletak langsung di folder utama `public/` (seperti `logo.png` atau system icon).

### 1. Menggunakan PowerShell Script

Anda dapat menggunakan script `convert-webp.ps1` yang ada di root project.

Jalankan script ini di terminal PowerShell di folder root project:

```powershell [Terminal]
# Konversi gambar di semua subfolder public/ secara otomatis (akan meminta konfirmasi hapus file asli)
.\convert-webp.ps1

# Konversi dan langsung hapus file asli tanpa bertanya
.\convert-webp.ps1 -DeleteSource

# Konversi dengan folder atau kualitas khusus
.\convert-webp.ps1 -Folder "public/article" -Quality 85
```

### 2. Menggunakan Batch File (.bat)

Anda juga dapat menjalankan file `convert-webp.bat` langsung dari folder root project dengan double-click atau lewat CMD:

```cmd [Terminal]
convert-webp.bat
```


## Contoh Penggunaan (macOS/Linux)


```bash
# Konversi semua gambar di folder public/article
cd /Users/user/Koding/Website/permadi/public/article

for f in *.jpg *.jpeg *.png; do
  [ -f "$f" ] && cwebp -q 80 "$f" -o "${f%.*}.webp" && echo "✓ $f → ${f%.*}.webp"
done
```

## Hapus File Lama Setelah Konversi

```bash
# Hapus semua JPG dan PNG setelah yakin WebP sudah benar
rm -f *.jpg *.jpeg *.png
```

## Opsi Quality (`-q`)

| Nilai | Keterangan |
|-------|------------|
| `80`  | **Rekomendasi** — keseimbangan kualitas & ukuran |
| `90`  | Kualitas tinggi, ukuran lebih besar |
| `70`  | Ukuran kecil, sedikit kehilangan detail |

## Catatan Penting

- Setelah konversi, **update semua referensi** di frontmatter (`.md`) atau kode (`.vue`) dari `.jpg`/`.png` ke `.webp`
- WebP rata-rata **60-70% lebih kecil** dari JPG dengan kualitas visual yang sama
- Semua browser modern sudah mendukung WebP
