<?php
session_start();

if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

$productsJson = file_get_contents(__DIR__ . '/data/products.json');
$products = json_decode($productsJson, true);
$productsById = [];
foreach ($products as $product) {
    $productsById[$product['id']] = $product;
}

// Handle AJAX cart operations
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    $response = ['success' => false];
    $action = $_POST['action'];
    $productId = isset($_POST['product_id']) ? (int)$_POST['product_id'] : 0;

    switch ($action) {
        case 'update':
            $quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 0;
            if ($quantity > 0) {
                $_SESSION['cart'][$productId] = $quantity;
            } else {
                unset($_SESSION['cart'][$productId]);
            }
            $response['success'] = true;
            break;
        case 'remove':
            unset($_SESSION['cart'][$productId]);
            $response['success'] = true;
            break;
    }
    $response['cartCount'] = array_sum($_SESSION['cart']);
    echo json_encode($response);
    exit;
}

$cartItems = [];
$subtotal = 0;

foreach ($_SESSION['cart'] as $productId => $quantity) {
    if (isset($productsById[$productId])) {
        $product = $productsById[$productId];
        $product['quantity'] = $quantity;
        $product['total'] = $product['price'] * $quantity;
        $cartItems[] = $product;
        $subtotal += $product['total'];
    }
}

$tax = $subtotal * 0.18; // 18% GST
$total = $subtotal + $tax;
$cartCount = array_sum($_SESSION['cart']);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cart | PRISM Collective</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
    <style>
        /* Cart Page Specific Styles */
        .cart-page-header {
            padding: 6rem 2rem 2rem;
            text-align: center;
        }

        .cart-page-title {
            font-size: 3rem;
            letter-spacing: 0.1em;
            margin-bottom: 0.5rem;
        }

        .cart-page-title .accent {
            color: var(--accent);
            text-shadow: var(--accent-glow);
        }

        .cart-count-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: var(--glass-bg);
            backdrop-filter: var(--glass-blur);
            border: 1px solid var(--glass-border);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-family: var(--font-mono);
            font-size: 0.8rem;
        }

        .cart-main {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .cart-layout {
            display: grid;
            grid-template-columns: 1fr 400px;
            gap: 2rem;
            align-items: start;
        }

        /* Cart Items Section */
        .cart-items-section {
            border-radius: 20px;
            overflow: hidden;
        }

        .cart-items-header {
            padding: 1.5rem 2rem;
            border-bottom: 1px solid var(--glass-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .cart-items-title {
            font-size: 1.5rem;
            letter-spacing: 0.1em;
        }

        .cart-items-count {
            font-family: var(--font-mono);
            font-size: 0.75rem;
            color: var(--text-muted);
        }

        .cart-items-list {
            padding: 1rem;
        }

        /* Individual Cart Item */
        .cart-product {
            display: grid;
            grid-template-columns: 100px 1fr auto;
            gap: 1.5rem;
            padding: 1.5rem;
            border-radius: 16px;
            margin-bottom: 1rem;
            background: rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }

        .cart-product:hover {
            background: rgba(191, 0, 255, 0.1);
        }

        .cart-product:last-child {
            margin-bottom: 0;
        }

        .cart-product-image {
            width: 100px;
            height: 120px;
            border-radius: 12px;
            overflow: hidden;
            background: rgba(0, 0, 0, 0.3);
        }

        .cart-product-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .cart-product-details {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 0.5rem;
        }

        .cart-product-category {
            font-family: var(--font-mono);
            font-size: 0.65rem;
            color: var(--accent);
            letter-spacing: 0.1em;
        }

        .cart-product-name {
            font-size: 1.3rem;
            letter-spacing: 0.05em;
        }

        .cart-product-meta {
            font-family: var(--font-mono);
            font-size: 0.7rem;
            color: var(--text-muted);
        }

        .cart-product-price-each {
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--text-secondary);
        }

        .cart-product-actions {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: space-between;
        }

        .cart-product-remove {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 1.25rem;
            cursor: pointer;
            padding: 0.5rem;
            transition: all 0.3s ease;
        }

        .cart-product-remove:hover {
            color: #ff4b6e;
            transform: scale(1.2);
        }

        .cart-quantity-controls {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            background: rgba(0, 0, 0, 0.3);
            padding: 0.5rem;
            border-radius: 8px;
        }

        .cart-qty-btn {
            width: 32px;
            height: 32px;
            background: transparent;
            border: 1px solid var(--glass-border);
            color: var(--text-primary);
            font-size: 1rem;
            cursor: pointer;
            border-radius: 6px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .cart-qty-btn:hover {
            background: var(--accent);
            border-color: var(--accent);
        }

        .cart-qty-value {
            font-family: var(--font-mono);
            font-size: 1rem;
            min-width: 30px;
            text-align: center;
        }

        .cart-product-total {
            font-size: 1.25rem;
            letter-spacing: 0.05em;
            color: var(--text-primary);
        }

        /* Order Summary */
        .order-summary {
            position: sticky;
            top: 100px;
            border-radius: 20px;
            overflow: hidden;
        }

        .summary-header {
            padding: 1.5rem 2rem;
            border-bottom: 1px solid var(--glass-border);
        }

        .summary-title {
            font-size: 1.5rem;
            letter-spacing: 0.1em;
        }

        .summary-body {
            padding: 2rem;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid var(--glass-border);
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--text-secondary);
        }

        .summary-row:last-of-type {
            border-bottom: none;
        }

        .summary-row.total-row {
            padding-top: 1.5rem;
            margin-top: 1rem;
            border-top: 2px solid var(--accent);
            border-bottom: none;
        }

        .summary-row.total-row .summary-label,
        .summary-row.total-row .summary-value {
            font-family: var(--font-display);
            font-size: 1.5rem;
            color: var(--text-primary);
        }

        .summary-row.total-row .summary-value {
            color: var(--accent);
        }

        .promo-input-group {
            display: flex;
            gap: 0.5rem;
            margin: 1.5rem 0;
        }

        .promo-input {
            flex: 1;
            padding: 0.75rem 1rem;
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid var(--glass-border);
            border-radius: 8px;
            color: var(--text-primary);
            font-family: var(--font-mono);
            font-size: 0.75rem;
            letter-spacing: 0.1em;
        }

        .promo-input:focus {
            outline: none;
            border-color: var(--accent);
        }

        .promo-input::placeholder {
            color: var(--text-muted);
        }

        .promo-btn {
            padding: 0.75rem 1.25rem;
            background: transparent;
            border: 1px solid var(--accent);
            color: var(--accent);
            font-family: var(--font-mono);
            font-size: 0.7rem;
            letter-spacing: 0.1em;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .promo-btn:hover {
            background: var(--accent);
            color: white;
        }

        .checkout-btn-large {
            display: block;
            width: 100%;
            padding: 1.25rem;
            background: var(--accent);
            border: none;
            color: white;
            font-family: var(--font-display);
            font-size: 1.5rem;
            letter-spacing: 0.15em;
            text-align: center;
            text-decoration: none;
            cursor: pointer;
            border-radius: 12px;
            transition: all 0.3s ease;
            margin-top: 1.5rem;
        }

        .checkout-btn-large:hover {
            box-shadow: var(--accent-glow);
            transform: translateY(-3px);
        }

        .secure-badge {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 1rem;
            font-family: var(--font-mono);
            font-size: 0.7rem;
            color: var(--text-muted);
        }

        .continue-shopping {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-secondary);
            text-decoration: none;
            font-family: var(--font-mono);
            font-size: 0.75rem;
            letter-spacing: 0.1em;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
        }

        .continue-shopping:hover {
            color: var(--accent);
        }

        /* Empty Cart */
        .empty-cart-container {
            text-align: center;
            padding: 6rem 2rem;
            max-width: 500px;
            margin: 0 auto;
        }

        .empty-cart-icon {
            font-size: 5rem;
            margin-bottom: 2rem;
            opacity: 0.5;
        }

        .empty-cart-title {
            font-size: 2rem;
            letter-spacing: 0.1em;
            margin-bottom: 1rem;
        }

        .empty-cart-text {
            font-family: var(--font-mono);
            font-size: 0.85rem;
            color: var(--text-muted);
            margin-bottom: 2rem;
        }

        .shop-now-btn {
            display: inline-block;
            padding: 1rem 2.5rem;
            background: var(--accent);
            color: white;
            text-decoration: none;
            font-family: var(--font-display);
            font-size: 1.25rem;
            letter-spacing: 0.15em;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .shop-now-btn:hover {
            box-shadow: var(--accent-glow);
            transform: translateY(-3px);
        }

        /* Responsive */
        @media (max-width: 900px) {
            .cart-layout {
                grid-template-columns: 1fr;
            }

            .order-summary {
                position: static;
            }

            .cart-product {
                grid-template-columns: 80px 1fr;
            }

            .cart-product-actions {
                grid-column: 1 / -1;
                flex-direction: row;
                justify-content: space-between;
                margin-top: 1rem;
            }
        }

        @media (max-width: 600px) {
            .cart-page-title {
                font-size: 2rem;
            }

            .cart-product {
                grid-template-columns: 1fr;
                text-align: center;
            }

            .cart-product-image {
                width: 100%;
                height: 180px;
                margin-bottom: 1rem;
            }

            .cart-product-actions {
                flex-direction: column;
                gap: 1rem;
                align-items: center;
            }
        }
    </style>
</head>

<body>
    <!-- Animated Background -->
    <div class="prism-bg"></div>
    <div class="noise-overlay"></div>

    <!-- Navigation -->
    <nav class="navbar glass">
        <a href="index.php" class="nav-back">
            <span class="back-arrow">←</span>
            <span class="back-text">CONTINUE SHOPPING</span>
        </a>
        <a href="index.php" class="logo">
            <span class="logo-text">PRISM</span>
            <span class="logo-sub">COLLECTIVE</span>
        </a>
        <div class="cart-count-badge">
            <span>⬡</span>
            <span id="cartCount"><?= $cartCount ?></span> ITEMS
        </div>
    </nav>

    <!-- Cart Header -->
    <header class="cart-page-header">
        <h1 class="cart-page-title">YOUR <span class="accent">CART</span></h1>
    </header>

    <main class="cart-main">
        <?php if (empty($cartItems)): ?>
            <!-- Empty Cart -->
            <div class="empty-cart-container glass">
                <div class="empty-cart-icon">⬡</div>
                <h2 class="empty-cart-title">YOUR CART IS EMPTY</h2>
                <p class="empty-cart-text">// LOOKS LIKE YOU HAVEN'T ADDED ANYTHING YET</p>
                <a href="index.php" class="shop-now-btn">EXPLORE COLLECTION</a>
            </div>
        <?php else: ?>
            <!-- Cart Layout -->
            <div class="cart-layout">
                <!-- Cart Items -->
                <section class="cart-items-section glass">
                    <div class="cart-items-header">
                        <h2 class="cart-items-title">CART ITEMS</h2>
                        <span class="cart-items-count"><?= $cartCount ?> ITEM<?= $cartCount > 1 ? 'S' : '' ?></span>
                    </div>
                    <div class="cart-items-list">
                        <?php foreach ($cartItems as $item): ?>
                            <div class="cart-product" data-product-id="<?= $item['id'] ?>">
                                <div class="cart-product-image">
                                    <img src="<?= htmlspecialchars($item['image']) ?>" alt="<?= htmlspecialchars($item['name']) ?>">
                                </div>
                                <div class="cart-product-details">
                                    <span class="cart-product-category"><?= htmlspecialchars($item['category']) ?></span>
                                    <h3 class="cart-product-name"><?= htmlspecialchars($item['name']) ?></h3>
                                    <span class="cart-product-meta"><?= strtoupper(htmlspecialchars($item['description'])) ?></span>
                                    <span class="cart-product-price-each">₹<?= number_format($item['price'], 0) ?> each</span>
                                </div>
                                <div class="cart-product-actions">
                                    <button class="cart-product-remove" data-id="<?= $item['id'] ?>" title="Remove">✕</button>
                                    <div class="cart-quantity-controls">
                                        <button class="cart-qty-btn qty-minus" data-id="<?= $item['id'] ?>">−</button>
                                        <span class="cart-qty-value"><?= $item['quantity'] ?></span>
                                        <button class="cart-qty-btn qty-plus" data-id="<?= $item['id'] ?>">+</button>
                                    </div>
                                    <span class="cart-product-total">₹<?= number_format($item['total'], 0) ?></span>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </section>

                <!-- Order Summary -->
                <aside class="order-summary glass">
                    <div class="summary-header">
                        <h2 class="summary-title">ORDER SUMMARY</h2>
                    </div>
                    <div class="summary-body">
                        <div class="summary-row">
                            <span class="summary-label">SUBTOTAL</span>
                            <span class="summary-value" id="subtotal">₹<?= number_format($subtotal, 0) ?></span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">GST (18%)</span>
                            <span class="summary-value" id="tax">₹<?= number_format($tax, 0) ?></span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">SHIPPING</span>
                            <span class="summary-value" style="color: #00ff88;">FREE</span>
                        </div>
                        <div class="promo-input-group">
                            <input type="text" class="promo-input" placeholder="PROMO CODE">
                            <button class="promo-btn">APPLY</button>
                        </div>
                        <div class="summary-row total-row">
                            <span class="summary-label">TOTAL</span>
                            <span class="summary-value" id="total">₹<?= number_format($total, 0) ?></span>
                        </div>
                        <a href="checkout.php" class="checkout-btn-large">CHECKOUT</a>
                        <div class="secure-badge">
                            <span>🔒</span> SECURE CHECKOUT
                        </div>
                    </div>
                </aside>
            </div>
        <?php endif; ?>
    </main>

    <!-- Notification -->
    <div class="notification" id="notification">
        <span class="notification-icon">✓</span>
        <span class="notification-text" id="notificationText">Updated</span>
    </div>

    <script>
        // Cart page functionality
        document.addEventListener('DOMContentLoaded', () => {
            initQuantityButtons();
            initRemoveButtons();
        });

        function initQuantityButtons() {
            document.querySelectorAll('.qty-plus').forEach(btn => {
                btn.addEventListener('click', () => updateQuantity(btn.dataset.id, 1));
            });
            document.querySelectorAll('.qty-minus').forEach(btn => {
                btn.addEventListener('click', () => updateQuantity(btn.dataset.id, -1));
            });
        }

        function initRemoveButtons() {
            document.querySelectorAll('.cart-product-remove').forEach(btn => {
                btn.addEventListener('click', () => removeItem(btn.dataset.id));
            });
        }

        async function updateQuantity(productId, delta) {
            const productEl = document.querySelector(`.cart-product[data-product-id="${productId}"]`);
            const qtyEl = productEl.querySelector('.cart-qty-value');
            const newQty = parseInt(qtyEl.textContent) + delta;

            if (newQty < 1) {
                removeItem(productId);
                return;
            }

            const formData = new FormData();
            formData.append('action', 'update');
            formData.append('product_id', productId);
            formData.append('quantity', newQty);

            const response = await fetch('cart.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                location.reload();
            }
        }

        async function removeItem(productId) {
            const formData = new FormData();
            formData.append('action', 'remove');
            formData.append('product_id', productId);

            const productEl = document.querySelector(`.cart-product[data-product-id="${productId}"]`);
            productEl.style.opacity = '0';
            productEl.style.transform = 'translateX(50px)';

            const response = await fetch('cart.php', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();

            if (result.success) {
                setTimeout(() => location.reload(), 300);
            }
        }

        function showNotification(message) {
            const notification = document.getElementById('notification');
            const text = document.getElementById('notificationText');
            text.textContent = message;
            notification.classList.add('show');
            setTimeout(() => notification.classList.remove('show'), 3000);
        }
    </script>
</body>

</html>