/* ================================
   ADMIN ACHIEVEMENTS JAVASCRIPT
   Handles modal interactions, CRUD operations, and UI functionality
   ================================ */

// Global variables
let currentEditingId = null;
let achievementData = window.achievementData || {};

// ================================
// MODAL MANAGEMENT
// ================================

function openAchievementModal() {
    const modal = document.getElementById('achievementModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('achievementForm');
    
    // Reset form and modal
    form.reset();
    currentEditingId = null;
    document.getElementById('achievementId').value = '';
    modalTitle.textContent = 'Add New Achievement';
    
    // Clear image preview
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.innerHTML = '<i class="fas fa-image"></i><span>Click to upload or drag image here</span>';
    }
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeAchievementModal() {
    const modal = document.getElementById('achievementModal');
    
    // Fade out and hide
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

function openViewModal() {
    const modal = document.getElementById('viewAchievementModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeViewModal() {
    const modal = document.getElementById('viewAchievementModal');
    
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// ================================
// CRUD OPERATIONS
// ================================

function editAchievement(achievementId) {
    // Show loading state
    showLoadingState('Loading achievement data...');
    
    // Make AJAX request to get achievement data
    fetch(`/admin-achievements/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': achievementData.csrf_token
        },
        body: `action=get&achievement_id=${achievementId}&csrfmiddlewaretoken=${achievementData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            populateEditForm(data.achievement);
            openAchievementModal();
        } else {
            showNotification('Error loading achievement data', 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification('Error loading achievement data', 'error');
    });
}

function populateEditForm(achievement) {
    currentEditingId = achievement.id;
    
    // Update modal title
    document.getElementById('modalTitle').textContent = 'Edit Achievement';
    
    // Populate form fields
    document.getElementById('achievementId').value = achievement.id;
    document.getElementById('title').value = achievement.title;
    document.getElementById('achievement_type').value = achievement.achievement_type;
    document.getElementById('category').value = achievement.category_id;
    document.getElementById('achievement_date').value = achievement.achievement_date;
    document.getElementById('short_description').value = achievement.short_description || '';
    document.getElementById('description').value = achievement.description;
    document.getElementById('external_link').value = achievement.external_link || '';
    document.getElementById('impact_metrics').value = achievement.impact_metrics || '{}';
    document.getElementById('status').value = achievement.status;
    document.getElementById('display_order').value = achievement.display_order;
    document.getElementById('featured').checked = achievement.featured;
    
    // Handle image preview if exists
    if (achievement.featured_image) {
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = `<img src="${achievement.featured_image}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
    }
}

function viewAchievement(achievementId) {
    showLoadingState('Loading achievement details...');
    
    fetch(`/admin-achievements/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': achievementData.csrf_token
        },
        body: `action=get&achievement_id=${achievementId}&csrfmiddlewaretoken=${achievementData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            populateViewModal(data.achievement);
            openViewModal();
        } else {
            showNotification('Error loading achievement details', 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification('Error loading achievement details', 'error');
    });
}

function populateViewModal(achievement) {
    const modalContent = document.getElementById('viewModalContent');
    const modalTitle = document.getElementById('viewModalTitle');
    
    modalTitle.textContent = achievement.title;
    
    modalContent.innerHTML = `
        <div class="achievement-view-content">
            ${achievement.featured_image ? `
                <div class="achievement-view-image">
                    <img src="${achievement.featured_image}" alt="${achievement.title}">
                </div>
            ` : ''}
            
            <div class="achievement-view-details">
                <div class="detail-row">
                    <label>Type:</label>
                    <span class="type-badge type-${achievement.achievement_type.toLowerCase()}">${achievement.achievement_type_display}</span>
                </div>
                
                <div class="detail-row">
                    <label>Category:</label>
                    <span style="color: ${achievement.category_color}">${achievement.category_name}</span>
                </div>
                
                <div class="detail-row">
                    <label>Date:</label>
                    <span>${achievement.achievement_date}</span>
                </div>
                
                <div class="detail-row">
                    <label>Status:</label>
                    <span class="status-badge status-${achievement.status.toLowerCase()}">${achievement.status_display}</span>
                </div>
                
                ${achievement.short_description ? `
                    <div class="detail-row">
                        <label>Short Description:</label>
                        <p>${achievement.short_description}</p>
                    </div>
                ` : ''}
                
                <div class="detail-row">
                    <label>Description:</label>
                    <p>${achievement.description}</p>
                </div>
                
                ${achievement.external_link ? `
                    <div class="detail-row">
                        <label>External Link:</label>
                        <a href="${achievement.external_link}" target="_blank" class="external-link">
                            <i class="fas fa-external-link-alt"></i> View Source
                        </a>
                    </div>
                ` : ''}
                
                ${achievement.impact_metrics && achievement.impact_metrics !== '{}' ? `
                    <div class="detail-row">
                        <label>Impact Metrics:</label>
                        <pre class="metrics-display">${JSON.stringify(JSON.parse(achievement.impact_metrics), null, 2)}</pre>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function deleteAchievement(achievementId) {
    if (!confirm('Are you sure you want to delete this achievement? This action cannot be undone.')) {
        return;
    }
    
    showLoadingState('Deleting achievement...');
    
    fetch(`/admin-achievements/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': achievementData.csrf_token
        },
        body: `action=delete&achievement_id=${achievementId}&csrfmiddlewaretoken=${achievementData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            showNotification('Achievement deleted successfully', 'success');
            // Remove row from table
            const row = document.querySelector(`tr[data-id="${achievementId}"]`);
            if (row) {
                row.style.opacity = '0';
                setTimeout(() => {
                    row.remove();
                    updateStatsAfterDelete();
                }, 300);
            }
        } else {
            showNotification(data.message || 'Error deleting achievement', 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification('Error deleting achievement', 'error');
    });
}

// ================================
// FORM SUBMISSION
// ================================

function handleFormSubmission() {
    const form = document.getElementById('achievementForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const action = currentEditingId ? 'update' : 'create';
        formData.append('action', action);
        
        if (currentEditingId) {
            formData.append('achievement_id', currentEditingId);
        }
        
        showLoadingState(currentEditingId ? 'Updating achievement...' : 'Creating achievement...');
        
        fetch('/admin-achievements/', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': achievementData.csrf_token
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideLoadingState();
            
            if (data.success) {
                showNotification(
                    currentEditingId ? 'Achievement updated successfully' : 'Achievement created successfully',
                    'success'
                );
                closeAchievementModal();
                // Reload page to show updated data
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                showNotification(data.message || 'Error saving achievement', 'error');
                if (data.errors) {
                    displayFormErrors(data.errors);
                }
            }
        })
        .catch(error => {
            hideLoadingState();
            console.error('Error:', error);
            showNotification('Error saving achievement', 'error');
        });
    });
}

// ================================
// BULK OPERATIONS
// ================================

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.achievement-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateBulkActionButtons();
}

function updateBulkActionButtons() {
    const checkedBoxes = document.querySelectorAll('.achievement-checkbox:checked');
    const bulkButtons = document.querySelectorAll('.btn-bulk');
    
    bulkButtons.forEach(button => {
        button.disabled = checkedBoxes.length === 0;
        button.style.opacity = checkedBoxes.length === 0 ? '0.5' : '1';
    });
}

function bulkAction(action) {
    const checkedBoxes = document.querySelectorAll('.achievement-checkbox:checked');
    const achievementIds = Array.from(checkedBoxes).map(cb => cb.value);
    
    if (achievementIds.length === 0) {
        showNotification('Please select achievements to perform bulk action', 'warning');
        return;
    }
    
    let confirmMessage = '';
    switch (action) {
        case 'feature':
            confirmMessage = `Feature ${achievementIds.length} selected achievements?`;
            break;
        case 'archive':
            confirmMessage = `Archive ${achievementIds.length} selected achievements?`;
            break;
        case 'delete':
            confirmMessage = `Delete ${achievementIds.length} selected achievements? This action cannot be undone.`;
            break;
    }
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    showLoadingState(`Performing bulk ${action}...`);
    
    fetch('/admin-achievements/', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': achievementData.csrf_token
        },
        body: `action=bulk_action&bulk_action=${action}&${achievementIds.map(id => `achievement_ids[]=${id}`).join('&')}&csrfmiddlewaretoken=${achievementData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            showNotification(`Bulk ${action} completed successfully`, 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            showNotification(data.message || `Error performing bulk ${action}`, 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification(`Error performing bulk ${action}`, 'error');
    });
}

// ================================
// TOGGLE OPERATIONS
// ================================

function toggleFeatured(achievementId, checkbox) {
    const featured = checkbox.checked;
    
    fetch('/admin-achievements/', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': achievementData.csrf_token
        },
        body: `action=toggle_featured&achievement_id=${achievementId}&featured=${featured}&csrfmiddlewaretoken=${achievementData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(`Achievement ${featured ? 'featured' : 'unfeatured'} successfully`, 'success');
        } else {
            // Revert checkbox if failed
            checkbox.checked = !featured;
            showNotification(data.message || 'Error updating achievement', 'error');
        }
    })
    .catch(error => {
        // Revert checkbox if failed
        checkbox.checked = !featured;
        console.error('Error:', error);
        showNotification('Error updating achievement', 'error');
    });
}

// ================================
// EXPORT FUNCTIONALITY
// ================================

function exportAchievements() {
    showLoadingState('Preparing export...');
    
    window.location.href = '/admin-achievements/?export=csv';
    
    setTimeout(() => {
        hideLoadingState();
    }, 2000);
}

// ================================
// UI HELPER FUNCTIONS
// ================================

function showLoadingState(message = 'Loading...') {
    // Create or show loading overlay
    let loadingOverlay = document.getElementById('loadingOverlay');
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.id = 'loadingOverlay';
        loadingOverlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-message">${message}</div>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    } else {
        loadingOverlay.querySelector('.loading-message').textContent = message;
    }
    
    loadingOverlay.style.display = 'flex';
    setTimeout(() => {
        loadingOverlay.style.opacity = '1';
    }, 10);
}

function hideLoadingState() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            loadingOverlay.style.display = 'none';
        }, 300);
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

function displayFormErrors(errors) {
    // Clear previous errors
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    
    // Display new errors
    Object.keys(errors).forEach(field => {
        const input = document.getElementById(field);
        if (input) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.style.color = 'var(--error-color, #dc3545)';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '0.25rem';
            errorDiv.textContent = errors[field][0];
            
            input.parentElement.appendChild(errorDiv);
        }
    });
}

function updateStatsAfterDelete() {
    // Update total count
    const totalStat = document.querySelector('.stat-number');
    if (totalStat) {
        const currentCount = parseInt(totalStat.textContent);
        totalStat.textContent = currentCount - 1;
    }
}

// ================================
// IMAGE UPLOAD HANDLING
// ================================

function initImageUpload() {
    const fileInput = document.getElementById('featured_image');
    const imagePreview = document.getElementById('imagePreview');
    
    if (fileInput && imagePreview) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" 
                             style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                        <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-secondary);">
                            ${file.name}
                        </div>
                    `;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Drag and drop functionality
        imagePreview.addEventListener('dragover', function(e) {
            e.preventDefault();
            imagePreview.style.borderColor = 'var(--primary-gold)';
            imagePreview.style.backgroundColor = 'var(--bg-glass-hover)';
        });
        
        imagePreview.addEventListener('dragleave', function(e) {
            e.preventDefault();
            imagePreview.style.borderColor = '';
            imagePreview.style.backgroundColor = '';
        });
        
        imagePreview.addEventListener('drop', function(e) {
            e.preventDefault();
            imagePreview.style.borderColor = '';
            imagePreview.style.backgroundColor = '';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                fileInput.dispatchEvent(new Event('change'));
            }
        });
    }
}

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form submission handler
    handleFormSubmission();
    
    // Initialize image upload
    initImageUpload();
    
    // Add event listeners for checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('achievement-checkbox')) {
            updateBulkActionButtons();
        }
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        const achievementModal = document.getElementById('achievementModal');
        const viewModal = document.getElementById('viewAchievementModal');
        
        if (e.target === achievementModal) {
            closeAchievementModal();
        }
        if (e.target === viewModal) {
            closeViewModal();
        }
    });
    
    // Handle ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="block"]');
            openModals.forEach(modal => {
                if (modal.id === 'achievementModal') {
                    closeAchievementModal();
                } else if (modal.id === 'viewAchievementModal') {
                    closeViewModal();
                }
            });
        }
    });
    
    console.log('Admin Achievements JavaScript initialized successfully');
});

// ================================
// LOADING STATE STYLES
// ================================

// Add loading styles if not already present
if (!document.getElementById('loadingStyles')) {
    const style = document.createElement('style');
    style.id = 'loadingStyles';
    style.textContent = `
        #loadingOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .loading-content {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            backdrop-filter: blur(20px);
            color: var(--text-primary);
        }
        
        .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid var(--border-glass);
            border-top: 3px solid var(--primary-gold);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .loading-message {
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            backdrop-filter: blur(20px);
            z-index: 10001;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
            box-shadow: var(--shadow-primary);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            color: var(--text-primary);
        }
        
        .notification-success { border-left: 4px solid #28a745; }
        .notification-error { border-left: 4px solid #dc3545; }
        .notification-warning { border-left: 4px solid #ffc107; }
        .notification-info { border-left: 4px solid #17a2b8; }
        
        .notification-close {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: none;
            border: none;
            color: var(--text-secondary);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 4px;
            transition: all 0.2s ease;
        }
        
        .notification-close:hover {
            background: var(--bg-glass);
            color: var(--text-primary);
        }
        
        .field-error {
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        }
        
        .achievement-view-content {
            max-height: 60vh;
            overflow-y: auto;
        }
        
        .achievement-view-image {
            margin-bottom: 1.5rem;
            text-align: center;
        }
        
        .achievement-view-image img {
            max-width: 100%;
            max-height: 300px;
            border-radius: 12px;
            box-shadow: var(--shadow-primary);
        }
        
        .detail-row {
            margin-bottom: 1rem;
            padding-bottom: 1rem;
            border-bottom: 1px solid var(--border-glass);
        }
        
        .detail-row:last-child {
            border-bottom: none;
        }
        
        .detail-row label {
            display: block;
            font-weight: 600;
            color: var(--text-secondary);
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
        }
        
        .metrics-display {
            background: var(--bg-glass);
            border: 1px solid var(--border-glass);
            border-radius: 8px;
            padding: 1rem;
            font-size: 0.8rem;
            color: var(--text-primary);
        }
        
        .external-link {
            color: var(--primary-gold);
            text-decoration: none;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.2s ease;
        }
        
        .external-link:hover {
            color: var(--primary-gold-light);
        }
    `;
    document.head.appendChild(style);
}