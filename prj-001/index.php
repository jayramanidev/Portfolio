<?php
session_start();

// Initialize cart if not exists
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}

// Load products
$productsJson = file_get_contents(__DIR__ . '/data/products.json');
$products = json_decode($productsJson, true);

// Handle AJAX cart operations
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    header('Content-Type: application/json');
    $response = ['success' => false, 'message' => '', 'cartCount' => 0];

    $action = $_POST['action'];
    $productId = isset($_POST['product_id']) ? (int)$_POST['product_id'] : 0;

    switch ($action) {
        case 'add':
            if ($productId > 0) {
                if (isset($_SESSION['cart'][$productId])) {
                    $_SESSION['cart'][$productId]++;
                } else {
                    $_SESSION['cart'][$productId] = 1;
                }
                $response['success'] = true;
                $response['message'] = 'Item added to cart';
            }
            break;

        case 'remove':
            if (isset($_SESSION['cart'][$productId])) {
                unset($_SESSION['cart'][$productId]);
                $response['success'] = true;
                $response['message'] = 'Item removed from cart';
            }
            break;

        case 'update':
            $quantity = isset($_POST['quantity']) ? (int)$_POST['quantity'] : 0;
            if ($quantity > 0) {
                $_SESSION['cart'][$productId] = $quantity;
            } else {
                unset($_SESSION['cart'][$productId]);
            }
            $response['success'] = true;
            $response['message'] = 'Cart updated';
            break;

        case 'get':
            $response['success'] = true;
            $response['cart'] = $_SESSION['cart'];
            break;
    }

    $response['cartCount'] = array_sum($_SESSION['cart']);
    echo json_encode($response);
    exit;
}

// Get total cart count
$cartCount = array_sum($_SESSION['cart']);
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Space Tech Store - Futuristic E-Commerce Platform">
    <title>Space Tech Store | PRJ-001</title>
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
        <a href="../" class="back-link">← Back to Portfolio</a>
        <h1 class="store-title">
            <span class="title-glow">Space Tech</span> Store
        </h1>
        <a href="cart.php" class="cart-icon" id="cartIcon">
            🛒 <span class="cart-count" id="cartCount"><?= $cartCount ?></span>
        </a>
    </header>

    <main class="store-main">
        <section class="products-section">
            <h2 class="section-title floating">Available Tech</h2>
            <div class="products-grid">
                <?php foreach ($products as $product): ?>
                    <article class="product-card floating" style="--delay: <?= $product['id'] * 0.1 ?>s;">
                        <div class="product-image"><?= $product['image'] ?></div>
                        <div class="product-info">
                            <span class="product-category"><?= htmlspecialchars($product['category']) ?></span>
                            <h3 class="product-name"><?= htmlspecialchars($product['name']) ?></h3>
                            <p class="product-description"><?= htmlspecialchars($product['description']) ?></p>
                            <div class="product-footer">
                                <span class="product-price">$<?= number_format($product['price'], 2) ?></span>
                                <button class="add-to-cart-btn" data-product-id="<?= $product['id'] ?>">
                                    <span class="btn-text">Add to Cart</span>
                                    <span class="btn-glow"></span>
                                </button>
                            </div>
                        </div>
                        <div class="card-glow"></div>
                    </article>
                <?php endforeach; ?>
            </div>
        </section>
    </main>

    <div class="notification" id="notification">
        <span class="notification-text"></span>
    </div>

    <script src="script.js"></script>
</body>

</html>