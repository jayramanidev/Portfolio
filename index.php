<?php

/**
 * ANTIGRAVITY CODER - Portfolio
 * Performance Optimized Version
 */

// Enable GZIP compression if supported
if (extension_loaded('zlib') && !ini_get('zlib.output_compression')) {
    ob_start('ob_gzhandler');
}

// AJAX Contact Form Handler
$is_ajax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) &&
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize inputs
    $name = htmlspecialchars(trim($_POST['name'] ?? ''), ENT_QUOTES, 'UTF-8');
    $email = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(trim($_POST['message'] ?? ''), ENT_QUOTES, 'UTF-8');

    // Validate inputs
    if (empty($name) || empty($email) || empty($message)) {
        $response['message'] = 'All fields are required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Please enter a valid email address.';
    } else {
        // In a real scenario, you would send an email here
        $response['success'] = true;
        $response['message'] = 'Message Transmitted into the Void';
    }

    // If AJAX request, return JSON and exit
    if ($is_ajax) {
        header('Content-Type: application/json');
        echo json_encode($response);
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Portfolio of an Antigravity Coder - BCA Semester 4 Student">
    <meta name="theme-color" content="#0a0a0f">
    <title>Jay Ramani | Antigravity Coder</title>

    <!-- DNS Prefetch and Preconnect for faster font loading -->
    <link rel="dns-prefetch" href="//fonts.googleapis.com">
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <!-- Preload critical CSS -->
    <link rel="preload" href="style.css" as="style">

    <!-- Google Fonts - Only load weights actually used (400, 500, 700) -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&family=Rajdhani:wght@400;500;600&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="style.css">
</head>

<body>
    <!-- Skip to Content Link for Accessibility -->
    <a href="#main-content" class="skip-link">Skip to main content</a>

    <!-- Starfield Background -->
    <div class="starfield">
        <div class="stars stars-small"></div>
        <div class="stars stars-medium"></div>
        <div class="stars stars-large"></div>
    </div>

    <!-- 3D Perspective Container -->
    <main class="space-container" id="spaceContainer" id="main-content">

        <!-- Section 1: Hero Layer (Furthest Back) -->
        <section class="layer hero-layer" id="hero">
            <div class="hero-content">
                <h1 class="hero-title floating">
                    <span class="greeting">Hi, I'm</span>
                    <span class="name-glow">Jay Ramani</span>
                </h1>
                <p class="hero-subtitle floating-delay">BCA Sem 4 | The Antigravity Coder</p>
                <a href="#about" class="enter-space-btn floating-slow" id="enterSpaceBtn">
                    <span class="btn-text">Enter Space</span>
                    <span class="btn-glow"></span>
                </a>
            </div>
            <div class="hero-decoration">
                <div class="orbit-ring orbit-1"></div>
                <div class="orbit-ring orbit-2"></div>
                <div class="orbit-ring orbit-3"></div>
            </div>
        </section>

        <!-- Section 2: About & Skills Layer (Mid-ground) -->
        <section class="layer about-layer" id="about">
            <div class="section-content">
                <h2 class="section-title floating">About Me</h2>
                <div class="glass-card floating-delay">
                    <p class="about-text">
                        I'm a passionate BCA student exploring the infinite universe of code.
                        Currently in my 4th semester, I'm on a mission to master the art of
                        web development and software engineering. I believe in creating experiences
                        that feel weightless, intuitive, and out of this world.
                    </p>
                    <p class="about-text">
                        When I'm not coding, you'll find me exploring new technologies,
                        solving algorithmic puzzles, or dreaming up the next big digital experience.
                    </p>
                </div>

                <h2 class="section-title skills-title floating">Skills Matrix</h2>
                <div class="skills-container">
                    <div class="skill-orb floating" style="--delay: 0s; --float-offset: 0deg;">
                        <div class="skill-hexagon">
                            <span>HTML5</span>
                        </div>
                    </div>
                    <div class="skill-orb floating" style="--delay: 0.5s; --float-offset: 60deg;">
                        <div class="skill-hexagon">
                            <span>CSS3</span>
                        </div>
                    </div>
                    <div class="skill-orb floating" style="--delay: 1s; --float-offset: 120deg;">
                        <div class="skill-hexagon">
                            <span>JavaScript</span>
                        </div>
                    </div>
                    <div class="skill-orb floating" style="--delay: 1.5s; --float-offset: 180deg;">
                        <div class="skill-hexagon">
                            <span>PHP</span>
                        </div>
                    </div>
                    <div class="skill-orb floating" style="--delay: 2s; --float-offset: 240deg;">
                        <div class="skill-hexagon">
                            <span>MySQL</span>
                        </div>
                    </div>
                    <div class="skill-orb floating" style="--delay: 2.5s; --float-offset: 300deg;">
                        <div class="skill-hexagon">
                            <span>Java</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Section 3: Projects Layer (Closer) -->
        <section class="layer projects-layer" id="projects">
            <div class="section-content">
                <h2 class="section-title floating">Mission Logs (Projects)</h2>
                <div class="projects-grid">
                    <article class="project-card floating" style="--delay: 0s;">
                        <div class="card-screen">
                            <div class="card-header">
                                <span class="status-indicator"></span>
                                <span class="project-id">PRJ-001</span>
                            </div>
                            <h3 class="project-title">E-Commerce Platform</h3>
                            <p class="project-description">
                                A full-stack online shopping platform with cart functionality,
                                user authentication, and payment integration.
                            </p>
                            <div class="project-tech">
                                <span class="tech-tag">PHP</span>
                                <span class="tech-tag">MySQL</span>
                                <span class="tech-tag">JavaScript</span>
                            </div>
                            <div class="project-actions">
                                <a href="./prj-001/" class="project-btn project-btn-primary">
                                    <span>Live Demo</span>
                                </a>
                                <a href="https://github.com/jayramanidev/Portfolio/tree/main/prj-001" class="project-btn project-btn-secondary" target="_blank">
                                    <span>Source Code</span>
                                </a>
                            </div>
                        </div>
                        <div class="card-glow"></div>
                    </article>

                    <article class="project-card floating" style="--delay: 0.3s;">
                        <div class="card-screen">
                            <div class="card-header">
                                <span class="status-indicator"></span>
                                <span class="project-id">PRJ-002</span>
                            </div>
                            <h3 class="project-title">Task Management App</h3>
                            <p class="project-description">
                                A responsive task manager with drag-and-drop functionality,
                                priority levels, and deadline tracking.
                            </p>
                            <div class="project-tech">
                                <span class="tech-tag">HTML5</span>
                                <span class="tech-tag">CSS3</span>
                                <span class="tech-tag">JavaScript</span>
                            </div>
                            <div class="project-actions">
                                <a href="./prj-002/" class="project-btn project-btn-primary">
                                    <span>Live Demo</span>
                                </a>
                                <a href="https://github.com/jayramanidev/Portfolio/tree/main/prj-002" class="project-btn project-btn-secondary" target="_blank">
                                    <span>Source Code</span>
                                </a>
                            </div>
                        </div>
                        <div class="card-glow"></div>
                    </article>

                    <article class="project-card floating" style="--delay: 0.6s;">
                        <div class="card-screen">
                            <div class="card-header">
                                <span class="status-indicator"></span>
                                <span class="project-id">PRJ-003</span>
                            </div>
                            <h3 class="project-title">Weather Dashboard</h3>
                            <p class="project-description">
                                Real-time weather application with location-based forecasts,
                                interactive maps, and data visualization.
                            </p>
                            <div class="project-tech">
                                <span class="tech-tag">JavaScript</span>
                                <span class="tech-tag">API</span>
                                <span class="tech-tag">CSS3</span>
                            </div>
                            <div class="project-actions">
                                <a href="./prj-003/" class="project-btn project-btn-primary">
                                    <span>Live Demo</span>
                                </a>
                                <a href="https://github.com/jayramanidev/Portfolio/tree/main/prj-003" class="project-btn project-btn-secondary" target="_blank">
                                    <span>Source Code</span>
                                </a>
                            </div>
                        </div>
                        <div class="card-glow"></div>
                    </article>
                </div>
            </div>
        </section>

        <!-- Section 4: Contact Layer (Closest) -->
        <section class="layer contact-layer" id="contact">
            <div class="section-content">
                <h2 class="section-title floating">Transmit Signal</h2>

                <!-- Success/Error messages handled by JavaScript -->
                <div id="form-message" class="message" style="display: none;" aria-live="polite"></div>

                <form class="contact-form glass-card floating-delay" id="contactForm" method="POST" action="">
                    <div class="form-group">
                        <label for="name" class="form-label">Identification</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            class="form-input"
                            placeholder="Your Name"
                            autocomplete="name"
                            required>
                        <span class="input-glow"></span>
                    </div>

                    <div class="form-group">
                        <label for="email" class="form-label">Communication Frequency</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            class="form-input"
                            placeholder="your.email@space.com"
                            autocomplete="email"
                            required>
                        <span class="input-glow"></span>
                    </div>

                    <div class="form-group">
                        <label for="message" class="form-label">Transmission Data</label>
                        <textarea
                            id="message"
                            name="message"
                            class="form-input form-textarea"
                            placeholder="Your message to the void..."
                            rows="5"
                            required></textarea>
                        <span class="input-glow"></span>
                    </div>

                    <button type="submit" class="submit-btn" id="submitBtn">
                        <span class="btn-text">Transmit Message</span>
                        <span class="btn-loading" style="display: none;">Transmitting...</span>
                        <span class="btn-glow"></span>
                    </button>
                </form>

                <footer class="footer">
                    <p class="footer-text">© 2025 Jay Ramani | Floating through the digital cosmos</p>
                    <div class="social-links">
                        <a href="#" class="social-link floating" aria-label="GitHub">
                            <svg viewBox="0 0 24 24" class="social-icon">
                                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                            </svg>
                        </a>
                        <a href="#" class="social-link floating" style="--delay: 0.1s;" aria-label="LinkedIn">
                            <svg viewBox="0 0 24 24" class="social-icon">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                        <a href="#" class="social-link floating" style="--delay: 0.2s;" aria-label="Twitter">
                            <svg viewBox="0 0 24 24" class="social-icon">
                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                            </svg>
                        </a>
                    </div>
                </footer>
            </div>
        </section>

    </main>

    <!-- Navigation -->
    <nav class="space-nav" id="spaceNav" aria-label="Section Navigation">
        <a href="#hero" class="nav-dot active" data-section="hero" aria-label="Hero Section">
            <span class="nav-label">Home</span>
        </a>
        <a href="#about" class="nav-dot" data-section="about" aria-label="About Section">
            <span class="nav-label">About</span>
        </a>
        <a href="#projects" class="nav-dot" data-section="projects" aria-label="Projects Section">
            <span class="nav-label">Projects</span>
        </a>
        <a href="#contact" class="nav-dot" data-section="contact" aria-label="Contact Section">
            <span class="nav-label">Contact</span>
        </a>
    </nav>

    <!-- Scroll Progress Indicator -->
    <div class="scroll-progress" id="scrollProgress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>

    <script src="script.js" defer></script>
</body>

</html>