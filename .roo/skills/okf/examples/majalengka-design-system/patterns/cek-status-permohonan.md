---
type: UX Pattern
title: Cek status permohonan
description: Pencarian nomor tiket dan riwayat status yang ditulis dalam bahasa manusia, bukan kode sistem.
tags: [pattern, service, status]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Cek status permohonan

Satu kolom pencarian nomor tiket, diletakkan di tempat yang gampang ketemu — idealnya di beranda instansi, bukan terkubur tiga klik ke dalam.

Hasilnya berupa Timeline dengan tanggal, status, dan unit yang menangani. Tiap status ditulis dalam bahasa manusia:

| Tulis begini | Bukan begini |
|--------------|--------------|
| Berkas sedang diperiksa petugas kecamatan | Status: VERIF_2 |
| Perlu perbaikan: foto KTP buram | Status: REJECTED |
| Selesai, dokumen bisa diambil di loket A | DONE |

Kalau status butuh tindakan dari warga, tampilkan tombol aksinya langsung di baris itu. Lihat [standar microcopy](/standards/microcopy.md) untuk aturan penulisannya.

Nomor tiket berasal dari [alur pengajuan layanan](./alur-pengajuan-layanan.md).
