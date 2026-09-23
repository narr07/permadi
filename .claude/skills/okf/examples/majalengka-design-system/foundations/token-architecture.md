---
type: Design Token Set
title: Arsitektur design token
description: Tiga tingkat penamaan token, konvensi penamaan, struktur berkas sumber, dan target build.
tags: [tokens, architecture, style-dictionary]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
sources:
  - id: dtcg
    resource: https://tr.designtokens.org/format/
    title: W3C Design Tokens Format Module
    author: team:design-tokens-cg
---

# Arsitektur token

Turunan langsung dari prinsip [framework-agnostic](/principles/framework-agnostic.md).

## Tiga tingkat penamaan

| Tingkat | Contoh | Boleh dipakai langsung? |
|---------|--------|-------------------------|
| Global — nilai mentah | `--mjl-blue-700: #0014A8` | Tidak. Hanya bahan baku lapis berikutnya |
| Semantik — nilai bermakna | `--mjl-color-action: var(--mjl-blue-700)` | Ya. Ini yang dipakai sehari-hari |
| Komponen — terikat satu komponen | `--mjl-button-primary-bg` | Ya, khusus saat menimpa gaya satu komponen |

Aturan ini yang bikin dark mode nanti cuma butuh mengganti nilai semantik, bukan menyisir ulang seluruh komponen.

## Konvensi penamaan

    --mjl-{kategori}-{peran}-{varian}-{state}

    --mjl-color-surface-raised
    --mjl-color-text-muted
    --mjl-color-action-hover
    --mjl-space-6
    --mjl-radius-lg
    --mjl-duration-fast

Semua huruf kecil, pemisah tanda hubung, tanpa singkatan yang cuma dimengerti pembuatnya. `bg` boleh karena universal; `clr-sec-2` tidak.

# Schema

Struktur berkas sumber dan hasil build:

    tokens/
    ├── global/     color.json  typography.json  size.json
    ├── semantic/   light.json  dark.json  highcontrast.json
    └── component/  button.json  input.json  table.json

            │ Style Dictionary v4
            ▼
    dist/
    ├── css/tokens.css          CSS custom properties
    ├── css/tokens-dark.css
    ├── tailwind/preset.js
    ├── unocss/preset.ts
    ├── scss/_tokens.scss
    ├── js/tokens.ts            typed
    └── figma/tokens.json       Tokens Studio

Format sumber mengikuti spesifikasi W3C Design Tokens Community Group supaya bisa dibaca Tokens Studio di Figma tanpa konversi manual.[^dtcg]

# Examples

    {
      "color": {
        "primary": {
          "700": { "$type": "color", "$value": "#0014A8",
                   "$description": "Warna aksi utama. Kontras 13:1 di atas putih." }
        }
      },
      "semantic": {
        "action": {
          "default": { "$type": "color", "$value": "{color.primary.700}" },
          "hover":   { "$type": "color", "$value": "{color.primary.800}" },
          "pressed": { "$type": "color", "$value": "{color.primary.900}" }
        }
      }
    }

[^dtcg]: W3C Design Tokens Format Module
