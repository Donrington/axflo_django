/* ================================
   ADMIN CATEGORIES JAVASCRIPT
   Handles category management, color/icon selection, and CRUD operations
   ================================ */

// Global variables
let currentEditingId = null;
let categoryData = window.categoryData || {};

// ================================
// MODAL MANAGEMENT
// ================================

function openCategoryModal() {
    const modal = document.getElementById('categoryModal');
    const modalTitle = document.getElementById('categoryModalTitle');
    const form = document.getElementById('categoryForm');
    
    // Reset form and modal
    form.reset();
    currentEditingId = null;
    document.getElementById('categoryId').value = '';
    modalTitle.textContent = 'Add New Category';
    
    // Reset color and icon previews to defaults
    resetPreviews();
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeCategoryModal() {
    const modal = document.getElementById('categoryModal');
    
    // Fade out and hide
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

function openViewCategoryModal() {
    const modal = document.getElementById('viewCategoryModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeViewCategoryModal() {
    const modal = document.getElementById('viewCategoryModal');
    
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

function openColorPickerModal() {
    const modal = document.getElementById('colorPickerModal');
    populateColorGrid();
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeColorPickerModal() {
    const modal = document.getElementById('colorPickerModal');
    
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// ================================
// COLOR AND ICON MANAGEMENT
// ================================

function resetPreviews() {
    // Reset icon preview
    const iconPreview = document.getElementById('iconPreview');
    const iconInput = document.getElementById('category_icon');
    if (iconPreview && iconInput) {
        iconInput.value = 'fa-trophy';
        iconPreview.className = 'fas fa-trophy';
    }
    
    // Reset color preview
    const colorInput = document.getElementById('category_color');
    const colorPreview = document.querySelector('.color-preview');
    if (colorInput && colorPreview) {
        colorInput.value = '#d6a019';
        colorPreview.style.backgroundColor = '#d6a019';
    }
    
    // Update preview card
    updatePreviewCard();
}

function updateIconPreview() {
    const iconInput = document.getElementById('category_icon');
    const iconPreview = document.getElementById('iconPreview');
    const previewIcon = document.querySelector('.preview-icon i');
    
    if (iconInput && iconPreview) {
        const iconValue = iconInput.value || 'fa-trophy';
        iconPreview.className = `fas ${iconValue}`;
        
        if (previewIcon) {
            previewIcon.className = `fas ${iconValue}`;
        }
    }
}

function updateColorPreview() {
    const colorInput = document.getElementById('category_color');
    const colorPreview = document.querySelector('.color-preview');
    const previewHeader = document.querySelector('.preview-header');
    const previewIcon = document.querySelector('.preview-icon');
    
    if (colorInput && colorPreview) {
        const colorValue = colorInput.value || '#d6a019';
        colorPreview.style.backgroundColor = colorValue;
        
        if (previewHeader) {
            previewHeader.style.background = `linear-gradient(135deg, ${colorValue}22 0%, ${colorValue}44 100%)`;
        }
        
        if (previewIcon) {
            previewIcon.style.backgroundColor = colorValue;
        }
    }
}

function updatePreviewCard() {
    updateIconPreview();
    updateColorPreview();
}

function selectIcon(iconClass) {
    const iconInput = document.getElementById('category_icon');
    if (iconInput) {
        iconInput.value = iconClass;
        updateIconPreview();
    }
}

function selectColor(color) {
    const colorInput = document.getElementById('category_color');
    if (colorInput) {
        colorInput.value = color;
        updateColorPreview();
    }
}

function populateColorGrid() {
    const colorGrid = document.querySelector('.color-picker-grid');
    if (!colorGrid) return;
    
    const colors = [
        '#d6a019', '#ffcc00', '#4facfe', '#43a047', '#e53935', '#fb8c00',
        '#8e24aa', '#00acc1', '#795548', '#607d8b', '#ff5722', '#9c27b0',
        '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688',
        '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800'
    ];
    
    colorGrid.innerHTML = colors.map(color => 
        `<div class="color-option" style="background-color: ${color};" 
              onclick="applyColor('${color}')" title="${color}"></div>`
    ).join('');
}

function applyColor(color) {
    selectColor(color);
    closeColorPickerModal();
}

function applyCustomColor() {
    const customColorInput = document.getElementById('customColor');
    if (customColorInput && customColorInput.value) {
        applyColor(customColorInput.value);
    }
}

// ================================
// CRUD OPERATIONS
// ================================

function editCategory(categoryId) {
    showLoadingState('Loading category data...');
    
    fetch(`/admin-achievement-categories/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': categoryData.csrf_token
        },
        body: `action=get&category_id=${categoryId}&csrfmiddlewaretoken=${categoryData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            populateEditForm(data.category);
            openCategoryModal();
        } else {
            showNotification('Error loading category data', 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification('Error loading category data', 'error');
    });
}

function populateEditForm(category) {
    currentEditingId = category.id;
    
    // Update modal title
    document.getElementById('categoryModalTitle').textContent = 'Edit Category';
    
    // Populate form fields
    document.getElementById('categoryId').value = category.id;
    document.getElementById('category_name').value = category.name;
    document.getElementById('category_description').value = category.description || '';
    document.getElementById('category_icon').value = category.icon || 'fa-trophy';
    document.getElementById('category_color').value = category.color || '#d6a019';
    
    // Update previews
    updatePreviewCard();
}

function viewCategoryAchievements(categoryId) {
    showLoadingState('Loading category achievements...');
    
    fetch(`/admin-achievement-categories/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': categoryData.csrf_token
        },
        body: `action=view_achievements&category_id=${categoryId}&csrfmiddlewaretoken=${categoryData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            populateAchievementsModal(data.category, data.achievements);
            openViewCategoryModal();
        } else {
            showNotification('Error loading category achievements', 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification('Error loading category achievements', 'error');
    });
}

function populateAchievementsModal(category, achievements) {
    const modalContent = document.getElementById('viewCategoryModalContent');
    const modalTitle = document.getElementById('viewCategoryModalTitle');
    
    modalTitle.textContent = `${category.name} - Achievements`;
    
    modalContent.innerHTML = `
        <div class="category-achievements-content">
            <div class="category-info">
                <div class="category-header-display" style="background: linear-gradient(135deg, ${category.color}22 0%, ${category.color}44 100%);">
                    <div class="category-icon-display" style="background-color: ${category.color};">
                        <i class="fas ${category.icon || 'fa-trophy'}"></i>
                    </div>
                    <div class="category-details">
                        <h3>${category.name}</h3>
                        <p>${category.description || 'No description provided'}</p>
                        <div class="category-stats-display">
                            <span class="stat-item">${achievements.length} achievements</span>
                            <span class="color-dot" style="background-color: ${category.color};"></span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="achievements-list">
                ${achievements.length > 0 ? `
                    <h4>Achievements in this category:</h4>
                    <div class="achievements-grid">
                        ${achievements.map(achievement => `
                            <div class="achievement-item">
                                <div class="achievement-icon">
                                    ${achievement.featured_image ? 
                                        `<img src="${achievement.featured_image}" alt="${achievement.title}">` :
                                        `<i class="fas fa-trophy"></i>`
                                    }
                                </div>
                                <div class="achievement-info">
                                    <h5>${achievement.title}</h5>
                                    <p class="achievement-type">${achievement.achievement_type_display}</p>
                                    <p class="achievement-date">${achievement.achievement_date}</p>
                                    ${achievement.featured ? '<span class="featured-indicator"><i class="fas fa-star"></i> Featured</span>' : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : `
                    <div class="no-achievements">
                        <i class="fas fa-info-circle"></i>
                        <p>No achievements in this category yet.</p>
                        <a href="/admin-achievements/" class="btn-primary">
                            <i class="fas fa-plus"></i> Add Achievement
                        </a>
                    </div>
                `}
            </div>
        </div>
    `;
}

function changeColor(categoryId) {
    currentEditingId = categoryId;
    openColorPickerModal();
}

function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
        return;
    }
    
    showLoadingState('Deleting category...');
    
    fetch(`/admin-achievement-categories/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': categoryData.csrf_token
        },
        body: `action=delete&category_id=${categoryId}&csrfmiddlewaretoken=${categoryData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            showNotification('Category deleted successfully', 'success');
            // Remove from display
            const categoryCard = document.querySelector(`[data-id="${categoryId}"]`);
            if (categoryCard) {
                categoryCard.style.opacity = '0';
                setTimeout(() => {
                    categoryCard.remove();
                    updateStatsAfterDelete();
                }, 300);
            }
        } else {
            showNotification(data.message || 'Error deleting category', 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification('Error deleting category', 'error');
    });
}

// ================================
// FORM SUBMISSION
// ================================

function handleFormSubmission() {
    const form = document.getElementById('categoryForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const action = currentEditingId ? 'update' : 'create';
        formData.append('action', action);
        
        if (currentEditingId) {
            formData.append('category_id', currentEditingId);
        }
        
        showLoadingState(currentEditingId ? 'Updating category...' : 'Creating category...');
        
        fetch('/admin-achievement-categories/', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': categoryData.csrf_token
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideLoadingState();
            
            if (data.success) {
                showNotification(
                    currentEditingId ? 'Category updated successfully' : 'Category created successfully',
                    'success'
                );
                closeCategoryModal();
                // Reload page to show updated data
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                showNotification(data.message || 'Error saving category', 'error');
                if (data.errors) {
                    displayFormErrors(data.errors);
                }
            }
        })
        .catch(error => {
            hideLoadingState();
            console.error('Error:', error);
            showNotification('Error saving category', 'error');
        });
    });
}

// ================================
// REORDER FUNCTIONALITY
// ================================

function reorderCategories() {
    showNotification('Drag and drop reordering coming soon', 'info');
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
// EVENT LISTENERS SETUP
// ================================

function setupEventListeners() {
    // Icon input change
    const iconInput = document.getElementById('category_icon');
    if (iconInput) {
        iconInput.addEventListener('input', updateIconPreview);
    }
    
    // Color input change
    const colorInput = document.getElementById('category_color');
    if (colorInput) {
        colorInput.addEventListener('input', updateColorPreview);
    }
    
    // Icon button clicks
    document.addEventListener('click', function(e) {
        if (e.target.closest('.icon-btn')) {
            const iconBtn = e.target.closest('.icon-btn');
            const iconClass = iconBtn.getAttribute('data-icon');
            selectIcon(iconClass);
        }
        
        if (e.target.closest('.color-preset')) {
            const colorBtn = e.target.closest('.color-preset');
            const color = colorBtn.getAttribute('data-color');
            selectColor(color);
        }
    });
}

// ================================
// INITIALIZATION
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize form submission handler
    handleFormSubmission();
    
    // Setup event listeners
    setupEventListeners();
    
    // Initialize previews
    updatePreviewCard();
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        const categoryModal = document.getElementById('categoryModal');
        const viewModal = document.getElementById('viewCategoryModal');
        const colorModal = document.getElementById('colorPickerModal');
        
        if (e.target === categoryModal) {
            closeCategoryModal();
        }
        if (e.target === viewModal) {
            closeViewCategoryModal();
        }
        if (e.target === colorModal) {
            closeColorPickerModal();
        }
    });
    
    // Handle ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="block"]');
            openModals.forEach(modal => {
                if (modal.id === 'categoryModal') {
                    closeCategoryModal();
                } else if (modal.id === 'viewCategoryModal') {
                    closeViewCategoryModal();
                } else if (modal.id === 'colorPickerModal') {
                    closeColorPickerModal();
                }
            });
        }
    });
    
    console.log('Admin Categories JavaScript initialized successfully');
});

// ================================
// ADDITIONAL STYLES
// ================================

if (!document.getElementById('categoriesStyles')) {
    const style = document.createElement('style');
    style.id = 'categoriesStyles';
    style.textContent = `
        /* Additional styles for categories admin */
        .category-achievements-content {
            max-height: 70vh;
            overflow-y: auto;
        }
        
        .category-header-display {
            padding: 1.5rem;
            border-radius: 12px;
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
        }
        
        .category-icon-display {
            width: 60px;
            height: 60px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.5rem;
            color: var(--text-dark);
            flex-shrink: 0;
        }
        
        .category-details h3 {
            color: var(--text-primary);
            margin: 0 0 0.5rem 0;
            font-size: 1.3rem;
        }
        
        .category-details p {
            color: var(--text-secondary);
            margin: 0 0 0.75rem 0;
            line-height: 1.4;
        }
        
        .category-stats-display {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .stat-item {
            background: var(--bg-glass);
            padding: 0.25rem 0.75rem;
            border-radius: 12px;
            font-size: 0.8rem;
            color: var(--text-secondary);
        }
        
        .color-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid var(--border-glass);
        }
        
        .achievements-list h4 {
            color: var(--primary-gold);
            margin-bottom: 1rem;
            font-size: 1.1rem;
        }
        
        .achievements-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1rem;
        }
        
        .achievement-item {
            background: var(--bg-glass);
            border: 1px solid var(--border-glass);
            border-radius: 12px;
            padding: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: var(--transition-smooth);
        }
        
        .achievement-item:hover {
            background: var(--bg-glass-hover);
            border-color: var(--primary-gold);
        }
        
        .achievement-icon {
            width: 40px;
            height: 40px;
            border-radius: 8px;
            overflow: hidden;
            background: var(--bg-glass);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        
        .achievement-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        
        .achievement-icon i {
            color: var(--primary-gold);
            font-size: 1.2rem;
        }
        
        .achievement-info h5 {
            color: var(--text-primary);
            margin: 0 0 0.25rem 0;
            font-size: 1rem;
            line-height: 1.2;
        }
        
        .achievement-type {
            color: var(--text-tertiary);
            margin: 0 0 0.25rem 0;
            font-size: 0.8rem;
        }
        
        .achievement-date {
            color: var(--text-secondary);
            margin: 0 0 0.25rem 0;
            font-size: 0.8rem;
        }
        
        .featured-indicator {
            color: var(--primary-gold);
            font-size: 0.8rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        }
        
        .no-achievements {
            text-align: center;
            padding: 2rem;
            color: var(--text-tertiary);
        }
        
        .no-achievements i {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }
        
        .no-achievements p {
            margin-bottom: 1.5rem;
        }
        
        .color-option {
            width: 30px;
            height: 30px;
            border-radius: 6px;
            cursor: pointer;
            border: 2px solid var(--border-glass);
            transition: all 0.2s ease;
        }
        
        .color-option:hover {
            border-color: var(--text-primary);
            transform: scale(1.1);
        }
        
        .color-picker-grid {
            display: grid;
            grid-template-columns: repeat(8, 1fr);
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }
        
        .custom-color-section {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding-top: 1rem;
            border-top: 1px solid var(--border-glass);
        }
        
        .custom-color-section label {
            color: var(--text-secondary);
            font-weight: 500;
        }
        
        .field-error {
            color: #dc3545;
            font-size: 0.8rem;
            margin-top: 0.25rem;
        }
    `;
    document.head.appendChild(style);
}