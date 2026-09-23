---
type: Attested Computation
title: Rasio kontras WCAG
description: Menghitung rasio kontras antara dua warna hex menurut rumus relative luminance WCAG 2.1.
tags: [accessibility, contrast, wcag, verification]
status: draft
runtime: python
parameters:
  - { name: foreground, type: string, required: true }
  - { name: background, type: string, required: true }
  - { name: large_text, type: boolean, required: false }
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
sources:
  - id: wcag-contrast
    resource: https://www.w3.org/TR/WCAG21/#dfn-contrast-ratio
    title: WCAG 2.1 definisi contrast ratio
    author: team:w3c
---

# Computation

    def relative_luminance(hex_color):
        hex_color = hex_color.lstrip("#")
        r, g, b = (int(hex_color[i:i+2], 16) / 255 for i in (0, 2, 4))
        def channel(c):
            return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
        r, g, b = channel(r), channel(g), channel(b)
        return 0.2126 * r + 0.7152 * g + 0.0722 * b

    def contrast_ratio(foreground, background):
        l1 = relative_luminance(foreground)
        l2 = relative_luminance(background)
        lighter, darker = max(l1, l2), min(l1, l2)
        return (lighter + 0.05) / (darker + 0.05)

    def passes_aa(foreground, background, large_text=False):
        ratio = contrast_ratio(foreground, background)
        threshold = 3.0 if large_text else 4.5
        return {"ratio": round(ratio, 2), "threshold": threshold,
                "pass": ratio >= threshold}

Rumus relative luminance dan ambang 4.5:1 / 3:1 mengikuti definisi WCAG 2.1.[^wcag-contrast]

Komputasi ini yang dipakai untuk memverifikasi setiap pasangan warna di [token warna](/foundations/color.md) dan jadi dasar aturan kontras di [checklist WCAG AA](/standards/wcag-aa-checklist.md). Agen hanya mengisi `foreground`, `background`, dan `large_text` — jangan mengubah rumusnya.

[^wcag-contrast]: WCAG 2.1 definisi contrast ratio
