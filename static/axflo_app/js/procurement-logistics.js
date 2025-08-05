
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
    document.querySelectorAll('.control-button').forEach(button => {
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

// Advanced parallax effects for network nodes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Hero parallax
    const hero = document.querySelector('.supply-chain-background');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    // Network nodes parallax
    document.querySelectorAll('.network-node').forEach((node, index) => {
        const speed = 0.2 + (index * 0.05);
        const yPos = scrolled * speed;
        const rotation = scrolled * 0.05;
        node.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
    });
});

// Interactive card effects
document.querySelectorAll('.procurement-service-card, .vendor-category, .metric-widget').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Metric animation observer
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

// Updated animate metric function to handle different value types
function animateMetric(element) {
    const originalText = element.textContent.trim();
    
    // Check if the text contains numbers that can be animated
    const numberMatch = originalText.match(/(\d+)/);
    
    if (numberMatch) {
        const targetNum = parseInt(numberMatch[1]);
        const isPercentage = originalText.includes('%');
        const isPlus = originalText.includes('+');
        const prefix = originalText.split(numberMatch[1])[0];
        const suffix = originalText.split(numberMatch[1])[1];
        
        const increment = Math.max(1, targetNum / 30); // Ensure at least 1 increment
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNum) {
                element.textContent = prefix + targetNum + suffix;
                clearInterval(timer);
            } else {
                element.textContent = prefix + Math.floor(current) + suffix;
            }
        }, 50);
    } else {
        // For text-only values, add a subtle fade-in animation
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Trigger metric animation when in view
const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const value = entry.target.querySelector('.metric-value, .widget-value');
            if (value && !value.classList.contains('animated')) {
                value.classList.add('animated');
                animateMetric(value);
            }
        }
    });
});

document.querySelectorAll('.metric-card, .metric-widget').forEach(item => {
    metricObserver.observe(item);
});

// Enhanced card hover effects for service cards
document.querySelectorAll('.procurement-service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.procurement-icon i');
        if (icon) {
            icon.style.transform = 'rotate(360deg) scale(1.1)';
            icon.style.transition = 'transform 0.6s ease';
        }
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.procurement-icon i');
        if (icon) {
            icon.style.transform = 'rotate(0deg) scale(1)';
        }
    });
});

// Network node floating animation
function animateNetworkNodes() {
    document.querySelectorAll('.network-node').forEach((node, index) => {
        const floatY = Math.sin(Date.now() * 0.001 + index) * 10;
        const floatX = Math.cos(Date.now() * 0.0008 + index) * 5;
        node.style.transform += ` translate(${floatX}px, ${floatY}px)`;
    });
    
    requestAnimationFrame(animateNetworkNodes);
}

// Staggered animation for vendor categories
function animateVendorCategories() {
    const categories = document.querySelectorAll('.vendor-category');
    categories.forEach((category, index) => {
        category.style.animationDelay = `${index * 0.1}s`;
        category.classList.add('fade-in-up');
    });
}

// Timeline step reveal animation
function animateTimelineSteps() {
    const steps = document.querySelectorAll('.timeline-step');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });
    
    steps.forEach(step => {
        timelineObserver.observe(step);
    });
}

// Loading performance optimization
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // Initialize network node animations with random delays
    document.querySelectorAll('.network-node').forEach((node, index) => {
        node.style.animationDelay = `${Math.random() * 5}s`;
    });
    
    // Start floating animation
    animateNetworkNodes();
    
    // Initialize other animations
    animateVendorCategories();
    animateTimelineSteps();
});

// Responsive dashboard controls
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.control-button').forEach(button => {
            button.style.fontSize = '0.9rem';
            button.style.padding = '0.8rem 1.5rem';
        });
    } else {
        document.querySelectorAll('.control-button').forEach(button => {
            button.style.fontSize = '';
            button.style.padding = '';
        });
    }
});

// Additional scroll animations for procurement cards
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.procurement-service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    cardObserver.observe(card);
});

// Dashboard button enhancement
document.querySelectorAll('.control-button').forEach(button => {
    button.addEventListener('click', function() {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});
    