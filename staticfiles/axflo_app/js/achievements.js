// Achievements Page JavaScript - Ultra Modern Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeAOS();
    initializeCounters();
    initializeFiltering();
    initializeSearch();
    initializeSort();
    initializeModals();
    initializeLoadMore();
    initializeFloatingElements();
    
    console.log('Achievements page initialized successfully');
});

// =====================================
// AOS (Animate On Scroll) Initialization
// =====================================
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-out-cubic'
        });
    }
}

// =====================================
// Animated Counters
// =====================================
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current).toLocaleString();
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    };
    
    // Use Intersection Observer to trigger counters when visible
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// =====================================
// Dynamic Filtering System
// =====================================
function initializeFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('[data-category]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Animate cards out
            cards.forEach(card => {
                card.style.transition = 'all 0.3s ease';
                card.style.transform = 'scale(0.8)';
                card.style.opacity = '0';
            });
            
            // After animation, filter cards
            setTimeout(() => {
                cards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        // Animate in
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                });
            }, 300);
        });
    });
}

// =====================================
// Search Functionality
// =====================================
function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value.toLowerCase());
        }, 300);
    });
    
    function performSearch(query) {
        const cards = document.querySelectorAll('[data-category]');
        const noResultsMessage = document.getElementById('noResultsMessage');
        let visibleCount = 0;
        
        cards.forEach(card => {
            const title = card.querySelector('.card-title, .achievement-title, .milestone-title, .timeline-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.card-description, .achievement-description, .milestone-description, .timeline-description')?.textContent.toLowerCase() || '';
            const client = card.querySelector('.card-client')?.textContent.toLowerCase() || '';
            
            const matches = title.includes(query) || description.includes(query) || client.includes(query);
            
            if (matches || query === '') {
                card.style.display = 'block';
                visibleCount++;
                // Add highlight effect
                if (query !== '') {
                    card.classList.add('search-highlight');
                    setTimeout(() => card.classList.remove('search-highlight'), 1000);
                }
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide no results message
        if (noResultsMessage) {
            if (visibleCount === 0 && query !== '') {
                noResultsMessage.style.display = 'block';
            } else {
                noResultsMessage.style.display = 'none';
            }
        }
    }
}

// =====================================
// Sort Functionality
// =====================================
function initializeSort() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', (e) => {
        const sortValue = e.target.value;
        const container = document.getElementById('achievementsGrid');
        if (!container) return;
        
        const cards = Array.from(container.children);
        
        cards.sort((a, b) => {
            const aDate = a.getAttribute('data-date');
            const aName = a.getAttribute('data-name') || '';
            const bDate = b.getAttribute('data-date');
            const bName = b.getAttribute('data-name') || '';
            
            switch (sortValue) {
                case 'date-desc':
                    return new Date(bDate) - new Date(aDate);
                case 'date-asc':
                    return new Date(aDate) - new Date(bDate);
                case 'name-asc':
                    return aName.localeCompare(bName);
                case 'name-desc':
                    return bName.localeCompare(aName);
                default:
                    return 0;
            }
        });
        
        // Animate the reordering
        cards.forEach(card => {
            card.style.transition = 'all 0.3s ease';
            card.style.transform = 'translateY(-20px)';
            card.style.opacity = '0.5';
        });
        
        setTimeout(() => {
            cards.forEach(card => container.appendChild(card));
            cards.forEach(card => {
                card.style.transform = 'translateY(0)';
                card.style.opacity = '1';
            });
        }, 300);
    });
}

// =====================================
// Modal System
// =====================================
function initializeModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    // Close modal when clicking close button
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal when clicking outside
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="display: block"]');
            if (openModal) {
                closeModal(openModal);
            }
        }
    });
}

function openModal(modal) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Animate in
    const content = modal.querySelector('.modal-content');
    content.style.animation = 'modalSlideIn 0.3s ease-out';
}

function closeModal(modal) {
    const content = modal.querySelector('.modal-content');
    content.style.animation = 'modalSlideOut 0.3s ease-in';
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// Modal content functions
function openAchievementModal(achievementId) {
    const modal = document.getElementById('achievementModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('modalContent');
    
    if (!window.achievementsData) {
        console.error('Achievements data not available');
        return;
    }
    
    const achievement = window.achievementsData.achievements.find(a => a.id === achievementId);
    if (!achievement) {
        console.error('Achievement not found:', achievementId);
        return;
    }
    
    title.textContent = achievement.title;
    
    content.innerHTML = `
        <div class="modal-achievement">
            ${achievement.featured_image ? `
                <div class="modal-image">
                    <img src="${achievement.featured_image}" alt="${achievement.title}">
                </div>
            ` : ''}
            
            <div class="modal-meta">
                <span class="modal-category" style="color: ${achievement.category.color}">
                    <i class="fas ${achievement.category.icon}"></i>
                    ${achievement.category.name}
                </span>
                <span class="modal-type">${achievement.achievement_type.replace('_', ' ')}</span>
                <span class="modal-date">${new Date(achievement.achievement_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            
            <div class="modal-description">
                <p>${achievement.description}</p>
            </div>
            
            ${achievement.impact_metrics && Object.keys(achievement.impact_metrics).length > 0 ? `
                <div class="modal-metrics">
                    <h3>Impact Metrics</h3>
                    <div class="metrics-grid">
                        ${Object.entries(achievement.impact_metrics).map(([key, value]) => `
                            <div class="metric-item">
                                <span class="metric-value">${value}</span>
                                <span class="metric-label">${key.replace('_', ' ').toUpperCase()}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            ${achievement.external_link ? `
                <div class="modal-actions">
                    <a href="${achievement.external_link}" target="_blank" class="btn-external">
                        <i class="fas fa-external-link-alt"></i>
                        View External Link
                    </a>
                </div>
            ` : ''}
        </div>
    `;
    
    openModal(modal);
}

function openPortfolioModal(projectId) {
    const modal = document.getElementById('portfolioModal');
    const title = document.getElementById('portfolioModalTitle');
    const content = document.getElementById('portfolioModalContent');
    
    if (!window.achievementsData) {
        console.error('Portfolio data not available');
        return;
    }
    
    const project = window.achievementsData.portfolio.find(p => p.id === projectId);
    if (!project) {
        console.error('Project not found:', projectId);
        return;
    }
    
    title.textContent = project.title;
    
    content.innerHTML = `
        <div class="modal-project">
            ${project.featured_image ? `
                <div class="modal-image">
                    <img src="${project.featured_image}" alt="${project.title}">
                </div>
            ` : ''}
            
            <div class="modal-meta">
                <span class="modal-client">Client: ${project.client}</span>
                <span class="modal-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${project.location}
                </span>
                <span class="modal-type">${project.project_type.replace('_', ' ')}</span>
                ${project.duration_months ? `<span class="modal-duration">${project.duration_months} months</span>` : ''}
            </div>
            
            <div class="modal-description">
                <p>${project.brief_description}</p>
            </div>
            
            ${project.key_statistics && Object.keys(project.key_statistics).length > 0 ? `
                <div class="modal-statistics">
                    <h3>Project Statistics</h3>
                    <div class="statistics-grid">
                        ${Object.entries(project.key_statistics).map(([key, value]) => `
                            <div class="stat-item">
                                <span class="stat-value">${value}</span>
                                <span class="stat-label">${key.replace('_', ' ').toUpperCase()}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
    
    openModal(modal);
}

// =====================================
// Load More Functionality
// =====================================
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    let currentPage = 1;
    const itemsPerPage = 12;
    
    // Hide items beyond first page initially
    const allCards = document.querySelectorAll('[data-category]');
    if (allCards.length > itemsPerPage) {
        Array.from(allCards).slice(itemsPerPage).forEach(card => {
            card.style.display = 'none';
            card.classList.add('hidden-item');
        });
        loadMoreBtn.style.display = 'inline-flex';
    }
    
    loadMoreBtn.addEventListener('click', () => {
        const hiddenCards = document.querySelectorAll('.hidden-item');
        const cardsToShow = Array.from(hiddenCards).slice(0, itemsPerPage);
        
        cardsToShow.forEach((card, index) => {
            setTimeout(() => {
                card.style.display = 'block';
                card.classList.remove('hidden-item');
                card.style.animation = 'fadeInUp 0.5s ease-out';
            }, index * 100);
        });
        
        if (hiddenCards.length <= itemsPerPage) {
            loadMoreBtn.style.display = 'none';
        }
        
        currentPage++;
    });
}

// =====================================
// Floating Elements Animation
// =====================================
function initializeFloatingElements() {
    const container = document.querySelector('.floating-elements');
    if (!container) return;
    
    function createFloatingElement() {
        if (!container) return; // Safety check
        
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.left = Math.random() * 100 + '%';
        element.style.animationDuration = (Math.random() * 10 + 15) + 's';
        element.style.animationDelay = Math.random() * 5 + 's';
        
        container.appendChild(element);
        
        setTimeout(() => {
            if (element && element.parentNode) {
                element.remove();
            }
        }, 25000);
    }
    
    // Create floating elements periodically
    setInterval(createFloatingElement, 3000);
    
    // Create initial elements
    for (let i = 0; i < 5; i++) {
        setTimeout(createFloatingElement, i * 1000);
    }
}

// =====================================
// Smooth Scroll for Anchor Links
// =====================================
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

// =====================================
// Scroll-triggered Animations
// =====================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.fade-in-up, .scale-in').forEach(el => {
    observer.observe(el);
});

// =====================================
// Performance Optimizations
// =====================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
initializeLazyLoading();

// =====================================
// Utility Functions
// =====================================

// Add CSS for modal animations
const style = document.createElement('style');
style.textContent = `
    @keyframes modalSlideIn {
        from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @keyframes modalSlideOut {
        from {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        to {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .search-highlight {
        animation: searchPulse 1s ease-out;
    }
    
    @keyframes searchPulse {
        0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
        100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
    }
    
    .modal-achievement,
    .modal-project {
        line-height: 1.6;
    }
    
    .modal-image {
        margin-bottom: 2rem;
        border-radius: 12px;
        overflow: hidden;
    }
    
    .modal-image img {
        width: 100%;
        height: 300px;
        object-fit: cover;
    }
    
    .modal-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #e2e8f0;
    }
    
    .modal-meta > span {
        padding: 0.5rem 1rem;
        background: #f7fafc;
        border-radius: 20px;
        font-size: 0.875rem;
        font-weight: 600;
    }
    
    .modal-description {
        margin-bottom: 2rem;
        font-size: 1.1rem;
        line-height: 1.8;
    }
    
    .modal-metrics,
    .modal-statistics {
        margin-bottom: 2rem;
    }
    
    .modal-metrics h3,
    .modal-statistics h3 {
        margin-bottom: 1rem;
        font-size: 1.25rem;
        font-weight: 700;
    }
    
    .metrics-grid,
    .statistics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .metric-item,
    .stat-item {
        text-align: center;
        padding: 1rem;
        background: #f7fafc;
        border-radius: 12px;
    }
    
    .metric-value,
    .stat-value {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
        color: #2d3748;
        margin-bottom: 0.5rem;
    }
    
    .metric-label,
    .stat-label {
        font-size: 0.75rem;
        color: #718096;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    
    .modal-actions {
        text-align: center;
    }
    
    .btn-external {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 2rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 600;
        transition: all 0.3s ease;
    }
    
    .btn-external:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
`;

document.head.appendChild(style);

// =====================================
// Export functions for global access
// =====================================
window.openAchievementModal = openAchievementModal;
window.openPortfolioModal = openPortfolioModal;

