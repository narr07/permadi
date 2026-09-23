---
type: Component Spec
title: FormField
description: Pembungkus wajib untuk seluruh isian formulir — label, tanda wajib, teks bantuan, dan pesan error yang saling terhubung.
tags: [component, wave-1, form, accessibility]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# FormField

Komponen paling penting di sistem ini. Setiap isian formulir **wajib** dibungkus FormField — tidak ada Input telanjang di kode produksi. Alasannya: hubungan antara label, teks bantuan, dan pesan error adalah hal yang paling sering salah dikerjakan manual, dan dampaknya langsung ke pengguna pembaca layar.

# Schema

| Prop | Tipe | Keterangan |
|------|------|------------|
| `label` | string | Wajib. Selalu terlihat, tidak boleh diganti placeholder |
| `required` | boolean | Menampilkan penanda wajib dan mengeset `aria-required` |
| `hint` | string | Teks bantuan, dihubungkan lewat `aria-describedby` |
| `error` | string | Pesan error, dihubungkan lewat `aria-describedby` dan `aria-invalid` |
| `optionalText` | string | Alternatif: tandai yang opsional, bukan yang wajib, kalau mayoritas isian wajib |

Komponen ini yang mengurus pembuatan `id` dan penyambungan `aria-describedby` secara otomatis, sehingga developer tidak perlu memikirkannya.

# Aturan pakai

- Placeholder bukan label. Placeholder hilang saat orang mengetik, dan itu masalah bagi siapa pun yang terdistraksi di tengah pengisian
- Satu pesan error menyebut tiga hal: apa yang salah, di mana, dan cara membetulkannya
- Untuk formulir panjang, pasangkan dengan FormSummary di atas formulir supaya semua error bisa dilompati lewat tautan
- `autocomplete` diisi benar untuk data diri — ini syarat WCAG 1.3.5 dan sekaligus bikin pengisian lebih cepat

# Examples

    <MjlFormField
      label="Nomor Induk Kependudukan"
      hint="16 angka, sesuai KTP"
      :error="errors.nik"
      required
    >
      <MjlNikInput v-model="form.nik" autocomplete="off" />
    </MjlFormField>

Pesan error yang benar: "NIK harus 16 angka. Punya Anda baru 14." Yang salah: "Input tidak valid." Lihat [standar microcopy](/standards/microcopy.md).
