
            {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Axflo Oil & Gas Nigeria Limited",
                "url": "https://www.axfloo.com",
                "logo": "https://www.axfloo.com/axflo.png",
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+234 (0) 803 471 6831",
                    "email": "info@axfloo.com",
                    "contactType": "Customer Service"
                },
                "sameAs": [
                    "https://www.facebook.com/axflo",
                    "https://twitter.com/axflo",
                    "https://www.linkedin.com/company/axflo"
                ]
            }
        

 // Enhanced Navigation Toggle with Animation States
      

        console.log('Initializing AOS library');
        AOS.init({
            duration: 1000,
            once: true,
        });



        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM fully loaded and parsed');
        });

 // Function to set dynamic animation delays based on scroll position
 function setScrollBasedDelay() {
            // Get all h2 elements inside .text-content, .news-header, and .job-postings
            const headings = document.querySelectorAll('.text-content h2, .news-header h2, .job-postings h2, .values-header h2, .services-header h2');
            
            headings.forEach((heading) => {
                const spans = heading.querySelectorAll('span');
                
                // Calculate the scroll percentage (between 0 and 1)
                const scrollY = window.scrollY;
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = scrollY / maxScroll;
                
                // Adjust the delay based on the scroll percentage for each span
                spans.forEach((span, index) => {
                    // Dynamically adjust animation delay based on scroll position
                    const delay = (scrollPercent * 2) + (index * 0.1); // Adjust the formula as needed
                    span.style.animationDelay = `${delay}s`;
                });
            });
        }

   // Enhanced scroll animations with Intersection Observer
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                }
            });
        }, observerOptions);

        // Observe animated elements
        document.querySelectorAll('.trusted-title span, .trusted-subtitle, .logos-container').forEach(el => {
            observer.observe(el);
        });

        // Add smooth hover effects for logo items
        document.querySelectorAll('.logo-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-8px) scale(1.05)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Performance optimization for animations
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            document.documentElement.style.setProperty('--transition-smooth', 'none');
            document.documentElement.style.setProperty('--transition-bounce', 'none');
        }




        // Listen for the scroll event and adjust the animation delay
        window.addEventListener('scroll', setScrollBasedDelay);

        // Call the function initially in case the user has already scrolled
        setScrollBasedDelay();

        document.addEventListener('DOMContentLoaded', () => {
    const animatedHeadings = document.querySelectorAll('.animated-heading, .values-header h2');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const spans = entry.target.querySelectorAll('span');
                spans.forEach((span, index) => {
                    span.style.animationDelay = `${0.1 * index}s`;
                    span.classList.add('visible');
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedHeadings.forEach(heading => {
        observer.observe(heading);
    });
});

 // Navigation background change on scroll with link color changes
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a'); // Select all links in nav
    
    if (window.scrollY > 100) {
        // Scrolled state - solid background with black links
        nav.style.background = 'rgba(250, 250, 250, 0.95)';
        nav.style.borderBottom = '1px solid rgba(214, 160, 25, 0.2)';
        
        // Make links black when scrolled
        navLinks.forEach(link => {
            link.style.color = '#000000';
        });
    } else {
        // Top of page - transparent background with white links
        nav.style.background = 'rgba(250, 250, 250, 0.1)';
        nav.style.borderBottom = '1px solid rgba(214, 160, 25, 0.1)';
        
        // Make links white when at top
        navLinks.forEach(link => {
            link.style.color = '#ffffff';
        });
    }
});

 // Enhanced interactions and animations
        document.addEventListener('DOMContentLoaded', function() {
            // Parallax effect for floating icons
            const floatingIcons = document.querySelectorAll('.floating-icon');
            
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                floatingIcons.forEach((icon, index) => {
                    const rate = scrolled * (0.5 + index * 0.1);
                    icon.style.transform = `translateY(${rate}px) rotate(${rate * 0.1}deg)`;
                });
            });

            // Add click interactions for download buttons
            const downloadBtns = document.querySelectorAll('.download-btn');
            downloadBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Add ripple effect
                    const ripple = document.createElement('span');
                    ripple.style.cssText = `
                        position: absolute;
                        background: rgba(255, 255, 255, 0.6);
                        border-radius: 50%;
                        width: 100px;
                        height: 100px;
                        left: 50%;
                        top: 50%;
                        transform: translate(-50%, -50%) scale(0);
                        animation: ripple 0.6s ease-out;
                        pointer-events: none;
                    `;
                    
                    this.style.position = 'relative';
                    this.style.overflow = 'hidden';
                    this.appendChild(ripple);
                    
                    setTimeout(() => ripple.remove(), 600);
                    
                    // Simulate download
                    console.log('Downloading certificate...');
                });
            });

            // Add hover effects for certification cards
            const certCards = document.querySelectorAll('.certification-card');
            certCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                });
            });
        });

        // Add CSS for ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: translate(-50%, -50%) scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

   // Enhanced Back to Top functionality with progress indicator
        const backToTopBtn = document.getElementById('backToTop');
        const progressRing = document.querySelector('.progress-ring-circle');
        const circumference = 2 * Math.PI * 28; // radius = 28

        progressRing.style.strokeDasharray = circumference;
        progressRing.style.strokeDashoffset = circumference;

        function updateScrollProgress() {
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            const scrollCurrent = window.pageYOffset;
            const scrollPercentage = scrollCurrent / scrollTotal;
            
            const offset = circumference - (scrollPercentage * circumference);
            progressRing.style.strokeDashoffset = offset;

            // Show/hide button based on scroll position
            if (scrollCurrent > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        function scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }

        // Throttled scroll listener for better performance
        let ticking = false;
        function handleScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateScrollProgress();
                    ticking = false;
                });
                ticking = true;
            }
        }

        window.addEventListener('scroll', handleScroll);
        
        // Newsletter form handling
        document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                // Add your newsletter subscription logic here
                alert('Thank you for subscribing!');
                this.querySelector('input[type="email"]').value = '';
            }
        });



    