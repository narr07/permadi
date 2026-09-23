# OKF Linting & Validation (`okflint`)

`okflint` adalah tool CLI deterministik (standar linter resmi OKF v0.2) untuk memvalidasi bundle pengetahuan Open Knowledge Format (OKF). Berfungsi seperti "Ruff untuk dokumentasi", `okflint` memastikan frontmatter YAML, struktur file markdown, tautan silang (*cross-links*), dan kebijakan kebersihan (*hygiene*) mematuhi spesifikasi OKF serta profil proyek.

---

## 1. Tiga Lapisan Validasi OKF

1. **OKF Core (§9)**: Aturan mutlak dari spesifikasi resmi (semua file memiliki frontmatter, field `type` wajib ada, file reserved `index.md`/`log.md` valid, dll.).
2. **Profile Types**: Aturan jenis konsep yang didefinisikan dalam manifest proyek `okf-base.yaml` (field wajib/opsional per tipe, nilai status yang diizinkan, runtime yang valid).
3. **Hygiene**: Pemeriksaan kualitas & best-practice (broken links, bentuk data v0.2, deteksi konten basi/stale, split candidate untuk file yang terlalu panjang).

---

## 2. Struktur Manifest `okf-base.yaml`

Setiap bundle OKF yang dibuat disarankan menyertakan file manifest `okf-base.yaml` di root bundle:

```yaml
okf_version: "0.2"

base:
  name: Nama Bundle Pengetahuan
  roots:
    - path: "."
      exclude_patterns:
        - ".okflint/**"
        - "**/node_modules/**"
  reserved_files:
    index: index.md
    log: log.md
  link_resolution:
    external_refs:
      - https
      - http
      - mailto

profile:
  types:
    Product Requirement:
      aliases: [PRD, Product Requirements]
      required: [type, title, description, status]
      optional: [tags, generated, verified, sources, stale_after]
      status_values: [draft, stable, deprecated]

    Architecture Decision:
      aliases: [ADR]
      required: [type, title, description, status]
      optional: [tags, generated, verified, sources, stale_after]
      status_values: [draft, stable, deprecated]

    Standard:
      required: [type, title, description, status]
      optional: [tags, generated, verified, sources, stale_after]
      status_values: [draft, stable, deprecated]

    Attested Computation:
      required: [type, title, description, status, runtime]
      optional:
        [
          tags,
          parameters,
          computation,
          executor,
          attester,
          generated,
          verified,
          sources,
          stale_after,
        ]
      status_values: [draft, stable, deprecated]
      runtime_values: [python, bigquery, postgres, dbt, node, shell]

hygiene:
  broken_links: error
  reserved_files: error
  okf_v02_shapes: error
  legacy_forms: error
  unknown_fields: warn
  stale_content: warn
  split_candidates: warn
  split:
    min_lines: 220
    exempt_types:
      - Component Catalog
```

---

## 3. GitHub Actions CI/CD Workflow (`.github/workflows/okflint.yml`)

Untuk memastikan setiap pull request dan commit tervalidasi otomatis:

```yaml
name: OKF lint

on:
  push:
    branches: [main]
  pull_request:

jobs:
  okflint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"

      - name: Pasang okflint
        run: pip install okflint

      - name: Periksa manifest
        run: okflint validate-manifest okf-base.yaml

      - name: Validasi bundle
        run: okflint validate --manifest okf-base.yaml --json > okflint-report.json

      - name: Audit bundle
        if: always()
        run: okflint audit --manifest okf-base.yaml

      - name: Simpan laporan
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: okflint-report
          path: okflint-report.json
```

---

## 4. Perintah Eksekusi Lokal

Pasang via pip atau uv:
```bash
pip install okflint
# atau dengan uv
uv tool install okflint
```

Jalankan perintah berikut di direktori root bundle:

1. **Validasi Manifest Saja**:
   ```bash
   okflint validate-manifest okf-base.yaml
   ```
2. **Validasi Kepatuhan Penuh (Strict)**:
   ```bash
   okflint validate --manifest okf-base.yaml
   ```
3. **Audit & Statistik Bundle (Non-gating)**:
   ```bash
   okflint audit --manifest okf-base.yaml
   ```
4. **Generate/Sync `index.md` otomatis**:
   ```bash
   okflint index
   ```
