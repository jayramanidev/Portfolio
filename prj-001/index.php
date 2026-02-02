<?php
session_start();

// Initialize cart and wishlist if not exists
if (!isset($_SESSION['cart'])) {
    $_SESSION['cart'] = [];
}
if (!isset($_SESSION['wishlist'])) {
    $_SESSION['wishlist'] = [];
}

// Load products
$productsJson = file_get_contents(__DIR__ . '/data/products.json');
$products = json_decode($productsJson, true);

// Group products by category
$categories = [
    'OUTERWEAR' => ['title' => 'JACKETS & LAYERS', 'products' => []],
    'TOPS' => ['title' => 'SHIRTS & HOODIES', 'products' => []],
    'BOTTOMS' => ['title' => 'PANTS & SWEATS', 'products' => []],
    'ACCESSORIES' => ['title' => 'CAPS & MORE', 'products' => []]
];

foreach ($products as $product) {
    $cat = $product['category'];
    if (isset($categories[$cat])) {
        $categories[$cat]['products'][] = $product;
    }
}

// Handle AJAX operations
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

        case 'wishlist_toggle':
            if (in_array($productId, $_SESSION['wishlist'])) {
                $_SESSION['wishlist'] = array_diff($_SESSION['wishlist'], [$productId]);
                $response['message'] = 'Removed from wishlist';
                $response['wishlisted'] = false;
            } else {
                $_SESSION['wishlist'][] = $productId;
                $response['message'] = 'Added to wishlist';
                $response['wishlisted'] = true;
            }
            $response['success'] = true;
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
    <meta name="description" content="PRISM - Premium Streetwear E-Commerce. Exclusive drops. Limited editions. Elevated style.">
    <title>PRISM | Streetwear Collective</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <!-- Animated Background -->
    <div class="prism-bg"></div>
    <div class="noise-overlay"></div>

    <!-- Floating Particles -->
    <div class="particles" id="particles"></div>

    <!-- Navigation -->
    <nav class="navbar glass">
        <a href="../" class="nav-back">
            <span class="back-arrow">←</span>
            <span class="back-text">PORTFOLIO</span>
        </a>
        <a href="#" class="logo">
            <span class="logo-text">PRISM</span>
            <span class="logo-sub">COLLECTIVE</span>
        </a>
        <button class="cart-btn glass" id="cartBtn">
            <span class="cart-icon">⬡</span>
            <span class="cart-label">CART</span>
            <span class="cart-count" id="cartCount"><?= $cartCount ?></span>
        </button>
    </nav>

    <!-- Hero Section -->
    <header class="hero">
        <div class="hero-content">
            <p class="hero-tagline mono">// DROPPING SOON — FW26 COLLECTION</p>
            <h1 class="hero-headline">
                <span class="line">BREAK THE</span>
                <span class="line accent">SPECTRUM</span>
            </h1>
            <p class="hero-description mono">
                LIMITED EDITION STREETWEAR FOR THOSE WHO REFUSE TO BLEND IN.
                HANDCRAFTED. EXCLUSIVE. UNAPOLOGETIC.
            </p>
            <a href="#products" class="cta-btn glass">
                <span class="cta-text">EXPLORE COLLECTION</span>
                <span class="cta-arrow">→</span>
            </a>
        </div>
        <div class="hero-visual">
            <div class="prism-shape"></div>
        </div>
    </header>

    <!-- Sticky Filter Bar -->
    <div class="filter-bar glass" id="filterBar">
        <div class="filter-container">
            <button class="filter-btn active" data-filter="all">ALL</button>
            <button class="filter-btn" data-filter="OUTERWEAR">OUTERWEAR</button>
            <button class="filter-btn" data-filter="TOPS">TOPS</button>
            <button class="filter-btn" data-filter="BOTTOMS">BOTTOMS</button>
            <button class="filter-btn" data-filter="ACCESSORIES">ACCESSORIES</button>
        </div>
    </div>

    <!-- Products Section -->
    <main class="products-section" id="products">
        <?php foreach ($categories as $catKey => $category): ?>
            <?php if (!empty($category['products'])): ?>
                <section class="category-section" data-category="<?= $catKey ?>">
                    <div class="section-header">
                        <span class="section-tag mono">// <?= $catKey ?></span>
                        <h2 class="section-title"><?= $category['title'] ?></h2>
                    </div>

                    <div class="products-grid">
                        <?php foreach ($category['products'] as $product):
                            $isWishlisted = in_array($product['id'], $_SESSION['wishlist']);
                        ?>
                            <article class="product-card glass" data-product-id="<?= $product['id'] ?>" data-category="<?= $catKey ?>">
                                <!-- Wishlist Heart -->
                                <button class="wishlist-btn <?= $isWishlisted ? 'active' : '' ?>" data-id="<?= $product['id'] ?>" title="Add to Wishlist">
                                    <span class="heart">♡</span>
                                    <span class="heart-filled">♥</span>
                                </button>

                                <?php if (!empty($product['badge'])): ?>
                                    <div class="product-badge"><?= $product['badge'] ?></div>
                                <?php endif; ?>

                                <!-- Stock Warning -->
                                <?php if ($product['stock'] > 0 && $product['stock'] <= 5): ?>
                                    <div class="stock-warning">Only <?= $product['stock'] ?> left!</div>
                                <?php endif; ?>

                                <div class="product-image" data-product='<?= json_encode($product) ?>'>
                                    <div class="image-skeleton"></div>
                                    <img src="<?= htmlspecialchars($product['image']) ?>" alt="<?= htmlspecialchars($product['name']) ?>" loading="lazy" onload="this.parentElement.classList.add('loaded')">
                                    <div class="quick-view-overlay">
                                        <span class="quick-view-text">QUICK VIEW</span>
                                    </div>
                                </div>
                                <div class="product-info">
                                    <span class="product-category mono"><?= htmlspecialchars($product['category']) ?></span>
                                    <h3 class="product-name"><?= htmlspecialchars($product['name']) ?></h3>
                                    <p class="product-desc mono"><?= strtoupper(htmlspecialchars($product['description'])) ?></p>

                                    <!-- Size Selector -->
                                    <?php if ($product['category'] !== 'ACCESSORIES'): ?>
                                        <div class="size-selector">
                                            <span class="size-label mono">SIZE:</span>
                                            <div class="size-options">
                                                <button class="size-btn" data-size="S">S</button>
                                                <button class="size-btn active" data-size="M">M</button>
                                                <button class="size-btn" data-size="L">L</button>
                                                <button class="size-btn" data-size="XL">XL</button>
                                            </div>
                                        </div>
                                    <?php endif; ?>

                                    <div class="product-footer">
                                        <span class="product-price">₹<?= number_format($product['price'], 0) ?></span>
                                        <?php if ($product['stock'] > 0): ?>
                                            <button class="add-btn" data-id="<?= $product['id'] ?>" data-name="<?= htmlspecialchars($product['name']) ?>" data-price="<?= $product['price'] ?>">
                                                <span class="btn-ripple"></span>
                                                <span class="add-text">ADD</span>
                                                <span class="add-icon">+</span>
                                            </button>
                                        <?php else: ?>
                                            <button class="add-btn disabled" disabled>
                                                <span class="add-text">SOLD OUT</span>
                                            </button>
                                        <?php endif; ?>
                                    </div>
                                </div>
                                <div class="card-glow"></div>
                            </article>
                        <?php endforeach; ?>
                    </div>
                </section>
            <?php endif; ?>
        <?php endforeach; ?>
    </main>

    <!-- Quick View Modal -->
    <div class="modal-overlay" id="quickViewModal">
        <div class="modal-content glass">
            <button class="modal-close" id="modalClose">✕</button>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="" alt="" id="modalImage">
                </div>
                <div class="modal-info">
                    <span class="modal-category mono" id="modalCategory"></span>
                    <h2 class="modal-name" id="modalName"></h2>
                    <p class="modal-desc mono" id="modalDesc"></p>
                    <div class="modal-sizes" id="modalSizes">
                        <span class="size-label mono">SELECT SIZE:</span>
                        <div class="size-options">
                            <button class="size-btn" data-size="S">S</button>
                            <button class="size-btn active" data-size="M">M</button>
                            <button class="size-btn" data-size="L">L</button>
                            <button class="size-btn" data-size="XL">XL</button>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <span class="modal-price" id="modalPrice"></span>
                        <button class="add-btn modal-add" id="modalAddBtn">
                            <span class="btn-ripple"></span>
                            <span class="add-text">ADD TO CART</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Cart Sidebar -->
    <aside class="cart-sidebar glass" id="cartSidebar">
        <div class="cart-header">
            <h2 class="cart-title">YOUR CART</h2>
            <button class="cart-close" id="cartClose">✕</button>
        </div>
        <div class="cart-items" id="cartItems">
            <p class="cart-empty mono">// CART IS EMPTY</p>
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span class="total-label">TOTAL</span>
                <span class="total-amount" id="cartTotal">₹0</span>
            </div>
            <a href="cart.php" class="checkout-btn">VIEW CART</a>
        </div>
    </aside>
    <div class="cart-overlay" id="cartOverlay"></div>

    <!-- Notification -->
    <div class="notification" id="notification">
        <span class="notification-icon">✓</span>
        <span class="notification-text" id="notificationText">Added to cart</span>
    </div>

    <!-- Back to Top Button -->
    <button class="back-to-top" id="backToTop" title="Back to Top">
        <span>↑</span>
    </button>

    <!-- Newsletter Popup -->
    <div class="newsletter-overlay" id="newsletterOverlay">
        <div class="newsletter-modal glass">
            <button class="newsletter-close" id="newsletterClose">✕</button>
            <div class="newsletter-content">
                <span class="newsletter-icon">✉</span>
                <h3 class="newsletter-title">GET 10% OFF</h3>
                <p class="newsletter-desc mono">SUBSCRIBE FOR EXCLUSIVE DROPS & EARLY ACCESS</p>
                <form class="newsletter-form" id="newsletterForm">
                    <input type="email" class="newsletter-input" placeholder="YOUR EMAIL" required>
                    <button type="submit" class="newsletter-btn">SUBSCRIBE</button>
                </form>
                <p class="newsletter-skip mono" id="newsletterSkip">NO THANKS, I'LL PAY FULL PRICE</p>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>

</html>