// Optimized Navigation animation handler
(function() {
  // Function to check if device is mobile based on screen width
  function isMobileDevice() {
    return window.innerWidth <= 768;
  }
  
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
      const homeLink = document.querySelector('#animated-nav .nav-header-link');
      if (homeLink) {
        homeLink.classList.add('active-link');
        // Ensure consistent initial font size
        homeLink.style.fontSize = '3em';
      }
    } else {
      navElement.classList.add('nav-top-left');
      navElement.classList.remove('nav-center');
      
      // Set consistent font size in subpages
      const homeLink = document.querySelector('#animated-nav .nav-header-link');
      if (homeLink) {
        homeLink.style.fontSize = '1.5em';
      }
    }
    
    // Initialize mobile menu button behavior
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    if (mobileToggle && !isHomePage) {
      mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navElement.classList.toggle('mobile-menu-open');
        console.log('Menu toggled');  // Debug
      });
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
    
    // Set up interaction events - only for desktop view
    if (!isMobileDevice()) {
      if (isHomePage) {
        setupHomePageLinks();
      } else {
        setupInnerPageLinks();
      }
    } else {
      // For mobile, just set up normal navigation without animations
      setupMobileNavigation();
    }
    
    function setupMobileNavigation() {
      // Setup all links to navigate without animations on mobile
      const allLinks = document.querySelectorAll('#animated-nav a');
      
      allLinks.forEach(link => {
        // Remove any existing event listeners and set default behavior
        link.removeEventListener('click', preventDefaultNavigation);
        
        // No animations needed for mobile, just let links work normally
      });
    }
    
    function preventDefaultNavigation(e) {
      e.preventDefault();
      const targetHref = this.getAttribute('href');
      setTimeout(function() {
        window.location.href = targetHref;
      }, 50);
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
      
      // Handle header link for home page
      const headerLink = document.querySelector('#animated-nav .nav-header-link');
      if (headerLink && isHomePage) {
        headerLink.classList.add('active-link');
      } else if (headerLink) {
        headerLink.classList.remove('active-link');
      }
    }
    
    // Set up animated transitions from home page (desktop only)
    function setupHomePageLinks() {
      // Handle all nav links except home link
      const navLinks = document.querySelectorAll('#animated-nav .nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
          // Don't follow the link immediately
          e.preventDefault();
          
          // Get target page URL
          const targetHref = this.getAttribute('href');
          
          // Get navigation elements to animate
          const navHeader = document.querySelector('#animated-nav .nav-header');
          const navHeaderLink = document.querySelector('#animated-nav .nav-header-link');
          
          // Get the h5 element if it exists
          const subtitleElement = document.querySelector('#animated-nav .nav-header h5');
          
          // Collapse the h5 element during transition for better alignment
          if (subtitleElement) {
            // First reduce opacity
            subtitleElement.style.opacity = '0';
            subtitleElement.style.transition = 'opacity 0.3s ease, max-width 0.5s ease, padding 0.5s ease, margin 0.5s ease, height 0.5s ease';
            
            // Then collapse dimensions to take up no space
            setTimeout(function() {
              subtitleElement.style.maxWidth = '0';
              subtitleElement.style.padding = '0';
              subtitleElement.style.margin = '0';
              subtitleElement.style.height = '0';
              subtitleElement.style.overflow = 'hidden';
            }, 100);
          }
          
          // Step 1: Start moving header link to smaller size - with precise sizing
          if (navHeaderLink) {
            navHeaderLink.style.fontSize = '1.5em';
            navHeaderLink.style.transition = 'font-size 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
          }
          
          // Step 2: Start moving the overall nav to top-left
          navElement.classList.remove('nav-center');
          navElement.classList.add('nav-top-left');
          
          // Change the nav-header to horizontal layout with exact matching margins
          if (navHeader) {
            navHeader.style.marginBottom = '0';
            navHeader.style.marginRight = '20px';
          }
          
          // After the animation completes, navigate to the target page
          setTimeout(function() {
            window.location.href = targetHref;
          }, 800);
        });
      });
    }
    
    // Set up animated transitions from inner pages back to home (desktop only)
    function setupInnerPageLinks() {
      // Handle home link animation when not on home page
      const homeLink = document.querySelector('#animated-nav .nav-header-link');
      if (homeLink) {
        homeLink.addEventListener('click', function(e) {
          // Don't follow the link immediately if not on home page
          e.preventDefault();
          
          // Get navigation elements to animate
          const navHeader = document.querySelector('#animated-nav .nav-header');
          
          // Add an h5 element with proper dimensions to ensure correct spacing during transition
          if (!document.querySelector('#animated-nav .nav-header h5')) {
            const emptyH5 = document.createElement('h5');
            
            // Start with collapsed dimensions
            emptyH5.style.opacity = '0';
            emptyH5.style.maxWidth = '0';
            emptyH5.style.padding = '0';
            emptyH5.style.margin = '0';
            emptyH5.style.height = '0';
            emptyH5.style.overflow = 'hidden';
            emptyH5.style.transition = 'opacity 0.3s ease, max-width 0.5s ease, padding 0.5s ease, margin 0.5s ease, height 0.5s ease';
            
            // Add the element to the DOM
            navHeader.appendChild(emptyH5);
            
            // Force browser reflow
            void emptyH5.offsetWidth;
            
            // Expand dimensions to match the home page h5
            emptyH5.style.maxWidth = '100%';
            emptyH5.style.height = '50px'; // Standard h5 height
            emptyH5.style.marginTop = '8px';
            emptyH5.style.marginBottom = '8px';
            
            // Fade in the h5 as we transition
            setTimeout(function() {
              emptyH5.style.opacity = '1';
            }, 300);
          }
          
          // Start moving nav from top-left to center
          navElement.classList.remove('nav-top-left');
          navElement.classList.add('nav-center');
          
          // Change styles to match home page configuration with exact values
          if (navHeader) {
            navHeader.style.marginBottom = '25px';
            navHeader.style.marginRight = '0';
          }
          
          // Use the exact font size with proper transition
          this.style.fontSize = '3em';
          this.style.transition = 'font-size 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)';
          
          // After animation completes, navigate to home
          setTimeout(function() {
            window.location.href = 'index.html';
          }, 800);
        });
      }
    }
    
    // Handle resize events for responsive changes
    window.addEventListener('resize', function() {
      // If the width crosses our mobile breakpoint, reload the page to get the proper layout
      const wasMobile = isMobileDevice();
      setTimeout(function() {
        const isMobileNow = isMobileDevice();
        if (wasMobile !== isMobileNow) {
          window.location.reload();
        }
      }, 100); // Small delay to prevent multiple reloads
    });
  });
})();