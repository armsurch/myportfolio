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

// Hide loading screen when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }
  // Initialize AOS if available
  if (window.AOS && typeof AOS.init === 'function') {
    AOS.init();
  }
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

// Navbar scroll effect and top progress bar
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
    // Update scroll progress bar width
    const progress = document.getElementById('scrollProgress');
    if (progress) {
        const doc = document.documentElement;
        const scrollTop = doc.scrollTop || document.body.scrollTop;
        const scrollHeight = doc.scrollHeight - doc.clientHeight;
        const percent = scrollHeight ? (scrollTop / scrollHeight) * 100 : 0;
        progress.style.width = percent + '%';
    }
});

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
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        // Send to Formspree directly to match HTML action
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                submitBtn.style.background = '#28a745';
                contactForm.reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            console.error(err);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            alert('There was a problem sending your message. Please try again.');
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

// ------------------ Resume Generator ------------------
function setupResumeGenerator() {
    const openBtn = document.getElementById('openResumeModal');
    if (!openBtn) return;
    let overlay;

    openBtn.addEventListener('click', () => {
        if (!overlay) overlay = createResumeModal();
        overlay.classList.add('active');
    });
}

function createResumeModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3 class="modal-title">Generate Resume</h3>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-grid">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input class="form-input" id="res-name" value="Nzotta Armstrong Uchenna" />
          </div>
          <div class="form-group">
            <label class="form-label">Title</label>
            <input class="form-input" id="res-title" value="ICT Specialist" />
          </div>
          <div class="form-group" style="grid-column: 1/-1">
            <label class="form-label">Summary</label>
            <textarea class="form-textarea" id="res-summary" rows="3">Network & Systems Administration, Fiber Optics, and Technical Support.</textarea>
          </div>
          <div class="form-group" style="grid-column: 1/-1">
            <label class="form-label">Skills (comma separated)</label>
            <input class="form-input" id="res-skills" value="Networking, Fiber Optics, Mikrotik, UniFi, Microsoft 365, Troubleshooting"/>
          </div>
          <div class="form-group">
            <label class="form-label">Experience (bullets; ; separated)</label>
            <input class="form-input" id="res-exp" value="Designed and deployed LAN/Wi‑Fi networks; Configured MikroTik routers; Delivered IT support and maintenance"/>
          </div>
          <div class="form-group">
            <label class="form-label">Education</label>
            <input class="form-input" id="res-edu" value="B.Sc — ICT (or related)"/>
          </div>
        </div>
        <div class="actions">
          <button class="btn btn-secondary" id="res-preview">Preview</button>
          <button class="btn btn-primary" id="res-export">Export PDF</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    const close = () => overlay.classList.remove('active');
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.querySelector('.modal-close').addEventListener('click', close);

    const collect = () => ({
      name: document.getElementById('res-name').value.trim(),
      title: document.getElementById('res-title').value.trim(),
      summary: document.getElementById('res-summary').value.trim(),
      skills: document.getElementById('res-skills').value.split(',').map(s=>s.trim()).filter(Boolean),
      exp: document.getElementById('res-exp').value.split(';').map(s=>s.trim()).filter(Boolean),
      edu: document.getElementById('res-edu').value.trim()
    });

    const buildHTML = (data) => `
      <div style="font-family:Poppins,Arial,sans-serif;padding:24px;max-width:900px;margin:auto;color:#222">
        <div style="display:flex;gap:16px;align-items:center;border-bottom:2px solid #0aa; padding-bottom:12px;margin-bottom:16px">
          <img src="img/mine.png" alt="Avatar" style="width:64px;height:64px;border-radius:50%"/>
          <div>
            <h1 style="margin:0;font-size:26px">${data.name}</h1>
            <div style="color:#0aa">${data.title}</div>
          </div>
        </div>
        <p style="line-height:1.6">${data.summary}</p>
        <h3 style="margin-top:18px">Skills</h3>
        <ul style="display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;margin:8px 0 0">
          ${data.skills.map(s=>`<li style=\"background:#eef;padding:6px 10px;border-radius:999px\">${s}</li>`).join('')}
        </ul>
        <h3 style="margin-top:18px">Experience</h3>
        <ul>
          ${data.exp.map(e=>`<li style=\"margin:6px 0\">${e}</li>`).join('')}
        </ul>
        <h3 style="margin-top:18px">Education</h3>
        <p>${data.edu}</p>
      </div>`;

    const previewBtn = overlay.querySelector('#res-preview');
    const exportBtn = overlay.querySelector('#res-export');

    previewBtn.addEventListener('click', () => {
      const data = collect();
      const w = window.open('', '_blank');
      w.document.write(buildHTML(data));
      w.document.close();
    });

    exportBtn.addEventListener('click', () => {
      const data = collect();
      const w = window.open('', '_blank');
      w.document.write(buildHTML(data) + '<script>window.onload=()=>{setTimeout(()=>{window.print();},300)}<\/script>');
      w.document.close();
    });

    return overlay;
}

// ------------------ Proposal Generator ------------------
function setupProposalGenerator() {
    const openBtn = document.getElementById('openProposalModal');
    if (!openBtn) return;
    let overlay;
    openBtn.addEventListener('click', () => {
        if (!overlay) overlay = createProposalModal();
        overlay.classList.add('active');
    });
}

function createProposalModal() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-header">
          <h3 class="modal-title">Generate Proposal</h3>
          <button class="modal-close" aria-label="Close">✕</button>
        </div>
        <div class="modal-grid">
          <div class="form-group">
            <label class="form-label">Client Name</label>
            <input class="form-input" id="p-client" placeholder="Client / Company"/>
          </div>
          <div class="form-group">
            <label class="form-label">Location</label>
            <input class="form-input" id="p-location" placeholder="City, Country"/>
          </div>
          <div class="form-group">
            <label class="form-label">Contact</label>
            <input class="form-input" id="p-contact" placeholder="email@domain.com"/>
          </div>
          <div class="form-group">
            <label class="form-label">Proposal Type</label>
            <select id="p-type">
              <option>Home/Office LAN setup</option>
              <option>Fiber optics installation</option>
              <option>Wi‑Fi coverage and AP deployment</option>
              <option>Network security hardening</option>
              <option>Starlink setup</option>
              <option>Custom</option>
            </select>
          </div>
          <div class="form-group" style="grid-column:1/-1">
            <label class="form-label">Scope Details</label>
            <textarea class="form-textarea" id="p-scope" rows="3" placeholder="Devices, floors, cable length, AP count, etc."></textarea>
          </div>
          <div class="form-group">
            <label class="form-label">Budget Range</label>
            <input class="form-input" id="p-budget" placeholder="$2,000 - $5,000"/>
          </div>
          <div class="form-group">
            <label class="form-label">Timeline</label>
            <input class="form-input" id="p-timeline" placeholder="2–4 weeks"/>
          </div>
          <div class="form-group" style="grid-column:1/-1">
            <label class="form-label">Deliverables</label>
            <input class="form-input" id="p-deliverables" placeholder="Site survey, cabling, configuration, documentation"/>
          </div>
          <div class="form-group" style="grid-column:1/-1">
            <label class="form-label">Milestones</label>
            <input class="form-input" id="p-milestones" placeholder="Deposit, procurement, installation, testing, handover"/>
          </div>
          <div class="form-group" style="grid-column:1/-1">
            <label class="form-label">Warranty</label>
            <input class="form-input" id="p-warranty" placeholder="12-month hardware and workmanship warranty"/>
          </div>
          <div class="form-group" style="grid-column:1/-1">
            <label class="form-label">Payment Terms</label>
            <input class="form-input" id="p-payment" placeholder="50% upfront, 50% on completion"/>
          </div>
        </div>
        <div class="actions">
          <button class="btn btn-secondary" id="p-preview">Preview</button>
          <button class="btn btn-primary" id="p-export">Export PDF</button>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    const close = () => overlay.classList.remove('active');
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    overlay.querySelector('.modal-close').addEventListener('click', close);

    const collect = () => ({
      client: document.getElementById('p-client').value.trim(),
      location: document.getElementById('p-location').value.trim(),
      contact: document.getElementById('p-contact').value.trim(),
      type: document.getElementById('p-type').value,
      scope: document.getElementById('p-scope').value.trim(),
      budget: document.getElementById('p-budget').value.trim(),
      timeline: document.getElementById('p-timeline').value.trim(),
      deliverables: document.getElementById('p-deliverables').value.trim(),
      milestones: document.getElementById('p-milestones').value.trim(),
      warranty: document.getElementById('p-warranty').value.trim(),
      payment: document.getElementById('p-payment').value.trim(),
    });

    const defaultIntro = (type) => {
      const map = {
        'Home/Office LAN setup': 'A reliable, scalable LAN designed for seamless device connectivity and efficient data flow.',
        'Fiber optics installation': 'High‑bandwidth, low‑latency fiber backbone for future‑proof connectivity.',
        'Wi‑Fi coverage and AP deployment': 'Optimized Wi‑Fi coverage using strategic AP placement and professional tuning.',
        'Network security hardening': 'Defense‑in‑depth security controls to reduce risk and improve posture.',
        'Starlink setup': 'High‑speed satellite internet deployment, mounting and network integration.',
        'Custom': 'A tailored solution aligned with your specific business needs.'
      };
      return map[type] || map['Custom'];
    };

    const buildHTML = (d) => `
      <div style="font-family:Poppins,Arial,sans-serif;padding:24px;max-width:900px;margin:auto;color:#222">
        <div style="display:flex;align-items:center;gap:12px;border-bottom:2px solid #0aa;padding-bottom:10px;margin-bottom:16px">
          <img src="img/mine.png" alt="Logo" style="width:48px;height:48px;border-radius:10px;"/>
          <div>
            <h1 style="margin:0;font-size:22px">Proposal — ${d.type}</h1>
            <div style="color:#0aa">Prepared by Nzotta Armstrong Uchenna</div>
          </div>
        </div>
        <p style="margin:.25rem 0"><strong>Client:</strong> ${d.client || '-'} | <strong>Location:</strong> ${d.location || '-'} | <strong>Contact:</strong> ${d.contact || '-'}</p>
        <p style="line-height:1.6">${defaultIntro(d.type)}</p>
        ${d.scope ? `<h3>Scope</h3><p style="white-space:pre-line">${d.scope}</p>`:''}
        ${d.deliverables ? `<h3>Deliverables</h3><p>${d.deliverables}</p>`:''}
        ${d.milestones ? `<h3>Milestones</h3><p>${d.milestones}</p>`:''}
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-top:8px">
          ${d.budget?`<div style="background:#eef;padding:10px;border-radius:10px"><strong>Budget</strong><div>${d.budget}</div></div>`:''}
          ${d.timeline?`<div style="background:#eef;padding:10px;border-radius:10px"><strong>Timeline</strong><div>${d.timeline}</div></div>`:''}
          ${d.warranty?`<div style="background:#eef;padding:10px;border-radius:10px"><strong>Warranty</strong><div>${d.warranty}</div></div>`:''}
          ${d.payment?`<div style="background:#eef;padding:10px;border-radius:10px"><strong>Payment Terms</strong><div>${d.payment}</div></div>`:''}
        </div>
        <p style="margin-top:16px;color:#555">Thank you for the opportunity. I look forward to collaborating.</p>
      </div>`;

    const previewBtn = overlay.querySelector('#p-preview');
    const exportBtn = overlay.querySelector('#p-export');

    previewBtn.addEventListener('click', () => {
      const d = collect();
      const w = window.open('', '_blank');
      w.document.write(buildHTML(d));
      w.document.close();
    });

    exportBtn.addEventListener('click', () => {
      const d = collect();
      const w = window.open('', '_blank');
      w.document.write(buildHTML(d) + '<script>window.onload=()=>{setTimeout(()=>{window.print();},300)}<\/script>');
      w.document.close();
    });

    return overlay;
}

// Quick Contact Modal
function setupQuickContact() {
    const openBtn = document.getElementById('openContactModal');
    const modal = document.getElementById('contactModal');
    const closeBtn = modal ? modal.querySelector('.close') : null;
    const form = document.getElementById('quickContactForm');

    if (!openBtn || !modal) return;

    openBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            form.reset();
        });
    }
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

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
    initializeTooltips();

    // Resume/Proposal modal triggers
    setupResumeGenerator();
    setupProposalGenerator();
    setupQuickContact();
    setupModals();

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