---
type: Design Token Set
title: Warna
description: Skala primer dari #0014A8, netral, warna status, aksen lokal, dan aturan pemakaian yang mengikat.
tags: [tokens, color, brand, accessibility]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Warna

Basis primer `#0014A8`, biru pekat yang condong ke navy. Warna ini terbaca serius tanpa terasa dingin, dan kontrasnya di atas putih sangat aman (sekitar 13:1).

# Schema

## Primer — Biru Majalengka

| Langkah | Hex | Dipakai untuk |
|---------|-----|---------------|
| 50 | `#EEF1FF` | Latar lembut alert info, baris tabel terpilih |
| 100 | `#DDE3FF` | Latar badge |
| 200 | `#BCC7FF` | Garis tepi lembut |
| 300 | `#94A3FF` | Teks link di mode gelap |
| 400 | `#6B7DFF` | Aksen mode gelap |
| 500 | `#4256F5` | Focus ring, hover tombol ghost |
| 600 | `#2434D6` | Ikon aksen |
| **700** | **`#0014A8`** | **Tombol primer, link, header instansi, elemen aktif** |
| 800 | `#001086` | State hover tombol primer |
| 900 | `#000C63` | State pressed, footer gelap |
| 950 | `#00073A` | Latar mode gelap |

## Netral

`#FFFFFF` · `#F7F8FA` · `#EEF0F4` · `#DFE3EA` · `#C6CCD8` · `#97A0B2` · `#6B7488` · `#4C5466` · `#363D4D` · `#222834` · `#0B0E15`

Netral diberi sedikit semburat biru supaya menyatu dengan primer. Netral 400 (`#97A0B2`) **tidak boleh** dipakai untuk teks di atas latar putih — kontrasnya cuma sekitar 2,8:1. Batas aman teks sekunder adalah netral 500 ke atas. Verifikasinya lewat [perhitungan rasio kontras](/computations/contrast-ratio.md).

## Status

| Peran | Hex |
|-------|-----|
| Berhasil | `#0F7B4A` |
| Perhatian | `#A65A00` |
| Bahaya | `#B3261E` |
| Informasi | `#0B6FA4` |
| Aksen mangga | `#F0A202` |

Aksen kuning mangga adalah nada lokal untuk ilustrasi, grafik, dan penanda "baru". Jangan untuk teks di atas putih, jangan untuk tombol. Porsinya sekitar 5% dari halaman.

# Aturan pakai

- Warna tidak pernah jadi satu-satunya penanda makna. Status "ditolak" harus punya ikon dan teks, bukan cuma merah
- Tombol primer selalu primary-700 dengan teks putih. Tidak ada variasi warna tombol primer per dinas — lihat [spesifikasi Button](/components/button.md)
- Kalau instansi punya warna identitas sendiri, tempatnya di header dan aksen, bukan menimpa warna aksi dan status
- Mode kontras tinggi wajib tersedia: latar putih murni, teks `#000`, garis tepi 2px, focus ring 3px
