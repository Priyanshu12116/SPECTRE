"""
SPECTRE Backend Security Utilities
Provides rate limiting, input validation, and error handling
"""

import time
import re
import traceback
from functools import wraps
from collections import defaultdict
from flask import request, jsonify
import os

# ============== CONFIGURATION ==============

# Rate limiting configuration
RATE_LIMIT_ENABLED = os.environ.get('RATE_LIMIT_ENABLED', 'true').lower() == 'true'
RATE_LIMITS = {
    'obfuscate': {'requests': 10, 'window': 60},  # 10 requests per minute
    'compile': {'requests': 5, 'window': 60},      # 5 requests per minute
    'analyze': {'requests': 20, 'window': 60},     # 20 requests per minute
    'default': {'requests': 60, 'window': 60}      # 60 requests per minute for other endpoints
}

# Production mode - set to True to mask error details
PRODUCTION_MODE = os.environ.get('PRODUCTION_MODE', 'false').lower() == 'true'

# Input validation limits
MAX_CODE_LENGTH = 500000  # 500KB max code size
MAX_FILENAME_LENGTH = 255
ALLOWED_EXTENSIONS = {'.c', '.cpp', '.cc', '.cxx', '.h', '.hpp', '.ll'}


# ============== RATE LIMITING ==============

class RateLimiter:
    """Simple in-memory rate limiter"""
    
    def __init__(self):
        self.requests = defaultdict(list)
    
    def is_allowed(self, key: str, limit_type: str = 'default') -> tuple[bool, dict]:
        """
        Check if a request is allowed based on rate limits
        Returns (is_allowed, info_dict)
        """
        if not RATE_LIMIT_ENABLED:
            return True, {}
        
        limits = RATE_LIMITS.get(limit_type, RATE_LIMITS['default'])
        max_requests = limits['requests']
        window = limits['window']
        
        now = time.time()
        
        # Clean old entries
        self.requests[key] = [t for t in self.requests[key] if now - t < window]
        
        # Check limit
        if len(self.requests[key]) >= max_requests:
            retry_after = int(window - (now - self.requests[key][0]))
            return False, {
                'error': 'Rate limit exceeded',
                'retry_after': retry_after,
                'limit': max_requests,
                'window': window
            }
        
        # Add this request
        self.requests[key].append(now)
        return True, {
            'remaining': max_requests - len(self.requests[key]),
            'limit': max_requests,
            'window': window
        }


# Global rate limiter instance
rate_limiter = RateLimiter()


def rate_limit(limit_type: str = 'default'):
    """
    Decorator to apply rate limiting to Flask routes
    Uses client IP as the key
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get client IP
            client_ip = request.headers.get('X-Forwarded-For', request.remote_addr)
            if client_ip:
                client_ip = client_ip.split(',')[0].strip()
            
            key = f"{client_ip}:{limit_type}"
            allowed, info = rate_limiter.is_allowed(key, limit_type)
            
            if not allowed:
                response = jsonify({
                    'error': 'Rate limit exceeded',
                    'message': f"Too many requests. Please try again in {info['retry_after']} seconds.",
                    'retry_after': info['retry_after']
                })
                response.status_code = 429
                response.headers['Retry-After'] = str(info['retry_after'])
                return response
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator


# ============== INPUT VALIDATION ==============

class ValidationError(Exception):
    """Custom exception for validation errors"""
    def __init__(self, message: str, field: str = None):
        self.message = message
        self.field = field
        super().__init__(message)


def validate_code_input(code: str, field_name: str = 'code') -> str:
    """
    Validate source code input
    Returns sanitized code or raises ValidationError
    """
    if not code:
        raise ValidationError(f'{field_name} is required', field_name)
    
    if not isinstance(code, str):
        raise ValidationError(f'{field_name} must be a string', field_name)
    
    if len(code) > MAX_CODE_LENGTH:
        raise ValidationError(
            f'{field_name} exceeds maximum length ({MAX_CODE_LENGTH} bytes)',
            field_name
        )
    
    if len(code.strip()) == 0:
        raise ValidationError(f'{field_name} cannot be empty', field_name)
    
    return code


def validate_filename(filename: str) -> str:
    """
    Validate and sanitize filename
    Returns sanitized filename or raises ValidationError
    """
    if not filename:
        raise ValidationError('Filename is required', 'filename')
    
    if not isinstance(filename, str):
        raise ValidationError('Filename must be a string', 'filename')
    
    if len(filename) > MAX_FILENAME_LENGTH:
        raise ValidationError(
            f'Filename exceeds maximum length ({MAX_FILENAME_LENGTH} chars)',
            'filename'
        )
    
    # Check for path traversal attempts
    if '..' in filename or filename.startswith('/') or filename.startswith('\\'):
        raise ValidationError('Invalid filename (path traversal detected)', 'filename')
    
    # Check extension
    ext = os.path.splitext(filename)[1].lower()
    if ext and ext not in ALLOWED_EXTENSIONS:
        raise ValidationError(
            f'Invalid file extension. Allowed: {", ".join(ALLOWED_EXTENSIONS)}',
            'filename'
        )
    
    # Sanitize: remove dangerous characters
    sanitized = re.sub(r'[^\w\-_\.]', '_', filename)
    return sanitized


def validate_platform(platform: str) -> str:
    """Validate platform selection"""
    valid_platforms = {'windows', 'linux'}
    if platform not in valid_platforms:
        raise ValidationError(
            f'Invalid platform. Must be one of: {", ".join(valid_platforms)}',
            'platform'
        )
    return platform


def validate_obfuscation_level(level: str) -> str:
    """Validate obfuscation level"""
    valid_levels = {'quick', 'balanced', 'maximum', 'source', 'intermediate', 'binary'}
    if level not in valid_levels:
        raise ValidationError(
            f'Invalid obfuscation level. Must be one of: {", ".join(valid_levels)}',
            'level'
        )
    return level


def validate_password(password: str) -> str:
    """Validate password input (for code vault)"""
    if not password:
        raise ValidationError('Password is required', 'password')
    
    if not isinstance(password, str):
        raise ValidationError('Password must be a string', 'password')
    
    if len(password) < 4:
        raise ValidationError('Password must be at least 4 characters', 'password')
    
    if len(password) > 128:
        raise ValidationError('Password is too long (max 128 chars)', 'password')
    
    return password


# ============== ERROR HANDLING ==============

def safe_error_response(error: Exception, context: str = '') -> tuple[dict, int]:
    """
    Generate a safe error response
    In production mode, masks sensitive error details
    """
    error_id = f"ERR_{int(time.time())}"
    
    if isinstance(error, ValidationError):
        return {
            'error': 'Validation Error',
            'message': error.message,
            'field': error.field,
            'error_id': error_id
        }, 400
    
    if PRODUCTION_MODE:
        # In production, don't expose internal error details
        print(f"[{error_id}] {context}: {str(error)}")
        print(traceback.format_exc())
        return {
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred. Please try again.',
            'error_id': error_id
        }, 500
    else:
        # In development, show full error for debugging
        return {
            'error': 'Internal Server Error',
            'message': str(error),
            'error_id': error_id,
            'details': traceback.format_exc() if context else None,
            'context': context
        }, 500


def handle_api_errors(f):
    """
    Decorator to handle API errors consistently
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValidationError as e:
            response, status = safe_error_response(e, f.__name__)
            return jsonify(response), status
        except Exception as e:
            response, status = safe_error_response(e, f.__name__)
            return jsonify(response), status
    return decorated_function
