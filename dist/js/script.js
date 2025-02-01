const images = [
    'assets/icons8-klingon-bird-of-prey-96.png',
    'assets/icons8-romulan-warbird-96.png',
    'assets/icons8-enterprise-ncc-1701-c-96.png',
    'assets/icons8-star-wars-btl-y-wing-starfighter-96.png',
    'assets/icons8-star-wars-millenium-falcon-96.png',
    'assets/icons8-star-wars-naboo-ship-96.png',
    'assets/icons8-t-65b-x-wing-starfighter-96.png',
    'assets/icons8-tie-advanced-96.png',
    'assets/icons8-tie-fighter-96.png',
    'assets/icons8-star-trek-romulan-ship-96.png',
    'assets/icons8-uss-voyager-96.png',
    'assets/icons8-uss-discovery-96.png'

];
    


const imageNames = [
    'Klingon Bird of Prey',              
    'Romulan Warbird',
    'Enterprise NCC-1701-C',              
    'BTL Y-Wing Starfighter',             
    'Millennium Falcon',                  
    'Naboo Starship',                     
    'T-65B X-Wing Starfighter',           
    'TIE Advanced',                       
    'TIE Fighter',                        
    'Romulan Ship',             
    'USS Voyager',                       
    'USS Discovery'                       
];

let currentIndex = 0;
let imageQueue = []; // Queue to track images
let lastInvocationTime = performance.now(); // Using performance.now() for high-resolution time


function addImage() {
    var img = document.createElement('img');
    let randomIndex = Math.floor(Math.random() * images.length);
    img.src = images[randomIndex];
    img.classList.add('image');

    // Calculate a random top position within visible bounds
    const maxHeight = window.innerHeight / 4;
    const minHeight = 75;
    const randomTop = Math.random() * (maxHeight - minHeight) + minHeight;
    img.style.top = `${randomTop}px`;

    // Determine movement direction and set initial horizontal position accordingly
    if (Math.random() < 0.5) {
        img.classList.add('move-right-to-left');
        // Spawn off to the right of the screen
        img.style.left = `${window.innerWidth}px`;
    } else {
        img.classList.add('move-left-to-right');
        // Spawn off to the left of the screen using an arbitrary negative offset
        img.style.left = `-150px`;
    }

    // Handle mouseover for custom tooltip
    img.addEventListener('mouseover', function() {
        showTooltip(img, imageNames[randomIndex]);
    });

    // Handle mouseout to hide tooltip
    img.addEventListener('mouseout', function() {
        hideTooltip();
    });

    // Handle click for explosion effect
    img.addEventListener('click', function() {
        img.classList.add('exploded'); // Add the explosion animation class
        setTimeout(() => { // Remove the image from the DOM after the animation completes
            if (img.parentNode) {
                img.parentNode.removeChild(img);
            }
        }, 500); // Matches the duration of the explosion animation
    });

    img.addEventListener('click', function() {
        // Change the image to an explosion graphic
        img.src = 'assets/icons8-explosion-96.png'; // Path to your explosion graphic
    });

    document.getElementById('image-slider').appendChild(img);
    imageQueue.push(img);

    if (imageQueue.length > 1) {
        setTimeout(() => {
            let oldestImg = imageQueue.shift();
            if (oldestImg.parentNode) {
                oldestImg.parentNode.removeChild(oldestImg);
            }
        }, 60000); // Set to match the CSS animation duration
    }
}



function showTooltip(element, text) {
    let tooltip = document.getElementById('tooltip');
    if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'tooltip';
        tooltip.style.position = 'absolute';
        tooltip.style.background = 'black';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px';
        tooltip.style.borderRadius = '5px';
        tooltip.style.display = 'none'; // Initially hidden
        document.body.appendChild(tooltip);
    }
    tooltip.textContent = text;
    tooltip.style.left = `${element.getBoundingClientRect().left + element.offsetWidth / 2}px`;
    tooltip.style.top = `${element.getBoundingClientRect().top - element.offsetHeight / 2 - 25}px`; // shifted 25px above
    tooltip.style.display = 'block';
}

function hideTooltip() {
    let tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.style.display = 'none';
    }
}

// Initialize and continue the loop as you have it already set up.



function scheduleNextImage() {
    requestAnimationFrame(() => {
        let currentTime = performance.now();
        if (currentTime - lastInvocationTime >= 60000) { // Ensuring an image every 60 seconds
            addImage();
            lastInvocationTime = currentTime;
        }
        scheduleNextImage(); // Continue the loop
    });
}

// Initialize the process
scheduleNextImage(); // Starts the continuous scheduling of images
