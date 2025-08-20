document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const profilePicture = document.getElementById('profilePicture');
    const editPersonalInfoBtn = document.getElementById('editPersonalInfo');
    const personalInfoForm = document.getElementById('personalInfoForm');
    const cancelPersonalInfo = document.getElementById('cancelPersonalInfo');
    const editPreferencesBtn = document.getElementById('editPreferences');
    const addPreferencesBtn = document.getElementById('addPreferencesBtn');
    const preferencesView = document.getElementById('preferencesView');
    const preferencesForm = document.getElementById('preferencesForm');
    const cancelPreferences = document.getElementById('cancelPreferences');

    // Change Avatar
    if (changeAvatarBtn && avatarUpload) {
        changeAvatarBtn.addEventListener('click', () => {
            avatarUpload.click();
        });

        avatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) { // 2MB limit
                    alert('File size should be less than 2MB');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(event) {
                    profilePicture.src = event.target.result;
                    // Here you would typically upload the image to your server
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Toggle Personal Info Edit Mode
    if (editPersonalInfoBtn && personalInfoForm) {
        const formInputs = personalInfoForm.querySelectorAll('input');
        
        // Initially disable form inputs
        formInputs.forEach(input => {
            input.disabled = true;
        });
        
        editPersonalInfoBtn.addEventListener('click', () => {
            formInputs.forEach(input => {
                input.disabled = false;
            });
            personalInfoForm.classList.add('editing');
        });
        
        cancelPersonalInfo.addEventListener('click', () => {
            formInputs.forEach(input => {
                input.disabled = true;
                // Reset form values here if needed
            });
            personalInfoForm.classList.remove('editing');
        });
        
        personalInfoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Here you would typically save the form data to your server
            formInputs.forEach(input => {
                input.disabled = true;
            });
            personalInfoForm.classList.remove('editing');
            // Show success message
            showToast('Profile updated successfully!');
        });
    }

    // Toggle Preferences Edit Mode
    if (editPreferencesBtn && preferencesForm) {
        editPreferencesBtn.addEventListener('click', () => {
            preferencesView.style.display = 'none';
            preferencesForm.style.display = 'block';
        });
        
        addPreferencesBtn.addEventListener('click', () => {
            preferencesView.style.display = 'none';
            preferencesForm.style.display = 'block';
        });
        
        cancelPreferences.addEventListener('click', () => {
            preferencesView.style.display = 'block';
            preferencesForm.style.display = 'none';
        });
        
        preferencesForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const selectedPreferences = [];
            const checkboxes = preferencesForm.querySelectorAll('input[type="checkbox"]:checked');n            
            checkboxes.forEach(checkbox => {
                selectedPreferences.push(checkbox.value);
            });
            
            // Here you would typically save the preferences to your server
            
            // Update the view
            updatePreferencesView(selectedPreferences);
            preferencesView.style.display = 'block';
            preferencesForm.style.display = 'none';
            
            // Show success message
            showToast('Preferences updated successfully!');
        });
    }
    
    // Helper function to update preferences view
    function updatePreferencesView(preferences) {
        const noPreferences = document.querySelector('.no-preferences');
        const preferencesContainer = document.createElement('div');
        preferencesContainer.className = 'selected-preferences';
        
        if (preferences.length > 0) {
            noPreferences.style.display = 'none';
            preferencesContainer.innerHTML = preferences.map(pref => 
                `<span class="preference-tag">${formatPreferenceName(pref)}</span>`
            ).join('');
            
            if (preferencesView.contains(noPreferences)) {
                preferencesView.insertBefore(preferencesContainer, noPreferences.nextSibling);
            } else if (!preferencesView.querySelector('.selected-preferences')) {
                preferencesView.insertBefore(preferencesContainer, addPreferencesBtn);
            } else {
                preferencesView.replaceChild(preferencesContainer, preferencesView.querySelector('.selected-preferences'));
            }
        } else {
            noPreferences.style.display = 'block';
            const existingContainer = preferencesView.querySelector('.selected-preferences');
            if (existingContainer) {
                preferencesView.removeChild(existingContainer);
            }
        }
    }
    
    // Helper function to format preference names for display
    function formatPreferenceName(pref) {
        return pref.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    
    // Helper function to show toast messages
    function showToast(message) {
        // Remove any existing toasts
        const existingToasts = document.querySelectorAll('.toast');
        existingToasts.forEach(toast => toast.remove());
        
        // Create new toast
        const toast = document.createElement('div');
        toast.className = 'toast show';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    // Initialize member since year
    const memberSince = document.getElementById('memberSince');
    if (memberSince) {
        memberSince.textContent = new Date().getFullYear();
    }
});
