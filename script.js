/* script.js - MarketPlace Pro
   - Products rendering + pagination
   - Cart (persistent)
   - Wishlist (persistent)
   - Auth (signup/login stored in localStorage)
   - Category filtering
   - Toast notifications
*/

///// ///// ---------- Sample product data ----------
// ASYNC FUNCTION TO LOAD PRODUCTS FROM BACKEND OR USE LOCAL DATA
async function loadProducts() {
  const backendUrl = 'https://your-backend-url.onrender.com/api/products'; // WE WILL UPDATE THIS LATER

  try {
    console.log("🔄 Trying to fetch products from backend...");
    const response = await fetch(backendUrl);
    
    if (!response.ok) {
      throw new Error(`Backend returned status: ${response.status}`);
    }
    
    const productsFromBackend = await response.json();
    console.log("✅ Successfully loaded products from backend!");
    return productsFromBackend;

  } catch (error) {
    console.error("❌ Backend offline or error:", error.message);
    console.log("🔄 Using local product data instead...");
    
    // RETURN LOCAL PRODUCT DATA AS FALLBACK
    return [
      {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "electronics",
        price: 79.99,
        originalPrice: 99.99,
        rating: 4.5,
        reviews: 1234,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgNzVDMTI0LjMgNzUgMTAzIDk2LjMgMTAzIDEyMlYxNzhDMTAzIDIwMy43IDEyNC4zIDIyNSAxNTAgMjI1UzE5NyAyMDMuNyAxOTcgMTc4VjEyMkMxOTcgOTYuMyAxNzUuNyA3NSAxNTAgNzVaIiBmaWxsPSIjNEY0NkU1Ii8+CjxjaXJjbGUgY3g9IjEzMCIgY3k9IjE0MCIgcj0iMjAiIGZpbGw9IiM2MzY2RjEiLz4KPGV0cm9rZT0iIzRGNDZFNSIgc3Ryb2tlLXdpZHRoPSIzIiBkPSJNMTE1IDEyNUgxODUiLz4KPC9zdmc+",
        description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
        seller: "TechStore Pro",
        shipping: "Free",
        inStock: true
      },
      {
        id: 2,
        name: "Smart Fitness Watch",
        category: "fitness",
        price: 199.99,
        originalPrice: 249.99,
        rating: 4.7,
        reviews: 856,
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjYwIiByeD0iMzAiIGZpbGw9IiMxMTE4MjciLz4KPGNpcmNsZSBjeD0iMTMwIiBjeT0iMTE1IiByPSI4IiBmaWxsPSIjNkI3M0ZGIi8+CjxjaXJjbGUgY3g9IjE3MCIgY3k9IjExNSIgcj0iOCIgZmlsbD0iIzZCNzNGRiIvPgo8Y2lyY2xlIGN4PSIxMzAiIGN5PSIxMzUiIHI9IjQiIGZpbGw9IiNGOTdBMzQiLz4KPGNpcmNsZSBjeD0iMTcwIiBjeT0iMTM1IiByPSI0IiBmaWxsPSIjRjk3QTM0Ii8+Cjwvc3ZnPg==",
        description: "Advanced fitness tracking with heart rate monitor and GPS.",
        seller: "FitTech Solutions",
        shipping: "Free",
        inStock: true
      }
    ];
  }
}

let currentProducts = [];
let products = []; // This will be set by loadProducts()

///// ---------- Global state ----------
let currentProducts = [...products];
let cart = JSON.parse(localStorage.getItem('marketplace_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('marketplace_wishlist')) || [];
let currentUser = JSON.parse(localStorage.getItem('marketplace_current_user')) || null;
let users = JSON.parse(localStorage.getItem('marketplace_users')) || [];

// Pagination state
let currentPage = 1;
const PAGE_SIZE = 6;

///// ---------- DOM elements ----------
const productsContainer = document.getElementById('productsContainer');
const cartSidebar = document.getElementById('cartSidebar');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartTotalEl = document.getElementById('cartTotal');
const overlay = document.getElementById('overlay');

const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const userModal = document.getElementById('userModal');
const categoriesModal = document.getElementById('categoriesModal');

const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

const userBtn = document.getElementById('userBtn');
const openCartBtn = document.getElementById('openCartBtn');
const openSignupFromLogin = document.getElementById('openSignupFromLogin');
const openLoginFromSignup = document.getElementById('openLoginFromSignup');

///// ---------- Utilities: toast ----------
function showToast(message, duration = 3000) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

///// ---------- Auth (signup/login/logout) ----------
function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;

  if (!name || !email || !password) return showToast('Please complete all fields');

  if (users.find(u => u.email === email)) {
    return showToast('Email already registered');
  }

  const newUser = { id: Date.now(), name, email, password };
  users.push(newUser);
  localStorage.setItem('marketplace_users', JSON.stringify(users));

  currentUser = newUser;
  localStorage.setItem('marketplace_current_user', JSON.stringify(currentUser));
  updateUIForAuth();
  closeAllModals();
  showToast(`Welcome, ${currentUser.name.split(' ')[0]}!`);
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    currentUser = user;
    localStorage.setItem('marketplace_current_user', JSON.stringify(currentUser));
    updateUIForAuth();
    closeAllModals();
    showToast(`Welcome back, ${user.name.split(' ')[0]}!`);
  } else {
    showToast('Invalid email or password');
  }
}

function handleLogout() {
  currentUser = null;
  localStorage.removeItem('marketplace_current_user');
  updateUIForAuth();
  closeAllModals();
  showToast('Signed out successfully');
}

function updateUIForAuth() {
  const accountButtons = document.querySelectorAll('[id*="Account"], [id*="userBtn"]');
  accountButtons.forEach(btn => {
    const textSpan = btn.querySelector('span');
    if (textSpan) {
      textSpan.textContent = currentUser ? currentUser.name.split(' ')[0] : 'Account';
    }
  });

  const userInfo = document.getElementById('userInfo');
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');
  const userInitial = document.getElementById('userInitial');

  if (currentUser) {
    if (userInfo) userInfo.classList.remove('hidden');
    if (userName) userName.textContent = currentUser.name;
    if (userEmail) userEmail.textContent = currentUser.email;
    if (userInitial) userInitial.textContent = currentUser.name.split(' ')[0].slice(0, 1).toUpperCase();
  } else {
    if (userInfo) userInfo.classList.add('hidden');
    if (userName) userName.textContent = '';
    if (userEmail) userEmail.textContent = '';
    if (userInitial) userInitial.textContent = '';
  }
}

///// ---------- Modal helpers ----------
function closeAllModals() {
  [loginModal, signupModal, userModal, categoriesModal].forEach(m => {
    if (m) m.classList.add('hidden');
  });
  if (cartSidebar) cartSidebar.classList.add('translate-x-full');
  overlay.classList.add('hidden');
}
function showLoginModal() {
  closeAllModals();
  loginModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}
function showSignupModal() {
  closeAllModals();
  signupModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}
function showUserModal() {
  closeAllModals();
  userModal.classList.remove('hidden');
  overlay.classList.remove('hidden');
}
function showCartSidebar() {
  closeAllModals();
  cartSidebar.classList.remove('translate-x-full');
  overlay.classList.remove('hidden');
}

///// ---------- Render products ----------
function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
}

function renderProducts() {
  const container = productsContainer;
  container.innerHTML = '';

  // pagination slice
  const start = (currentPage - 1) * PAGE_SIZE;
  const slice = currentProducts.slice(start, start + PAGE_SIZE);

  if (!slice.length) {
    container.innerHTML = '<p class="muted">No products found.</p>';
    renderPagination();
    return;
  }

  slice.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card glass';
    card.innerHTML = `
      <img class="product-image" src="${product.image}" alt="${escapeHtml(product.name)}" />
      <div class="product-body">
        <h4 class="product-title line-clamp-2">${escapeHtml(product.name)}</h4>
        <p class="muted seller">${escapeHtml(product.seller)}</p>
        <p class="muted small">${escapeHtml(product.description)}</p>
        <div class="product-meta">
          <div class="price">
            <strong>$${product.price.toFixed(2)}</strong>
            <small class="muted original">${product.originalPrice ? `$${product.originalPrice.toFixed(2)}` : ''}</small>
          </div>
          <div class="actions">
            <button class="btn small" data-add="${product.id}">Add</button>
            <button class="btn outline small" data-wishlist="${product.id}">❤</button>
          </div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  renderPagination();
}

///// ---------- Pagination ----------
function renderPagination() {
  const paginationEl = document.getElementById('pagination');
  if (!paginationEl) return;
  paginationEl.innerHTML = '';

  const totalPages = Math.max(1, Math.ceil(currentProducts.length / PAGE_SIZE));

  const prev = document.createElement('button');
  prev.className = 'btn tiny outline';
  prev.textContent = 'Prev';
  prev.disabled = currentPage === 1;
  prev.onclick = () => { if (currentPage > 1) { currentPage--; renderProducts(); } };
  paginationEl.appendChild(prev);

  // show up to 5 page buttons (centered on currentPage)
  const windowSize = 5;
  let startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
  let endPage = Math.min(totalPages, startPage + windowSize - 1);
  if (endPage - startPage < windowSize - 1) startPage = Math.max(1, endPage - windowSize + 1);

  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement('button');
    btn.className = 'btn tiny' + (i === currentPage ? ' primary' : ' outline');
    btn.textContent = i;
    btn.onclick = () => { currentPage = i; renderProducts(); };
    paginationEl.appendChild(btn);
  }

  const next = document.createElement('button');
  next.className = 'btn tiny outline';
  next.textContent = 'Next';
  next.disabled = currentPage === totalPages;
  next.onclick = () => { if (currentPage < totalPages) { currentPage++; renderProducts(); } };
  paginationEl.appendChild(next);
}

///// ---------- Cart ----------
function saveCart() { localStorage.setItem('marketplace_cart', JSON.stringify(cart)); }

function updateCartCounts() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountEl.textContent = count;
  renderCartItems();
}

function addToCart(productId, qty = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return showToast('Product not found');

  const existing = cart.find(i => i.id === productId);
  if (existing) existing.quantity += qty;
  else cart.push({ id: product.id, name: product.name, price: product.price, quantity: qty });

  saveCart();
  updateCartCounts();
  showToast(`${product.name} added to cart`);
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.id !== productId);
  saveCart();
  updateCartCounts();
  showToast('Removed from cart');
}

function changeQuantity(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) removeFromCart(productId);
  else { saveCart(); updateCartCounts(); }
}

function renderCartItems() {
  cartItemsEl.innerHTML = '';
  if (!cart.length) {
    cartItemsEl.innerHTML = '<div class="muted">Your cart is empty.</div>';
    cartTotalEl.textContent = 'Total: $0.00';
    return;
  }

  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="cart-row-left">
        <div class="cart-name">${escapeHtml(item.name)}</div>
        <div class="muted small">$${item.price.toFixed(2)} x ${item.quantity}</div>
      </div>
      <div class="cart-row-actions">
        <button class="btn tiny" data-decrease="${item.id}">−</button>
        <button class="btn tiny" data-increase="${item.id}">+</button>
        <button class="btn tiny danger" data-remove="${item.id}">✕</button>
      </div>
    `;
    cartItemsEl.appendChild(row);
  });

  cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
}

///// ---------- Wishlist ----------
function toggleWishlist(productId) {
  const idx = wishlist.indexOf(productId);
  if (idx >= 0) {
    wishlist.splice(idx, 1);
    showToast('Removed from wishlist');
  } else {
    wishlist.push(productId);
    showToast('Added to wishlist');
  }
  localStorage.setItem('marketplace_wishlist', JSON.stringify(wishlist));
}

///// ---------- Category filter ----------
function filterProductsByCategory(category) {
  if (category === 'all') currentProducts = [...products];
  else currentProducts = products.filter(product => product.category === category);
  currentPage = 1;
  renderProducts();
  showToast(`Showing ${category} products`);
}

///// ---------- Event listeners ----------
function setupEventListeners() {
  if (signupForm) signupForm.addEventListener('submit', handleSignup);
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  // Close modal btns
  const closeLogin = document.getElementById('closeLogin');
  const closeSignup = document.getElementById('closeSignup');
  const closeUserModal = document.getElementById('closeUserModal');
  if (closeLogin) closeLogin.addEventListener('click', closeAllModals);
  if (closeSignup) closeSignup.addEventListener('click', closeAllModals);
  if (closeUserModal) closeUserModal.addEventListener('click', closeAllModals);

  if (openSignupFromLogin) openSignupFromLogin.addEventListener('click', showSignupModal);
  if (openLoginFromSignup) openLoginFromSignup.addEventListener('click', showLoginModal);

  // user / cart buttons
  if (userBtn) userBtn.addEventListener('click', (e) => { e.preventDefault(); if (currentUser) showUserModal(); else showLoginModal(); });
  if (openCartBtn) openCartBtn.addEventListener('click', (e) => { e.preventDefault(); showCartSidebar(); });

  const closeCartBtn = document.getElementById('closeCartBtn');
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeAllModals);

  // bottom nav
  const mobileHomeBtn = document.getElementById('mobileHomeBtn');
  const mobileCategoriesBtn = document.getElementById('mobileCategoriesBtn');
  const mobileCartBtn = document.getElementById('mobileCartBtn');
  const mobileAccountBtn = document.getElementById('mobileAccountBtn');
  if (mobileHomeBtn) mobileHomeBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  if (mobileCategoriesBtn) mobileCategoriesBtn.addEventListener('click', () => { categoriesModal.classList.remove('hidden'); overlay.classList.remove('hidden'); });
  if (mobileCartBtn) mobileCartBtn.addEventListener('click', showCartSidebar);
  if (mobileAccountBtn) mobileAccountBtn.addEventListener('click', () => currentUser ? showUserModal() : showLoginModal());

  // overlay closes
  overlay.addEventListener('click', closeAllModals);

  // delegated product actions
  productsContainer.addEventListener('click', (e) => {
    const add = e.target.closest('[data-add]');
    if (add) {
      const id = Number(add.getAttribute('data-add'));
      addToCart(id, 1);
      return;
    }
    const wish = e.target.closest('[data-wishlist]');
    if (wish) {
      const id = Number(wish.getAttribute('data-wishlist'));
      toggleWishlist(id);
      return;
    }
  });

  // cart delegated
  cartItemsEl.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-remove]');
    if (rm) { removeFromCart(Number(rm.getAttribute('data-remove'))); return; }
    const inc = e.target.closest('[data-increase]');
    if (inc) { changeQuantity(Number(inc.getAttribute('data-increase')), +1); return; }
    const dec = e.target.closest('[data-decrease]');
    if (dec) { changeQuantity(Number(dec.getAttribute('data-decrease')), -1); return; }
  });

  // category filter delegate
  document.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('category-filter')) {
      const category = e.target.dataset.category;
      filterProductsByCategory(category);
      if (categoriesModal) categoriesModal.classList.add('hidden');
    }
  });

  // logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  // checkout demo
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
    if (!cart.length) return showToast('Cart is empty');
    if (!currentUser) { showLoginModal(); return showToast('Please sign in to checkout'); }
    // Demo checkout: clear cart
    cart = [];
    saveCart();
    updateCartCounts();
    closeAllModals();
    showToast('Checkout complete — demo');
  });
}

///// ---------- Initialize ----------
function checkExistingAuth() {
  const saved = localStorage.getItem('marketplace_current_user');
  if (saved) {
    currentUser = JSON.parse(saved);
    updateUIForAuth();
  }
}

function init() {
  renderProducts();
  setupEventListeners();
  updateCartCounts();
  checkExistingAuth();
}

document.addEventListener('DOMContentLoaded', init);

// Replace your 'const products = [...]' array with this:
async function loadProducts() {
  try {
    // This URL will be your Render backend tomorrow
    const response = await fetch('https://your-backend.onrender.com/api/products');
    const products = await response.json();
    return products;
  } catch (error) {
    // If the backend is down, use the hardcoded data for now
    console.error("Backend offline, using local data");
    return [...]; // Paste your old products array here
  }
}

// Then update your renderProducts function to use this:
async function renderProducts() {
  const products = await loadProducts();
  // ... the rest of your code to display them
}