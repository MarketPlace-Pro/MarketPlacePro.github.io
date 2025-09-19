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
    {
        id: 2,
        name: "Smart Fitness Watch",
        category: "electronics",
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

// Global state
let currentProducts = [...products];
let cart = [];
let wishlist = [];

// DOM Elements
const productsContainer = document.getElementById('productsContainer');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
});

// Render products
function renderProducts() {
    const container = productsContainer;
    container.innerHTML = '';
    
    currentProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow';
        
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded mb-4">
            <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
            <div class="flex items-center mb-2">
                <div class="text-yellow-400">
                    ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                </div>
                <span class="text-gray-500 text-sm ml-2">(${product.reviews})</span>
            </div>
            <div class="flex items-center justify-between mb-3">
                <span class="text-2xl font-bold text-blue-600">$${product.price}</span>
                ${product.originalPrice > product.price ? 
                    `<span class="text-gray-500 line-through text-sm">$${product.originalPrice}</span>` : ''}
            </div>
            <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
                Add to Cart
            </button>
        `;
        
        container.appendChild(card);
    });
}

// Bottom Tab Bar Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Update mobile cart count
    updateMobileCartCount();
    
    // Add click events to mobile tabs
    document.getElementById('mobileCartBtn').addEventListener('click', function(e) {
        e.preventDefault();
        // Open the cart sidebar
        cartSidebar.classList.remove('translate-x-full');
        renderCartItems();
    });
    
    document.getElementById('mobileAccountBtn').addEventListener('click', function(e) {
        e.preventDefault();
        // Open the user modal
        userModal.classList.remove('hidden');
        userModal.classList.add('flex');
    });
    
    // Make categories tab open the sidebar on mobile
    document.querySelector('a[href="#"]:nth-child(2)').addEventListener('click', function(e) {
        e.preventDefault();
        sidebar.classList.remove('-translate-x-full');
        overlay.classList.remove('hidden');
    });
});

// Function to update mobile cart count
function updateMobileCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElement = document.getElementById('mobileCartCount');
    if (count > 0) {
        countElement.textContent = count;
        countElement.classList.remove('hidden');
    } else {
        countElement.classList.add('hidden');
    }
}

// Also update the mobile count when you update the main cart count
// Modify your existing updateCartCount function:
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const countElement = document.getElementById('cartCount');
    const mobileCountElement = document.getElementById('mobileCartCount');
    
    if (count > 0) {
        countElement.textContent = count;
        countElement.classList.remove('hidden');
        mobileCountElement.textContent = count;
        mobileCountElement.classList.remove('hidden');
    } else {
        countElement.classList.add('hidden');
        mobileCountElement.classList.add('hidden');
    }
}