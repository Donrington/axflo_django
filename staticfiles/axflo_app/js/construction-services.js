
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Project tracker functionality
        function showTracker(trackerId) {
            // Hide all tracker contents
            document.querySelectorAll('.tracker-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.tracker-button').forEach(button => {
                button.classList.remove('active');
            });
            
            // Show selected tracker content
            document.getElementById(trackerId).classList.add('active');
            
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

        // Advanced parallax effects for construction tools
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Hero parallax
            const hero = document.querySelector('.construction-backdrop');
            if (hero) {
                hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
            
            // Construction tools parallax
            document.querySelectorAll('.construction-tool').forEach((tool, index) => {
                const speed = 0.2 + (index * 0.03);
                const yPos = scrolled * speed;
                const rotation = scrolled * 0.03;
                tool.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
            });
        });

        // Interactive card effects
        document.querySelectorAll('.construction-service-card, .safety-standard, .project-item').forEach(card => {
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
            const target = element.textContent.replace('%', '').replace('+', '').replace('M', '');
            const isPercentage = element.textContent.includes('%');
            const isPlus = element.textContent.includes('+');
            const isMillion = element.textContent.includes('M');
            const targetNum = parseFloat(target);
            const increment = targetNum / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= targetNum) {
                    element.textContent = targetNum + (isMillion ? 'M' : '') + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
                    clearInterval(timer);
                } else {
                    const displayValue = isMillion ? (current).toFixed(1) : Math.floor(current);
                    element.textContent = displayValue + (isMillion ? 'M' : '') + (isPercentage ? '%' : '') + (isPlus ? '+' : '');
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
            
            // Initialize construction tool animations with random delays
            document.querySelectorAll('.construction-tool').forEach((tool, index) => {
                tool.style.animationDelay = `${Math.random() * 6}s`;
            });
        });

        // Responsive tracker controls
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 768) {
                document.querySelectorAll('.tracker-button').forEach(button => {
                    button.style.fontSize = '0.9rem';
                    button.style.padding = '0.8rem 1.5rem';
                });
            }
        });

        // Phase timeline animation enhancement
        document.querySelectorAll('.execution-phase').forEach((phase, index) => {
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
    