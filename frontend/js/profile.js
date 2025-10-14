document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // Load user profile data
    loadUserProfile();
    loadStatistics();
    loadObfuscationHistory();
    setupEventListeners();
});

function loadUserProfile() {
    const username = localStorage.getItem('username') || 'User';
    const email = localStorage.getItem('email') || 'Not provided';
    const authMethod = localStorage.getItem('authMethod') || 'traditional';
    const profilePicture = localStorage.getItem('profilePicture');
    
    // Get full name from registered users or use username
    let fullName = username;
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const currentUser = registeredUsers.find(u => u.username === username || u.email === email);
    if (currentUser && currentUser.fullname) {
        fullName = currentUser.fullname;
    }

    // Update profile information
    document.getElementById('userName').textContent = fullName;
    document.getElementById('userEmail').textContent = email;
    document.getElementById('userUsername').textContent = username;
    
    // Format auth method
    const authMethodText = authMethod === 'google' ? 'Google OAuth' : 'Email & Password';
    document.getElementById('authMethod').textContent = authMethodText;

    // Member since
    const memberSince = currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }) : 'Unknown';
    document.getElementById('memberSince').textContent = memberSince;

    // Update avatar
    const avatarElement = document.getElementById('userAvatar');
    if (profilePicture) {
        // Show profile picture (Google or custom uploaded)
        avatarElement.innerHTML = `<img src="${profilePicture}" alt="Profile Picture">`;
    } else {
        // Show first letter of name
        const initial = fullName.charAt(0).toUpperCase();
        avatarElement.innerHTML = `<span style="font-size: 48px;">${initial}</span>`;
    }
}

function handlePhotoUpload(file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        alert('Image size must be less than 5MB');
        return;
    }
    
    // Read the file and convert to base64
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const base64Image = e.target.result;
        
        // Store in localStorage
        localStorage.setItem('profilePicture', base64Image);
        
        // Update in registered users if exists
        const username = localStorage.getItem('username');
        const email = localStorage.getItem('email');
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const userIndex = registeredUsers.findIndex(u => u.username === username || u.email === email);
        
        if (userIndex !== -1) {
            registeredUsers[userIndex].profilePicture = base64Image;
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        }
        
        // Update the avatar display
        const avatarElement = document.getElementById('userAvatar');
        avatarElement.innerHTML = `<img src="${base64Image}" alt="Profile Picture">`;
        
        // Show success message
        showNotification('Profile photo updated successfully!', 'success');
    };
    
    reader.onerror = function() {
        alert('Error reading file. Please try again.');
    };
    
    // Read the file as base64
    reader.readAsDataURL(file);
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#34d399' : '#f472b6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function loadStatistics() {
    const obfuscationHistory = JSON.parse(localStorage.getItem('obfuscationHistory') || '[]');
    const username = localStorage.getItem('username');
    
    // Filter history for current user
    const userHistory = obfuscationHistory.filter(item => item.username === username);
    
    // Calculate statistics
    const totalFiles = userHistory.length;
    const totalObfuscations = userHistory.reduce((sum, item) => sum + (item.count || 1), 0);
    
    // Last activity
    let lastActivity = 'Never';
    if (userHistory.length > 0) {
        const lastItem = userHistory[userHistory.length - 1];
        const lastDate = new Date(lastItem.timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - lastDate);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            lastActivity = 'Today';
        } else if (diffDays === 1) {
            lastActivity = 'Yesterday';
        } else if (diffDays < 7) {
            lastActivity = `${diffDays} days ago`;
        } else {
            lastActivity = lastDate.toLocaleDateString();
        }
    }
    
    // Favorite level
    const levelCounts = {};
    userHistory.forEach(item => {
        levelCounts[item.level] = (levelCounts[item.level] || 0) + 1;
    });
    
    let favoriteLevel = 'N/A';
    let maxCount = 0;
    for (const [level, count] of Object.entries(levelCounts)) {
        if (count > maxCount) {
            maxCount = count;
            favoriteLevel = level.charAt(0).toUpperCase() + level.slice(1);
        }
    }
    
    // Update UI
    document.getElementById('totalFiles').textContent = totalFiles;
    document.getElementById('totalObfuscations').textContent = totalObfuscations;
    document.getElementById('lastActivity').textContent = lastActivity;
    document.getElementById('favoriteLevel').textContent = favoriteLevel;
}

function loadObfuscationHistory(searchTerm = '', filterLevel = 'all') {
    const obfuscationHistory = JSON.parse(localStorage.getItem('obfuscationHistory') || '[]');
    const username = localStorage.getItem('username');
    
    // Filter history for current user
    let userHistory = obfuscationHistory.filter(item => item.username === username);
    
    // Apply search filter
    if (searchTerm) {
        userHistory = userHistory.filter(item => 
            item.filename.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    // Apply level filter
    if (filterLevel !== 'all') {
        userHistory = userHistory.filter(item => item.level === filterLevel);
    }
    
    // Sort by timestamp (newest first)
    userHistory.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    const historyList = document.getElementById('historyList');
    
    if (userHistory.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <i data-lucide="inbox"></i>
                <p>${searchTerm || filterLevel !== 'all' ? 'No results found' : 'No obfuscation history yet'}</p>
                <a href="app.html" class="cta-button">Start Obfuscating</a>
            </div>
        `;
        lucide.createIcons();
        return;
    }
    
    // Render history items
    historyList.innerHTML = userHistory.map(item => {
        const date = new Date(item.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const time = new Date(item.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const levelBadge = getLevelBadge(item.level);
        const fileIcon = getFileIcon(item.filename);
        
        return `
            <div class="history-item">
                <div class="history-icon">
                    <i data-lucide="${fileIcon}"></i>
                </div>
                <div class="history-info">
                    <div class="history-filename">${item.filename}</div>
                    <div class="history-meta">
                        <span>
                            <i data-lucide="calendar"></i>
                            ${date}
                        </span>
                        <span>
                            <i data-lucide="clock"></i>
                            ${time}
                        </span>
                        <span class="level-badge level-${item.level}">
                            ${levelBadge}
                        </span>
                    </div>
                </div>
                <div class="history-actions">
                    <button class="history-action-btn" onclick="downloadFile('${item.id}')">
                        <i data-lucide="download"></i>
                        Download
                    </button>
                    <button class="history-action-btn" onclick="deleteHistoryItem('${item.id}')">
                        <i data-lucide="trash-2"></i>
                        Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    lucide.createIcons();
}

function getLevelBadge(level) {
    const badges = {
        'source': 'Source Code',
        'intermediate': 'Intermediate',
        'binary': 'Binary Level'
    };
    return badges[level] || level;
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'c': 'file-code',
        'cpp': 'file-code',
        'cc': 'file-code',
        'cxx': 'file-code',
        'h': 'file-text',
        'hpp': 'file-text'
    };
    return icons[ext] || 'file';
}

function setupEventListeners() {
    // Change Avatar/Photo functionality
    const changeAvatarBtn = document.getElementById('changeAvatarBtn');
    if (changeAvatarBtn) {
        changeAvatarBtn.addEventListener('click', () => {
            // Create a hidden file input
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.style.display = 'none';
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    handlePhotoUpload(file);
                }
            });
            
            // Trigger file selection
            fileInput.click();
        });
    }
    
    // Search and filter
    const searchInput = document.getElementById('searchHistory');
    const filterSelect = document.getElementById('filterLevel');
    
    searchInput.addEventListener('input', (e) => {
        loadObfuscationHistory(e.target.value, filterSelect.value);
    });
    
    filterSelect.addEventListener('change', (e) => {
        loadObfuscationHistory(searchInput.value, e.target.value);
    });
    
    // Edit Profile Modal
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const editProfileForm = document.getElementById('editProfileForm');
    
    editProfileBtn.addEventListener('click', () => {
        openEditProfileModal();
    });
    
    closeEditModal.addEventListener('click', () => {
        editProfileModal.classList.remove('active');
    });
    
    cancelEdit.addEventListener('click', () => {
        editProfileModal.classList.remove('active');
    });
    
    editProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveProfileChanges();
    });
    
    // Change Password Modal
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    const changePasswordModal = document.getElementById('changePasswordModal');
    const closePasswordModal = document.getElementById('closePasswordModal');
    const cancelPassword = document.getElementById('cancelPassword');
    const changePasswordForm = document.getElementById('changePasswordForm');
    
    changePasswordBtn.addEventListener('click', () => {
        const authMethod = localStorage.getItem('authMethod');
        if (authMethod === 'google') {
            alert('You are signed in with Google. Password change is not available.');
            return;
        }
        changePasswordModal.classList.add('active');
    });
    
    closePasswordModal.addEventListener('click', () => {
        changePasswordModal.classList.remove('active');
    });
    
    cancelPassword.addEventListener('click', () => {
        changePasswordModal.classList.remove('active');
    });
    
    changePasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        changePassword();
    });
    
    // Close modals on outside click
    window.addEventListener('click', (e) => {
        if (e.target === editProfileModal) {
            editProfileModal.classList.remove('active');
        }
        if (e.target === changePasswordModal) {
            changePasswordModal.classList.remove('active');
        }
    });
}

function openEditProfileModal() {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const currentUser = registeredUsers.find(u => u.username === username || u.email === email);
    
    document.getElementById('editFullName').value = currentUser?.fullname || username;
    document.getElementById('editEmail').value = email;
    document.getElementById('editUsername').value = username;
    
    document.getElementById('editProfileModal').classList.add('active');
}

function saveProfileChanges() {
    const newFullName = document.getElementById('editFullName').value.trim();
    const newEmail = document.getElementById('editEmail').value.trim();
    const newUsername = document.getElementById('editUsername').value.trim();
    
    const currentUsername = localStorage.getItem('username');
    const currentEmail = localStorage.getItem('email');
    
    // Update in registered users
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex(u => u.username === currentUsername || u.email === currentEmail);
    
    if (userIndex !== -1) {
        registeredUsers[userIndex].fullname = newFullName;
        registeredUsers[userIndex].email = newEmail;
        registeredUsers[userIndex].username = newUsername;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    }
    
    // Update current session
    localStorage.setItem('username', newUsername);
    localStorage.setItem('email', newEmail);
    
    // Close modal and reload profile
    document.getElementById('editProfileModal').classList.remove('active');
    loadUserProfile();
    
    // Reload the page to update navbar
    showNotification('Profile updated successfully! Refreshing...', 'success');
    setTimeout(() => {
        window.location.reload();
    }, 1500);
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match!');
        return;
    }
    
    if (newPassword.length < 8) {
        alert('Password must be at least 8 characters long!');
        return;
    }
    
    const username = localStorage.getItem('username');
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex(u => u.username === username);
    
    if (userIndex === -1) {
        alert('User not found!');
        return;
    }
    
    // Verify current password
    if (registeredUsers[userIndex].password !== currentPassword) {
        alert('Current password is incorrect!');
        return;
    }
    
    // Update password
    registeredUsers[userIndex].password = newPassword;
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    // Close modal and reset form
    document.getElementById('changePasswordModal').classList.remove('active');
    document.getElementById('changePasswordForm').reset();
    
    alert('Password changed successfully!');
}

function downloadFile(id) {
    alert('Download functionality will be implemented when files are stored on the server.');
}

function deleteHistoryItem(id) {
    if (!confirm('Are you sure you want to delete this item from your history?')) {
        return;
    }
    
    const obfuscationHistory = JSON.parse(localStorage.getItem('obfuscationHistory') || '[]');
    const updatedHistory = obfuscationHistory.filter(item => item.id !== id);
    localStorage.setItem('obfuscationHistory', JSON.stringify(updatedHistory));
    
    // Reload history and statistics
    loadStatistics();
    loadObfuscationHistory(
        document.getElementById('searchHistory').value,
        document.getElementById('filterLevel').value
    );
}

// Add sample data for testing (remove in production)
function addSampleHistory() {
    const username = localStorage.getItem('username');
    const sampleHistory = [
        {
            id: 'sample1',
            username: username,
            filename: 'main.c',
            level: 'source',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'sample2',
            username: username,
            filename: 'utils.cpp',
            level: 'intermediate',
            timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: 'sample3',
            username: username,
            filename: 'algorithm.c',
            level: 'binary',
            timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    localStorage.setItem('obfuscationHistory', JSON.stringify(sampleHistory));
}

// Add sample data for testing (comment out in production)
// Automatically add sample data if no history exists and user just logged in
const hasAddedSampleData = sessionStorage.getItem('sampleDataAdded');
if (!localStorage.getItem('obfuscationHistory') && !hasAddedSampleData) {
    addSampleHistory();
    sessionStorage.setItem('sampleDataAdded', 'true');
}
