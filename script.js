// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements with null checks
    const navbar = document.querySelector(".navbar");
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const testimonialSlides = document.querySelectorAll(".testimonial");
    const contactForm = document.querySelector(".contact-form");
    const newsletterForm = document.querySelector(".newsletter-form");

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        });
    }

    // Mobile menu toggle - only if hamburger and navLinks exist
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        // Close mobile menu when clicking on a nav link
        const navLinksItems = document.querySelectorAll(".nav-links a");
        navLinksItems.forEach((link) => {
            link.addEventListener("click", () => {
                if (hamburger && navLinks) {
                    hamburger.classList.remove("active");
                    navLinks.classList.remove("active");
                }
            });
        });
    }

    // Tab switching for search section
    if (tabButtons.length > 0) {
        tabButtons.forEach((button) => {
            button.addEventListener("click", () => {
                // Remove active class from all buttons
                tabButtons.forEach((btn) => btn.classList.remove("active"));
                // Add active class to clicked button
                button.classList.add("active");
                // Here you would typically show/hide different form content
            });
        });
    }

    // Testimonial Slider Functionality
    const slider = document.querySelector(".testimonials-slider");
    if (!slider) return;
    
    const slides = document.querySelectorAll(".testimonial-card");
    const dots = document.querySelectorAll(".slider-dots .dot");
    const prevBtn = document.querySelector(".slider-arrow.prev");
    const nextBtn = document.querySelector(".slider-arrow.next");

    if (!slides.length) return;

  let currentSlide = 0;
  const totalSlides = slides.length;
  const slideWidth = slides[0].offsetWidth + 32; // width + gap

  // Set initial active slide
  function setActiveSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach((slide) => slide.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Add active class to current slide and dot
    slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");

    // Update current slide index
    currentSlide = index;
  }

  // Go to specific slide
  function goToSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    slider.scrollTo({
      left: index * slideWidth,
      behavior: "smooth",
    });

    setActiveSlide(index);
  }

  // Next slide
  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  // Previous slide
  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Auto-advance slides
  let slideInterval = setInterval(nextSlide, 6000);

  // Pause auto-advance on hover
  slider.addEventListener("mouseenter", () => {
    clearInterval(slideInterval);
  });

  // Resume auto-advance when mouse leaves
  slider.addEventListener("mouseleave", () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 6000);
  });

  // Event listeners for navigation buttons
  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  // Event listeners for dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => goToSlide(index));
  });

  // Handle swipe events for touch devices
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
    },
    { passive: true }
  );

  slider.addEventListener(
    "touchend",
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        prevSlide(); // Swipe right
      } else {
        nextSlide(); // Swipe left
      }
    }
  }

      // Initialize first slide if slides exist
    if (slides.length > 0) {
      setActiveSlide(0);
    }

  // Update active slide on scroll (for manual scrolling)
  let isScrolling = false;

  slider.addEventListener("scroll", () => {
    if (!isScrolling) {
      window.requestAnimationFrame(() => {
        const scrollPosition = slider.scrollLeft + slider.offsetWidth / 2;
        const slideIndex = Math.round(scrollPosition / slideWidth);

        if (slideIndex !== currentSlide) {
          setActiveSlide(slideIndex);
        }

        isScrolling = false;
      });

      isScrolling = true;
    }
  });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href");
    if (targetId === "#") return;

    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Contact form submission
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // Here you would typically send the form data to a server
    console.log("Form submitted:", formObject);

    // Show success message
    const successMessage = document.createElement("div");
    successMessage.className = "alert alert-success";
    successMessage.textContent =
      "Thank you for your message! We will get back to you soon.";
    contactForm.prepend(successMessage);

    // Reset form
    contactForm.reset();

    // Remove success message after 5 seconds
    setTimeout(() => {
      successMessage.remove();
    }, 5000);
  });
}

// Newsletter subscription
if (newsletterForm) {
  newsletterForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const emailInput = this.querySelector('input[type="email"]');
    const email = emailInput.value.trim();

    if (email && validateEmail(email)) {
      // Here you would typically send the email to your server
      console.log("Newsletter subscription:", email);

      // Show success message
      const successMessage = document.createElement("p");
      successMessage.className = "text-success mt-2";
      successMessage.textContent =
        "Thank you for subscribing to our newsletter!";
      this.parentNode.insertBefore(successMessage, this.nextSibling);

      // Reset form
      this.reset();

      // Remove success message after 5 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    } else {
      // Show error message
      const errorMessage = document.createElement("p");
      errorMessage.className = "text-danger mt-2";
      errorMessage.textContent = "Please enter a valid email address.";
      this.parentNode.insertBefore(errorMessage, this.nextSibling);

      // Remove error message after 3 seconds
      setTimeout(() => {
        errorMessage.remove();
      }, 3000);
    }
  });
}

// Email validation helper function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Initialize animations on scroll
const animateOnScroll = () => {
  const elements = document.querySelectorAll(".fade-in, .slide-in");

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (elementTop < windowHeight - 100) {
      element.classList.add("animate");
    }
  });
};

// Run animations when page loads
window.addEventListener("load", () => {
  // Add animation classes after a short delay to trigger animations
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 100);

  // Initial check for elements in viewport
  animateOnScroll();
});

// Run animations on scroll
window.addEventListener("scroll", animateOnScroll);
