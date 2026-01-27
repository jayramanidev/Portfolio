/**
 * Space Tech Store - JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initAddToCart();
    initCartPage();
    initCheckoutForm();
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    const textEl = notification.querySelector('.notification-text');
    textEl.textContent = message;

    notification.style.borderColor = type === 'success' ? 'var(--neon-green)' : 'var(--neon-cyan)';
    notification.style.color = type === 'success' ? 'var(--neon-green)' : 'var(--neon-cyan)';

    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Update cart count in header
function updateCartCount(count) {
    const cartCountEls = document.querySelectorAll('.cart-count');
    cartCountEls.forEach(el => {
        el.textContent = count;
    });
}

// AJAX helper
async function cartAction(action, productId, quantity = null) {
    const formData = new FormData();
    formData.append('action', action);
    formData.append('product_id', productId);
    if (quantity !== null) {
        formData.append('quantity', quantity);
    }

    try {
        const response = await fetch('index.php', {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        return await response.json();
    } catch (error) {
        console.error('Cart action failed:', error);
        return { success: false, message: 'Network error' };
    }
}

// Initialize Add to Cart buttons
function initAddToCart() {
    const addButtons = document.querySelectorAll('.add-to-cart-btn');

    addButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = btn.dataset.productId;

            // Add animation
            btn.style.transform = 'scale(0.95)';
            setTimeout(() => btn.style.transform = '', 150);

            const result = await cartAction('add', productId);

            if (result.success) {
                updateCartCount(result.cartCount);
                showNotification('Added to cargo bay!', 'success');
            } else {
                showNotification(result.message || 'Failed to add', 'error');
            }
        });
    });
}

// Initialize Cart Page functionality
function initCartPage() {
    const cartItems = document.querySelectorAll('.cart-item');
    if (cartItems.length === 0) return;

    // Quantity buttons
    document.querySelectorAll('.qty-plus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(btn.dataset.productId, 1));
    });

    document.querySelectorAll('.qty-minus').forEach(btn => {
        btn.addEventListener('click', () => updateQuantity(btn.dataset.productId, -1));
    });

    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => removeItem(btn.dataset.productId));
    });
}

async function updateQuantity(productId, delta) {
    const itemEl = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
    if (!itemEl) return;

    const qtyEl = itemEl.querySelector('.qty-value');
    const currentQty = parseInt(qtyEl.textContent);
    const newQty = currentQty + delta;

    if (newQty < 1) {
        removeItem(productId);
        return;
    }

    const result = await cartAction('update', productId, newQty);

    if (result.success) {
        // Reload to update totals
        location.reload();
    }
}

async function removeItem(productId) {
    const result = await cartAction('remove', productId);

    if (result.success) {
        const itemEl = document.querySelector(`.cart-item[data-product-id="${productId}"]`);
        if (itemEl) {
            itemEl.style.opacity = '0';
            itemEl.style.transform = 'translateX(50px)';
            setTimeout(() => location.reload(), 300);
        }
    }
}

// Initialize Checkout Form
function initCheckoutForm() {
    const form = document.querySelector('.checkout-form');
    if (!form) return;

    // Card number formatting
    const cardInput = document.getElementById('card');
    if (cardInput) {
        cardInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            e.target.value = value.trim();
        });
    }

    // Expiry formatting
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
            e.target.value = value;
        });
    }

    // CVV - numbers only
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}
