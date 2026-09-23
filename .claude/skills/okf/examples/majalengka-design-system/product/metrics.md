---
type: Metric
title: Metrik keberhasilan
description: Tujuh metrik target enam bulan pertama beserta cara pengukurannya.
tags: [prd, metrics, kpi]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
stale_after: 2027-03-17
---

# Metrik keberhasilan

| Metrik | Target 6 bulan | Cara ukur |
|--------|----------------|-----------|
| Instansi/situs yang mengadopsi | ≥ 5 | Daftar pengguna di repo + pencarian domain |
| Skor aksesibilitas template | ≥ 95 rata-rata | Lighthouse CI tiap malam |
| Waktu bangun halaman layanan | ≤ 4 jam | Uji waktu dengan 3 developer |
| Kontributor aktif | ≥ 8 | Statistik GitHub |
| Cakupan dokumentasi | 100% komponen rilis | Cek otomatis di CI |
| Ukuran CSS inti | ≤ 20 KB gzip | [Perhitungan anggaran CSS](/computations/css-bundle-size.md) |
| Waktu respons PR pertama | ≤ 3 hari kerja | Laporan bulanan |

Metrik adopsi adalah yang paling penting. Sistem yang secara teknis sempurna tapi tidak dipakai siapa-siapa tetap gagal — lihat [risiko](./risks.md).
