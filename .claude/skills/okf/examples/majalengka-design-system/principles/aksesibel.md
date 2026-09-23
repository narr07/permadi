---
type: Design Principle
title: Aksesibel untuk semua
description: Prinsip kedua — WCAG 2.1 Level AA diperlakukan sebagai lantai, dan komponen yang gagal uji tidak boleh dirilis.
tags: [principle, accessibility, wcag]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
sources:
  - id: prinsip-publik
    resource: https://majalengka.tech/docs/design-system/prinsip
    title: Prinsip Utama Design System Majalengka.tech
    author: human:dinar
  - id: wcag21
    resource: https://www.w3.org/TR/WCAG21/
    title: Web Content Accessibility Guidelines 2.1
    author: team:w3c
---

# Aksesibel untuk semua

Acuannya WCAG 2.1 Level AA, supaya warga lanjut usia dan penyandang disabilitas bisa memakai portal dengan nyaman.[^prinsip-publik] Kita memperlakukannya sebagai lantai, bukan langit-langit.

Yang membedakan sistem ini dari kebanyakan UI kit: **komponen yang gagal uji aksesibilitas tidak boleh dirilis**. Bukan dicatat sebagai utang teknis, bukan ditunda — ditahan.[^wcag21]

Daftar periksa teknis lengkap ada di [checklist WCAG AA](/standards/wcag-aa-checklist.md), dan pemeriksaan kontras otomatisnya di [perhitungan rasio kontras](/computations/contrast-ratio.md).

[^prinsip-publik]: Prinsip Utama Design System Majalengka.tech
[^wcag21]: Web Content Accessibility Guidelines 2.1
