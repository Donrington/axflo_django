
        // Initialize AOS
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });

        // Modal functionality
        function openModal(jobTitle) {
            const modal = document.getElementById('applicationModal');
            const modalTitle = document.getElementById('modalTitle');
            modalTitle.textContent = `Apply for ${jobTitle}`;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            const modal = document.getElementById('applicationModal');
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            document.getElementById('applicationForm').reset();
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
            
            // Show success message
            alert('Thank you for your application! We will review your submission and contact you within 5-7 business days.');
            
            // Close modal and reset form
            closeModal();
            
            // In a real application, you would send the form data to your server
            console.log('Application submitted');
        }

        // Escape key to close modal
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeModal();
            }
        });
    