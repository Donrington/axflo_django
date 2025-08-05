


      AOS.init({
        duration: 1000,
        once: true,
      });



  // Smooth scrolling for navigation links
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

        // Scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
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
        // Parallax effect for background orbs
        // window.addEventListener('scroll', () => {
        //     const scrolled = window.pageYOffset;
        //     const parallax = scrolled * 0.5;
            
        //     document.querySelector('.orb-1').style.transform = `translate(${parallax * 0.3}px, ${parallax * 0.2}px)`;
        //     document.querySelector('.orb-2').style.transform = `translate(${-parallax * 0.2}px, ${parallax * 0.4}px)`;
        //     document.querySelector('.orb-3').style.transform = `translate(${parallax * 0.1}px, ${-parallax * 0.3}px)`;
        // });

        // Add stagger animation delay to cards
        document.querySelectorAll('.glass-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
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




    