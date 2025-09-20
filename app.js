// app.js

// Dummy products data (this would come from a database in a real app)
const products = [
    { id: 1, name: "Product 1", price: 20, description: "Description for product 1" },
    { id: 2, name: "Product 2", price: 30, description: "Description for product 2" },
    { id: 3, name: "Product 3", price: 40, description: "Description for product 3" },
    { id: 4, name: "Product 4", price: 50, description: "Description for product 4" },
    { id: 5, name: "Product 5", price: 60, description: "Description for product 5" },
    { id: 6, name: "Product 6", price: 70, description: "Description for product 6" },
    { id: 7, name: "Product 7", price: 80, description: "Description for product 7" },
    { id: 8, name: "Product 8", price: 90, description: "Description for product 8" },
    { id: 9, name: "Product 9", price: 100, description: "Description for product 9" },
    { id: 10, name: "Product 10", price: 110, description: "Description for product 10" }
];

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Function to render products
function renderProducts(page = 1, itemsPerPage = 4) {
    const startIndex = (page - 1) * itemsPerPage;
    const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

    const productContainer = document.getElementById("product-container");
    productContainer.innerHTML = "";  // Clear previous products

    paginatedProducts.forEach(product => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.innerHTML = `
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>$${product.price}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productContainer.appendChild(productElement);
    });
}

// Function to handle pagination
function renderPagination(page = 1, itemsPerPage = 4) {
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = "";  // Clear previous pagination

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.onclick = () => {
            renderProducts(i);
            renderPagination(i);
        };
        paginationElement.appendChild(pageButton);
    }
}

// Cart handling
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));  // Store updated cart in localStorage
        renderCart();
    }
}

function renderCart() {
    const cartItemsElement = document.getElementById("cart-items");
    cartItemsElement.innerHTML = "";

    cart.forEach(item => {
        const cartItemElement = document.createElement("li");
        cartItemElement.textContent = `${item.name} - $${item.price}`;
        cartItemsElement.appendChild(cartItemElement);
    });
}

// Checkout functionality (simplified)
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
    } else {
        alert("Proceeding to checkout...");
    }
}

// Event listeners for auth buttons
document.getElementById("login-btn").addEventListener("click", () => {
    // Simulate user login
    alert("Logged in!");
    document.getElementById("login-btn").style.display = "none";
    document.getElementById("logout-btn").style.display = "block";
});

document.getElementById("logout-btn").addEventListener("click", () => {
    // Simulate user logout
    alert("Logged out!");
    document.getElementById("login-btn").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
    cart = [];  // Clear cart on logout
    localStorage.removeItem('cart');  // Remove cart from localStorage
    renderCart();  // Re-render the cart (which is now empty)
});

// Initial render
renderProducts();
renderPagination();
document.getElementById("checkout-btn").addEventListener("click", checkout);