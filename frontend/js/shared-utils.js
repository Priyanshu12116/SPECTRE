/**
 * SPECTRE Shared Utilities
 * Consolidates common functionality used across multiple pages
 */

const SpectreUtils = {
    /**
     * Setup password visibility toggle for all .toggle-password buttons
     */
    setupPasswordToggle: function () {
        const togglePasswordButtons = document.querySelectorAll('.toggle-password');
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function () {
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
    },

    /**
     * Decode JWT token
     * @param {string} token - JWT token string
     * @returns {object} Decoded payload or empty object on error
     */
    parseJwt: function (token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error('Error parsing JWT:', e);
            return {};
        }
    },

    /**
     * Animate auth wrapper fade out and redirect
     * @param {string} redirectUrl - URL to redirect to
     * @param {number} delay - Delay in ms before redirect (default: 1000)
     */
    animateAndRedirect: function (redirectUrl, delay = 1000) {
        const wrapper = document.querySelector('.auth-wrapper');
        if (wrapper) {
            wrapper.style.opacity = '0';
            wrapper.style.transform = 'scale(0.95)';
            wrapper.style.transition = 'opacity 0.5s, transform 0.5s';
        }
        setTimeout(() => {
            window.location.href = redirectUrl;
        }, delay);
    },

    /**
     * Get redirect URL (from session storage or default)
     * @param {string} defaultUrl - Default URL if no stored redirect
     * @returns {string} Redirect URL
     */
    getRedirectUrl: function (defaultUrl = '/') {
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
            sessionStorage.removeItem('redirectAfterLogin');
            return redirectPath;
        }
        return defaultUrl;
    },

    /**
     * Initialize 3D Shield animation (for login/signup pages)
     * @param {string} containerId - ID of container element (default: 'shield-container')
     */
    initShield3D: function (containerId = 'shield-container') {
        const container = document.getElementById(containerId);
        if (!container || typeof THREE === 'undefined') {
            return null;
        }

        let scene, camera, renderer, shieldPlane, particles;

        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        // Renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x00e5e5, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Shield texture
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

        // Particles
        const particleCount = 2000;
        const particlesGeometry = new THREE.BufferGeometry();
        const posArray = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x00e5e5,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.7
        });
        particles = new THREE.Points(particlesGeometry, particleMaterial);
        scene.add(particles);

        // Mouse interaction
        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        function onDocumentMouseMove(event) {
            mouseX = (event.clientX - windowHalfX) * 0.5;
            mouseY = (event.clientY - windowHalfY) * 0.5;
        }
        document.addEventListener('mousemove', onDocumentMouseMove);

        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;
            if (shieldPlane) {
                shieldPlane.rotation.y += 0.05 * (targetX - shieldPlane.rotation.y);
                shieldPlane.rotation.x += 0.05 * (targetY - shieldPlane.rotation.x);
            }
            if (particles) {
                particles.rotation.y += 0.0005;
            }
            renderer.render(scene, camera);
        }
        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        });

        return { scene, camera, renderer, shieldPlane, particles };
    },

    /**
     * Show error animation on form
     * @param {HTMLElement} form - Form element to animate
     */
    shakeForm: function (form) {
        if (form) {
            form.animate([
                { transform: 'translateX(0px)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(0px)' }
            ], {
                duration: 300,
                iterations: 1
            });
        }
    },

    /**
     * Show message with auto-clear for errors
     * @param {HTMLElement} messageEl - Message element
     * @param {string} text - Message text
     * @param {string} type - 'success' or 'error'
     * @param {number} clearAfter - Clear after ms (0 to not clear)
     */
    showMessage: function (messageEl, text, type, clearAfter = 3000) {
        if (!messageEl) return;
        messageEl.textContent = text;
        messageEl.className = 'message ' + type;

        if (type === 'error' && clearAfter > 0) {
            setTimeout(() => {
                messageEl.textContent = '';
                messageEl.className = 'message';
            }, clearAfter);
        }
    },

    /**
     * Validate email format
     * @param {string} email 
     * @returns {boolean}
     */
    isValidEmail: function (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate username format (3-20 chars, alphanumeric + underscore)
     * @param {string} username 
     * @returns {boolean}
     */
    isValidUsername: function (username) {
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    }
};

// Export for use in other scripts
window.SpectreUtils = SpectreUtils;
