/**
 * Axflo Cookie Consent Management System
 * Handles cookie consent banner, preferences modal, and cookie management
 */

class AxfloCookieConsent {
    constructor() {
        this.cookieName = 'axflo_cookie_consent';
        this.cookieExpiry = 365; // days
        this.defaultPreferences = {
            essential: true,
            analytics: false,
            marketing: false,
            functional: false
        };
        
        this.init();
    }
    
    init() {
        // Check if cookies are already accepted
        const consent = this.getCookieConsent();
        
        if (!consent) {
            // Show cookie banner after a short delay
            setTimeout(() => {
                this.showCookieBanner();
            }, 1000);
        } else {
            // Show cookie settings button
            this.showCookieSettingsButton();
        }
        
        // Load saved preferences into modal
        this.loadSavedPreferences();
        
        // Apply saved preferences
        this.applyCookiePreferences(consent?.preferences || this.defaultPreferences);
    }
    
    showCookieBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.style.display = 'block';
        }
    }
    
    hideCookieBanner() {
        const banner = document.getElementById('cookieConsentBanner');
        if (banner) {
            banner.classList.add('fade-out');
            setTimeout(() => {
                banner.style.display = 'none';
                banner.classList.remove('fade-out');
            }, 400);
        }
    }
    
    showCookieSettingsButton() {
        const settingsBtn = document.getElementById('cookieSettingsBtn');
        if (settingsBtn) {
            settingsBtn.style.display = 'flex';
        }
    }
    
    getCookieConsent() {
        const consent = localStorage.getItem(this.cookieName);
        return consent ? JSON.parse(consent) : null;
    }
    
    setCookieConsent(preferences, timestamp = Date.now()) {
        const consentData = {
            preferences: preferences,
            timestamp: timestamp,
            version: '1.0'
        };
        
        localStorage.setItem(this.cookieName, JSON.stringify(consentData));
        
        // Set actual cookies based on preferences
        this.setConsentCookie(preferences);
        
        // Apply the preferences immediately
        this.applyCookiePreferences(preferences);
        
        console.log('Cookie consent saved:', preferences);
    }
    
    setConsentCookie(preferences) {
        const expires = new Date();
        expires.setDate(expires.getDate() + this.cookieExpiry);
        
        // Set a consent tracking cookie
        document.cookie = `cookie_consent=${JSON.stringify(preferences)}; expires=${expires.toUTCString()}; path=/; secure; samesite=strict`;
    }
    
    applyCookiePreferences(preferences) {
        // Analytics cookies (Google Analytics, etc.)
        if (preferences.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }
        
        // Marketing cookies (Facebook Pixel, Google Ads, etc.)
        if (preferences.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }
        
        // Functional cookies (User preferences, etc.)
        if (preferences.functional) {
            this.enableFunctional();
        } else {
            this.disableFunctional();
        }
        
        // Fire custom event
        window.dispatchEvent(new CustomEvent('cookieConsentUpdate', {
            detail: { preferences }
        }));
    }
    
    enableAnalytics() {
        // Example: Enable Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'granted'
            });
        }
        console.log('Analytics cookies enabled');
    }
    
    disableAnalytics() {
        // Example: Disable Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': 'denied'
            });
        }
        console.log('Analytics cookies disabled');
    }
    
    enableMarketing() {
        // Example: Enable marketing cookies
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'granted'
            });
        }
        console.log('Marketing cookies enabled');
    }
    
    disableMarketing() {
        // Example: Disable marketing cookies
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'ad_storage': 'denied'
            });
        }
        console.log('Marketing cookies disabled');
    }
    
    enableFunctional() {
        console.log('Functional cookies enabled');
    }
    
    disableFunctional() {
        console.log('Functional cookies disabled');
    }
    
    loadSavedPreferences() {
        const consent = this.getCookieConsent();
        const preferences = consent?.preferences || this.defaultPreferences;
        
        // Load preferences into modal checkboxes
        document.getElementById('essentialCookies').checked = preferences.essential;
        document.getElementById('analyticsCookies').checked = preferences.analytics;
        document.getElementById('marketingCookies').checked = preferences.marketing;
        document.getElementById('functionalCookies').checked = preferences.functional;
    }
    
    getSelectedPreferences() {
        return {
            essential: document.getElementById('essentialCookies').checked,
            analytics: document.getElementById('analyticsCookies').checked,
            marketing: document.getElementById('marketingCookies').checked,
            functional: document.getElementById('functionalCookies').checked
        };
    }
}

// Initialize cookie consent system
let cookieConsent;
document.addEventListener('DOMContentLoaded', function() {
    cookieConsent = new AxfloCookieConsent();
});

// Global functions for button interactions
function acceptAllCookies() {
    const allAccepted = {
        essential: true,
        analytics: true,
        marketing: true,
        functional: true
    };
    
    cookieConsent.setCookieConsent(allAccepted);
    cookieConsent.hideCookieBanner();
    cookieConsent.showCookieSettingsButton();
    
    // Show success notification
    showCookieNotification('Cookie preferences saved! All cookies have been accepted.', 'success');
}

function rejectAllCookies() {
    const onlyEssential = {
        essential: true,
        analytics: false,
        marketing: false,
        functional: false
    };
    
    cookieConsent.setCookieConsent(onlyEssential);
    cookieConsent.hideCookieBanner();
    closeCookiePreferences();
    cookieConsent.showCookieSettingsButton();
    
    // Show notification
    showCookieNotification('Only essential cookies are enabled.', 'info');
}

function saveSelectedCookies() {
    const preferences = cookieConsent.getSelectedPreferences();
    
    cookieConsent.setCookieConsent(preferences);
    cookieConsent.hideCookieBanner();
    closeCookiePreferences();
    cookieConsent.showCookieSettingsButton();
    
    // Show success notification
    showCookieNotification('Cookie preferences saved successfully!', 'success');
}

function acceptAllCookiesFromModal() {
    // First update the checkboxes to reflect "accept all"
    document.getElementById('analyticsCookies').checked = true;
    document.getElementById('marketingCookies').checked = true;
    document.getElementById('functionalCookies').checked = true;
    
    // Then save the preferences
    acceptAllCookies();
    closeCookiePreferences();
}

function openCookiePreferences() {
    const modal = document.getElementById('cookiePreferencesModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Load current preferences
        cookieConsent.loadSavedPreferences();
    }
}

function closeCookiePreferences() {
    const modal = document.getElementById('cookiePreferencesModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Notification system for cookie actions
function showCookieNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.cookie-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `cookie-notification cookie-notification-${type}`;
    notification.innerHTML = `
        <div class="cookie-notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10001;
        background: ${type === 'success' ? 'var(--background)' : 'var(--bg-dark)'};
        color: ${type === 'success' ? 'var(--text-dark)' : 'var(--text-primary)'};
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: var(--shadow-primary);
        border: 1px solid ${type === 'success' ? 'var(--background)' : 'var(--glass-border)'};
        backdrop-filter: blur(var(--blur-amount));
        animation: slideInNotification 0.3s ease-out;
        font-family: 'Syne', sans-serif;
        font-weight: 500;
        max-width: 400px;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInNotification {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .cookie-notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .cookie-notification-content i {
            font-size: 16px;
        }
    `;
    document.head.appendChild(style);
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutNotification 0.3s ease-in';
        notification.style.animationFillMode = 'forwards';
        
        // Add slide out animation
        const slideOutStyle = document.createElement('style');
        slideOutStyle.textContent = `
            @keyframes slideOutNotification {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(slideOutStyle);
        
        setTimeout(() => {
            notification.remove();
            style.remove();
            slideOutStyle.remove();
        }, 300);
    }, 4000);
}

// Keyboard shortcuts for accessibility
document.addEventListener('keydown', function(event) {
    // ESC key to close cookie preferences modal
    if (event.key === 'Escape') {
        closeCookiePreferences();
    }
    
    // Enter key on cookie settings button
    if (event.key === 'Enter' && event.target.id === 'cookieSettingsBtn') {
        openCookiePreferences();
    }
});

// Handle cookie preferences modal backdrop click
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('cookie-modal-backdrop')) {
        closeCookiePreferences();
    }
});

// Debug function to reset cookie consent (for development)
function resetCookieConsent() {
    localStorage.removeItem('axflo_cookie_consent');
    document.cookie = 'cookie_consent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    location.reload();
}

// Expose debug function in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.resetCookieConsent = resetCookieConsent;
    console.log('Development mode: Use resetCookieConsent() to reset cookie consent');
}