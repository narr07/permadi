---
type: Design Token Set
title: Tipografi
description: Tiga keluarga huruf, skala sembilan langkah, dan aturan keterbacaan untuk konten layanan publik.
tags: [tokens, typography, readability]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Tipografi

## Pilihan huruf

| Peran | Font | Alasan |
|-------|------|--------|
| Judul | Plus Jakarta Sans | Buatan desainer Indonesia, karakternya tegas, punya bobot 800 |
| Teks isi | Inter | Sangat terbaca di ukuran kecil, mendukung angka tabular |
| Monospace | JetBrains Mono | Untuk kode, nomor registrasi, dan NIK |

Ketiganya open source dan **wajib di-self-host**. Jangan tarik dari Google Fonts CDN — banyak instansi berada di jaringan yang membatasi domain luar, dan kita tidak mau halaman kehilangan fontnya di sana. Konsekuensinya masuk ke [anggaran performa](/architecture/performance-budget.md).

# Schema

| Token | Ukuran | Tinggi baris | Pemakaian |
|-------|--------|--------------|-----------|
| `text-xs` | 12px | 1.5 | Label tabel, keterangan gambar |
| `text-sm` | 14px | 1.55 | Teks bantuan, metadata, isi tabel |
| `text-base` | 16px | 1.7 | Teks isi — jangan pernah lebih kecil untuk paragraf |
| `text-lg` | 18px | 1.65 | Paragraf pembuka, ringkasan berita |
| `text-xl` | 20px | 1.5 | Judul kartu |
| `text-2xl` | 24px | 1.35 | H3 |
| `text-3xl` | 30px | 1.3 | H2 |
| `text-4xl` | 36px | 1.22 | H1 halaman dalam |
| `text-5xl` | 48px | 1.15 | Judul hero beranda |

# Aturan keterbacaan

- Lebar baris ideal 60–75 karakter. Untuk artikel, kunci di `max-width: 68ch`
- Urutan heading tidak boleh lompat. Pembaca layar memakai urutan ini untuk navigasi
- Angka di tabel memakai `font-variant-numeric: tabular-nums` supaya kolomnya lurus
- Hindari teks rata kanan-kiri — di layar HP hasilnya jadi sungai putih yang menyulitkan pembaca disleksia
