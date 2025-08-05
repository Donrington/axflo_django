/* ================================
   ADMIN PORTFOLIO JAVASCRIPT
   Handles project management, modal interactions, and CRUD operations
   ================================ */

// Global variables
let currentEditingId = null;
let currentTab = 'basic';
let portfolioData = window.portfolioData || {};

// ================================
// MODAL MANAGEMENT
// ================================

function openProjectModal() {
    const modal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('projectModalTitle');
    const form = document.getElementById('projectForm');
    
    // Reset form and modal
    form.reset();
    currentEditingId = null;
    document.getElementById('projectId').value = '';
    modalTitle.textContent = 'Add New Project';
    
    // Reset to first tab
    switchTab('basic');
    
    // Clear image previews
    clearImagePreviews();
    
    // Show modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeProjectModal() {
    const modal = document.getElementById('projectModal');
    
    // Fade out and hide
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

function openViewProjectModal() {
    const modal = document.getElementById('viewProjectModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}

function closeViewProjectModal() {
    const modal = document.getElementById('viewProjectModal');
    
    modal.style.opacity = '0';
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }, 300);
}

// ================================
// TAB MANAGEMENT
// ================================

function switchTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    const selectedTab = document.getElementById(tabName + 'Tab');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    
    // Add active class to selected tab button
    const selectedBtn = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
    
    currentTab = tabName;
}

// ================================
// VIEW TOGGLE
// ================================

function toggleView(viewType) {
    // Hide all views
    document.getElementById('gridView').style.display = viewType === 'grid' ? 'grid' : 'none';
    document.getElementById('listView').style.display = viewType === 'list' ? 'block' : 'none';
    
    // Update active button
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewType}"]`).classList.add('active');
}

// ================================
// CRUD OPERATIONS
// ================================

function editProject(projectId) {
    showLoadingState('Loading project data...');
    
    fetch(`/admin-portfolio/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': portfolioData.csrf_token
        },
        body: `action=get&project_id=${projectId}&csrfmiddlewaretoken=${portfolioData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            populateEditForm(data.project);
            openProjectModal();
        } else {
            showNotification('Error loading project data', 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification('Error loading project data', 'error');
    });
}

function populateEditForm(project) {
    currentEditingId = project.id;
    
    // Update modal title
    document.getElementById('projectModalTitle').textContent = 'Edit Project';
    
    // Basic Info Tab
    document.getElementById('projectId').value = project.id;
    document.getElementById('project_title').value = project.title;
    document.getElementById('client').value = project.client;
    document.getElementById('location').value = project.location;
    document.getElementById('project_type_select').value = project.project_type;
    document.getElementById('brief_description').value = project.brief_description;
    
    // Details Tab
    document.getElementById('detailed_description').value = project.detailed_description || '';
    document.getElementById('challenge').value = project.challenge || '';
    document.getElementById('solution').value = project.solution || '';
    document.getElementById('results').value = project.results || '';
    document.getElementById('start_date').value = project.start_date;
    document.getElementById('completion_date').value = project.completion_date || '';
    document.getElementById('duration_months').value = project.duration_months || '';
    document.getElementById('project_value').value = project.project_value || '';
    
    // Media Tab
    if (project.featured_image) {
        const preview = document.getElementById('projectImagePreview');
        preview.innerHTML = `<img src="${project.featured_image}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">`;
    }
    if (project.before_image) {
        const preview = document.getElementById('beforeImagePreview');
        preview.innerHTML = `<img src="${project.before_image}" alt="Before" style="max-width: 100%; max-height: 150px; border-radius: 8px;">`;
    }
    if (project.after_image) {
        const preview = document.getElementById('afterImagePreview');
        preview.innerHTML = `<img src="${project.after_image}" alt="After" style="max-width: 100%; max-height: 150px; border-radius: 8px;">`;
    }
    document.getElementById('gallery_images').value = project.gallery_images || '[]';
    
    // Metrics Tab
    document.getElementById('environmental_impact').value = project.environmental_impact || '{}';
    document.getElementById('key_statistics').value = project.key_statistics || '{}';
    document.getElementById('meta_description').value = project.meta_description || '';
    document.getElementById('tags').value = project.tags || '';
    document.getElementById('project_status').value = project.status;
    document.getElementById('display_order_project').value = project.display_order;
    document.getElementById('featured_on_homepage').checked = project.featured_on_homepage;
}

function viewProject(projectId) {
    showLoadingState('Loading project details...');
    
    fetch(`/admin-portfolio/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': portfolioData.csrf_token
        },
        body: `action=get&project_id=${projectId}&csrfmiddlewaretoken=${portfolioData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            populateViewModal(data.project);
            openViewProjectModal();
        } else {
            showNotification('Error loading project details', 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification('Error loading project details', 'error');
    });
}

function populateViewModal(project) {
    const modalContent = document.getElementById('viewProjectModalContent');
    const modalTitle = document.getElementById('viewProjectModalTitle');
    
    modalTitle.textContent = project.title;
    
    modalContent.innerHTML = `
        <div class="project-view-content">
            ${project.featured_image ? `
                <div class="project-view-image">
                    <img src="${project.featured_image}" alt="${project.title}">
                </div>
            ` : ''}
            
            <div class="project-view-details">
                <div class="detail-section">
                    <h3>Project Information</h3>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Client:</label>
                            <span>${project.client}</span>
                        </div>
                        <div class="detail-item">
                            <label>Location:</label>
                            <span>${project.location}</span>
                        </div>
                        <div class="detail-item">
                            <label>Type:</label>
                            <span class="project-type-badge">${project.project_type_display}</span>
                        </div>
                        <div class="detail-item">
                            <label>Status:</label>
                            <span class="status-badge status-${project.status.toLowerCase()}">${project.status_display}</span>
                        </div>
                        <div class="detail-item">
                            <label>Start Date:</label>
                            <span>${project.start_date}</span>
                        </div>
                        ${project.completion_date ? `
                            <div class="detail-item">
                                <label>Completion Date:</label>
                                <span>${project.completion_date}</span>
                            </div>
                        ` : ''}
                        ${project.duration_months ? `
                            <div class="detail-item">
                                <label>Duration:</label>
                                <span>${project.duration_months} months</span>
                            </div>
                        ` : ''}
                        ${project.project_value ? `
                            <div class="detail-item">
                                <label>Project Value:</label>
                                <span>$${parseFloat(project.project_value).toLocaleString()}</span>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Description</h3>
                    <p>${project.brief_description}</p>
                    ${project.detailed_description ? `<p>${project.detailed_description}</p>` : ''}
                </div>
                
                ${project.challenge ? `
                    <div class="detail-section">
                        <h3>Challenge</h3>
                        <p>${project.challenge}</p>
                    </div>
                ` : ''}
                
                ${project.solution ? `
                    <div class="detail-section">
                        <h3>Solution</h3>
                        <p>${project.solution}</p>
                    </div>
                ` : ''}
                
                ${project.results ? `
                    <div class="detail-section">
                        <h3>Results</h3>
                        <p>${project.results}</p>
                    </div>
                ` : ''}
                
                ${project.before_image || project.after_image ? `
                    <div class="detail-section">
                        <h3>Before & After</h3>
                        <div class="before-after-grid">
                            ${project.before_image ? `
                                <div class="before-after-item">
                                    <h4>Before</h4>
                                    <img src="${project.before_image}" alt="Before">
                                </div>
                            ` : ''}
                            ${project.after_image ? `
                                <div class="before-after-item">
                                    <h4>After</h4>
                                    <img src="${project.after_image}" alt="After">
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
                
                ${project.environmental_impact && project.environmental_impact !== '{}' ? `
                    <div class="detail-section">
                        <h3>Environmental Impact</h3>
                        <pre class="metrics-display">${JSON.stringify(JSON.parse(project.environmental_impact), null, 2)}</pre>
                    </div>
                ` : ''}
                
                ${project.key_statistics && project.key_statistics !== '{}' ? `
                    <div class="detail-section">
                        <h3>Key Statistics</h3>
                        <pre class="metrics-display">${JSON.stringify(JSON.parse(project.key_statistics), null, 2)}</pre>
                    </div>
                ` : ''}
                
                ${project.tags ? `
                    <div class="detail-section">
                        <h3>Tags</h3>
                        <div class="tags-container">
                            ${project.tags.split(',').map(tag => `<span class="tag">${tag.trim()}</span>`).join('')}
                        </div>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function deleteProject(projectId) {
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        return;
    }
    
    showLoadingState('Deleting project...');
    
    fetch(`/admin-portfolio/`, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': portfolioData.csrf_token
        },
        body: `action=delete&project_id=${projectId}&csrfmiddlewaretoken=${portfolioData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        hideLoadingState();
        
        if (data.success) {
            showNotification('Project deleted successfully', 'success');
            // Remove from display
            const projectCard = document.querySelector(`[data-id="${projectId}"]`);
            if (projectCard) {
                projectCard.style.opacity = '0';
                setTimeout(() => {
                    projectCard.remove();
                    updateStatsAfterDelete();
                }, 300);
            }
        } else {
            showNotification(data.message || 'Error deleting project', 'error');
        }
    })
    .catch(error => {
        hideLoadingState();
        console.error('Error:', error);
        showNotification('Error deleting project', 'error');
    });
}

// ================================
// FORM SUBMISSION
// ================================

function handleFormSubmission() {
    const form = document.getElementById('projectForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const action = currentEditingId ? 'update' : 'create';
        formData.append('action', action);
        
        if (currentEditingId) {
            formData.append('project_id', currentEditingId);
        }
        
        showLoadingState(currentEditingId ? 'Updating project...' : 'Creating project...');
        
        fetch('/admin-portfolio/', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': portfolioData.csrf_token
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideLoadingState();
            
            if (data.success) {
                showNotification(
                    currentEditingId ? 'Project updated successfully' : 'Project created successfully',
                    'success'
                );
                closeProjectModal();
                // Reload page to show updated data
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                showNotification(data.message || 'Error saving project', 'error');
                if (data.errors) {
                    displayFormErrors(data.errors);
                }
            }
        })
        .catch(error => {
            hideLoadingState();
            console.error('Error:', error);
            showNotification('Error saving project', 'error');
        });
    });
}

// ================================
// BULK OPERATIONS
// ================================

function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAllList');
    const checkboxes = document.querySelectorAll('.project-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateBulkActionButtons();
}

function updateBulkActionButtons() {
    const checkedBoxes = document.querySelectorAll('.project-checkbox:checked');
    const bulkButtons = document.querySelectorAll('.btn-bulk');
    
    bulkButtons.forEach(button => {
        button.disabled = checkedBoxes.length === 0;
        button.style.opacity = checkedBoxes.length === 0 ? '0.5' : '1';
    });
}

function bulkAction(action) {
    const checkedBoxes = document.querySelectorAll('.project-checkbox:checked');
    const projectIds = Array.from(checkedBoxes).map(cb => cb.value);
    
    if (projectIds.length === 0) {
        showNotification('Please select projects to perform bulk action', 'warning');
        return;
    }
    
    let confirmMessage = '';
    switch (action) {
        case 'feature':
            confirmMessage = `Feature ${projectIds.length} selected projects?`;
            break;
        case 'archive':
            confirmMessage = `Archive ${projectIds.length} selected projects?`;
            break;
        case 'delete':
            confirmMessage = `Delete ${projectIds.length} selected projects? This action cannot be undone.`;
            break;
    }
    
    if (!confirm(confirmMessage)) {
        return;
    }
    
    showLoadingState(`Performing bulk ${action}...`);
    
    fetch('/admin-portfolio/', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': portfolioData.csrf_token
        },
        body: `action=bulk_action&bulk_action=${action}&${projectIds.map(id => `project_ids[]=${id}`).join('&')}&csrfmiddlewaretoken=${portfolioData.csrf_token}`
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

function toggleProjectFeatured(projectId, checkbox) {
    const featured = checkbox.checked;
    
    fetch('/admin-portfolio/', {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': portfolioData.csrf_token
        },
        body: `action=toggle_featured&project_id=${projectId}&featured=${featured}&csrfmiddlewaretoken=${portfolioData.csrf_token}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showNotification(`Project ${featured ? 'featured' : 'unfeatured'} successfully`, 'success');
        } else {
            // Revert checkbox if failed
            checkbox.checked = !featured;
            showNotification(data.message || 'Error updating project', 'error');
        }
    })
    .catch(error => {
        // Revert checkbox if failed
        checkbox.checked = !featured;
        console.error('Error:', error);
        showNotification('Error updating project', 'error');
    });
}

// ================================
// EXPORT/IMPORT FUNCTIONALITY
// ================================

function exportProjects() {
    showLoadingState('Preparing export...');
    
    window.location.href = '/admin-portfolio/?export=csv';
    
    setTimeout(() => {
        hideLoadingState();
    }, 2000);
}

function importProjects() {
    showNotification('Import functionality coming soon', 'info');
}

// ================================
// IMAGE UPLOAD HANDLING
// ================================

function initImageUpload() {
    const imageInputs = [
        { input: 'featured_image_project', preview: 'projectImagePreview' },
        { input: 'before_image', preview: 'beforeImagePreview' },
        { input: 'after_image', preview: 'afterImagePreview' }
    ];
    
    imageInputs.forEach(({ input, preview }) => {
        const fileInput = document.getElementById(input);
        const imagePreview = document.getElementById(preview);
        
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
            setupDragAndDrop(imagePreview, fileInput);
        }
    });
}

function setupDragAndDrop(preview, input) {
    preview.addEventListener('dragover', function(e) {
        e.preventDefault();
        preview.style.borderColor = 'var(--primary-gold)';
        preview.style.backgroundColor = 'var(--bg-glass-hover)';
    });
    
    preview.addEventListener('dragleave', function(e) {
        e.preventDefault();
        preview.style.borderColor = '';
        preview.style.backgroundColor = '';
    });
    
    preview.addEventListener('drop', function(e) {
        e.preventDefault();
        preview.style.borderColor = '';
        preview.style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            input.files = files;
            input.dispatchEvent(new Event('change'));
        }
    });
}

function clearImagePreviews() {
    const previews = [
        'projectImagePreview',
        'beforeImagePreview',
        'afterImagePreview'
    ];
    
    previews.forEach(previewId => {
        const preview = document.getElementById(previewId);
        if (preview) {
            const defaultTexts = {
                'projectImagePreview': 'Click to upload or drag image here',
                'beforeImagePreview': 'Before image',
                'afterImagePreview': 'After image'
            };
            
            preview.innerHTML = `
                <i class="fas fa-image"></i>
                <span>${defaultTexts[previewId]}</span>
            `;
        }
    });
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
    
    // Add event listeners for checkboxes
    document.addEventListener('change', function(e) {
        if (e.target.classList.contains('project-checkbox')) {
            updateBulkActionButtons();
        }
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        const projectModal = document.getElementById('projectModal');
        const viewModal = document.getElementById('viewProjectModal');
        
        if (e.target === projectModal) {
            closeProjectModal();
        }
        if (e.target === viewModal) {
            closeViewProjectModal();
        }
    });
    
    // Handle ESC key to close modals
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal[style*="block"]');
            openModals.forEach(modal => {
                if (modal.id === 'projectModal') {
                    closeProjectModal();
                } else if (modal.id === 'viewProjectModal') {
                    closeViewProjectModal();
                }
            });
        }
    });
    
    console.log('Admin Portfolio JavaScript initialized successfully');
});

// ================================
// ADDITIONAL STYLES
// ================================

if (!document.getElementById('portfolioStyles')) {
    const style = document.createElement('style');
    style.id = 'portfolioStyles';
    style.textContent = `
        /* Additional styles for portfolio admin */
        .project-view-content {
            max-height: 70vh;
            overflow-y: auto;
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
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
        
        .project-type-badge {
            background: var(--bg-glass);
            color: var(--primary-gold);
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            width: fit-content;
        }
        
        .before-after-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .before-after-item h4 {
            color: var(--text-primary);
            margin-bottom: 0.5rem;
            font-size: 1rem;
        }
        
        .before-after-item img {
            width: 100%;
            border-radius: 8px;
            box-shadow: var(--shadow-primary);
        }
        
        .tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        
        .tag {
            background: var(--bg-glass);
            color: var(--text-primary);
            padding: 0.25rem 0.75rem;
            border-radius: 16px;
            font-size: 0.8rem;
            border: 1px solid var(--border-glass);
        }
        
        .metrics-display {
            background: var(--bg-glass);
            border: 1px solid var(--border-glass);
            border-radius: 8px;
            padding: 1rem;
            font-size: 0.8rem;
            color: var(--text-primary);
            margin-top: 0.5rem;
        }
    `;
    document.head.appendChild(style);
}