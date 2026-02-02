/**
 * PRISM Streetwear - Enhanced JavaScript
 * All features: Cart, Particles, Filters, Quick View, Wishlist, Newsletter
 */

// DOM Elements
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartCountEl = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const notification = document.getElementById('notification');
const notificationText = document.getElementById('notificationText');
const backToTop = document.getElementById('backToTop');
const filterBar = document.getElementById('filterBar');
const quickViewModal = document.getElementById('quickViewModal');
const newsletterOverlay = document.getElementById('newsletterOverlay');

// Local cart state
let localCart = [];
let currentProduct = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initAddToCart();
    initCartToggle();
    initSmoothScroll();
    initBackToTop();
    initFilterBar();
    initQuickView();
    initWishlist();
    initSizeSelector();
    initNewsletter();
    console.log('🔮 PRISM Streetwear - All features initialized');
});

/**
 * ========== FLOATING PARTICLES ==========
 */
function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (10 + Math.random() * 20) + 's';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.width = (2 + Math.random() * 4) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

/**
 * ========== ADD TO CART ==========
 */
function initAddToCart() {
    document.addEventListener('click', (e) => {
        const addBtn = e.target.closest('.add-btn:not(.disabled)');
        if (!addBtn) return;

        e.preventDefault();

        const productId = addBtn.dataset.id;
        const productName = addBtn.dataset.name;
        const productPrice = parseInt(addBtn.dataset.price);

        addToCart(productId, productName, productPrice);
    });
}

async function addToCart(productId, productName, productPrice) {
    // Send to PHP backend
    const result = await cartAction('add', productId);

    if (result.success) {
        // Update local cart
        const existing = localCart.find(item => item.id == productId);
        if (existing) {
            existing.quantity++;
        } else {
            localCart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
        }

        updateCartUI(result.cartCount);
        showNotification(`${productName} added to cart`);

        // Bounce animation on cart
        cartCountEl.classList.add('bounce');
        setTimeout(() => cartCountEl.classList.remove('bounce'), 500);

        console.log('🛒 Cart updated:', localCart);
    }
}

/**
 * ========== CART OPERATIONS ==========
 */
async function cartAction(action, productId, quantity = null) {
    const formData = new FormData();
    formData.append('action', action);
    formData.append('product_id', productId);
    if (quantity !== null) formData.append('quantity', quantity);

    try {
        const response = await fetch('index.php', {
            method: 'POST',
            body: formData,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        return await response.json();
    } catch (error) {
        console.error('Cart action failed:', error);
        return { success: false, message: 'Network error' };
    }
}

function updateCartUI(count) {
    cartCountEl.textContent = count;

    if (localCart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty mono">// CART IS EMPTY</p>';
    } else {
        cartItems.innerHTML = localCart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-info">
                    <p class="cart-item-name">${item.name}</p>
                    <p class="cart-item-price">₹${item.price.toLocaleString('en-IN')} x ${item.quantity}</p>
                </div>
                <button class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</button>
            </div>
        `).join('');
    }

    const total = localCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `₹${total.toLocaleString('en-IN')}`;
}

async function removeFromCart(productId) {
    const result = await cartAction('remove', productId);
    if (result.success) {
        localCart = localCart.filter(item => item.id != productId);
        updateCartUI(result.cartCount);
        showNotification('Item removed');
    }
}

function initCartToggle() {
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    const closeCart = () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = '';
    };

    cartClose.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });
}

/**
 * ========== BACK TO TOP ==========
 */
function initBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/**
 * ========== FILTER BAR ==========
 */
function initFilterBar() {
    const productsSection = document.getElementById('products');
    if (!productsSection || !filterBar) return;

    // Show/hide filter bar on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting && window.scrollY > 500) {
                filterBar.classList.add('visible');
            } else {
                filterBar.classList.remove('visible');
            }
        });
    }, { threshold: 0 });

    observer.observe(productsSection);

    // Filter buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    const categorySections = document.querySelectorAll('.category-section');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            categorySections.forEach(section => {
                if (filter === 'all' || section.dataset.category === filter) {
                    section.style.display = '';
                } else {
                    section.style.display = 'none';
                }
            });
        });
    });
}

/**
 * ========== QUICK VIEW MODAL ==========
 */
function initQuickView() {
    if (!quickViewModal) return;

    const modalClose = document.getElementById('modalClose');
    const modalImage = document.getElementById('modalImage');
    const modalCategory = document.getElementById('modalCategory');
    const modalName = document.getElementById('modalName');
    const modalDesc = document.getElementById('modalDesc');
    const modalPrice = document.getElementById('modalPrice');
    const modalAddBtn = document.getElementById('modalAddBtn');
    const modalSizes = document.getElementById('modalSizes');

    // Open modal on quick view click
    document.addEventListener('click', (e) => {
        const quickViewOverlay = e.target.closest('.quick-view-overlay');
        if (!quickViewOverlay) return;

        const productImage = quickViewOverlay.closest('.product-image');
        const productData = JSON.parse(productImage.dataset.product);

        currentProduct = productData;

        modalImage.src = productData.image;
        modalImage.alt = productData.name;
        modalCategory.textContent = productData.category;
        modalName.textContent = productData.name;
        modalDesc.textContent = productData.description.toUpperCase();
        modalPrice.textContent = '₹' + productData.price.toLocaleString('en-IN');

        // Hide sizes for accessories
        if (productData.category === 'ACCESSORIES') {
            modalSizes.style.display = 'none';
        } else {
            modalSizes.style.display = 'block';
        }

        // Update add button data
        modalAddBtn.dataset.id = productData.id;
        modalAddBtn.dataset.name = productData.name;
        modalAddBtn.dataset.price = productData.price;

        quickViewModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    const closeModal = () => {
        quickViewModal.classList.remove('open');
        document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    quickViewModal.addEventListener('click', (e) => {
        if (e.target === quickViewModal) closeModal();
    });

    // Add to cart from modal
    modalAddBtn.addEventListener('click', () => {
        const id = modalAddBtn.dataset.id;
        const name = modalAddBtn.dataset.name;
        const price = parseInt(modalAddBtn.dataset.price);
        addToCart(id, name, price);
        closeModal();
    });
}

/**
 * ========== WISHLIST ==========
 */
function initWishlist() {
    document.addEventListener('click', async (e) => {
        const wishlistBtn = e.target.closest('.wishlist-btn');
        if (!wishlistBtn) return;

        e.preventDefault();
        const productId = wishlistBtn.dataset.id;

        const formData = new FormData();
        formData.append('action', 'wishlist_toggle');
        formData.append('product_id', productId);

        try {
            const response = await fetch('index.php', {
                method: 'POST',
                body: formData,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            const result = await response.json();

            if (result.success) {
                wishlistBtn.classList.toggle('active', result.wishlisted);
                showNotification(result.message);
            }
        } catch (error) {
            console.error('Wishlist error:', error);
        }
    });
}

/**
 * ========== SIZE SELECTOR ==========
 */
function initSizeSelector() {
    document.addEventListener('click', (e) => {
        const sizeBtn = e.target.closest('.size-btn');
        if (!sizeBtn) return;

        const container = sizeBtn.closest('.size-options');
        container.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
        sizeBtn.classList.add('active');
    });
}

/**
 * ========== NEWSLETTER POPUP ==========
 */
function initNewsletter() {
    if (!newsletterOverlay) return;

    const closeBtn = document.getElementById('newsletterClose');
    const skipBtn = document.getElementById('newsletterSkip');
    const form = document.getElementById('newsletterForm');

    // Show after 5 seconds (only once per session)
    if (!sessionStorage.getItem('newsletterShown')) {
        setTimeout(() => {
            newsletterOverlay.classList.add('open');
            sessionStorage.setItem('newsletterShown', 'true');
        }, 5000);
    }

    const closeNewsletter = () => {
        newsletterOverlay.classList.remove('open');
    };

    closeBtn.addEventListener('click', closeNewsletter);
    skipBtn.addEventListener('click', closeNewsletter);
    newsletterOverlay.addEventListener('click', (e) => {
        if (e.target === newsletterOverlay) closeNewsletter();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Thanks! Check your email for 10% off');
        closeNewsletter();
    });
}

/**
 * ========== UTILITIES ==========
 */
function showNotification(message, type = 'success') {
    notificationText.textContent = message;
    notification.style.borderColor = type === 'error' ? '#ff4444' : '';
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 3000);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}
