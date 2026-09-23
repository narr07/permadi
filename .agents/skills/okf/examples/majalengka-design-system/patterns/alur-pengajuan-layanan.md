---
type: UX Pattern
title: Alur pengajuan layanan
description: Empat langkah baku pengajuan layanan online — syarat, isi data, unggah berkas, periksa dan kirim.
tags: [pattern, service, form, wave-1]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Alur pengajuan layanan

Pola inti seluruh portal. Empat langkah baku:

1. **Syarat & ketentuan** — daftar berkas yang perlu disiapkan, perkiraan lama proses, dan biaya. Ditampilkan sebelum warga mulai mengisi, bukan setelahnya
2. **Isi data** — formulir dengan [FormField](/components/form-field.md), dikelompokkan pakai Fieldset
3. **Unggah berkas** — FileUpload dengan batas ukuran dan format disebut di muka
4. **Periksa & kirim** — seluruh isian ditampilkan kembali dengan tombol "Ubah" di tiap bagian

Navigasinya memakai [Stepper](/components/stepper.md) dengan `persistKey` supaya isian tidak hilang kalau halaman tertutup di tengah jalan — hal yang sering terjadi di koneksi tidak stabil.

## Setelah kirim

Warga menerima nomor tiket yang bisa disalin dan diunduh sebagai PDF, plus penjelasan apa yang terjadi berikutnya beserta perkiraan waktunya. Nomor tiket ini yang dipakai di [cek status permohonan](./cek-status-permohonan.md).

## Kesalahan yang dicegah pola ini

- Formulir yang baru memberi tahu syarat berkas setelah warga mengisi 20 kolom
- Halaman konfirmasi yang cuma bilang "Berhasil" tanpa nomor tiket
- Isian hilang total saat sesi habis
