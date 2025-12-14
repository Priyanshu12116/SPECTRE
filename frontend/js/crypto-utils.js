/**
 * SPECTRE Crypto Utilities
 * Provides secure password hashing using Web Crypto API (SHA-256 with salt)
 * This is client-side hashing - for production, always validate on server-side as well
 */

const SpectreCrypto = {
    /**
     * Generate a random salt using Web Crypto API
     * @returns {string} Base64 encoded salt
     */
    generateSalt: function () {
        const saltArray = new Uint8Array(16);
        crypto.getRandomValues(saltArray);
        return this.arrayBufferToBase64(saltArray);
    },

    /**
     * Convert ArrayBuffer to Base64 string
     * @param {ArrayBuffer|Uint8Array} buffer 
     * @returns {string}
     */
    arrayBufferToBase64: function (buffer) {
        const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    },

    /**
     * Hash password with salt using SHA-256
     * @param {string} password - Plain text password
     * @param {string} salt - Base64 encoded salt
     * @returns {Promise<string>} Base64 encoded hash
     */
    hashPassword: async function (password, salt) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + salt);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return this.arrayBufferToBase64(hashBuffer);
    },

    /**
     * Create a complete password hash with embedded salt
     * Format: salt$hash (both base64 encoded)
     * @param {string} password - Plain text password
     * @returns {Promise<string>} Combined salt$hash string
     */
    createPasswordHash: async function (password) {
        const salt = this.generateSalt();
        const hash = await this.hashPassword(password, salt);
        return `${salt}$${hash}`;
    },

    /**
     * Verify password against stored hash
     * @param {string} password - Plain text password to verify
     * @param {string} storedHash - Stored salt$hash string
     * @returns {Promise<boolean>} True if password matches
     */
    verifyPassword: async function (password, storedHash) {
        if (!storedHash || !storedHash.includes('$')) {
            // Legacy plain-text password - compare directly but warn
            console.warn('[SECURITY] Legacy plain-text password detected. Please reset password.');
            return password === storedHash;
        }

        const [salt, hash] = storedHash.split('$');
        const computedHash = await this.hashPassword(password, salt);
        return computedHash === hash;
    },

    /**
     * Check if a stored password is using the new hashed format
     * @param {string} storedHash 
     * @returns {boolean}
     */
    isHashedPassword: function (storedHash) {
        return storedHash && storedHash.includes('$') && storedHash.split('$').length === 2;
    },

    /**
     * Sanitize string for safe HTML insertion (prevent XSS)
     * @param {string} str - Untrusted string
     * @returns {string} Sanitized string
     */
    sanitizeHTML: function (str) {
        if (typeof str !== 'string') return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    },

    /**
     * Validate email format
     * @param {string} email 
     * @returns {boolean}
     */
    isValidEmail: function (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate password strength
     * @param {string} password 
     * @returns {{valid: boolean, message: string}}
     */
    validatePasswordStrength: function (password) {
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters long' };
        }
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one lowercase letter' };
        }
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one uppercase letter' };
        }
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one number' };
        }
        return { valid: true, message: 'Password is strong' };
    }
};

// Export for use in other scripts
window.SpectreCrypto = SpectreCrypto;
