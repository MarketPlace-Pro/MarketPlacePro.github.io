// Sample product data
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
    // ... (KEEP THE ENTIRE products ARRAY FROM YOUR ORIGINAL CODE) ...
];

// Global state
let currentProducts = [...products];
let cart = [];
let wishlist = [];
let currentView = 'grid';
let currentCategory = 'all';
let currentSort = 'popular';
let displayedProducts = 8;

// DOM Elements
const productsContainer = document.getElementById('productsContainer');
const productModal = document.getElementById('productModal');
const cartSidebar = document.getElementById('cartSidebar');
const userModal = document.getElementById('userModal');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const toast = document.getElementById('toast');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupEventListeners();
    updateCartCount();
    updateWishlistCount();
});

// ... (KEEP ALL THE REST OF YOUR JAVASCRIPT FUNCTIONS FROM setupEventListeners() TO THE VERY END) ...
// Event Listeners
function setupEventListeners() { ... }
// Render products
function renderProducts() { ... }
// ... and so on, until the final closing brace.
