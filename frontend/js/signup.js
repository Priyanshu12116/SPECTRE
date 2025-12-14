// --- 3D INTERACTIVE SHIELD LOGIC (using shared utility) ---
document.addEventListener('DOMContentLoaded', () => {
    // --- PASSWORD VISIBILITY TOGGLE (using shared utility) ---
    if (window.SpectreUtils) {
        SpectreUtils.setupPasswordToggle();
    }

    // --- 3D SHIELD (using shared utility) ---
    if (window.SpectreUtils) {
        SpectreUtils.initShield3D('shield-container');
    }
});

// --- GOOGLE SIGN-IN CALLBACK ---
function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);

    // Decode the JWT token using shared utility
    const userObject = window.SpectreUtils ? SpectreUtils.parseJwt(response.credential) : parseJwtFallback(response.credential);
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

    // Animate and redirect using shared utility
    if (window.SpectreUtils) {
        SpectreUtils.animateAndRedirect('index.html', 1000);
    } else {
        setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    }
}

// Fallback JWT parser if shared utils not loaded
function parseJwtFallback(token) {
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

            // Email validation (using shared utility if available)
            const isValidEmail = window.SpectreUtils ? SpectreUtils.isValidEmail(email) : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!isValidEmail) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }

            // Username validation (using shared utility if available)
            const isValidUsername = window.SpectreUtils ? SpectreUtils.isValidUsername(username) : /^[a-zA-Z0-9_]{3,20}$/.test(username);
            if (!isValidUsername) {
                showMessage('Username must be 3-20 characters (letters, numbers, underscore only).', 'error');
                return;
            }

            signupMessage.textContent = 'Creating your account...';
            signupMessage.className = 'message';

            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            try {
                // Check if user already exists
                const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                const userExists = existingUsers.some(user =>
                    user.email === email || user.username === username
                );

                if (userExists) {
                    showMessage('User with this email or username already exists.', 'error');
                    return;
                }

                // SECURITY: Hash password before storing
                let hashedPassword = password;
                if (window.SpectreCrypto && window.SpectreCrypto.createPasswordHash) {
                    hashedPassword = await window.SpectreCrypto.createPasswordHash(password);
                    console.log('[SECURITY] Password hashed before storage');
                } else {
                    console.warn('[SECURITY WARNING] SpectreCrypto not loaded. Password stored without hashing.');
                }

                // Store user data with hashed password
                existingUsers.push({
                    fullname,
                    email,
                    username,
                    password: hashedPassword,
                    createdAt: new Date().toISOString()
                });
                localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

                // Auto-login after successful signup
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                localStorage.setItem('email', email);
                localStorage.setItem('authMethod', 'traditional');

                showMessage('Account created successfully! Redirecting...', 'success');

                // Animate and redirect using shared utility
                if (window.SpectreUtils) {
                    SpectreUtils.animateAndRedirect('index.html', 1500);
                } else {
                    document.querySelector('.auth-wrapper').style.opacity = '0';
                    setTimeout(() => { window.location.href = 'index.html'; }, 1500);
                }

            } catch (error) {
                console.error('Signup error:', error);
                showMessage('An error occurred during signup. Please try again.', 'error');
            }
        });
    }

    // Helper function to show messages
    function showMessage(text, type) {
        if (window.SpectreUtils) {
            SpectreUtils.showMessage(signupMessage, text, type, 4000);
            if (type === 'error') {
                SpectreUtils.shakeForm(signupForm);
            }
        } else {
            signupMessage.textContent = text;
            signupMessage.className = 'message ' + type;

            if (type === 'error') {
                signupForm.animate([
                    { transform: 'translateX(0px)' },
                    { transform: 'translateX(-10px)' },
                    { transform: 'translateX(10px)' },
                    { transform: 'translateX(0px)' }
                ], { duration: 300, iterations: 1 });

                setTimeout(() => {
                    signupMessage.textContent = '';
                    signupMessage.className = 'message';
                }, 4000);
            }
        }
    }
});
