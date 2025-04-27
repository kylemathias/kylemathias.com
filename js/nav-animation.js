// Navigation animation handler
document.addEventListener('DOMContentLoaded', function() {
  const navElement = document.getElementById('animated-nav');
  if (!navElement) return;
  
  const isHomePage = window.location.pathname.endsWith('index.html') || 
                     window.location.pathname === '/' || 
                     window.location.pathname.endsWith('/');
  
  // Store current page for navigation reference
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  
  // Set initial positioning class based on page type
  if (isHomePage) {
    navElement.classList.add('nav-center');
    navElement.classList.remove('nav-top-left');
    setupHomePageLinks();
  } else {
    navElement.classList.add('nav-top-left');
    navElement.classList.remove('nav-center');
  }
  
  // Highlight current page in navigation
  highlightCurrentPage();
  
  function highlightCurrentPage() {
    // Get the title link for special handling
    const titleLink = document.querySelector('#animated-nav .nav-title-link');
    
    // Handle title link highlighting for home page
    if (currentPath === 'index.html' || currentPath === '' || currentPath === '/') {
      titleLink.classList.add('active-link');
    } else {
      titleLink.classList.remove('active-link');
    }
    
    // Handle regular nav links
    const navLinks = document.querySelectorAll('#animated-nav .nav-link');
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (linkPath === currentPath) {
        link.classList.add('active-link');
      } else {
        link.classList.remove('active-link');
      }
    });
  }
  
  // Set up animated transitions from home page
  function setupHomePageLinks() {
    // Handle regular nav links
    const navLinks = document.querySelectorAll('#animated-nav .nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        // Don't follow the link immediately
        e.preventDefault();
        
        // Get target page URL
        const targetHref = this.getAttribute('href');
        
        // Smoothly transition from center to top-left
        navElement.classList.remove('nav-center');
        navElement.classList.add('nav-top-left');
        
        // After animation completes, navigate to the target page
        setTimeout(function() {
          window.location.href = targetHref;
        }, 500);
      });
    });
    
    // Handle title link differently since we don't animate when going to home from home
    const titleLink = document.querySelector('#animated-nav .nav-title-link');
    if (titleLink && !isHomePage) {
      titleLink.addEventListener('click', function(e) {
        // Don't follow the link immediately if not on home page
        e.preventDefault();
        
        // Smoothly transition from top-left to center (when going back to home)
        navElement.classList.remove('nav-top-left');
        navElement.classList.add('nav-center');
        
        // After animation completes, navigate to home
        setTimeout(function() {
          window.location.href = 'index.html';
        }, 500);
      });
    }
  }
});