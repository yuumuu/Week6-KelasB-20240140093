/**
 * ====================================================================
 * KATALOG PRODUK — FETCH API & AUTO-TRANSFER
 * ====================================================================
 * Mahasiswa : Haidar Yahya Mudhofar
 * NIM       : 20240140093
 * Kelas     : B
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const API_URL = 'https://dummyjson.com/products?limit=24';

  const productGrid = document.getElementById('product-grid');
  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  const errorMessage = document.getElementById('error-message');
  const resultMeta = document.getElementById('result-meta');
  const productCount = document.getElementById('product-count');
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const refreshBtn = document.getElementById('refresh-btn');
  const retryBtn = document.getElementById('retry-btn');

  let allProducts = [];

  function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  }

  function calculatePricing(price, discountPercentage = 0) {
    const discount = Math.max(0, Math.min(100, Number(discountPercentage) || 0));
    const finalPrice = price * (1 - discount / 100);
    return {
      originalPrice: price,
      finalPrice,
      discountPercentage: discount,
    };
  }

  function selectProduct(product) {
    sessionStorage.setItem('selected_product', JSON.stringify(product));
    window.location.href = 'form.html';
  }

  function createProductCard(product) {
    const { originalPrice, finalPrice, discountPercentage } = calculatePricing(
      product.price,
      product.discountPercentage
    );
    const ratingFixed = Number(product.rating || 0).toFixed(1);

    const card = document.createElement('article');
    card.className = 'bg-white border border-zinc-200/80 rounded-3xl p-4 sm:p-5 flex flex-col justify-between hover:border-indigo-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group shadow-sm';
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Pilih ${product.title}`);

    // Thumbnail
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'w-full aspect-[4/3] bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden flex items-center justify-center mb-3 relative';

    const img = document.createElement('img');
    img.className = 'w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-200';
    img.src = product.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
    img.alt = product.title;
    img.loading = 'lazy';
    imgWrapper.appendChild(img);

    if (discountPercentage > 0) {
      const badge = document.createElement('span');
      badge.className = 'absolute top-2.5 left-2.5 bg-indigo-600 text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm';
      badge.textContent = `-${Math.round(discountPercentage)}%`;
      imgWrapper.appendChild(badge);
    }

    // Info Produk
    const body = document.createElement('div');
    body.className = 'flex flex-col flex-1';

    const category = document.createElement('span');
    category.className = 'text-xs text-zinc-400 capitalize mb-1';
    category.textContent = product.category || 'Umum';

    const title = document.createElement('h2');
    title.className = 'text-sm font-semibold text-zinc-900 line-clamp-2 mb-2 leading-snug group-hover:text-indigo-600 transition-colors';
    title.textContent = product.title;
    title.title = product.title;

    const ratingRow = document.createElement('div');
    ratingRow.className = 'flex items-center gap-1 text-xs text-amber-600 mb-2';
    ratingRow.innerHTML = `
      <svg class="w-3.5 h-3.5 fill-current text-amber-500" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
      <span class="font-medium">${ratingFixed}</span>
      <span class="text-zinc-400 ml-auto text-[11px]">Stok: ${product.stock ?? 10}</span>
    `;

    // Harga
    const priceRow = document.createElement('div');
    priceRow.className = 'flex items-baseline gap-2 mt-auto pt-2.5 border-t border-zinc-100';

    const finalPriceEl = document.createElement('span');
    finalPriceEl.className = 'text-sm font-bold text-zinc-900';
    finalPriceEl.textContent = formatCurrency(finalPrice);
    priceRow.appendChild(finalPriceEl);

    if (discountPercentage > 0) {
      const origPriceEl = document.createElement('del');
      origPriceEl.className = 'text-xs text-zinc-400 line-through';
      origPriceEl.textContent = formatCurrency(originalPrice);
      priceRow.appendChild(origPriceEl);
    }

    // Tombol Pilih
    const selectBtn = document.createElement('button');
    selectBtn.type = 'button';
    selectBtn.className = 'mt-3.5 w-full py-2.5 px-3 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-600 hover:text-white rounded-2xl transition-all duration-150 active:scale-98';
    selectBtn.textContent = 'Pilih & Buat Caption';

    body.appendChild(category);
    body.appendChild(title);
    body.appendChild(ratingRow);
    body.appendChild(priceRow);
    body.appendChild(selectBtn);

    card.appendChild(imgWrapper);
    card.appendChild(body);

    const handleClick = (e) => {
      e.stopPropagation();
      selectProduct(product);
    };

    card.addEventListener('click', handleClick);
    selectBtn.addEventListener('click', handleClick);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleClick(e);
    });

    return card;
  }

  function renderProducts(products) {
    productGrid.innerHTML = '';
    productCount.textContent = String(products.length);
    resultMeta.classList.remove('hidden');

    if (products.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.className = 'col-span-full py-12 text-center text-zinc-500 text-sm bg-white border border-zinc-200/80 rounded-3xl';
      emptyMsg.textContent = 'Tidak ada produk yang cocok dengan pencarian.';
      productGrid.appendChild(emptyMsg);
      return;
    }

    const fragment = document.createDocumentFragment();
    products.forEach((product) => {
      fragment.appendChild(createProductCard(product));
    });

    productGrid.appendChild(fragment);
  }

  function populateCategories(products) {
    const categories = Array.from(
      new Set(products.map((p) => p.category).filter(Boolean))
    ).sort();

    categoryFilter.innerHTML = '<option value="all">Semua Kategori</option>';
    categories.forEach((cat) => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
      categoryFilter.appendChild(opt);
    });
  }

  function filterProducts() {
    const query = searchInput.value.trim().toLowerCase();
    const selectedCategory = categoryFilter.value;

    const filtered = allProducts.filter((product) => {
      const title = (product.title || '').toLowerCase();
      const desc = (product.description || '').toLowerCase();
      const category = (product.category || '').toLowerCase();

      const matchesQuery = !query || title.includes(query) || desc.includes(query);
      const matchesCategory = selectedCategory === 'all' || category === selectedCategory.toLowerCase();

      return matchesQuery && matchesCategory;
    });

    renderProducts(filtered);
  }

  async function fetchProducts() {
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    productGrid.classList.add('hidden');
    resultMeta.classList.add('hidden');

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP Error Status: ${response.status}`);
      }

      const data = await response.json();
      if (!data || !Array.isArray(data.products)) {
        throw new Error('Data produk tidak valid.');
      }

      allProducts = data.products;
      populateCategories(allProducts);
      productGrid.classList.remove('hidden');
      filterProducts();
    } catch (err) {
      console.error(err);
      errorMessage.textContent = err.message || 'Gagal memuat data dari API.';
      errorState.classList.remove('hidden');
    } finally {
      loadingState.classList.add('hidden');
    }
  }

  searchInput.addEventListener('input', filterProducts);
  categoryFilter.addEventListener('change', filterProducts);
  refreshBtn.addEventListener('click', fetchProducts);
  retryBtn.addEventListener('click', fetchProducts);

  fetchProducts();
});
