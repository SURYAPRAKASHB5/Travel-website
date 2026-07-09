/**
 * Apex Voyages - Core Orchestration Script
 * Handles global DOM initializations, scroll behaviors, headers, and form verification modules.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialise Core UI Modules
    initStickyHeader();
    initSmoothScroll();
    initActiveNavLinkOnScroll();
    initBackToTop();
    initGlobalSearchToggle();
    initFormValidation();
    initAgentLoginFlow();
    initPageLoader();
});

/**
 * 2. Sticky Header Engine
 * Transitions background state seamlessly based on structural offsets.
 */
function initStickyHeader() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    const toggleStickyClass = () => {
        if (window.scrollY > 40) {
            header.classList.add('is-sticky');
        } else {
            header.classList.remove('is-sticky');
        }
    };

    // Run on initial calculation and bind scroll hook
    toggleStickyClass();
    window.addEventListener('scroll', toggleStickyClass, { passive: true });
}

/**
 * 3. Smooth Scrolling Architecture
 * Adds accessible, semantic focus handling alongside modern motion shifts.
 */
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 90; // Balanced spacing for fixed header layouts
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update focus for screen-readers and accessibility trees
                targetElement.focus();
                if (document.activeElement !== targetElement) {
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                }
            }
        });
    });
}

/**
 * 4. Scroll-Linked Navigation Highlighting
 * Spies on active visible sections and reflects current status onto matching navbar element links.
 */
function initActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id], header[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!sections.length || !navLinks.length) return;

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // Accounts for header offset thresholds

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }, { passive: true });
}

/**
 * 5. Back to Top Automation
 * Handles intersection calculations for presenting the action control cleanly.
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTopBtn.classList.add('is-visible');
        } else {
            backToTopBtn.classList.remove('is-visible');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * 6. Immersive Full-Screen Search Modal Toggle
 * Provides modal overlay activation locks and focus control frameworks.
 */
function initGlobalSearchToggle() {
    const searchToggle = document.querySelector('.search-toggle-btn');
    const searchOverlay = document.getElementById('searchOverlay');
    const searchClose = document.querySelector('.search-close-btn');
    const searchInput = searchOverlay ? searchOverlay.querySelector('input[type="search"]') : null;

    if (!searchToggle || !searchOverlay || !searchClose) return;

    const openSearch = () => {
        searchOverlay.classList.add('is-open');
        searchOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Freeze secondary structural layers
        if (searchInput) setTimeout(() => searchInput.focus(), 100);
    };

    const closeSearch = () => {
        searchOverlay.classList.remove('is-open');
        searchOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    searchToggle.addEventListener('click', openSearch);
    searchClose.addEventListener('click', closeSearch);

    // Escape Key Intercept Escape Mechanism
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('is-open')) {
            closeSearch();
        }
    });
}

/**
 * 7. Modern Front-End Form Validation Modules
 * Intercepts default browser feedback structures with high fidelity client error interfaces.
 */
function initFormValidation() {
    // A. Trip Finder Segment Processing
    const finderForm = document.getElementById('finderForm');
    const finderMessage = document.getElementById('finderMessage');
    if (finderForm) {
        finderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;
            const selects = finderForm.querySelectorAll('select');

            selects.forEach(select => {
                if (!select.value) {
                    isValid = false;
                    select.style.borderColor = '#ff6b6b';
                } else {
                    select.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }
            });

            if (isValid) {
                if (finderMessage) {
                    finderMessage.innerHTML = '<strong>Welcome!</strong><br><strong>Welcome to Your Next Adventure!</strong><br>Thank you for choosing us to help plan your journey. Explore breathtaking destinations, unforgettable experiences, and personalized travel packages designed just for you.<br>Use the filters above to discover the perfect trip based on your preferred destination, travel style, and season.<br><strong>Your dream adventure starts here. Safe travels!</strong>';
                    finderMessage.classList.add('is-visible');
                }
                finderForm.reset();
            }
        });
    }

    // B. Catalog Request Handler
    const catalogForm = document.getElementById('catalogForm');
    const catalogMessage = document.getElementById('catalogMessage');
    if (catalogForm) {
        catalogForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('catalogName');
            const emailInput = document.getElementById('catalogEmail');
            const phoneInput = document.getElementById('catalogPhone');
            const notesInput = document.getElementById('catalogNotes');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^\+?[0-9\s()-]{7,15}$/;

            if (!nameInput || !emailInput || !phoneInput || !notesInput) return;

            const validEmail = emailRegex.test(emailInput.value.trim());
            const validPhone = phoneRegex.test(phoneInput.value.trim());
            if (!nameInput.value.trim() || !validEmail || !validPhone || !notesInput.value.trim()) {
                if (catalogMessage) {
                    catalogMessage.innerHTML = 'Please complete all fields with a valid email and phone number before submitting.';
                    catalogMessage.classList.add('is-visible');
                }
                return;
            }

            if (catalogMessage) {
                catalogMessage.innerHTML = `<strong>Thank You!</strong><br>A confirmation message has been sent to your Gmail inbox at <strong>${emailInput.value.trim()}</strong> and your phone number <strong>${phoneInput.value.trim()}</strong>.<br>Our team will send your travel catalog shortly and help you plan your next adventure.`;
                catalogMessage.classList.add('is-visible');
            }
            catalogForm.reset();
        });
    }

    // C. Meticulous Newsletter Registration Email Verification
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('newsletterEmail');
    const errorMsg = document.getElementById('emailError');

    if (newsletterForm && emailInput && errorMsg) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailValue = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(emailValue)) {
                errorMsg.style.display = 'block';
                emailInput.style.borderBottomColor = '#ff6b6b';
            } else {
                errorMsg.style.display = 'none';
                emailInput.style.borderBottomColor = 'rgba(255, 255, 255, 0.25)';
                alert('Thank you for subscribing to Apex Voyages editorial bulletins.');
                newsletterForm.reset();
            }
        });
    }
}

/**
 * 8. Performance Page Loader Management
 * Fades out overlay processing after parsing calculations settle down completely.
 */
function initAgentLoginFlow() {
    const agentLoginForm = document.getElementById('agentLoginForm');
    const agentLoginMessage = document.getElementById('agentLoginMessage');
    const agentWelcomeState = document.getElementById('agentWelcomeState');
    const agentWelcomeEmail = document.getElementById('agentWelcomeEmail');
    const agentLogoutBtn = document.getElementById('agentLogoutBtn');
    const emailInput = document.getElementById('agentEmail');
    const passwordInput = document.getElementById('agentPassword');
    const rememberCheckbox = document.getElementById('agentRemember');

    if (!agentLoginForm) return;

    const showLoggedInState = (email) => {
        const validEmail = email || localStorage.getItem('apexAgentEmail') || 'your account';
        if (agentWelcomeEmail) {
            agentWelcomeEmail.textContent = validEmail;
        }
        if (agentLoginForm) {
            agentLoginForm.style.display = 'none';
        }
        if (agentWelcomeState) {
            agentWelcomeState.hidden = false;
        }
        if (agentLoginMessage) {
            agentLoginMessage.innerHTML = '';
            agentLoginMessage.classList.remove('is-visible');
        }
    };

    const showLoginForm = () => {
        if (agentLoginForm) {
            agentLoginForm.style.display = 'block';
        }
        if (agentWelcomeState) {
            agentWelcomeState.hidden = true;
        }
    };

    const logoutAgent = () => {
        localStorage.removeItem('apexAgentLoggedIn');
        localStorage.removeItem('apexAgentEmail');
        if (emailInput) emailInput.value = '';
        if (passwordInput) passwordInput.value = '';
        if (rememberCheckbox) rememberCheckbox.checked = false;
        showLoginForm();
    };

    if (localStorage.getItem('apexAgentLoggedIn') === 'true') {
        showLoggedInState(localStorage.getItem('apexAgentEmail'));
    } else {
        showLoginForm();
    }

    if (agentLogoutBtn) {
        agentLogoutBtn.addEventListener('click', logoutAgent);
    }

    agentLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailInput || !passwordInput) return;

        if (!emailRegex.test(emailInput.value.trim()) || !passwordInput.value.trim()) {
            if (agentLoginMessage) {
                agentLoginMessage.innerHTML = 'Please enter a valid email address and password.';
                agentLoginMessage.classList.add('is-visible');
            }
            return;
        }

        localStorage.setItem('apexAgentLoggedIn', 'true');
        localStorage.setItem('apexAgentEmail', emailInput.value.trim());
        if (rememberCheckbox && !rememberCheckbox.checked) {
            localStorage.setItem('apexAgentRemember', 'false');
        }
        showLoggedInState(emailInput.value.trim());
        agentLoginForm.reset();
    });
}

function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    if (!loader) return;

    window.addEventListener('load', () => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 400);
    });
}