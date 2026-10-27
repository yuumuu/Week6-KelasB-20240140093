/**
 * ====================================================================
 * CAPTION GENERATOR — DOM, EVENT HANDLING, & AUTO-POPULATE
 * ====================================================================
 * Mahasiswa : Haidar Yahya Mudhofar
 * NIM       : 20240140093
 * Kelas     : B
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Selektor Form
  const captionForm = document.getElementById('caption-form');
  const productNameInput = document.getElementById('product-name');
  const productCategoryInput = document.getElementById('product-category');
  const productPriceInput = document.getElementById('product-price');
  const productDescInput = document.getElementById('product-desc');

  // Error & Feedback Elements
  const nameError = document.getElementById('name-error');
  const categoryError = document.getElementById('category-error');
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
  const emptyResult = document.getElementById('empty-result');
  const resultBox = document.getElementById('result-box');
  const resultText = document.getElementById('result-text');
  const copyBtn = document.getElementById('copy-btn');
  const copyMsg = document.getElementById('copy-msg');
  const sampleBtn = document.getElementById('sample-btn');

  /**
   * Menampilkan pesan error validasi pada field
   */
  function setFieldError(inputEl, errorEl, msg) {
    if (msg) {
      inputEl.classList.add('border-red-500', 'bg-red-50/70');
      errorEl.textContent = msg;
    } else {
      inputEl.classList.remove('border-red-500', 'bg-red-50/70');
      errorEl.textContent = '';
    }
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
   * Validasi Input
   */
  function validateForm() {
    let isValid = true;
    const nameVal = productNameInput.value.trim();
    const catVal = productCategoryInput.value.trim();
    const descVal = productDescInput.value.trim();

    if (nameVal.length < 3) {
      setFieldError(productNameInput, nameError, 'Nama produk minimal 3 karakter.');
      isValid = false;
    } else {
      setFieldError(productNameInput, nameError, '');
    }

    if (catVal.length < 2) {
      setFieldError(productCategoryInput, categoryError, 'Kategori produk wajib diisi.');
      isValid = false;
    } else {
      setFieldError(productCategoryInput, categoryError, '');
    }

    if (descVal.length < 10) {
      setFieldError(productDescInput, descError, 'Deskripsi produk minimal 10 karakter.');
      isValid = false;
    } else {
      setFieldError(productDescInput, descError, '');
    }

    if (!isValid) {
      showBanner('Harap lengkapi isian formulir yang ditandai merah.', false);
    } else {
      hideBanner();
    }

    return isValid;
  }

  /**
   * Susun teks caption sederhana dan natural
   */
  function buildCaptionText(name, category, price, desc) {
    const priceLine = price.trim() ? `Harga: ${price.trim()}` : '';

    const lines = [
      `CAPTION PRODUK: ${name.toUpperCase()}`,
      `Kategori: ${category}`,
      priceLine,
      ``,
      `Deskripsi Produk:`,
      `${desc}`,
      ``,
      `Dapatkan penawaran terbaik untuk produk ini selagi persediaan masih tersedia. Hubungi layanan kami untuk konfirmasi pemesanan.`
    ];

    return lines.filter(line => line !== null && line !== undefined).join('\n');
  }

  /**
   * Tampilkan hasil teks ke panel DOM
   */
  function renderResult(text) {
    emptyResult.classList.add('hidden');
    resultBox.classList.remove('hidden');
    resultText.textContent = text;
  }

  /**
   * Proses Submit
   */
  function processForm() {
    if (!validateForm()) return;

    const name = productNameInput.value.trim();
    const category = productCategoryInput.value.trim();
    const price = productPriceInput.value.trim();
    const desc = productDescInput.value.trim();

    const output = buildCaptionText(name, category, price, desc);
    renderResult(output);
    showBanner('Teks caption berhasil dibuat.', true);
  }

  captionForm.addEventListener('submit', (e) => {
    e.preventDefault();
    processForm();
  });

  // Real-time error clearing
  productNameInput.addEventListener('input', () => {
    if (productNameInput.value.trim().length >= 3) {
      setFieldError(productNameInput, nameError, '');
    }
  });

  productCategoryInput.addEventListener('input', () => {
    if (productCategoryInput.value.trim().length >= 2) {
      setFieldError(productCategoryInput, categoryError, '');
    }
  });

  productDescInput.addEventListener('input', () => {
    if (productDescInput.value.trim().length >= 10) {
      setFieldError(productDescInput, descError, '');
    }
  });

  // Tombol Salin
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

  // Tombol Reset
  captionForm.addEventListener('reset', () => {
    setTimeout(() => {
      setFieldError(productNameInput, nameError, '');
      setFieldError(productCategoryInput, categoryError, '');
      setFieldError(productDescInput, descError, '');
      hideBanner();
    }, 10);
  });

  // Tombol Contoh Data
  sampleBtn.addEventListener('click', () => {
    productNameInput.value = 'Kopi Arabika Gayo 250g';
    productCategoryInput.value = 'Minuman';
    productPriceInput.value = '$12.50';
    productDescInput.value = 'Biji kopi pilihan dari dataran tinggi Aceh dengan aroma floral khas dan proses sangrai medium.';

    setFieldError(productNameInput, nameError, '');
    setFieldError(productCategoryInput, categoryError, '');
    setFieldError(productDescInput, descError, '');

    processForm();
  });

  /**
   * Cek apakah ada produk yang dikirim dari katalog (sessionStorage)
   */
  function loadSelectedProduct() {
    const dataString = sessionStorage.getItem('selected_product');
    if (!dataString) return;

    try {
      const product = JSON.parse(dataString);
      if (!product || !product.title) return;

      // Tampilkan box produk terpilih
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
      productDescInput.value = `${product.description || ''} Brand: ${product.brand || 'Original'}. Stok tersedia: ${product.stock || 10} unit.`;

      // Langsung proses hasilnya agar pengguna langsung melihat captionnya
      processForm();

      showBanner(`Data produk "${product.title}" berhasil dimuat dari katalog.`, true);

    } catch (e) {
      console.error(e);
    }
  }

  // Tombol Hapus Pilihan
  clearSelectedBtn.addEventListener('click', () => {
    sessionStorage.removeItem('selected_product');
    selectedProductBox.classList.add('hidden');
    captionForm.reset();
    emptyResult.classList.remove('hidden');
    resultBox.classList.add('hidden');
    showBanner('Pilihan produk dihapus. Anda dapat mengisi form secara manual.', true);
  });

  // Periksa data produk saat halaman dimuat
  loadSelectedProduct();
});
