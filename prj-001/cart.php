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

$tax = $subtotal * 0.08;
$total = $subtotal + $tax;
$cartCount = array_sum($_SESSION['cart']);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cart | Space Tech Store</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Rajdhani:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <div class="starfield">
        <div class="stars stars-small"></div>
        <div class="stars stars-medium"></div>
    </div>

    <header class="store-header">
        <a href="index.php" class="back-link">← Continue Shopping</a>
        <h1 class="store-title">
            <span class="title-glow">Your</span> Cart
        </h1>
        <span class="cart-icon">🛒 <span class="cart-count" id="cartCount"><?= $cartCount ?></span></span>
    </header>

    <main class="store-main cart-page">
        <?php if (empty($cartItems)): ?>
            <div class="empty-cart glass-card floating">
                <span class="empty-icon">🛸</span>
                <h2>Your cargo bay is empty</h2>
                <p>Explore our tech and add items to your cart</p>
                <a href="index.php" class="checkout-btn">
                    <span class="btn-text">Browse Products</span>
                    <span class="btn-glow"></span>
                </a>
            </div>
        <?php else: ?>
            <div class="cart-container">
                <section class="cart-items glass-card">
                    <h2 class="cart-section-title">Cargo Manifest</h2>
                    <?php foreach ($cartItems as $item): ?>
                        <div class="cart-item floating" data-product-id="<?= $item['id'] ?>">
                            <span class="item-image"><?= $item['image'] ?></span>
                            <div class="item-info">
                                <h3 class="item-name"><?= htmlspecialchars($item['name']) ?></h3>
                                <span class="item-price">$<?= number_format($item['price'], 2) ?> each</span>
                            </div>
                            <div class="item-quantity">
                                <button class="qty-btn qty-minus" data-product-id="<?= $item['id'] ?>">−</button>
                                <span class="qty-value"><?= $item['quantity'] ?></span>
                                <button class="qty-btn qty-plus" data-product-id="<?= $item['id'] ?>">+</button>
                            </div>
                            <span class="item-total">$<?= number_format($item['total'], 2) ?></span>
                            <button class="remove-btn" data-product-id="<?= $item['id'] ?>">✕</button>
                        </div>
                    <?php endforeach; ?>
                </section>

                <aside class="cart-summary glass-card floating">
                    <h2 class="cart-section-title">Order Summary</h2>
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span id="subtotal">$<?= number_format($subtotal, 2) ?></span>
                    </div>
                    <div class="summary-row">
                        <span>Space Tax (8%)</span>
                        <span id="tax">$<?= number_format($tax, 2) ?></span>
                    </div>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span id="total">$<?= number_format($total, 2) ?></span>
                    </div>
                    <a href="checkout.php" class="checkout-btn">
                        <span class="btn-text">Proceed to Launch</span>
                        <span class="btn-glow"></span>
                    </a>
                </aside>
            </div>
        <?php endif; ?>
    </main>

    <div class="notification" id="notification">
        <span class="notification-text"></span>
    </div>

    <script src="script.js"></script>
</body>

</html>