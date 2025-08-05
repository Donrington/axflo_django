
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Digital operations functionality
        function showDigital(digitalId) {
            // Hide all digital contents
            document.querySelectorAll('.digital-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.digital-button').forEach(button => {
                button.classList.remove('active');
            });
            
            // Show selected digital content
            document.getElementById(digitalId).classList.add('active');
            
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

        // Advanced parallax effects for plant facilities
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Hero parallax
            const hero = document.querySelector('.plant-backdrop');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            // Plant facilities parallax
            document.querySelectorAll('.plant-facility').forEach((facility, index) => {
                const speed = 0.15 + (index * 0.025);
                const yPos = scrolled * speed;
                const rotation = scrolled * 0.025;
                facility.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
            });
        });

        // Interactive card effects
        document.querySelectorAll('.operations-service-card, .excellence-component, .digital-item').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Stats animation observer
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

        // Animate stats when visible
        function animateStatistic(element) {
            const target = element.textContent.replace('%', '').replace('+', '').replace('/', '');
            const isPercentage = element.textContent.includes('%');
            const isPlus = element.textContent.includes('+');
            const isSlash = element.textContent.includes('/');
            const targetNum = parseFloat(target);
            const increment = targetNum / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= targetNum) {
                    let finalText = targetNum.toString();
                    if (isPercentage) finalText += '%';
                    if (isPlus) finalText += '+';
                    if (isSlash) finalText += '/7';
                    element.textContent = finalText;
                    clearInterval(timer);
                } else {
                    let displayValue = Math.floor(current);
                    let currentText = displayValue.toString();
                    if (isPercentage) currentText += '%';
                    if (isPlus) currentText += '+';
                    if (isSlash) currentText += '/7';
                    element.textContent = currentText;
                }
            }, 30);
        }

        // Trigger stats animation when in view
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const figure = entry.target.querySelector('.stat-figure');
                    if (figure && !figure.classList.contains('animated')) {
                        figure.classList.add('animated');
                        animateStatistic(figure);
                    }
                }
            });
        });

        document.querySelectorAll('.stat-block').forEach(item => {
            statsObserver.observe(item);
        });

        // Loading performance optimization
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            
            // Initialize plant facility animations with random delays
            document.querySelectorAll('.plant-facility').forEach((facility, index) => {
                facility.style.animationDelay = `${Math.random() * 6}s`;
            });
        });

        // Responsive digital controls
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                document.querySelectorAll('.digital-button').forEach(button => {
                    button.style.fontSize = '0.9rem';
                    button.style.padding = '0.8rem 1.5rem';
                });
            }
        });

        // Performance phase timeline animation enhancement
        document.querySelectorAll('.performance-phase').forEach((phase, index) => {
            phase.addEventListener('mouseenter', function() {
                const phaseNumber = this.querySelector('.phase-number');
                phaseNumber.style.transform = 'scale(1.1) rotate(5deg)';
                phaseNumber.style.background = 'var(--hover-color)';
            });
            
            phase.addEventListener('mouseleave', function() {
                const phaseNumber = this.querySelector('.phase-number');
                phaseNumber.style.transform = 'scale(1) rotate(0deg)';
                phaseNumber.style.background = 'var(--primary-gold)';
            });
        });

        // Excellence component interaction enhancement
        document.querySelectorAll('.excellence-component').forEach(component => {
            component.addEventListener('click', function() {
                // Add pulse effect
                const pulse = document.createElement('div');
                pulse.style.position = 'absolute';
                pulse.style.width = '15px';
                pulse.style.height = '15px';
                pulse.style.background = 'var(--primary-gold)';
                pulse.style.borderRadius = '50%';
                pulse.style.transform = 'scale(0)';
                pulse.style.animation = 'pulse 0.6s linear';
                pulse.style.opacity = '0.7';
                
                this.style.position = 'relative';
                this.appendChild(pulse);
                
                setTimeout(() => {
                    pulse.remove();
                }, 600);
            });
        });

        // Add pulse animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                to {
                    transform: scale(5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Digital item hover effects
        document.querySelectorAll('.digital-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                const metric = this.querySelector('.digital-metric');
                if (metric) {
                    metric.style.transform = 'scale(1.1)';
                    metric.style.background = 'var(--hover-color)';
                }
            });
            
            item.addEventListener('mouseleave', function() {
                const metric = this.querySelector('.digital-metric');
                if (metric) {
                    metric.style.transform = 'scale(1)';
                    metric.style.background = 'var(--primary-gold)';
                }
            });
        });
    