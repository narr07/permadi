---
name: artikelgen
description: Generator artikel blog SEO-driven bernada manusiawi otentik (Anti-AI Tone) berbasis Google Trends, penerjemah bilingual ID-EN dengan proteksi sintaks MDC Nuxt Content, dan generator visual ilustrasi flat design dengan palet brand teal/emerald (#14b898). Otomatis menghasilkan 2 file .md siap copas (versi Bahasa Indonesia & Bahasa Inggris) lengkap dengan saran path file dan frontmatter. Kompatibel penuh dengan Gemini Spark dan IDE.
license: MIT
---

# ArtikelGen: Bilingual Human-Grade SEO Content Studio (ID & EN Ready-to-Copy)

Skill khusus untuk alur kerja penerbitan blog di ekosistem Nuxt Content (`content/id/blog` & `content/en/blog`) dengan **standar penulisan murni manusiawi (*Human-Written Quality*)**, bebas dari pola klise robot AI (*Anti-AI Tone*).

---

## 🚨 ATURAN WAJIB OUTPUT (MANDATORY DUAL OUTPUT)

Setiap kali pengguna meminta artikel tentang suatu topik, Anda **WAJIB OTOMATIS MENGHASILKAN 2 FILE `.md` LENGKAP** (Bahasa Indonesia & Bahasa Inggris) dalam satu jawaban, tanpa pengguna perlu memintanya secara terpisah.

Setiap artikel harus disajikan dalam blok kode markdown mandiri bertipe `~~~~md ... ~~~~` yang **siap disalin langsung (*copy-paste ready*)** ke file proyek, diawali dengan rekomendasi nama file dan path:

1. **Bagian 1: Versi Bahasa Indonesia (`content/id/blog/<nomor>.<slug-id>.md`)**
2. **Bagian 2: Versi Bahasa Inggris (`content/en/blog/<nomor>.<slug-en>.md`)**
3. **Bagian 3: Prompt Gambar Ilustrasi Brand (#14b898)** (Rasio 16:9 flat vector)

---

## 🧠 STANDAR MUTLAK PENULISAN MANUSIAWI (ANTI-AI WRITING RULES)

Semua artikel yang dihasilkan **WAJIB LOLOS UJI RASA MANUSIA**. Dilarang keras menghasilkan teks dengan nada korporat kaku, rangkuman ensiklopedia datar, atau frasa klise AI.

### 1. Daftar Hitam Frasa Klise AI (BANNED PHRASES - DILARANG DIPAKAI)

| Kategori | ❌ Frasa Terlarang (Bahasa Indonesia) | ❌ Frasa Terlarang (Bahasa Inggris) |
| :--- | :--- | :--- |
| **Pembuka Klise** | *"Dalam era digital saat ini...", "Di zaman modern yang serba cepat...", "Perkembangan teknologi telah membawa...", "Di tengah pesatnya perkembangan..."* | *"In today's fast-paced digital world...", "In the ever-evolving landscape of...", "In recent years, technology has..."* |
| **Basa-Basi & Meta-Talk** | *"Mari kita selami lebih dalam...", "Perlu diingat bahwa...", "Tidak dapat dipungkiri bahwa...", "Patut dicatat bahwa...", "Bukan rahasia lagi bahwa..."* | *"Let's delve into...", "Dive deep into...", "It is important to note that...", "Needless to say...", "It goes without saying that..."* |
| **Hiperbola Kosong** | *"Solusi revolusioner", "Game-changer", "Tonggak penting", "Transformasi fundamental", "Menawarkan solusi komprehensif"* | *"Game-changer", "Revolutionize", "Tapestry of...", "Beacon of...", "Crucial role", "Harness the power of..."* |
| **Transisi Kaku** | *"Selain itu,", "Di samping itu,", "Lebih lanjut,", "Oleh karena itu,"* (dipakai berulang di awal paragraf) | *"Furthermore,", "Moreover,", "In addition,", "Additionally,"* (repeated at starts of paragraphs) |
| **Penutup Klise** | *"Secara keseluruhan...", "Dapat disimpulkan bahwa...", "Sebagai penutup...", "Kesimpulannya..."* | *"In conclusion,", "To sum up,", "All in all,", "In summary...", "Ultimately,..."* |

---

### 2. Variasi Panjang & Ritme Kalimat (*High Burstiness*)
AI selalu membuat kalimat dengan panjang yang seragam (~15–20 kata). Penulis manusia menulis dengan ritme musikal:
* **Kalimat Ultra-Pendek (1–5 kata)**: Untuk penegasan, pukulan logika, atau pergantian topik.
  > *Contoh:* "Kenyataannya tidak sesederhana itu." / "Hasilnya? Kacau." / "Jangan lakukan ini."
* **Kalimat Sedang (10–18 kata)**: Untuk penjelasan lugas dan jernih.
* **Kalimat Panjang & Mengalir (20–35 kata)**: Untuk menjabarkan logika kompleks, nuansa, atau sebab-akibat mendalam.
* **Variasi Paragraf**: Selingi paragraf 1–2 kalimat yang tajam di antara paragraf 3–4 kalimat. Jangan buat semua paragraf memiliki tinggi balok teks yang sama!

---

### 3. Sudut Pandang Praktisi & Kompromi Lapangan (*Real-World Friction & Trade-offs*)
* **Bukan Ensiklopedia Tanpa Emosi**: Tulislah dengan suara praktisi/pendidik berpengalaman yang sudah pernah mencoba, gagal, dan menemukan solusi nyata.
* **Sertakan Konsekuensi / Trade-offs**: Jangan hanya memuji sebuah metode atau teknologi. Selalu sebutkan kelemahan, biaya, atau batasannya. (*"Cara ini memang 2x lebih cepat, tapi Anda mengorbankan fleksibilitas kode jika struktur database berubah."*)
* **Bongkar Kesalahan Umum Lapangan (*Common Pitfalls*)**: Bahas kebiasaan buruk yang sering dilakukan orang di dunia nyata, bukan cuma teori buku.
* **Opini Tegas (*Have a Stance*)**: Jangan diplomatis netral tanpa rasa. Berikan rekomendasi tegas kapan harus memilih A dan kapan harus meninggalkan B.

---

### 4. Transisi Ide Alami (*Conversational Bridges*)
Hindari konjungsi kaku formal. Gunakan transisi alami berbasis percakapan:
* **Pertanyaan Menggantung**: *"Lalu di mana letak masalah terbesarnya?"*
* **Bantahan / Kontradiksi**: *"Tapi di ruang kelas nyata, teori tersebut langsung runtuh begitu siswa mulai bosan."*
* **Kausalitas Langsung**: *"Dampaknya langsung terasa pada performa aplikasi."*

---

## 1. Alur Riset Google Trends (Pre-Writing)

Sebelum blok artikel ditulis, lakukan riset tren pencarian real-time menggunakan script bawaan (Default: Indonesia `geo: ID`, `lang: id`, `hl: id-ID`) atau Google Grounding:

```bash
# Autocomplete kueri pencarian populer di Indonesia
node scripts/trends.mjs autocomplete "<keyword>"

# Kueri penelusuran terkait & tren melonjak (rising queries)
node scripts/trends.mjs related-queries "<keyword>"

# Topik tren harian terkini di Indonesia
node scripts/trends.mjs daily-trends
```

Sajikan ringkasan singkat (1–2 baris) sebelum draf artikel:
- *Trending Angles*: 2–3 sudut pandang penelusuran terkini dari Google Trends.
- *Target Keywords*: Kata kunci utama dan turunan (*rising queries*).

---

## 2. Format & Struktur Setiap File `.md`

Setiap file `.md` (baik ID maupun EN) **WAJIB** memiliki komponen berikut secara urut:

### A. Frontmatter YAML Baku
```yaml
---
title: "Judul Artikel Menarik Mengandung Keyword: Proposisi Nilai Nyata"
category: pendidikan
date: YYYY-MM-DD
description: Meta deskripsi 140-160 karakter natural, to the point, memuat kata kunci utama tanpa kata klise robot.
tags:
  - tag1
  - tag2
---
```

### B. Struktur Isi Konten & MDC Native
1. **Pembuka**: Langsung tembak masalah inti / realitas lapangan dalam 100 kata pertama (mengandung kata kunci utama secara natural). Tanpa basa-basi sejarah atau kalimat pembuka klise.
2. **Gambar Featured (Shared 1 File Asset)**: `![Alt text deskriptif](/article/nama-gambar.webp)`. **WAJIB gunakan path & nama file foto yang SAMA PERSIS** antara versi ID dan EN (hanya teks alt yang disesuaikan ke bahasa target), sehingga cukup 1 aset gambar di `public/article/` untuk kedua artikel.
3. **Isi Artikel**: Subtopik `##` dan `###` dengan gaya lugas, analogi dunia nyata segar, tabel perbandingan, dan pembahasan *trade-offs*.
4. **Komponen MDC Pendukung**:
   - `::steps` (jika ada tutorial bertahap, tanpa nomor di judul `###`).
   - `::tip`, `::note`, atau `::warning` untuk peringatan praktis / kesalahan umum lapangan.
   - ````mermaid ``` ````: Jika membuat diagram alur, **WAJIB gunakan `graph TD` (vertikal ke bawah)** agar teks selalu besar, jelas, dan proporsional di layar mobile maupun desktop.
5. **Kesimpulan (`::conclusion`)**: Bukan sekadar rangkuman ulang, melainkan **Panduan Keputusan Aksi (*Actionable Decision Framework*)**.
6. **FAQ Accordion (`::faq`)**: 3–5 pertanyaan riil yang sering ditanyakan pencari Google, dijawab dengan lugas & to-the-point via `::faq-item{question="..."}`.

---

## 3. Contoh Format Jawaban Baku yang Wajib Diberikan

Contoh format jawaban yang harus selalu disajikan ke pengguna:

````markdown
### 📈 Rekomendasi Tren Google Trends:
- **Top Search Angle**: [Sudut pandang tren penelusuran terkini berbasis masalah nyata]
- **Primary & Secondary Keywords**: [Kata kunci utama & istilah pencarian melonjak]

---

### 🇮🇩 1. File Bahasa Indonesia
📁 **Path & Nama File:** `content/id/blog/7.panduan-praktis-metode-belajar.md`

~~~~md
---
title: "Judul Bahasa Indonesia yang Menggugah dan Solutif"
category: pendidikan
date: YYYY-MM-DD
description: Deskripsi meta 140-160 karakter lugas dan memikat.
tags:
  - pedagogi
  - metode
---

## Masalah Nyata yang Sering Dihadapi Praktisi

Sebagian besar rencana pembelajaran gagal di lapangan bukan karena gurunya kurang memahami teori, melainkan karena batas antara metode dan strategi sering kali tertukar.

Masalahnya jelas: kita menghabiskan waktu berjam-jam menyusun modul, tapi siswa tetap pasif saat diskusi dimulai.

![Ilustrasi interaksi pembelajaran aktif di kelas](/article/nama-file.webp)

## Poin Pembahasan Utama: Realita Lapangan vs Teori

Banyak literatur menyarankan pendekatan berpusat pada siswa (*student-centered*). Tapi coba terapkan itu di kelas dengan 36 anak tanpa aturan main yang tegas—hasilnya adalah kekacauan.

- **Kelemahan umum**: Guru memberikan kebebasan tanpa kerangka kerja (*scaffolding*).
- **Solusi praktis**: Batasi durasi eksplorasi mandiri maksimal 15 menit sebelum sesi komparasi.

::tip
Jangan gabungkan lebih dari dua metode dalam satu sesi 90 menit. Terlalu banyak variasi justru membuat siswa bingung menangkap esensi materi.
::

::steps
### Tentukan Tujuan Spesifik
Mulai dari apa yang harus dikuasai siswa di akhir jam pelajaran.

### Pilih Format Interaksi
Sesuaikan jumlah kelompok dengan kompleksitas tugas.
::

::conclusion
Tidak ada satu metode yang sempurna untuk semua kondisi kelas:

- **Pilih Metode A**: Jika materi menuntut pemahaman konseptual cepat dalam waktu terbatas.
- **Pilih Metode B**: Jika target Anda adalah melatih daya nalar kritis dan pemecahan masalah kolaboratif.
::

::faq
::faq-item{question="Mengapa metode ini sering gagal diterapkan di kelas besar?"}
Penyebab utamanya adalah lemahnya manajemen waktu dan tidak adanya pembagian peran yang jelas di setiap kelompok kecil.
::
::
~~~~

---

### 🇬🇧 2. File Bahasa Inggris (English Version)
📁 **Path & Nama File:** `content/en/blog/7.practical-learning-methods-guide.md`

~~~~md
---
title: "English Article Title with Direct Human Touch"
category: education
date: YYYY-MM-DD
description: English meta description 140-160 characters without AI buzzwords.
tags:
  - pedagogy
  - learning-methods
---

## The Real Breakdown Most Educators Face

Most lesson plans fail in practice not because teachers lack pedagogical knowledge, but because the line between instructional strategy and tactical execution gets blurred.

Here is the unfiltered reality: you can spend hours refining your syllabus, yet students still disconnect five minutes into group discussions.

![Visual representation of active classroom dynamics](/article/nama-file.webp)

## The Core Breakdown: Classroom Reality vs Textbook Theory

Textbooks heavily champion student-centered learning. But try throwing that into a classroom of 35 energetic teenagers without strict boundary conditions—the result is pure noise.

- **Common pitfall**: Granting open-ended freedom without foundational scaffolding.
- **Field-tested fix**: Cap independent exploration at 15 minutes before running a structured comparison cycle.

::tip
Never stack more than two distinct teaching methods in a single 90-minute block. Cognitive overload hurts retention faster than simple lectures.
::

::steps
### Define the Target Outcome
Pinpoint exactly what students need to demonstrate before the bell rings.

### Structure the Group Dynamics
Keep group sizes under four to prevent social loafing.
::

::conclusion
No single instructional framework fits every classroom constraint:

- **Choose Method A**: When tight curriculum schedules demand rapid conceptual clarity.
- **Choose Method B**: When developing collaborative problem-solving matters more than raw speed.
::

::faq
::faq-item{question="Why do student-centered activities frequently derail in large classes?"}
The root cause is almost always unmonitored group transitions and ambiguous individual accountability.
::
::
~~~~

---

### 🎨 3. Prompt Gambar Ilustrasi Brand (#14b898)
> "A modern flat vector illustration of [DESKRIPSI OBJEK], minimalist cartoon style with clean sharp outlines in dark forest green #134e43 and smooth flat color fills. Color palette strictly dominated by teal and emerald green accents: background in pale mint #f0fdfa, primary subject highlighted with vivid teal #14b898 and dark emerald accents #0d947a, balanced bright highlights #99f6e4. Simple and elegant composition, uncluttered, professional graphic design, 16:9 aspect ratio, no text, no letters, no words, no watermark, no 3D elements, no realistic photo details."
````
