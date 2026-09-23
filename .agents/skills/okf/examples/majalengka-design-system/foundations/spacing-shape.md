---
type: Design Token Set
title: Spasi, bentuk, dan breakpoint
description: Grid 4px, skala radius, breakpoint responsif, dan ukuran minimum target sentuh.
tags: [tokens, spacing, layout, touch-target]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Spasi dan bentuk

## Grid 4px

Semua jarak kelipatan 4. Ini bukan soal kerapian obsesif — begitu semua orang pakai grid yang sama, komponen dari kontributor berbeda otomatis nyambung.

    space-0: 0      space-1: 4px    space-2: 8px    space-3: 12px
    space-4: 16px   space-5: 20px   space-6: 24px   space-8: 32px
    space-10: 40px  space-12: 48px  space-16: 64px  space-20: 80px
    space-24: 96px  space-32: 128px

## Radius

| Token | Nilai | Dipakai di |
|-------|-------|------------|
| `radius-sm` | 6px | Badge, tag, checkbox |
| `radius-md` | 10px | Tombol, input, dropdown |
| `radius-lg` | 16px | Kartu, modal, panel |
| `radius-full` | 9999px | Avatar, pil status, switch |

Sudut yang terlalu bulat bikin situs terasa seperti aplikasi hiburan — bertentangan dengan prinsip [kredibel & resmi](/principles/kredibel-resmi.md). Kita berhenti di 16px untuk kartu, dan tidak memakai radius bulat penuh pada tombol.

## Breakpoint

    sm: 640px    md: 768px    lg: 1024px    xl: 1280px    2xl: 1536px

Desain dimulai dari 360px, bukan dari desktop. Mayoritas warga membuka portal lewat HP, sering HP yang tidak baru.

## Ukuran target

- Tombol dan area klik minimal **44×44 px**, termasuk ikon tutup di modal dan panah paginasi — dua tempat yang paling sering dilanggar
- Jarak antar target interaktif minimal 8px
- Tinggi input standar 44px, versi besar 52px untuk form layanan yang dipakai lansia
