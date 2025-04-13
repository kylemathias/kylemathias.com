// Site configuration
const siteConfig = {
    // Pages configuration
    pages: [
        {
            id: 'home',
            title: 'Kyle Mathias',
            path: 'index.html',
            showInNav: true
        },
        {
            id: 'resume',
            title: 'Resume',
            path: 'resume.html',
            showInNav: true
        },
        {
            id: 'contact',
            title: 'Contact',
            path: 'contact.html',
            showInNav: true
        },
        {
            id: 'projects',
            title: 'Projects',
            path: 'projects.html',
            showInNav: true
        }
    ],

    // Get all pages that should appear in navigation
    getNavPages: function() {
        return this.pages.filter(page => page.showInNav);
    },

    // Get page by ID
    getPage: function(id) {
        return this.pages.find(page => page.id === id);
    },

    // Get current page based on URL
    getCurrentPage: function() {
        const path = window.location.pathname.split('/').pop() || 'index.html';
        return this.pages.find(page => page.path === path) || this.pages[0];
    }
};