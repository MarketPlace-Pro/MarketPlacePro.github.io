/* main.js - MarketPlace Pro (vanilla JS)
   - Auth (signup/login/logout) with localStorage
   - Products render, category filter
   - Cart sidebar (add/remove/update)
   - Toast notifications
*/

// ---------------------------
// Sample product data
// ---------------------------
const products = [
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

// ---------------------------
// Global state
// ---------------------------
let currentProducts = [...products];
let cart = JSON.parse(localStorage.getItem('marketplace_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('marketplace_current_user')) || null;
let users = JSON.parse(localStorage.getItem('marketplace_users')) || [];

// ---------------------------
// DOM elements
// ---------------------------
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
const openLoginFromSignup = document.getElementById('openLoginFromSignup');
const openSignupFromLogin = document.getElementById('openSignupFromLogin');

// ---------------------------
// Utility: Toast
// ---------------------------
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

// ---------------------------
// Auth (signup / login / logout)
// ---------------------------
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

// ---------------------------
// Update UI for auth state
// ---------------------------
function updateUIForAuth() {
  const accountButtons = document.querySelectorAll('[id*="Account"], [id*="userBtn"], #mobileAccountBtn');
  accountButtons.forEach(btn => {
    const span = btn.querySelector('span');
    if (span) {
      span.textContent = currentUser ? currentUser.name.split(' ')[0] : 'Account';
    }
  });

  // Update user modal content
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

// ---------------------------
// Modal helpers
// ---------------------------
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

// ---------------------------
// Render products
// ---------------------------
function renderProducts() {
  productsContainer.innerHTML = '';
  if (!currentProducts.length) {
    productsContainer.innerHTML = '<p class="muted">No products found.</p>';
    return;
  }

  currentProducts.forEach(product => {
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
    productsContainer.appendChild(card);
  });
}

// escape HTML utility (simple)
function escapeHtml(str = '') {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
}

// ---------------------------
// Cart functions
// ---------------------------
function saveCart() {
  localStorage.setItem('marketplace_cart', JSON.stringify(cart));
}

function updateCartCounts() {
  const count = cart.reduce((t, i) => t + i.quantity, 0);
  cartCountEl.textContent = count;
  if (document.getElementById('cartCountBadge')) {
    document.getElementById('cartCountBadge').textContent = count;
  }
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
  else {
    saveCart();
    updateCartCounts();
  }
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

// ---------------------------
// Category filter
// ---------------------------
function filterProductsByCategory(category) {
  if (!category || category === 'all') currentProducts = [...products];
  else currentProducts = products.filter(p => p.category === category);
  renderProducts();
  showToast(`Showing ${category} products`);
}

// ---------------------------
// Event listeners (setup)
// ---------------------------
function setupEventListeners() {
  // Forms
  if (signupForm) signupForm.addEventListener('submit', handleSignup);
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  // Modal open/close
  document.getElementById('closeLogin').addEventListener('click', closeAllModals);
  document.getElementById('closeSignup').addEventListener('click', closeAllModals);
  document.getElementById('closeUserModal').addEventListener('click', closeAllModals);
  document.getElementById('closeCategoriesModal').addEventListener('click', () => categoriesModal.classList.add('hidden'));

  // Open switch between login/signup
  if (openSignupFromLogin) openSignupFromLogin.addEventListener('click', showSignupModal);
  if (openLoginFromSignup) openLoginFromSignup.addEventListener('click', showLoginModal);

  // Account / User button
  userBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentUser) showUserModal();
    else showLoginModal();
  });

  // Cart open/close
  openCartBtn.addEventListener('click', (e) => { e.preventDefault(); showCartSidebar(); });
  document.getElementById('closeCartBtn').addEventListener('click', closeAllModals);

  // Bottom nav
  document.getElementById('mobileHomeBtn').addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));
  document.getElementById('mobileCategoriesBtn').addEventListener('click', () => { categoriesModal.classList.remove('hidden'); overlay.classList.remove('hidden'); });
  document.getElementById('mobileCartBtn').addEventListener('click', showCartSidebar);
  document.getElementById('mobileAccountBtn').addEventListener('click', () => currentUser ? showUserModal() : showLoginModal());

  // Overlay click closes modals
  overlay.addEventListener('click', closeAllModals);

  // Product add / wishlist (delegated)
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
      showToast('Added to wishlist (demo)');
      return;
    }
  });

  // Cart actions (delegated)
  cartItemsEl.addEventListener('click', (e) => {
    const rm = e.target.closest('[data-remove]');
    if (rm) { removeFromCart(Number(rm.getAttribute('data-remove'))); return; }
    const inc = e.target.closest('[data-increase]');
    if (inc) { changeQuantity(Number(inc.getAttribute('data-increase')), +1); return; }
    const dec = e.target.closest('[data-decrease]');
    if (dec) { changeQuantity(Number(dec.getAttribute('data-decrease')), -1); return; }
  });

  // Category filter delegate
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-filter')) {
      const category = e.target.dataset.category;
      filterProductsByCategory(category);
      categoriesModal.classList.add('hidden');
    }
  });

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', handleLogout);

  // Checkout - demo
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (!cart.length) return showToast('Cart is empty');
    if (!currentUser) {
      showLoginModal();
      return showToast('Please sign in to checkout');
    }
    // demo: clear cart
    cart = [];
    saveCart();
    updateCartCounts();
    closeAllModals();
    showToast('Checkout complete — demo');
  });
}

// ---------------------------
// Initialize app
// ---------------------------
function init() {
  renderProducts();
  setupEventListeners();
  updateCartCounts();
  updateUIForAuth();
}

document.addEventListener('DOMContentLoaded', init);