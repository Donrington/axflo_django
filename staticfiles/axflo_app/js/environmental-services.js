
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

        document.querySelectorAll('.stat-item').forEach(item => {
            statsObserver.observe(item);
        });

        function animateCounter(element) {
            const text = element.textContent;
            const target = parseInt(text.replace(/[^0-9]/g, ''));
            const isPercentage = text.includes('%');
            const hasPlus = text.includes('+');
            const hasK = text.includes('K');
            const isTime = text.includes('/');
            
            let current = 0;
            const increment = target / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    let finalText = target.toString();
                    if (hasK) finalText += 'K';
                    if (isPercentage) finalText += '%';
                    if (hasPlus) finalText += '+';
                    if (isTime) finalText = '24/7';
                    element.textContent = finalText;
                    clearInterval(timer);
                } else {
                    let displayValue = Math.floor(current);
                    let currentText = displayValue.toString();
                    if (hasK) currentText += 'K';
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
            
            // Environmental backdrop parallax
            const backdrop = document.querySelector('.environmental-backdrop');
            if (backdrop) {
                backdrop.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
            
            // Environmental elements parallax
            document.querySelectorAll('.environmental-element').forEach((element, index) => {
                const speed = 0.1 + (index * 0.02);
                const yPos = scrolled * speed;
                element.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.01}deg)`;
            });
        });

        // Interactive card effects
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
    