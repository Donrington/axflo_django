
        // Initialize AOS
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });

        // Modal functionality
        let currentJobId = null;
        
        function openModal(jobTitle, jobId = null) {
            const modal = document.getElementById('applicationModal');
            const modalTitle = document.getElementById('modalTitle');
            const jobIdInput = document.getElementById('jobId');
            currentJobId = jobId;
            
            if (jobId) {
                modalTitle.textContent = `Apply for ${jobTitle}`;
                jobIdInput.value = jobId;
            } else {
                modalTitle.textContent = `Submit Your Resume - ${jobTitle}`;
                jobIdInput.value = '';
            }
            
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            const modal = document.getElementById('applicationModal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.getElementById('applicationForm').reset();
            document.getElementById('jobId').value = '';
            currentJobId = null;
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('applicationModal');
            if (event.target === modal) {
                closeModal();
            }
        }

        // File upload display
        document.getElementById('resume').addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name;
            if (fileName) {
                e.target.nextElementSibling.textContent = `📄 ${fileName}`;
            }
        });

        document.getElementById('portfolio').addEventListener('change', function(e) {
            const fileCount = e.target.files.length;
            if (fileCount > 0) {
                e.target.nextElementSibling.textContent = `📎 ${fileCount} file(s) selected`;
            }
        });

        // Form submission
        function submitApplication(event) {
            event.preventDefault();
            
            const form = event.target;
            const formData = new FormData(form);
            
            // Log form submission
            console.log('Submitting application...');
            
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;
            
            // Submit form via AJAX
            fetch('/submit-job-application/', {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    showCustomMessage(data.message, 'success');
                    closeModal();
                } else {
                    showCustomMessage('Error: ' + data.message, 'error');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showCustomMessage('An error occurred while submitting your application. Please try again.', 'error');
            })
            .finally(() => {
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        }

        // Custom message display function
        function showCustomMessage(message, type) {
            // Remove any existing message
            const existingMessage = document.querySelector('.custom-message');
            if (existingMessage) {
                existingMessage.remove();
            }
            
            // Create message element
            const messageDiv = document.createElement('div');
            messageDiv.className = `custom-message custom-message-${type}`;
            messageDiv.innerHTML = `
                <div class="message-content">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                    <span>${message}</span>
                    <button class="message-close" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            // Add to page
            document.body.appendChild(messageDiv);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.remove();
                }
            }, 5000);
        }

        // Escape key to close modal
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    