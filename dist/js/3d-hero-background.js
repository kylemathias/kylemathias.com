(function ($) {
    "use strict";

    $(function () {



        var $window = $(window),
            windowWidth = window.innerWidth,
            windowHeight = window.innerHeight,
            rendererCanvasID = '3D-background-three-canvas5';



        // Generate one plane geometries mesh to scene
        //-------------------------------------	
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
            speed = 0.0005, // terrain size
            cycle = 0.0000001, //move speed
            scale = 25; // smoothness



        init();
        render();

        function init() {
            //camera
            camera = new THREE.PerspectiveCamera(60, windowWidth / windowHeight, 1, 10000);
            camera.position.set(0, 0, 100);


            //Scene
            scene = new THREE.Scene();

            lights[0] = new THREE.PointLight(0x554488, 1, 0); // A mix of light blue and a hint of red
            lights[1] = new THREE.PointLight(0x6655AA, 1, 0); // Similar, but slightly lighter and more purple
            lights[2] = new THREE.PointLight(0x403366, 1, 0); 

            lights[0].position.set(0, 200, 0);
            lights[1].position.set(100, 200, 100);
            lights[2].position.set(-100, -200, -100);

            scene.add(lights[0]);
            scene.add(lights[1]);
            scene.add(lights[2]);



            //WebGL Renderer		
            renderer = new THREE.WebGLRenderer({
                canvas: document.getElementById(rendererCanvasID), //canvas
                alpha: true,
                antialias: true
            });
            renderer.setSize(windowWidth, windowHeight);


            // Immediately use the texture for material creation
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
                wireframe: true
            });
            plane = new THREE.Mesh(geometry, material);
            plane.position.set(0, 0, 0);

            simplex = new SimplexNoise();
            moveNoise();


            group.add(plane);
            scene.add(group);
// Starfield creation with adjusted depth
var starGeometry = new THREE.Geometry();
for (var i = 0; i < 10000; i++) {
    var star = new THREE.Vector3();
    star.x = THREE.Math.randFloatSpread(4000); // Spread in x
    star.y = THREE.Math.randFloatSpread(2000); // Spread in y
    // Adjust z to place stars far back
    star.z = THREE.Math.randFloat(-3000, -1000);

    starGeometry.vertices.push(star);
}

var starsMaterial = new THREE.PointsMaterial({
    color: 0x888888,
    size: 1,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
    depthTest: true, // Enable depth testing to ensure correct layering
    depthWrite: false // Avoid affecting the depth buffer to keep stars in the background
});
var starField = new THREE.Points(starGeometry, starsMaterial);
scene.add(starField);


            // Fires when the window changes
            window.addEventListener('resize', onWindowResize, false);


        }

        function render() {
            requestAnimationFrame(render);

            var delta = clock.getDelta();

            //To set a background color.
            renderer.setClearColor(0x000000);


            //change noise values over time
            moveNoise();

            //update sprite
            cycle -= delta * 0.1;



            renderer.render(scene, camera);




        }


        function onWindowResize() {
            // Ensure the camera's aspect ratio is updated based on the new dimensions
            camera.aspect = document.body.clientWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        
            // Set the renderer size to match the body's width and the window's height.
            // This makes the canvas width responsive to the body element's width.
            renderer.setSize(document.body.clientWidth, window.innerHeight);
        }



        function moveNoise() {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = geometry.vertices[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
                        _iterator2.
                        return();
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