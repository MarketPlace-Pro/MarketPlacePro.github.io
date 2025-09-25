// =============================
// app.js - MarketPlace Pro (Complete Unified Version)
// =============================

///// ---------- Sample product data ----------
// ASYNC FUNCTION TO LOAD PRODUCTS FROM BACKEND OR USE LOCAL DATA
async function loadProducts() {
    const backendUrl = 'products.json';

    try {
        console.log("🔄 Trying to fetch products from backend...");
        const response = await fetch(backendUrl);
        
        if (!response.ok) {
            throw new Error(`Backend returned status: ${response.status}`);
        }
        
        const productsFromBackend = await response.json();
        console.log("✅ Successfully loaded products from backend!");
        
        // Handle different backend response structures
        if (productsFromBackend && productsFromBackend.products) {
            return productsFromBackend.products || productsFromBackend; // Your backend structure
        } else if (Array.isArray(productsFromBackend)) {
            return productsFromBackend; // Array directly
        } else {
            console.warn("Unexpected response format, using fallback");
            return productsFromBackend;
        }

    } catch (error) {
        console.error("❌ Backend offline or error:", error.message);
        console.log("🔄 Using local product data with real images...");
        
        // RETURN LOCAL PRODUCT DATA WITH REAL IMAGE URLs
        return [
            {
                id: 1,
                name: "Wireless Bluetooth Headphones",
                category: "electronics",
                price: 79.99,
                originalPrice: 99.99,
                rating: 4.5,
                reviews: 1234,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
                description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
                seller: "TechStore Pro",
                shipping: "Free",
                inStock: true
            },
            {
                id: 2,
                name: "Smart Fitness Watch",
                category: "electronics",
                price: 199.99,
                originalPrice: 249.99,
                rating: 4.7,
                reviews: 856,
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
                description: "Advanced fitness tracking with heart rate monitor and GPS.",
                seller: "FitTech Solutions",
                shipping: "Free",
                inStock: true
            },
            {
                id: 3,
                name: "Gaming Laptop Pro",
                category: "electronics",
                price: 1299.99,
                originalPrice: 1499.99,
                rating: 4.8,
                reviews: 2341,
                image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
                description: "High-performance gaming laptop with RTX graphics.",
                seller: "GameTech",
                shipping: "Free",
                inStock: true
            },
            {
                id: 4,
                name: "Wireless Earbuds",
                category: "electronics",
                price: 129.99,
                originalPrice: 179.99,
                rating: 4.3,
                reviews: 892,
                image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?w=400&h=300&fit=crop",
                description: "True wireless earbuds with premium sound quality.",
                seller: "AudioTech",
                shipping: "Free",
                inStock: true
            },
            {
                id: 5,
                name: "Smartphone X",
                category: "electronics",
                price: 899.99,
                originalPrice: 999.99,
                rating: 4.6,
                reviews: 1567,
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
                description: "Latest smartphone with advanced camera system.",
                seller: "MobileTech",
                shipping: "Free",
                inStock: true
            },
            {
                id: 6,
                name: "Tablet Pro",
                category: "electronics",
                price: 599.99,
                originalPrice: 699.99,
                rating: 4.4,
                reviews: 723,
                image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
                description: "Professional tablet for work and creativity.",
                seller: "TabTech",
                shipping: "Free",
                inStock: true
            }
        ];
    }
}

let currentProducts = [];
let products = [];

///// ---------- Global state ----------
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
const searchInput = document.getElementById('searchInput');
const paginationContainer = document.getElementById('pagination');

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

///// ---------- Product Search (Enhanced from app.js) ----------
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = currentProducts.filter((p) =>
            p.name.toLowerCase().includes(term) ||
            p.description.toLowerCase().includes(term) ||
            p.category.toLowerCase().includes(term)
        );
        renderProductsList(filtered);
    });
}

///// ---------- Render products ----------
function escapeHtml(str = '') {
    return String(str).replace(/[&<>"']/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[s]));
}

async function renderProducts() {
    currentProducts = await loadProducts();
    renderProductsList(currentProducts);
}

function renderProductsList(productsToRender = currentProducts) {
    const container = productsContainer;
    container.innerHTML = '';

    const start = (currentPage - 1) * PAGE_SIZE;
    const slice = productsToRender.slice(start, start + PAGE_SIZE);

    if (!slice.length) {
        container.innerHTML = '<p class="muted">No products found.</p>';
        renderPagination(productsToRender.length);
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

    renderPagination(productsToRender.length);
}

///// ---------- Enhanced Pagination (from app.js) ----------
function renderPagination(totalItems = currentProducts.length) {
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';

    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    const prev = document.createElement('button');
    prev.className = 'btn tiny outline';
    prev.textContent = 'Prev';
    prev.disabled = currentPage === 1;
    prev.onclick = () => { if (currentPage > 1) { currentPage--; renderProductsList(); } };
    paginationContainer.appendChild(prev);

    // show up to 5 page buttons (centered on currentPage)
    const windowSize = 5;
    let startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
    let endPage = Math.min(totalPages, startPage + windowSize - 1);
    if (endPage - startPage < windowSize - 1) startPage = Math.max(1, endPage - windowSize + 1);

    for (let i = startPage; i <= endPage; i++) {
        const btn = document.createElement('button');
        btn.className = 'btn tiny' + (i === currentPage ? ' primary' : ' outline');
        btn.textContent = i;
        btn.onclick = () => { currentPage = i; renderProductsList(); };
        paginationContainer.appendChild(btn);
    }

    const next = document.createElement('button');
    next.className = 'btn tiny outline';
    next.textContent = 'Next';
    next.disabled = currentPage === totalPages;
    next.onclick = () => { if (currentPage < totalPages) { currentPage++; renderProductsList(); } };
    paginationContainer.appendChild(next);
}

///// ---------- Cart functionality (Enhanced) ----------
function saveCart() { localStorage.setItem('marketplace_cart', JSON.stringify(cart)); }

function updateCartCounts() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCountEl) cartCountEl.textContent = count;
    renderCartItems();
}

function addToCart(productId, qty = 1) {
    const product = currentProducts.find(p => p.id === productId);
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
    if (!cartItemsEl) return;
    
    cartItemsEl.innerHTML = '';
    if (!cart.length) {
        cartItemsEl.innerHTML = '<div class="muted">Your cart is empty.</div>';
        if (cartTotalEl) cartTotalEl.textContent = 'Total: $0.00';
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

    if (cartTotalEl) cartTotalEl.textContent = `Total: $${total.toFixed(2)}`;
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
    if (category === 'all') {
        currentProducts = [...products];
    } else {
        currentProducts = products.filter(product => product.category === category);
    }
    currentPage = 1;
    renderProductsList();
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
    if (mobileCategoriesBtn) mobileCategoriesBtn.addEventListener('click', () => { if (categoriesModal) categoriesModal.classList.remove('hidden'); overlay.classList.remove('hidden'); });
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
    if (cartItemsEl) {
        cartItemsEl.addEventListener('click', (e) => {
            const rm = e.target.closest('[data-remove]');
            if (rm) { removeFromCart(Number(rm.getAttribute('data-remove'))); return; }
            const inc = e.target.closest('[data-increase]');
            if (inc) { changeQuantity(Number(inc.getAttribute('data-increase')), +1); return; }
            const dec = e.target.closest('[data-decrease]');
            if (dec) { changeQuantity(Number(dec.getAttribute('data-decrease')), -1); return; }
        });
    }

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

// ASYNC FUNCTION TO LOAD PRODUCTS FROM BACKEND OR USE LOCAL DATA
async function loadProducts() {
    const backendUrl = 'products.json';

    try {
        console.log("🔄 Trying to fetch products from backend...");
        const response = await fetch(backendUrl);
        
        if (!response.ok) {
            throw new Error(`Backend returned status: ${response.status}`);
        }
        
        const productsFromBackend = await response.json();
        console.log("✅ Successfully loaded products from backend!");
        
        // Handle different backend response structures
        if (productsFromBackend && productsFromBackend.products) {
            return productsFromBackend.products || productsFromBackend; // Your backend structure
        } else if (Array.isArray(productsFromBackend)) {
            return productsFromBackend; // Array directly
        } else {
            console.warn("Unexpected response format, using fallback");
            return productsFromBackend;
        }

    } catch (error) {
        console.error("❌ Backend offline or error:", error.message);
        console.log("🔄 Using local product data with real images...");
        
        // RETURN LOCAL PRODUCT DATA WITH REAL IMAGE URLs
        return [
            {
                id: 1,
                name: "Wireless Bluetooth Headphones",
                category: "electronics",
                price: 79.99,
                originalPrice: 99.99,
                rating: 4.5,
                reviews: 1234,
                image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
                description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
                seller: "TechStore Pro",
                shipping: "Free",
                inStock: true
            },
            {
                id: 2,
                name: "Smart Fitness Watch",
                category: "electronics",
                price: 199.99,
                originalPrice: 249.99,
                rating: 4.7,
                reviews: 856,
                image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
                description: "Advanced fitness tracking with heart rate monitor and GPS.",
                seller: "FitTech Solutions",
                shipping: "Free",
                inStock: true
            },
            {
                id: 3,
                name: "Gaming Laptop Pro",
                category: "electronics",
                price: 1299.99,
                originalPrice: 1499.99,
                rating: 4.8,
                reviews: 2341,
                image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
                description: "High-performance gaming laptop with RTX graphics.",
                seller: "GameTech",
                shipping: "Free",
                inStock: true
            },
            {
                id: 4,
                name: "Wireless Earbuds",
                category: "electronics",
                price: 129.99,
                originalPrice: 179.99,
                rating: 4.3,
                reviews: 892,
                image: "https://images.unsplash.com/photo-1590658165737-15a047b8b5e3?w=400&h=300&fit=crop",
                description: "True wireless earbuds with premium sound quality.",
                seller: "AudioTech",
                shipping: "Free",
                inStock: true
            },
            {
                id: 5,
                name: "Smartphone X",
                category: "electronics",
                price: 899.99,
                originalPrice: 999.99,
                rating: 4.6,
                reviews: 1567,
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
                description: "Latest smartphone with advanced camera system.",
                seller: "MobileTech",
                shipping: "Free",
                inStock: true
            },
            {
                id: 6,
                name: "Tablet Pro",
                category: "electronics",
                price: 599.99,
                originalPrice: 699.99,
                rating: 4.4,
                reviews: 723,
                image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
                description: "Professional tablet for work and creativity.",
                seller: "TabTech",
                shipping: "Free",
                inStock: true
            }
        ];
    }
}

// File-based database specific functions
async function addProductToDatabase(productData) {
    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showToast('Product added successfully!');
            return result;
        } else {
            throw new Error('Failed to add product');
        }
    } catch (error) {
        console.error('Error adding product:', error);
        showToast('Error adding product');
        return null;
    }
}

async function updateProductInDatabase(productId, productData) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        if (response.ok) {
            showToast('Product updated successfully!');
            return true;
        } else {
            throw new Error('Failed to update product');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        showToast('Error updating product');
        return false;
    }
}

// Enhanced product management UI
function setupEnhancedProductManagement() {
    // Add admin panel if it doesn't exist
    if (!document.getElementById('adminPanel')) {
        const adminPanel = document.createElement('div');
        adminPanel.id = 'adminPanel';
        adminPanel.innerHTML = `
            <div style="position: fixed; bottom: 80px; right: 20px; z-index: 1000;">
                <button onclick="showAdminMenu()" style="background: #8B5CF6; color: white; padding: 12px; border-radius: 50%; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);">
                    📦
                </button>
                <div id="adminMenu" style="display: none; position: absolute; bottom: 60px; right: 0; background: white; border-radius: 8px; padding: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); min-width: 150px;">
                    <button onclick="openAddProductForm()" style="width: 100%; padding: 8px; margin: 2px 0; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; cursor: pointer;">Add Product</button>
                    <button onclick="showAllProducts()" style="width: 100%; padding: 8px; margin: 2px 0; border: 1px solid #ddd; border-radius: 4px; background: #f8f9fa; cursor: pointer;">View Products</button>
                </div>
            </div>
        `;
        document.body.appendChild(adminPanel);
    }
}

function showAdminMenu() {
    const menu = document.getElementById('adminMenu');
    menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

function openAddProductForm() {
    // Simple form implementation
    const productName = prompt('Enter product name:');
    if (productName) {
        const productPrice = prompt('Enter product price:');
        if (productPrice) {
            addProductToDatabase({
                name: productName,
                price: parseFloat(productPrice),
                description: prompt('Enter description (optional):') || '',
                category: prompt('Enter category (optional):') || 'General',
                stock: parseInt(prompt('Enter stock quantity (optional):') || '10')
            }).then(() => {
                loadProducts(); // Refresh product list
            });
        }
    }
}

function showAllProducts() {
    // Could implement a detailed product management view here
    alert('Product management feature - would show detailed product list with edit/delete options');
}

// Initialize enhanced features when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupEnhancedProductManagement);
} else {
    setupEnhancedProductManagement();
}

// Minimal backend specific functions
async function testBackendConnection() {
    try {
        const response = await fetch('products.json');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Backend connection:', data.message);
            return true;
        }
    } catch (error) {
        console.error('❌ Backend connection failed:', error);
    }
    return false;
}

// Enhanced product loading with better error handling
async function loadProductsEnhanced() {
    console.log('🔄 Loading products from minimal backend...');
    
    // Test connection first
    const isConnected = await testBackendConnection();
    if (!isConnected) {
        console.log('🔄 Backend offline, using local fallback');
        return getLocalFallbackProducts();
    }
    
    try {
        const response = await fetch('products.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const products = await response.json();
        console.log(`✅ Loaded ${products.length} products from backend`);
        return products;
    } catch (error) {
        console.error('❌ Error loading products:', error);
        console.log('🔄 Using local fallback products');
        return getLocalFallbackProducts();
    }
}

// Replace the main loadProducts function to use enhanced version
const originalLoadProducts = window.loadProducts;
window.loadProducts = loadProductsEnhanced;

// Simple admin interface for minimal backend

// ==================== ADMIN BUTTON - SIMPLE RELIABLE VERSION ====================

// Wait for DOM to be fully ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 DOM loaded, initializing admin button...');
    initializeAdminButton();
});

// Also try initializing after a short delay as backup
setTimeout(initializeAdminButton, 2000);

function initializeAdminButton() {
    // Don't create if already exists
    if (document.getElementById('floatingAdminBtn')) {
        console.log('✅ Admin button already exists');
        return;
    }
    
    console.log('🔄 Creating admin button...');
    
    // Create the button element
    const adminBtn = document.createElement('button');
    adminBtn.id = 'floatingAdminBtn';
    adminBtn.innerHTML = '📦';
    adminBtn.title = 'Admin Panel';
    
    // Simple styling that should work everywhere
    adminBtn.style.position = 'fixed';
    adminBtn.style.bottom = '100px';
    adminBtn.style.right = '20px';
    adminBtn.style.background = '#8B5CF6';
    adminBtn.style.color = 'white';
    adminBtn.style.border = 'none';
    adminBtn.style.borderRadius = '50%';
    adminBtn.style.width = '60px';
    adminBtn.style.height = '60px';
    adminBtn.style.fontSize = '24px';
    adminBtn.style.cursor = 'pointer';
    adminBtn.style.zIndex = '10000';
    adminBtn.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
    
    // Click handler
    adminBtn.addEventListener('click', function() {
        showAdminMenu();
    });
    
    // Add to page
    document.body.appendChild(adminBtn);
    console.log('✅ Admin button created successfully');
}

function showAdminMenu() {
    const action = prompt('Admin Panel:\n\n1. Add New Product\n2. View Product Count\n3. Test Backend\n4. Reload Page\n\nEnter choice (1-4):');
    
    if (action === '1') {
        addNewProduct();
    } else if (action === '2') {
        const count = window.currentProducts ? window.currentProducts.length : 'Unknown';
        alert('Current products: ' + count);
    } else if (action === '3') {
        testBackendConnection();
    } else if (action === '

