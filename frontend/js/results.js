// --- RESULTS PAGE LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const historyGrid = document.getElementById('historyGrid');
    const searchInput = document.getElementById('searchInput');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const exportHistoryBtn = document.getElementById('exportHistoryBtn');

    let currentFilter = 'all';
    let searchQuery = '';

    // Load history from localStorage
    function loadHistory() {
        const allHistory = JSON.parse(localStorage.getItem('obfuscationHistory') || '[]');
        const username = localStorage.getItem('username');
        
        // Filter history for current user only
        const history = allHistory.filter(item => item.username === username);
        console.log('📊 Loaded history for', username, ':', history); // Debug
        return history;
    }

    // Save history to localStorage
    function saveHistory(history) {
        localStorage.setItem('obfuscationHistory', JSON.stringify(history));
    }

    // Update stats
    function updateStats() {
        const history = loadHistory();
        const successCount = history.filter(h => h.status === 'success').length;
        const failedCount = history.filter(h => h.status === 'failed').length;
        
        document.getElementById('totalFiles').textContent = history.length;
        document.getElementById('successCount').textContent = successCount;
        document.getElementById('failedCount').textContent = failedCount;
        
        if (history.length > 0) {
            const lastSession = new Date(history[0].timestamp);
            document.getElementById('lastSession').textContent = formatRelativeTime(lastSession);
        }
    }

    // Format relative time
    function formatRelativeTime(date) {
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return date.toLocaleDateString();
    }

    // Create history card
    function createHistoryCard(item) {
        const card = document.createElement('div');
        card.className = 'history-card';
        card.dataset.status = item.status;
        card.dataset.filename = item.filename.toLowerCase();

        const statusClass = item.status === 'success' ? 'success' : 'failed';
        const statusIcon = item.status === 'success' ? 'check-circle' : 'x-circle';
        
        // Defensive checks for config
        const config = item.config || {};
        const configType = config.type || 'Obfuscation';
        const compiler = config.compiler || 'N/A';
        const level = config.level || 'N/A';
        const platform = config.platform || 'N/A';
        const mode = config.mode || 'Simple';
        const language = config.language || 'N/A';
        const score = config.score || 'N/A';
        const grade = config.grade || 'N/A';

        card.innerHTML = `
            <div class="card-header-section">
                <div class="card-title-section">
                    <h3>
                        <i data-lucide="${configType === 'Security Scan' ? 'shield-check' : configType === 'Code Review' ? 'file-search' : 'file-code'}"></i>
                        ${item.filename}
                    </h3>
                    <div style="font-size: 0.85rem; color: var(--accent-color-blue); margin-top: 0.25rem;">
                        ${configType}
                    </div>
                    <div class="card-meta">
                        <span><i data-lucide="clock"></i> ${formatRelativeTime(new Date(item.timestamp))}</span>
                        <span><i data-lucide="cpu"></i> ${compiler !== 'N/A' ? compiler.toUpperCase() : configType}</span>
                    </div>
                </div>
                <span class="status-badge ${statusClass}">
                    <i data-lucide="${statusIcon}"></i>
                    ${item.status.toUpperCase()}
                </span>
            </div>

            <div class="card-summary">
                ${configType === 'Security Scan' ? `
                    <div class="summary-item">
                        <h4>${score}</h4>
                        <p>Score</p>
                    </div>
                    <div class="summary-item">
                        <h4>${grade}</h4>
                        <p>Grade</p>
                    </div>
                    <div class="summary-item">
                        <h4>${language}</h4>
                        <p>Language</p>
                    </div>
                ` : configType === 'Code Review' ? `
                    <div class="summary-item">
                        <h4>${language}</h4>
                        <p>Language</p>
                    </div>
                    <div class="summary-item">
                        <h4>✓</h4>
                        <p>Reviewed</p>
                    </div>
                    <div class="summary-item">
                        <h4>${formatRelativeTime(new Date(item.timestamp))}</h4>
                        <p>Time</p>
                    </div>
                ` : `
                    <div class="summary-item">
                        <h4>${level}</h4>
                        <p>Level</p>
                    </div>
                    <div class="summary-item">
                        <h4>${platform}</h4>
                        <p>Platform</p>
                    </div>
                    <div class="summary-item">
                        <h4>${item.duration || '0'}s</h4>
                        <p>Duration</p>
                    </div>
                `}
            </div>

            <div class="card-details">
                <div class="details-section">
                    <h4><i data-lucide="settings"></i> Configuration</h4>
                    <div class="config-grid">
                        <div class="config-item">
                            <span>Compiler</span>
                            <span>${compiler}</span>
                        </div>
                        <div class="config-item">
                            <span>Platform</span>
                            <span>${platform}</span>
                        </div>
                        <div class="config-item">
                            <span>Level</span>
                            <span>${level}</span>
                        </div>
                        <div class="config-item">
                            <span>Mode</span>
                            <span>${mode}</span>
                        </div>
                    </div>
                </div>

                <div class="details-section">
                    <h4><i data-lucide="terminal"></i> Process Logs</h4>
                    <div class="log-output">
                        ${(item.logs || []).map(log => `<div class="log-entry ${log.type || 'info'}">${log.message || ''}</div>`).join('')}
                    </div>
                </div>

                <div class="card-actions">
                    <button class="action-btn" onclick="rerunObfuscation('${item.id}')">
                        <i data-lucide="refresh-cw"></i>
                        Re-run
                    </button>
                    <button class="action-btn" onclick="downloadResult('${item.id}')">
                        <i data-lucide="download"></i>
                        Download
                    </button>
                    <button class="action-btn" onclick="deleteHistory('${item.id}')">
                        <i data-lucide="trash-2"></i>
                        Delete
                    </button>
                </div>
            </div>
        `;

        // Toggle expand on click
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.action-btn')) {
                card.classList.toggle('expanded');
                lucide.createIcons();
            }
        });

        return card;
    }

    // Render history
    function renderHistory() {
        const history = loadHistory();
        console.log('🔄 Rendering history, total items:', history.length); // Debug
        historyGrid.innerHTML = '';

        let filteredHistory = history;

        // Apply filter
        if (currentFilter !== 'all') {
            filteredHistory = filteredHistory.filter(h => h.status === currentFilter);
        }

        // Apply search
        if (searchQuery) {
            filteredHistory = filteredHistory.filter(h => 
                h.filename.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        console.log('📋 Filtered history count:', filteredHistory.length); // Debug
        
        if (filteredHistory.length === 0) {
            historyGrid.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="inbox"></i>
                    <h3>No Results Found</h3>
                    <p>Try adjusting your filters or search query</p>
                </div>
            `;
            lucide.createIcons();
            return;
        }

        filteredHistory.forEach((item, index) => {
            console.log(`📌 Creating card ${index + 1}:`, item); // Debug
            const card = createHistoryCard(item);
            historyGrid.appendChild(card);
            
            // Add visible class for animation (after a small delay)
            setTimeout(() => {
                card.classList.add('visible');
            }, 50 * index);
        });

        console.log('✅ All cards rendered'); // Debug
        lucide.createIcons();
    }

    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderHistory();
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderHistory();
    });

    // Clear history
    clearHistoryBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all history? This cannot be undone.')) {
            localStorage.removeItem('obfuscationHistory');
            updateStats();
            renderHistory();
        }
    });

    // Export history
    exportHistoryBtn.addEventListener('click', () => {
        const history = loadHistory();
        const dataStr = JSON.stringify(history, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `spectre-history-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    });

    // Global functions for card actions
    window.rerunObfuscation = function(id) {
        const history = loadHistory();
        const item = history.find(h => h.id === id);
        if (item) {
            // Store config in sessionStorage and redirect to app
            sessionStorage.setItem('rerunConfig', JSON.stringify(item.config));
            window.location.href = 'app.html';
        }
    };

    window.downloadResult = function(id) {
        const history = loadHistory();
        const item = history.find(h => h.id === id);
        if (item && item.outputFile) {
            alert('Download functionality would trigger here for: ' + item.outputFile);
        } else {
            alert('No output file available for this session');
        }
    };

    window.deleteHistory = function(id) {
        if (confirm('Delete this history entry?')) {
            let history = loadHistory();
            history = history.filter(h => h.id !== id);
            saveHistory(history);
            updateStats();
            renderHistory();
        }
    };

    // Initialize with error handling
    try {
        console.log('🚀 Initializing results page...'); // Debug
        updateStats();
        renderHistory();
        console.log('✅ Results page initialized successfully'); // Debug
    } catch (error) {
        console.error('❌ Error initializing results page:', error);
        historyGrid.innerHTML = `
            <div class="empty-state">
                <i data-lucide="alert-circle"></i>
                <h3>Error Loading History</h3>
                <p>${error.message}</p>
                <button onclick="location.reload()" class="cta-button">Reload Page</button>
            </div>
        `;
        lucide.createIcons();
    }
});
