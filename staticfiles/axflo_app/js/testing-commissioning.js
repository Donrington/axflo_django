
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

      // Compliance dashboard functionality
function showCompliance(complianceId) {
    // Hide all compliance contents
    document.querySelectorAll('.compliance-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.compliance-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Show selected compliance content
    document.getElementById(complianceId).classList.add('active');
    
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

// Advanced parallax effects for validation nodes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Hero parallax
    const hero = document.querySelector('.validation-backdrop');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.2}px)`;
    }
    
    // Validation nodes parallax with rotation
    document.querySelectorAll('.validation-node').forEach((node, index) => {
        const speed = 0.1 + (index * 0.02);
        const yPos = scrolled * speed;
        const rotation = scrolled * 0.03 * (index + 1);
        node.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
    });
    
    // Matrix lines effect
    document.querySelectorAll('.matrix-line').forEach((line, index) => {
        const offset = scrolled * 0.1 * (index + 1);
        line.style.transform = `translateX(${offset}px)`;
    });
});

// Interactive card effects with enhanced animations
document.querySelectorAll('.testing-service-card, .protocol-category, .compliance-widget').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02) rotateX(2deg)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1) rotateX(0deg)';
    });
});

// Metrics animation observer
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
    const numberMatch = originalText.match(/(\d+(?:\.\d+)?)/);
    
    if (numberMatch) {
        const targetNum = parseFloat(numberMatch[1]);
        const isPercentage = originalText.includes('%');
        const isPlus = originalText.includes('+');
        const prefix = originalText.split(numberMatch[1])[0];
        const suffix = originalText.split(numberMatch[1])[1];
        
        // Determine appropriate increment based on number size
        const increment = targetNum > 100 ? Math.max(1, targetNum / 50) : targetNum / 60;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNum) {
                // Preserve original formatting
                const finalValue = targetNum % 1 === 0 ? targetNum.toString() : targetNum.toFixed(2);
                element.textContent = prefix + finalValue + suffix;
                clearInterval(timer);
            } else {
                // Display appropriate precision during animation
                const displayValue = targetNum > 10 ? Math.floor(current).toString() : current.toFixed(1);
                element.textContent = prefix + displayValue + suffix;
            }
        }, 40);
    } else {
        // For text-only values, add a smooth fade-in with typewriter effect
        const text = originalText;
        element.textContent = '';
        element.style.opacity = '0';
        element.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            
            // Typewriter effect for text values
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

// Trigger metric animation when in view
const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const value = entry.target.querySelector('.metric-number, .widget-value');
            if (value && !value.classList.contains('animated')) {
                value.classList.add('animated');
                animateMetric(value);
            }
        }
    });
});

document.querySelectorAll('.metric-validation, .compliance-widget').forEach(item => {
    metricObserver.observe(item);
});

// Enhanced QA phase hover effects
document.querySelectorAll('.qa-phase').forEach((phase, index) => {
    phase.addEventListener('mouseenter', function() {
        const phaseIcon = this.querySelector('.phase-icon');
        if (phaseIcon) {
            phaseIcon.style.transform = 'scale(1.2) rotate(10deg)';
            phaseIcon.style.transition = 'transform 0.3s ease';
        }
        
        // Add glow effect to the entire phase
        this.style.boxShadow = '0 10px 30px rgba(255, 193, 7, 0.3)';
        this.style.transition = 'all 0.3s ease';
    });
    
    phase.addEventListener('mouseleave', function() {
        const phaseIcon = this.querySelector('.phase-icon');
        if (phaseIcon) {
            phaseIcon.style.transform = 'scale(1) rotate(0deg)';
        }
        
        this.style.boxShadow = '';
    });
});

// Testing service card hover enhancements
document.querySelectorAll('.testing-service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.testing-icon i');
        if (icon) {
            icon.style.transform = 'scale(1.2) rotate(15deg)';
            icon.style.transition = 'transform 0.4s ease';
        }
        
        // Add subtle background gradient animation
        this.style.background = 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.testing-icon i');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
        
        this.style.background = '';
    });
});

// Protocol category interaction enhancement
document.querySelectorAll('.protocol-category').forEach(category => {
    category.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.protocol-icon i');
        if (icon) {
            icon.style.transform = 'rotateY(180deg) scale(1.1)';
            icon.style.transition = 'transform 0.5s ease';
        }
    });
    
    category.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.protocol-icon i');
        if (icon) {
            icon.style.transform = 'rotateY(0deg) scale(1)';
        }
    });
    
    category.addEventListener('click', function() {
        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'translateY(-10px) rotateX(5deg)';
        }, 150);
    });
});

// Validation status blinking enhancement
function initializeValidationNodes() {
    document.querySelectorAll('.validation-status').forEach((status, index) => {
        const delay = Math.random() * 3000;
        setTimeout(() => {
            status.style.animation = `pulse 2s infinite ${delay}ms`;
        }, delay);
    });
}

// Staggered animation for protocol categories
function animateProtocolCategories() {
    const categories = document.querySelectorAll('.protocol-category');
    categories.forEach((category, index) => {
        category.style.opacity = '0';
        category.style.transform = 'translateY(30px)';
        category.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            category.style.opacity = '1';
            category.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Matrix line animation enhancement
function enhanceMatrixLines() {
    document.querySelectorAll('.matrix-line').forEach((line, index) => {
        line.style.animationDelay = `${index * 0.5}s`;
        line.style.animation = `matrixFlow 3s infinite linear`;
    });
}

// Testing workflow animation
function animateTestingWorkflow() {
    const phases = document.querySelectorAll('.qa-phase');
    const workflowObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    entry.target.classList.add('workflow-animated');
                }, index * 200);
            }
        });
    }, { threshold: 0.3 });
    
    phases.forEach(phase => {
        phase.style.opacity = '0';
        phase.style.transform = 'translateX(-50px)';
        phase.style.transition = 'all 0.8s ease';
        workflowObserver.observe(phase);
    });
}

// Loading performance optimization
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    
    // Initialize validation node animations with random delays
    document.querySelectorAll('.validation-node').forEach((node, index) => {
        node.style.animationDelay = `${Math.random() * 8}s`;
    });
    
    // Initialize all enhancement functions
    initializeValidationNodes();
    animateProtocolCategories();
    enhanceMatrixLines();
    animateTestingWorkflow();
});

// Responsive compliance controls
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        document.querySelectorAll('.compliance-button').forEach(button => {
            button.style.fontSize = '0.9rem';
            button.style.padding = '1rem 2rem';
        });
    } else {
        document.querySelectorAll('.compliance-button').forEach(button => {
            button.style.fontSize = '';
            button.style.padding = '';
        });
    }
});

// Enhanced compliance widget animations
document.querySelectorAll('.compliance-widget').forEach(widget => {
    widget.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.widget-icon i');
        if (icon) {
            icon.style.transform = 'scale(1.3) rotate(360deg)';
            icon.style.transition = 'transform 0.6s ease';
        }
        
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
    });
    
    widget.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.widget-icon i');
        if (icon) {
            icon.style.transform = 'scale(1) rotate(0deg)';
        }
        
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
    });
});

// Intersection observer for service cards
const serviceCardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.testing-service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(40px)';
    card.style.transition = 'all 0.8s ease';
    serviceCardObserver.observe(card);
});

// Button ripple effect for compliance buttons
document.querySelectorAll('.compliance-button').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});
    