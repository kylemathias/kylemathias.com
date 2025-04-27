(function ($) {
  "use strict";

  // Add this line to expose the init function globally
  window.reinitialize3DBackground = function() {
    init();
    render();
  };

  // Use a progressive loading approach
  document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if the canvas element exists
    if (document.getElementById('3D-background-three-canvas5')) {
      // First render the page, then load the heavy 3D effect
      setTimeout(function() {
        init();
        render();
      }, 500); // Increased delay to prioritize other content
    }
  });

  var $window = $(window),
    windowWidth = window.innerWidth,
    windowHeight = window.innerHeight,
    rendererCanvasID = "3D-background-three-canvas5";

  // More efficient page type detection
  function isTemplatePage() {
    const path = window.location.pathname.split('/').pop();
    return path === 'resume.html' || path === 'contact.html' || path.includes('template.html');
  }

  function isHomepage() {
    const path = window.location.pathname.split('/').pop();
    return path === '' || path === 'index.html';
  }

  // Make sure these functions are available to the rest of the code
  window.isTemplatePage = isTemplatePage;
  window.isHomepage = isHomepage;

  var camera,
    scene,
    material,
    group,
    lights = [],
    renderer,
    shaderSprite,
    clock = new THREE.Clock();

  var geometry, plane, simplex;

  // Significantly reduced values for better performance
  var factor = 300,
    speed = 0.0003,  // Reduced for better performance
    cycle = 0.0000001,
    scale = 20;      // Reduced complexity

  // Further reduce star count for better performance
  var starCount = isTemplatePage() ? 5000 : 3500;

  function init() {
    //camera
    camera = new THREE.PerspectiveCamera(
      60,
      windowWidth / windowHeight,
      1,
      10000
    );
    camera.position.set(0, 0, 100);

    //Scene
    scene = new THREE.Scene();

    // Different lighting for template pages vs home page - with reduced intensity
    if (isTemplatePage()) {
      lights[0] = new THREE.PointLight(0x554488, 0.7, 0); 
      lights[1] = new THREE.PointLight(0x6655aa, 0.7, 0);
      lights[2] = new THREE.PointLight(0x403366, 0.7, 0);
    } else {
      lights[0] = new THREE.PointLight(0x554488, 0.8, 0);
      lights[1] = new THREE.PointLight(0x6655aa, 0.8, 0);
      lights[2] = new THREE.PointLight(0x403366, 0.8, 0);
    }

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);

    scene.add(lights[0]);
    scene.add(lights[1]);
    scene.add(lights[2]);

    //WebGL Renderer with optimized parameters
    renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById(rendererCanvasID), 
      alpha: true,
      antialias: false,  // False for better performance
      precision: 'mediump', // Medium precision for better performance
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false // Better performance
    });
    renderer.setSize(windowWidth, windowHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Limit pixel ratio for performance

    // Enhanced starfield that's visible on all pages - with reduced complexity
    var starGeometry = new THREE.Geometry();
    
    for (var i = 0; i < starCount; i++) {
      var star = new THREE.Vector3();
      star.x = THREE.Math.randFloatSpread(4000); 
      star.y = THREE.Math.randFloatSpread(2000);
      
      // Adjust z-depth for template pages
      if (isTemplatePage()) {
        // Bring stars closer on template pages
        star.z = THREE.Math.randFloat(-2000, -500);
      } else {
        star.z = THREE.Math.randFloat(-3000, -1000);
      }
      
      starGeometry.vertices.push(star);
    }

    // Different star appearance for template pages
    var starsMaterial = new THREE.PointsMaterial({
      color: isTemplatePage() ? 0x9999ff : 0x888888,
      size: isTemplatePage() ? 1.2 : 1,
      sizeAttenuation: true,
      transparent: true,
      opacity: isTemplatePage() ? 0.8 : 0.7,
      depthTest: true,
      depthWrite: false, // Better for transparent objects performance
    });
    
    var starField = new THREE.Points(starGeometry, starsMaterial);
    scene.add(starField);

    // Only add terrain on the homepage
    if (isHomepage()) {
      group = new THREE.Object3D();
      group.position.set(0, -300, -1000);
      group.rotation.set(29.8, 0, 0);

      // Significantly reduced geometry complexity for better performance
      geometry = new THREE.PlaneGeometry(4000, 2000, 64, 32); // Further reduced segments
      material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 1,
        blending: THREE.NoBlending,
        side: THREE.FrontSide,
        transparent: false,
        depthTest: true,
        wireframe: true,
      });
      plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 0);

      simplex = new SimplexNoise();
      moveNoise();

      group.add(plane);
      scene.add(group);
    }

    // Add slow camera movement for template pages
    if (isTemplatePage()) {
      camera.position.z = 150;  // Position camera a bit further back
    }

    // Throttled event listener for better performance
    let resizeTimeout;
    window.addEventListener("resize", function() {
      if (!resizeTimeout) {
        resizeTimeout = setTimeout(function() {
          resizeTimeout = null;
          onWindowResize();
        }, 200); // Increased delay for throttling
      }
    }, false);
  }

  // Variables for camera movement on template pages
  var cameraMovementAngle = 0;
  var lastFrameTime = 0;
  var fps = 30; // Limit to 30fps for better performance
  var fpsInterval = 1000 / fps;

  function render(timestamp) {
    requestAnimationFrame(render);

    // Throttle to desired fps for better performance
    if (!timestamp) timestamp = 0;
    var elapsed = timestamp - lastFrameTime;
    
    if (elapsed > fpsInterval) {
      lastFrameTime = timestamp - (elapsed % fpsInterval);
      
      // Actual rendering code
      var delta = clock.getDelta();
      
      renderer.setClearColor(0x000000);
  
      if (isHomepage()) {
        // Home page gets the terrain animation
        moveNoise();
      } else if (isTemplatePage()) {
        // Template pages get subtle camera movement
        cameraMovementAngle += delta * 0.1;
        camera.position.x = Math.sin(cameraMovementAngle) * 10;
        camera.position.y = Math.cos(cameraMovementAngle) * 5;
        camera.lookAt(0, 0, -1000);
      }
  
      cycle -= delta * 0.1;
      renderer.render(scene, camera);
    }
  }

  function onWindowResize() {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    camera.aspect = windowWidth / windowHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(windowWidth, windowHeight);
  }

  function moveNoise() {
    for (let i = 0; i < geometry.vertices.length; i++) {
      let vertex = geometry.vertices[i];
      let xoff = vertex.x / factor;
      let yoff = vertex.y / factor + cycle;
      let rand = simplex.noise2D(xoff, yoff) * scale;
      vertex.z = rand;
    }
    
    geometry.verticesNeedUpdate = true;
    cycle += speed;
  }
})(jQuery);