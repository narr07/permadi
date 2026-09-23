---
type: Standard
title: Anggaran performa
description: Batas ukuran bundel CSS dan JS, target LCP, dan syarat nol ketergantungan pihak ketiga.
tags: [performance, budget, ci]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Anggaran performa

- Paket CSS inti terkompresi gzip maksimal **20 KB** — diperiksa otomatis lewat [perhitungan ukuran bundel](/computations/css-bundle-size.md)
- JS untuk komponen interaktif maksimal **35 KB** gzip, wajib bisa di-tree-shake per komponen
- Template bawaan harus meraih LCP di bawah **2,5 detik** pada simulasi 3G lambat
- **Nol ketergantungan pada domain pihak ketiga** saat halaman dimuat: font, ikon, dan skrip semuanya di-host sendiri

Syarat terakhir yang menjelaskan kenapa font di [tipografi](/foundations/typography.md) wajib self-host. Banyak jaringan instansi membatasi domain luar, dan halaman yang kehilangan fontnya di sana bukan masalah estetika — ukuran dan bobot huruf yang meleset langsung memukul keterbacaan.

Anggaran ini dijaga di CI dengan `size-limit`. Melebihi batas membuat build gagal, bukan sekadar peringatan.
