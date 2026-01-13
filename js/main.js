/* =============================================
   PORTFOLIO WEBSITE - MAIN JAVASCRIPT
   Core functionality and interactions
============================================= */

'use strict';

// =============================================
// DOM ELEMENTS
// =============================================
const DOM = {
    preloader: document.getElementById('preloader'),
    navbar: document.getElementById('mainNav'),
    navLinks: document.querySelectorAll('.nav-link'),
    backToTop: document.getElementById('backToTop'),
    contactForm: document.getElementById('contactForm'),
    formSuccess: document.getElementById('formSuccess'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    projectCards: document.querySelectorAll('.project-card'),
    currentYear: document.getElementById('currentYear'),
    sections: document.querySelectorAll('section[id]')
};

// =============================================
// PRELOADER
// =============================================
function hidePreloader() {
    if (DOM.preloader) {
        setTimeout(() => {
            DOM.preloader.classList.add('hidden');
            document.body.style.overflow = 'auto';
        }, 500);
    }
}

// =============================================
// NAVBAR SCROLL EFFECT
// =============================================
function handleNavbarScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
        DOM.navbar.classList.add('scrolled');
    } else {
        DOM.navbar.classList.remove('scrolled');
    }
}

// =============================================
// SMOOTH SCROLLING
// =============================================
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navHeight = DOM.navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            }
        });
    });
}

// =============================================
// ACTIVE SECTION HIGHLIGHTING
// =============================================
function initActiveNavHighlight() {
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.getAttribute('id');

                DOM.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${activeId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    DOM.sections.forEach(section => {
        observer.observe(section);
    });
}

// =============================================
// BACK TO TOP BUTTON
// =============================================
function handleBackToTop() {
    if (window.scrollY > 300) {
        DOM.backToTop.classList.add('visible');
    } else {
        DOM.backToTop.classList.remove('visible');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// =============================================
// PROJECT FILTERING
// =============================================
function initProjectFiltering() {
    DOM.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            DOM.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filter projects
            const filter = btn.getAttribute('data-filter');

            DOM.projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}

// =============================================
// CONTACT FORM HANDLING
// =============================================
function initContactForm() {
    if (!DOM.contactForm) return;

    DOM.contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form fields
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        // Validate form
        let isValid = true;

        if (!name.value.trim()) {
            showError(name);
            isValid = false;
        } else {
            hideError(name);
        }

        if (!validateEmail(email.value)) {
            showError(email);
            isValid = false;
        } else {
            hideError(email);
        }

        if (!message.value.trim()) {
            showError(message);
            isValid = false;
        } else {
            hideError(message);
        }

        if (!isValid) return;

        // Show loading state
        const submitBtn = DOM.contactForm.querySelector('button[type="submit"]');
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual API call)
        await simulateFormSubmit();

        // Show success message
        DOM.contactForm.classList.add('submitted');
        DOM.formSuccess.classList.add('show');

        // Reset form
        DOM.contactForm.reset();
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    });

    // Real-time validation
    const inputs = DOM.contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function () {
            if (this.hasAttribute('required')) {
                if (this.type === 'email') {
                    if (!validateEmail(this.value)) {
                        showError(this);
                    } else {
                        hideError(this);
                    }
                } else {
                    if (!this.value.trim()) {
                        showError(this);
                    } else {
                        hideError(this);
                    }
                }
            }
        });

        input.addEventListener('input', function () {
            hideError(this);
        });
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.toLowerCase());
}

function showError(input) {
    input.parentElement.classList.add('error');
}

function hideError(input) {
    input.parentElement.classList.remove('error');
}

function simulateFormSubmit() {
    return new Promise(resolve => {
        setTimeout(resolve, 1500);
    });
}

// =============================================
// UPDATE CURRENT YEAR
// =============================================
function updateCurrentYear() {
    if (DOM.currentYear) {
        DOM.currentYear.textContent = new Date().getFullYear();
    }
}

// =============================================
// CSS ANIMATION KEYFRAMES (Dynamic)
// =============================================
function addCSSAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// =============================================
// EVENT LISTENERS
// =============================================
function initEventListeners() {
    // Window events
    window.addEventListener('scroll', () => {
        handleNavbarScroll();
        handleBackToTop();
    }, { passive: true });

    // Back to top
    if (DOM.backToTop) {
        DOM.backToTop.addEventListener('click', scrollToTop);
    }
}

// =============================================
// INITIALIZATION
// =============================================
function init() {
    // Add CSS animations
    addCSSAnimations();

    // Initialize all features
    initSmoothScrolling();
    initActiveNavHighlight();
    initProjectFiltering();
    initContactForm();
    initEventListeners();

    // Update year
    updateCurrentYear();

    // Initial scroll check
    handleNavbarScroll();
    handleBackToTop();
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', init);

// Hide preloader when page fully loads
window.addEventListener('load', hidePreloader);
