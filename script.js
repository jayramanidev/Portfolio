/**
 * ANTIGRAVITY CODER - Deep Space Portfolio
 * Vanilla JavaScript ES6+ for 3D Parallax Scrolling
 * No external libraries used
 */

(function () {
    'use strict';

    // DOM Elements
    const spaceContainer = document.getElementById('spaceContainer');
    const scrollProgress = document.getElementById('scrollProgress');
    const navDots = document.querySelectorAll('.nav-dot');
    const enterSpaceBtn = document.getElementById('enterSpaceBtn');
    const sections = document.querySelectorAll('.layer');

    // Configuration
    const config = {
        parallaxIntensity: 0.3,
        smoothScrollDuration: 1000,
        debounceDelay: 10
    };

    // State
    let isScrolling = false;
    let scrollTimeout;

    /**
     * Initialize the application
     */
    function init() {
        setupScrollListener();
        setupNavigation();
        setupEnterButton();
        setupIntersectionObserver();
        updateScrollProgress();
        animateOnLoad();
    }

    /**
     * Animate elements on page load
     */
    function animateOnLoad() {
        document.body.style.opacity = '0';

        requestAnimationFrame(() => {
            document.body.style.transition = 'opacity 0.5s ease-in-out';
            document.body.style.opacity = '1';
        });
    }

    /**
     * Setup scroll event listener with debouncing
     */
    function setupScrollListener() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Handle scroll events - updates CSS variable and progress
     */
    function handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollPercent = (scrollY / documentHeight) * 100;

        // Update CSS variable for parallax effect
        document.documentElement.style.setProperty('--scroll-y', scrollY);

        // Apply 3D parallax transforms to layers
        applyParallaxEffect(scrollY, windowHeight);

        // Update scroll progress bar
        updateScrollProgress(scrollPercent);

        // Update starfield parallax
        updateStarfield(scrollY);
    }

    /**
     * Apply 3D parallax effect to layers
     */
    function applyParallaxEffect(scrollY, windowHeight) {
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const relativeScroll = scrollY - sectionTop + windowHeight;

            // Calculate z-translation based on scroll position
            const zOffset = (index + 1) * 50; // Base z-offset per layer
            const scrollFactor = (relativeScroll / windowHeight) * config.parallaxIntensity;
            const translateZ = Math.min(Math.max(scrollFactor * zOffset, -100), 100);

            // Apply subtle rotation based on layer depth
            const rotateX = (scrollFactor - 0.5) * 2;

            section.style.transform = `translateZ(${translateZ}px) rotateX(${rotateX}deg)`;
        });
    }

    /**
     * Update starfield layers for depth effect
     */
    function updateStarfield(scrollY) {
        const stars = document.querySelectorAll('.stars');
        const speeds = [0.1, 0.2, 0.3]; // Different speeds for depth

        stars.forEach((star, index) => {
            const speed = speeds[index] || 0.1;
            const yOffset = scrollY * speed;
            star.style.transform = `translateY(${yOffset}px)`;
        });
    }

    /**
     * Update scroll progress indicator
     */
    function updateScrollProgress(percent = 0) {
        if (scrollProgress) {
            scrollProgress.style.width = `${percent}%`;
        }
    }

    /**
     * Setup navigation dot click handlers
     */
    function setupNavigation() {
        navDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = dot.getAttribute('href').substring(1);
                smoothScrollTo(targetId);
            });
        });
    }

    /**
     * Setup Enter Space button
     */
    function setupEnterButton() {
        if (enterSpaceBtn) {
            enterSpaceBtn.addEventListener('click', (e) => {
                e.preventDefault();
                smoothScrollTo('about');
            });
        }
    }

    /**
     * Smooth scroll to target section
     */
    function smoothScrollTo(targetId) {
        const target = document.getElementById(targetId);

        if (!target) return;

        const targetPosition = target.offsetTop;
        const startPosition = window.scrollY;
        const distance = targetPosition - startPosition;
        const duration = config.smoothScrollDuration;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // Easing function - easeInOutCubic
            const ease = progress < 0.5
                ? 4 * progress * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            window.scrollTo(0, startPosition + (distance * ease));

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    }

    /**
     * Setup Intersection Observer for section visibility
     */
    function setupIntersectionObserver() {
        const observerOptions = {
            root: null,
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    updateActiveNav(sectionId);
                    addVisibilityClass(entry.target);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    /**
     * Update active navigation dot
     */
    function updateActiveNav(sectionId) {
        navDots.forEach(dot => {
            const dotSection = dot.getAttribute('data-section');

            if (dotSection === sectionId) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    /**
     * Add visibility class for entrance animations
     */
    function addVisibilityClass(section) {
        section.classList.add('visible');
    }

    /**
     * Utility: Debounce function
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Utility: Throttle function
     */
    function throttle(func, limit) {
        let inThrottle;
        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Handle keyboard navigation
     */
    function setupKeyboardNav() {
        document.addEventListener('keydown', (e) => {
            const sectionIds = Array.from(sections).map(s => s.id);
            let currentIndex = 0;

            // Find current section based on scroll position
            sections.forEach((section, index) => {
                if (window.scrollY >= section.offsetTop - 100) {
                    currentIndex = index;
                }
            });

            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                e.preventDefault();
                const nextIndex = Math.min(currentIndex + 1, sections.length - 1);
                smoothScrollTo(sectionIds[nextIndex]);
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                e.preventDefault();
                const prevIndex = Math.max(currentIndex - 1, 0);
                smoothScrollTo(sectionIds[prevIndex]);
            } else if (e.key === 'Home') {
                e.preventDefault();
                smoothScrollTo(sectionIds[0]);
            } else if (e.key === 'End') {
                e.preventDefault();
                smoothScrollTo(sectionIds[sections.length - 1]);
            }
        });
    }

    /**
     * Add hover effects to project cards
     */
    function setupProjectCardEffects() {
        const cards = document.querySelectorAll('.project-card');

        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                // Skip effect if hovering over buttons
                if (e.target.closest('.project-btn') || e.target.closest('.project-actions')) {
                    return;
                }

                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 25;
                const rotateY = (centerX - x) / 25;

                const cardScreen = card.querySelector('.card-screen');
                if (cardScreen) {
                    cardScreen.style.transform = `
                        rotateX(${rotateX}deg) 
                        rotateY(${rotateY}deg)
                    `;
                }
            });

            card.addEventListener('mouseleave', () => {
                const cardScreen = card.querySelector('.card-screen');
                if (cardScreen) {
                    cardScreen.style.transform = 'rotateX(0) rotateY(0)';
                }
            });
        });
    }

    /**
     * Initialize cursor glow effect (optional enhancement)
     */
    /**
     * Initialize cursor glow effect (optional enhancement) - REMOVED
     */
    function setupCursorGlow() {
        // Feature removed as per user request
    }

    /**
     * Form validation enhancement
     */
    function setupFormValidation() {
        const form = document.querySelector('.contact-form');

        if (!form) return;

        const inputs = form.querySelectorAll('.form-input');

        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });

            input.addEventListener('input', () => {
                if (input.classList.contains('invalid')) {
                    validateInput(input);
                }
            });
        });

        form.addEventListener('submit', (e) => {
            let isValid = true;

            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                e.preventDefault();
            }
        });
    }

    /**
     * Validate individual input
     */
    function validateInput(input) {
        const value = input.value.trim();
        let isValid = true;

        if (input.hasAttribute('required') && !value) {
            isValid = false;
        }

        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(value);
        }

        if (isValid) {
            input.classList.remove('invalid');
            input.classList.add('valid');
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
        }

        return isValid;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            setupKeyboardNav();
            setupProjectCardEffects();
            setupCursorGlow();
            setupFormValidation();
        });
    } else {
        init();
        setupKeyboardNav();
        setupProjectCardEffects();
        setupCursorGlow();
        setupFormValidation();
    }

})();
