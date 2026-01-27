<?php
session_start();

$orderPlaced = false;
$orderNumber = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Simulate order processing
    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);

    if (!empty($name) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $orderNumber = 'ORD-' . strtoupper(substr(md5(time()), 0, 8));
        $_SESSION['cart'] = [];
        $orderPlaced = true;
    }
}

$cartCount = isset($_SESSION['cart']) ? array_sum($_SESSION['cart']) : 0;

if (!$orderPlaced && $cartCount === 0) {
    header('Location: cart.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Checkout | Space Tech Store</title>
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
        <a href="cart.php" class="back-link">← Back to Cart</a>
        <h1 class="store-title">
            <span class="title-glow">Checkout</span> Station
        </h1>
        <span class="cart-icon">🛒 <span class="cart-count"><?= $cartCount ?></span></span>
    </header>

    <main class="store-main checkout-page">
        <?php if ($orderPlaced): ?>
            <div class="order-success glass-card floating">
                <span class="success-icon">🚀</span>
                <h2 class="success-title">Mission Launched!</h2>
                <p class="order-number">Order: <strong><?= $orderNumber ?></strong></p>
                <p class="success-message">Your cargo is being prepared for interstellar delivery.</p>
                <div class="success-animation">
                    <div class="rocket">🚀</div>
                    <div class="trail"></div>
                </div>
                <a href="index.php" class="checkout-btn">
                    <span class="btn-text">Continue Exploring</span>
                    <span class="btn-glow"></span>
                </a>
            </div>
        <?php else: ?>
            <form class="checkout-form glass-card floating" method="POST">
                <h2 class="form-title">Transmission Details</h2>

                <div class="form-group">
                    <label for="name" class="form-label">Identification</label>
                    <input type="text" id="name" name="name" class="form-input" placeholder="Your Name" required>
                    <span class="input-glow"></span>
                </div>

                <div class="form-group">
                    <label for="email" class="form-label">Communication Frequency</label>
                    <input type="email" id="email" name="email" class="form-input" placeholder="your.email@space.com" required>
                    <span class="input-glow"></span>
                </div>

                <div class="form-group">
                    <label for="address" class="form-label">Delivery Coordinates</label>
                    <textarea id="address" name="address" class="form-input form-textarea" placeholder="Station/Colony Address" rows="3" required></textarea>
                    <span class="input-glow"></span>
                </div>

                <div class="form-divider"></div>

                <h3 class="form-subtitle">Payment Matrix</h3>

                <div class="form-group">
                    <label for="card" class="form-label">Credit Link Number</label>
                    <input type="text" id="card" name="card" class="form-input" placeholder="•••• •••• •••• ••••" maxlength="19" required>
                    <span class="input-glow"></span>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="expiry" class="form-label">Expiry</label>
                        <input type="text" id="expiry" name="expiry" class="form-input" placeholder="MM/YY" maxlength="5" required>
                        <span class="input-glow"></span>
                    </div>
                    <div class="form-group">
                        <label for="cvv" class="form-label">Security Code</label>
                        <input type="text" id="cvv" name="cvv" class="form-input" placeholder="•••" maxlength="4" required>
                        <span class="input-glow"></span>
                    </div>
                </div>

                <div class="demo-notice">
                    <span>🔒</span> Demo Mode - No actual payment will be processed
                </div>

                <button type="submit" class="checkout-btn submit-btn">
                    <span class="btn-text">Launch Order</span>
                    <span class="btn-glow"></span>
                </button>
            </form>
        <?php endif; ?>
    </main>

    <script src="script.js"></script>
</body>

</html>