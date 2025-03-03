// filepath: ./js/template-injector.js
async function injectTemplate(pageType) {
    try {
        const response = await fetch('template.html');
        let template = await response.text();

        let title = '';
        let content = '';

        // Define content based on pageType
        switch (pageType) {
            case 'resume':
                title = 'Resume';
                content = `<h1>Resume</h1><p>Your resume content here...</p>`; // Replace with your actual resume content
                break;
            case 'contact':
                title = 'Contact';
                content = `<h1>Contact</h1><p>Your contact information here...</p>`; // Replace with your actual contact info
                break;
            default:
                title = 'Default Title';
                content = `<p>Default content.</p>`;
                break;
        }

        // Replace title
        template = template.replace('{title}', title);

        // Create a temporary DOM element to parse the template
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = template;

        // Extract elements
        const templateContent = tempDiv.querySelector('#page-content'); // ID in template.html
        const scripts = tempDiv.querySelectorAll('script');

        // Clear the existing body
        document.body.innerHTML = '';

        // Append the template content
        if (templateContent) {
            templateContent.innerHTML = content; // Inject page-specific content
            document.body.appendChild(tempDiv); // Append the entire template
        }

        // Append the scripts dynamically
        scripts.forEach(script => {
            const newScript = document.createElement('script');
            newScript.src = script.src; // Get the source URL
            if (!newScript.src) {
                newScript.textContent = script.textContent; // Inline script
            }
            document.body.appendChild(newScript);
        });

        // Move the canvas if it exists
        const canvas = document.getElementById('3D-background-three-canvas5');
        if (canvas) {
            document.body.appendChild(canvas); // Move canvas to the template page
        }

    } catch (error) {
        console.error('Error fetching or processing template:', error);
        document.body.innerHTML = '<h1>Error loading page</h1><p>Please try again later.</p>';
    }
}