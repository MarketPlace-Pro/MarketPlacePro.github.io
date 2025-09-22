// =============================
// app.js - Extra Features
// =============================

// --- Global State (shared with script.js) ---
let currentPage = 1;
const productsPerPage = 6;

// --- DOM Elements ---
const searchInput = document.getElementById("searchInput");
const paginationContainer = document.getElementById("pagination");
const cartContainer = document.getElementById("cartSidebar");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

// =============================
// PRODUCT PAGINATION
// =============================
function paginateProducts() {
  const start = (currentPage - 1) * productsPerPage;
  const end = start + productsPerPage;
  const paginated = currentProducts.slice(start, end);
  renderProducts(paginated);
  renderPagination();
}

function renderPagination() {
  if (!paginationContainer) return;
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(currentProducts.length / productsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = `btn small ${i === currentPage ? "primary" : "outline"}`;
    btn.addEventListener("click", () => {
      currentPage = i;
      paginateProducts();
    });
    paginationContainer.appendChild(btn);
  }
}

// =============================
// PRODUCT SEARCH
// =============================
if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase();
    currentProducts = products.filter((p) =>
      p.name.toLowerCase().includes(term)
    );
    currentPage = 1;
    paginateProducts();
  });
}

// =============================
// CART FUNCTIONALITY
// =============================
function addToCart(productId, quantity = 1) {
  const product = products.find((p) => p.id === productId);
  if (!product) return;

  const existing = cart.find((item) => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ ...product, quantity });
  }
  updateCartUI();
  showToast(`${product.name} added to cart!`);
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  updateCartUI();
}

function updateCartUI() {
  if (!cartContainer) return;
  const itemsContainer = cartContainer.querySelector(".cart-items");
  if (!itemsContainer) return;

  itemsContainer.innerHTML = "";
  cart.forEach((item) => {
    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <span>${item.name} (${item.quantity})</span>
      <button class="btn tiny danger">x</button>
    `;
    row.querySelector("button").addEventListener("click", () => {
      removeFromCart(item.id);
    });
    itemsContainer.appendChild(row);
  });

  updateCartCounts();
}

// =============================
// AUTHENTICATION
// =============================
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      currentUser = user;
      localStorage.setItem("marketplace_current_user", JSON.stringify(user));
      updateUIForAuth();
      closeAuthModals();
    } else {
      alert("Invalid email or password");
    }
  });
}

if (signupForm) {
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (users.some((u) => u.email === email)) {
      alert("Email already registered!");
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem("marketplace_users", JSON.stringify(users));

    currentUser = newUser;
    localStorage.setItem("marketplace_current_user", JSON.stringify(newUser));
    updateUIForAuth();
    closeAuthModals();
  });
}

// =============================
// INIT
// =============================
document.addEventListener("DOMContentLoaded", () => {
  paginateProducts();
  updateCartUI();
  checkExistingAuth();
});