// --- 3D INTERACTIVE SHIELD LOGIC (Same as login) ---
document.addEventListener('DOMContentLoaded', () => {
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

    const container = document.getElementById('shield-container');
    if (container && typeof THREE !== 'undefined') {
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
        const particleMaterial = new THREE.PointsMaterial({ 
            size: 0.02, 
            color: 0x00e5e5, 
            blending: THREE.AdditiveBlending, 
            transparent: true, 
            opacity: 0.7 
        });
        particles = new THREE.Points(particlesGeometry, particleMaterial);
        scene.add(particles);
        
        let mouseX = 0, mouseY = 0; 
        let targetX = 0, targetY = 0;
        const windowHalfX = window.innerWidth / 2; 
        const windowHalfY = window.innerHeight / 2;
        
        function onDocumentMouseMove(event) { 
            mouseX = (event.clientX - windowHalfX) * 0.5; 
            mouseY = (event.clientY - windowHalfY) * 0.5; 
        }
        document.addEventListener('mousemove', onDocumentMouseMove);
        
        function animate() {
            requestAnimationFrame(animate);
            targetX = mouseX * 0.001; 
            targetY = mouseY * 0.001;
            if (shieldPlane) { 
                shieldPlane.rotation.y += 0.05 * (targetX - shieldPlane.rotation.y); 
                shieldPlane.rotation.x += 0.05 * (targetY - shieldPlane.rotation.x); 
            }
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
});

// --- GOOGLE SIGN-IN CALLBACK ---
function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    
    // Decode the JWT token to get user information
    const userObject = parseJwt(response.credential);
    console.log("User Info:", userObject);
    
    const signupMessage = document.getElementById('signupMessage');
    signupMessage.textContent = 'Google Sign-In Successful! Setting up your account...';
    signupMessage.className = 'message success';
    
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
        window.location.href = 'index.html';
    }, 1000);
}

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

// --- TRADITIONAL SIGNUP FORM LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const signupMessage = document.getElementById('signupMessage');
    
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value.trim();
            const email = document.getElementById('email').value.trim();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAccepted = document.getElementById('terms').checked;
            
            // Validation
            if (!termsAccepted) {
                showMessage('Please accept the Terms of Service and Privacy Policy.', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('Passwords do not match.', 'error');
                return;
            }
            
            if (password.length < 8) {
                showMessage('Password must be at least 8 characters long.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Username validation (alphanumeric and underscore only)
            const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
            if (!usernameRegex.test(username)) {
                showMessage('Username must be 3-20 characters (letters, numbers, underscore only).', 'error');
                return;
            }
            
            signupMessage.textContent = 'Creating your account...';
            signupMessage.className = 'message';
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // In a real application, you would send this data to your backend
            // For now, we'll simulate a successful signup
            try {
                // Simulate backend call
                const userData = {
                    fullname,
                    email,
                    username,
                    password // In production, NEVER store plain passwords
                };
                
                // Check if user already exists (simulated)
                const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const userExists = existingUsers.some(user => 
                    user.email === email || user.username === username
                );
                
                if (userExists) {
                    showMessage('User with this email or username already exists.', 'error');
                    return;
                }
                
                // Store user data (in production, this would be done on the backend)
                existingUsers.push({
                    fullname,
                    email,
                    username,
                    password, // In production, hash this!
                    createdAt: new Date().toISOString()
                });
                localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
                
                // Auto-login after successful signup
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                localStorage.setItem('email', email);
                localStorage.setItem('authMethod', 'traditional');
                
                showMessage('Account created successfully! Redirecting...', 'success');
                
                // Animate and redirect
                document.querySelector('.auth-wrapper').style.opacity = '0';
                document.querySelector('.auth-wrapper').style.transform = 'scale(0.95)';
                document.querySelector('.auth-wrapper').style.transition = 'opacity 0.5s, transform 0.5s';
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
                
            } catch (error) {
                console.error('Signup error:', error);
                showMessage('An error occurred during signup. Please try again.', 'error');
            }
        });
    }
    
    // Helper function to show messages
    function showMessage(text, type) {
        signupMessage.textContent = text;
        signupMessage.className = 'message ' + type;
        
        if (type === 'error') {
            signupForm.animate([
                { transform: 'translateX(0px)' },
                { transform: 'translateX(-10px)' },
                { transform: 'translateX(10px)' },
                { transform: 'translateX(0px)' }
            ], {
                duration: 300,
                iterations: 1
            });
            
            setTimeout(() => {
                signupMessage.textContent = '';
                signupMessage.className = 'message';
            }, 4000);
        }
    }
});
