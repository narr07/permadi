---
type: Attested Computation
title: Ukuran bundel CSS terhadap anggaran
description: Mengukur ukuran gzip berkas CSS inti dan membandingkannya dengan anggaran 20 KB.
tags: [performance, budget, ci, verification]
status: draft
runtime: python
parameters:
  - { name: css_path, type: string, required: true }
  - { name: budget_kb, type: number, required: false }
generated: { by: claude/opus-5, at: 2026-09-17T00:00:00Z }
---

# Computation

    import gzip, pathlib

    def css_budget_check(css_path, budget_kb=20):
        raw = pathlib.Path(css_path).read_bytes()
        gzipped_kb = len(gzip.compress(raw, 9)) / 1024
        return {
            "path": css_path,
            "raw_kb": round(len(raw) / 1024, 2),
            "gzip_kb": round(gzipped_kb, 2),
            "budget_kb": budget_kb,
            "pass": gzipped_kb <= budget_kb,
        }

Anggaran baku 20 KB berasal dari [anggaran performa](/architecture/performance-budget.md) dan ikut dilaporkan sebagai salah satu [metrik keberhasilan](/product/metrics.md). Hasil `pass: false` memblokir build di CI.
