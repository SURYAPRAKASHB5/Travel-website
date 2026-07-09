/**
 * Apex Voyages - Mobile Navigation & Menu Engine
 * Coordinates sliding sidebar overlays, interactive sub-menu accordion expansions,
 * viewport scrolling restraints, and hardware escape overrides.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
});

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navItemsWithDropdown = document.querySelectorAll('.nav-item.has-dropdown');

    if (!menuToggle || !navMenu) return;

    /**
     * 1. Core State Handlers (Open / Close Configuration)
     */
    const openMenu = () => {
        menuToggle.classList.add('is-open');
        navMenu.classList.add('is-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        
        // Prevent background double-scroll tracking on mobile viewports
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        menuToggle.classList.remove('is-open');
        navMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        
        // Restore default layout mechanics
        document.body.style.overflow = '';
        
        // Clean up any remaining interactive mobile accordion states upon closure
        navItemsWithDropdown.forEach(item => item.classList.remove('is-active'));
    };

    const toggleMenu = () => {
        if (navMenu.classList.contains('is-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    // Bind Primary Interactive Click Event
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    /**
     * 2. Context-Aware Sub-Menu Accordion Mechanics (Mobile State)
     */
    navItemsWithDropdown.forEach(item => {
        const triggerLink = item.querySelector('.nav-link');
        
        if (triggerLink) {
            triggerLink.addEventListener('click', (e) => {
                // Execute layout shift alterations only within compact viewport modes
                if (window.innerWidth < 1024) {
                    e.preventDefault();
                    e.stopPropagation();

                    const isActive = item.classList.contains('is-active');

                    // Collapse all neighboring panels to mimic semantic accordion frameworks
                    navItemsWithDropdown.forEach(el => el.classList.remove('is-active'));

                    // Toggle status for the targeted cluster node
                    if (!isActive) {
                        item.classList.add('is-active');
                    }
                }
            });
        }
    });

    /**
     * 3. Global Deflection & Environment Interceptions
     */
    // Close system instantly if a user selects a direct interior landmark path anchor link
    navMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link') && !e.target.parentElement.classList.contains('has-dropdown')) {
            closeMenu();
        }
    });

    // Close on tracking canvas tap out clicks
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('is-open') && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            closeMenu();
        }
    });

    // Capture Escape signals for immediate navigation collapse sequence overrides
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
            closeMenu();
        }
    });

    // Clean up interface layouts dynamically if display vectors shift to wider desktop profiles
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024 && navMenu.classList.contains('is-open')) {
            closeMenu();
        }
    }, { passive: true });
}