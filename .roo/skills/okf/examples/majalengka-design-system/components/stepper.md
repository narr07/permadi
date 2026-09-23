---
type: Component Spec
title: Stepper
description: Penanda langkah untuk alur pengajuan layanan, tahan reload dan bisa dimundurkan.
tags: [component, wave-1, navigation, service-flow]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Stepper

Tulang punggung [alur pengajuan layanan](/patterns/alur-pengajuan-layanan.md). Menampilkan posisi warga dalam alur, menyimpan status tiap langkah, dan tahan terhadap reload halaman.

# Schema

| Prop | Tipe | Keterangan |
|------|------|------------|
| `steps` | array | `{ id, label, status }` dengan status `todo` \| `current` \| `done` \| `error` |
| `current` | string | Id langkah aktif |
| `orientation` | `horizontal` \| `vertical` | Otomatis vertikal di bawah 640px |
| `allowBack` | boolean | Default `true`. Warga harus bisa mundur memperbaiki isian |
| `persistKey` | string | Kunci penyimpanan lokal supaya isian tidak hilang saat halaman tertutup |

# Aturan pakai

- Maksimal 5 langkah. Lebih dari itu, gabungkan atau pecah jadi dua layanan terpisah
- Label langkah memakai kata benda pendek: "Syarat", "Data diri", "Unggah berkas", "Periksa"
- Langkah yang sudah dilewati bisa diklik untuk kembali; langkah yang belum dibuka tidak bisa dilompati
- Status `error` dipasang saat langkah ditinggalkan dalam keadaan belum valid, bukan saat orang sedang mengetik

# Catatan aksesibilitas

- Dirender sebagai `<ol>` dengan `aria-current="step"` pada langkah aktif
- Perpindahan langkah memindahkan fokus ke judul langkah baru, supaya pengguna pembaca layar tahu halaman berganti
- Progres juga disampaikan dalam teks, misalnya "Langkah 2 dari 4: Data diri" — bukan hanya lewat warna lingkaran
