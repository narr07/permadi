---
type: Component Spec
title: Table
description: Tabel data yang berubah menjadi daftar kartu di bawah 768px, bukan digulir menyamping.
tags: [component, wave-1, data-display, responsive]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Table

Keputusan penting: **di bawah 768px tabel berubah jadi daftar kartu**, bukan digulir menyamping. Gulir horizontal di HP adalah cara paling umum menyembunyikan data dari warga tanpa disadari.

# Schema

| Prop | Tipe | Keterangan |
|------|------|------------|
| `columns` | array | `{ key, label, sortable, align, priority }` |
| `rows` | array | Data baris |
| `sortBy` / `sortDir` | string | Status pengurutan, dikendalikan dari luar |
| `selectable` | boolean | Kolom checkbox pilih baris |
| `loading` | boolean | Menampilkan Skeleton, bukan layar kosong |
| `emptyState` | slot | Wajib diisi, tidak boleh tabel kosong tanpa penjelasan |
| `stickyHeader` | boolean | Kepala tabel menempel saat digulir |

`priority` pada kolom menentukan mana yang jadi judul kartu dan mana yang jadi baris detail saat tampilan kartu aktif.

# Catatan aksesibilitas

- Dirender sebagai `<table>` asli dengan `<caption>` yang menjelaskan isi tabel
- Kolom yang bisa diurutkan memakai `aria-sort` dan tombol asli di dalam `<th>`
- Saat berubah jadi kartu, urutan DOM tetap logis dan pasangan label–nilai tetap terbaca
- Angka memakai `tabular-nums` supaya kolom lurus

Untuk kebutuhan filter, pencarian, dan ekspor, pakai DataTable yang dibangun di atas komponen ini — lihat [katalog](./catalog.md).
