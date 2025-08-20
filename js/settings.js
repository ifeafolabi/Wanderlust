document.addEventListener('DOMContentLoaded', function() {
    // Tab navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.settings-section');
    
    // Function to show section based on hash
    function showSectionFromHash() {
        const hash = window.location.hash.substring(1) || 'account';
        const targetSection = document.getElementById(`${hash}-section`);
        const targetNav = document.querySelector(`.nav-item[data-target="${hash}"]`);
        
        if (targetSection && targetNav) {
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            targetNav.classList.add('active');
            
            // Show corresponding section
            sections.forEach(section => {
                section.classList.remove('active');
            });
            targetSection.classList.add('active');
        }
    }
    
    // Initialize first tab as active if none is active
    if (!document.querySelector('.nav-item.active') && navItems.length > 0) {
        navItems[0].classList.add('active');
        document.getElementById('account-section').classList.add('active');
    }
    
    // Handle navigation clicks
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            window.location.hash = target;
            showSectionFromHash();
        });
    });
    
    // Handle back/forward navigation
    window.addEventListener('popstate', showSectionFromHash);
    
    // Initial load
    showSectionFromHash();
    
    // Payment Methods Modal
    const paymentModal = document.getElementById('paymentModal');
    const openModalBtn = document.getElementById('addPaymentMethod');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const paymentForm = document.getElementById('paymentForm');

    // Enhanced modal functions with animations
    function openModal() {
        document.body.style.overflow = 'hidden';
        paymentModal.style.display = 'flex';
        setTimeout(() => {
            paymentModal.classList.add('show');
        }, 10);
        
        // Set focus on first input when modal opens
        const firstInput = paymentForm?.querySelector('input');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    function closeModal() {
        paymentModal.classList.remove('show');
        setTimeout(() => {
            if (!paymentModal.classList.contains('show')) {
                paymentModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }, 300); // Match this with CSS transition duration
    }

    // Event listeners for modal
    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && paymentModal.classList.contains('show')) {
            closeModal();
        }
    });

    // Enhanced form handling
    if (paymentForm) {
        // Format card number
        const cardNumberInput = paymentForm.querySelector('input[placeholder*="1234"]');
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
                e.target.value = value.trim();
                
                // Update card type icons
                const cardType = detectCardType(value.replace(/\s/g, ''));
                updateCardIcons(cardType);
            });
        }
        
        // Format expiration date
        const expiryInput = paymentForm.querySelector('input[placeholder*="MM/YY"]');
        if (expiryInput) {
            expiryInput.addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }
        
        // Format CVV
        const cvvInput = paymentForm.querySelector('input[placeholder*="123"]');
        if (cvvInput) {
            cvvInput.addEventListener('input', function(e) {
                e.target.value = e.target.value.replace(/\D/g, '').substring(0, 4);
            });
        }
        
        // Form submission
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple validation
            let isValid = true;
            const inputs = paymentForm.querySelectorAll('input[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('error');
                    isValid = false;
                } else {
                    input.classList.remove('error');
                }
            });
            
            if (isValid) {
                // Show loading state
                const submitBtn = paymentForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                // Simulate API call
                setTimeout(() => {
                    // Reset form and close modal on success
                    paymentForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    closeModal();
                    
                    // Show success message
                    showNotification('Payment method added successfully!', 'success');
                }, 1500);
            }
        });
    }

    // Helper function to detect card type
    function detectCardType(number) {
        const cardTypes = {
            visa: /^4/,
            mastercard: /^5[1-5]/,
            amex: /^3[47]/
        };
        
        for (const [type, pattern] of Object.entries(cardTypes)) {
            if (pattern.test(number)) {
                return type;
            }
        }
        return '';
    }

    // Helper function to update card type icons
    function updateCardIcons(activeType) {
        const icons = document.querySelectorAll('.card-icons i');
        icons.forEach(icon => {
            if (icon.classList.contains(`fa-cc-${activeType}`)) {
                icon.classList.add('active');
            } else {
                icon.classList.remove('active');
            }
        });
    }

    // Show notification function
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Theme switching with system preference detection
    const themeOptions = document.querySelectorAll('.theme-option');

    function setTheme(theme) {
        // Update the data-theme attribute
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update active state of theme buttons
        themeOptions.forEach(opt => {
            opt.classList.toggle('active', opt.getAttribute('data-theme') === theme);
        });
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
        
        // Update meta theme-color for mobile browsers
        const themeColor = theme === 'dark' ? '#0f172a' : '#ffffff';
        document.querySelector('meta[name="theme-color"]').setAttribute('content', themeColor);
    }

    // Initialize theme with system preference or saved preference
    function initTheme() {
        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (systemPrefersDark) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }

    // Set up theme option click handlers
    if (themeOptions.length > 0) {
        themeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const theme = this.getAttribute('data-theme');
                setTheme(theme);
            });
        });
        
        // Initialize theme
        initTheme();
        
        // Watch for system theme changes
        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        colorSchemeQuery.addEventListener('change', e => {
            // Only apply system theme if user hasn't explicitly chosen a theme
            if (!localStorage.getItem('theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            this.value = value.trim();
        });
    }
    
    // Format expiry date
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            this.value = value;
        });
    }
    
    // Billing filters
    const billingPeriod = document.getElementById('billingPeriod');
    const billingStatus = document.getElementById('billingStatus');
    
    [billingPeriod, billingStatus].forEach(select => {
        if (select) {
            select.addEventListener('change', updateBillingTable);
        }
    });
    
    function updateBillingTable() {
        // Filter the billing table based on the selected filters
        const period = billingPeriod ? billingPeriod.value : 'all';
        const status = billingStatus ? billingStatus.value : 'all';
        
        // Here you would typically make an API call or filter the table
        console.log(`Filtering by period: ${period}, status: ${status}`);
    }

    // Font size selector
    const fontSizeOptions = document.querySelectorAll('.font-size-option');
    fontSizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const size = this.getAttribute('data-size');
            document.documentElement.style.fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
            fontSizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            // Here you would typically save the font size preference
            localStorage.setItem('fontSize', size);
        });
    });
    
    // Language selector
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            // Here you would typically change the language
            console.log('Language changed to:', this.value);
            // You would typically reload the page or update content via AJAX
        });
    }
    
    // Timezone selector
    const timezoneSelect = document.getElementById('timezoneSelect');
    if (timezoneSelect) {
        timezoneSelect.addEventListener('change', function() {
            // Here you would typically update the timezone preference
            console.log('Timezone changed to:', this.value);
        });
    }
    
    // Date format selector
    const dateFormatOptions = document.querySelectorAll('input[name="dateFormat"]');
    dateFormatOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.checked) {
                // Here you would typically update the date format
                console.log('Date format changed to:', this.value);
            }
        });
    });
    
    // Save preferences
    const savePreferencesBtn = document.querySelector('#preferences-section .btn-primary');
    if (savePreferencesBtn) {
        savePreferencesBtn.addEventListener('click', function() {
            // Here you would typically save all preferences
            alert('Preferences saved successfully!');
        });
    }
    
    // Reset to defaults
    const resetPreferencesBtn = document.querySelector('#preferences-section .btn-outline');
    if (resetPreferencesBtn) {
        resetPreferencesBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reset all preferences to default?')) {
                // Reset theme
                document.documentElement.setAttribute('data-theme', 'light');
                themeOptions.forEach(opt => {
                    opt.classList.toggle('active', opt.getAttribute('data-theme') === 'light');
                });
                
                // Reset font size
                document.documentElement.style.fontSize = '16px';
                fontSizeOptions.forEach(opt => {
                    opt.classList.toggle('active', opt.getAttribute('data-size') === 'medium');
                });
                
                // Reset language
                if (languageSelect) languageSelect.value = 'en';
                
                // Reset timezone (example: Eastern Time)
                if (timezoneSelect) {
                    const easternOption = timezoneSelect.querySelector('option[value="-05:00"]');
                    if (easternOption) easternOption.selected = true;
                }
                
                // Reset date format
                const defaultDateFormat = document.querySelector('input[name="dateFormat"][value="MM/DD/YYYY"]');
                if (defaultDateFormat) defaultDateFormat.checked = true;
                
                // Reset notification toggles
                document.querySelectorAll('#preferences-section .switch input[type="checkbox"]').forEach(checkbox => {
                    checkbox.checked = true; // Default all notifications on
                });
                
                alert('Preferences have been reset to default settings.');
            }
        });
    }
    
    // Profile picture upload
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const profilePicture = document.getElementById('profile-picture');
    const profilePreview = document.getElementById('profilePreview');
    
    if (changePhotoBtn && profilePicture) {
        changePhotoBtn.addEventListener('click', function() {
            profilePicture.click();
        });
        
        profilePicture.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    profilePreview.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Form submission
    const settingsForm = document.querySelector('.settings-form');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Here you would typically send the form data to your server
            alert('Settings saved successfully!');
        });
    }
    
    // Toggle switches
    const switches = document.querySelectorAll('.switch input[type="checkbox"]');
    switches.forEach(switchEl => {
        switchEl.addEventListener('change', function() {
            const parentCard = this.closest('.setting-card');
            if (parentCard) {
                const statusBadge = parentCard.querySelector('.status-badge');
                if (statusBadge) {
                    if (this.checked) {
                        statusBadge.textContent = 'Active';
                        statusBadge.style.background = '#ecfdf5';
                        statusBadge.style.color = '#059669';
                    } else {
                        statusBadge.textContent = 'Inactive';
                        statusBadge.style.background = '#f3f4f6';
                        statusBadge.style.color = '#6b7280';
                    }
                }
            }
        });
    });
    
    // Delete account confirmation
    const deleteAccountBtn = document.querySelector('.btn-danger');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // Here you would typically send a request to delete the account
                alert('Your account has been scheduled for deletion.');
                // Optionally redirect to home or login page
                // window.location.href = 'index.html';
            }
        });
    }
});
