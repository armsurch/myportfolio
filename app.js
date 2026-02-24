// Portfolio JavaScript - Enhanced Version
// Author: Nzotta Armstrong Uchenna

// Fallback for gtag function if Google Analytics is not loaded
if (typeof gtag === 'undefined') {
    window.gtag = function() {
        // Silently ignore analytics calls if GA is not loaded
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

// Update copyright year automatically
function updateCopyrightYear() {
  const copyrightYear = document.getElementById('copyrightYear');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }
}

// Hide loading screen and initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Hide loading screen immediately
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }
  
  updateCopyrightYear();
  
  // Initialize AOS if available
  if (window.AOS && typeof AOS.init === 'function') {
    AOS.init();
  }
  
  // Initialize all functionality
  setupModals();
  initImageLoading();
  
  // Animation initialization
  enhanceModalAnimations();
  initTypewriter();
  initParallax();
  initParticles();
});

// Loading Screen - backup for window load event
window.addEventListener('load', () => {
    if (loadingScreen) {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 800);
    }
});

// Theme Toggle Functionality
let currentTheme = localStorage.getItem('theme') || 'dark';
document.body.setAttribute('data-theme', currentTheme);
updateThemeButton();

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', currentTheme);
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

// Mobile menu toggle
if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', String(isOpen));
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

// Keyboard navigation for carousel (Left/Right arrows)
window.addEventListener('keydown', (e) => {
    if (!testimonialsContainer) return;
    if (e.key === 'ArrowRight') {
        nextSlide();
        resetCarouselInterval();
    } else if (e.key === 'ArrowLeft') {
        prevSlide();
        resetCarouselInterval();
    }
});

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

// Form validation and submission enhancement
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField.call(input)) {
                isValid = false;
            }
        });

        if (!isValid) {
            showFormError('Please correct the errors above and try again.');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                showFormSuccess();
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = '#28a745';
                contactForm.reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            console.error('Form submission error:', err);
            showFormError('There was a problem sending your message. Please try again.');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }

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
    });
}

// Field validation function
function validateField() {
    const field = this;
    const fieldName = field.name;
    const value = field.value.trim();
    const fieldGroup = field.closest('.form-group');

    // Remove existing error messages
    clearFieldError.call(field);

    let isValid = true;
    let errorMessage = '';

    switch (fieldName) {
        case 'name':
            if (!value) {
                errorMessage = 'Full name is required';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'Name must be at least 2 characters long';
                isValid = false;
            } else if (!/^[a-zA-Z\s'-]+$/.test(value)) {
                errorMessage = 'Name can only contain letters, spaces, hyphens, and apostrophes';
                isValid = false;
            }
            break;

        case 'email':
            if (!value) {
                errorMessage = 'Email address is required';
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
            break;

        case 'subject':
            if (!value) {
                errorMessage = 'Subject is required';
                isValid = false;
            } else if (value.length < 5) {
                errorMessage = 'Subject must be at least 5 characters long';
                isValid = false;
            }
            break;

        case 'message':
            if (!value) {
                errorMessage = 'Message is required';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'Message must be at least 10 characters long';
                isValid = false;
            } else if (value.length > 1000) {
                errorMessage = 'Message must be less than 1000 characters';
                isValid = false;
            }
            break;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
        field.setAttribute('aria-invalid', 'true');
    } else {
        field.setAttribute('aria-invalid', 'false');
        fieldGroup.classList.add('valid');
    }

    return isValid;
}

// Show field error
function showFieldError(field, message) {
    const fieldGroup = field.closest('.form-group');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    fieldGroup.appendChild(errorDiv);
    fieldGroup.classList.add('error');
    fieldGroup.classList.remove('valid');
}

// Clear field error
function clearFieldError() {
    const fieldGroup = this.closest('.form-group');
    const errorDiv = fieldGroup.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    fieldGroup.classList.remove('error', 'valid');
}

// Show form error
function showFormError(message) {
    const existingError = contactForm.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    contactForm.insertBefore(errorDiv, contactForm.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Enhanced form success animation
function showFormSuccess() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    // Add success animation
    contactForm.classList.add('form-success');

    // Create checkmark animation
    const successMessage = document.createElement('div');
    successMessage.className = 'success-notification';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for reaching out. I'll get back to you within 24 hours.</p>
        </div>
    `;

    contactForm.parentNode.insertBefore(successMessage, contactForm.nextSibling);

    // Remove form and success message after animation
    setTimeout(() => {
        successMessage.style.animation = 'slideOutUp 0.4s ease-out forwards';
        setTimeout(() => {
            successMessage.remove();
            contactForm.classList.remove('form-success');
        }, 400);
    }, 4000);
}

// Enhanced error handling and loading states
function showLoadingState(element, show = true) {
    if (show) {
        element.classList.add('loading');
    } else {
        element.classList.remove('loading');
    }
}

function showErrorState(container, message, retryCallback = null) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-state';
    errorDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Oops! Something went wrong</h3>
        <p>${message}</p>
        ${retryCallback ? '<button class="retry-btn" onclick="retryCallback()">Try Again</button>' : ''}
    `;

    container.innerHTML = '';
    container.appendChild(errorDiv);

    // Auto-remove error after 10 seconds if no retry button
    if (!retryCallback) {
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 10000);
    }
}

// Enhanced image loading with error handling
function initImageLoading() {
    const images = document.querySelectorAll('img[data-src], img:not([src])');

    images.forEach(img => {
        // Add loading class initially
        img.classList.add('loading');

        // Handle load event
        img.addEventListener('load', () => {
            img.classList.remove('loading');
            img.classList.add('loaded');
        });

        // Handle error event
        img.addEventListener('error', () => {
            img.classList.remove('loading');
            img.classList.add('error');

            // Create fallback
            if (!img.hasAttribute('data-fallback-shown')) {
                img.setAttribute('data-fallback-shown', 'true');
                const fallback = document.createElement('div');
                fallback.className = 'image-fallback';
                fallback.innerHTML = '<i class="fas fa-image"></i><span>Image unavailable</span>';
                img.parentNode.insertBefore(fallback, img.nextSibling);
            }
        });

        // Lazy loading for images with data-src
        if (img.hasAttribute('data-src')) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const src = img.getAttribute('data-src');
                        img.src = src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            observer.observe(img);
        }
    });
}

// Global error handler
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);

    // Show user-friendly error notification for critical errors
    if (e.error && e.error.name === 'TypeError') {
        showGlobalNotification('A script error occurred. Some features may not work properly.', 'warning');
    }
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    showGlobalNotification('An unexpected error occurred. Please refresh the page if issues persist.', 'error');
});

// Global notification system
function showGlobalNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `global-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentNode.remove()">&times;</button>
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add loading animation for images

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
                // Service worker registered successfully
            })
            .catch(registrationError => {
                // Service worker registration failed
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

    // Update scroll progress bar
    const progress = document.getElementById('scrollProgress');
    if (progress) {
        const doc = document.documentElement;
        const scrollTop = doc.scrollTop || document.body.scrollTop;
        const scrollHeight = doc.scrollHeight - doc.clientHeight;
        const percent = scrollHeight ? (scrollTop / scrollHeight) * 100 : 0;
        progress.style.width = percent + '%';
    }

    // Update active navigation link
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

    // Update parallax effect
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const scrollY = window.pageYOffset;
        heroSection.style.backgroundPosition = `center ${scrollY * 0.5}px`;
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
    // Removed - tooltip library not in use
}

function showTooltip(e) {
    // Removed - tooltip implementation not needed
}

function hideTooltip(e) {
    // Removed - tooltip implementation not needed
}

// Modal functionality for existing modals in HTML
function setupModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
    });

    // Resume modal functionality
    const resumeModal = document.getElementById('resumeModal');
    const openResumeBtn = document.getElementById('openResumeModal');
    if (openResumeBtn && resumeModal) {
        openResumeBtn.addEventListener('click', () => {
            resumeModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    // Proposal modal functionality
    const proposalModal = document.getElementById('proposalModal');
    const openProposalBtn = document.getElementById('openProposalModal');
    if (openProposalBtn && proposalModal) {
        openProposalBtn.addEventListener('click', () => {
            proposalModal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    }

    window.addEventListener('click', (e) => {
        modals.forEach(modal => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
}

// Project sharing functionality
function shareProject(platform, projectTitle) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(`Check out this amazing project: ${projectTitle} by Armstrong Nzotta`);
    const text = encodeURIComponent(`🚀 ${projectTitle} - A cybersecurity & networking project by Armstrong Nzotta`);

    let shareUrl = '';

    switch (platform) {
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=cybersecurity,networking,portfolio`;
            break;
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`;
            break;
        default:
            return;
    }

    // Open share dialog in new window
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes');

    // Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'share_project', {
            'platform': platform,
            'project': projectTitle
        });
    }
}

// Resume download functionality
function downloadResume(format) {
    if (format === 'pdf') {
        // In a real implementation, this would generate and download a PDF
        alert('PDF Resume download would start here. Redirecting to resume PDF...');
        window.open('Pdf/Arms.pdf', '_blank');
    } else if (format === 'word') {
        alert('Word format download would be implemented here.');
    }
    
    const modal = document.getElementById('resumeModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(counter);
        }
        
        // Format number with commas
        if (target > 1000) {
            element.textContent = Math.floor(current).toLocaleString() + (element.textContent.includes('+') ? '+' : '');
        } else {
            element.textContent = Math.floor(current) + (element.textContent.includes('%') ? '%' : '');
        }
    }, 16);
}

// Intersection Observer for Scroll-Triggered Animations (Stats Counter)
const statObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Trigger counter animation for stats
            if (entry.target.classList.contains('stat-number')) {
                const text = entry.target.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                animateCounter(entry.target, number, 2000);
            }
            
            // Trigger animations for elements
            entry.target.classList.add('aos-animate');
            statObserver.unobserve(entry.target);
        }
    });
}, statObserverOptions);

// Observe all stat numbers for counter animation
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => statObserver.observe(stat));
});



// Modal Animation Enhancements
function enhanceModalAnimations() {
    // Handle data-modal buttons
    const modalButtons = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close');
    
    // Handle data-modal attribute triggers
    modalButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'flex';
                modal.classList.add('visible');
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Handle close buttons
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('visible');
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 300);
            }
        });
    });
    
    // Handle clicking outside modal
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('visible');
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }, 300);
            }
        });
    });
}

// Typewriter Effect for Hero Subtitle
function initTypewriter() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (!heroSubtitle) return;
    
    const text = heroSubtitle.textContent;
    heroSubtitle.textContent = '';
    let index = 0;
    
    const typeInterval = setInterval(() => {
        if (index < text.length) {
            heroSubtitle.textContent += text.charAt(index);
            index++;
        } else {
            clearInterval(typeInterval);
        }
    }, 30);
}

// Mobile touch gestures for testimonials and projects
function initTouchGestures() {
    // Testimonials swipe functionality
    const testimonialsContainer = document.querySelector('.testimonials-container');
    if (testimonialsContainer) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        testimonialsContainer.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        testimonialsContainer.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;

            // Prevent default scrolling if horizontal swipe
            if (Math.abs(diff) > 10) {
                e.preventDefault();
            }
        });

        testimonialsContainer.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            const diff = startX - currentX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    // Swipe left - next testimonial
                    nextTestimonial();
                } else {
                    // Swipe right - previous testimonial
                    prevTestimonial();
                }
            }
        });
    }

    // Projects swipe functionality
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        projectsGrid.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        projectsGrid.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;

            // Add visual feedback during swipe
            if (Math.abs(diff) > 10) {
                projectsGrid.style.transform = `translateX(${-diff * 0.1}px)`;
            }
        });

        projectsGrid.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;

            // Reset transform
            projectsGrid.style.transform = '';

            const diff = startX - currentX;
            const threshold = 50;

            if (Math.abs(diff) > threshold) {
                // On mobile, swipe could scroll to next/prev project
                // For now, we'll just add a subtle scroll effect
                const scrollAmount = diff > 0 ? 300 : -300;
                projectsGrid.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// Testimonial navigation functions (for touch gestures)
function nextTestimonial() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const activeTestimonial = document.querySelector('.testimonial-card.active');

    if (activeTestimonial) {
        const currentIndex = Array.from(testimonials).indexOf(activeTestimonial);
        const nextIndex = (currentIndex + 1) % testimonials.length;

        activeTestimonial.classList.remove('active');
        testimonials[nextIndex].classList.add('active');
    }
}

function prevTestimonial() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    const activeTestimonial = document.querySelector('.testimonial-card.active');

    if (activeTestimonial) {
        const currentIndex = Array.from(testimonials).indexOf(activeTestimonial);
        const prevIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;

        activeTestimonial.classList.remove('active');
        testimonials[prevIndex].classList.add('active');
    }
}

// Particles.js initialization for hero background
function initParticles() {
    const particlesContainer = document.getElementById('particles-js');
    if (!particlesContainer || typeof particlesJS === 'undefined') return;

    particlesJS('particles-js', {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#00ccff'
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                },
                polygon: {
                    nb_sides: 5
                }
            },
            opacity: {
                value: 0.5,
                random: false,
                anim: {
                    enable: false,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#00ccff',
                opacity: 0.4,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'repulse'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 400,
                    line_linked: {
                        opacity: 1
                    }
                },
                bubble: {
                    distance: 400,
                    size: 40,
                    duration: 2,
                    opacity: 8,
                    speed: 3
                },
                repulse: {
                    distance: 200,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                },
                remove: {
                    particles_nb: 2
                }
            }
        },
        retina_detect: true
    });
}

// Parallax Scroll Effect
function initParallax() {
    // Parallax is now handled in the consolidated scroll handler (updateScrollElements)
}

// Initialize all functionality
// (Moved to DOMContentLoaded at top of file)

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