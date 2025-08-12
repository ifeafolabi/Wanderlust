document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login or signup page
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // Password strength indicator for signup form
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
    }

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Handle signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }

    // Check if user is already logged in
    checkAuthStatus();
});

function checkPasswordStrength() {
    const password = this.value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    // Reset styles
    strengthBar.style.width = '0%';
    strengthBar.style.background = '#ef4444';
    
    // Check password strength
    let strength = 0;
    let messages = [];
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains numbers
    if (/\d/.test(password)) strength += 25;
    
    // Contains letters
    if (/[a-zA-Z]/.test(password)) strength += 25;
    
    // Contains special characters
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    // Update strength bar
    strengthBar.style.width = `${strength}%`;
    
    // Update strength text and color
    if (strength <= 25) {
        strengthBar.style.background = '#ef4444';
        strengthText.textContent = 'Weak';
    } else if (strength <= 50) {
        strengthBar.style.background = '#f59e0b';
        strengthText.textContent = 'Fair';
    } else if (strength <= 75) {
        strengthBar.style.background = '#3b82f6';
        strengthText.textContent = 'Good';
    } else {
        strengthBar.style.background = '#10b981';
        strengthText.textContent = 'Strong';
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('remember')?.checked || false;
    
    // Simple validation
    if (!email || !password) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    // In a real app, you would make an API call to your backend
    // For demo purposes, we'll use localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Create session
        const session = {
            userId: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            expires: rememberMe ? Date.now() + (30 * 24 * 60 * 60 * 1000) : Date.now() + (24 * 60 * 60 * 1000)
        };
        
        localStorage.setItem('session', JSON.stringify(session));
        
        // Redirect to main page
        window.location.href = 'index.html';
    } else {
        showAlert('Invalid email or password', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const termsAccepted = document.getElementById('terms').checked;
    
    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        showAlert('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Passwords do not match', 'error');
        return;
    }
    
    if (!termsAccepted) {
        showAlert('You must accept the terms and conditions', 'error');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === email)) {
        showAlert('An account with this email already exists', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        firstName,
        lastName,
        email,
        password, // In a real app, you should hash the password
        createdAt: new Date().toISOString()
    };
    
    // Save user to localStorage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Automatically log in the new user
    const session = {
        userId: newUser.id,
        email: newUser.email,
        name: `${newUser.firstName} ${newUser.lastName}`,
        expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };
    
    localStorage.setItem('session', JSON.stringify(session));
    
    // Show success message and redirect
    showAlert('Account created successfully! Redirecting...', 'success');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

function checkAuthStatus() {
    const session = JSON.parse(localStorage.getItem('session') || '{}');
    const isAuthPage = window.location.pathname.includes('login.html') || 
                      window.location.pathname.includes('signup.html');
    
    // Check if session is expired
    if (session.expires && session.expires < Date.now()) {
        localStorage.removeItem('session');
        return;
    }
    
    // Redirect to home if already logged in and on auth page
    if (session.userId && isAuthPage) {
        window.location.href = 'index.html';
    }
    
    // Update UI based on auth status
    updateAuthUI(!!session.userId);
}

function updateAuthUI(isLoggedIn) {
    // Update navigation based on auth status
    const authLinks = document.querySelectorAll('.auth-links');
    const userMenu = document.querySelector('.user-menu');
    
    if (isLoggedIn) {
        const session = JSON.parse(localStorage.getItem('session') || '{}');
        const userName = session.name || 'User';
        
        authLinks.forEach(link => link.style.display = 'none');
        if (userMenu) {
            userMenu.style.display = 'flex';
            const nameElement = userMenu.querySelector('.user-name');
            if (nameElement) nameElement.textContent = userName;
        }
    } else {
        authLinks.forEach(link => link.style.display = 'flex');
        if (userMenu) userMenu.style.display = 'none';
    }
}

function showAlert(message, type = 'info') {
    // Remove any existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    // Style the alert
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.padding = '12px 20px';
    alert.style.borderRadius = 'var(--rounded)';
    alert.style.boxShadow = 'var(--shadow-md)';
    alert.style.zIndex = '9999';
    alert.style.animation = 'fadeIn 0.3s ease';
    
    // Set background color based on type
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        info: '#3b82f6',
        warning: '#f59e0b'
    };
    
    alert.style.backgroundColor = colors[type] || colors.info;
    alert.style.color = 'white';
    
    // Add to document
    document.body.appendChild(alert);
    
    // Remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// Logout function (to be called from the UI)
function logout() {
    localStorage.removeItem('session');
    window.location.href = 'login.html';
}
