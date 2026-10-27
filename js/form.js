/**
 * ====================================================================
 * CAPTION GENERATOR — DOM, EVENT HANDLING, & TEMPLATES
 * ====================================================================
 * Mengadopsi arsitektur template & validasi terstruktur (PAW-ANTARA-WEEK5)
 * Mahasiswa : Haidar Yahya Mudhofar
 * NIM       : 20240140093
 * Kelas     : B
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Selektor Form & Input
  const captionForm = document.getElementById('caption-form');
  const productNameInput = document.getElementById('product-name');
  const productCategoryInput = document.getElementById('product-category');
  const productPriceInput = document.getElementById('product-price');
  const templateSelect = document.getElementById('template-select');
  const productDescInput = document.getElementById('product-desc');

  // Error & Feedback Elements
  const nameError = document.getElementById('name-error');
  const categoryError = document.getElementById('category-error');
  const priceError = document.getElementById('price-error');
  const descError = document.getElementById('desc-error');
  const formFeedback = document.getElementById('form-feedback');

  // Selected Product Box Elements
  const selectedProductBox = document.getElementById('selected-product-box');
  const selectedThumb = document.getElementById('selected-thumb');
  const selectedTitle = document.getElementById('selected-title');
  const selectedCategory = document.getElementById('selected-category');
  const selectedPrice = document.getElementById('selected-price');
  const clearSelectedBtn = document.getElementById('clear-selected-btn');

  // Output Elements
  const resultSection = document.getElementById('result-section');
  const emptyResult = document.getElementById('empty-result');
  const resultBox = document.getElementById('result-box');
  const resultText = document.getElementById('result-text');
  const resultStatus = document.getElementById('result-status');
  const copyBtn = document.getElementById('copy-btn');
  const copyMsg = document.getElementById('copy-msg');
  const sampleBtn = document.getElementById('sample-btn');

  /**
   * Pembuat Hashtag Otomatis (PascalCase)
   * Contoh: "kopi susu aren" -> "KopiSusuAren"
   */
  function generateHashtag(text) {
    if (!text) return '';
    return text
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  /**
   * Format Nominal Harga (Rupiah / USD)
   */
  function formatPrice(val) {
    if (!val) return '';
    const trimmed = String(val).trim();
    if (trimmed.startsWith('$')) return trimmed;

    const rawNum = parseFloat(trimmed.replace(/[^\d.]/g, ''));
    if (isNaN(rawNum)) return trimmed;

    // Jika bernilai ratusan/ribuan atau ada indikasi rupiah
    if (rawNum >= 1000 || trimmed.toLowerCase().includes('rp')) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(rawNum);
    }

    // Default USD untuk data desimal DummyJSON
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(rawNum);
  }

  /**
   * Koleksi Template Caption Produk (Promo, Santai, Formal)
   * Mengikuti referensi PAW-ANTARA-WEEK5 tanpa emoji & tanpa AI-slop.
   */
  const templates = {
    promo: (nama, harga, kategori, desc, tag, catTag) => {
      const formattedPrice = formatPrice(harga);
      const descLine = desc ? `\nDeskripsi Produk:\n${desc}\n` : '';
      const catLine = kategori ? `Kategori: ${kategori}\n` : '';

      return [
        `PENAWARAN SPESIAL: ${nama.toUpperCase()}`,
        catLine + `Harga Promo: ${formattedPrice}`,
        descLine,
        `Keunggulan Pembelian:`,
        `• Kualitas produk terjamin dan melalui seleksi mutu`,
        `• Stok terbatas, manfaatkan kesempatan sebelum penawaran berakhir`,
        `• Layanan pengiriman cepat dan bergaransi aman`,
        ``,
        `Segera hubungi kontak kami untuk konfirmasi dan proses pemesanan.`,
        ``,
        `#Promo #${tag} ${catTag ? '#' + catTag + ' ' : ''}#DiskonSpesial #BelanjaHemat`
      ].filter(Boolean).join('\n');
    },

    santai: (nama, harga, kategori, desc, tag, catTag) => {
      const formattedPrice = formatPrice(harga);
      const descLine = desc ? `\nSekilas tentang produk ini:\n${desc}\n` : '';
      const catLine = kategori ? `Kategori: ${kategori}\n` : '';

      return [
        `Sedang mencari ${nama}?`,
        catLine + `Bisa kamu dapatkan dengan harga ${formattedPrice}.`,
        descLine,
        `Pilihan praktis yang pas untuk melengkapi aktivitas harian kamu. Kualitas memuaskan dengan harga yang bersahabat.`,
        ``,
        `Mau tanya ketersediaan stok atau konsultasi dulu? Langsung kirim pesan, kami siap melayani.`,
        ``,
        `#${tag} ${catTag ? '#' + catTag + ' ' : ''}#RekomendasiProduk #PilihanHarian #BelanjaPraktis`
      ].filter(Boolean).join('\n');
    },

    formal: (nama, harga, kategori, desc, tag, catTag) => {
      const formattedPrice = formatPrice(harga);
      const descLine = desc ? `\nSpesifikasi dan Keterangan Produk:\n${desc}\n` : '';
      const catLine = kategori ? `Klasifikasi: ${kategori}\n` : '';

      return [
        `INFORMASI RESMI PRODUK: ${nama.toUpperCase()}`,
        catLine + `Harga Terdaftar: ${formattedPrice}`,
        descLine,
        `Standar Pelayanan:`,
        `1. Produk telah melalui proses verifikasi dan kontrol mutu resmi`,
        `2. Pelayanan pelanggan profesional dan responsif`,
        `3. Transaksi aman dengan pengiriman terstandarisasi`,
        ``,
        `Untuk informasi lebih lanjut, penawaran resmi, atau pemesanan dalam jumlah tertentu, silakan menghubungi narahubung resmi kami.`,
        ``,
        `#${tag} ${catTag ? '#' + catTag + ' ' : ''}#ProdukResmi #Katalog #StandarMutu`
      ].filter(Boolean).join('\n');
    }
  };

  /**
   * Aturan Validasi Form Terstruktur
   */
  const rules = {
    'product-name': (val) => {
      const v = val.trim();
      if (!v) return 'Nama produk wajib diisi.';
      if (v.length < 3) return `Nama produk minimal 3 karakter (sekarang ${v.length}).`;
      if (v.length > 60) return `Nama produk maksimal 60 karakter (sekarang ${v.length}).`;
      if (!/\p{L}/u.test(v)) return 'Nama produk harus mengandung huruf.';
      return '';
    },
    'product-category': (val) => {
      const v = val.trim();
      if (!v) return 'Kategori produk wajib diisi.';
      if (v.length < 2) return 'Kategori minimal 2 karakter.';
      return '';
    },
    'product-price': (val) => {
      const v = val.trim();
      if (!v) return 'Harga produk wajib diisi.';
      const cleanNum = parseFloat(v.replace(/[^\d.]/g, ''));
      if (isNaN(cleanNum) || cleanNum <= 0) {
        return 'Format harga tidak valid (masukkan angka nominal).';
      }
      return '';
    },
    'product-desc': (val) => {
      const v = val.trim();
      if (!v) return 'Deskripsi produk wajib diisi.';
      if (v.length < 10) return `Deskripsi minimal 10 karakter (sekarang ${v.length}).`;
      return '';
    }
  };

  const errorElements = {
    'product-name': nameError,
    'product-category': categoryError,
    'product-price': priceError,
    'product-desc': descError,
  };

  /**
   * Validasi satu elemen input
   */
  function validateField(id) {
    const inputEl = document.getElementById(id);
    const errorEl = errorElements[id];
    if (!inputEl || !rules[id]) return true;

    const errorMsg = rules[id](inputEl.value);

    if (errorMsg) {
      inputEl.classList.add('border-red-500', 'bg-red-50/70');
      inputEl.setAttribute('aria-invalid', 'true');
      if (errorEl) errorEl.textContent = errorMsg;
      return false;
    } else {
      inputEl.classList.remove('border-red-500', 'bg-red-50/70');
      inputEl.setAttribute('aria-invalid', 'false');
      if (errorEl) errorEl.textContent = '';
      return true;
    }
  }

  function validateAll() {
    let isValid = true;
    let firstInvalidInput = null;

    Object.keys(rules).forEach((id) => {
      const passed = validateField(id);
      if (!passed) {
        isValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = document.getElementById(id);
        }
      }
    });

    if (!isValid) {
      showBanner('Harap periksa kembali isian formulir yang ditandai merah.', false);
      if (firstInvalidInput) firstInvalidInput.focus();
    } else {
      hideBanner();
    }

    return isValid;
  }

  function showBanner(msg, isSuccess = true) {
    formFeedback.textContent = msg;
    if (isSuccess) {
      formFeedback.className = 'mb-4 p-3.5 rounded-2xl text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200';
    } else {
      formFeedback.className = 'mb-4 p-3.5 rounded-2xl text-xs font-medium bg-red-50 text-red-800 border border-red-200';
    }
    formFeedback.classList.remove('hidden');
  }

  function hideBanner() {
    formFeedback.classList.add('hidden');
    formFeedback.textContent = '';
  }

  /**
   * Render Hasil Caption
   */
  function renderResult(text, templateType) {
    emptyResult.classList.add('hidden');
    resultBox.classList.remove('hidden');
    resultText.textContent = text;
    resultStatus.textContent = `Template: ${templateType.toUpperCase()}`;

    // Auto-scroll pada layar mobile agar pengguna langsung melihat hasil
    if (window.innerWidth < 1024 && resultSection) {
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Eksekusi Pembuatan Caption
   */
  function processForm() {
    if (!validateAll()) return;

    const nama = productNameInput.value.trim();
    const kategori = productCategoryInput.value.trim();
    const harga = productPriceInput.value.trim();
    const desc = productDescInput.value.trim();
    const templateKey = templateSelect.value || 'promo';

    const tag = generateHashtag(nama);
    const catTag = generateHashtag(kategori);

    const templateFn = templates[templateKey] || templates.promo;
    const output = templateFn(nama, harga, kategori, desc, tag, catTag);

    renderResult(output, templateKey);
    showBanner(`Caption dengan template "${templateKey}" berhasil dibuat.`, true);
  }

  // Event Listeners Input Real-Time
  Object.keys(rules).forEach((id) => {
    const inputEl = document.getElementById(id);
    if (inputEl) {
      inputEl.addEventListener('input', () => validateField(id));
      inputEl.addEventListener('blur', () => validateField(id));
    }
  });

  // Re-generate saat template diganti jika data sudah terisi
  templateSelect.addEventListener('change', () => {
    if (productNameInput.value.trim() && productCategoryInput.value.trim()) {
      processForm();
    }
  });

  // Submit Form
  captionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    processForm();
  });

  // Salin Caption
  copyBtn.addEventListener('click', () => {
    const text = resultText.textContent;
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      copyMsg.classList.remove('hidden');
      setTimeout(() => {
        copyMsg.classList.add('hidden');
      }, 2000);
    });
  });

  // Reset Form
  captionForm.addEventListener('reset', () => {
    setTimeout(() => {
      Object.keys(rules).forEach((id) => {
        const inputEl = document.getElementById(id);
        const errorEl = errorElements[id];
        if (inputEl) {
          inputEl.classList.remove('border-red-500', 'bg-red-50/70');
          inputEl.setAttribute('aria-invalid', 'false');
        }
        if (errorEl) errorEl.textContent = '';
      });
      hideBanner();
      resultStatus.textContent = 'Siap';
    }, 10);
  });

  // Contoh Data
  sampleBtn.addEventListener('click', () => {
    productNameInput.value = 'Kopi Susu Aren 250ml';
    productCategoryInput.value = 'Minuman';
    productPriceInput.value = '25000';
    templateSelect.value = 'promo';
    productDescInput.value = 'Racikan biji kopi arabika pilihan berpadu dengan susu segar murni dan gula aren organik khas nusantara.';

    Object.keys(rules).forEach((id) => validateField(id));
    processForm();
  });

  /**
   * Cek Transfer Data Produk dari Katalog (sessionStorage)
   */
  function loadSelectedProduct() {
    const dataString = sessionStorage.getItem('selected_product');
    if (!dataString) return;

    try {
      const product = JSON.parse(dataString);
      if (!product || !product.title) return;

      selectedProductBox.classList.remove('hidden');
      selectedThumb.src = product.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
      selectedTitle.textContent = product.title;
      selectedCategory.textContent = `Kategori: ${product.category || 'Umum'}`;

      const discount = product.discountPercentage ? Number(product.discountPercentage).toFixed(1) : '0';
      const finalPrice = product.price * (1 - (Number(discount) / 100));
      selectedPrice.textContent = `Harga: $${finalPrice.toFixed(2)} (Diskon ${discount}% dari $${product.price})`;

      // Isi form secara otomatis
      productNameInput.value = product.title;
      productCategoryInput.value = (product.category || 'Umum').toUpperCase();
      productPriceInput.value = `$${finalPrice.toFixed(2)}`;
      templateSelect.value = 'promo';
      productDescInput.value = `${product.description || ''} Brand: ${product.brand || 'Original'}. Stok: ${product.stock || 10} unit.`;

      // Hapus status error sebelum validasi
      Object.keys(rules).forEach((id) => validateField(id));

      // Langsung proses hasilnya
      processForm();

      showBanner(`Data produk "${product.title}" berhasil dimuat dari katalog.`, true);

    } catch (e) {
      console.error(e);
    }
  }

  // Hapus Pilihan
  clearSelectedBtn.addEventListener('click', () => {
    sessionStorage.removeItem('selected_product');
    selectedProductBox.classList.add('hidden');
    captionForm.reset();
    emptyResult.classList.remove('hidden');
    resultBox.classList.add('hidden');
    resultStatus.textContent = 'Siap';
    showBanner('Pilihan produk dibersihkan. Anda dapat mengisi form secara mandiri.', true);
  });

  loadSelectedProduct();
});
