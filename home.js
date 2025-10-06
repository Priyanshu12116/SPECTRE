document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('globe-container');

    // Only run the globe animation if the container exists
    if (container) {
        // --- Main Initialization Function (for the globe) ---
        async function initGlobe() {
            let scene, camera, renderer, globe, atmosphere;

            // --- 1. Setup Scene, Camera, and Renderer ---
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);
            camera.position.z = 2.5;

            // --- 2. Create Binary Earth Texture ---
            const globeTexture = await createGlobeTextureFromImage('worldmap.jpg');

            // --- 3. Create the Solid Sphere (Globe) ---
            const geometry = new THREE.SphereGeometry(1.5, 64, 64);
            const material = new THREE.MeshStandardMaterial({ map: globeTexture });
            globe = new THREE.Mesh(geometry, material);
            scene.add(globe);

            // --- 4. Add Lights for a 3D Look ---
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
            scene.add(ambientLight);
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 3, 5);
            scene.add(directionalLight);

            // --- 5. Create the Glowing Outline (Atmosphere) ---
            const atmosphereGeometry = new THREE.SphereGeometry(1.5, 64, 64);
            const atmosphereMaterial = new THREE.ShaderMaterial({
                vertexShader: `
                    varying vec3 vertexNormal;
                    void main() {
                        vertexNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
                fragmentShader: `
                    varying vec3 vertexNormal;
                    void main() {
                        float intensity = pow(0.6 - dot(vertexNormal, vec3(0, 0, 1.0)), 2.0);
                        gl_FragColor = vec4(0.0, 0.64, 1.0, 1.0) * intensity;
                    }
                `,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide,
                transparent: true
            });
            atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
            atmosphere.scale.set(1.1, 1.1, 1.1);
            scene.add(atmosphere);

            // --- 6. Interactivity & Animation ---
            setupInteractivityAndAnimation(container, globe, atmosphere, scene, camera, renderer);
        }

        /**
         * Creates a dense, high-resolution binary texture from a local image.
         */
        function createGlobeTextureFromImage(imageUrl) {
            return new Promise((resolve) => {
                const image = new Image();
                image.src = imageUrl;

                image.onload = () => {
                    const mapCanvas = document.createElement('canvas');
                    mapCanvas.width = image.width;
                    mapCanvas.height = image.height;
                    const mapContext = mapCanvas.getContext('2d');
                    mapContext.drawImage(image, 0, 0);
                    const mapData = mapContext.getImageData(0, 0, mapCanvas.width, mapCanvas.height);

                    const textureCanvas = document.createElement('canvas');
                    textureCanvas.width = 4096;
                    textureCanvas.height = 2048;
                    const textureContext = textureCanvas.getContext('2d');
                    const scaleX = textureCanvas.width / mapCanvas.width;
                    const scaleY = textureCanvas.height / mapCanvas.height;

                    textureContext.fillStyle = '#0D0D1A';
                    textureContext.fillRect(0, 0, textureCanvas.width, textureCanvas.height);
                    
                    textureContext.font = '10px monospace';

                    for (let y = 0; y < mapCanvas.height; y += 2) {
                        for (let x = 0; x < mapCanvas.width; x += 2) {
                            const i = (y * mapCanvas.width + x) * 4;
                            const r = mapData.data[i];

                            if (r < 50) {
                                textureContext.fillStyle = '#00A3FF';
                                textureContext.fillText(Math.random() > 0.5 ? '1' : '0', x * scaleX, y * scaleY);
                            }
                        }
                    }
                    resolve(new THREE.CanvasTexture(textureCanvas));
                };

                image.onerror = () => {
                    console.error("Failed to load the local map image. Make sure 'worldmap.jpg' is in the same folder as index.html.");
                };
            });
        }

        /**
         * Sets up mouse controls, responsiveness, and the animation loop for the globe.
         */
        function setupInteractivityAndAnimation(container, globe, atmosphere, scene, camera, renderer) {
            let isMouseDown = false;
            let previousMousePosition = { x: 0, y: 0 };
            container.addEventListener('mousedown', (e) => { isMouseDown = true; });
            container.addEventListener('mouseup', (e) => { isMouseDown = false; });
            container.addEventListener('mouseleave', (e) => { isMouseDown = false; });
            container.addEventListener('mousemove', (e) => {
                if (!isMouseDown) {
                    previousMousePosition = { x: e.clientX, y: e.clientY };
                    return;
                };
                const deltaX = e.clientX - previousMousePosition.x;
                globe.rotation.y += deltaX * 0.005;
                atmosphere.rotation.y += deltaX * 0.005;
                previousMousePosition = { x: e.clientX, y: e.clientY };
            });

            window.addEventListener('resize', () => {
                if (container.clientWidth > 0 && container.clientHeight > 0) {
                    camera.aspect = container.clientWidth / container.clientHeight;
                    camera.updateProjectionMatrix();
                    renderer.setSize(container.clientWidth, container.clientHeight);
                }
            });

            function animate() {
                requestAnimationFrame(animate);
                if (!isMouseDown) {
                    globe.rotation.y += 0.0005;
                    atmosphere.rotation.y += 0.0005;
                }
                renderer.render(scene, camera);
            }
            animate();
        }

        initGlobe(); // Start the globe animation
    }

    // --- Code for the interactive background ---
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        const inverseX = window.innerWidth - mouseX;
        const inverseY = window.innerHeight - mouseY;
    
        document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
        document.documentElement.style.setProperty('--mouse-inv-x', `${inverseX}px`);
        document.documentElement.style.setProperty('--mouse-inv-y', `${inverseY}px`);
    });

    // --- MODIFIED SCROLL ANIMATION LOGIC ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // When the element is in view, add the 'visible' class
                entry.target.classList.add('visible');
            } else {
                // When the element is out of view, remove the 'visible' class to reset it
                entry.target.classList.remove('visible');
            }
        });
    }, {
        threshold: 0.2
    });

    const elementsToAnimate = document.querySelectorAll('.features-intro, .feature-card');
    elementsToAnimate.forEach((el) => observer.observe(el));
    // --- Navbar Hide/Show on Scroll Logic ---
let lastScrollTop = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    // Get the current scroll position
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Scrolling Down: Hide the navbar
        navbar.classList.add('nav-hidden');
    } else {
        // Scrolling Up: Show the navbar
        navbar.classList.remove('nav-hidden');
    }
    // Update the last scroll position
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;});
});