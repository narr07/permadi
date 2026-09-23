---
type: UX Pattern
title: Pengumuman darurat
description: Pita peringatan sitewide untuk bencana atau layanan terganggu, tetap terbaca meski CSS gagal dimuat.
tags: [pattern, emergency, resilience]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Pengumuman darurat

Pita di paling atas halaman untuk bencana atau layanan terganggu. Bisa dinyalakan dari satu tempat dan langsung muncul di semua halaman.

Syarat yang tidak biasa tapi penting: **pita ini harus tetap terbaca meski CSS gagal dimuat**. Artinya isinya ditulis sebagai teks biasa di awal dokumen HTML, bukan disuntikkan lewat JavaScript. Saat jaringan sedang buruk — persis situasi bencana — CSS dan JS adalah yang paling sering gagal sampai.

## Aturan

- Maksimal satu pengumuman darurat aktif. Kalau ada dua kejadian, gabungkan
- Isinya: apa yang terjadi, wilayah terdampak, dan satu tautan ke informasi lengkap
- Tidak bisa ditutup permanen selama masih aktif
- Warna merah `#B3261E` dengan ikon dan teks — tidak mengandalkan warna saja, sesuai [aturan warna](/foundations/color.md)
- Tanggal dan jam pembaruan selalu ditampilkan
