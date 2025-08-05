
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

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

        // Enhanced scroll effects
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Hero parallax
            const backdrop = document.querySelector('.planning-backdrop');
            if (backdrop) {
                backdrop.style.transform = `translateY(${scrolled * 0.15}px)`;
            }
            
            // Planning nodes parallax
            document.querySelectorAll('.planning-node').forEach((node, index) => {
                const speed = 0.08 + (index * 0.02);
                const yPos = scrolled * speed;
                const rotation = scrolled * 0.05 * (index + 1);
                node.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
            });
            
            // Grid lines effect
            document.querySelectorAll('.grid-line').forEach((line, index) => {
                const offset = scrolled * 0.1 * (index + 1);
                line.style.transform = `translateX(${offset}px)`;
            });
        });

        // Enhanced card interactions
        document.querySelectorAll('.preparedness-service-card, .preparedness-component, .metric-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Metrics animation
        const metricObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const value = entry.target.querySelector('.metric-number, .metric-letter');
                    if (value && !value.classList.contains('animated')) {
                        value.classList.add('animated');
                        animateMetric(value);
                    }
                }
            });
        });

        function animateMetric(element) {
            const originalText = element.textContent.trim();
            const numberMatch = originalText.match(/(\d+(?:\.\d+)?)/);
            
            if (numberMatch) {
                const targetNum = parseFloat(numberMatch[1]);
                const prefix = originalText.split(numberMatch[1])[0];
                const suffix = originalText.split(numberMatch[1])[1];
                const increment = targetNum > 100 ? Math.max(1, targetNum / 50) : targetNum / 60;
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= targetNum) {
                        element.textContent = prefix + targetNum + suffix;
                        clearInterval(timer);
                    } else {
                        const displayValue = targetNum > 10 ? Math.floor(current) : current.toFixed(1);
                        element.textContent = prefix + displayValue + suffix;
                    }
                }, 40);
            } else {
                // Text-only animation
                const text = originalText;
                element.textContent = '';
                element.style.opacity = '0';
                
                setTimeout(() => {
                    element.style.transition = 'opacity 0.6s ease';
                    element.style.opacity = '1';
                    
                    let charIndex = 0;
                    const typeTimer = setInterval(() => {
                        if (charIndex < text.length) {
                            element.textContent = text.substring(0, charIndex + 1);
                            charIndex++;
                        } else {
                            clearInterval(typeTimer);
                        }
                    }, 50);
                }, 200);
            }
        }

        document.querySelectorAll('.metric-card').forEach(item => {
            metricObserver.observe(item);
        });

        // Process stage interactions
        document.querySelectorAll('.process-stage').forEach((stage, index) => {
            stage.addEventListener('mouseenter', function() {
                const icon = this.querySelector('.stage-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                    icon.style.transition = 'transform 0.3s ease';
                }
            });
            
            stage.addEventListener('mouseleave', function() {
                const icon = this.querySelector('.stage-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });

        // Loading optimization
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            
            // Initialize planning node animations
            document.querySelectorAll('.planning-node').forEach((node, index) => {
                node.style.animationDelay = `${Math.random() * 8}s`;
            });
        });
    