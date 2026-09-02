const products = [
    { id: '1', name: 'UI Kit Pro', category: 'kits', price: 29.00, description: 'Complete design system and component library for modern web apps.' },
    { id: '2', name: 'Auth Workflow Kit', category: 'kits', price: 19.00, description: 'Secure authentication flows and boilerplates for Node and Vanilla JS.' },
    { id: '3', name: 'Vector Icon Pack', category: 'assets', price: 12.00, description: 'Over 500+ scalable SVG icons optimized for high-performance apps.' },
    { id: '4', name: 'Dashboard Starter', category: 'kits', price: 39.00, description: 'Fully responsive admin analytics template with dark mode support.' },
    { id: '5', name: 'Texture Asset Bundle', category: 'assets', price: 15.00, description: 'High-resolution digital textures and background patterns.' }
];

let cart = JSON.parse(localStorage.getItem('engagebase_cart')) || [];

const productGrid = document.getElementById('product-grid');
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');
const filterBtns = document.querySelectorAll('.filter-btn');
const checkoutBtn = document.getElementById('checkout-btn');

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(products);
    updateCartUI();

    cartBtn.addEventListener('click', () => cartModal.classList.add('open'));
    closeCart.addEventListener('click', () => cartModal.classList.remove('open'));

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.getAttribute('data-filter');
            if (filter === 'all') {
                renderProducts(products);
            } else {
                renderProducts(products.filter(p => p.category === filter));
            }
        });
    });

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Redirecting to secure Stripe Checkout gateway...');
    });
});

function renderProducts(items) {
    productGrid.innerHTML = items.map(product => `
        <div class="product-card">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
            </div>
            <div class="product-footer">
                <span class="price">$${product.price.toFixed(2)}</span>
                <button class="btn btn-primary add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.add-to-cart, .add-to-cart-deal').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const name = e.target.getAttribute('data-name');
            const price = parseFloat(e.target.getAttribute('data-price'));
            addToCart(id, name, price);
        });
    });
}

function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveAndToggleCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveAndToggleCart();
}

function saveAndToggleCart() {
    localStorage.setItem('engagebase_cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-muted" style="text-align:center; padding: 2rem 0;">Your cart is empty.</p>';
        cartTotalPrice.textContent = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}
