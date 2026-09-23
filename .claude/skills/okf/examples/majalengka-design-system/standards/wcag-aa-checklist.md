---
type: Standard
title: Checklist WCAG 2.1 AA
description: Tiga belas aturan aksesibilitas konkret beserta cara pengujiannya di CI dan secara manual.
tags: [accessibility, wcag, checklist, testing]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
sources:
  - id: wcag21
    resource: https://www.w3.org/TR/WCAG21/
    title: Web Content Accessibility Guidelines 2.1
    author: team:w3c
---

# Checklist WCAG 2.1 AA

Daftar periksa yang jadi syarat rilis tiap komponen, turunan dari prinsip [aksesibel untuk semua](/principles/aksesibel.md).[^wcag21]

# Schema

| Aspek | Aturan konkret |
|-------|----------------|
| Kontras teks | Minimal 4.5:1 teks biasa, 3:1 untuk ≥24px atau ≥19px tebal |
| Kontras non-teks | Minimal 3:1 untuk garis tepi input, ikon bermakna, batas tombol |
| Focus | Cincin 2px `primary-500` plus offset 2px, kontras ≥3:1, tidak pernah dimatikan |
| Keyboard | Semua fungsi jalan tanpa mouse, tanpa jebakan fokus, urutan Tab mengikuti urutan visual |
| Target sentuh | Minimal 44×44 px dengan jarak antar target 8px |
| Zoom | Tetap terpakai pada 200%, dan pada 400% (lebar 320px) tanpa gulir horizontal |
| Form | Label terlihat, error disebut jelas, saran perbaikan diberikan, autocomplete benar |
| Struktur | Satu H1 per halaman, urutan heading runtut, landmark terpasang |
| Gambar | Alt bermakna untuk informatif, `alt=""` untuk dekorasi, teks panjang untuk infografis |
| Media | Video wajib takarir; video sambutan pejabat wajib punya transkrip |
| Bahasa | `lang="id"` di `html`, `lang="en"` pada potongan teks Inggris |
| Gerak | `prefers-reduced-motion` dihormati, tidak ada kedipan lebih dari 3 kali per detik |
| Waktu | Sesi yang akan habis diberi peringatan dan bisa diperpanjang |

# Cara mengujinya

- **Otomatis di CI** — axe-core lewat Playwright untuk tiap cerita komponen. Pelanggaran serius membuat build gagal, bukan sekadar peringatan
- **Manual per komponen** — jalan-jalan pakai keyboard saja, lalu satu putaran dengan NVDA di Windows dan VoiceOver di iOS
- **Per rilis besar** — uji dengan pengguna nyata, minimal dua lansia dan satu pengguna pembaca layar. Ini yang menemukan masalah yang tidak terdeteksi alat apa pun
- **Kontras** — dihitung otomatis lewat [perhitungan rasio kontras](/computations/contrast-ratio.md)

Pernyataan aksesibilitas dipublikasikan di situs dokumentasi, lengkap dengan bagian yang belum memenuhi standar dan rencana perbaikannya. Jujur lebih berguna daripada klaim 100%.

[^wcag21]: Web Content Accessibility Guidelines 2.1
