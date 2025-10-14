document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    // --- PASSWORD VISIBILITY TOGGLE ---
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const wrapper = this.parentElement;
            const input = wrapper.querySelector('input');
            const eyeIcon = this.querySelector('.eye-icon');
            const eyeOffIcon = this.querySelector('.eye-off-icon');
            
            if (input.type === 'password') {
                input.type = 'text';
                eyeIcon.style.display = 'none';
                eyeOffIcon.style.display = 'block';
            } else {
                input.type = 'password';
                eyeIcon.style.display = 'block';
                eyeOffIcon.style.display = 'none';
            }
        });
    });

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
        container.appendChild(renderer.domElement);
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

    // --- GOOGLE SIGN-IN CALLBACK ---
    window.handleCredentialResponse = function(response) {
        console.log("Encoded JWT ID token: " + response.credential);
        
        // Decode the JWT token to get user information
        const userObject = parseJwt(response.credential);
        console.log("User Info:", userObject);
        
        loginMessage.textContent = 'Google Sign-In Successful! Accessing platform...';
        loginMessage.className = 'message success';
        
        // Store user information
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', userObject.name || userObject.email);
        localStorage.setItem('email', userObject.email);
        localStorage.setItem('authMethod', 'google');
        localStorage.setItem('profilePicture', userObject.picture || '');
        
        // Animate and redirect
        document.querySelector('.auth-wrapper').style.opacity = '0';
        document.querySelector('.auth-wrapper').style.transform = 'scale(0.95)';
        document.querySelector('.auth-wrapper').style.transition = 'opacity 0.5s, transform 0.5s';
        
        setTimeout(() => {
            const redirectPath = sessionStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectPath;
            } else {
                window.location.href = 'index.html';
            }
        }, 1000);
    };

    // Helper function to decode JWT token
    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Error parsing JWT:', e);
            return {};
        }
    }

    // --- UPDATED: Simulated Login Logic ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usernameOrEmail = loginForm.querySelector('input[type="text"]').value.trim();
            const password = loginForm.querySelector('#password').value;
            loginMessage.textContent = 'Attempting authentication...';
            loginMessage.className = 'message';
            await new Promise(resolve => setTimeout(resolve, 800));

            // Check for hardcoded admin account
            let isAuthenticated = false;
            let authenticatedUser = null;

            if (usernameOrEmail === 'admin' && password === '123') {
                isAuthenticated = true;
                authenticatedUser = {
                    username: 'admin',
                    fullname: 'Admin User',
                    email: 'admin@spectre.com'
                };
            } else {
                // Check against registered users
                const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const user = registeredUsers.find(u => 
                    (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
                );

                if (user) {
                    isAuthenticated = true;
                    authenticatedUser = user;
                }
            }

            if (isAuthenticated && authenticatedUser) {
                loginMessage.textContent = 'Authentication Successful. Accessing platform...';
                loginMessage.classList.add('success');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', authenticatedUser.username);
                localStorage.setItem('email', authenticatedUser.email || '');
                localStorage.setItem('authMethod', 'traditional');

                document.querySelector('.auth-wrapper').style.opacity = '0';
                document.querySelector('.auth-wrapper').style.transform = 'scale(0.95)';
                document.querySelector('.auth-wrapper').style.transition = 'opacity 0.5s, transform 0.5s';

                setTimeout(() => {
                    // Check for a stored redirect path
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