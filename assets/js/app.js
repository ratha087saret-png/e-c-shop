/*
 * E-c shop – Static Site Generation (SSG) frontend.
 * Product catalog and all product detail pages are pre-generated in index.html.
 * This script only handles browser interactions: cart, checkout and HTML invoice.
 * No PHP, API, fetch(), server, or database is used.
 */
(() => {
  'use strict';

  const data = window.STORE_DATA || { categories: [], products: [] };
  const products = data.products || [];
  const CART_KEY = 'ec_shop_static_cart_v1';
  let memoryCart = [];
  let lastOrder = null;
  let invoiceObjectUrl = null;
  const invoiceLogoDataUri = 'data:image/jpeg;base64,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3bfWQsO0yCebQPVHDeUDzDhE4gX6yibMaHucfgj0C7Ll2PPyXmtqKNM5BqoZTGP4oUDzBQMh+oHrGATBR8i1kw7pqDdRx2zu6HRAUH8/lKVS8EnpJ8guKGlm5QGXYoPlWZ1qhwDTTusCoBzF+qDn+ahovVXm3tEWeyT15XNuBmaHoxmCHsoTWsQcy5RQFKTkAgASA/q8pSqXihQUZgcI+JE10rIjDkPqgIu+nzB+qOuIRUh5IEwC4fh9ApFL9XClKpfq4UpVKvA+rktiEDcX+qLECpLAwXJpvqL1mgpClRQQTi1iPqGApE2EiKFCRzhEIJHqLvpjPoC9ATGJLlMIWEJ8JkInIhk7g/SHJ2BOwGGRMBBabB9O2Ipo9DjUpj6J+RKBMpzQkrCwhwEWi4kgqFDG14gVRJXQISAeX9hiADmr0rolDG16JT7SSpTCYQHERYBNngKGULLexL2JexL2JexL3Je5WC9iXuS9iXuS9mXsy9iXsS92Xuy9yXuS92Xuy9yXuS9yXviinFYCw0EIIB8DWCpRlyYmJtu1NTLly27U1NTU25NuTbk25ciamptybdZam3JlyAoWTfIyZMmTJkyZMmTJkyZMmTJkyZMmTJkyZMmTJk3wf//aAAwDAQACAAMAAAAQEswAIggAgQwQAwY04gc0gkA0Ye888888888888888sI2IM42884888c88888888888siMoU88888888888888888886wG8888848s888880808888qM+888888888888sUsU8gw86wq8848044www84s88soI0Y+8u8888sU488wk80c8888ss+wS8888sYksAIcw884080swC8C88880QEUoY8Uw0UAIY08+wq884wMIoQ8A8MAwY4sQ88+Aq88McwUo84wwc8IIEsc88+wqsE084AMEoME88g08c888+M+ooo08kM8IY08kc888888uA288I8wkMQUMs0888888886A288s04scs488888808888qAC88880880888888888888uA6888888888s88888888s8uMG2c888888848888s88s88kMM4888888888888488888q6wccg288888888888888wyAY8Y4IqYwkw09o0AAUMUE8KU8888AgAgc8g88gAAAcAccgc8A//EABYRAAMAAAAAAAAAAAAAAAAAABFQgP/aAAgBAwEBPxC7Al//xAAcEQACAwADAQAAAAAAAAAAAAAAARARQCAxQWD/2gAIAQIBAT8Q+a8hZVnULKs6zqFlULKoWVQsqhZVCyqFlULKoWVQh5PJ7xpDfDsrBQ3yssssssssssssssssvX//xAAqEAEAAgAEBQMFAQEBAAAAAAABABEhMUFREGFxgZEgofAwQLHB0VDh8f/aAAgBAQABPxDhlFlxhJrESu8rvKbyu8pvKbym8pvKbym8TvKbym8rvKbym8rvKOspvKbym8rvKbylZym8rvK7yu8BvAbwMLawl+llxgDWGawTOeQ7A8wx/YMv1PxynM838nN8/wDJzfP/ACc3zfyOi+b+Tm+b+Tm+b+Tn+b+Tm+f+Q1Xzfyc3zfyc3zfyc/z/AMnP+XSc/wA38nN838nP838nN838nP8AP/JzfP8Ayc3z/wAnN838nN8/8hu+b+T/ANV/JX8v1EdvaGLa6EqCZwnXgjcGacVlBKiCG2Pn5O6EcF37MMpn96ggLNRxmeu/k8QMXZTKf5DBjCTgDwYqgBKWGMVQ7zJkdef+FpAQCJiOsuyc3V5jlDGcsINwjMCXGMZh4uZob/4HP1YfUmBq36SoxlhBiwlIyrX6HaZFBX3un0TRoUjqQXt5luaS4RWR0SsZjExfDT/IwcxOw/8AZeBFcOiNg5oCFlIUfT1mn3nP1DrpLjdFZmRg2hH0NP8AB1nSC94sP3tqBQAWrpGufhkdnggXyD8tLTY3pL6e/pJ8VvFhhi5913jHwOxkdV7FrgSxQ2zowU7j2AQdtR6J/wACn/GoClSdZkiSrgIFFVUNlx+iZwfK1gwzMi+Pb1c/sceBlgWpQG8S+iR2DnRRsDdhTUFu7JqcXGgK0y+UbAweTS/EAgQpF3Si3njKOqF9M4B5jaEoA2A9Fy/QZx/O1mTM76e9OHZ8TzO07e3Ds+J2fE7cPM7M7M8+IhIJMYGDdZZLqbQrv2YqoO8KMCuyhboycg9HWIRNBjbDdQntMr7S/HjYPNCdbCD9mbUbyGBfm1DzfiZr3Rd2AFekuy74E+a3mTMyfH6/RHKiiBlo50Wg4XUdmVrFdgB2OPCBvjxFgxucMGKPTAwYcGCWN+AXFFrRuri95gMCirEo77p1bcS+WCeSzDkDE225DzxQXSRE0huc8U5hLMNmPtkhOvqtngEpejmp8sMk4q2H4yhKVDZ2wAO7MRDMKnIWhbsDlcGlJZziJqBbdX4vljyazERAWUDAegcE/XDD87GZHC+H1+jpuLb2nuDvLsGqvGuCv0O6oFoxElpiqBWMC9GjywFe7wLXfStGDRg0YMGjRlX/AGGGwcEwAUAZBLwVgEDuuR5l+WUZt1D2Jb5Uo9633ZXDX0qTmNUzEcyXoLMrUUU6pVepTrMkTWsdlUEdXHo4fDbzImZ9IUEpxNohjUGtf8R4i0XV1jUwK1BzyZ6UO3B5fycSyYxL0GLyMYJLW1+XKPe2XtqwFsQRoqEIc1EYa/DGwz15LnG1xM1RZksmLjl6svVVwrzOBfmdEs2Oi9z8pDOfHbzJ4Hs30sG9u+aY1IW9NR6lO8CjArlCqCINCp1xvcTYYwul0XNVzYcCr4CEJimRjLR6KzpzCdNUzzafWuTl42wz4MZgTDRaBmkY6Ae/A+NvMngD4XHH14LZCGIn8BYowVsbDnYPdjXgDM65DmqDmywuYXhkckUHTjjp3tgrrJYEVUCzWA/3xRl5PAYrzPWSvKKq/LnudmiJkpSDoHXDCAAABQGnqt8hZfLkbXiJBxvD2RLJ+iinVgPAujnq4EwIJA3bNZPJx4B5y8wrXwMuWCC6PaA7R+RoarfkZroDGPKimlsX6p7Vw+G3mTMyHsvpAct+aOX2u5ViUjqUdiuyeTS62e7OXEVi5AFatOAbsrIMYoMc3VPap8a/cF+N7wfL53OZk/jvBcooA1hZzEL4USLETMfVZlKk3WnXXoGOVkJ337qxeGPHNajBmrGVDEcxNllHxgNRyZZfVlYszdjoILO5gQYPjvNtbYw1eGs+O3mTM6eyfRcwJKgGauhGAN2JIPv6yuZyh6lJwwLa5uRzZmGgmAcB5AdnEhB0gm0K2hWx4mGo8SlA5Q7jgOzQ/DMEwCgDAJV/BHNB1H9iOZfLeBKbmSp4lKoBdLQ7CBLwkrUtquqsQIwBanIDeBJfxAS6mC1pAcMc4HqSIZzhzaHZMQjeZwbeUgzEPzH/AI8NMeXYjnWntl1axeaxdJVjwcxWuqZZuhxM58VvMnhHtvoGW+XIsrMukYbxIOrcCNYsM8Lks4CAAoAyh0QwazeL0b6c/oLhCELgRSlBtIOabXywyuwxqAUAZAaQ93CjFSJiX7iKZ+V/YpmvVS1c17wwxybpuKdZBXFWOWmPMBwljRbiyqVeq8XiUFqwGjyuB5fI5Qw3LECe0Y4YZtIkGKrSNqasBQqdS8zS2DLmcsPR8FvMmZ0PZepBLiwWKq4BzY9e7WHmDgAtcIzDJgaCtVlxWxFtXHM6BMtIkBlT0BjuAVZ/IQd144RJuuiNMR2Ma4E/Mz6tuHp05QarNsceqo9GBTwaCKADIDTgaLznqRBmOq8gg+Y8FiXHkFYaoUvpcp5MFTZPzaTrLtcVHMfYo7cDpDnGVxh1fi4ZdMHjKvBGmzopouHTKCkpVu5mVCWdRhahNVUIzsJ0rzTYw9R8beZMzoey9JBh1KtAzTQMWNz622tJmZcvIq4QBtHGmdm3V1Y7BwxLWsYtH5CvQ1DHmGAXNSDS7dfQYMQPkn6nw79T53+p8j/U+Z/qYxzJ4GqYltHX0LMK+6mnsWJWHAyQJb+yBBao4Jeswvj+I1LRraNlICwNDHVcowtC8BYGKcg8qGsDkDOiA8HrPhbzJmZD23otUB2KaBqOAarGivF54whn2GEuYgbnYUb4w6niRmBarQG8r2v1wGQTq9A14EMoRQhHTKMU1RvdGRhmkJHKtEUAGQHo56WJQPDHcjo5NjkJmsb3MZTUx2ZTtHAtwN2WRrQUW6Ydi3lAHmGha5HoORmuLy9Z8LeZMzIey4oRAAtVwIom4TA4LvqbDHVCfQhmCKeD3SDXQ+gqA2ADiQg/ThWzpBzSVsUbQ9QwuEtCc8xTXrorLUeVwjRmuWqapxXVfUQXaMHzVjBR2ZX7AEGIuRr6NZK49UVrEV7IQVxUWDYDA+ifK3mXMyHsuLhrqKWKXanUTpgSs1GXdBfD78MuBVuOsWTSZm8+e/qJqIVJiqpgRm/U8ygxjqEfKfazhiWaprWp8t/U+W/qfL/1KEDcCvNMADchMtFonPiK6XAQHZ01H5UthhV9ZaW9Bnz9RlEUrtyxHrU/blOjMXR6Qc3xrK8sdm3N+qV87OZXCPbcB3QBMxO4QRYlF0XueOC/GgZi5XMtUDLbshFgTMT0myHjCtTcsluHBfD1LNC9xETnBsvhyuXoKtg0bbJeqvAzGktjQmw2VvfoIH9jAc1wmvk4PRXC7pDKxe5TBPd6R8CQVYGxC/D1gpNKLygXn658reZczIey4UvH/KN52eEwDEpaUj0WnJOnEAtweYcbuDqvhskxaJM6dMHXLn6BgsKhSAV1UjmVrLFFjrNGhIoyZaWWWpC0wC9a9DyFXTWkxuwZBUawsGgtukALjAUMiEbsllprC2tI1mDdlYiEAPAub1tB+jiCIG+D4keyWKYcsfAURxHCkO4vagXx0CgORp9ifC3mXwvxuFSNvqhJ0q9plBW44y12Y33U0inOQEmaJmegtDM1THLKEWu1vs5JiRfHJFf4++OKalE8UIirOsndphBm35WMoNrdI2EpBWhVBsAQFbpp+Jl0LGgr7uDW4MqJ8K9pd4Sk8dhaOOzB3uyBvJY/qo6WRIj4pJ+GpMkTuMt8Z8QAArAy+np9H5XOZMzp+FwycpPGpPDDYnrSRyQULnnkkpRIJjd0LTyc5iALuw64q9FzNtM6c454IgqeRJ7UfaI0ma1PIJMOY5ODB0hYwt7m4oe7YfhAqF+WCZQ59rWew95/HS+WQpSs9HmpHUieQ+lG+EnvgSIMe0AbHJRloUCj7ismZ0/C4kGXB5OiGIaJSTGkwENstd63WWp0y29ijyZvRAB7D3IKUHNSfeAjsw/MKM3zYQU5v+BETLih4R/MH2GKu3+4fS7F7pXXvM8FhCcrW9oCRcHX72kOwQSwUKgOQQ+5SVk8DLpvThQgDbs4TMw0BPeTZvNAvylsck1fmLjZ39rkRlOVHe05TlR7CVec5fe15My+B+N9pp9PT6fuMyeF+F9jr9xpPdZkzFDgj8H6PL/BcX5/zMmZY+Xnumln3uv0+c5277w0Zll6N5iRaWdTD/IxyrA6nAlBBowy1S8dHm6nzb/IvfZ5+hKggqBLxjw09nOYb64bjU+lX3GvoxDKw3GhHLxY5yoTARylxATCJAcAOpuc4XE9ievX70+JbVl6GAXQ3ecoMJSZQNIkFkuIQcIzx9i5PM2Zklth1D7LH7DO8bjoEKFaw3A5u7BKUhCCiHBlhBdIaLUM5QEpJTFH/wAzJ9pTgno398IRYO6HhU8yuPbhXKY7THaduFTtwqVylcKmM7SuUrlMZ5hFBNUECcBaN/bCHJH/APEyPeKM6D2sKmEPRKIHFIksluk0yXZEvmisq5YSrIuQv7PmH7nzD9z5h+58w/c2/gc5u/A5z4h+5/7D+z5B+58Q/cfmH5m98DnPlH7gXyPeL5fA5z5h+58Y/c+MfufIP3LPge8fjH5nNvhvPgH7lnwPefIP3L8Fzb/pBvC9WMqqsErzggwlZlKYHpziRhDAdILpFIdqcqciU2lNobE5HCIim0ptOROROROR6RIKxyJyOIFdpyoQEAHKAaQpDBKleuokqUdJSVlZWV4aysrw1lZWVleGu0rKysrKyu0rwU2lZSUlJUCV6f/Z';

  const money = (value) => '$' + Number(value || 0).toFixed(2);
  const finalPrice = (product) => Number(product.price) * (1 - Number(product.discount || 0) / 100);
  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
  const imagePath = (path) => path ? String(path).replace(/^\//, '') : 'assets/images/logo.png';
  const getProduct = (id) => products.find((product) => Number(product.productId) === Number(id));

  function readCart() {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) memoryCart = parsed;
      }
    } catch (_) {
      // Some browsers limit storage for file:// pages. The in-memory cart still works.
    }
    return memoryCart;
  }

  function saveCart(cart) {
    memoryCart = cart;
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
    catch (_) { /* Use the current tab's memory when local storage is unavailable. */ }
    updateCartBadge();
  }

  function getCartCount() {
    return readCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  }

  function getCartDetails() {
    return readCart().map((item) => {
      const product = getProduct(item.productId);
      if (!product) return null;
      const size = (product.sizes || []).find((record) => Number(record.sizeId) === Number(item.sizeId));
      if (!size) return null;
      const unitPrice = finalPrice(product);
      return { ...item, product, size, unitPrice, lineTotal: unitPrice * Number(item.quantity) };
    }).filter(Boolean);
  }

  function updateCartBadge() {
    const badge = document.getElementById('cartCountBadge');
    if (!badge) return;
    const count = getCartCount();
    badge.textContent = String(count);
    badge.hidden = count === 0;
  }

  function setActiveView(viewName, productId = 0) {
    document.querySelectorAll('[data-view]').forEach((view) => { view.hidden = true; });
    let selected;
    if (viewName === 'detail') {
      selected = document.querySelector(`[data-view="detail"][data-product-id="${Number(productId)}"]`);
    } else {
      selected = document.querySelector(`[data-view="${viewName}"]`);
    }
    if (!selected) selected = document.querySelector('[data-view="home"]');
    if (selected) selected.hidden = false;
    if (window.bootstrap) {
      const menu = document.getElementById('mainNav');
      if (menu && menu.classList.contains('show')) window.bootstrap.Collapse.getOrCreateInstance(menu).hide();
      if (viewName === 'home') {
        const slider = document.getElementById('heroSlider');
        if (slider) window.bootstrap.Carousel.getOrCreateInstance(slider, { interval: 5500, ride: 'carousel' });
      }
    }
  }

  function applyCatalogFilters(categoryId = 0, query = '') {
    const normalizedQuery = String(query || '').trim().toLowerCase();
    let visibleCount = 0;
    document.querySelectorAll('[data-catalog-card]').forEach((card) => {
      const categoryMatches = !categoryId || Number(card.dataset.categoryId) === Number(categoryId);
      const textMatches = !normalizedQuery || (card.dataset.searchText || '').includes(normalizedQuery);
      const visible = categoryMatches && textMatches;
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    const count = document.getElementById('catalogCount');
    const empty = document.getElementById('catalogNoResults');
    const grid = document.getElementById('catalogGrid');
    if (count) count.textContent = String(visibleCount);
    if (empty) empty.hidden = visibleCount !== 0;
    if (grid) grid.hidden = visibleCount === 0;
    document.querySelectorAll('[data-category-filter]').forEach((pill) => {
      pill.classList.toggle('active', Number(pill.dataset.categoryFilter) === Number(categoryId));
    });
    const searchInput = document.getElementById('navSearchInput');
    if (searchInput && searchInput.value !== query) searchInput.value = query;
  }

  function updateCheckoutSummary() {
    const target = document.getElementById('checkoutSummary');
    if (!target) return;
    const items = getCartDetails();
    if (!items.length) {
      target.innerHTML = '<div class="empty-state py-3">Your cart is empty. <a href="#catalog">Browse products</a>.</div>';
      const submit = document.querySelector('#checkoutForm button[type="submit"]');
      if (submit) submit.disabled = true;
      return;
    }
    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
    target.innerHTML = items.map((item) => `
      <div class="d-flex justify-content-between gap-3 py-2 border-bottom">
        <div><div class="fw-semibold">${escapeHtml(item.product.productName)}</div><small class="text-muted">Size: ${escapeHtml(item.size.sizeLabel)} · Qty: ${item.quantity}</small></div>
        <div class="fw-semibold text-nowrap">${money(item.lineTotal)}</div>
      </div>`).join('') + `
      <div class="d-flex justify-content-between align-items-center mt-3 mb-1"><span class="fw-semibold">Total</span><strong class="price-current fs-5">${money(total)}</strong></div>`;
  }

  function renderCart() {
    const container = document.getElementById('cartContent');
    if (!container) return;
    const items = getCartDetails();
    if (!items.length) {
      container.innerHTML = '<div class="empty-state">Your cart is empty. <a href="#catalog">Browse products</a>.</div>';
      return;
    }
    const total = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const rows = items.map((item) => `
      <div class="card cart-card"><div class="card-body"><div class="row g-3 align-items-center">
        <div class="col-3 col-md-2"><img src="${escapeHtml(imagePath(item.product.photo1))}" alt="${escapeHtml(item.product.productName)}" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:16px;"></div>
        <div class="col-9 col-md-4"><h6 class="mb-1">${escapeHtml(item.product.productName)}</h6><div class="text-muted small">Size: <strong>${escapeHtml(item.size.sizeLabel)}</strong></div><div class="text-muted small">Qty: <strong>${item.quantity}</strong></div></div>
        <div class="col-6 col-md-2"><div class="text-muted small">Unit</div><div class="fw-semibold price-current">${money(item.unitPrice)}</div></div>
        <div class="col-6 col-md-2"><div class="text-muted small">Total</div><div class="fw-semibold price-current">${money(item.lineTotal)}</div></div>
        <div class="col-12 col-md-2 text-md-end"><div class="cart-line-controls justify-content-md-end"><input aria-label="Quantity for ${escapeHtml(item.product.productName)} size ${escapeHtml(item.size.sizeLabel)}" class="form-control form-control-sm" type="number" min="1" max="${item.size.stock}" value="${item.quantity}" data-cart-qty="${item.productId}|${item.sizeId}"><button class="btn btn-outline-danger btn-sm" type="button" data-remove-cart="${item.productId}|${item.sizeId}" aria-label="Remove item">Remove</button></div></div>
      </div></div></div>`).join('');
    container.innerHTML = `<div class="row g-4"><div class="col-lg-8">${rows}</div><div class="col-lg-4"><div class="card checkout-card checkout-summary p-4"><h4 class="checkout-title mb-3">Order Summary</h4><div class="d-flex justify-content-between mb-2"><span>Items</span><strong>${items.length}</strong></div><div class="d-flex justify-content-between mb-3"><span>Total</span><strong class="price-current">${money(total)}</strong></div><a class="btn btn-dark btn-shop-action w-100" href="#checkout">Proceed to Checkout</a><small class="text-muted mt-3 d-block">This is a frontend demo checkout with no real payment.</small></div></div></div>`;
  }

  function addToCart(productId, sizeId, quantity) {
    const product = getProduct(productId);
    if (!product) return { ok: false, message: 'Product not found.' };
    const size = (product.sizes || []).find((record) => Number(record.sizeId) === Number(sizeId));
    if (!size) return { ok: false, message: 'Please choose a size.' };
    const qty = Number(quantity);
    if (!Number.isInteger(qty) || qty < 1) return { ok: false, message: 'Please enter a valid quantity.' };
    const cart = [...readCart()];
    const existing = cart.find((item) => Number(item.productId) === Number(productId) && Number(item.sizeId) === Number(sizeId));
    const requested = qty + (existing ? Number(existing.quantity) : 0);
    if (requested > Number(size.stock)) return { ok: false, message: `Only ${size.stock} item(s) are available for size ${size.sizeLabel}.` };
    if (existing) existing.quantity = requested;
    else cart.push({ productId: Number(productId), sizeId: Number(sizeId), quantity: qty });
    saveCart(cart);
    return { ok: true, message: `${product.productName} added to your cart.` };
  }

  function changeCartQty(productId, sizeId, quantity) {
    const product = getProduct(productId);
    const size = product?.sizes?.find((record) => Number(record.sizeId) === Number(sizeId));
    if (!size) return;
    const qty = Math.max(1, Math.min(Number(size.stock), Number.parseInt(quantity, 10) || 1));
    const cart = readCart().map((item) => Number(item.productId) === Number(productId) && Number(item.sizeId) === Number(sizeId) ? { ...item, quantity: qty } : item);
    saveCart(cart);
  }

  function removeCartItem(productId, sizeId) {
    saveCart(readCart().filter((item) => !(Number(item.productId) === Number(productId) && Number(item.sizeId) === Number(sizeId))));
  }

  function buildInvoiceHtml(order) {
    const rows = order.items.map((item) => `<tr><td>${escapeHtml(item.productName)}<br><small>Size: ${escapeHtml(item.sizeLabel)} · Qty: ${item.quantity}</small></td><td>${money(item.lineTotal)}</td></tr>`).join('');
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(order.invoiceNo)} - Invoice</title><style>*{box-sizing:border-box}body{font-family:Arial,sans-serif;color:#171717;margin:0;padding:32px;background:#f6f6f6}.invoice{max-width:820px;margin:0 auto;background:#fff;padding:44px;border:1px solid #e8e8e8;border-radius:14px}.top{display:flex;justify-content:space-between;gap:20px;border-bottom:2px solid #111;padding-bottom:24px}.brand-wrap{display:flex;align-items:center;gap:12px}.brand-wrap img{width:52px;height:52px;object-fit:contain}.brand{font-weight:800;font-size:22px}.muted{color:#666;font-size:13px}.bill{display:flex;justify-content:space-between;gap:20px;margin:28px 0}.bill>div{max-width:50%}table{width:100%;border-collapse:collapse;margin-top:22px}th,td{text-align:left;padding:13px 10px;border-bottom:1px solid #e8e8e8}th:last-child,td:last-child{text-align:right}.total{display:flex;justify-content:flex-end;font-size:21px;font-weight:bold;padding-top:18px}.note{margin-top:32px;color:#666;font-size:13px}@media(max-width:600px){body{padding:10px}.invoice{padding:22px}.top,.bill{flex-direction:column}.bill>div{max-width:none}}</style></head><body><article class="invoice"><div class="top"><div><div class="brand-wrap"><img src="${invoiceLogoDataUri}" alt="E-c shop logo"><div><div class="brand">E-c shop</div><div class="muted">Clothing &amp; Footwear</div></div></div><h1>INVOICE</h1></div><div style="text-align:right"><strong>${escapeHtml(order.invoiceNo)}</strong><div class="muted">${escapeHtml(order.dateText)}</div></div></div><div class="bill"><div><strong>Bill To</strong><p>${escapeHtml(order.customerName)}<br>${escapeHtml(order.customerPhone)}<br>${escapeHtml(order.deliveryAddress)}</p></div><div><strong>Payment</strong><p>Demo / Pay on Delivery<br><span class="muted">No real payment was processed</span></p></div></div><table><thead><tr><th>Product</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table><div class="total">Total: ${money(order.total)}</div><p class="note">Thank you for shopping with us.</p></article></body></html>`;
  }

  function renderOrderComplete() {
    const container = document.getElementById('completeContent');
    if (!container) return;
    if (!lastOrder) {
      container.innerHTML = '<div class="empty-state">No invoice has been generated yet. <a href="#catalog">Start shopping</a>.</div>';
      return;
    }
    const order = lastOrder;
    const rows = order.items.map((item) => `<tr><td>${escapeHtml(item.productName)}<div class="text-muted small">Size: ${escapeHtml(item.sizeLabel)} · Qty: ${item.quantity}</div></td><td class="text-end">${money(item.lineTotal)}</td></tr>`).join('');
    container.innerHTML = `
      <div class="invoice-ready mb-4"><h4 class="mb-2">✓ Order placed successfully</h4><p class="mb-3">Your HTML invoice is ready. Click the button below to download the <strong>.html</strong> file.</p><button class="btn btn-dark btn-shop-action" type="button" id="downloadInvoiceBtn">Download Invoice (.html)</button> <a href="#catalog" class="btn btn-outline-dark ms-2">Continue Shopping</a></div>
      <div class="invoice-preview" id="invoicePreview"><div class="d-flex justify-content-between align-items-start gap-3 mb-4"><div><img src="assets/images/logo.png" alt="E-c shop" style="height:42px;width:auto"><h3 class="mt-3 mb-1">INVOICE</h3><div class="text-muted small">Clothing &amp; Footwear</div></div><div class="text-end"><strong>${escapeHtml(order.invoiceNo)}</strong><div class="text-muted small">${escapeHtml(order.dateText)}</div></div></div><div class="row mb-4"><div class="col-md-6"><strong>Bill To</strong><div>${escapeHtml(order.customerName)}</div><div>${escapeHtml(order.customerPhone)}</div><div>${escapeHtml(order.deliveryAddress)}</div></div><div class="col-md-6 text-md-end"><strong>Payment</strong><div>Demo / Pay on Delivery</div><div class="text-muted small">No real payment was processed</div></div></div><div class="table-responsive"><table class="table table-clean"><thead><tr><th>Item</th><th class="text-end">Amount</th></tr></thead><tbody>${rows}</tbody></table></div><div class="d-flex justify-content-end"><div style="min-width:220px"><div class="d-flex justify-content-between fw-bold fs-5"><span>Total</span><span>${money(order.total)}</span></div></div></div><p class="text-muted small mt-4 mb-0">Thank you for shopping with us.</p></div>`;
  }

  function downloadInvoice() {
    if (!lastOrder) return;
    const blob = new Blob([buildInvoiceHtml(lastOrder)], { type: 'text/html;charset=utf-8' });
    if (invoiceObjectUrl) URL.revokeObjectURL(invoiceObjectUrl);
    invoiceObjectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = invoiceObjectUrl;
    link.download = `${lastOrder.invoiceNo.toLowerCase()}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function showCurrentRoute() {
    const route = (location.hash || '#home').slice(1);
    const [path, queryString = ''] = route.split('?');
    if (path.startsWith('detail/')) {
      const id = Number(path.split('/')[1]);
      setActiveView('detail', id);
      const page = document.querySelector(`[data-view="detail"][data-product-id="${id}"]`);
      document.title = `${page?.querySelector('.detail-title')?.textContent || 'Product Detail'} | E-c shop`;
    } else if (path === 'catalog' || path.startsWith('catalog/')) {
      setActiveView('catalog');
      const categoryId = path.includes('/') ? Number(path.split('/')[1]) : 0;
      const params = new URLSearchParams(queryString);
      applyCatalogFilters(categoryId, params.get('search') || '');
      document.title = 'Shop All Products | E-c shop';
    } else if (path === 'cart') {
      setActiveView('cart');
      renderCart();
      document.title = 'Shopping Cart | E-c shop';
    } else if (path === 'checkout') {
      setActiveView('checkout');
      updateCheckoutSummary();
      document.title = 'Checkout | E-c shop';
      if (!getCartDetails().length) {
        const submit = document.querySelector('#checkoutForm button[type="submit"]');
        if (submit) submit.disabled = true;
      }
    } else if (path === 'complete') {
      setActiveView('complete');
      renderOrderComplete();
      document.title = 'Order Complete | E-c shop';
    } else {
      setActiveView('home');
      document.title = 'E-c shop | Clothing & Footwear';
    }
    updateCartBadge();
    window.scrollTo(0, 0);
  }

  document.addEventListener('submit', (event) => {
    if (event.target.id === 'navSearchForm') {
      event.preventDefault();
      const query = document.getElementById('navSearchInput')?.value.trim() || '';
      location.hash = query ? `#catalog?search=${encodeURIComponent(query)}` : '#catalog';
      return;
    }

    if (event.target.matches('.add-to-cart-form')) {
      event.preventDefault();
      const form = event.target;
      const productId = Number(form.dataset.productId);
      const selected = form.querySelector('input[name="sizeId"]:checked');
      const quantityInput = form.querySelector('input[name="quantity"]');
      const sizeFeedback = form.querySelector('[data-size-feedback]');
      const qtyFeedback = form.querySelector('[data-qty-feedback]');
      if (!selected) {
        sizeFeedback.textContent = 'Please choose a size.';
        return;
      }
      sizeFeedback.textContent = '';
      const result = addToCart(productId, Number(selected.value), Number(quantityInput.value));
      if (!result.ok) {
        quantityInput.classList.add('is-invalid');
        qtyFeedback.textContent = result.message;
        return;
      }
      quantityInput.classList.remove('is-invalid');
      qtyFeedback.textContent = '';
      const oldAlert = form.parentElement.querySelector('[data-added-alert]');
      if (oldAlert) oldAlert.remove();
      form.insertAdjacentHTML('beforebegin', `<div class="alert alert-success d-flex justify-content-between align-items-center flex-wrap gap-2" data-added-alert><span>${escapeHtml(result.message)}</span><a href="#cart" class="btn btn-dark btn-sm">Go to Cart</a></div>`);
      return;
    }

    if (event.target.id === 'checkoutForm') {
      event.preventDefault();
      const form = event.target;
      if (!form.reportValidity()) return;
      const items = getCartDetails();
      if (!items.length) {
        location.hash = '#cart';
        return;
      }
      const customerName = form.elements.customerName.value.trim();
      const customerPhone = form.elements.customerPhone.value.trim();
      const deliveryAddress = form.elements.deliveryAddress.value.trim();
      if (!customerName || !customerPhone || !deliveryAddress) return;
      const now = new Date();
      const invoiceNo = `INV-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}${String(now.getSeconds()).padStart(2,'0')}`;
      const orderItems = items.map((item) => ({
        productId: item.productId,
        productName: item.product.productName,
        sizeLabel: item.size.sizeLabel,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal
      }));
      lastOrder = {
        invoiceNo,
        dateText: now.toLocaleString(),
        customerName,
        customerPhone,
        deliveryAddress,
        items: orderItems,
        total: orderItems.reduce((sum, item) => sum + item.lineTotal, 0)
      };
      saveCart([]);
      location.hash = '#complete';
      return;
    }
  });

  document.addEventListener('change', (event) => {
    const size = event.target.closest('input[name="sizeId"]');
    if (size) {
      const form = size.closest('.add-to-cart-form');
      const qty = form?.querySelector('input[name="quantity"]');
      if (qty) {
        qty.max = size.dataset.stock || '1';
        if (Number(qty.value) > Number(qty.max)) qty.value = qty.max;
      }
      const feedback = form?.querySelector('[data-size-feedback]');
      if (feedback) feedback.textContent = '';
      return;
    }

    const qtyInput = event.target.closest('[data-cart-qty]');
    if (qtyInput) {
      const [productId, sizeId] = qtyInput.dataset.cartQty.split('|').map(Number);
      changeCartQty(productId, sizeId, qtyInput.value);
      renderCart();
    }
  });

  document.addEventListener('click', (event) => {
    const thumb = event.target.closest('[data-thumb]');
    if (thumb) {
      const detail = thumb.closest('[data-view="detail"]');
      const main = detail?.querySelector('.detail-main img');
      const thumbnailImage = thumb.querySelector('img');
      if (main && thumbnailImage) main.src = thumbnailImage.src;
      detail?.querySelectorAll('.detail-thumb').forEach((button) => button.classList.remove('active'));
      thumb.classList.add('active');
      return;
    }

    const remove = event.target.closest('[data-remove-cart]');
    if (remove) {
      const [productId, sizeId] = remove.dataset.removeCart.split('|').map(Number);
      removeCartItem(productId, sizeId);
      renderCart();
      return;
    }

    if (event.target.closest('#downloadInvoiceBtn')) downloadInvoice();
  });

  window.addEventListener('hashchange', showCurrentRoute);
  readCart();
  showCurrentRoute();
})();
