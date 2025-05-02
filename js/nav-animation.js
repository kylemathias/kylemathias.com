// Optimized Navigation animation handler
(function() {
  // Function to initialize critical navigation elements immediately
  function initCriticalNav() {
    const navElement = document.getElementById('animated-nav');
    if (!navElement) return;
    
    // Determine if we're on the home page
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname === '/' || 
                       window.location.pathname.endsWith('/');
    
    // Set initial positioning class based on page type
    if (isHomePage) {
      navElement.classList.add('nav-center');
      navElement.classList.remove('nav-top-left');
      
      // Set active class on home link immediately
      const homeLink = document.querySelector('#animated-nav .nav-links a[href="index.html"]');
      if (homeLink) {
        homeLink.classList.add('active-link');
      }
    } else {
      navElement.classList.add('nav-top-left');
      navElement.classList.remove('nav-center');
    }
  }
  
  // Run critical nav setup immediately - this is key for improving LCP
  initCriticalNav();
  
  // Defer non-critical navigation setup
  document.addEventListener('DOMContentLoaded', function() {
    const navElement = document.getElementById('animated-nav');
    if (!navElement) return;
    
    const isHomePage = window.location.pathname.endsWith('index.html') || 
                       window.location.pathname === '/' || 
                       window.location.pathname.endsWith('/');
    
    // Store current page for navigation reference
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    
    // Complete page highlighting
    highlightCurrentPage();
    
    // Set up interaction events
    if (isHomePage) {
      setupHomePageLinks();
    } else {
      setupInnerPageLinks();
    }
    
    function highlightCurrentPage() {
      // Handle all nav links
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
      // Handle all nav links except home link
      const navLinks = document.querySelectorAll('#animated-nav .nav-link:not([href="index.html"])');
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
    }
    
    // Set up animated transitions from inner pages back to home
    function setupInnerPageLinks() {
      // Handle home link animation when not on home page
      const homeLink = document.querySelector('#animated-nav .nav-links a[href="index.html"]');
      if (homeLink) {
        homeLink.addEventListener('click', function(e) {
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
})();