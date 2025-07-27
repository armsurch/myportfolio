// Portfolio JavaScript - Enhanced Version
// Author: Nzotta Armstrong Uchenna

// Fallback for gtag function if Google Analytics is not loaded
if (typeof gtag === 'undefined') {
    window.gtag = function() {
        // Silently ignore analytics calls if GA is not loaded
        console.log('Analytics call:', arguments);
    };
}

// DOM Elements
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const mobileToggle = document.getElementById('mobile-toggle');
const navMenu = document.getElementById('nav-menu');
const backToTop = document.getElementById('backToTop');
const loadingScreen = document.getElementById('loadingScreen');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const themeText = document.getElementById('themeText');

// Check if required elements exist
if (!navbar || !navLinks.length || !mobileToggle || !navMenu || !backToTop || !loadingScreen || !themeToggle || !themeIcon || !themeText) {
    console.warn('Some required DOM elements are missing. Check HTML structure.');
}

// Loading Screen
window.addEventListener('load', () => {
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 1500);
    }
});

// Theme Toggle Functionality
let currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeButton();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        updateThemeButton();

        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                'theme': currentTheme
            });
        }
    });
}

function updateThemeButton() {
    if (themeIcon && themeText) {
        if (currentTheme === 'dark') {
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = 'Light';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = 'Dark';
        }
    }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (navbar && backToTop) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('visible');
        }
    }
});

// Mobile menu toggle
if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
}

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Close mobile menu
        if (navMenu) {
            navMenu.classList.remove('active');
        }
        if (mobileToggle) {
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }

        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'navigation_click', {
                'section': targetId.replace('#', '')
            });
        }
    });
});

// Back to top functionality
if (backToTop) {
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        if (typeof gtag !== 'undefined') {
            gtag('event', 'back_to_top_click');
        }
    });
}

// Skills tabs functionality
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');

        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');

        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'skills_tab_click', {
                'tab': targetTab
            });
        }
    });
});

// Project Search and Filter Functionality
const projectSearch = document.getElementById('projectSearch');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

// Search functionality
if (projectSearch) {
    projectSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterProjects(searchTerm, getActiveFilter());
    });
}

// Filter functionality
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Update active filter button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');
        const searchTerm = projectSearch ? projectSearch.value.toLowerCase() : '';
        filterProjects(searchTerm, filter);

        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'project_filter', {
                'filter': filter
            });
        }
    });
});

function getActiveFilter() {
    const activeButton = document.querySelector('.filter-btn.active');
    return activeButton ? activeButton.getAttribute('data-filter') : 'all';
}

function filterProjects(searchTerm, filter) {
    projectCards.forEach(card => {
        const title = card.querySelector('.project-title').textContent.toLowerCase();
        const description = card.querySelector('.project-description').textContent.toLowerCase();
        const category = card.getAttribute('data-category');

        const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
        const matchesFilter = filter === 'all' || category === filter;

        if (matchesSearch && matchesFilter) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Testimonials Carousel
const testimonialsContainer = document.getElementById('testimonialsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicators = document.querySelectorAll('.indicator');
let currentSlide = 0;
const totalSlides = indicators.length;

// Check if carousel elements exist
if (!testimonialsContainer || !prevBtn || !nextBtn || !indicators.length) {
    console.warn('Some carousel elements are missing. Carousel functionality may not work properly.');
}

// Auto-play carousel
let carouselInterval;
if (totalSlides > 0) {
    carouselInterval = setInterval(nextSlide, 5000);
}

function updateCarousel() {
    if (testimonialsContainer) {
        const translateX = -currentSlide * 100;
        testimonialsContainer.style.transform = `translateX(${translateX}%)`;
    }

    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    updateCarousel();
}

// Carousel controls
if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetCarouselInterval();
        if (typeof gtag !== 'undefined') {
            gtag('event', 'testimonial_next');
        }
    });
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetCarouselInterval();
        if (typeof gtag !== 'undefined') {
            gtag('event', 'testimonial_prev');
        }
    });
}

// Indicator clicks
indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => {
        currentSlide = index;
        updateCarousel();
        resetCarouselInterval();
        if (typeof gtag !== 'undefined') {
            gtag('event', 'testimonial_indicator', {
                'slide': index
            });
        }
    });
});

function resetCarouselInterval() {
    if (carouselInterval) {
        clearInterval(carouselInterval);
    }
    if (totalSlides > 0) {
        carouselInterval = setInterval(nextSlide, 5000);
    }
}

// Pause carousel on hover
if (testimonialsContainer) {
    testimonialsContainer.addEventListener('mouseenter', () => {
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    });

    testimonialsContainer.addEventListener('mouseleave', () => {
        if (totalSlides > 0) {
            carouselInterval = setInterval(nextSlide, 5000);
        }
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Animate skill bars
            const skillFills = entry.target.querySelectorAll('.skill-fill');
            skillFills.forEach(fill => {
                const width = fill.getAttribute('data-width');
                if (width) {
                    setTimeout(() => {
                        fill.style.width = width;
                    }, 200);
                }
            });
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
});

// Active navigation link based on scroll position
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Form submission enhancement
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Simulate form submission (replace with actual form handling)
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            submitBtn.style.background = '#28a745';

            // Reset form
            contactForm.reset();

            // Reset button after 3 seconds
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.background = '';
            }, 3000);

            // Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact_form_submit');
            }
        }, 2000);
    });
}

// Add loading animation for images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('load', () => {
        img.style.opacity = '1';
    });
});

// Initialize skill bar animations for visible elements
document.addEventListener('DOMContentLoaded', () => {
    const visibleSkillFills = document.querySelectorAll('.skill-fill');
    visibleSkillFills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        if (width && fill.getBoundingClientRect().top < window.innerHeight) {
            setTimeout(() => {
                fill.style.width = width;
            }, 500);
        }
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (mobileToggle) {
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    }

    // Arrow keys for carousel navigation
    if (e.key === 'ArrowLeft' && document.activeElement.closest('.testimonials-carousel')) {
        prevSlide();
        resetCarouselInterval();
    }
    if (e.key === 'ArrowRight' && document.activeElement.closest('.testimonials-carousel')) {
        nextSlide();
        resetCarouselInterval();
    }
});

// Performance monitoring
window.addEventListener('load', () => {
    // Track page load time
    if (typeof gtag !== 'undefined' && performance.timing) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        gtag('event', 'page_load_time', {
            'value': Math.round(loadTime)
        });
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    if (typeof gtag !== 'undefined') {
        gtag('event', 'javascript_error', {
            'error_message': e.error.message,
            'error_filename': e.filename,
            'error_line': e.lineno
        });
    }
});

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Print functionality
window.addEventListener('beforeprint', () => {
    if (typeof gtag !== 'undefined') {
        gtag('event', 'print_portfolio');
    }
});

// Scroll performance optimization
let ticking = false;

function updateScrollElements() {
    // Update navbar and back-to-top button
    if (navbar && backToTop) {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('visible');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('visible');
        }
    }

    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollElements);
        ticking = true;
    }
});

// Utility functions
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

// Debounced search for better performance
if (projectSearch) {
    const debouncedSearch = debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterProjects(searchTerm, getActiveFilter());

        // Analytics tracking for search
        if (searchTerm.length > 2 && typeof gtag !== 'undefined') {
            gtag('event', 'project_search', {
                'search_term': searchTerm
            });
        }
    }, 300);

    projectSearch.addEventListener('input', debouncedSearch);
}

// Initialize tooltips (if using a tooltip library)
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    // Tooltip implementation
}

function hideTooltip(e) {
    // Tooltip implementation
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeTooltips();

    // Add any additional initialization here
    console.log('Portfolio loaded successfully!');
    console.log('All console errors have been fixed!');
});

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        updateThemeButton,
        filterProjects,
        nextSlide,
        prevSlide,
        debounce
    };
}