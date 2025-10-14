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

    // --- MATRIX RAIN BACKGROUND ANIMATION (Optional - only if canvas exists) ---
    const canvas = document.getElementById('matrix-bg');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const alphabet = '01';
        const fontSize = 12;
        const columns = canvas.width / fontSize;
        const rainDrops = Array.from({ length: columns }).map(() => Math.floor(Math.random() * canvas.height / fontSize));

        function draw() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.07)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#00B0FF';
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
    }

    // --- APPLICATION ELEMENT SELECTIONS ---
    const dropZone = document.querySelector('.drop-zone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('file-list');
    const startBtn = document.getElementById('startBtn');
    const cancelBtn = document.getElementById('cancelBtn'); // Optional - may not exist in new design
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
// --- OBFUSCATION LEVEL SELECTOR ---
const levelBtns = document.querySelectorAll('.level-btn');
let selectedLevel = 'source'; // Default

levelBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active from all
        levelBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');
        // Store selected level
        selectedLevel = btn.dataset.level;
        addLog(`Selected: ${btn.querySelector('.level-name').textContent}`, 'info');
    });
});
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
        const startTime = Date.now();
        startBtn.disabled = true;
        if (cancelBtn) cancelBtn.disabled = false;
        progressBar.style.width = '0%';
        if(logOutput) logOutput.innerHTML = '';
        
        // Declare variables outside try block for error handling
        let file, code, levelName, platform, compiler;
        
        try {
            file = uploadedFiles[0];
            code = await file.text();
            
            // Get obfuscation parameters
            levelName = selectedLevel === 'source' ? 'quick' : selectedLevel === 'intermediate' ? 'balanced' : 'maximum';
            platform = document.getElementById('target-platform')?.value || 'windows';
            compiler = document.getElementById('compiler')?.value || 'llvm';  // Changed to 'let'
            
            // Determine if advanced mode should be used
            const useAdvanced = levelName === 'maximum'|| 
                              document.getElementById('code-virtualization')?.checked ||
                              document.getElementById('control-flow-flattening')?.checked;
            
            addLog('Starting obfuscation process...', 'info');
            addLog(`Compiler: ${compiler.toUpperCase()} | Platform: ${platform} | Level: ${levelName}`, 'info');
            progressBar.style.width = '10%';
            
            // Check LLVM status - Force LLVM only
            addLog('Checking LLVM toolchain...', 'info');
            try {
                const statusResponse = await fetch('http://127.0.0.1:5000/api/llvm/status');
                const status = await statusResponse.json();
                if (!status.llvm_available) {
                    addLog('❌ LLVM not available. Please install LLVM/Clang.', 'error');
                    addLog('Obfuscation cannot proceed without LLVM.', 'error');
                    
                    // Save failed attempt to history
                    const allLogs = Array.from(document.querySelectorAll('#log-output .log-entry')).map(entry => ({
                        type: entry.classList.contains('success') ? 'success' : entry.classList.contains('error') ? 'error' : 'info',
                        message: entry.textContent
                    }));
                    
                    window.saveToHistory(
                        file.name,
                        {
                            compiler: compiler || 'llvm',
                            platform: platform || 'windows',
                            level: levelName || 'balanced',
                            mode: 'simple'
                        },
                        'failed',
                        allLogs,
                        0,
                        null
                    );
                    
                    addLog('📝 Failed attempt saved to history', 'info');
                    finishProcess();
                    return;
                } else {
                    addLog('✅ LLVM toolchain ready', 'success');
                    compiler = 'llvm';  // Force LLVM
                }
            } catch (e) {
                addLog('❌ Cannot connect to server. Please ensure server is running.', 'error');
                addLog(`Error: ${e.message}`, 'error');
                
                // Save failed attempt to history
                const allLogs = Array.from(document.querySelectorAll('#log-output .log-entry')).map(entry => ({
                    type: entry.classList.contains('success') ? 'success' : entry.classList.contains('error') ? 'error' : 'info',
                    message: entry.textContent
                }));
                
                window.saveToHistory(
                    file.name,
                    {
                        compiler: compiler || 'llvm',
                        platform: platform || 'windows',
                        level: levelName || 'balanced',
                        mode: 'simple'
                    },
                    'failed',
                    allLogs,
                    0,
                    null
                );
                
                addLog('📝 Failed attempt saved to history', 'info');
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
            
            // Debug: Log the entire response
            console.log('DEBUG: Full backend response:', result);
            console.log('DEBUG: result.vault_password =', result.vault_password);
            console.log('DEBUG: result.report.vault_password =', result.report?.vault_password);
            
            progressBar.style.width = '70%';
            addLog('Encrypting strings and constants...', 'info');
            
            progressBar.style.width = '85%';
            addLog('Verifying obfuscated code...', 'info');
            
            progressBar.style.width = '100%';
            
            if (result.success) {
                addLog('✅ Obfuscation complete!', 'success');
                addLog(`Status: ${result.report.status}`, result.report.status === 'SUCCESS' ? 'success' : 'error');
                // Save to history with detailed metrics
                const allLogs = Array.from(document.querySelectorAll('#log-output .log-entry')).map(entry => ({
                    type: entry.classList.contains('success') ? 'success' : entry.classList.contains('error') ? 'error' : 'info',
                    message: entry.textContent
                }));

                // Extract detailed obfuscation metrics from report
                const detailedMetrics = {
                    // Input parameters (SIH requirement a)
                    inputParams: {
                        compiler: compiler,
                        platform: platform,
                        level: levelName,
                        mode: 'simple',
                        originalFileSize: file.size,
                        originalFileName: file.name
                    },
                    
                    // Output attributes (SIH requirement b)
                    outputAttributes: {
                        objectFileSize: result.object_file_size || 0,
                        executableSize: result.executable_size || 0,
                        method: result.llvm_method ? 'LLVM IR → Object File → Binary' : 'GCC Direct',
                        irInstructions: result.report?.output_attributes?.ir_instructions || 0
                    },
                    
                    // Obfuscation statistics (SIH requirements c, d, e, f)
                    statistics: {
                        // c. Bogus code information
                        bogusCodeLines: stats?.bogus_code_lines || 0,
                        bogusCodePercentage: stats?.bogus_code_lines ? 
                            Math.round((stats.bogus_code_lines / (code.split('\n').length + stats.bogus_code_lines)) * 100) : 0,
                        
                        // d. Obfuscation cycles
                        obfuscationCycles: stats?.obfuscation_cycles || stats?.llvm_passes_applied?.length || 1,
                        llvmPassesApplied: stats?.llvm_passes_applied || [],
                        
                        // e. String obfuscation/encryption
                        stringsEncrypted: stats?.strings_encrypted || 0,
                        stringsObfuscated: stats?.strings_obfuscated || 0,
                        
                        // f. Fake loops inserted
                        fakeLoopsInserted: stats?.fake_loops || stats?.opaque_predicates || 0,
                        opaquePredicates: stats?.opaque_predicates || 0,
                        
                        // Additional metrics
                        controlFlowChanges: stats?.control_flow_changes || 0,
                        variablesRenamed: stats?.variables_renamed || 0,
                        antiDebugChecks: stats?.anti_debug_checks || 0,
                        irTransformations: stats?.ir_transformations || 0
                    },
                    
                    // Security and verification
                    securityScore: result.report?.security_score || 0,
                    verified: result.report?.verification?.verified || false,
                    compilationTime: stats?.compilation_time || Math.floor((Date.now() - startTime) / 1000)
                };

                window.saveToHistory(
                    file.name,
                    {
                        compiler: compiler,
                        platform: platform,
                        level: levelName,
                        mode: 'simple'
                    },
                    'success',
                    allLogs,
                    Math.floor((Date.now() - startTime) / 1000),
                    result.output_file || result.obfuscated_code || null,
                    detailedMetrics
                );
                
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
                // Store original filename to preserve extension
                window.originalFilename = uploadedFiles[0].name;
                
                // Add vault password to report if available (check both locations)
                const vaultPassword = result.vault_password || result.report.vault_password;
                if (vaultPassword) {
                    window.obfuscationReport.vault_password = vaultPassword;
                    window.obfuscationReport.password_auto_generated = result.password_auto_generated || result.report.password_auto_generated || true;
                    addLog(`🔑 Vault Password Generated: ${vaultPassword}`, 'success');
                } else {
                    console.log('DEBUG: No vault password found in result:', result);
                }
                
                // Show download options
                showObfuscationResults(result);
            } else {
                addLog('❌ Obfuscation failed', 'error');
            }
            
        } catch (error) {
            addLog(`Error: ${error.message}`, 'error');
            progressBar.style.width = '0%';
            
            // Save failed attempt to history (with fallback values)
            console.log('🔴 Obfuscation failed, attempting to save to history...'); // Debug
            console.log('File:', file, 'Compiler:', compiler, 'Platform:', platform, 'Level:', levelName); // Debug
            
            if (file) {
                const allLogs = Array.from(document.querySelectorAll('#log-output .log-entry')).map(entry => ({
                    type: entry.classList.contains('success') ? 'success' : entry.classList.contains('error') ? 'error' : 'info',
                    message: entry.textContent
                }));
        
                window.saveToHistory(
                    file.name,
                    {
                        compiler: compiler || 'llvm',
                        platform: platform || 'windows',
                        level: levelName || 'balanced',
                        mode: 'simple'
                    },
                    'failed',
                    allLogs,
                    0,
                    null
                );
                console.log('✅ Failed case saved to history'); // Debug
            } else {
                console.log('❌ Cannot save failed case - file is undefined'); // Debug
            }
        } finally {
            finishProcess();
        }
    }
    
    function showObfuscationResults(result) {
        // Create download buttons for obfuscated code and report
        const reportActions = document.querySelector('.report-actions');
        if (reportActions) {
            reportActions.innerHTML = `
                <button onclick="downloadObfuscatedCode()">Download Obfuscated Code</button>
                <button onclick="downloadReport()">Download Report (JSON)</button>
                <button onclick="downloadReportPDF()">Download Report (PDF)</button>
            `;
        }
    }
    
    // Global download functions
    window.downloadObfuscatedCode = function() {
        if (!window.obfuscatedCode) {
            alert('No obfuscated code available');
            return;
        }
        
        // Preserve original file extension (.c, .cpp, .cc, etc.)
        let filename = 'obfuscated_code.c';
        if (window.originalFilename) {
            const ext = window.originalFilename.substring(window.originalFilename.lastIndexOf('.'));
            const baseName = window.originalFilename.substring(0, window.originalFilename.lastIndexOf('.'));
            filename = `${baseName}_obfuscated${ext}`;
        }
        
        const blob = new Blob([window.obfuscatedCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
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
    
    // PDF report function is now in pdf-report.js

    function finishProcess() {
        startBtn.disabled = false;
        if (cancelBtn) cancelBtn.disabled = true;
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
                    
                    // Save security scan to history
                    const allLogs = Array.from(document.querySelectorAll('#log-output .log-entry')).map(entry => ({
                        type: entry.classList.contains('success') ? 'success' : entry.classList.contains('error') ? 'error' : 'info',
                        message: entry.textContent
                    }));

                    window.saveToHistory(
                        file.name,
                        {
                            type: 'Security Scan',
                            language: language,
                            score: result.analysis.score,
                            grade: result.analysis.grade
                        },
                        'success',
                        allLogs,
                        0,
                        null
                    );
                } else {
                    addLog(`❌ Security analysis failed: ${result.error}`, 'error');
                    
                    // Save failed security scan to history
                    const allLogs = Array.from(document.querySelectorAll('#log-output .log-entry')).map(entry => ({
                        type: entry.classList.contains('success') ? 'success' : entry.classList.contains('error') ? 'error' : 'info',
                        message: entry.textContent
                    }));

                    window.saveToHistory(
                        file.name,
                        {
                            type: 'Security Scan',
                            language: language,
                            score: 0,
                            grade: 'F'
                        },
                        'failed',
                        allLogs,
                        0,
                        null
                    );
                }
            } catch (error) {
                addLog(`❌ Error: ${error.message}`, 'error');
                
                // Save failed security scan to history (error case)
                console.log('🔴 Security scan failed, attempting to save...'); // Debug
                console.log('File:', file, 'Language:', language); // Debug
                
                if (file && language) {
                    const allLogs = Array.from(document.querySelectorAll('#log-output .log-entry')).map(entry => ({
                        type: entry.classList.contains('success') ? 'success' : entry.classList.contains('error') ? 'error' : 'info',
                        message: entry.textContent
                    }));

                    window.saveToHistory(
                        file.name,
                        {
                            type: 'Security Scan',
                            language: language,
                            score: 0,
                            grade: 'F'
                        },
                        'failed',
                        allLogs,
                        0,
                        null
                    );
                    console.log('✅ Failed security scan saved'); // Debug
                } else {
                    console.log('❌ Cannot save - file or language undefined'); // Debug
                }
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
            const language = file.name.endsWith('.cpp') || file.name.endsWith('.cc') ? 'cpp' : 'c';

            try {
                // Check server status before attempting review
                await ensureBackendUp();

                const review = await getCodeReviewFromServer(code);
                reviewOutput.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word;">${review}</pre>`;
                addLog('Code analysis complete!', 'success');
                // Save code review to history
                const allLogs = Array.from(document.querySelectorAll('#log-output .log-entry')).map(entry => ({
                    type: entry.classList.contains('success') ? 'success' : entry.classList.contains('error') ? 'error' : 'info',
                    message: entry.textContent
                }));

                window.saveToHistory(
                    file.name,
                    {
                        type: 'Code Review',
                        language: language
                    },
                    'success',
                    allLogs,
                    0,
                    null
                );
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
                
                // Save failed code review to history
                console.log('🔴 Code review failed, attempting to save...'); // Debug
                console.log('File:', file, 'Language:', language); // Debug
                
                if (file && language) {
                    const allLogs = Array.from(document.querySelectorAll('#log-output .log-entry')).map(entry => ({
                        type: entry.classList.contains('success') ? 'success' : entry.classList.contains('error') ? 'error' : 'info',
                        message: entry.textContent
                    }));

                    window.saveToHistory(
                        file.name,
                        {
                            type: 'Code Review',
                            language: language
                        },
                        'failed',
                        allLogs,
                        0,
                        null
                    );
                    console.log('✅ Failed code review saved'); // Debug
                } else {
                    console.log('❌ Cannot save - file or language undefined'); // Debug
                }
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

    // --- HISTORY MANAGEMENT ---
    window.saveToHistory = function(filename, config, status, logs, duration, outputFile = null, detailedMetrics = null) {
        const history = JSON.parse(localStorage.getItem('obfuscationHistory') || '[]');
        const username = localStorage.getItem('username') || 'Guest';
        const level = config?.obfuscationLevel || config?.level || 'source'; // Get level from config
    
        const historyItem = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            username: username, // Add username to track per-user history
            filename: filename,
            level: level, // Add level for filtering
            timestamp: new Date().toISOString(),
            status: status, // 'success' or 'failed'
            config: config,
            logs: logs,
            duration: duration,
            outputFile: outputFile,
            detailedMetrics: detailedMetrics // Store detailed obfuscation metrics
        };
        
        console.log('💾 Saving to history:', historyItem); // Debug
        
        // Add to beginning of array (most recent first)
        history.unshift(historyItem);
        
        // Keep only last 50 entries
        if (history.length > 50) {
            history.pop();
        }
        
        localStorage.setItem('obfuscationHistory', JSON.stringify(history));
        console.log('✅ History saved! Total items:', history.length); // Debug
    };
});
