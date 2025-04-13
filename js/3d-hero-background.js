(function ($) {
  "use strict";

  // Add this line to expose the init function globally
  window.reinitialize3DBackground = function() {
    init();
    render();
  };

  $(function () {
    // Your existing code...
    //init();
    //render();
  });

  $(function () {
    var $window = $(window),
      windowWidth = window.innerWidth,
      windowHeight = window.innerHeight,
      rendererCanvasID = "3D-background-three-canvas5";

    // Check if the current page is the homepage
    function isHomepage() {
      let path = window.location.pathname;
      return path === "/" || path === "/index.html" || path.endsWith("index.html");
    }

 // Add this function near the top of your code
function isTemplatePage() {
  // Check if we're on a template page (resume.html or contact.html)
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

    var factor = 275,
      speed = 0.0005,
      cycle = 0.0000001,
      scale = 25;

    init();
    render();

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

      // Different lighting for template pages vs home page
      if (isTemplatePage()) {
        lights[0] = new THREE.PointLight(0x554488, 0.8, 0); 
        lights[1] = new THREE.PointLight(0x6655aa, 0.8, 0);
        lights[2] = new THREE.PointLight(0x403366, 0.8, 0);
      } else {
        lights[0] = new THREE.PointLight(0x554488, 1, 0);
        lights[1] = new THREE.PointLight(0x6655aa, 1, 0);
        lights[2] = new THREE.PointLight(0x403366, 1, 0);
      }

      lights[0].position.set(0, 200, 0);
      lights[1].position.set(100, 200, 100);
      lights[2].position.set(-100, -200, -100);

      scene.add(lights[0]);
      scene.add(lights[1]);
      scene.add(lights[2]);

      //WebGL Renderer
      renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById(rendererCanvasID), 
        alpha: true,
        antialias: true,
      });
      renderer.setSize(windowWidth, windowHeight);

      // Enhanced starfield that's visible on all pages
      var starGeometry = new THREE.Geometry();
      // More stars for template pages
      var starCount = isTemplatePage() ? 15000 : 10000;
      
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
        color: isTemplatePage() ? 0x9999ff : 0x888888,  // Bluer stars on template pages
        size: isTemplatePage() ? 1.3 : 1,
        sizeAttenuation: true,
        transparent: true,
        opacity: isTemplatePage() ? 0.9 : 0.8,
        depthTest: true,
        depthWrite: true,
      });
      
      var starField = new THREE.Points(starGeometry, starsMaterial);
      scene.add(starField);

      // Only add terrain on the homepage
      if (isHomepage()) {
        group = new THREE.Object3D();
        group.position.set(0, -300, -1000);
        group.rotation.set(29.8, 0, 0);

        geometry = new THREE.PlaneGeometry(4000, 2000, 128, 64);
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

      window.addEventListener("resize", onWindowResize, false);
    }

    // Variables for camera movement on template pages
    var cameraMovementAngle = 0;

    function render() {
      requestAnimationFrame(render);

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

    function onWindowResize() {
      camera.aspect = document.body.clientWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(document.body.clientWidth, window.innerHeight);
    }

    function moveNoise() {
      // Existing moveNoise function
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (
          var _iterator2 = geometry.vertices[Symbol.iterator](), _step2;
          !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done);
          _iteratorNormalCompletion2 = true
        ) {
          var vertex = _step2.value;
          var xoff = vertex.x / factor;
          var yoff = vertex.y / factor + cycle;
          var rand = simplex.noise2D(xoff, yoff) * scale;
          vertex.z = rand;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      geometry.verticesNeedUpdate = true;
      cycle += speed;
    }
  });
})(jQuery);