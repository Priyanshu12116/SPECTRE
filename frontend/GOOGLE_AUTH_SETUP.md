# Google Authentication Setup Guide

This guide explains how to set up Google OAuth 2.0 authentication for the SPECTRE login and signup pages.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Setup Steps

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on "Select a project" at the top
3. Click "New Project"
4. Enter project name (e.g., "SPECTRE Auth")
5. Click "Create"

### 2. Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. If prompted, configure the OAuth consent screen:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: SPECTRE
     - User support email: your email
     - Developer contact: your email
   - Click "Save and Continue"
   - Skip the "Scopes" section (click "Save and Continue")
   - Add test users if needed
   - Click "Save and Continue"

4. Create OAuth Client ID:
   - Application type: "Web application"
   - Name: "SPECTRE Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:5500` (for local development)
     - `http://127.0.0.1:5500`
     - Add your production domain when ready
   - Authorized redirect URIs:
     - `http://localhost:5500/frontend/pages/login.html`
     - `http://localhost:5500/frontend/pages/signup.html`
     - Add production URLs when ready
   - Click "Create"

5. Copy your Client ID (it will look like: `123456789-abcdefg.apps.googleusercontent.com`)

### 4. Update Your Code

Replace `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` in the following files with your actual Client ID:

1. **frontend/pages/login.html** (line 28)
2. **frontend/pages/signup.html** (line 28)

Example:
```html
<div id="g_id_onload"
     data-client_id="123456789-abcdefg.apps.googleusercontent.com"
     data-callback="handleCredentialResponse"
     data-auto_prompt="false">
</div>
```

### 5. Test Locally

1. Start a local web server (e.g., using Live Server extension in VS Code)
2. Navigate to `http://localhost:5500/frontend/pages/login.html`
3. The Google Sign-In button should appear
4. Click it to test the authentication flow

## Features

### Login Page (`login.html`)
- Google Sign-In button
- Traditional username/password login
- Link to signup page
- 3D animated shield background

### Signup Page (`signup.html`)
- Google Sign-In button for quick registration
- Traditional signup form with validation:
  - Full name
  - Email address
  - Username (3-20 characters, alphanumeric + underscore)
  - Password (minimum 8 characters)
  - Password confirmation
  - Terms of Service acceptance
- Link back to login page
- 3D animated shield background

## User Data Storage

Currently, user data is stored in `localStorage` for demonstration purposes:

- **Google Auth users**: Stores name, email, profile picture
- **Traditional signup users**: Stores in `registeredUsers` array

⚠️ **Important**: In production, you should:
1. Store user data in a secure backend database
2. Hash passwords using bcrypt or similar
3. Implement proper session management
4. Use HTTPS for all authentication flows
5. Validate tokens on the backend

## Security Considerations

### Current Implementation (Development Only)
- Passwords are stored in plain text in localStorage
- No backend validation
- Client-side only authentication

### Production Requirements
1. **Backend API**: Create endpoints for:
   - User registration
   - User login
   - Google OAuth token verification
   - Session management

2. **Password Security**:
   - Hash passwords with bcrypt (cost factor 10+)
   - Never store plain text passwords
   - Implement password strength requirements

3. **Token Verification**:
   - Verify Google ID tokens on the backend
   - Use Google's token verification library
   - Don't trust client-side token decoding alone

4. **HTTPS**:
   - Always use HTTPS in production
   - Update Google OAuth authorized origins to use HTTPS

5. **CSRF Protection**:
   - Implement CSRF tokens
   - Use SameSite cookie attributes

## Troubleshooting

### Google Sign-In button not appearing
- Check browser console for errors
- Verify Client ID is correct
- Ensure JavaScript origins are authorized in Google Console
- Check that the Google Sign-In library is loading

### "redirect_uri_mismatch" error
- Verify redirect URIs in Google Console match exactly
- Include the protocol (http/https)
- Check for trailing slashes

### Token verification fails
- Ensure you're using the correct Client ID
- Check that the token hasn't expired
- Verify the audience (aud) claim matches your Client ID

## Next Steps

1. Set up a backend server (Node.js, Python, etc.)
2. Create database schema for users
3. Implement proper authentication endpoints
4. Add JWT-based session management
5. Deploy to production with HTTPS
6. Update Google OAuth settings for production domain

## Resources

- [Google Sign-In Documentation](https://developers.google.com/identity/gsi/web)
- [OAuth 2.0 Best Practices](https://oauth.net/2/)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
