/**
 * Admin Dashboard JavaScript
 * Handles sidebar toggle, theme switching, mobile menu, and other admin interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSidebarToggle();
    initThemeToggle();
    initMobileMenu();
    initActiveNavigation();
    
    console.log('Admin JS initialized');
});

/**
 * Sidebar Toggle Functionality
 */
function initSidebarToggle() {
    const sidebarToggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            
            // Update icon direction
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('collapsed')) {
                icon.className = 'fas fa-chevron-right';
            } else {
                icon.className = 'fas fa-chevron-left';
            }
            
            // Save state to localStorage
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        });
        
        // Restore sidebar state from localStorage
        const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
        if (isCollapsed) {
            sidebar.classList.add('collapsed');
            const icon = sidebarToggleBtn.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-chevron-right';
            }
        }
    }
}

/**
 * Theme Toggle Functionality
 */
function initThemeToggle() {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle');
    
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            toggleTheme();
        });
    });
    
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update theme toggle icons
    const themeIcons = document.querySelectorAll('.theme-toggle i');
    themeIcons.forEach(icon => {
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    });
}

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('mobile-open');
            document.body.classList.toggle('mobile-menu-open');
            
            if (mobileOverlay) {
                mobileOverlay.classList.toggle('active');
            }
        });
    }
    
    // Close mobile menu when clicking overlay
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function() {
            closeMobileMenu();
        });
    }
    
    // Close mobile menu on window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });
}

function closeMobileMenu() {
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('mobileOverlay');
    
    if (sidebar) {
        sidebar.classList.remove('mobile-open');
    }
    
    document.body.classList.remove('mobile-menu-open');
    
    if (mobileOverlay) {
        mobileOverlay.classList.remove('active');
    }
}

/**
 * Active Navigation Highlighting
 */
function initActiveNavigation() {
    // Get current page from window.currentPage or determine from URL
    const currentPage = window.currentPage || getCurrentPageFromURL();
    
    if (currentPage) {
        // Remove all active classes
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page
        const activeLink = document.querySelector(`.nav-link[data-page="${currentPage}"]`) ||
                          document.querySelector(`.nav-link[href*="${currentPage}"]`);
        
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

function getCurrentPageFromURL() {
    const path = window.location.pathname;
    
    if (path.includes('/admin-career')) return 'careers';
    if (path.includes('/admin-application')) return 'applications';
    if (path.includes('/admin-contact')) return 'contacts';
    if (path.includes('/admin-subscriber')) return 'subscribers';
    if (path.includes('/admin-user')) return 'users';
    if (path.includes('/admindashboard')) return 'dashboard';
    
    return 'dashboard'; // default
}

/**
 * Utility Functions
 */

// Show loading spinner
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-spinner';
    loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    document.body.appendChild(loader);
}

// Hide loading spinner
function hideLoading() {
    const loader = document.querySelector('.loading-spinner');
    if (loader) {
        loader.remove();
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-triangle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Handle AJAX errors
function handleAjaxError(error) {
    console.error('AJAX Error:', error);
    showNotification('An error occurred. Please try again.', 'error');
}

// CSRF Token helper
function getCSRFToken() {
    const token = document.querySelector('[name=csrfmiddlewaretoken]');
    return token ? token.value : '';
}

// Export functions for global use
window.AdminJS = {
    showLoading,
    hideLoading,
    showNotification,
    handleAjaxError,
    getCSRFToken,
    toggleTheme,
    setTheme,
    closeMobileMenu
};