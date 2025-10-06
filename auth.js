document.addEventListener('DOMContentLoaded', () => {
    const lockGraphic = document.getElementById('lockGraphic');
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');

    // Initial state: locked
    if(lockGraphic) {
        lockGraphic.classList.add('locked');
    }

    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const usernameInput = loginForm.querySelector('input[type="text"]');
            const passwordInput = loginForm.querySelector('input[type="password"]');
            const username = usernameInput.value;
            const password = passwordInput.value;

            loginMessage.textContent = 'Attempting login...';
            loginMessage.classList.remove('success', 'error');

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500)); 

            // --- Simulated Login Logic ---
            if (username === 'admin' && password === '123') {
                // Successful Login
                if(lockGraphic) {
                    lockGraphic.classList.remove('locked');
                    lockGraphic.classList.add('unlocked');
                }
                loginMessage.textContent = 'Login successful! Redirecting...';
                loginMessage.classList.add('success');
                
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);

                // Simulate redirect after animation
                setTimeout(() => {
                    // This line will now redirect the user to your tools page
                    window.location.href = 'app.html'; 
                }, 1500); 
            } else {
                // Failed Login
                if(lockGraphic) {
                    lockGraphic.classList.remove('unlocked');
                    lockGraphic.classList.add('locked'); 
                }
                loginMessage.textContent = 'Invalid username or password.';
                loginMessage.classList.add('error');
                // Reset message after a short delay
                setTimeout(() => {
                    loginMessage.textContent = '';
                    loginMessage.classList.remove('error');
                }, 3000);
            }
        });
    }
});