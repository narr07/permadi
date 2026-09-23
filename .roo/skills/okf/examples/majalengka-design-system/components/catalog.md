---
type: Component Catalog
title: Katalog 64 komponen
description: Daftar lengkap komponen sistem dibagi enam kelompok dan tiga gelombang rilis.
tags: [components, catalog, scope]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Katalog komponen

64 komponen, tiga gelombang. Gelombang 1 (32 komponen) adalah isi rilis v1.0 — tanpa itu portal layanan tidak bisa dibangun.

## Dasar

| Komponen | Catatan | Gel. |
|----------|---------|------|
| Button | 5 varian, 3 ukuran, state loading — lihat [spesifikasi](./button.md) | 1 |
| IconButton | Wajib `aria-label`, area klik 44px meski ikonnya 20px | 1 |
| Link | inline, standalone, eksternal dengan keterangan buka tab baru | 1 |
| Text / Heading | Pembungkus skala tipografi, ganti tag tanpa ganti tampilan | 1 |
| Icon | ukuran 16/20/24/32, mewarisi `currentColor` | 1 |
| Badge | status permohonan: draft, diproses, ditolak, selesai — selalu ikon plus teks | 1 |
| Tag / Chip | bisa dihapus, bisa diklik sebagai filter | 2 |
| Avatar | foto, inisial, ikon; grup bertumpuk | 2 |
| Divider | horizontal, vertikal, dengan label tengah | 1 |
| Spinner | wajib `role="status"` plus teks tersembunyi | 1 |
| Skeleton | berhenti berkedip saat reduced-motion | 2 |
| Tooltip | tidak boleh menyimpan informasi penting; muncul juga saat fokus keyboard | 2 |
| Kbd | penanda tombol keyboard di dokumentasi | 3 |

## Formulir

Bagian paling penting. Layanan publik pada dasarnya adalah formulir, dan di sinilah warga paling sering gagal.

| Komponen | Catatan | Gel. |
|----------|---------|------|
| FormField | Pembungkus wajib — lihat [spesifikasi](./form-field.md) | 1 |
| Input | text, email, tel, number, password, search; prefix/suffix | 1 |
| Textarea | tinggi otomatis, penghitung karakter | 1 |
| Select | versi native lebih dulu; di HP kelas bawah jauh lebih andal | 1 |
| Combobox | pencarian, pemuatan async, pola ARIA penuh; untuk data kecamatan/desa | 2 |
| Checkbox | tunggal, grup, state setengah tercentang | 1 |
| Radio | grup vertikal/horizontal, varian kartu untuk pilihan layanan | 1 |
| Switch | hanya untuk pengaturan yang langsung berlaku | 2 |
| DatePicker | wajib ada input teks manual berdampingan; format `dd/mm/yyyy` | 2 |
| FileUpload | info format dan ukuran maksimum di depan, pratinjau, progres | 1 |
| NikInput | 16 digit, pengelompokan visual, validasi checksum, mode mono | 2 |
| CurrencyInput | format rupiah saat mengetik, nilai mentah tetap angka | 2 |
| OtpInput | 6 kotak, tempel otomatis terisi, autofill SMS | 3 |
| Fieldset | pengelompokan dengan `<legend>` asli | 1 |
| FormSummary | daftar error di atas form, tiap baris jadi tautan ke isiannya | 1 |

## Navigasi

| Komponen | Catatan | Gel. |
|----------|---------|------|
| SkipLink | "Langsung ke konten" — komponen pertama yang harus jadi | 1 |
| GovBanner | pita "Situs resmi Pemerintah Kabupaten Majalengka" | 1 |
| Header | logo instansi, pencarian, pengalih bahasa, menu utama | 1 |
| NavMenu | mega menu desktop, drawer mobile, fokus terkunci saat terbuka | 1 |
| Sidebar | bisa dilipat, penanda halaman aktif, untuk dashboard petugas | 2 |
| Breadcrumb | `nav` plus `aria-current`, pemendekan di tengah untuk mobile | 1 |
| Tabs | garis bawah dan pil, panah kiri/kanan, bisa digulir | 2 |
| Pagination | versi lengkap dan ringkas, keterangan "Halaman 3 dari 12" | 1 |
| Stepper | inti alur pengajuan — lihat [spesifikasi](./stepper.md) | 1 |
| Footer | identitas, kontak, PPID, pengaduan, pernyataan aksesibilitas | 1 |
| CommandPalette | pencarian cepat layanan untuk petugas | 3 |
| BackToTop | muncul setelah 2 layar, tidak menutupi tombol aksi | 3 |

## Umpan balik dan overlay

| Komponen | Catatan | Gel. |
|----------|---------|------|
| Alert | 4 nada, bisa ditutup, `role="alert"` hanya untuk yang mendesak | 1 |
| Toast | minimal 6 detik, jeda saat disorot, wajib ada padanan permanen | 2 |
| Modal | fokus terkunci, Esc menutup, fokus balik ke pemicu | 1 |
| Drawer | kiri/kanan/bawah, perilaku fokus sama seperti modal | 2 |
| ConfirmDialog | tombol menyebut aksinya, bukan "Ya/Tidak" | 1 |
| Popover | diposisikan otomatis, menutup saat klik di luar | 2 |
| Progress | batang dan lingkaran, ada teks persentase | 2 |
| EmptyState | ilustrasi, penjelasan, satu aksi lanjutan | 1 |
| ErrorPage | 404, 403, 500, dan halaman pemeliharaan | 1 |
| OfflineBar | penanda koneksi putus — sering terjadi di daerah | 3 |

## Tampilan data

| Komponen | Catatan | Gel. |
|----------|---------|------|
| Table | responsif jadi kartu di bawah 768px — lihat [spesifikasi](./table.md) | 1 |
| DataTable | Table plus filter, pencarian, paginasi, ekspor CSV/XLSX | 2 |
| Card | dasar, berita, layanan, statistik | 1 |
| DescriptionList | pasangan label–nilai untuk rincian permohonan | 1 |
| Accordion | untuk FAQ, pakai `details` asli bila memungkinkan | 1 |
| Timeline | riwayat status permohonan dengan tanggal dan petugas | 2 |
| StatCard | angka besar, label, tren, sumber data dan tanggal pembaruan | 2 |
| ChartFrame | pembungkus grafik plus tabel data padanan yang bisa dibuka | 3 |
| MapFrame | pembungkus peta plus daftar teks lokasi sebagai alternatif | 3 |
| FileList | jenis berkas, ukuran, tanggal — informasi yang selalu hilang di situs dinas | 1 |
| Gallery | grid foto plus lightbox yang bisa ditutup dengan Esc | 3 |

## Tata letak

| Komponen | Catatan | Gel. |
|----------|---------|------|
| Container | lebar maksimum 1280px, padding responsif | 1 |
| Stack / Cluster | penata jarak berbasis token | 1 |
| Grid | 12 kolom, gap dari token, reflow otomatis | 1 |
| PageHeader | judul, deskripsi, breadcrumb, aksi | 1 |
| Section | blok konten beserta jarak vertikal bakunya | 2 |
| AspectRatio | mencegah pergeseran tata letak saat gambar dimuat | 2 |
