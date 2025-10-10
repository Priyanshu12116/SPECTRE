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
            const platform = document.getElementById('target-platform')?.value || 'windows';
            let compiler = document.getElementById('compiler')?.value || 'llvm';  // Changed to 'let'
            
            // Determine if advanced mode should be used
            const useAdvanced = level >= 8 || 
                              document.getElementById('code-virtualization')?.checked ||
                              document.getElementById('control-flow-flattening')?.checked;
            
            addLog('Starting obfuscation process...', 'info');
            addLog(`Compiler: ${compiler.toUpperCase()} | Platform: ${platform} | Level: ${level}`, 'info');
            progressBar.style.width = '10%';
            
            // Check LLVM status - Force LLVM only
            addLog('Checking LLVM toolchain...', 'info');
            try {
                const statusResponse = await fetch('http://127.0.0.1:5000/api/llvm/status');
                const status = await statusResponse.json();
                if (!status.llvm_available) {
                    addLog('❌ LLVM not available. Please install LLVM/Clang.', 'error');
                    addLog('Obfuscation cannot proceed without LLVM.', 'error');
                    finishProcess();
                    return;
                } else {
                    addLog('✅ LLVM toolchain ready', 'success');
                    compiler = 'llvm';  // Force LLVM
                }
            } catch (e) {
                addLog('❌ Cannot connect to server. Please ensure server is running.', 'error');
                addLog(`Error: ${e.message}`, 'error');
                finishProcess();
                return;
            }
            
            addLog('Creating password-protected code vault...', 'info');
            progressBar.style.width = '20%';
            
            addLog('Running baseline verification...', 'info');
            progressBar.style.width = '30%';
            
            // Force LLVM API endpoint only
            const apiEndpoint = 'http://127.0.0.1:5000/api/obfuscate/llvm';
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: code,
                    password: useAdvanced ? 'SPECTRE_ADVANCED_2025' : 'SPECTRE_2025',
                    level: levelName,
                    platform: platform,
                    test_input: '',
                    verify: true,  // ✅ Re-enabled - GCC installed!
                    create_vault: true  // ✅ Re-enabled - GCC installed!
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
                
                // Show LLVM-specific info if using LLVM
                if (result.llvm_method) {
                    addLog('🔧 Method: LLVM IR Transformation + Object File Obfuscation', 'success');
                    addLog('✅ SIH Compliant: Object-level obfuscation', 'success');
                    if (result.object_file_size) {
                        addLog(`Object file size: ${result.object_file_size} bytes`, 'info');
                    }
                    if (result.executable_size) {
                        addLog(`Executable size: ${result.executable_size} bytes`, 'info');
                    }
                }
                
                // Display statistics
                const stats = result.report.obfuscation_statistics || result.report.statistics;
                if (stats) {
                    if (stats.strings_encrypted !== undefined) {
                        addLog(`Strings encrypted: ${stats.strings_encrypted}`, 'info');
                    }
                    if (stats.bogus_code_lines !== undefined) {
                        addLog(`Bogus code lines: ${stats.bogus_code_lines}`, 'info');
                    }
                    if (stats.control_flow_changes !== undefined) {
                        addLog(`Control flow changes: ${stats.control_flow_changes}`, 'info');
                    }
                    if (stats.obfuscation_cycles !== undefined) {
                        addLog(`Obfuscation cycles: ${stats.obfuscation_cycles}`, 'info');
                    }
                    // LLVM-specific stats
                    if (stats.ir_transformations !== undefined) {
                        addLog(`IR transformations: ${stats.ir_transformations}`, 'info');
                    }
                    if (stats.llvm_passes_applied && stats.llvm_passes_applied.length > 0) {
                        addLog(`LLVM passes: ${stats.llvm_passes_applied.join(', ')}`, 'info');
                    }
                }
                
                // Show advanced stats if available
                if (stats.variables_renamed) {
                    addLog(`Variables renamed: ${stats.variables_renamed}`, 'info');
                }
                if (stats.anti_debug_checks) {
                    addLog(`Anti-debug checks: ${stats.anti_debug_checks}`, 'info');
                }
                if (stats.opaque_predicates) {
                    addLog(`Opaque predicates: ${stats.opaque_predicates}`, 'info');
                }
                
                // Show security score if available
                if (result.report.security_score) {
                    addLog(`🛡️ Security Score: ${result.report.security_score}/100`, 'success');
                }
                
                // Show verification status (only for GCC method)
                if (result.report.verification) {
                    if (result.report.verification.verified) {
                        addLog('✅ Verification: Output matches original', 'success');
                    } else {
                        addLog(`⚠️ Verification: ${result.report.verification.reason}`, 'error');
                    }
                }
                
                // Store obfuscated code and report for download
                window.obfuscatedCode = result.obfuscated_code || result.obfuscated_ir;
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
        
        // Handle both GCC and LLVM report formats
        const stats = report.obfuscation_statistics || report.statistics || {};
        const inputParams = report.input_parameters || report.input_params || {};
        const outputAttrs = report.output_attributes || {};
        
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
        .sih-badge { background: #007bff; color: white; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #0a7a2c; color: white; }
        .metric { font-size: 18px; font-weight: bold; color: #0a7a2c; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛡️ SPECTRE Obfuscation Report</h1>
        <p><strong>Generated:</strong> ${report.timestamp || new Date().toISOString()}</p>
        <p><strong>Compiler:</strong> ${report.compiler || 'LLVM/Clang'}</p>
        <p><strong>Method:</strong> ${report.obfuscation_method || 'LLVM IR Transformation'}</p>
        
        <div class="status ${report.status === 'SUCCESS' ? 'success' : 'failed'}">
            Status: ${report.status}
        </div>
        
        ${report.llvm_specific && report.llvm_specific.sih_compliant ? '<div class="sih-badge">✅ SIH Compliant - Object File Obfuscation</div>' : ''}
        
        <h2>Input Parameters</h2>
        <table>
            <tr><th>Parameter</th><th>Value</th></tr>
            <tr><td>Obfuscation Level</td><td>${inputParams.obfuscation_level || 'balanced'}</td></tr>
            <tr><td>Platform</td><td>${inputParams.platform || 'windows'}</td></tr>
            ${inputParams.password_protected ? `<tr><td>Password Protected</td><td>Yes</td></tr>` : ''}
            ${inputParams.verification_enabled ? `<tr><td>Verification Enabled</td><td>Yes</td></tr>` : ''}
        </table>
        
        <h2>Output Attributes</h2>
        <table>
            <tr><th>Attribute</th><th>Value</th></tr>
            ${outputAttrs.original_size_bytes ? `<tr><td>Original Size</td><td>${outputAttrs.original_size_bytes} bytes</td></tr>` : ''}
            ${outputAttrs.obfuscated_size_bytes ? `<tr><td>Obfuscated Size</td><td>${outputAttrs.obfuscated_size_bytes} bytes</td></tr>` : ''}
            ${outputAttrs.object_file_size ? `<tr><td>Object File Size</td><td>${outputAttrs.object_file_size} bytes</td></tr>` : ''}
            ${outputAttrs.executable_size ? `<tr><td>Executable Size</td><td>${outputAttrs.executable_size} bytes</td></tr>` : ''}
            ${outputAttrs.ir_instructions ? `<tr><td>IR Instructions</td><td>${outputAttrs.ir_instructions}</td></tr>` : ''}
            ${outputAttrs.method ? `<tr><td>Method</td><td>${outputAttrs.method}</td></tr>` : ''}
        </table>
        
        <h2>Obfuscation Statistics</h2>
        <table>
            <tr><th>Metric</th><th>Count</th></tr>
            ${stats.strings_encrypted !== undefined ? `<tr><td>Strings Encrypted</td><td class="metric">${stats.strings_encrypted}</td></tr>` : ''}
            ${stats.bogus_code_lines !== undefined ? `<tr><td>Bogus Code Lines</td><td class="metric">${stats.bogus_code_lines}</td></tr>` : ''}
            ${stats.control_flow_changes !== undefined ? `<tr><td>Control Flow Changes</td><td class="metric">${stats.control_flow_changes}</td></tr>` : ''}
            ${stats.constants_encoded !== undefined ? `<tr><td>Constants Encoded</td><td class="metric">${stats.constants_encoded}</td></tr>` : ''}
            ${stats.obfuscation_cycles !== undefined ? `<tr><td>Obfuscation Cycles</td><td class="metric">${stats.obfuscation_cycles}</td></tr>` : ''}
            ${stats.ir_transformations !== undefined ? `<tr><td>IR Transformations</td><td class="metric">${stats.ir_transformations}</td></tr>` : ''}
            ${stats.llvm_passes_applied && stats.llvm_passes_applied.length > 0 ? `<tr><td>LLVM Passes</td><td class="metric">${stats.llvm_passes_applied.join(', ')}</td></tr>` : ''}
            ${stats.compilation_time !== undefined ? `<tr><td>Compilation Time</td><td class="metric">${stats.compilation_time.toFixed(2)}s</td></tr>` : ''}
        </table>
        
        ${report.verification ? `
        <h2>Verification Result</h2>
        <p><strong>Verified:</strong> ${report.verification.verified ? '✅ Yes' : '❌ No'}</p>
        <p><strong>Reason:</strong> ${report.verification.reason || 'N/A'}</p>
        ` : ''}
        
        ${report.security_score ? `
        <h2>Security Score</h2>
        <p class="metric">🛡️ ${report.security_score}/100</p>
        ` : ''}
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

    // --- SECURITY SCAN FEATURE ---
    const securityBtn = document.getElementById('securityBtn');
    const securityReport = document.getElementById('securityReport');

    if (securityBtn) {
        securityBtn.addEventListener('click', async () => {
            if (uploadedFiles.length === 0) {
                addLog('Please upload a file for security analysis.', 'error');
                return;
            }

            addLog('🛡️ Starting security analysis...', 'info');
            securityBtn.disabled = true;
            securityBtn.textContent = '🔍 Analyzing...';

            const file = uploadedFiles[0];
            const code = await file.text();
            const language = file.name.endsWith('.cpp') || file.name.endsWith('.cc') ? 'cpp' : 'c';

            try {
                const response = await fetch('http://127.0.0.1:5000/api/security/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code, language })
                });

                const result = await response.json();

                if (result.success) {
                    displaySecurityReport(result.analysis);
                    addLog(`✅ Security analysis complete! Score: ${result.analysis.score}/100`, 'success');
                } else {
                    addLog(`❌ Security analysis failed: ${result.error}`, 'error');
                }
            } catch (error) {
                addLog(`❌ Error: ${error.message}`, 'error');
            } finally {
                securityBtn.disabled = false;
                securityBtn.textContent = '🛡️ Security Scan';
            }
        });
    }

    function displaySecurityReport(analysis) {
        // Show the report card
        securityReport.style.display = 'block';
        securityReport.scrollIntoView({ behavior: 'smooth' });

        // Display score
        const scoreValue = document.getElementById('scoreValue');
        const scoreGrade = document.getElementById('scoreGrade');
        const scoreCircle = document.querySelector('.score-circle');

        scoreValue.textContent = analysis.score;
        scoreGrade.textContent = `Grade: ${analysis.grade}`;
        
        // Set color based on grade
        scoreCircle.className = 'score-circle grade-' + analysis.grade.toLowerCase();

        // Display summary
        const summary = analysis.summary;
        const summaryHtml = `
            <div class="summary-item">
                <span class="summary-label">Total Issues:</span>
                <span class="summary-value">${summary.total_issues}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Critical:</span>
                <span class="summary-value critical">${summary.critical}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">High:</span>
                <span class="summary-value high">${summary.high}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Medium:</span>
                <span class="summary-value medium">${summary.medium}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Low:</span>
                <span class="summary-value low">${summary.low}</span>
            </div>
        `;
        document.getElementById('securitySummary').innerHTML = summaryHtml;

        // Display vulnerabilities
        const vulnerabilities = [...analysis.vulnerabilities, ...analysis.warnings];
        let vulnHtml = '<h3>Vulnerabilities & Warnings</h3>';
        
        if (vulnerabilities.length === 0) {
            vulnHtml += '<p style="color: var(--success-color); text-align: center; padding: 2rem;">✅ No vulnerabilities detected! Your code looks secure.</p>';
        } else {
            vulnerabilities.forEach(vuln => {
                vulnHtml += `
                    <div class="vulnerability-item severity-${vuln.severity.toLowerCase()}">
                        <div class="vulnerability-header">
                            <span class="vulnerability-type">${vuln.type}</span>
                            <span class="vulnerability-severity ${vuln.severity.toLowerCase()}">${vuln.severity}</span>
                        </div>
                        <div class="vulnerability-description">${vuln.description}</div>
                        ${vuln.line ? `<div class="vulnerability-line">Line ${vuln.line}</div>` : ''}
                        ${vuln.function ? `<div class="vulnerability-line">Function: ${vuln.function}</div>` : ''}
                        <div class="vulnerability-recommendation">💡 ${vuln.recommendation}</div>
                    </div>
                `;
            });
        }
        document.getElementById('vulnerabilityList').innerHTML = vulnHtml;

        // Display recommendations
        let recHtml = '<h3>📋 Recommendations</h3>';
        analysis.recommendations.forEach(rec => {
            recHtml += `<div class="recommendation-item">${rec}</div>`;
        });
        document.getElementById('recommendations').innerHTML = recHtml;
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
            
            reviewBtn.disabled = true;
            reviewBtn.textContent = 'Analyzing...';

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
                
                // Show helpful error message
                reviewOutput.innerHTML = `
                    <div style="padding: 20px; background: rgba(255, 68, 68, 0.1); border-left: 4px solid #ff4444; border-radius: 4px;">
                        <h3 style="color: #ff4444; margin-bottom: 10px;">⚠️ Server Connection Error</h3>
                        <p style="color: #e6f1ff; margin-bottom: 15px;">${message}</p>
                        <div style="background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 4px; margin-top: 15px;">
                            <h4 style="color: #00ffaa; margin-bottom: 10px;">💡 Solutions:</h4>
                            <ol style="color: #a8c0d8; line-height: 1.8;">
                                <li>Make sure the server is running: <code style="background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 3px;">python start_server.py</code></li>
                                <li>Check server status: <code style="background: rgba(0,0,0,0.5); padding: 2px 6px; border-radius: 3px;">curl http://127.0.0.1:5000/api/status</code></li>
                                <li>Restart the server if needed</li>
                                <li>Use the <strong style="color: #00ffaa;">🛡️ Security Scan</strong> button instead for code analysis</li>
                            </ol>
                        </div>
                    </div>
                `;
                addLog(`Code review unavailable. Try Security Scan instead.`, 'error');
            } finally {
                reviewBtn.disabled = false;
                reviewBtn.textContent = 'Review Code';
            }
        });
    }

    async function ensureBackendUp() {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        try {
            const resp = await fetch('http://127.0.0.1:5000/api/status', { signal: controller.signal });
            if (!resp.ok) {
                const txt = await safeReadText(resp);
                throw new Error(`Backend status error ${resp.status}: ${txt || resp.statusText}`);
            }
            return true;
        } catch (err) {
            if (err.name === 'AbortError') {
                throw new Error('Backend status check timed out at http://127.0.0.1:5000/api/status');
            }
            throw new Error(`Cannot reach backend at http://127.0.0.1:5000. ${err.message}`);
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
            const response = await fetch('http://127.0.0.1:5000/api/review', {
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
                throw new Error('Request timed out. Is the backend reachable at http://127.0.0.1:5000?');
            }
            throw err;
        } finally {
            clearTimeout(timeoutId);
        }
    }
    // --- END OF Code Review Feature ---

    // --- EXPERT MODE TOGGLE ---
    const modeBtns = document.querySelectorAll('.mode-btn');
    const simpleOptions = document.getElementById('simple-mode-options');
    const expertOptions = document.querySelectorAll('.expert-mode-options');
    const budgetSlider = document.getElementById('performance-budget');
    const budgetValue = document.getElementById('budget-value');

    // Mode switching
    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.dataset.mode;
            
            // Update active button
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show/hide options
            if (mode === 'simple') {
                simpleOptions.style.display = 'block';
                expertOptions.forEach(opt => opt.style.display = 'none');
                addLog('Switched to Simple Mode', 'info');
            } else {
                simpleOptions.style.display = 'none';
                expertOptions.forEach(opt => opt.style.display = 'block');
                addLog('Switched to Expert Mode - Advanced controls enabled', 'info');
            }
        });
    });

    // Budget slider
    if (budgetSlider && budgetValue) {
        budgetSlider.addEventListener('input', (e) => {
            budgetValue.textContent = e.target.value + '%';
        });
    }

    // Expert mode configuration getter
    function getExpertConfig() {
        return {
            mode: 'expert',
            performance_budget: parseInt(budgetSlider?.value || 20),
            techniques: {
                control_flow: {
                    flattening: document.getElementById('expert-flattening')?.checked || false,
                    bogus_flow: document.getElementById('expert-bogus-flow')?.checked || false,
                    opaque_predicates: document.getElementById('expert-opaque')?.checked || false,
                    function_splitting: document.getElementById('expert-splitting')?.checked || false
                },
                data_protection: {
                    string_encryption: document.getElementById('expert-string-enc')?.checked || false,
                    constant_encoding: document.getElementById('expert-const-enc')?.checked || false,
                    variable_renaming: document.getElementById('expert-var-rename')?.checked || false
                },
                runtime_protection: {
                    anti_debugging: document.getElementById('expert-anti-debug')?.checked || false,
                    vm_detection: document.getElementById('expert-vm-detect')?.checked || false,
                    polymorphic: document.getElementById('expert-polymorphic')?.checked || false
                }
            }
        };
    }

    // Make expert config available globally
    window.getExpertConfig = getExpertConfig;

});