---
type: Design Token Set
title: Ikon, ilustrasi, dan logo
description: Set ikon basis, 40 ikon layanan lokal, gaya ilustrasi, dan aturan aksesibilitas ikon.
tags: [icons, illustration, brand]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
sources:
  - id: lucide
    resource: https://lucide.dev
    title: Lucide icon library
    author: team:lucide
---

# Ikonografi

- **Basis ikon:** Lucide (lisensi ISC), grid 24px, ketebalan garis 1.5px, ujung membulat. Dipilih karena gayanya netral dan jumlahnya cukup.[^lucide]
- **Ikon lokal:** sekitar 40 ikon yang tidak ada di set umum — KTP, KK, akta kelahiran, izin usaha, retribusi, balai desa, bumdes, lumbung. Gaya dan grid mengikuti Lucide supaya tidak terlihat tempelan.
- **Pengiriman:** SVG sprite plus paket `@majalengka/icons` dengan komponen Vue dan opsi impor satuan supaya bundelnya tidak membengkak.
- **Aksesibilitas:** ikon dekoratif diberi `aria-hidden="true"`; ikon yang berdiri sendiri sebagai tombol wajib punya `aria-label`.
- **Ilustrasi:** gaya flat dua warna (primer plus aksen mangga), bertema angin dan bentang Majalengka — kincir, awan bergaris, terasering. Dipakai di halaman kosong, error, dan hero. Tidak dipakai di halaman formulir.
- **Logo sistem:** huruf M yang dibentuk dari garis angin. Versi monokrom wajib tersedia karena akan dicetak di dokumen dinas.

[^lucide]: Lucide icon library
