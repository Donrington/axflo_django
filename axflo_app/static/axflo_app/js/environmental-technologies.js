
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });

        // Animate stats when visible
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber && !statNumber.classList.contains('animated')) {
                        statNumber.classList.add('animated');
                        animateCounter(statNumber);
                    }
                }
            });
        });

        document.querySelectorAll('.innovation-stat').forEach(item => {
            statsObserver.observe(item);
        });

        function animateCounter(element) {
            const text = element.textContent;
            const target = parseInt(text.replace(/[^0-9]/g, ''));
            const isPercentage = text.includes('%');
            const hasPlus = text.includes('+');
            const isTime = text.includes('/');
            
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    let finalText = target.toString();
                    if (isPercentage) finalText += '%';
                    if (hasPlus) finalText += '+';
                    if (isTime) finalText = '24/7';
                    element.textContent = finalText;
                    clearInterval(timer);
                } else {
                    let displayValue = Math.floor(current);
                    let currentText = displayValue.toString();
                    if (isPercentage) currentText += '%';
                    if (hasPlus) currentText += '+';
                    if (isTime) currentText = Math.floor(current) + '/7';
                    element.textContent = currentText;
                }
            }, 30);
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

        // Enhanced parallax effects
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Technology backdrop parallax
            const backdrop = document.querySelector('.technology-backdrop');
            if (backdrop) {
                backdrop.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
            
            // Tech elements parallax with mechanical motion
            document.querySelectorAll('.tech-element').forEach((element, index) => {
                const speed = 0.1 + (index * 0.015);
                const yPos = scrolled * speed;
                const mechanicalMotion = Math.sin(scrolled * 0.005 + index) * 15;
                element.style.transform = `translateY(${yPos + mechanicalMotion}px) rotate(${scrolled * 0.008}deg)`;
            });
        });

        // Interactive card effects
        document.querySelectorAll('.tech-card, .gallery-item').forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (this.classList.contains('tech-card')) {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                } else {
                    this.style.transform = 'translateY(-5px)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Gallery item click effect
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                // Add click animation
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-5px)';
                }, 150);
            });
        });
    