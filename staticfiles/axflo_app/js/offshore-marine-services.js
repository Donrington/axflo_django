
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Dashboard functionality
        function showDashboard(dashboardId) {
            // Hide all dashboard contents
            document.querySelectorAll('.dashboard-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.dashboard-button').forEach(button => {
                button.classList.remove('active');
            });
            
            // Show selected dashboard content
            document.getElementById(dashboardId).classList.add('active');
            
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

        // Advanced parallax effects for marine vessels
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Ocean backdrop parallax
            const ocean = document.querySelector('.ocean-backdrop');
            if (ocean) {
                ocean.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
            
            // Marine vessels parallax with wave-like motion
            document.querySelectorAll('.marine-vessel').forEach((vessel, index) => {
                const speed = 0.1 + (index * 0.02);
                const yPos = scrolled * speed;
                const waveMotion = Math.sin(scrolled * 0.01 + index) * 10;
                vessel.style.transform = `translateY(${yPos + waveMotion}px) rotate(${scrolled * 0.02}deg)`;
            });
        });

        // Interactive card effects with marine theme
        document.querySelectorAll('.service-card-marine, .subsea-tech-card, .dashboard-item').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = this.classList.contains('service-card-marine') 
                    ? 'translateY(-15px) rotateY(5deg) scale(1.02)' 
                    : 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotateY(0deg) scale(1)';
            });
        });

        // Depth layer visibility observer
        const depthObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.depth-layer').forEach(layer => {
            depthObserver.observe(layer);
        });

        // Animate stats when visible
        function animateStatistic(element) {
            const target = element.textContent.replace('m+', '').replace('+', '').replace('%', '').replace('/', '');
            const isMeters = element.textContent.includes('m+');
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
                    if (isMeters) finalText += 'm+';
                    else if (isPercentage) finalText += '%';
                    else if (isPlus) finalText += '+';
                    else if (isSlash) finalText += '/7';
                    element.textContent = finalText;
                    clearInterval(timer);
                } else {
                    let displayValue = Math.floor(current);
                    let currentText = displayValue.toString();
                    if (isMeters) currentText += 'm+';
                    else if (isPercentage) currentText += '%';
                    else if (isPlus) currentText += '+';
                    else if (isSlash) currentText += '/7';
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

        document.querySelectorAll('.stat-hexagon').forEach(item => {
            statsObserver.observe(item);
        });

        // Loading performance optimization
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            
            // Initialize marine vessel animations with staggered delays
            document.querySelectorAll('.marine-vessel').forEach((vessel, index) => {
                vessel.style.animationDelay = `${index * 2 + Math.random() * 3}s`;
            });
        });

        // Responsive dashboard controls
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                document.querySelectorAll('.dashboard-button').forEach(button => {
                    button.style.fontSize = '0.9rem';
                    button.style.padding = '0.8rem 1.5rem';
                });
            }
        });

        // Depth indicator hover effects
        document.querySelectorAll('.depth-indicator').forEach(indicator => {
            indicator.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 15px 40px rgba(64, 164, 223, 0.6)';
            });
            
            indicator.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 10px 30px rgba(64, 164, 223, 0.4)';
            });
        });

        // Marine service icon rotation on hover
        document.querySelectorAll('.marine-service-icon').forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'rotate(360deg) scale(1.1)';
            });
            
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'rotate(0deg) scale(1)';
            });
        });

        // Wave animation enhancement
        const waves = document.querySelectorAll('.wave');
        waves.forEach((wave, index) => {
            wave.style.animationDelay = `${index * 2}s`;
        });

        // Dashboard metric pulse effect
        document.querySelectorAll('.dashboard-metric').forEach(metric => {
            setInterval(() => {
                metric.style.animation = 'none';
                metric.offsetHeight; // Trigger reflow
                metric.style.animation = 'pulse 1s ease-in-out';
            }, 3000 + Math.random() * 2000);
        });

        // Add pulse animation for metrics
        const metricStyle = document.createElement('style');
        metricStyle.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(metricStyle);
    