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

## Contoh Penggunaan

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
