// js/template-injector.js
async function injectTemplate(pageType) {
    try {
        const response = await fetch('template.html');
        let template = await response.text();

        let title = '';
        let content = '';

        if (pageType === 'resume') {
            title = 'Resume';
            content = `<h1>Resume</h1><p>Your resume content here...</p>`; // Replace with your actual resume content
        } else if (pageType === 'contact') {
            title = 'Contact';
            content = `<h1>Contact</h1><p>Your contact information here...</p>`; // Replace with your actual contact info
        }

        template = template.replace('{title}', title);
        template = template.replace('<div id="content">', `<div id="content">${content}`);

        document.body.innerHTML = template;

    } catch (error) {
        console.error('Error fetching or processing template:', error);
        document.body.innerHTML = '<h1>Error loading page</h1><p>Please try again later.</p>';
    }
}