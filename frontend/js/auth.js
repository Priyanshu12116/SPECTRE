document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    // --- PASSWORD VISIBILITY TOGGLE (using shared utility) ---
    if (window.SpectreUtils) {
        SpectreUtils.setupPasswordToggle();
    }

    // --- 3D INTERACTIVE SHIELD (using shared utility) ---
    if (window.SpectreUtils) {
        SpectreUtils.initShield3D('shield-container');
    }

    // --- GOOGLE SIGN-IN CALLBACK ---
    window.handleCredentialResponse = function (response) {
        console.log("Encoded JWT ID token: " + response.credential);

        // Decode the JWT token to get user information
        const userObject = window.SpectreUtils ? SpectreUtils.parseJwt(response.credential) : parseJwtFallback(response.credential);
        console.log("User Info:", userObject);

        loginMessage.textContent = 'Google Sign-In Successful! Accessing platform...';
        loginMessage.className = 'message success';

        // Check if user exists in registeredUsers, if not add them
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const existingUser = registeredUsers.find(u => u.email === userObject.email);

        if (!existingUser) {
            // Add new Google user to registeredUsers
            const newUser = {
                fullname: userObject.name || userObject.email,
                email: userObject.email,
                username: userObject.name || userObject.email.split('@')[0],
                authMethod: 'google',
                profilePicture: userObject.picture || '',
                createdAt: new Date().toISOString(),
                hasPassword: false // Google users don't have password initially
            };
            registeredUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        } else {
            // Update existing user with createdAt if missing
            if (!existingUser.createdAt) {
                existingUser.createdAt = new Date().toISOString();
            }
            // Ensure hasPassword flag exists for existing Google users
            if (existingUser.authMethod === 'google' && existingUser.hasPassword === undefined) {
                existingUser.hasPassword = existingUser.password ? true : false;
            }
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }

        // Store user information
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', userObject.name || userObject.email);
        localStorage.setItem('email', userObject.email);
        localStorage.setItem('authMethod', 'google');
        localStorage.setItem('profilePicture', userObject.picture || '');

        // Animate and redirect using shared utility
        const redirectUrl = window.SpectreUtils ? SpectreUtils.getRedirectUrl('/') : '/';
        if (window.SpectreUtils) {
            SpectreUtils.animateAndRedirect(redirectUrl, 1000);
        } else {
            setTimeout(() => { window.location.href = redirectUrl; }, 1000);
        }
    };

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

    // --- SIMULATED LOGIN LOGIC ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usernameOrEmail = loginForm.querySelector('input[type="text"]').value.trim();
            const password = loginForm.querySelector('#password').value;
            loginMessage.textContent = 'Attempting authentication...';
            loginMessage.className = 'message';
            await new Promise(resolve => setTimeout(resolve, 800));

            // Check for authenticated user
            let isAuthenticated = false;
            let authenticatedUser = null;

            // Security: Check registered users with secure password verification
            // SECURITY FIX: Removed hardcoded admin/123 credentials
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const user = registeredUsers.find(u =>
                u.username === usernameOrEmail || u.email === usernameOrEmail
            );

            if (user && window.SpectreCrypto) {
                // Secure password verification with hashing
                try {
                    isAuthenticated = await window.SpectreCrypto.verifyPassword(password, user.password);
                    if (isAuthenticated) authenticatedUser = user;
                } catch (err) {
                    console.error('Password verification failed:', err);
                }
            } else if (user) {
                // Legacy fallback (plain text - for migration)
                isAuthenticated = user.password === password;
                if (isAuthenticated) authenticatedUser = user;
            }

            if (isAuthenticated && authenticatedUser) {
                loginMessage.textContent = 'Authentication Successful. Accessing platform...';
                loginMessage.classList.add('success');
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', authenticatedUser.username);
                localStorage.setItem('email', authenticatedUser.email || '');
                localStorage.setItem('authMethod', 'traditional');

                // Use shared utility for redirect
                const redirectUrl = window.SpectreUtils ? SpectreUtils.getRedirectUrl('/') : '/';
                if (window.SpectreUtils) {
                    SpectreUtils.animateAndRedirect(redirectUrl, 500);
                } else {
                    document.querySelector('.auth-wrapper').style.opacity = '0';
                    setTimeout(() => { window.location.href = redirectUrl; }, 500);
                }
            } else {
                loginMessage.textContent = 'Access Denied. Invalid credentials.';
                loginMessage.classList.add('error');
                if (window.SpectreUtils) {
                    SpectreUtils.shakeForm(loginForm);
                } else {
                    loginForm.animate([{ transform: 'translateX(0px)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0px)' }], { duration: 300, iterations: 1 });
                }
                setTimeout(() => { loginMessage.textContent = ''; loginMessage.className = 'message'; }, 3000);
            }
        });
    }
});