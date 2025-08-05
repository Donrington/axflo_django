
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Verification dashboard functionality
        function showVerification(verificationId) {
            // Hide all verification contents
            document.querySelectorAll('.verification-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.verification-button').forEach(button => {
                button.classList.remove('active');
            });
            
            // Show selected verification content
            document.getElementById(verificationId).classList.add('active');
            
            // Add active class to clicked button
            event.target.classList.add('active');
        }

        // Smooth scrolling for internal links
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

        // Advanced parallax effects for precision components
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Hero parallax
            const hero = document.querySelector('.precision-backdrop');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.2}px)`;
            }
            
            // Precision components parallax with rotation
            document.querySelectorAll('.precision-component').forEach((component, index) => {
                const speed = 0.15 + (index * 0.02);
                const yPos = scrolled * speed;
                const rotation = scrolled * 0.02 * (index + 1);
                component.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
            });
            
            // Grid movement
            const grid = document.querySelector('.precision-grid');
            if (grid) {
                const gridOffset = scrolled * 0.1;
                grid.style.transform = `translate(${gridOffset}px, ${gridOffset}px)`;
            }
        });

        // Interactive card effects with enhanced animations
        document.querySelectorAll('.installation-service-card, .equipment-category, .verification-widget').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-12px) rotateX(5deg) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotateX(0deg) scale(1)';
            });
        });

        // Metrics animation observer
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

        // Animate metrics when visible
        function animateMetric(element) {
            const target = element.textContent.replace('%', '').replace('+', '').replace('hrs', '');
            const isPercentage = element.textContent.includes('%');
            const isPlus = element.textContent.includes('+');
            const isHours = element.textContent.includes('hrs');
            const targetNum = parseFloat(target);
            const increment = targetNum / 60;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= targetNum) {
                    element.textContent = targetNum + (isHours ? 'hrs' : '') + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
                    clearInterval(timer);
                } else {
                    const displayValue = isHours ? Math.floor(current) : current.toFixed(1);
                    element.textContent = displayValue + (isHours ? 'hrs' : '') + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
                }
            }, 25);
        }

        // Trigger metric animation when in view
        const metricObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const value = entry.target.querySelector('.metric-value, .widget-value');
                    if (value && !value.classList.contains('animated')) {
                        value.classList.add('animated');
                        animateMetric(value);
                    }
                }
            });
        });

        document.querySelectorAll('.metric-precision, .verification-widget').forEach(item => {
            metricObserver.observe(item);
        });

        // Integration step hover effects
        document.querySelectorAll('.integration-step').forEach((step, index) => {
            step.addEventListener('mouseenter', function() {
                const stepNumber = this.querySelector('.step-number');
                stepNumber.style.transform = 'scale(1.2) rotate(10deg)';
                stepNumber.style.background = 'linear-gradient(45deg, var(--hover-color), var(--primary-gold-light))';
            });
            
            step.addEventListener('mouseleave', function() {
                const stepNumber = this.querySelector('.step-number');
                stepNumber.style.transform = 'scale(1) rotate(0deg)';
                stepNumber.style.background = 'linear-gradient(45deg, var(--primary-gold), var(--hover-color))';
            });
        });

        // Loading performance optimization
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            
            // Initialize precision component animations with random delays
            document.querySelectorAll('.precision-component').forEach((component, index) => {
                component.style.animationDelay = `${Math.random() * 8}s`;
            });
            
            // Enhanced CTA button animation
            const ctaButtons = document.querySelectorAll('.installation-cta, .cta-action');
            ctaButtons.forEach(button => {
                button.addEventListener('mouseenter', function() {
                    this.style.boxShadow = '0 25px 50px rgba(214, 160, 25, 0.5)';
                });
                
                button.addEventListener('mouseleave', function() {
                    this.style.boxShadow = '0 10px 30px rgba(214, 160, 25, 0.3)';
                });
            });
        });

        // Responsive verification controls
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                document.querySelectorAll('.verification-button').forEach(button => {
                    button.style.fontSize = '0.9rem';
                    button.style.padding = '1rem 2rem';
                });
            }
        });

        // Equipment category interaction enhancement
        document.querySelectorAll('.equipment-category').forEach(category => {
            category.addEventListener('click', function() {
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-8px) rotateY(2deg)';
                }, 150);
            });
        });
    