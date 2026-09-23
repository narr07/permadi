---
type: Playbook
title: Tata kelola dan kontribusi
description: Aturan lisensi, proses RFC, kebijakan versi, masa pensiun API, dan peran kontributor.
tags: [governance, open-source, contribution]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Tata kelola

## Lisensi

MIT untuk kode, CC BY 4.0 untuk dokumentasi dan aset visual. Sengaja longgar supaya instansi dan vendor tidak ragu memakainya.

## Proses keputusan

Menambah komponen baru, mengubah token, atau membuang API lama ditulis dulu di isu dengan template RFC, dibuka minimal 7 hari sebelum diputuskan.

## Versi

Mengikuti semver. Perubahan yang memutus kompatibilitas hanya di versi mayor, disertai panduan migrasi dan codemod bila memungkinkan. API yang akan dibuang ditandai deprecated minimal satu versi minor sebelumnya, lengkap dengan peringatan di konsol.

## Peran

- **Maintainer** — akses merge
- **Reviewer** — wajib dilibatkan untuk perubahan token dan aksesibilitas
- **Contributor** — siapa saja

## Janji review

PR pertama dari kontributor baru dijawab dalam 3 hari kerja. Komunitas kecil mati kalau PR-nya didiamkan.

Code of conduct: Contributor Covenant 2.1. Syarat teknis penerimaan PR komponen ada di [definition of done](/standards/definition-of-done.md).
