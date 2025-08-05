document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('form-messages');
    const submitBtn = contactForm.querySelector('.submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');

    // Form submission handler
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        
        // Hide any existing messages
        hideMessage();
        
        // Get form data
        const formData = new FormData(contactForm);
        
        // Get CSRF token
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
        
        // Submit form via AJAX
        fetch(window.location.href, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrfToken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage(data.message, 'success');
                contactForm.reset();
                // Add success animation
                submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                setTimeout(() => {
                    submitBtn.style.background = '';
                }, 2000);
            } else {
                showMessage(data.message, 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showMessage('An error occurred. Please try again later.', 'error');
        })
        .finally(() => {
            // Re-enable submit button and hide loading state
            submitBtn.disabled = false;
            btnText.style.display = 'block';
            btnLoading.style.display = 'none';
        });
    });

    // Show message function
    function showMessage(message, type) {
        const messageContent = formMessages.querySelector('.message-content');
        const messageIcon = formMessages.querySelector('.message-icon');
        const messageText = formMessages.querySelector('.message-text');
        
        // Set message content
        messageText.textContent = message;
        
        // Set icon based on type
        if (type === 'success') {
            messageIcon.className = 'message-icon fas fa-check-circle';
            formMessages.className = 'form-messages success';
        } else {
            messageIcon.className = 'message-icon fas fa-exclamation-circle';
            formMessages.className = 'form-messages error';
        }
        
        // Show message
        formMessages.style.display = 'flex';
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            hideMessage();
        }, 5000);
    }

    // Hide message function
    function hideMessage() {
        formMessages.style.display = 'none';
    }

    // Enhanced form interactions
    const formInputs = contactForm.querySelectorAll('input, select, textarea');
    
    formInputs.forEach(input => {
        // Add focus effect to input icons
        input.addEventListener('focus', function() {
            const icon = this.parentElement.querySelector('.input-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
                icon.style.color = 'var(--primary-gold-light)';
            }
        });
        
        input.addEventListener('blur', function() {
            const icon = this.parentElement.querySelector('.input-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
                icon.style.color = 'var(--primary-gold)';
            }
        });
        
        // Add input validation styling
        input.addEventListener('input', function() {
            if (this.checkValidity()) {
                this.style.borderColor = 'rgba(34, 197, 94, 0.5)';
            } else {
                this.style.borderColor = 'rgba(239, 68, 68, 0.5)';
            }
        });
        
        // Reset border color on focus
        input.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary-gold)';
        });
    });

    // Animate elements on scroll
    const animateElements = document.querySelectorAll('.info-card, .contact-form-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Add subtle parallax effect to hero elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const heroBackground = document.querySelector('.hero-background');
        const geometricElements = document.querySelector('.geometric-elements');
        
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
        
        if (geometricElements) {
            geometricElements.style.transform = `translateY(${rate * 0.3}px)`;
        }
    });

    // Enhanced button hover effects
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Form field character counter for textarea
    const messageTextarea = document.getElementById('message');
    if (messageTextarea) {
        const maxLength = 1000;
        
        // Create character counter
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 15px;
            font-size: 0.8rem;
            color: rgba(255, 255, 255, 0.5);
            pointer-events: none;
        `;
        
        messageTextarea.parentElement.style.position = 'relative';
        messageTextarea.parentElement.appendChild(counter);
        
        // Update counter
        function updateCounter() {
            const length = messageTextarea.value.length;
            counter.textContent = `${length}/${maxLength}`;
            
            if (length > maxLength * 0.9) {
                counter.style.color = '#ef4444';
            } else if (length > maxLength * 0.7) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = 'rgba(255, 255, 255, 0.5)';
            }
        }
        
        messageTextarea.addEventListener('input', updateCounter);
        messageTextarea.setAttribute('maxlength', maxLength);
        updateCounter();
    }

    // Add smooth scrolling to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroContent.style.transition = 'all 1s ease-out';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 300);
    }

    // Add loading animation to form on page load
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
        formContainer.style.opacity = '0';
        formContainer.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            formContainer.style.transition = 'all 0.8s ease-out';
            formContainer.style.opacity = '1';
            formContainer.style.transform = 'translateY(0)';
        }, 600);
    }
});