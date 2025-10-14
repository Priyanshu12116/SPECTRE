# How to Get Google OAuth Client ID - Step by Step Guide

## 📋 Prerequisites
- A Google account (Gmail account)
- 5-10 minutes of time

---

## 🚀 Step-by-Step Instructions

### **STEP 1: Go to Google Cloud Console**
1. Open your browser
2. Go to: **https://console.cloud.google.com/**
3. Sign in with your Google account (if not already signed in)

---

### **STEP 2: Create a New Project**

1. At the top of the page, click on the **project dropdown** (it might say "Select a project" or show a current project name)
   
   ![Location: Top left, next to "Google Cloud"]

2. In the popup window, click **"NEW PROJECT"** button (top right)

3. Fill in the project details:
   - **Project name:** `SPECTRE` (or any name you like)
   - **Organization:** Leave as default (No organization)
   - **Location:** Leave as default

4. Click **"CREATE"** button

5. Wait 10-20 seconds for the project to be created

6. You'll see a notification when it's ready. Click **"SELECT PROJECT"** in the notification

---

### **STEP 3: Enable Google+ API** (Required for Sign-In)

1. In the left sidebar, click **"APIs & Services"**
   - If you don't see the sidebar, click the ☰ (hamburger menu) at the top left

2. Click **"Library"**

3. In the search bar, type: **"Google+ API"**

4. Click on **"Google+ API"** from the results

5. Click the blue **"ENABLE"** button

6. Wait a few seconds for it to enable

---

### **STEP 4: Configure OAuth Consent Screen**

1. In the left sidebar, click **"OAuth consent screen"**

2. Choose user type:
   - Select **"External"** (allows anyone with a Google account)
   - Click **"CREATE"**

3. **Fill in App Information (Page 1):**
   - **App name:** `SPECTRE`
   - **User support email:** Select your email from dropdown
   - **App logo:** (Optional - skip for now)
   - **Application home page:** (Optional - skip for now)
   - **Application privacy policy link:** (Optional - skip for now)
   - **Application terms of service link:** (Optional - skip for now)
   - **Authorized domains:** (Leave empty for now)
   - **Developer contact information:** Enter your email address

4. Click **"SAVE AND CONTINUE"**

5. **Scopes (Page 2):**
   - Click **"SAVE AND CONTINUE"** (don't add any scopes)

6. **Test users (Page 3):**
   - Click **"+ ADD USERS"**
   - Enter your email address (and any other emails you want to test with)
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**

7. **Summary (Page 4):**
   - Review the information
   - Click **"BACK TO DASHBOARD"**

---

### **STEP 5: Create OAuth Client ID** (This is what you need!)

1. In the left sidebar, click **"Credentials"**

2. At the top, click **"+ CREATE CREDENTIALS"**

3. Select **"OAuth client ID"** from the dropdown

4. **Configure the OAuth client:**
   
   - **Application type:** Select **"Web application"**
   
   - **Name:** `SPECTRE Web Client` (or any name)
   
   - **Authorized JavaScript origins:**
     - Click **"+ ADD URI"**
     - Enter: `http://localhost:5500`
     - Click **"+ ADD URI"** again
     - Enter: `http://127.0.0.1:5500`
     - (Add more URIs if you're using different ports or domains)
   
   - **Authorized redirect URIs:** (Leave empty for now)

5. Click **"CREATE"**

6. A popup will appear with your credentials:
   - **Your Client ID** (looks like: `123456789-abc123def456.apps.googleusercontent.com`)
   - **Your Client Secret** (you don't need this for frontend)

7. **IMPORTANT:** Copy the **Client ID** - you'll need this!

8. Click **"OK"**

---

### **STEP 6: Copy Your Client ID**

Your Client ID should look something like this:
```
123456789-abc123def456ghi789jkl012mno345pqr.apps.googleusercontent.com
```

**Copy this entire string!**

---

### **STEP 7: Update Your Code**

Now update your SPECTRE project files:

#### **File 1: `frontend/pages/login.html`**
Find line 28:
```html
data-client_id="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
```

Replace with:
```html
data-client_id="YOUR_ACTUAL_CLIENT_ID_HERE"
```

#### **File 2: `frontend/pages/signup.html`**
Find line 28:
```html
data-client_id="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
```

Replace with:
```html
data-client_id="YOUR_ACTUAL_CLIENT_ID_HERE"
```

---

### **STEP 8: Test It!**

1. Start your local web server (e.g., Live Server in VS Code)
2. Make sure it's running on `http://localhost:5500` (or update the authorized origins)
3. Open `login.html` in your browser
4. You should now see the **real Google Sign-In button** (not just the demo)
5. Click it and sign in with your Google account
6. ✅ Success!

---

## 🎯 Quick Visual Guide

```
Google Cloud Console
    ↓
Create Project ("SPECTRE")
    ↓
Enable Google+ API
    ↓
Configure OAuth Consent Screen
    ↓
Create OAuth Client ID (Web Application)
    ↓
Add Authorized JavaScript Origins
    ↓
Copy Client ID
    ↓
Paste in login.html & signup.html
    ↓
Test!
```

---

## 📸 What to Look For

### Your Client ID will look like:
```
[PROJECT-NUMBER]-[RANDOM-STRING].apps.googleusercontent.com
```

Example:
```
987654321-abcdefghijklmnop123456789.apps.googleusercontent.com
```

### Where to paste it:
```html
<!-- In login.html and signup.html -->
<div id="g_id_onload"
     data-client_id="987654321-abcdefghijklmnop123456789.apps.googleusercontent.com"
     data-callback="handleCredentialResponse"
     data-auto_prompt="false">
</div>
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Invalid Client ID"
**Solution:** 
- Make sure you copied the entire Client ID
- Check for extra spaces before or after
- Verify you're using the Client ID, not the Client Secret

### Issue 2: "redirect_uri_mismatch"
**Solution:**
- Go back to Google Cloud Console → Credentials
- Click on your OAuth Client ID
- Add your exact URL to "Authorized JavaScript origins"
- Example: `http://localhost:5500`

### Issue 3: Google Sign-In button not showing
**Solution:**
- Check browser console for errors (F12)
- Make sure you're using `http://` not `file://`
- Verify the Google Sign-In script is loading
- Clear browser cache and reload

### Issue 4: "Access blocked: This app's request is invalid"
**Solution:**
- Make sure you added your email as a test user
- Verify OAuth consent screen is configured
- Check that Google+ API is enabled

---

## 🔄 If You Need to Find Your Client ID Again

1. Go to https://console.cloud.google.com/
2. Select your project (SPECTRE)
3. Go to **APIs & Services** → **Credentials**
4. Your Client ID will be listed under "OAuth 2.0 Client IDs"
5. Click on it to view/copy

---

## 📝 Important Notes

- ✅ **Client ID is safe to expose** (it's meant to be public in your frontend code)
- ❌ **Client Secret should be kept private** (don't put it in frontend code)
- 🔒 For production, add your actual domain to authorized origins
- 🧪 For testing, `localhost` is fine

---

## 🎉 You're Done!

Once you paste your Client ID into both HTML files, the real Google Sign-In will work!

**Still have the Demo button?** That's fine! It works as a fallback if anything goes wrong with the real Google Sign-In.

---

## 📞 Need Help?

If you get stuck:
1. Check the browser console (F12) for error messages
2. Verify all steps were completed
3. Make sure your local server is running on the correct port
4. Try the Demo Google Sign-In button as a fallback

---

**Estimated Time:** 5-10 minutes
**Difficulty:** Easy
**Cost:** FREE (Google Cloud has a free tier)
