/* ================================
   ADMIN MILESTONES JAVASCRIPT
   Handles timeline management, view switching, and CRUD operations
   ================================ */

// Global variables
let currentEditingId = null;
let currentView = 'timeline';
let milestonesData = window.milestonesData || {};

// ================================
// MODAL MANAGEMENT
// ================================

function openMilestoneModal() {
    const modal = document.getElementById('milestoneModal');
    const modalTitle = document.getElementById('milestoneModalTitle');
    const form = document.getElementById('milestoneForm');
    
    // Reset form and modal
    form.reset();
    currentEditingId = null;
    document.getElementById('milestoneId').value = '';
    modalTitle.textContent = 'Add New Milestone';
    
    // Clear image preview
    const imagePreview = document.getElementById('milestoneImagePreview');
    if (imagePreview) {
        imagePreview.innerHTML = '<i class="fas fa-image"></i><span>Click to upload or drag image here</span>';
    }
    
    // Reset icon preview
    const iconInput = document.getElementById('milestone_icon');
    const iconPreview = document.getElementById('milestoneIconPreview');
    if (iconInput && iconPreview) {
        iconInput.value = 'fa-flag';
        iconPreview.className = 'fas fa-flag';
    }
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeMilestoneModal() {
    const modal = document.getElementById('milestoneModal');
    
    // Fade out and hide
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

function openViewMilestoneModal() {
    const modal = document.getElementById('viewMilestoneModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeViewMilestoneModal() {
    const modal = document.getElementById('viewMilestoneModal');
    
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// ================================
// VIEW MANAGEMENT
// ================================

function toggleView(viewType) {
    // Hide all views
    document.getElementById('timelineView').style.display = viewType === 'timeline' ? 'block' : 'none';
    document.getElementById('cardsView').style.display = viewType === 'cards' ? 'grid' : 'none';
    document.getElementById('listView').style.display = viewType === 'list' ? 'block' : 'none';
    
    // Update active button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewType}"]`).classList.add('active');
    
    currentView = viewType;
    
    // Apply any view-specific initialization
    if (viewType === 'timeline') {
        initializeTimelineAnimations();
    }
}

function initializeTimelineAnimations() {
    const items = document.querySelectorAll('.timeline-item');
    items.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ================================
// ICON MANAGEMENT
// ================================

function updateIconPreview() {
    const iconInput = document.getElementById('milestone_icon');
    const iconPreview = document.getElementById('milestoneIconPreview');
    
    if (iconInput && iconPreview) {
        const iconValue = iconInput.value || 'fa-flag';
        iconPreview.className = `fas ${iconValue}`;
    }
}

function selectIcon(iconClass) {
    const iconInput = document.getElementById('milestone_icon');
    if (iconInput) {
        iconInput.value = iconClass;
        updateIconPreview();
    }
}

// ================================
// CRUD OPERATIONS
// ================================

function editMilestone(milestoneId) {
    showLoadingState('Loading milestone data...');
    
    fetch(`/admin-milestones/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': milestonesData.csrf_token
        },
        body: `action=get&milestone_id=${milestoneId}&csrfmiddlewaretoken=${milestonesData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            populateEditForm(data.milestone);
            openMilestoneModal();
        } else {
            showNotification('Error loading milestone data', 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification('Error loading milestone data', 'error');
    });
}

function populateEditForm(milestone) {
    currentEditingId = milestone.id;
    
    // Update modal title
    document.getElementById('milestoneModalTitle').textContent = 'Edit Milestone';
    
    // Populate form fields
    document.getElementById('milestoneId').value = milestone.id;
    document.getElementById('milestone_title').value = milestone.title;
    document.getElementById('milestone_description').value = milestone.description;
    document.getElementById('milestone_date').value = milestone.milestone_date;
    document.getElementById('display_order_milestone').value = milestone.display_order;
    document.getElementById('milestone_icon').value = milestone.icon || 'fa-flag';
    document.getElementById('milestone_featured').checked = milestone.featured;
    
    // Update icon preview
    updateIconPreview();
    
    // Handle image preview if exists
    if (milestone.image) {
        const imagePreview = document.getElementById('milestoneImagePreview');
        imagePreview.innerHTML = `<img src="${milestone.image}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
    }
}

function viewMilestone(milestoneId) {
    showLoadingState('Loading milestone details...');
    
    fetch(`/admin-milestones/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': milestonesData.csrf_token
        },
        body: `action=get&milestone_id=${milestoneId}&csrfmiddlewaretoken=${milestonesData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            populateViewModal(data.milestone);
            openViewMilestoneModal();
        } else {
            showNotification('Error loading milestone details', 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification('Error loading milestone details', 'error');
    });
}

function populateViewModal(milestone) {
    const modalContent = document.getElementById('viewMilestoneModalContent');
    const modalTitle = document.getElementById('viewMilestoneModalTitle');
    
    modalTitle.textContent = milestone.title;
    
    modalContent.innerHTML = `
        <div class="milestone-view-content">
            <div class="milestone-view-header">
                <div class="milestone-year-display">${milestone.milestone_year}</div>
                <div class="milestone-icon-display">
                    <i class="fas ${milestone.icon || 'fa-flag'}"></i>
                </div>
                ${milestone.featured ? '<div class="featured-indicator"><i class="fas fa-star"></i> Featured</div>' : ''}
            </div>
            
            ${milestone.image ? `
                <div class="milestone-view-image">
                    <img src="${milestone.image}" alt="${milestone.title}">
                </div>
            ` : ''}
            
            <div class="milestone-view-details">
                <div class="detail-section">
                    <h3>Milestone Information</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Date:</label>
                            <span>${milestone.milestone_date}</span>
                        </div>
                        <div class="detail-item">
                            <label>Year:</label>
                            <span class="year-badge">${milestone.milestone_year}</span>
                        </div>
                        <div class="detail-item">
                            <label>Display Order:</label>
                            <span>${milestone.display_order}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status:</label>
                            <span class="status-indicator ${milestone.featured ? 'featured' : 'standard'}">
                                ${milestone.featured ? 'Featured' : 'Standard'}
                            </span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Description</h3>
                    <div class="milestone-description">
                        ${milestone.description.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
}

function deleteMilestone(milestoneId) {
    if (!confirm('Are you sure you want to delete this milestone? This action cannot be undone.')) {
        return;
    }
    
    showLoadingState('Deleting milestone...');
    
    fetch(`/admin-milestones/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': milestonesData.csrf_token
        },
        body: `action=delete&milestone_id=${milestoneId}&csrfmiddlewaretoken=${milestonesData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            showNotification('Milestone deleted successfully', 'success');
            // Remove from display
            const milestoneElement = document.querySelector(`[data-id="${milestoneId}"]`);
            if (milestoneElement) {
                milestoneElement.style.opacity = '0';
                setTimeout(() => {
                    milestoneElement.remove();
                    updateStatsAfterDelete();
                }, 300);
            }
        } else {
            showNotification(data.message || 'Error deleting milestone', 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification('Error deleting milestone', 'error');
    });
}

// ================================
// FORM SUBMISSION
// ================================

function handleFormSubmission() {
    const form = document.getElementById('milestoneForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const action = currentEditingId ? 'update' : 'create';
        formData.append('action', action);
        
        if (currentEditingId) {
            formData.append('milestone_id', currentEditingId);
        }
        
        showLoadingState(currentEditingId ? 'Updating milestone...' : 'Creating milestone...');
        
        fetch('/admin-milestones/', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': milestonesData.csrf_token
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideLoadingState();
            
            if (data.success) {
                showNotification(
                    currentEditingId ? 'Milestone updated successfully' : 'Milestone created successfully',
                    'success'
                );
                closeMilestoneModal();
                // Reload page to show updated data
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                showNotification(data.message || 'Error saving milestone', 'error');
                if (data.errors) {
                    displayFormErrors(data.errors);
                }
            }
        })
        .catch(error => {
            hideLoadingState();
            console.error('Error:', error);
            showNotification('Error saving milestone', 'error');
        });
    });
}

// ================================
// BULK OPERATIONS
// ================================

function toggleSelectAllMilestones() {
    const selectAllCheckbox = document.getElementById('selectAllList');
    const checkboxes = document.querySelectorAll('.milestone-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateBulkActionButtons();
}

function updateBulkActionButtons() {
    const checkedBoxes = document.querySelectorAll('.milestone-checkbox:checked');
    const bulkButtons = document.querySelectorAll('.btn-bulk');
    
    bulkButtons.forEach(button => {
        button.disabled = checkedBoxes.length === 0;
        button.style.opacity = checkedBoxes.length === 0 ? '0.5' : '1';
    });
}

function bulkMilestoneAction(action) {
    const checkedBoxes = document.querySelectorAll('.milestone-checkbox:checked');
    const milestoneIds = Array.from(checkedBoxes).map(cb => cb.value);
    
    if (milestoneIds.length === 0) {
        showNotification('Please select milestones to perform bulk action', 'warning');
        return;
    }
    
    let confirmMessage = '';
    switch (action) {
        case 'feature':
            confirmMessage = `Feature ${milestoneIds.length} selected milestones?`;
            break;
        case 'delete':
            confirmMessage = `Delete ${milestoneIds.length} selected milestones? This action cannot be undone.`;
            break;
    }
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    showLoadingState(`Performing bulk ${action}...`);
    
    fetch('/admin-milestones/', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': milestonesData.csrf_token
        },
        body: `action=bulk_action&bulk_action=${action}&${milestoneIds.map(id => `milestone_ids[]=${id}`).join('&')}&csrfmiddlewaretoken=${milestonesData.csrf_token}`
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

function toggleMilestoneFeatured(milestoneId, checkbox) {
    const featured = checkbox.checked;
    
    fetch('/admin-milestones/', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': milestonesData.csrf_token
        },
        body: `action=toggle_featured&milestone_id=${milestoneId}&featured=${featured}&csrfmiddlewaretoken=${milestonesData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(`Milestone ${featured ? 'featured' : 'unfeatured'} successfully`, 'success');
        } else {
            // Revert checkbox if failed
            checkbox.checked = !featured;
            showNotification(data.message || 'Error updating milestone', 'error');
        }
    })
    .catch(error => {
        // Revert checkbox if failed
        checkbox.checked = !featured;
        console.error('Error:', error);
        showNotification('Error updating milestone', 'error');
    });
}

// ================================
// SPECIAL FUNCTIONS
// ================================

function generateTimeline() {
    showLoadingState('Generating timeline...');
    
    fetch('/admin-milestones/', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': milestonesData.csrf_token
        },
        body: 'action=generate_timeline'
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            showNotification('Timeline generated successfully', 'success');
            // You could open a modal with the timeline data here
            // For now, just show success
        } else {
            showNotification(data.message || 'Error generating timeline', 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification('Error generating timeline', 'error');
    });
}

function exportMilestones() {
    showLoadingState('Preparing export...');
    
    window.location.href = '/admin-milestones/?export=csv';
    
    setTimeout(() => {
        hideLoadingState();
    }, 2000);
}

// ================================
// IMAGE UPLOAD HANDLING
// ================================

function initImageUpload() {
    const fileInput = document.getElementById('milestone_image');
    const imagePreview = document.getElementById('milestoneImagePreview');
    
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
// UI HELPER FUNCTIONS
// ================================

function showLoadingState(message = 'Loading...') {
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
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
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
    document.querySelectorAll('.field-error').forEach(error => error.remove());
    
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
    const totalStat = document.querySelector('.stat-number');
    if (totalStat) {
        const currentCount = parseInt(totalStat.textContent);
        totalStat.textContent = currentCount - 1;
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
    
    // Setup icon input listener
    const iconInput = document.getElementById('milestone_icon');
    if (iconInput) {
        iconInput.addEventListener('input', updateIconPreview);
    }
    
    // Setup icon button clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('.icon-btn')) {
            const iconBtn = e.target.closest('.icon-btn');
            const iconClass = iconBtn.getAttribute('data-icon');
            selectIcon(iconClass);
        }
    });
    
    // Add event listeners for checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('milestone-checkbox')) {
            updateBulkActionButtons();
        }
    });
    
    // Initialize timeline animations on page load
    if (currentView === 'timeline') {
        setTimeout(() => {
            initializeTimelineAnimations();
        }, 500);
    }
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        const milestoneModal = document.getElementById('milestoneModal');
        const viewModal = document.getElementById('viewMilestoneModal');
        
        if (e.target === milestoneModal) {
            closeMilestoneModal();
        }
        if (e.target === viewModal) {
            closeViewMilestoneModal();
        }
    });
    
    // Handle ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="block"]');
            openModals.forEach(modal => {
                if (modal.id === 'milestoneModal') {
                    closeMilestoneModal();
                } else if (modal.id === 'viewMilestoneModal') {
                    closeViewMilestoneModal();
                }
            });
        }
    });
    
    console.log('Admin Milestones JavaScript initialized successfully');
});

// ================================
// ADDITIONAL STYLES
// ================================

if (!document.getElementById('milestonesStyles')) {
    const style = document.createElement('style');
    style.id = 'milestonesStyles';
    style.textContent = `
        /* Additional styles for milestones admin */
        .milestone-view-content {
            max-height: 70vh;
            overflow-y: auto;
        }
        
        .milestone-view-header {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: var(--gradient-mesh);
            border-radius: 12px;
            text-align: center;
        }
        
        .milestone-year-display {
            background: var(--primary-gold);
            color: var(--text-dark);
            padding: 1rem 2rem;
            border-radius: 20px;
            font-size: 1.5rem;
            font-weight: 700;
            box-shadow: 0 8px 20px var(--accent-glow);
        }
        
        .milestone-icon-display {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, var(--primary-gold), var(--primary-gold-light));
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            color: var(--text-dark);
            box-shadow: 0 12px 30px var(--accent-glow);
        }
        
        .featured-indicator {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: var(--text-dark);
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-size: 0.9rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .milestone-view-image {
            margin-bottom: 2rem;
            text-align: center;
        }
        
        .milestone-view-image img {
            max-width: 100%;
            max-height: 400px;
            border-radius: 12px;
            box-shadow: var(--shadow-primary);
        }
        
        .detail-section {
            margin-bottom: 2rem;
            padding-bottom: 1.5rem;
            border-bottom: 1px solid var(--border-glass);
        }
        
        .detail-section:last-child {
            border-bottom: none;
        }
        
        .detail-section h3 {
            color: var(--primary-gold);
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        
        .detail-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .detail-item {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
        }
        
        .detail-item label {
            font-weight: 600;
            color: var(--text-secondary);
            font-size: 0.9rem;
        }
        
        .year-badge {
            background: var(--primary-gold);
            color: var(--text-dark);
            padding: 0.25rem 0.75rem;
            border-radius: 16px;
            font-size: 0.8rem;
            font-weight: 600;
            width: fit-content;
        }
        
        .status-indicator {
            padding: 0.25rem 0.75rem;
            border-radius: 16px;
            font-size: 0.8rem;
            font-weight: 600;
            width: fit-content;
        }
        
        .status-indicator.featured {
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            color: var(--text-dark);
        }
        
        .status-indicator.standard {
            background: var(--bg-glass);
            color: var(--text-secondary);
            border: 1px solid var(--border-glass);
        }
        
        .milestone-description p {
            color: var(--text-secondary);
            line-height: 1.6;
            margin-bottom: 1rem;
        }
        
        .milestone-description p:last-child {
            margin-bottom: 0;
        }
        
        .field-error {
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        }
        
        /* Timeline view animations */
        .timeline-item {
            transition: all 0.6s ease;
        }
        
        .timeline-item:hover .milestone-card-timeline {
            transform: translateY(-5px);
            box-shadow: var(--shadow-hover);
        }
        
        /* Loading and notification styles inherited from achievements.js */
    `;
    document.head.appendChild(style);
}