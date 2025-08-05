// QSHE Page JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Tab Navigation Functionality
    const navTabs = document.querySelectorAll('.nav-tab');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Add click event listeners to navigation tabs
    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            
            // Remove active class from all tabs and sections
            navTabs.forEach(t => t.classList.remove('active'));
            contentSections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Show corresponding content section
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // Smooth scroll to content section
                setTimeout(() => {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
            
            // Update URL hash
            window.history.pushState(null, null, `#${targetId}`);
        });
    });
    
    // Handle page load with hash
    function handleHashNavigation() {
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetTab = document.querySelector(`[data-target="${hash}"]`);
            if (targetTab) {
                targetTab.click();
            }
        }
    }
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', handleHashNavigation);
    
    // Check for hash on page load
    handleHashNavigation();
    
    // Hero Title Animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const spans = heroTitle.querySelectorAll('span');
        spans.forEach((span, index) => {
            span.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    // Certificate Modal Functionality
    window.viewCertificate = function(certType) {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            transform: scale(0.8);
            transition: transform 0.3s ease;
        `;
        
        // Certificate details based on type
        const certDetails = {
            'ISO9001': {
                title: 'ISO 9001:2015 Quality Management Systems',
                description: 'This certification demonstrates our systematic approach to quality management, ensuring consistent delivery of products and services that meet customer and regulatory requirements.',
                scope: 'Oil & Gas Operations, Engineering Services, Project Management',
                certBody: 'International Certification Agency',
                validUntil: 'December 2027',
                benefits: [
                    'Enhanced customer satisfaction',
                    'Improved operational efficiency',
                    'Consistent quality delivery',
                    'Continuous improvement culture',
                    'Risk-based thinking approach'
                ]
            },
            'ISO14001': {
                title: 'ISO 14001:2015 Environmental Management Systems',
                description: 'This certification validates our commitment to environmental protection and sustainable business practices through systematic environmental management.',
                scope: 'Environmental Services, Waste Management, Oil Spill Response',
                certBody: 'International Certification Agency',
                validUntil: 'December 2027',
                benefits: [
                    'Reduced environmental impact',
                    'Compliance with regulations',
                    'Resource efficiency',
                    'Waste reduction',
                    'Stakeholder confidence'
                ]
            }
        };
        
        const cert = certDetails[certType];
        
        modalContent.innerHTML = `
            <button class="modal-close" style="
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            " onmouseover="this.style.background='#f0f0f0'" onmouseout="this.style.background='none'">×</button>
            
            <div style="text-align: center; margin-bottom: 2rem;">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: var(--accent-glow);
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: var(--primary-gold);
                    margin: 0 auto 1rem;
                ">ISO</div>
                <h2 style="color: var(--text-primary); margin-bottom: 0.5rem;">${cert.title}</h2>
                <div style="
                    padding: 0.5rem 1rem;
                    background: rgba(34, 197, 94, 0.1);
                    color: #22c55e;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    display: inline-block;
                ">Active</div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <p style="color: var(--text-secondary); line-height: 1.6;">${cert.description}</p>
            </div>
            
            <div style="display: grid; gap: 1rem; margin-bottom: 2rem;">
                <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(214, 160, 25, 0.1);">
                    <span style="font-weight: 600; color: var(--text-primary);">Certification Body:</span>
                    <span style="color: var(--text-secondary);">${cert.certBody}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid rgba(214, 160, 25, 0.1);">
                    <span style="font-weight: 600; color: var(--text-primary);">Valid Until:</span>
                    <span style="color: var(--text-secondary);">${cert.validUntil}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 0.75rem 0;">
                    <span style="font-weight: 600; color: var(--text-primary);">Scope:</span>
                    <span style="color: var(--text-secondary);">${cert.scope}</span>
                </div>
            </div>
            
            <div style="margin-bottom: 2rem;">
                <h4 style="font-weight: 600; color: var(--text-primary); margin-bottom: 1rem;">Key Benefits:</h4>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${cert.benefits.map(benefit => `
                        <li style="
                            padding: 0.5rem 0;
                            color: var(--text-secondary);
                            position: relative;
                            padding-left: 1.5rem;
                        ">
                            <span style="
                                position: absolute;
                                left: 0;
                                color: var(--primary-gold);
                                font-weight: bold;
                            ">✓</span>
                            ${benefit}
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="/static/axflo_app/certificates/${certType}.pdf" target="_blank" style="
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: var(--primary-gold);
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 25px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                " onmouseover="this.style.background='var(--primary-gold-light)'; this.style.transform='translateY(-2px)'" onmouseout="this.style.background='var(--primary-gold)'; this.style.transform='translateY(0)'">
                    <i class="fas fa-download"></i>
                    Download Certificate
                </a>
            </div>
        `;
        
        // Close modal functionality
        const closeModal = () => {
            modalOverlay.style.opacity = '0';
            modalContent.style.transform = 'scale(0.8)';
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
            }, 300);
        };
        
        modalContent.querySelector('.modal-close').addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
        
        // ESC key to close modal
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', handleEscKey);
            }
        };
        document.addEventListener('keydown', handleEscKey);
        
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        
        // Animate modal in
        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modalContent.style.transform = 'scale(1)';
        }, 10);
    };
    
    // Policy card hover effects
    const policyCards = document.querySelectorAll('.policy-card');
    policyCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Certification card hover effects
    const certCards = document.querySelectorAll('.certification-card');
    certCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.policy-card, .certification-card, .standard-item, .protocol-card, .metric-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Counter animation for stats
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number, .metric-value');
        counters.forEach(counter => {
            const target = counter.textContent;
            const isNumber = !isNaN(target.replace(/[^0-9]/g, ''));
            
            if (isNumber) {
                const finalNumber = parseInt(target.replace(/[^0-9]/g, ''));
                const increment = finalNumber / 100;
                let current = 0;
                
                const updateCounter = () => {
                    if (current < finalNumber) {
                        current += increment;
                        counter.textContent = target.replace(/[0-9]+/, Math.ceil(current));
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                // Start animation when element is visible
                const counterObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            updateCounter();
                            counterObserver.unobserve(entry.target);
                        }
                    });
                });
                
                counterObserver.observe(counter);
            }
        });
    };
    
    animateCounters();
    
    // Download button ripple effect
    const downloadBtns = document.querySelectorAll('.btn-download, .btn-primary');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.4);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // Parallax effect for floating elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const floatingElements = document.querySelectorAll('.floating-element');
        
        floatingElements.forEach((element, index) => {
            const rate = scrolled * (0.5 + index * 0.1);
            element.style.transform = `translateY(${rate}px) rotate(${rate * 0.1}deg)`;
        });
    });
    
    // Back to top button functionality (if exists)
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        const progressRing = document.querySelector('.progress-ring-circle');
        const circumference = 2 * Math.PI * 28;
        
        if (progressRing) {
            progressRing.style.strokeDasharray = circumference;
            progressRing.style.strokeDashoffset = circumference;
        }
        
        const updateScrollProgress = () => {
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            const scrollCurrent = window.pageYOffset;
            const scrollPercentage = scrollCurrent / scrollTotal;
            
            if (progressRing) {
                const offset = circumference - (scrollPercentage * circumference);
                progressRing.style.strokeDashoffset = offset;
            }
            
            if (scrollCurrent > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        };
        
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        
        // Scroll to top function
        window.scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
    }
    
    // Performance optimization for animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (prefersReducedMotion.matches) {
        // Disable animations for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }
});

// Mobile navigation functions (if needed)
function toggleNav() {
    const mobileNav = document.querySelector('.mobile-nav');
    const overlay = document.querySelector('.overlay');
    const toggleBtn = document.querySelector('.toggle-btn');
    
    if (mobileNav && overlay && toggleBtn) {
        mobileNav.classList.toggle('active');
        overlay.classList.toggle('active');
        toggleBtn.classList.toggle('active');
    }
}

function toggleMobileDropdown(event, dropdownId) {
    event.preventDefault();
    const dropdown = document.getElementById(dropdownId);
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}