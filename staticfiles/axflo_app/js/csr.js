
        // Initialize AOS
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });

        // Carousel functionality
        function scrollCarousel(direction) {
            const carousel = document.getElementById('projectCarousel');
            const scrollAmount = 420; // Width of one slide plus gap
            
            if (direction === 'left') {
                carousel.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            } else {
                carousel.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
        }

        // Auto-scroll carousel
        let autoScrollInterval = setInterval(() => {
            const carousel = document.getElementById('projectCarousel');
            const maxScroll = carousel.scrollWidth - carousel.clientWidth;
            
            if (carousel.scrollLeft >= maxScroll) {
                carousel.scrollTo({
                    left: 0,
                    behavior: 'smooth'
                });
            } else {
                scrollCarousel('right');
            }
        }, 5000);

        // Pause auto-scroll on hover
        const carousel = document.getElementById('projectCarousel');
        carousel.addEventListener('mouseenter', () => {
            clearInterval(autoScrollInterval);
        });

        carousel.addEventListener('mouseleave', () => {
            autoScrollInterval = setInterval(() => {
                const maxScroll = carousel.scrollWidth - carousel.clientWidth;
                
                if (carousel.scrollLeft >= maxScroll) {
                    carousel.scrollTo({
                        left: 0,
                        behavior: 'smooth'
                    });
                } else {
                    scrollCarousel('right');
                }
            }, 5000);
        });

        // Smooth scroll for anchor links
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

        // Counter animation for stats
        function animateCounter(element, target) {
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (target >= 1000) {
                    element.textContent = Math.floor(current).toLocaleString() + '+';
                } else {
                    element.textContent = Math.floor(current) + '+';
                }
            }, 20);
        }

        // Intersection Observer for counter animation
        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                    const element = entry.target;
                    const text = element.textContent;
                    let target = 0;
                    
                    if (text.includes('50,000')) target = 50000;
                    else if (text.includes('25')) target = 25;
                    else if (text.includes('150')) target = 150;
                    else if (text.includes('₦2.5B')) target = 2.5;
                    
                    if (target > 0) {
                        element.classList.add('animated');
                        if (text.includes('₦2.5B')) {
                            let current = 0;
                            const timer = setInterval(() => {
                                current += 0.05;
                                if (current >= target) {
                                    current = target;
                                    clearInterval(timer);
                                }
                                element.textContent = '₦' + current.toFixed(1) + 'B+';
                            }, 30);
                        } else {
                            animateCounter(element, target);
                        }
                    }
                }
            });
        }, observerOptions);

        // Observe stat numbers
        document.querySelectorAll('.stat-number').forEach(el => {
            observer.observe(el);
        });
    