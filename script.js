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
});