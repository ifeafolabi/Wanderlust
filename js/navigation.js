// Function to handle logout
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("authExpiration");
  window.location.href = "login.html";
}

// Setup event listeners for dropdown and mobile menu
function setupEventListeners(container) {
  const userMenu = container.querySelector("#userMenu");
  const dropdown = container.querySelector(".dropdown-content");
  const mobileMenuBtn = container.querySelector(".mobile-menu-btn");
  const navLinks = container.querySelector(".nav-links");
  const logoutBtn = container.querySelector("#logoutBtn");

  // Toggle dropdown with enhanced functionality
  if (userMenu && dropdown) {
    // Initialize dropdown state
    dropdown.style.display = 'none';
    
    userMenu.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle dropdown with animation
      if (dropdown.style.display === 'none' || !dropdown.style.display) {
        // Show dropdown
        dropdown.style.display = 'block';
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px) scale(0.95)';
        
        // Trigger reflow to ensure the initial styles are applied
        void dropdown.offsetWidth;
        
        // Animate in
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0) scale(1)';
        userMenu.classList.add('active');
      } else {
        // Hide dropdown with animation
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px) scale(0.95)';
        
        // After animation completes, hide the dropdown
        setTimeout(() => {
          dropdown.style.display = 'none';
        }, 200); // Match this with your CSS transition duration
        
        userMenu.classList.remove('active');
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!userMenu.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px) scale(0.95)';
        
        setTimeout(() => {
          dropdown.style.display = 'none';
        }, 200);
        
        userMenu.classList.remove('active');
      }
    });

    // Close dropdown when pressing Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && dropdown.style.display === 'block') {
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px) scale(0.95)';
        
        setTimeout(() => {
          dropdown.style.display = 'none';
        }, 200);
        
        userMenu.classList.remove('active');
      }
    });
  }

  // Mobile menu toggle
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      navLinks.classList.toggle("active");
      this.classList.toggle("active");
    });

    // Close mobile menu when clicking a nav link
    const navLinksItems = navLinks.querySelectorAll(".nav-link");
    navLinksItems.forEach((link) => {
      link.addEventListener("click", function () {
        navLinks.classList.remove("active");
        mobileMenuBtn.classList.remove("active");
      });
    });
  }

  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      logout();
    });
  }
}

// Navigation functionality for all pages except login and signup
function setupNavigation() {
  // Get current page
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Skip navigation setup for login and signup pages
  if (currentPage === "login.html" || currentPage === "signup.html") {
    return;
  }

  // Navigation HTML template
  const navHTML = `
    <div class="nav-container">
      <a href="dashboard.html" class="logo">
        <i class="fas fa-compass"></i>
        <span>Wanderlust</span>
      </a>
      
      <div class="nav-links">
        <a href="destinations.html" class="nav-link ${
          currentPage === "destinations.html" ? "active" : ""
        }">
          <i class="fas fa-map-marked-alt"></i>
          <span>Destinations</span>
        </a>
        <a href="guides.html" class="nav-link ${
          currentPage === "guides.html" ? "active" : ""
        }">
          <i class="fas fa-book"></i>
          <span>Travel Guides</span>
        </a>
        <a href="deals.html" class="nav-link ${
          currentPage === "deals.html" ? "active" : ""
        }">
          <i class="fas fa-tags"></i>
          <span>Deals</span>
        </a>
      </div>
      
      <div class="user-actions">
        <div class="dropdown">
          <button id="userMenu" class="user-menu" type="button">
            <i class="fas fa-user-circle"></i>
            <span>My Account</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          <div class="dropdown-content" style="display: none;">
            <a href="profile.html">
              <i class="fas fa-user"></i>
              <span>Profile</span>
            </a>
            <a href="trips.html">
              <i class="fas fa-suitcase"></i>
              <span>My Trips</span>
            </a>
            <a href="settings.html">
              <i class="fas fa-cog"></i>
              <span>Settings</span>
            </a>
            <div class="dropdown-divider"></div>
            <a href="#" id="logoutBtn">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </a>
          </div>
        </div>
      </div>
      
      <button class="mobile-menu-btn" type="button">
        <i class="fas fa-bars"></i>
      </button>
    </div>`;

  // Insert navigation into the navbar
  const navbar = document.querySelector(".navbar .container");
  if (navbar) {
    navbar.innerHTML = navHTML;
    setupEventListeners(navbar);
  }
}

// More robust initialization
function initializeNavigation() {
  // Check if the required elements exist
  const navbar = document.querySelector(".navbar .container");

  if (navbar) {
    setupNavigation();
  } else {
    // If navbar doesn't exist yet, try again after a short delay
    setTimeout(initializeNavigation, 50);
  }
}

// Multiple initialization methods to ensure it works
document.addEventListener("DOMContentLoaded", function () {
  initializeNavigation();
});

// Fallback for already loaded DOM
if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initializeNavigation();
}

// Additional fallback - window load event
window.addEventListener("load", function () {
  // Only initialize if not already done
  if (!document.querySelector("#userMenu")) {
    initializeNavigation();
  }
});
