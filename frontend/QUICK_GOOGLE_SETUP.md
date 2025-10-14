# Quick Google Sign-In Setup

## Option 1: Get Real Google OAuth Credentials (Recommended for Production)

### Step 1: Create Google Cloud Project
1. Go to https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Name it "SPECTRE" and click "Create"

### Step 2: Get Client ID
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure consent screen:
   - User Type: External
   - App name: SPECTRE
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue" through all steps
4. Create OAuth Client ID:
   - Application type: Web application
   - Name: SPECTRE Web Client
   - Authorized JavaScript origins:
     - `http://localhost:5500`
     - `http://127.0.0.1:5500`
     - Add your domain if deployed
   - Click "Create"
5. **Copy the Client ID** (looks like: `123456789-abc123.apps.googleusercontent.com`)

### Step 3: Update Your Code
Replace `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID in:
- `frontend/pages/login.html` (line 28)
- `frontend/pages/signup.html` (line 28)

---

## Option 2: Use Demo Mode (For Testing Without Google Setup)

If you want to test the authentication flow without setting up Google OAuth, I've added a demo Google Sign-In button that simulates the authentication.

### How to Enable Demo Mode:
The demo mode is already built into the pages. Just use the "Demo Google Sign-In" button that appears below the regular Google button.

---

## Troubleshooting

### Google Sign-In button not showing?
- Check browser console for errors
- Verify the Google Sign-In script is loading: `https://accounts.google.com/gsi/client`
- Make sure you're using a web server (not file:// protocol)

### "Invalid Client ID" error?
- Double-check you copied the entire Client ID
- Verify authorized JavaScript origins include your current URL
- Make sure there are no extra spaces in the Client ID

### "redirect_uri_mismatch" error?
- Add your exact URL to authorized JavaScript origins in Google Console
- Include the protocol (http:// or https://)

---

## Testing Checklist

✅ Using a local web server (Live Server, http-server, etc.)
✅ Client ID is correctly pasted (no extra spaces)
✅ Authorized JavaScript origins include your localhost URL
✅ Browser console shows no errors
✅ Page is loaded via http:// not file://
