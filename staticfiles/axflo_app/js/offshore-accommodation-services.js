
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

        // Advanced parallax effects for accommodation facilities
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Ocean backdrop parallax
            const ocean = document.querySelector('.ocean-backdrop');
            if (ocean) {
                ocean.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
            
            // Accommodation facilities parallax with gentle motion
            document.querySelectorAll('.accommodation-facility').forEach((facility, index) => {
                const speed = 0.1 + (index * 0.02);
                const yPos = scrolled * speed;
                const gentleMotion = Math.sin(scrolled * 0.008 + index) * 8;
                facility.style.transform = `translateY(${yPos + gentleMotion}px) rotate(${scrolled * 0.01}deg)`;
            });
        });

        // Interactive card effects
        document.querySelectorAll('.service-card-accommodation, .facility-card, .standard-item').forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (this.classList.contains('service-card-accommodation')) {
                    this.style.transform = 'translateY(-15px) rotateY(5deg) scale(1.02)';
                } else {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotateY(0deg) scale(1)';
            });
        });

        // Accommodation service icon rotation on hover
        document.querySelectorAll('.accommodation-service-icon, .facility-icon, .standard-icon').forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'rotate(360deg) scale(1.1)';
            });
            
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'rotate(0deg) scale(1)';
            });
        });

        // Loading performance optimization
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            
            // Initialize accommodation facility animations with staggered delays
            document.querySelectorAll('.accommodation-facility').forEach((facility, index) => {
                facility.style.animationDelay = `${index * 3 + Math.random() * 2}s`;
            });
        });

        // Metric animation when visible
        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const metric = entry.target;
                    metric.style.animation = 'pulse 1.5s ease-in-out infinite';
                }
            });
        });

        document.querySelectorAll('.standard-metric').forEach(metric => {
            metricsObserver.observe(metric);
        });

        // Add pulse animation for metrics
        const metricStyle = document.createElement('style');
        metricStyle.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
            }
        `;
        document.head.appendChild(metricStyle);
    