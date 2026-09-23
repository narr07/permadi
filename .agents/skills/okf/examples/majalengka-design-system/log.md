# Update Log

## 2026-09-17
- **Tooling**: Manifest `okf-base.yaml` ditambahkan — profil 11 tipe konsep, controlled values untuk `status` dan `runtime`, hygiene ketat (broken_links, reserved_files, okf_v02_shapes, legacy_forms sebagai error).
- **Tooling**: Workflow GitHub Actions `.github/workflows/okflint.yml` menjalankan validate-manifest, validate, dan audit di tiap push dan PR.
- **Fix**: `stale_after` di `product/metrics.md` dan `product/roadmap.md` diubah ke format `YYYY-MM-DD` agar diterima pemeriksaan S204 okflint.
- **Creation**: Bundle dibuat dari PRD Design System Majalengka.tech v0.1.
- **Creation**: 8 direktori konsep — product, principles, foundations, components, patterns, standards, architecture, computations.
- **Creation**: Dua Attested Computation ditambahkan — pemeriksaan rasio kontras dan anggaran ukuran CSS.
- **Note**: Seluruh konsep berstatus `draft`. Belum ada yang diverifikasi manusia.
