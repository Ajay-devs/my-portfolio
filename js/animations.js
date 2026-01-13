/* =============================================
   PORTFOLIO WEBSITE - ANIMATIONS
   Scroll animations and visual effects
============================================= */

'use strict';

// =============================================
// SKILL BAR ANIMATIONS
// =============================================
function initSkillBarAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress');

                setTimeout(() => {
                    bar.style.width = `${progress}%`;
                }, 200);

                observer.unobserve(bar);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    skillBars.forEach(bar => {
        bar.style.width = '0%';
        observer.observe(bar);
    });
}

// =============================================
// AOS (ANIMATE ON SCROLL) INITIALIZATION
// =============================================
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50,
            disable: function () {
                // Disable on mobile if performance is an issue
                return window.innerWidth < 768 && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            }
        });
    }
}

// =============================================
// COUNTER ANIMATION (for stats/numbers)
// =============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const animate = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(animate);
        } else {
            element.textContent = target;
        }
    };

    animate();
}

// =============================================
// SCROLL REVEAL ANIMATION (Fallback for AOS)
// =============================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('[data-reveal]');

    if (revealElements.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    revealElements.forEach(el => {
        el.classList.add('reveal-hidden');
        observer.observe(el);
    });

    // Add CSS for reveal animations
    const style = document.createElement('style');
    style.textContent = `
        .reveal-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .revealed {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// =============================================
// MAGNETIC BUTTON EFFECT
// =============================================
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-outline-primary');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// =============================================
// TILT EFFECT FOR CARDS
// =============================================
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.skill-card, .project-card:not(.coming-soon)');

    if (window.matchMedia('(hover: hover)').matches) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
}

// =============================================
// SMOOTH PARALLAX EFFECT
// =============================================
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-parallax') || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    }, { passive: true });
}

// =============================================
// CURSOR GLOW EFFECT (Desktop Only)
// =============================================
function initCursorGlow() {
    if (window.matchMedia('(hover: none)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);

    const style = document.createElement('style');
    style.textContent = `
        .cursor-glow {
            position: fixed;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(0, 102, 255, 0.15) 0%, transparent 70%);
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        .cursor-glow.active {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    let isMoving = false;
    let timeout;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        if (!isMoving) {
            cursor.classList.add('active');
            isMoving = true;
        }

        clearTimeout(timeout);
        timeout = setTimeout(() => {
            cursor.classList.remove('active');
            isMoving = false;
        }, 1000);
    });
}

// =============================================
// TEXT SCRAMBLE EFFECT
// =============================================
class TextScramble {
    constructor(element) {
        this.element = element;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.element.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];

        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }

        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;

        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];

            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }

        this.element.innerHTML = output;

        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }

    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

// =============================================
// INITIALIZATION
// =============================================
function initAnimations() {
    // Initialize all animations
    initSkillBarAnimations();
    initAOS();
    initScrollReveal();

    // Desktop-only effects
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
        initMagneticButtons();
        initTiltEffect();
        // Uncomment for cursor glow effect (optional)
        // initCursorGlow();
    }

    // Optional effects
    // initParallax();
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', initAnimations);

// Reinitialize AOS on window resize (optional)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }, 250);
});
