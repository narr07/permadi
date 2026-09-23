---
type: Component Spec
title: Button
description: Tombol aksi dengan lima varian, tiga ukuran, dan aturan satu tombol primer per area pandang.
tags: [component, wave-1, action]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Button

Tombol untuk aksi. Kalau tujuannya berpindah halaman, pakai Link, bukan Button yang disamarkan.

# Schema

| Prop | Tipe | Default | Keterangan |
|------|------|---------|------------|
| `variant` | `primary` \| `secondary` \| `ghost` \| `danger` \| `link` | `secondary` | Varian visual |
| `size` | `sm` \| `md` \| `lg` | `md` | Tinggi 36 / 44 / 52 px |
| `loading` | boolean | `false` | Menampilkan spinner, menonaktifkan klik, mengumumkan status |
| `disabled` | boolean | `false` | Hindari bila bisa; lebih baik aktif lalu jelaskan errornya |
| `iconStart` | ikon | — | Ikon dekoratif, otomatis `aria-hidden` |
| `iconEnd` | ikon | — | Ikon dekoratif |
| `type` | `button` \| `submit` | `button` | Selalu dirender sebagai elemen `<button>` asli |

# Aturan pakai

- Maksimal satu tombol `primary` per area pandang, sesuai prinsip [kredibel & resmi](/principles/kredibel-resmi.md)
- Warna primary selalu `#0014A8` dengan teks putih, tidak boleh diganti per dinas — lihat [warna](/foundations/color.md)
- Label memakai kata kerja spesifik, mengikuti [standar microcopy](/standards/microcopy.md)
- `danger` hanya untuk aksi yang menghancurkan data dan wajib dipasangkan dengan ConfirmDialog

# Catatan aksesibilitas

- Area klik minimal 44×44 px meski labelnya pendek
- Focus ring 2px `primary-500` dengan offset 2px, tidak pernah dimatikan
- State `loading` memakai `aria-busy="true"` dan teks status yang dibacakan pembaca layar
- Tombol yang hanya berisi ikon wajib `aria-label`

# Examples

    <MjlButton variant="primary" size="lg" type="submit">
      Kirim permohonan
    </MjlButton>

    <button class="mjl-btn mjl-btn--primary mjl-btn--lg" type="submit">
      Kirim permohonan
    </button>
