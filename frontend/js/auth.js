document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    // --- 3D INTERACTIVE SHIELD LOGIC (Unchanged) ---
    const container = document.getElementById('shield-container');
    if (container && typeof THREE !== 'undefined') {
        // ... (all of the three.js shield code is unchanged) ...
        let scene, camera, renderer, shieldPlane, particles;
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        const ambientLight = new THREE.AmbientLight(0x00e5e5, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);
        const textureLoader = new THREE.TextureLoader();
        const shieldTexture = textureLoader.load(
            '../../assets/images/shield.png',
            () => {
                const shieldMaterial = new THREE.ShaderMaterial({
                    uniforms: { shieldTexture: { value: shieldTexture } },
                    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
                    fragmentShader: `uniform sampler2D shieldTexture; varying vec2 vUv; void main() { vec4 texColor = texture2D(shieldTexture, vUv); if (texColor.r > 0.8 && texColor.g > 0.8 && texColor.b > 0.8) { discard; } if (texColor.r > 0.6 && texColor.g < 0.4 && texColor.b < 0.4) { gl_FragColor = vec4(0.1, 0.7, 1.0, 1.0) * (texColor.r * 2.5); } else { gl_FragColor = texColor; } }`,
                });
                const shieldGeometry = new THREE.PlaneGeometry(5, 5.5);
                shieldPlane = new THREE.Mesh(shieldGeometry, shieldMaterial);
                scene.add(shieldPlane);
            },
            undefined,
            (err) => { console.error('An error occurred loading the shield texture.', err); }
        );
        const particleCount = 2000;
        const particlesGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 15; }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMaterial = new THREE.PointsMaterial({ size: 0.02, color: 0x00e5e5, blending: THREE.AdditiveBlending, transparent: true, opacity: 0.7 });
        particles = new THREE.Points(particlesGeometry, particleMaterial);
        scene.add(particles);
        let mouseX = 0, mouseY = 0; let targetX = 0, targetY = 0;
        const windowHalfX = window.innerWidth / 2; const windowHalfY = window.innerHeight / 2;
        function onDocumentMouseMove(event) { mouseX = (event.clientX - windowHalfX) * 0.5; mouseY = (event.clientY - windowHalfY) * 0.5; }
        document.addEventListener('mousemove', onDocumentMouseMove);
        function animate() {
            requestAnimationFrame(animate);
            targetX = mouseX * 0.001; targetY = mouseY * 0.001;
            if (shieldPlane) { shieldPlane.rotation.y += 0.05 * (targetX - shieldPlane.rotation.y); shieldPlane.rotation.x += 0.05 * (targetY - shieldPlane.rotation.x); }
            if (particles) { particles.rotation.y += 0.0005; }
            renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });
    }

    // --- UPDATED: Simulated Login Logic ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = loginForm.querySelector('input[type="text"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            loginMessage.textContent = 'Attempting authentication...';
            loginMessage.className = 'message';
            await new Promise(resolve => setTimeout(resolve, 800));

            if (username === 'admin' && password === '123') {
                loginMessage.textContent = 'Authentication Successful. Accessing platform...';
                loginMessage.classList.add('success');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);

                document.querySelector('.auth-wrapper').style.opacity = '0';
                document.querySelector('.auth-wrapper').style.transform = 'scale(0.95)';
                document.querySelector('.auth-wrapper').style.transition = 'opacity 0.5s, transform 0.5s';

                setTimeout(() => {
                    // **NEW:** Check for a stored redirect path
                    const redirectPath = sessionStorage.getItem('redirectAfterLogin');

                    if (redirectPath) {
                        // If a path was stored, redirect there and clear it
                        sessionStorage.removeItem('redirectAfterLogin');
                        window.location.href = redirectPath;
                    } else {
                        // Otherwise, go to the default home page
                        window.location.href = 'index.html';
                    }
                }, 500);
            } else {
                loginMessage.textContent = 'Access Denied. Invalid credentials.';
                loginMessage.classList.add('error');
                loginForm.animate([{ transform: 'translateX(0px)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0px)' }], { duration: 300, iterations: 1 });
                setTimeout(() => { loginMessage.textContent = ''; loginMessage.className = 'message'; }, 3000);
            }
        });
    }
});