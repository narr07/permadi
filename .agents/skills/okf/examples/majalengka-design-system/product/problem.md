---
type: Product Requirement
title: Masalah yang diselesaikan
description: Empat pola masalah berulang pada situs instansi daerah yang jadi alasan design system ini dibangun.
tags: [prd, problem-statement]
status: draft
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Masalah

Situs-situs instansi di daerah punya pola masalah yang mirip, dan sumbernya bukan kurang niat.

## Tiap vendor mulai dari nol

Satu dinas pakai Bootstrap 4 warisan 2018, dinas sebelah pakai template WordPress berbayar, desa pakai apa yang ada. Warga ketemu tiga tampilan berbeda untuk urusan yang sama.

## Aksesibilitas nyaris selalu jadi korban

Teks abu-abu tipis di atas putih, form tanpa label, slider otomatis yang tidak bisa dihentikan, tombol yang cuma bisa diklik mouse. Padahal pengguna situs layanan justru banyak yang lansia — lihat [profil pengguna](./audience.md).

## Pengetahuan hilang saat orangnya pindah

Developer kontrak habis, tidak ada dokumentasi, penerus mulai dari menebak-nebak.

## Biaya berulang untuk hal yang sama

Anggaran habis untuk membangun ulang tabel data, form bertingkat, dan navigasi — komponen yang sebetulnya identik di semua instansi.

## Syarat keberhasilan

Design system menyelesaikan keempatnya sekaligus, asal satu syarat dipenuhi: **sistemnya harus lebih gampang dipakai daripada bikin sendiri**. Kalau tidak, orang akan tetap copy-paste dari internet. Itu tolok ukur desain kita, dan alasan kenapa [paket CSS murni](/architecture/tech-stack.md) diperlakukan sebagai jalur utama.
