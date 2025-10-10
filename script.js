document.addEventListener('DOMContentLoaded', () => {

    // --- AUTHENTICATION & UI LOGIC ---
    const username = localStorage.getItem('username');
    const userInfoDiv = document.getElementById('user-info');
    if (username && userInfoDiv) {
        userInfoDiv.innerHTML = `
            <span>Welcome, <strong>${username}</strong>!</span>
            <button id="logoutBtn" class="logout-btn">Logout</button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', () => {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('username');
            window.location.href = 'index.html'; // Redirect to home page on logout
        });
    }

    // --- MATRIX RAIN BACKGROUND ANIMATION ---
    const canvas = document.getElementById('matrix-bg');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const alphabet = '01';
    const fontSize = 12;
    const columns = canvas.width / fontSize;
    const rainDrops = Array.from({ length: columns }).fill(1);

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0a7a2cff';
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < rainDrops.length; i++) {
            const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    }
    setInterval(draw, 30);
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // --- APPLICATION ELEMENT SELECTIONS ---
    const dropZone = document.querySelector('.drop-zone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('file-list');
    const startBtn = document.getElementById('startBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const progressBar = document.getElementById('progressBar');
    const logOutput = document.getElementById('log-output');
    let uploadedFiles = [];
    let obfuscationInterval;

    // --- FILE UPLOAD LOGIC ---
    if (dropZone) {
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--accent-color-green)'; });
        dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = 'var(--border-color)'; });
        dropZone.addEventListener('drop', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--border-color)'; handleFiles(e.dataTransfer.files); });
        fileInput.addEventListener('change', () => { handleFiles(fileInput.files); });
    }

    function handleFiles(files) {
        for (const file of files) { if (!uploadedFiles.some(f => f.name === file.name)) { uploadedFiles.push(file); } }
        renderFileList();
    }

    function renderFileList() {
        if(fileList) fileList.innerHTML = '';
        uploadedFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
            fileList.appendChild(fileItem);
        });
    }

    // --- SIMULATED PROCESS CONTROL LOGIC ---
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            if (uploadedFiles.length === 0) {
                addLog('Please upload files before starting.', 'error');
                return;
            }
            startObfuscation();
        });
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            clearInterval(obfuscationInterval);
            addLog('Obfuscation cancelled by user.', 'error');
            finishProcess();
        });
    }

    function startObfuscation() {
        startBtn.disabled = true;
        cancelBtn.disabled = false;
        progressBar.style.width = '0%';
        if(logOutput) logOutput.innerHTML = '';
        addLog('Starting obfuscation process...', 'info');
        let progress = 0;
        obfuscationInterval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;
            progressBar.style.width = progress + '%';
            if (progress >= 20 && progress < 30) addLog('Parsing source files...', 'info');
            else if (progress >= 40 && progress < 50) addLog('Applying control flow flattening...', 'info');
            else if (progress >= 60 && progress < 70) addLog('Encrypting strings...', 'info');
            else if (progress >= 80 && progress < 90) addLog('Generating binary...', 'info');
            if (progress === 100) {
                clearInterval(obfuscationInterval);
                addLog('Obfuscation complete!', 'success');
                finishProcess();
            }
        }, 500);
    }

    function finishProcess() {
        startBtn.disabled = false;
        cancelBtn.disabled = true;
    }

    function addLog(message, type) {
        if (!logOutput) return;
        const logEntry = document.createElement('p');
        logEntry.className = `log-entry ${type}`;
        logEntry.textContent = `[${type.toUpperCase()}] ${message}`;
        logOutput.appendChild(logEntry);
        logOutput.scrollTop = logOutput.scrollHeight;
    }

    // --- START OF Code Review Feature ---
    const reviewBtn = document.getElementById('reviewBtn');
    const reviewOutput = document.getElementById('review-output');
    const reviewReportCard = document.querySelector('.code-review-report');

    if (reviewBtn) {
        reviewBtn.addEventListener('click', async () => {
            if (uploadedFiles.length === 0) {
                addLog('Please upload a file to review.', 'error');
                return;
            }

            addLog('Starting comprehensive code analysis...', 'info');
            reviewReportCard.style.display = 'block';
            reviewOutput.innerHTML = '<p class="log-entry info">[INFO] Analyzing your code...<br>✓ Checking syntax errors<br>✓ Scanning for security vulnerabilities<br>Please wait...</p>';

            const file = uploadedFiles[0];
            const code = await file.text();

            try {
                // Check server status before attempting review
                await ensureBackendUp();

                const review = await getCodeReviewFromServer(code);
                reviewOutput.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${review}</pre>`;
                addLog('Code analysis complete!', 'success');
            } catch (error) {
                const message = (error && error.message) ? error.message : 'Unknown error';
                reviewOutput.innerHTML = `<p class="log-entry error">[ERROR] Could not get review. ${message}</p>`;
                addLog(`Failed to get review from server: ${message}`, 'error');
            }
        });
    }

    async function ensureBackendUp() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        try {
            const resp = await fetch('http://localhost:5000/api/status', { signal: controller.signal });
            if (!resp.ok) {
                const txt = await safeReadText(resp);
                throw new Error(`Backend status error ${resp.status}: ${txt || resp.statusText}`);
            }
            return true;
        } catch (err) {
            if (err.name === 'AbortError') {
                throw new Error('Backend status check timed out at http://localhost:5000/api/status');
            }
            throw new Error(`Cannot reach backend at http://localhost:5000. ${err.message}`);
        } finally {
            clearTimeout(timeoutId);
        }
    }

    async function safeReadText(response) {
        try {
            return await response.text();
        } catch (_) {
            return '';
        }
    }

    async function getCodeReviewFromServer(code) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);
        try {
            const response = await fetch('http://localhost:5000/api/review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code }),
                signal: controller.signal
            });

            if (!response.ok) {
                const text = await safeReadText(response);
                throw new Error(`Server error ${response.status}: ${text || response.statusText}`);
            }

            const data = await response.json();
            return data.review;
        } catch (err) {
            if (err.name === 'AbortError') {
                throw new Error('Request timed out. Is the backend reachable at http://localhost:5000?');
            }
            throw err;
        } finally {
            clearTimeout(timeoutId);
        }
    }
    // --- END OF Code Review Feature ---

});