# Tugas Praktikum Pemrograman Aplikasi Web (PPAW) — Week 6
## JavaScript DOM Manipulation, Event Handling, & Fetch API

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![DummyJSON](https://img.shields.io/badge/API-DummyJSON-008080?style=for-the-badge)

---

### 👤 Identitas Praktikan
* **Nama** : Haidar Yahya Mudhofar
* **NIM** : 20240140093
* **Kelas** : B
* **Mata Kuliah** : Praktikum Pemrograman Aplikasi Web (PPAW)
* **Minggu ke-** : 6 (Enam)
* **Repository** : `Week6-KelasB-20240140093`

---

## 📌 Deskripsi Project

Project ini dibangun untuk memenuhi ketentuan tugas **PPAW Week 6**, yaitu membangun aplikasi web interaktif yang bersih, responsif, dan rapi menggunakan **Tailwind CSS** dengan estetika modern *macOS-inspired rounded cards* (`rounded-3xl`, `rounded-2xl`, segmented capsule navbar) dan aksen warna **Indigo**:

1. **Katalog Produk (`index.html`)**:
   - Mengambil data produk dari endpoint publik [DummyJSON](https://dummyjson.com/products) menggunakan **Fetch API** asinkronus (`async/await`).
   - Merender kartu produk ke halaman web menggunakan manipulasi DOM murni (gambar, nama, kategori, rating, harga diskon, dan stok).
   - Menangani status pemuatan (*loading spinner*) dan status gagal (*error state* dengan tombol coba lagi).
   - Fitur pencarian nama produk *real-time* dan filter kategori dinamis.
   - **Fitur Transfer Data Produk**: Setiap kartu produk dapat diklik untuk otomatis memilih produk dan berpindah ke halaman form caption generator.

2. **Caption Generator (`form.html`)**:
   - Formulir interaktif untuk membuat teks caption produk.
   - Menggunakan **DOM Manipulation** dan **Event Handling** (`submit`, `input`, `reset`, `click`).
   - **Auto-Populate Data**: Otomatis mendeteksi produk yang dipilih dari katalog, menampilkan kartu ringkasan produk terpilih, dan mengisi field formulir (Nama Produk, Kategori, Harga, dan Deskripsi).
   - Validasi input sederhana (nama minimal 3 karakter, kategori wajib, deskripsi minimal 10 karakter).
   - Menghasilkan teks caption yang rapi dan menyediakan tombol untuk menyalin teks ke *clipboard*.

---

## 📁 Struktur Direktori Project

```text
Week6-KelasB-20240140093/
├── index.html          # Halaman 1: Katalog Produk (Fetch API & Transfer Produk)
├── form.html           # Halaman 2: Caption Generator (Form DOM & Auto-Populate)
├── js/
│   ├── index.js        # Logika Fetch API, filter katalog, & transfer produk
│   └── form.js         # Logika Form, auto-populate, validasi, & salin teks
├── .gitignore          # File konfigurasi git ignore
└── README.md           # Dokumentasi tugas Week 6
```

---

## 💻 Panduan Menjalankan & Menguji Alur Fitur

1. **Buka di Browser**:
   - Buka `index.html` di browser (misalnya via Live Server di `http://127.0.0.1:3001/index.html` atau server lokal lainnya).
2. **Uji Pengambilan Data & Filter**:
   - Amati produk yang dimuat dari DummyJSON. Coba fitur pencarian dan filter kategori.
3. **Uji Klik Produk ke Form**:
   - Klik salah satu kartu produk (misalnya *"Essence Mascara Lash Princess"*).
   - Halaman otomatis berpindah ke `form.html`.
   - Box produk terpilih langsung muncul, formulir terisi otomatis, dan hasil teks caption langsung ditampilkan.
4. **Uji Salin Teks**:
   - Klik tombol **"Salin Caption"** untuk menyalin hasil teks caption ke clipboard.
