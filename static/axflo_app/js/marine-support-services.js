
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
                content.style.display = 'none';
                content.classList.remove('active');
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.dashboard-button').forEach(button => {
                button.style.background = 'transparent';
                button.style.borderColor = 'var(--border-glass)';
                button.classList.remove('active');
            });
            
            // Show selected dashboard content
            const selectedContent = document.getElementById(dashboardId);
            if (selectedContent) {
                selectedContent.style.display = 'block';
                selectedContent.classList.add('active');
            }
            
            // Add active class to clicked button
            event.target.style.background = 'linear-gradient(135deg, var(--primary-gold) 0%, #40a4df 100%)';
            event.target.style.borderColor = 'var(--primary-gold)';
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
        document.querySelectorAll('.service-card-marine').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-15px) rotateY(5deg) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotateY(0deg) scale(1)';
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

        // Loading performance optimization
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            
            // Initialize marine vessel animations with staggered delays
            document.querySelectorAll('.marine-vessel').forEach((vessel, index) => {
                vessel.style.animationDelay = `${index * 2 + Math.random() * 3}s`;
            });
        });
    