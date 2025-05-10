// Template injector

// Navigation builder function
async function buildNavigation() {
  const navPages = siteConfig.getNavPages();
  const currentPage = siteConfig.getCurrentPage();
  
  let navHtml = `
    <nav class="navbar navbar-expand-lg navbar-dark fixed-top">
      <div class="container">
        <a class="navbar-brand" href="index.html">Kyle Mathias</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" 
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto">
  `;
  
  navPages.forEach(page => {
    // Skip the home page in the navbar
    if (page.id === 'home') return;
    
    const isActive = currentPage.id === page.id ? 'active' : '';
    navHtml += `
      <li class="nav-item">
        <a class="nav-link ${isActive}" href="${page.path}">${page.id.charAt(0).toUpperCase() + page.id.slice(1)}</a>
      </li>
    `;
  });
  
  navHtml += `
          </ul>
        </div>
      </div>
    </nav>
  `;
  
  return navHtml;
}

// Content loader function
async function loadContent(pageId) {
  try {
    const response = await fetch(`./content/${pageId}.html`);
    if (response.ok) {
      return await response.text();
    } else {
      return getDefaultContent(pageId);
    }
  } catch (error) {
    console.warn('Could not load content file:', error);
    return getDefaultContent(pageId);
  }
}

// Main template injector function - update this section
async function injectTemplate(pageId) {
  try {
    // First, get the page details from config
    const page = siteConfig.getPage(pageId);
    
    if (!page) {
      console.error(`Page with ID "${pageId}" not found in site configuration`);
      return;
    }
    
    // Build the navigation
    const navigation = await buildNavigation();
    
    // Load the content
    const content = await loadContent(pageId);
    
    // Update the document with navigation and content
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
      navPlaceholder.outerHTML = navigation;
    } else {
      // If nav placeholder doesn't exist, create it
      const navElement = document.createElement('div');
      navElement.innerHTML = navigation;
      document.body.prepend(navElement.firstChild);
    }
    
    // Update content
    const contentContainer = document.getElementById('page-content');
    if (contentContainer) {
      contentContainer.innerHTML = content;
    } else {
      // If content container doesn't exist, create it
      const container = document.createElement('div');
      container.id = 'page-content';
      container.className = 'content-container';
      container.innerHTML = content;
      
      // Find where to insert the content
      const existingContent = document.querySelector('.container');
      if (existingContent) {
        existingContent.parentNode.replaceChild(container, existingContent);
      } else {
        document.body.appendChild(container);
      }
    }
    
    // Update title
    document.title = page.title;
    
    // Make sure the 3D background is shown
    ensureBackgroundCanvas();
    
  } catch (error) {
    console.error('Error injecting template:', error);
  }
}

function ensureBackgroundCanvas() {
    let canvas = document.getElementById('3D-background-three-canvas5');
    
    if (!canvas) {
      console.log('Creating new canvas element');
      canvas = document.createElement('canvas');
      canvas.id = '3D-background-three-canvas5';
      document.body.insertBefore(canvas, document.body.firstChild);
      
      // Make sure the canvas is positioned correctly with inline styles
      // for maximum compatibility
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.zIndex = '-10';
      canvas.style.backgroundColor = 'black';
      canvas.style.display = 'block';
      
      // Explicitly load and run 3D background script
      const script = document.createElement('script');
      script.onload = function() {
        console.log('3D background script loaded, initializing...');
        if (window.reinitialize3DBackground) {
          window.reinitialize3DBackground();
        }
      };
      script.src = './js/3d-hero-background.js';
      document.body.appendChild(script);
    }
  }

// Default content for pages
function getDefaultContent(pageId) {
  switch (pageId) {
    case 'resume':
      return `
        <div class="row">
          <div class="col-12">
            <h1 class="mb-4">Resume</h1>
            <div class="resume-content">
              <h2>Professional Experience</h2>
              <p>Your professional experience details would go here...</p>
              
              <h2>Skills</h2>
              <p>Your skills would be listed here...</p>
              
              <h2>Education</h2>
              <p>Your education details would go here...</p>
            </div>
          </div>
        </div>
      `;
    case 'contact':
      return `
        <div class="row">
          <div class="col-12">
            <h1 class="mb-4">Contact</h1>
            <div class="contact-content">
              <p>Feel free to reach out to me through any of these channels:</p>
              
              <div class="contact-methods mt-4">
                <div class="contact-method">
                  <h3>Email</h3>
                  <p><a href="mailto:your.email@example.com">your.email@example.com</a></p>
                </div>
                
                <div class="contact-method">
                  <h3>LinkedIn</h3>
                  <p><a href="https://linkedin.com/in/yourprofile" target="_blank">linkedin.com/in/yourprofile</a></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    default:
      return `<div class="row"><div class="col-12"><h1>Content Not Found</h1><p>The content for "${pageId}" was not found.</p></div></div>`;
  }
}

