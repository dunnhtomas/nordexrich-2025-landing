/**
 * NordexRich 2025 Core JavaScript
 * Essential functionality with cross-browser support
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize core components
  initStickyHeader();
  initMobileMenu();
  initFormHandling();
  initSmoothScrolling();
});

/**
 * Sticky Header functionality
 */
function initStickyHeader() {
  const header = document.querySelector('.header');
  if (!header) return;

  const headerHeight = header.offsetHeight;
  let lastScrollTop = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class when scrolling down
    if (scrollTop > headerHeight / 2) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
  }, { passive: true });
}

/**
 * Mobile Menu functionality
 */
function initMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const nav = document.querySelector('.header-nav');
  
  if (!mobileMenuBtn) return;

  mobileMenuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMobileMenu();
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header') && nav && nav.classList.contains('active')) {
      toggleMobileMenu();
    }
  });

  function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    if (nav) {
      nav.classList.toggle('active');
    }
    
    // Update aria attributes for accessibility
    const isExpanded = mobileMenuBtn.classList.contains('active');
    mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
    mobileMenuBtn.setAttribute('aria-label', isExpanded ? 'Menu schließen' : 'Menu öffnen');
  }
}

/**
 * Form handling with validation
 */
function initFormHandling() {
  const forms = document.querySelectorAll('.registration-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', handleFormSubmit);
    
    // Add real-time validation
    const inputs = form.querySelectorAll('.form-control');
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', clearFieldError);
    });
  });
}

function handleFormSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('[type=\"submit\"]');
  
  // Basic validation
  if (!validateForm(form)) {
    return;
  }
  
  // Show loading state
  if (submitBtn) {
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
  }
  
  // Get form data
  const formData = new FormData(form);
  
  // Add subid from URL or cookie
  const subid = getSubId();
  if (subid) {
    formData.set('subid', subid);
  }
  
  // Simulate form submission (replace with actual endpoint)
  setTimeout(() => {
    // Remove loading state
    if (submitBtn) {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
    }
    
    // Show success message or redirect
    showSuccessMessage('Registrierung erfolgreich! Sie werden weitergeleitet...');
    
    // Redirect after success (replace with actual redirect URL)
    setTimeout(() => {
      // window.location.href = 'success-page.html';
    }, 2000);
  }, 2000);
}

function validateForm(form) {
  let isValid = true;
  const inputs = form.querySelectorAll('.form-control[required]');
  
  inputs.forEach(input => {
    if (!validateField({ target: input })) {
      isValid = false;
    }
  });
  
  return isValid;
}

function validateField(e) {
  const input = e.target;
  const value = input.value.trim();
  let isValid = true;
  let errorMessage = '';
  
  // Remove existing error state
  clearFieldError({ target: input });
  
  // Check if required field is empty
  if (input.hasAttribute('required') && !value) {
    errorMessage = 'Dieses Feld ist erforderlich';
    isValid = false;
  }
  // Email validation
  else if (input.type === 'email' && value) {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    if (!emailRegex.test(value)) {
      errorMessage = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
      isValid = false;
    }
  }
  // Password validation
  else if (input.type === 'password' && value) {
    if (value.length < 6) {
      errorMessage = 'Passwort muss mindestens 6 Zeichen lang sein';
      isValid = false;
    }
  }
  // Phone validation
  else if (input.type === 'tel' && value) {
    const phoneRegex = /^[0-9+\\-\\s()]+$/;
    if (!phoneRegex.test(value)) {
      errorMessage = 'Bitte geben Sie eine gültige Telefonnummer ein';
      isValid = false;
    }
  }
  
  if (!isValid) {
    showFieldError(input, errorMessage);
  }
  
  return isValid;
}

function showFieldError(input, message) {
  input.classList.add('error');
  input.style.borderColor = 'var(--error-500)';
  
  // Remove existing error message
  const existingError = input.parentNode.querySelector('.error-message');
  if (existingError) {
    existingError.remove();
  }
  
  // Add error message
  const errorEl = document.createElement('div');
  errorEl.className = 'error-message';
  errorEl.textContent = message;
  errorEl.style.color = 'var(--error-500)';
  errorEl.style.fontSize = '0.875rem';
  errorEl.style.marginTop = 'var(--space-1)';
  
  input.parentNode.appendChild(errorEl);
}

function clearFieldError(e) {
  const input = e.target;
  input.classList.remove('error');
  input.style.borderColor = '';
  
  const errorMsg = input.parentNode.querySelector('.error-message');
  if (errorMsg) {
    errorMsg.remove();
  }
}

function showSuccessMessage(message) {
  const successEl = document.createElement('div');
  successEl.className = 'success-message';
  successEl.textContent = message;
  successEl.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: var(--success-500);
    color: white;
    padding: var(--space-4) var(--space-6);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    text-align: center;
    font-weight: 600;
  `;
  
  document.body.appendChild(successEl);
  
  // Remove after 3 seconds
  setTimeout(() => {
    successEl.remove();
  }, 3000);
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
  document.querySelectorAll('a[href^=\"#\"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Get subid from URL parameters or cookies
 */
function getSubId() {
  // First check URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const subidFromUrl = urlParams.get('subid') || urlParams.get('_subid');
  
  if (subidFromUrl) {
    return subidFromUrl;
  }
  
  // Then check cookies
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'subid' || name === '_subid') {
      return decodeURIComponent(value);
    }
  }
  
  return null;
}