# Roadmap & Feature Backlog (permadi.dev)

Daftar rencana pengembangan fitur, modul, dan halaman baru untuk rilis mendatang.

---

## 📌 Backlog Fitur Mendatang

### 1. Halaman Khusus Panduan & Tutorial (`/panduan` ↔ `/guides`)
Halaman mandiri yang didedikasikan untuk panduan komprehensif, modul bertahap (*step-by-step guides*), dan tutorial teknis maupun pedagogis (terpisah dari artikel blog reguler).

* **Struktur Routing (Bilingual)**:
  * Bahasa Indonesia: `/id/panduan` & `/id/panduan/[slug]`
  * English: `/guides` & `/guides/[slug]`
  * Navigasi: `PANDUAN` (ID) / `GUIDES` (EN)

* **Rencana Implementasi Teknis**:
  1. **Nuxt Content Collections (`content.config.ts`)**:
     * `panduan_id`: sumber di `content/id/panduan/**` dengan prefix `/id/panduan`
     * `panduan_en`: sumber di `content/en/guides/**` dengan prefix `/guides`
     * Skema: Mendukung bab/tahapan (`steps`), tingkat kesulitan (`difficulty`: *beginner*, *intermediate*, *advanced*), estimasi waktu, dan prasyarat (*prerequisites*).
  2. **Konfigurasi i18n (`nuxt.config.ts`)**:
     * Daftarkan custom routes di `i18n.pages`:
       ```ts
       'panduan/index': {
         id: '/panduan',
         en: '/guides',
       },
       'panduan/[slug]': {
         id: '/panduan/[slug]',
         en: '/guides/[slug]',
       },
       ```
  3. **Komponen Halaman UI (`app/pages/panduan/`)**:
     * `index.vue`: Katalog panduan dengan filter topik (*Web Development*, *Pedagogi/Pendidikan*, *Desain Grafis/UI*).
     * `[slug].vue`: Tampilan panduan terstruktur dengan navigasi langkah demi langkah (*stepper* / *progress indicator*), daftar isi dinamis, dan komponen interaktif.
  4. **SEO & Discovery**:
     * Integrasi Schema.org `HowTo` / `Course`.
     * Masuk ke sitemap otomatis (`id-ID.xml` & `en-US.xml`).
     * Penyertaan ke `/llms.txt` dan feed rute.

---

### 2. Navigasi Seri Artikel Berantai (*Article Series / Learning Path*)
Mengelompokkan artikel bertopik sama (contoh: 5 artikel seri *Accelerated Learning* atau seri *Nuxt 4 Architecture*) ke dalam satu rangkaian belajar yang saling terhubung.

* **Fungsi**:
  * Menampilkan badge serial di atas artikel (misal: *Bagian 3 dari 5 dalam Seri Accelerated Learning*).
  * Tombol navigasi otomatis ke artikel sebelumnya (*previous*) dan berikutnya (*next*) dalam seri yang sama.
  * Dropdown daftar isi seluruh seri artikel di dalam postingan.
* **Implementasi Teknis**:
  * Tambahkan field opsional `series: { name: string, order: number }` pada schema `content.config.ts`.
  * Buat komponen `ArticleSeriesBox.vue` yang disematkan di awal atau akhir artikel.

---

### 3. Print-Friendly & Export PDF Bersih untuk Bahan Ajar
Memudahkan rekan guru atau pengunjung menyimpan artikel/panduan sebagai dokumen fisik atau PDF tanpa elemen web yang mengganggu.

* **Fungsi**:
  * Tombol aksi cepat *"Cetak / Simpan PDF"* pada halaman artikel dan panduan.
  * Styling CSS `@media print` yang mengoptimalkan layout kertas A4:
    * Menyembunyikan header navigasi, widget chat, reaction bar, footer, dan tombol interaktif.
    * Mempertahankan teks judul, nama penulis, tanggal publikasi, URL sumber, dan isi artikel beserta gambar dengan resolusi tajam.
    * Mencegah pemotongan baris kode atau kutipan di tengah halaman (*page-break-inside: avoid*).

---

### 4. Edu & Dev Micro-Tools Interaktif
Menghadirkan alat bantu utilitas interaktif langsung di browser tanpa instalasi untuk menarik traffic organik dan backlink referensi:

* **Generator RPP / Modul Ajar Ringkas (Kurikulum Merdeka)**:
  * Form mini interaktif untuk memilih fase kelas (SD), tujuan pembelajaran, dan sintaks model belajar (MASTER, PBL, PjBL).
  * Menghasilkan draf dokumen 1-halaman ramah otak yang bisa langsung di-*copy* atau dicetak.
* **Palette & Contrast Checker Desain (Swiss Style)**:
  * Tool pengecekan kontras warna teks dan latar belakang berbasis standar WCAG (AA/AAA) yang disesuaikan dengan palet warna minimalis.

---

### 5. Audio Reader Berbasis Web Speech API (Zero External Cost)
Memungkinkan pengunjung mendengarkan artikel sambil beraktivitas (cocok untuk rekan guru yang membaca saat persiapan mengajar).

* **Fungsi**:
  * Pemutar audio mini di header artikel: tombol *Play*, *Pause*, dan pengatur kecepatan (*1x*, *1.25x*, *1.5x*).
  * Menggunakan native browser API `window.speechSynthesis` dengan pemilihan suara lokal bahasa Indonesia (`id-ID`) atau English (`en-US`).
  * Tanpa dependensi pihak ketiga atau biaya API eksternal.

---

### 6. Bookmark / Simpan Artikel Offline (LocalStorage)
* **Fungsi**:
  * Tombol *"Simpan untuk Nanti"* di setiap kartu dan detail artikel.
  * Drawer atau modal cepat untuk melihat daftar artikel yang telah disimpan secara lokal tanpa perlu registrasi akun atau login.

---

### 7. Form Estimasi & Inquiry Kolaborasi Terstruktur (`/kontak`)
* **Fungsi**:
  * Kuesioner mini interaktif di halaman kontak untuk calon klien atau instansi sekolah yang ingin berkolaborasi (Web Sekolah, Aplikasi Pembelajaran, Desain Identitas Visual).
  * Menghasilkan draf ringkasan kebutuhan proyek siap kirim via WhatsApp atau Email secara otomatis.
---

### 2. Navigasi Seri Artikel Berantai (*Article Series / Learning Path*)
Mengelompokkan artikel bertopik sama (contoh: 5 artikel seri *Accelerated Learning* atau seri *Nuxt 4 Architecture*) ke dalam satu rangkaian belajar yang saling terhubung.

* **Fungsi**:
  * Menampilkan badge serial di atas artikel (misal: *Bagian 3 dari 5 dalam Seri Accelerated Learning*).
  * Tombol navigasi otomatis ke artikel sebelumnya (*previous*) dan berikutnya (*next*) dalam seri yang sama.
  * Dropdown daftar isi seluruh seri artikel di dalam postingan.
* **Implementasi Teknis**:
  * Tambahkan field opsional `series: { name: string, order: number }` pada schema `content.config.ts`.
  * Buat komponen `ArticleSeriesBox.vue` yang disematkan di awal atau akhir artikel.

---

### 3. Print-Friendly & Export PDF Bersih untuk Bahan Ajar
Memudahkan rekan guru atau pengunjung menyimpan artikel/panduan sebagai dokumen fisik atau PDF tanpa elemen web yang mengganggu.

* **Fungsi**:
  * Tombol aksi cepat *"Cetak / Simpan PDF"* pada halaman artikel dan panduan.
  * Styling CSS `@media print` yang mengoptimalkan layout kertas A4:
    * Menyembunyikan header navigasi, widget chat, reaction bar, footer, dan tombol interaktif.
    * Mempertahankan teks judul, nama penulis, tanggal publikasi, URL sumber, dan isi artikel beserta gambar dengan resolusi tajam.
    * Mencegah pemotongan baris kode atau kutipan di tengah halaman (*page-break-inside: avoid*).

---

### 4. Edu & Dev Micro-Tools Interaktif
Menghadirkan alat bantu utilitas interaktif langsung di browser tanpa instalasi untuk menarik traffic organik dan backlink referensi:

* **Generator RPP / Modul Ajar Ringkas (Kurikulum Merdeka)**:
  * Form mini interaktif untuk memilih fase kelas (SD), tujuan pembelajaran, dan sintaks model belajar (MASTER, PBL, PjBL).
  * Menghasilkan draf dokumen 1-halaman ramah otak yang bisa langsung di-*copy* atau dicetak.
* **Palette & Contrast Checker Desain (Swiss Style)**:
  * Tool pengecekan kontras warna teks dan latar belakang berbasis standar WCAG (AA/AAA) yang disesuaikan dengan palet warna minimalis.

---

### 5. Audio Reader Berbasis Web Speech API (Zero External Cost)
Memungkinkan pengunjung mendengarkan artikel sambil beraktivitas (cocok untuk rekan guru yang membaca saat persiapan mengajar).

* **Fungsi**:
  * Pemutar audio mini di header artikel: tombol *Play*, *Pause*, dan pengatur kecepatan (*1x*, *1.25x*, *1.5x*).
  * Menggunakan native browser API `window.speechSynthesis` dengan pemilihan suara lokal bahasa Indonesia (`id-ID`) atau English (`en-US`).
  * Tanpa dependensi pihak ketiga atau biaya API eksternal.

---

### 6. Bookmark / Simpan Artikel Offline (LocalStorage)
* **Fungsi**:
  * Tombol *"Simpan untuk Nanti"* di setiap kartu dan detail artikel.
  * Drawer atau modal cepat untuk melihat daftar artikel yang telah disimpan secara lokal tanpa perlu registrasi akun atau login.

---

### 7. Form Estimasi & Inquiry Kolaborasi Terstruktur (`/kontak`)
* **Fungsi**:
  * Kuesioner mini interaktif di halaman kontak untuk calon klien atau instansi sekolah yang ingin berkolaborasi (Web Sekolah, Aplikasi Pembelajaran, Desain Identitas Visual).
  * Menghasilkan draf ringkasan kebutuhan proyek siap kirim via WhatsApp atau Email secara otomatis.

