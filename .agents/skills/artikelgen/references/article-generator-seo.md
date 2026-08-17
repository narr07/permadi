# Panduan Penulisan Artikel & SEO Berbasis Google Trends (Article Generator)

Panduan operasional lengkap untuk meriset tren, menyusun strategi kata kunci, dan menghasilkan artikel blog berkualitas tinggi yang ramah pembaca dan mendominasi SERP Google dengan format native Nuxt Content.

---

## 1. Tahap 0: Riset & Rekomendasi Google Trends (Pre-Writing Intelligence)

Sebelum menulis draf, lakukan analisis tren pencarian real-time untuk memvalidasi sudut pandang artikel:

### Perintah Google Trends CLI:
```bash
# 1. Menemukan variasi kata kunci dan autocomplete yang sering diketik orang
node .agents/skills/artikelgen/scripts/trends.mjs autocomplete "<kata-kunci>" --hl id

# 2. Menemukan query turunan dan lonjakan pencarian (rising queries)
node .agents/skills/artikelgen/scripts/trends.mjs related-queries "<kata-kunci>" --geo ID

# 3. Menemukan topik yang sedang hangat berkaitan dengan tema
node .agents/skills/artikelgen/scripts/trends.mjs related-topics "<kata-kunci>" --geo ID

# 4. Mengecek tren harian untuk momen / berita terkini
node .agents/skills/artikelgen/scripts/trends.mjs daily-trends --geo ID
```

### Cara Memanfaatkan Data Google Trends ke Dalam Konten:
1. **Saran Sudut Pandang (Angle Recommendation)**: Berikan ringkasan singkat 2–3 poin rekomendasi tren kepada pengguna sebelum blok kode artikel.
2. **Optimasi Judul & H1**: Masukkan kata kunci/frasa yang memiliki volume pencarian tinggi atau sedang *breakout*.
3. **Subtopik (H2/H3)**: Jadikan *related queries* sebagai subjudul (`##` atau `###`) agar artikel langsung menjawab pertanyaan spesifik pembaca.
4. **FAQ Accordion**: Ambil pertanyaan yang sering muncul dari saran *autocomplete* untuk dijadikan butir FAQ.

---

## 2. Alur Kerja Sebelum Menulis (Pre-Writing Intake)

Pastikan 5 parameter kunci berikut telah terdefinisi:
1. **Topik & Kata Kunci Utama (Primary Keyword)**: Divalidasi dengan Google Trends.
2. **Kata Kunci Turunan / LSI (Secondary Keywords)**: Dari hasil *related-queries* / *autocomplete*.
3. **Target Audiens** (mis. pemula/awam, desainer, praktisi profesional, pemilik bisnis).
4. **Search Intent**:
   - *Informational*: Fokus edukasi komprehensif, solusi langkah-demi-langkah.
   - *Commercial Investigation*: Perbandingan fitur, kelebihan/kekurangan, panduan memilih.
   - *Transactional*: Rekomendasi tindakan langsung, implementasi alat/solusi.
5. **Gaya Bahasa / Brand Voice**: Profesional, komunikatif, mudah dicerna, tanpa jargon kosong.

> *Catatan*: Jika pengguna hanya memberikan topik singkat, jalankan riset tren, buat asumsi rasional, sebutkan saran tren secara singkat di awal pesan (di luar blok kode), dan langsung lanjutkan penulisan draf artikel utuh.

---

## 3. Standar Tata Bahasa & Keterbacaan

### Pola Kalimat & Voice
- **Kalimat Aktif ≥ 85%**: Subjek melakukan aksi nyata. Hindari pasif berlebihan.
- **Gaya Waktu Kini (Present Tense)**: Untuk instruksi dan fakta ilmiah/teknis.
- **Komposisi Pola Kalimat**:
  - *Subjek di Depan (~60%)*: "Format OTF menyimpan ribuan karakter ekstra."
  - *Instruksi Imperatif (~25%)*: "Gunakan format WebP untuk mempercepat waktu muat halaman."
  - *Pembuka Kontekstual (~15%)*: "Ketika mendesain logo mewah, pilih format OTF untuk fleksibilitas kurva."

### Metode BLUF (Bottom Line Up Front)
- Letakkan inti informasi / kesimpulan utama di kalimat pembuka setiap section (`##` dan `###`).
- Jangan menyembunyikan poin penting di akhir paragraf yang panjang.
- Maksimal 2–4 kalimat per paragraf.

### Eliminasi Kata Bertele-tele

| Hindari | Gunakan |
|---|---|
| memanfaatkan | memakai, menggunakan |
| mengimplementasikan | menerapkan, membuat |
| melakukan pengaturan terhadap | mengatur |
| dalam rangka untuk | untuk |
| dikarenakan oleh fakta bahwa | karena |
| merupakan sebuah | adalah |
| di dalam hal ini | *(hapus)* |
| Hal ini / Ini *(di awal kalimat tanpa anteseden)* | Sebutkan objeknya langsung |
| Perlu diketahui bahwa / Perlu dicatat | Langsung nyatakan faktanya |

---

## 4. Master Checklist 9 Tahap Penulisan & SEO On-Page (Lengkap)

### Tahap 1: Perencanaan Strategis & Kalender Editorial
- [ ] **Batching Riset Kata Kunci**: Lakukan riset kelompok kata kunci sekaligus untuk menemukan sweet spot volume vs kesulitan (KD).
- [ ] **Penyelarasan Buyer Persona**: Jawab pertanyaan spesifik, tingkat keahlian, dan *pain points* persona target.
- [ ] **Analisis Campuran Kompetisi & Trafik**: Pilih kata kunci dengan volume memadai dan tingkat kesulitan masuk akal bagi otoritas domain.
- [ ] **Pembangunan Backlog Konten**: Jaga konsistensi jadwal publikasi dengan draf terencana.
- [ ] **Evaluasi Otoritas Topikal (Topic Clusters)**: Bangun gugus topik yang saling berkaitan, bukan artikel mandiri tanpa konteks.

### Tahap 2: Arsitektur Metadata & Optimasi On-Page
- [ ] **Optimasi Judul SEO (Title Tag)**: Maksimal 60 karakter, kata kunci utama di depan, mengandung proposisi nilai yang jelas.
- [ ] **Penyelarasan H1 dan Title Tag**: Wajibkan tag H1 di halaman blog identik atau sangat mirip dengan Title Tag. Tidak ada backtick di H1.
- [ ] **Penulisan Meta Deskripsi**: 140–160 karakter persuasif, mengandung kata kunci utama dan ajakan membaca untuk memaksimalkan CTR.
- [ ] **Struktur URL Slug Bersih**: Huruf kecil, dipisah tanda hubung (`-`), hanya mengandung kata kunci inti tanpa kode/angka acak.
- [ ] **Implementasi Schema Markup**: Siapkan struktur data terstruktur (Schema.org / JSON-LD) untuk featured snippet.
- [ ] **Verifikasi Mobile-Friendly**: Pastikan tata letak, tabel, dan visual tampil responsif di layar perangkat seluler.

### Tahap 3: Pendahuluan (The Hook & Benefit)
- [ ] **Penempatan Kata Kunci Utama**: Masukkan kata kunci utama secara natural dalam 100 kata pertama.
- [ ] **Benefit Statement (Outcome-Driven)**: Nyatakan secara eksplisit apa yang akan dipelajari atau diselesaikan pembaca.
- [ ] **Teknik Hook yang Provokatif**: Mulai dengan fakta mengejutkan, paradoks, pertanyaan retoris, atau storytelling singkat.
- [ ] **Transisi ke Inti Masalah**: Hubungkan hook langsung ke akar masalah yang dihadapi pembaca.

### Tahap 4: Keterbacaan (Readability) & Struktur Konten
- [ ] **Metode BLUF (Bottom Line Up Front)**: Letakkan poin utama atau kesimpulan di awal setiap section/paragraf.
- [ ] **Paragraf dan Kalimat Pendek**: Batasi paragraf maksimal 2–4 kalimat. Variasikan panjang kalimat agar ritme tidak membosankan.
- [ ] **Heading Hierarkis (`##` H2, `###` H3, `####` H4)**: Struktur logis yang memecah informasi kompleks.
- [ ] **Elemen Pemformatan Visual**: Gunakan bullet points, teks tebal (**bold**), blockquotes, dan callout (`::note`, `::tip`, `::warning`).
- [ ] **Target Readability Skor Flesch 60–70**: Bahasa lugas, mudah dipahami audiens luas, tanpa jargon kosong.

### Tahap 5: Kedalaman Substansi & Nilai Unik (Authority / E-E-A-T)
- [ ] **Kedalaman Konten (1.500–2.000+ Kata)**: Cakupan topik komprehensif, bukan pengulangan basa-basi. Hindari *thin content* (< 500 kata).
- [ ] **Wawasan Pakar / SME Insight**: Sertakan kutipan, perspektif ahli, atau wawasan teknis mendalam.
- [ ] **Riset Asli & Data Riil**: Sertakan data internal, studi kasus nyata, atau perbandingan empiris.
- [ ] **Analisis Content Gap**: Tutup celah informasi yang dilewatkan oleh hasil Top 10 Google.

### Tahap 6: Optimasi Visual & Multimedia
- [ ] **Penggunaan Gambar Unik**: Sisipkan 1 ilustrasi/grafis setiap 300–500 kata. Hindari stok foto klise.
- [ ] **Format Next-Gen (WebP/WebM)**: Gunakan format `.webp` untuk gambar dan `.webm` untuk video demi kecepatan loading.
- [ ] **Alt Text Deskriptif & Strategis**: Maksimal 125 karakter, ramah aksesibilitas, mengandung kata kunci kontekstual.
- [ ] **Visualisasi Data**: Ubah data rumit menjadi tabel markdown atau bagan visual yang mudah dibaca.

### Tahap 7: Strategi Tautan (Internal & External Linking)
- [ ] **Internal Linking Strategis**: Minimal 2–3 tautan ke artikel relevan lainnya di blog (`[teks](/blog/slug-terkait)`).
- [ ] **External Linking ke Sumber Otoritas**: Minimal 2–3 tautan ke sumber riset, dokumentasi resmi, atau studi terpercaya.
- [ ] **Penyuntingan Tautan di Konten Lama**: Tambahkan tautan internal dari artikel lama yang bertrafik tinggi menuju artikel baru ini.
- [ ] **Audit Broken Links**: Pastikan tidak ada tautan rusak atau URL mati.

### Tahap 8: Penutup & Call to Action (CTA)
- [ ] **Kesimpulan Berorientasi Hasil (`::conclusion`)**: Rangkum hasil akhir dengan fokus pada *outcome* dan arahan pilihan bagi pembaca.
- [ ] **Satu Call to Action (CTA) yang Jelas**: Berikan 1 instruksi tindakan spesifik (mis. coba alat, unduh panduan, atau baca seri lanjutan).
- [ ] **Dorongan Tindakan (Urgency / Logic)**: Berikan alasan rasional mengapa pembaca harus bertindak sekarang.
- [ ] **Undangan Diskusi**: Ajukan pertanyaan terbuka di penutup untuk mendorong interaksi pembaca.

### Tahap 9: Penyuntingan, Proofreading & Finalisasi
- [ ] **Membaca Nyaring (Read Aloud)**: Periksa ritme kalimat yang kaku, alur yang meloncat, atau repetisi kata.
- [ ] **Uji Plagiarisme & Keaslian**: Keunikan konten 100%, batasi kutipan langsung agar tidak mendominasi isi.
- [ ] **Humanisasi Konten AI**: Sunting dengan gaya personal, pengalaman autentik, dan verifikasi fakta secara manual.
- [ ] **Audit Konten Tipis (410 Response Code)**: Jika menghapus artikel lama berkualitas rendah secara permanen, gunakan status 410 (Gone) bukan 404 agar lekas dihapus dari indeks SERP.
- [ ] **Pembersihan Indeks (Noindex)**: Pastikan halaman bernilai rendah (lampiran/tag kosong) diatur ke `noindex`.

---

## 5. Template Struktur Artikel Siap Terbit

Setiap artikel yang dihasilkan wajib disajikan dalam SATU blok kode utuh `~~~~md ... ~~~~`:

````md
---
title: "Judul Lengkap dengan Primary Keyword: Subjudul Menarik"
category: kategori-blog
date: YYYY-MM-DD
description: Deskripsi 140-160 karakter mengandung primary keyword dan ajakan bertindak yang memikat di SERP.
tags:
  - tag-utama
  - tag-tren-pendukung
---

## Kalimat Pembuka yang Memikat & Langsung ke Inti Solusi

Paragraf pembuka langsung menjawab pertanyaan utama dan menyisipkan **kata kunci utama** secara natural dalam 100 kata pertama. Hindari basa-basi pembuka yang klise.

Jelaskan nilai konkret yang akan didapatkan pembaca setelah menyelesaikan artikel ini. Berikan transisi mulus menuju pembahasan mendalam berikutnya.

![Deskripsi visual gambar featured yang memuat kata kunci secara kontekstual](/article/nama-gambar.webp)

## Poin Utama Pertama: Penjelasan Konsep Inti

Kalimat pertama langsung menyampaikan kesimpulan (BLUF). Lanjutkan dengan penjelasan mendalam, analogi yang mudah dipahami, atau data pendukung.

- **Poin Kunci 1**: Penjelasan spesifik dan aplikatif.
- **Poin Kunci 2**: Langkah atau wawasan praktis.

::tip
Gunakan callout tips ini untuk memberikan rekomendasi praktik terbaik yang menghemat waktu pembaca.
::

## Poin Utama Kedua: Langkah Praktis atau Komparasi

Jelaskan perbandingan atau prosedur langkah demi langkah dengan jelas dan terstruktur.

::steps
### Siapkan Kebutuhan Dasar
Langkah awal untuk mempersiapkan data atau lingkungan kerja.

### Eksekusi Konfigurasi Inti
Terapkan pengaturan utama sesuai dengan rekomendasi teknis.
::

## Poin Utama Ketiga: Optimasi Lanjutan & Solusi Masalah

Bahas tantangan yang sering muncul serta cara mengatasinya secara efektif.

::note
Informasi tambahan yang relevan untuk pembaca tingkat lanjut atau catatan khusus sistem.
::

::conclusion
Rangkum hasil akhir artikel di sini dengan fokus pada outcome bagi pembaca:

- **Pilihan A**: Kapan harus memilih pendekatan pertama.
- **Pilihan B**: Kapan harus memilih pendekatan kedua.
::

::faq
::faq-item{question="Pertanyaan pertama yang sering dicari di Google?"}
Jawaban langsung 2–4 kalimat yang padat dan menjawab keraguan pembaca secara tuntas.
::

::faq-item{question="Pertanyaan kedua seputar penerapan atau kompatibilitas?"}
Jawaban lugas mengenai kompatibilitas dan langkah alternatif yang bisa diambil.
::

::faq-item{question="Pertanyaan ketiga tentang perbedaan dengan metode lain?"}
Jawaban komparatif ringkas yang menegaskan kembali keunggulan solusi ini.
::
::
````
