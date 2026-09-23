---
type: Design Principle
title: Multi-platform & framework-agnostic
description: Prinsip ketiga — semua keputusan visual disimpan sebagai design token, bukan sebagai kelas CSS.
tags: [principle, tokens, interoperability]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
sources:
  - id: prinsip-publik
    resource: https://majalengka.tech/docs/design-system/prinsip
    title: Prinsip Utama Design System Majalengka.tech
    author: human:dinar
---

# Multi-platform & framework-agnostic

Semua keputusan visual hidup sebagai design token yang mudah diekspor ke Tailwind CSS, UnoCSS, Vue, React, atau plain CSS.[^prinsip-publik]

Token disimpan dalam satu sumber JSON, lalu Style Dictionary menerjemahkannya ke berbagai target. Kalau besok ada framework baru, kita cukup menambah target build — bukan menulis ulang sistemnya.

Konsekuensi yang harus dipegang teguh: **tidak ada nilai warna, jarak, atau ukuran yang ditulis langsung di komponen**. Semuanya lewat token. Detailnya di [arsitektur token](/foundations/token-architecture.md).

[^prinsip-publik]: Prinsip Utama Design System Majalengka.tech
