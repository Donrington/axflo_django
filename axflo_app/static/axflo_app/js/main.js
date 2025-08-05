   function toggleNav() {
            const mobileNav = document.querySelector('.mobile-nav');
            const toggleBtn = document.querySelector('.toggle-btn');
            const overlay = document.querySelector('.overlay');
            
            const isActive = mobileNav.classList.contains('active');
            
            if (!isActive) {
                // Open mobile nav
                mobileNav.classList.add('active');
                toggleBtn.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Add entrance animation to mobile nav items
                const navItems = document.querySelectorAll('.mobile-nav__links a');
                navItems.forEach((item, index) => {
                    item.style.transform = 'translateX(-50px)';
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.transform = 'translateX(0)';
                        item.style.opacity = '1';
                    }, index * 100 + 200);
                });
            } else {
                // Close mobile nav
                mobileNav.classList.remove('active');
                toggleBtn.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        }

        function toggleMobileDropdown(event, dropdownId) {
            event.preventDefault();
            event.stopPropagation();
            
            const dropdown = document.getElementById(dropdownId);
            const chevron = event.currentTarget.querySelector('.fa-chevron-down');
            const isActive = dropdown.classList.contains('active');
            
            // Close all other dropdowns first
            document.querySelectorAll('.mobile-dropdown.active').forEach(otherDropdown => {
                if (otherDropdown.id !== dropdownId) {
                    otherDropdown.classList.remove('active');
                    const otherChevron = document.querySelector(`[onclick*="${otherDropdown.id}"] .fa-chevron-down`);
                    if (otherChevron) {
                        otherChevron.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('active');
            
            // Animate chevron
            if (chevron) {
                chevron.style.transform = dropdown.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
            }
            
            // Add staggered animation for dropdown items
            if (!isActive) {
                const dropdownLinks = dropdown.querySelectorAll('a');
                dropdownLinks.forEach((link, index) => {
                    link.style.opacity = '0';
                    link.style.transform = 'translateX(-20px)';
                    setTimeout(() => {
                        link.style.opacity = '1';
                        link.style.transform = 'translateX(0)';
                    }, index * 50 + 100);
                });
            }
        }

        // Enhanced Scroll Handler
        function handleScroll() {
            const header = document.querySelector('.header');
            const scrollThreshold = 50;
            const currentScrollY = window.scrollY;
            
            if (window.scrollTimeout) {
                clearTimeout(window.scrollTimeout);
            }
            
            window.scrollTimeout = setTimeout(() => {
                if (currentScrollY > scrollThreshold) {
                    if (!header.classList.contains('scrolled')) {
                        header.classList.add('scrolled');
                    }
                } else {
                    if (header.classList.contains('scrolled')) {
                        header.classList.remove('scrolled');
                    }
                }
            }, 10);
        }

        // Smooth Scroll for Anchor Links (only for same-page anchors)
        function initSmoothScroll() {
            const links = document.querySelectorAll('a[href^="#"]:not([onclick]):not([href="#contact"])');
            
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    const targetId = link.getAttribute('href');
                    if (targetId === '#' || targetId.length <= 1) return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        const header = document.querySelector('.header');
                        const headerHeight = header ? header.offsetHeight : 80;
                        const offsetTop = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile nav if open
                        const mobileNav = document.querySelector('.mobile-nav');
                        if (mobileNav && mobileNav.classList.contains('active')) {
                            toggleNav();
                        }
                    }
                });
            });
        }

        // Close mobile nav when clicking outside
        function handleOutsideClick(e) {
            const mobileNav = document.querySelector('.mobile-nav');
            const toggleBtn = document.querySelector('.toggle-btn');
            
            if (mobileNav.classList.contains('active') && 
                !mobileNav.contains(e.target) && 
                !toggleBtn.contains(e.target)) {
                toggleNav();
            }
        }

        // Handle window resize
        function handleResize() {
            const mobileNav = document.querySelector('.mobile-nav');
            if (window.innerWidth > 1000 && mobileNav.classList.contains('active')) {
                toggleNav();
            }
        }

        // Initialize all functionality when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            // Add scroll event listener with throttling
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(() => {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
            
            // Initialize other functionality
            initSmoothScroll();
            
            // Add event listeners
            document.addEventListener('click', handleOutsideClick);
            window.addEventListener('resize', handleResize);
            
            // Add keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    const mobileNav = document.querySelector('.mobile-nav');
                    if (mobileNav.classList.contains('active')) {
                        toggleNav();
                    }
                }
            });
            
            // Initial call to set correct state
            handleScroll();
        });


