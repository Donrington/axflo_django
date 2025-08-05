
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
    


        AOS.init({
          duration: 1000,
          once: true,
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


// Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all fade-in elements
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });

        // Service card hover effects
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });



        // Parallax effect for hero background
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const hero = document.querySelector('.services-hero');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Advanced parallax effect for floating elements
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-element');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        });

        // Enhanced button interactions
        document.querySelectorAll('.cta-button, .service-badge').forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

   
        // Advanced loading animation
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        //    body.classList.add('loaded');
        //     document.querySelector('.loading-animation').style.display = 'none';
        });

        // Initialize on load
        document.addEventListener('DOMContentLoaded', () => {
            // Add stagger delay to service sections
            document.querySelectorAll('.service-section').forEach((section, index) => {
                section.style.transitionDelay = `${index * 0.2}s`;
            });

            // Initialize floating animation with random positions
            document.querySelectorAll('.floating-element').forEach((element, index) => {
                const randomX = Math.random() * 100;
                const randomY = Math.random() * 100;
                element.style.left = `${randomX}%`;
                element.style.top = `${randomY}%`;
                element.style.animationDelay = `${index * 2}s`;
            });
        });

      