---
type: Design Token Set
title: Gerak, elevasi, dan lapisan
description: Token durasi dan easing, empat tingkat bayangan, skala z-index, serta kepatuhan pada prefers-reduced-motion.
tags: [tokens, motion, elevation, z-index]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Gerak

    duration-instant: 0ms     duration-fast: 150ms
    duration-normal: 250ms    duration-slow: 400ms

    ease-standard: cubic-bezier(.2,0,0,1)
    ease-enter:    cubic-bezier(0,0,0,1)
    ease-exit:     cubic-bezier(.3,0,1,1)

Gerak hanya untuk menjelaskan sesuatu: dari mana panel muncul, ke mana item hilang. Tidak ada animasi masuk saat halaman dimuat, tidak ada elemen yang bergerak sendiri.

# Examples

    @media (prefers-reduced-motion: reduce){
      *,*::before,*::after{
        animation-duration:.01ms !important;
        transition-duration:.01ms !important;
        scroll-behavior:auto !important;
      }
    }

Kepatuhan ini termasuk syarat rilis di [definition of done](/standards/definition-of-done.md).

# Elevasi

| Token | Nilai | Untuk |
|-------|-------|-------|
| `shadow-none` | — | Kartu di dalam kartu; pakai garis tepi saja |
| `shadow-sm` | `0 1px 2px rgba(11,14,21,.06)` | Kartu, tabel |
| `shadow-md` | `0 4px 12px rgba(11,14,21,.08)` | Dropdown, popover |
| `shadow-lg` | `0 16px 40px rgba(11,14,21,.14)` | Modal, drawer |

Bayangan dibuat tipis dan rendah saturasi. Bayangan tebal bikin tampilan terasa seperti template tahun 2015.

# Lapisan

    base: 0   ·   dropdown: 1000   ·   sticky: 1100   ·   overlay: 1200
    modal: 1300   ·   popover: 1400   ·   toast: 1500   ·   tooltip: 1600

Angka acak seperti `z-index: 99999` dilarang di kode sistem ini. Kalau butuh lapisan baru, tambahkan tokennya.
