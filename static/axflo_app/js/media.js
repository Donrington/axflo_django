
        // Initialize AOS
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });

        // Newsletter form submission
        document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.querySelector('.newsletter-input').value;
            
            if (email) {
                // Show success message
                alert('Thank you for subscribing! You will receive updates on our latest environmental protection initiatives.');
                document.querySelector('.newsletter-input').value = '';
            }
        });

        // Add intersection observer for additional animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.fade-in-up, .scale-in').forEach(el => {
            observer.observe(el);
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

        // Dynamic background animation
        function createFloatingElement() {
            const element = document.createElement('div');
            element.className = 'floating-element';
            element.style.left = Math.random() * 100 + '%';
            element.style.animationDuration = (Math.random() * 10 + 15) + 's';
            element.style.animationDelay = Math.random() * 5 + 's';
            
            document.querySelector('.floating-elements').appendChild(element);
            
            setTimeout(() => {
                element.remove();
            }, 25000);
        }

        // Create floating elements periodically
        setInterval(createFloatingElement, 3000);
    