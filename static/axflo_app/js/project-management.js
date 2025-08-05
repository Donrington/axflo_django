
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Risk management functionality
        function showRisk(riskId) {
            // Hide all risk contents
            document.querySelectorAll('.risk-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.risk-button').forEach(button => {
                button.classList.remove('active');
            });
            
            // Show selected risk content
            document.getElementById(riskId).classList.add('active');
            
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

        // Advanced parallax effects for project diagrams
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Hero parallax
            const hero = document.querySelector('.project-backdrop');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            // Project diagrams parallax
            document.querySelectorAll('.project-diagram').forEach((diagram, index) => {
                const speed = 0.2 + (index * 0.02);
                const yPos = scrolled * speed;
                const rotation = scrolled * 0.02;
                diagram.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
            });
        });

        // Interactive card effects
        document.querySelectorAll('.pm-service-card, .framework-component, .risk-item').forEach(card => {
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
            const target = element.textContent.replace('%', '').replace('+', '').replace('$', '').replace('B', '');
            const isPercentage = element.textContent.includes('%');
            const isPlus = element.textContent.includes('+');
            const isBillion = element.textContent.includes('B');
            const isDollar = element.textContent.includes('$');
            const targetNum = parseFloat(target);
            const increment = targetNum / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= targetNum) {
                    let finalText = targetNum.toString();
                    if (isDollar) finalText = '$' + finalText;
                    if (isBillion) finalText += 'B';
                    if (isPercentage) finalText += '%';
                    if (isPlus) finalText += '+';
                    element.textContent = finalText;
                    clearInterval(timer);
                } else {
                    let displayValue = isBillion ? (current).toFixed(1) : Math.floor(current);
                    let currentText = displayValue.toString();
                    if (isDollar) currentText = '$' + currentText;
                    if (isBillion) currentText += 'B';
                    if (isPercentage) currentText += '%';
                    if (isPlus) currentText += '+';
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
            
            // Initialize project diagram animations with random delays
            document.querySelectorAll('.project-diagram').forEach((diagram, index) => {
                diagram.style.animationDelay = `${Math.random() * 5}s`;
            });
        });

        // Responsive risk controls
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                document.querySelectorAll('.risk-button').forEach(button => {
                    button.style.fontSize = '0.9rem';
                    button.style.padding = '0.8rem 1.5rem';
                });
            }
        });

        // Phase timeline animation enhancement
        document.querySelectorAll('.lifecycle-phase').forEach((phase, index) => {
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

        // Framework component interaction enhancement
        document.querySelectorAll('.framework-component').forEach(component => {
            component.addEventListener('click', function() {
                // Add ripple effect
                const ripple = document.createElement('div');
                ripple.style.position = 'absolute';
                ripple.style.width = '20px';
                ripple.style.height = '20px';
                ripple.style.background = 'var(--primary-gold)';
                ripple.style.borderRadius = '50%';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 0.6s linear';
                ripple.style.opacity = '0.6';
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    