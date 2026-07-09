/**
 * Apex Voyages - Hero Slider Module
 * Manages premium full-width background slider layouts featuring automated pacing,
 * gesture handling for fluid mobile touch loops, and interactive controllers.
 */

document.addEventListener('DOMContentLoaded', () => {
    initHeroSlider();
});

function initHeroSlider() {
    const sliderContainer = document.querySelector('.hero-slider-section');
    const sliderWrapper = document.getElementById('heroSlider');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const dotsContainer = document.getElementById('sliderDots');

    if (!sliderWrapper) return;

    const slides = sliderWrapper.querySelectorAll('.slide');
    if (slides.length === 0) return;

    let currentIdx = 0;
    let autoplayTimer = null;
    const autoplayDelay = 6000; // 6 seconds per editorial travel transition

    // Mobile Swipe Gesture Variables
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50;

    /**
     * 1. Initialize Control Infrastructure (Dots / Indicators)
     */
    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = ''; // Sanitize container
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(idx);
                resetAutoplay();
            });
            dotsContainer.appendChild(dot);
        });
    }

    /**
     * 2. Core Navigation Switcher
     */
    function goToSlide(index) {
        // Handle boundary conditions for infinite loop wrapping
        if (index >= slides.length) {
            currentIdx = 0;
        } else if (index < 0) {
            currentIdx = slides.length - 1;
        } else {
            currentIdx = index;
        }

        // Switch Active Status on Slides
        slides.forEach((slide, idx) => {
            if (idx === currentIdx) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        // Sync Indicator Dot State
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, idx) => {
                if (idx === currentIdx) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    }

    function nextSlide() {
        goToSlide(currentIdx + 1);
    }

    function prevSlide() {
        goToSlide(currentIdx - 1);
    }

    /**
     * 3. Pacing Automation (Autoplay Engine)
     */
    function startAutoplay() {
        if (autoplayTimer) return;
        autoplayTimer = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    /**
     * 4. Touch & Gesture Mobile Integration (Swiping)
     */
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }

    function handleSwipeGesture() {
        const deltaX = touchEndX - touchStartX;
        if (Math.abs(deltaX) > swipeThreshold) {
            if (deltaX < 0) {
                // Swiped Left -> Present Next Card
                nextSlide();
            } else {
                // Swiped Right -> Present Prior Card
                prevSlide();
            }
            resetAutoplay();
        }
    }

    /**
     * 5. Event Binding Engine
     */
    // Direct Directional Pointer Controls
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoplay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoplay();
        });
    }

    // Interaction Delays (Pause on Hover)
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoplay);
        sliderContainer.addEventListener('mouseleave', startAutoplay);
        
        // Register Mobile Gestures
        sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        sliderContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    // Hardware Keyboard Access Extensions
    window.addEventListener('keydown', (e) => {
        // Intercept viewport view locks only if slider is currently broadly visible
        const bounds = sliderContainer.getBoundingClientRect();
        if (bounds.top < window.innerHeight && bounds.bottom >= 0) {
            if (e.key === 'ArrowRight') {
                nextSlide();
                resetAutoplay();
            } else if (e.key === 'ArrowLeft') {
                prevSlide();
                resetAutoplay();
            }
        }
    });

    // Execute Layout Allocations
    createDots();
    startAutoplay();
}