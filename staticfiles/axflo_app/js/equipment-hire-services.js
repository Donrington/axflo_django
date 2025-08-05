
        // Initialize AOS
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });

        // Gallery Filter functionality
        function filterGallery(category) {
            const galleryItems = document.querySelectorAll('.gallery-item');
            const filterButtons = document.querySelectorAll('.filter-btn');
            
            // Update active button
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.style.background = 'rgba(255, 255, 255, 0.1)';
                btn.style.borderColor = 'var(--glass-border)';
            });
            
            event.target.classList.add('active');
            event.target.style.background = 'linear-gradient(135deg, var(--primary-gold) 0%, #ff8c00 100%)';
            event.target.style.borderColor = 'var(--primary-gold)';
            
            // Filter items with enhanced animation
            galleryItems.forEach((item, index) => {
                if (category === 'all' || item.dataset.category === category) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8) translateY(20px)';
                    
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1) translateY(0)';
                    }, index * 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8) translateY(-20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        }

        // Enhanced gallery item hover effects
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('mouseenter', function() {
                const img = this.querySelector('img');
                const info = this.querySelector('.gallery-info');
                const overlay = this.querySelector('.image-overlay');
                
                // Scale and brighten image
                if (img) {
                    img.style.transform = 'scale(1.1)';
                    img.style.filter = 'brightness(1.1) contrast(1.1)';
                }
                
                // Show info panel
                if (info) {
                    info.style.transform = 'translateY(0)';
                }
                
                // Enhance overlay effect
                if (overlay) {
                    overlay.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(214, 160, 25, 0.3) 100%)';
                }
                
                // Add glow effect
                this.style.boxShadow = '0 25px 50px rgba(214, 160, 25, 0.3), 0 0 50px rgba(214, 160, 25, 0.1)';
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            item.addEventListener('mouseleave', function() {
                const img = this.querySelector('img');
                const info = this.querySelector('.gallery-info');
                const overlay = this.querySelector('.image-overlay');
                
                // Reset image
                if (img) {
                    img.style.transform = 'scale(1)';
                    img.style.filter = 'brightness(1) contrast(1)';
                }
                
                // Hide info panel
                if (info) {
                    info.style.transform = 'translateY(100%)';
                }
                
                // Reset overlay
                if (overlay) {
                    const category = this.dataset.category;
                    let overlayColor = 'rgba(214, 160, 25, 0.2)';
                    if (category === 'tools') overlayColor = 'rgba(220, 20, 60, 0.2)';
                    else if (category === 'transport') overlayColor = 'rgba(70, 130, 180, 0.2)';
                    else if (category === 'testing') overlayColor = 'rgba(46, 125, 50, 0.2)';
                    
                    overlay.style.background = `linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, ${overlayColor} 100%)`;
                }
                
                // Reset glow effect
                this.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.1)';
                this.style.transform = 'translateY(0) scale(1)';
            });
            
            // Click to expand functionality
            item.addEventListener('click', function() {
                openEquipmentModal(this);
            });
        });

        // Animate gallery stats when visible
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statNumber = entry.target.querySelector('.stat-number');
                    if (statNumber && !statNumber.classList.contains('animated')) {
                        statNumber.classList.add('animated');
                        animateCounter(statNumber);
                    }
                }
            });
        });

        document.querySelectorAll('.stat-item').forEach(item => {
            statsObserver.observe(item);
        });

        function animateCounter(element) {
            const target = element.textContent.replace(/[^0-9]/g, '');
            const isPercentage = element.textContent.includes('%');
            const hasPlus = element.textContent.includes('+');
            const isTime = element.textContent.includes('/');
            
            let current = 0;
            const increment = parseInt(target) / 50;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= parseInt(target)) {
                    let finalText = target;
                    if (isPercentage) finalText += '%';
                    else if (hasPlus) finalText += '+';
                    else if (isTime) finalText = '24/7';
                    element.textContent = finalText;
                    clearInterval(timer);
                } else {
                    let displayValue = Math.floor(current);
                    let currentText = displayValue.toString();
                    if (isPercentage) currentText += '%';
                    else if (hasPlus) currentText += '+';
                    else if (isTime) currentText = Math.floor(current) + '/7';
                    element.textContent = currentText;
                }
            }, 30);
        }

        // Dashboard functionality
        function showDashboard(dashboardId) {
            // Hide all dashboard contents
            document.querySelectorAll('.dashboard-content').forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            
            // Remove active class from all buttons
            document.querySelectorAll('.dashboard-button').forEach(button => {
                button.style.background = 'transparent';
                button.style.borderColor = 'var(--border-glass)';
                button.classList.remove('active');
            });
            
            // Show selected dashboard content
            const selectedContent = document.getElementById(dashboardId);
            if (selectedContent) {
                selectedContent.style.display = 'block';
                selectedContent.classList.add('active');
            }
            
            // Add active class to clicked button
            event.target.style.background = 'linear-gradient(135deg, var(--primary-gold) 0%, #ff8c00 100%)';
            event.target.style.borderColor = 'var(--primary-gold)';
            event.target.classList.add('active');
        }

        // Smooth scrolling for internal links
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

        // Advanced parallax effects for equipment tools
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Industrial backdrop parallax
            const backdrop = document.querySelector('.industrial-backdrop');
            if (backdrop) {
                backdrop.style.transform = `translateY(${scrolled * 0.4}px)`;
            }
            
            // Equipment tools parallax with mechanical motion
            document.querySelectorAll('.equipment-tool').forEach((tool, index) => {
                const speed = 0.1 + (index * 0.015);
                const yPos = scrolled * speed;
                const mechanicalMotion = Math.sin(scrolled * 0.005 + index) * 12;
                tool.style.transform = `translateY(${yPos + mechanicalMotion}px) rotate(${scrolled * 0.008}deg)`;
            });
        });

        // Interactive card effects
        document.querySelectorAll('.service-card-equipment, .fleet-card, .dashboard-item').forEach(card => {
            card.addEventListener('mouseenter', function() {
                if (this.classList.contains('service-card-equipment')) {
                    this.style.transform = 'translateY(-15px) rotateY(5deg) scale(1.02)';
                } else {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) rotateY(0deg) scale(1)';
            });
        });

        // Equipment service icon rotation on hover
        document.querySelectorAll('.equipment-service-icon, .fleet-icon, .dashboard-icon').forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'rotate(360deg) scale(1.1)';
            });
            
            icon.addEventListener('mouseleave', function() {
                this.style.transform = 'rotate(0deg) scale(1)';
            });
        });

        // Loading performance optimization
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
            
            // Initialize equipment tool animations with staggered delays
            document.querySelectorAll('.equipment-tool').forEach((tool, index) => {
                tool.style.animationDelay = `${index * 2.5 + Math.random() * 3}s`;
            });
        });

        // Metric animation when visible
        const metricsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const metric = entry.target;
                    metric.style.animation = 'pulse 1.5s ease-in-out infinite';
                }
            });
        });

        document.querySelectorAll('.dashboard-metric').forEach(metric => {
            metricsObserver.observe(metric);
        });

        // Add pulse animation for metrics
        const metricStyle = document.createElement('style');
        metricStyle.textContent = `
            @keyframes pulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.05); opacity: 0.8; }
            }
        `;
        document.head.appendChild(metricStyle);

        // Equipment Modal System
        function openEquipmentModal(galleryItem) {
            const modal = document.getElementById('equipmentModal');
            const modalImage = document.getElementById('modalImage');
            const modalTitle = document.getElementById('modalTitle');
            const modalDescription = document.getElementById('modalDescription');
            const modalCategory = document.getElementById('modalCategory');
            
            // Extract data from gallery item
            const img = galleryItem.querySelector('img');
            const title = galleryItem.querySelector('h4').textContent;
            const description = galleryItem.querySelector('p').textContent;
            
            // Equipment specifications data
            const equipmentSpecs = {
                'Mobile Crane': {
                    specs: ['Lifting Capacity: 50-300 tons', 'Boom Length: 30-100m', 'Mobility: All-terrain capability', 'Certification: CE/ISO certified'],
                    category: 'Heavy Lifting'
                },
                'Excavator': {
                    specs: ['Engine Power: 150-400 HP', 'Operating Weight: 20-45 tons', 'Bucket Capacity: 1.2-2.5 m³', 'Reach: 9-12 meters'],
                    category: 'Earthmoving'
                },
                'Drilling Rig': {
                    specs: ['Drilling Depth: 500-3000m', 'Rotation Speed: 0-200 RPM', 'Pull Capacity: 150-500 tons', 'Mud System: High-pressure'],
                    category: 'Drilling'
                },
                'Welding Equipment': {
                    specs: ['Power Output: 200-500A', 'Voltage: 220-440V', 'Process: MIG/TIG/Stick', 'Duty Cycle: 60-100%'],
                    category: 'Welding'
                },
                'Generator Set': {
                    specs: ['Power Output: 100-2000 kVA', 'Fuel Type: Diesel/Gas', 'Runtime: 8-24 hours', 'Noise Level: <75 dB'],
                    category: 'Power Generation'
                },
                'Compressor': {
                    specs: ['Pressure: 8-40 bar', 'Flow Rate: 100-2000 CFM', 'Power: 50-500 HP', 'Type: Rotary screw/Centrifugal'],
                    category: 'Compressed Air'
                }
            };
            
            // Populate modal content
            modalImage.src = img.src;
            modalImage.alt = img.alt;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            
            // Get equipment data
            const equipment = equipmentSpecs[title] || equipmentSpecs['Mobile Crane'];
            modalCategory.textContent = equipment.category;
            
            // Update technical specifications
            const technicalSpecs = document.getElementById('technicalSpecs');
            const safetySpecs = document.getElementById('safetySpecs');
            
            if (technicalSpecs) {
                technicalSpecs.innerHTML = '';
                equipment.specs.forEach(spec => {
                    const li = document.createElement('li');
                    li.style.cssText = 'padding: 0.5rem 0; border-bottom: 1px solid rgba(214, 160, 25, 0.1); display: flex; justify-content: space-between;';
                    const [label, value] = spec.split(': ');
                    li.innerHTML = `<span>${label}:</span><strong>${value}</strong>`;
                    technicalSpecs.appendChild(li);
                });
            }
            
            // Update quick specs
            const spec1Value = document.getElementById('spec1Value');
            const spec1Label = document.getElementById('spec1Label');
            const spec2Value = document.getElementById('spec2Value');
            const spec2Label = document.getElementById('spec2Label');
            
            if (spec1Value && equipment.specs[0]) {
                const [label, value] = equipment.specs[0].split(': ');
                spec1Value.textContent = value;
                spec1Label.textContent = label;
            }
            
            if (spec2Value) {
                spec2Value.textContent = '24/7';
                spec2Label.textContent = 'Support';
            }
            
            // Show modal with animation
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }
        
        function closeModal() {
            const modal = document.getElementById('equipmentModal');
            modal.classList.remove('show');
            
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
        
        function showQuoteForm() {
            const tabs = document.querySelectorAll('.modal-tab');
            const contents = document.querySelectorAll('.tab-content');
            
            // Remove active from all tabs and contents
            tabs.forEach(tab => tab.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));
            
            // Add active to quote tab and content
            document.querySelector('[onclick="showQuoteForm()"]').classList.add('active');
            document.getElementById('quoteForm').classList.add('active');
        }
        
        function showReservationForm() {
            const tabs = document.querySelectorAll('.modal-tab');
            const contents = document.querySelectorAll('.tab-content');
            
            // Remove active from all tabs and contents
            tabs.forEach(tab => tab.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));
            
            // Add active to reservation tab and content
            document.querySelector('[onclick="showReservationForm()"]').classList.add('active');
            document.getElementById('reservationForm').classList.add('active');
        }
        
        function showAvailability() {
            const tabs = document.querySelectorAll('.modal-tab');
            const contents = document.querySelectorAll('.tab-content');
            
            // Remove active from all tabs and contents
            tabs.forEach(tab => tab.classList.remove('active'));
            contents.forEach(content => content.classList.remove('active'));
            
            // Add active to availability tab and content
            document.querySelector('[onclick="showAvailability()"]').classList.add('active');
            document.getElementById('availabilityCalendar').classList.add('active');
        }
        
        // Close modal when clicking outside
        document.addEventListener('click', function(e) {
            const modal = document.getElementById('equipmentModal');
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    