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

    // --- REAL OBFUSCATION PROCESS CONTROL ---
    if (startBtn) {
        startBtn.addEventListener('click', async () => {
            if (uploadedFiles.length === 0) {
                addLog('Please upload files before starting.', 'error');
                return;
            }
            await startObfuscation();
        });
    }
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            clearInterval(obfuscationInterval);
            addLog('Obfuscation cancelled by user.', 'error');
            finishProcess();
        });
    }

    async function startObfuscation() {
        startBtn.disabled = true;
        cancelBtn.disabled = false;
        progressBar.style.width = '0%';
        if(logOutput) logOutput.innerHTML = '';
        
        try {
            const file = uploadedFiles[0];
            const code = await file.text();
            
            // Get obfuscation parameters
            const level = document.getElementById('obfuscation-level')?.value || 5;
            const levelName = level <= 3 ? 'quick' : level <= 7 ? 'balanced' : 'maximum';
            
            addLog('Starting obfuscation process...', 'info');
            progressBar.style.width = '10%';
            
            addLog('Creating password-protected code vault...', 'info');
            progressBar.style.width = '20%';
            
            addLog('Running baseline verification...', 'info');
            progressBar.style.width = '30%';
            
            // Call backend obfuscation API
            const response = await fetch('http://localhost:5000/api/obfuscate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    password: 'SPECTRE_2025',
                    level: levelName,
                    test_input: '',
                    verify: true,
                    create_vault: true
                })
            });
            
            progressBar.style.width = '50%';
            addLog('Applying obfuscation transformations...', 'info');
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }
            
            const result = await response.json();
            
            progressBar.style.width = '70%';
            addLog('Encrypting strings and constants...', 'info');
            
            progressBar.style.width = '85%';
            addLog('Verifying obfuscated code...', 'info');
            
            progressBar.style.width = '100%';
            
            if (result.success) {
                addLog('✅ Obfuscation complete!', 'success');
                addLog(`Status: ${result.report.status}`, result.report.status === 'SUCCESS' ? 'success' : 'error');
                addLog(`Strings encrypted: ${result.report.obfuscation_statistics.strings_encrypted}`, 'info');
                addLog(`Bogus code lines: ${result.report.obfuscation_statistics.bogus_code_lines}`, 'info');
                addLog(`Control flow changes: ${result.report.obfuscation_statistics.control_flow_changes}`, 'info');
                addLog(`Obfuscation cycles: ${result.report.obfuscation_statistics.obfuscation_cycles}`, 'info');
                
                if (result.report.verification.verified) {
                    addLog('✅ Verification: Output matches original', 'success');
                } else {
                    addLog(`⚠️ Verification: ${result.report.verification.reason}`, 'error');
                }
                
                // Store obfuscated code and report for download
                window.obfuscatedCode = result.obfuscated_code;
                window.obfuscationReport = result.report;
                
                // Show download options
                showObfuscationResults(result);
            } else {
                addLog('❌ Obfuscation failed', 'error');
            }
            
        } catch (error) {
            addLog(`Error: ${error.message}`, 'error');
            progressBar.style.width = '0%';
        } finally {
            finishProcess();
        }
    }
    
    function showObfuscationResults(result) {
        // Create download buttons for obfuscated code and report
        const reportActions = document.querySelector('.report-actions');
        if (reportActions) {
            reportActions.innerHTML = `
                <button onclick="downloadObfuscatedCode()">Download Obfuscated Code (.c)</button>
                <button onclick="downloadReport()">Download Report (JSON)</button>
                <button onclick="downloadReportHTML()">Download Report (HTML)</button>
            `;
        }
    }
    
    // Global download functions
    window.downloadObfuscatedCode = function() {
        if (!window.obfuscatedCode) {
            alert('No obfuscated code available');
            return;
        }
        const blob = new Blob([window.obfuscatedCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'obfuscated_code.c';
        a.click();
        URL.revokeObjectURL(url);
    };
    
    window.downloadReport = function() {
        if (!window.obfuscationReport) {
            alert('No report available');
            return;
        }
        const blob = new Blob([JSON.stringify(window.obfuscationReport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'obfuscation_report.json';
        a.click();
        URL.revokeObjectURL(url);
    };
    
    window.downloadReportHTML = function() {
        if (!window.obfuscationReport) {
            alert('No report available');
            return;
        }
        const report = window.obfuscationReport;
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>SPECTRE Obfuscation Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #0a7a2c; border-bottom: 3px solid #0a7a2c; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; }
        .status { font-size: 24px; font-weight: bold; padding: 15px; border-radius: 5px; text-align: center; }
        .success { background: #d4edda; color: #155724; }
        .failed { background: #f8d7da; color: #721c24; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #0a7a2c; color: white; }
        .metric { font-size: 18px; font-weight: bold; color: #0a7a2c; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛡️ SPECTRE Obfuscation Report</h1>
        <p><strong>Generated:</strong> ${report.timestamp}</p>
        
        <div class="status ${report.status === 'SUCCESS' ? 'success' : 'failed'}">
            Status: ${report.status}
        </div>
        
        <h2>Input Parameters</h2>
        <table>
            <tr><th>Parameter</th><th>Value</th></tr>
            <tr><td>Obfuscation Level</td><td>${report.input_parameters.obfuscation_level}</td></tr>
            <tr><td>Password Protected</td><td>${report.input_parameters.password_protected ? 'Yes' : 'No'}</td></tr>
            <tr><td>Verification Enabled</td><td>${report.input_parameters.verification_enabled ? 'Yes' : 'No'}</td></tr>
        </table>
        
        <h2>Output Attributes</h2>
        <table>
            <tr><th>Attribute</th><th>Value</th></tr>
            <tr><td>Original Size</td><td>${report.output_attributes.original_size_bytes} bytes</td></tr>
            <tr><td>Obfuscated Size</td><td>${report.output_attributes.obfuscated_size_bytes} bytes</td></tr>
            <tr><td>Size Increase</td><td>${report.output_attributes.size_increase_percent}%</td></tr>
        </table>
        
        <h2>Obfuscation Statistics</h2>
        <table>
            <tr><th>Metric</th><th>Count</th></tr>
            <tr><td>Strings Encrypted</td><td class="metric">${report.obfuscation_statistics.strings_encrypted}</td></tr>
            <tr><td>Bogus Code Lines</td><td class="metric">${report.obfuscation_statistics.bogus_code_lines}</td></tr>
            <tr><td>Control Flow Changes</td><td class="metric">${report.obfuscation_statistics.control_flow_changes}</td></tr>
            <tr><td>Constants Encoded</td><td class="metric">${report.obfuscation_statistics.constants_encoded}</td></tr>
            <tr><td>Obfuscation Cycles</td><td class="metric">${report.obfuscation_statistics.obfuscation_cycles}</td></tr>
        </table>
        
        <h2>Verification Result</h2>
        <p><strong>Verified:</strong> ${report.verification.verified ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Reason:</strong> ${report.verification.reason}</p>
    </div>
</body>
</html>
        `;
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'obfuscation_report.html';
        a.click();
        URL.revokeObjectURL(url);
    };

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