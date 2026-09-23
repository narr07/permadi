---
name: translate-id-en
description: >
  Terjemahkan teks antara Bahasa Indonesia dan Inggris (dua arah) dengan hasil yang
  tidak kaku, akurat secara makna, dan bebas dari "bau terjemahan" (slop): kalimat
  yang gramatikal tapi tidak pernah diucapkan penutur asli. Gunakan skill ini setiap
  kali pengguna minta menerjemahkan (translate, terjemahkan, alih bahasa) kalimat,
  paragraf, copy website, dokumen, caption, artikel, UI string, atau konten dwibahasa
  ID/EN — termasuk saat pengguna hanya bilang "bantu bikin versi Inggrisnya" atau
  "versi Indonesianya gimana" tanpa kata "translate" secara eksplisit. Wajib dipakai
  juga ketika mengevaluasi/memperbaiki teks ID atau EN yang terasa aneh, kaku, atau
  seperti hasil Google Translate — bahkan jika pengguna tidak minta terjemahan baru,
  hanya minta perbaikan nada bahasa pada teks yang sudah diterjemahkan.
metadata:
  author: narr07
  version: "1.0.0"
  date: 2026-09-17
  repository: https://github.com/narr07/skills
  license: MIT
license: MIT
---

# Translate ID-EN (Anti-Slop)

> Bagian dari filosofi antislop: aturan bukan buat kelihatan patuh, tapi karena
> terjemahan literal yang lolos secara gramatikal tetap bisa merusak kepercayaan
> pembaca — dia terasa "diterjemahkan", bukan ditulis.

## Prinsip Dasar

**Terjemahkan maksud, bukan susunan kata.** Kalimat sumber punya struktur gramatika
sendiri (urutan subjek-predikat, klausa relatif, idiom). Memindahkan struktur itu
apa adanya ke bahasa target adalah akar dari semua masalah di skill ini. Proses yang
benar: baca sampai paham maksud dan nada penuhnya → lupakan sejenak susunan kalimat
sumber → tulis ulang maksud itu dengan cara orang benar-benar bicara di bahasa target.

Empat pengecekan wajib sebelum hasil terjemahan dianggap selesai:

1. **Uji baca keras** — Kalau kalimat ini diucapkan lisan ke teman, apakah terdengar
   wajar? Kalimat yang lolos di kertas tapi ganjil diucapkan → belum selesai.
2. **Uji balik-maksud** — Balik terjemahan ke bahasa sumber secara mental (bukan
   literal). Kalau makna atau nadanya bergeser, revisi.
3. **Uji ritme** — Apakah semua kalimat panjangnya seragam (~15-20 kata)? Itu ciri
   robotik. Manusia menyelingi kalimat pendek dan panjang (lihat bagian Ritme).
4. **Uji register** — Apakah tingkat formalitas cocok dengan konteks (situs
   personal santai vs dokumen resmi vs caption media sosial)?

## Arah ID → EN

### Text-book Literalism
- **Tell:** menerjemahkan struktur klausa Indonesia kata demi kata — "sebagai guru
  SD, saya meyakini bahwa..." menjadi "As an elementary school teacher, I believe
  that...", dipertahankan utuh padahal bahasa Inggris lebih suka kalimat langsung.
- **Why:** hasilnya gramatikal tapi terasa seperti esai terjemahan sekolah, bukan
  tulisan asli berbahasa Inggris.
- **Fix:** pecah kalimat majemuk Indonesia (yang suka menumpuk klausa dengan
  "bahwa", "serta", "sekaligus") menjadi 2-3 kalimat Inggris yang lebih pendek dan
  langsung.

### Over-Literal Idiom
- **Tell:** menerjemahkan idiom/ungkapan Indonesia apa adanya: "buah tangan" →
  "hand fruit", "menggigit jari" → "biting finger", "sejalan dengan" → selalu jadi
  "in line with" walau konteksnya lebih pas "matches" atau "echoes".
- **Why:** pembaca native tidak akan pernah menyusun frasa itu; ini penanda paling
  jelas dari terjemahan mesin.
- **Fix:** cari padanan idiomatik bahasa Inggris, atau — kalau tidak ada padanan
  wajar — buang idiomnya dan tulis maknanya langsung.

### Formal Register yang Tidak Perlu
- **Tell:** menjaga nada sangat formal dari Bahasa Indonesia baku ("Sehubungan
  dengan hal tersebut...", "Adapun...") ke Inggris yang jadi kaku ("In connection
  with the aforementioned matter...").
- **Why:** Bahasa Indonesia formal dan Bahasa Inggris formal punya "suhu" berbeda;
  menyalin suhu literal membuat teks Inggris terdengar seperti dokumen hukum abad
  lalu.
- **Fix:** turunkan satu tingkat formalitas saat pindah ke Inggris kecuali memang
  dokumen legal/akademik. "Sehubungan dengan hal tersebut" → cukup "Because of
  this" atau "That's why".

### Auxiliary Verb Berlebihan
- **Tell:** menambahkan "will", "shall", "would" untuk menerjemahkan penanda waktu
  Indonesia yang sebenarnya tidak butuh auxiliary di konteks itu.
- **Why:** Bahasa Indonesia tidak infleksi tense, jadi penerjemah sering
  over-compensate dengan auxiliary verb yang bikin kalimat Inggris terdengar
  ragu-ragu atau terlalu formal.
- **Fix:** pilih tense paling natural untuk konteksnya (sering present simple untuk
  fakta/kebiasaan), bukan yang paling "aman" secara gramatika.

## Arah EN → ID

### English Syntax Dipaksa ke Indonesia
- **Tell:** struktur kalimat Inggris (subjek-di-depan, klausa relatif panjang,
  passive voice) dipertahankan utuh: "This feature was designed to help users..."
  → "Fitur ini dirancang untuk membantu pengguna..." dipertahankan pasif padahal
  Bahasa Indonesia lebih hidup dalam bentuk aktif.
- **Why:** passive voice Inggris yang diterjemahkan literal ke Indonesia terasa
  birokratis dan menjauhkan pembaca.
- **Fix:** ubah ke aktif kalau memungkinkan: "Fitur ini kami rancang supaya
  pengguna lebih mudah..." — beri subjek pelaku yang jelas.

### Konjungsi Formal Bertumpuk
- **Tell:** "furthermore", "moreover", "additionally", "however" diterjemahkan
  taat asas jadi "selain itu", "di samping itu", "namun demikian" — dan dipakai di
  awal HAMPIR SETIAP paragraf.
- **Why:** ini salah satu penanda paling kentara tulisan robotik dalam Bahasa
  Indonesia (lihat juga daftar terlarang di bawah).
- **Fix:** variasikan atau hilangkan. Sering kali hubungan logis sudah jelas dari
  konteks tanpa perlu kata sambung eksplisit.

### Istilah Teknis Diterjemahkan Padahal Tidak Perlu
- **Tell:** menerjemahkan istilah teknis yang sudah jadi kosakata sehari-hari
  pembaca ID di bidang tersebut — "database" jadi "pangkalan data", "framework"
  jadi "kerangka kerja", "deploy" jadi "menggelar" — di konteks tulisan teknis
  modern (developer, produk digital).
- **Why:** pembaca teknis ID justru terbiasa dengan istilah Inggrisnya; versi
  terjemahan malah terasa asing dan usang.
- **Fix:** pertahankan istilah domain-spesifik dalam Bahasa Inggris jika itu yang
  lazim dipakai komunitasnya (developer, desain, bisnis digital). Terjemahkan
  istilah umum/non-spesialis yang memang punya padanan wajar dalam percakapan
  sehari-hari.

### Istilah Umum Dibiarkan dalam Bahasa Inggris Padahal Ada Padanan yang Lazim
- **Tell:** kebalikan dari poin di atas — istilah non-teknis dibiarkan dalam
  Bahasa Inggris demi kesan "keren" padahal padanan Indonesianya sudah lazim dan
  lebih jelas bagi pembaca umum: "Digital Craftsman", "problem solver",
  "passionate about", "seamless experience".
- **Why:** ini kebalikan slop — bukan terjemahan kaku, tapi campur kode
  (code-mixing) yang tidak fungsional, membuat teks versi ID terasa setengah hati.
- **Fix:** tanyakan: apakah istilah ini dipakai karena memang tidak ada padanan
  wajar, atau cuma karena "kedengaran lebih keren"? Kalau alasannya yang kedua,
  cari padanan Indonesia yang tetap punya kekuatan yang sama (bukan terjemahan
  kamus paling literal, tapi padanan yang enak dibaca).

## Ritme Kalimat (Berlaku Dua Arah)

Terjemahan mesin dan LLM naif punya ciri khas: semua kalimat panjangnya seragam.
Manusia menulis dengan ritme:

- **Kalimat sangat pendek (1–5 kata):** penegasan atau jeda. *"Hasilnya jelas."* /
  *"The result? Clear."*
- **Kalimat sedang (10–18 kata):** penjelasan lugas.
- **Kalimat panjang (20–35 kata):** untuk logika yang butuh detail atau nuansa.

Kalau draf terjemahan menghasilkan blok paragraf dengan kalimat yang semuanya
kira-kira sama panjang, itu tanda perlu dipecah/digabung ulang — bukan hanya
diterjemahkan apa adanya dari sumber (sumbernya sendiri mungkin juga punya masalah
ritme yang sama).

## Daftar Frasa Terlarang (Anti-AI Tone)

Frasa ini boleh muncul di teks sumber, tapi jangan direproduksi begitu saja ke
bahasa target — cari cara re-ekspresi yang lebih hidup:

| Kategori | Hindari (ID) | Hindari (EN) |
|---|---|---|
| Pembuka klise | "Dalam era digital saat ini...", "Di zaman modern yang serba cepat..." | "In today's fast-paced world...", "In the ever-evolving landscape of..." |
| Basa-basi meta | "Perlu diingat bahwa...", "Tidak dapat dipungkiri bahwa..." | "It is important to note that...", "Needless to say..." |
| Hiperbola kosong | "Solusi revolusioner", "Transformasi fundamental" | "Game-changer", "Revolutionize", "Seamless" |
| Transisi kaku bertumpuk | "Selain itu,", "Di samping itu," (berulang di awal paragraf) | "Furthermore,", "Moreover," (repeated) |
| Penutup klise | "Secara keseluruhan...", "Kesimpulannya..." | "In conclusion,", "To sum up..." |

Kalau teks sumber sudah mengandung frasa ini, terjemahan yang jujur secara makna
tapi anti-slop tetap boleh menuliskannya secara setara di bahasa target — tapi
jangan menambahkan frasa ini sendiri saat teks sumber sebenarnya lebih lugas.

## Menjaga Sintaks Non-Bahasa (Kode, Markdown, MDC)

Kalau teks yang diterjemahkan adalah konten web (Markdown, komponen MDC Nuxt
Content, JSX, frontmatter YAML), jangan ikut menerjemahkan atau merusak:

- Nama komponen (`::tip`, `::steps`, `::faq-item{question="..."}`), atribut, dan
  tag HTML/JSX.
- Path file, URL, nama variabel, dan kunci frontmatter (`title:`, `date:`,
  `tags:`) — hanya **nilai** yang diterjemahkan, bukan kuncinya.
- Placeholder/interpolasi (`{nama}`, `{{variable}}`).

Terjemahkan isi teks di antara/dalam komponen tersebut, biarkan strukturnya utuh.

## Alur Kerja

1. Baca seluruh teks sumber dulu sampai paham maksud, nada, dan audiensnya —
   jangan mulai menerjemahkan kalimat pertama sebelum tahu konteks keseluruhan.
2. Tulis draf pertama sebagai *penulisan ulang maksud*, bukan pemetaan kata.
   Boleh mengubah urutan kalimat, memecah/menggabung kalimat, atau membuang
   pengulangan yang di bahasa sumber terasa wajar tapi di bahasa target berlebihan.
3. Jalankan empat uji di atas (baca keras, balik-maksud, ritme, register).
4. Periksa daftar frasa terlarang dan pola kaku sesuai arah terjemahan (ID→EN atau
   EN→ID) di atas.
5. Kalau ini konten dwibahasa untuk website (seperti pola kerja `artikelgen`),
   pastikan kedua versi punya bobot dan struktur yang setara — bukan salah satu
   versi terasa "asli" dan yang lain terasa "terjemahan kelas dua".
6. Sajikan hasil akhir. Untuk teks pendek (judul, caption, UI string), cukup
   berikan hasilnya langsung. Untuk paragraf/dokumen, tandai singkat (1 baris) di
   mana ada penyesuaian makna signifikan (bukan sekadar kata per kata) supaya
   pengguna tahu itu bukan salah terjemah.

## Checklist Akhir

- [ ] Tidak ada kalimat yang, kalau dibaca keras, terdengar "diterjemahkan"?
- [ ] Register/formalitas cocok dengan konteks, bukan disalin mentah dari sumber?
- [ ] Panjang kalimat bervariasi, tidak seragam?
- [ ] Tidak ada frasa dari daftar terlarang yang ditambahkan sendiri?
- [ ] Istilah teknis mengikuti konvensi komunitasnya (tetap Inggris kalau lazim,
      diterjemahkan kalau memang ada padanan sehari-hari yang lebih jelas)?
- [ ] Sintaks non-bahasa (kode, Markdown, MDC, frontmatter) tetap utuh?