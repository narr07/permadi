---
type: Product Requirement
title: Pengguna design system
description: Lima peran yang akan memakai sistem ini beserta situasi kerja dan kebutuhan utamanya.
tags: [prd, audience, persona]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Pengguna

| Peran | Situasi nyatanya | Yang paling dibutuhkan |
|-------|------------------|------------------------|
| Developer instansi / vendor lokal | Dikejar tenggat, stack campur-campur, sering kerja sendirian | Copy-paste yang langsung jalan, contoh kode utuh, tanpa build step rumit |
| Desainer / mahasiswa magang | Pegang Figma, belum tentu ngerti kode | Figma library yang tokennya sinkron dengan kode |
| Admin konten dinas | Mengisi berita dan pengumuman tiap hari | Pola konten yang jelas: judul, ringkasan, lampiran, tanggal |
| Warga (pengguna akhir) | Buka lewat HP, sinyal pas-pasan, sebagian lansia | Teks terbaca, tombol besar, halaman ringan, alur jelas |
| Kontributor komunitas | Ngoding di waktu luang | Panduan kontribusi, isu berlabel good first issue, review cepat |

Kebutuhan warga dan admin konten yang menjelaskan kenapa [standar microcopy](/standards/microcopy.md) diperlakukan sebagai bagian dari sistem, bukan urusan belakangan. Kebutuhan developer vendor yang menjelaskan [anggaran performa](/architecture/performance-budget.md) dan keberadaan distribusi CDN.
