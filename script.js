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
const cartSidebar = document.getElementById('cartSidebar');
const userModal = document.getElementById('userModal');
const overlay = document.getElementById('overlay');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    renderProducts();
    setupBottomNavigation();
    updateCartCounts();
});

// Render products
function renderProducts() {
    const container = productsContainer;
    container.innerHTML = '';
    
    currentProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition-shadow';
        
        const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover rounded mb-4">
            <h3 class="font-semibold text-lg mb-2 text-gray-900 dark:text-white">${product.name}</h3>
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
            <button class="add-to-cart-btn w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors" data-id="${product.id}">
                Add to Cart
            </button>
        `;
        
        // Add event listener to the button
        const addButton = card.querySelector('.add-to-cart-btn');
        addButton.addEventListener('click', function() {
            addToCart(product.id);
        });
        
        container.appendChild(card);
    });
}

// Add to cart function
function addToCart(productId, quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity });
    }

    updateCartCounts();
    showToast('Product added to cart!');
}

// Update all cart counts
function updateCartCounts() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update header cart count
    const headerCountElement = document.getElementById('cartCount');
    if (headerCountElement) {
        if (count > 0) {
            headerCountElement.textContent = count;
            headerCountElement.classList.remove('hidden');
        } else {
            headerCountElement.classList.add('hidden');
        }
    }
    
    // Update mobile cart count
    const mobileCountElement = document.getElementById('mobileCartCount');
    if (mobileCountElement) {
        if (count > 0) {
            mobileCountElement.textContent = count;
            mobileCountElement.classList.remove('hidden');
        } else {
            mobileCountElement.classList.add('hidden');
        }
    }
}

// Show toast notification
function showToast(message) {
    // Create toast if it doesn't exist
    let toast = document.getElementById('toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'fixed top-4 right-4 z-60 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300';
        toast.innerHTML = `
            <div class="flex items-center space-x-2">
                <i class="fas fa-check-circle"></i>
                <span id="toastMessage">${message}</span>
            </div>
        `;
        document.body.appendChild(toast);
    }
    
    document.getElementById('toastMessage').textContent = message;
    toast.classList.remove('translate-x-full');
    
    setTimeout(() => {
        toast.classList.add('translate-x-full');
    }, 3000);
}

// Bottom Navigation Functionality
function setupBottomNavigation() {
    // Home Button - Scroll to top
    const homeBtn = document.getElementById('mobileHomeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            closeAllModals();
        });
    }

    // Categories Button - Show alert (you can expand this later)
    const categoriesBtn = document.getElementById('mobileCategoriesBtn');
    if (categoriesBtn) {
        categoriesBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Categories feature coming soon!');
        });
    }

    // Cart Button - Open cart sidebar
    const cartBtn = document.getElementById('mobileCartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.remove('translate-x-full');
            overlay.classList.remove('hidden');
        });
    }

    // Account Button - Open user modal
    const accountBtn = document.getElementById('mobileAccountBtn');
    if (accountBtn) {
        accountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            userModal.classList.remove('hidden');
        });
    }
}

// Helper function to close all modals
function closeAllModals() {
    if (cartSidebar) cartSidebar.classList.add('translate-x-full');
    if (userModal) userModal.classList.add('hidden');
    if (overlay) overlay.classList.add('hidden');
}

// Close buttons functionality
document.addEventListener('DOMContentLoaded', function() {
    // Close cart button
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            closeAllModals();
        });
    }
    
    // Close user modal button
    const closeUserModalBtn = document.getElementById('closeUserModal');
    if (closeUserModalBtn) {
        closeUserModalBtn.addEventListener('click', function() {
            closeAllModals();
        });
    }
    
    // Overlay click to close modals
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeAllModals();
        });
    }
});

// Categories Button - Scroll to categories section
const categoriesBtn = document.getElementById('mobileCategoriesBtn');
if (categoriesBtn) {
    categoriesBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Scroll to categories section (you'd need to add this to your HTML)
        const categoriesSection = document.getElementById('categoriesSection');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback: show quick categories
            alert('📱 Electronics\n👕 Fashion\n🏠 Home\n⚽ Sports\n📚 Books\n🎮 Toys');
        }
    });
}