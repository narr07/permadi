---
type: Product Requirement
title: Risiko dan mitigasi
description: Enam risiko utama proyek beserta penanganan yang sudah disepakati.
tags: [prd, risk]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Risiko

| Risiko | Dampak | Penanganan |
|--------|--------|------------|
| Dibangun, tapi tidak ada yang pakai | Tinggi | Gandeng satu dinas sebagai mitra percontohan sejak Fase 0, bukan setelah v1.0 jadi |
| Bergantung pada satu orang | Tinggi | Dokumentasi arsitektur, minimal dua maintainer sebelum v1.0, semua keputusan ditulis di repo |
| Vendor menolak karena stack-nya beda | Sedang | Paket CSS murni dan distribusi CDN jadi jalur utama, bukan pelengkap |
| Aksesibilitas dikorbankan saat dikejar tenggat | Sedang | Uji a11y jadi syarat merge di CI, tidak bisa dilewati manual |
| Ruang lingkup melar | Sedang | Daftar non-tujuan di [ringkasan produk](./overview.md) dipakai sebagai alat tolak |
| Bentrok dengan standar nasional yang terbit belakangan | Rendah | Arsitektur berbasis token bikin penyesuaian cukup di satu berkas |
