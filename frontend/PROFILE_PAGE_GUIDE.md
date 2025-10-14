# Profile Page - User Guide

## ✅ What's Been Added

I've created a complete **User Profile Page** for SPECTRE where users can:

### 1. **View Account Information**
- Full name
- Email address
- Username
- Authentication method (Google or Email/Password)
- Member since date
- Profile avatar (shows first letter of name or Google profile picture)

### 2. **View Statistics**
- Total files obfuscated
- Total obfuscations performed
- Last activity date
- Favorite obfuscation level

### 3. **View Obfuscation History**
- Complete list of all obfuscated files
- Search functionality
- Filter by obfuscation level
- Each entry shows:
  - Filename
  - Date and time
  - Obfuscation level
  - Download and delete options

### 4. **Edit Profile**
- Update full name
- Update email
- Update username
- Modal dialog for editing

### 5. **Change Password**
- For users who signed up with email/password
- Requires current password
- Password confirmation
- Not available for Google sign-in users

---

## 📁 Files Created

### HTML
- **`frontend/pages/profile.html`** - Main profile page

### CSS
- **`frontend/css/profile.css`** - Profile page styling
- **`frontend/css/nav-profile.css`** - Navigation profile link styling

### JavaScript
- **`frontend/js/profile.js`** - Profile page functionality

---

## 🚀 How to Access

### For Users:
1. **Login** to your account
2. Click on your **username** in the navigation bar (top right)
3. You'll be taken to your profile page

### Direct URL:
- Navigate to: `frontend/pages/profile.html`

---

## 🔗 Navigation Integration

The profile link automatically appears in the navigation when logged in:
- Shows your username with a user icon
- Clicking it takes you to the profile page
- Appears next to the Logout button

### To Enable Navigation Profile Link:
Add this line to the `<head>` section of any page:
```html
<link rel="stylesheet" href="../css/nav-profile.css">
```

**Already added to:**
- ✅ profile.html

**Need to add to:**
- index.html
- features.html
- app.html
- results.html

---

## 📊 How Obfuscation History Works

### Data Storage:
History is stored in `localStorage` under the key `obfuscationHistory` as an array of objects:

```javascript
{
    id: 'unique-id',
    username: 'current-user',
    filename: 'main.c',
    level: 'source', // or 'intermediate', 'binary'
    timestamp: '2025-10-14T12:00:00.000Z',
    count: 1
}
```

### To Add History from app.html:
When a file is obfuscated, add this code:

```javascript
// After successful obfuscation
const historyItem = {
    id: Date.now().toString() + Math.random().toString(36),
    username: localStorage.getItem('username'),
    filename: uploadedFileName,
    level: selectedLevel, // 'source', 'intermediate', or 'binary'
    timestamp: new Date().toISOString(),
    count: 1
};

const history = JSON.parse(localStorage.getItem('obfuscationHistory') || '[]');
history.push(historyItem);
localStorage.setItem('obfuscationHistory', JSON.stringify(history));
```

---

## 🎨 Features

### Profile Avatar
- Shows first letter of name in a colored circle
- For Google users: displays their Google profile picture
- Click "Change Photo" button (placeholder for future implementation)

### Statistics Cards
- **Files Obfuscated**: Total unique files
- **Total Obfuscations**: Sum of all obfuscation operations
- **Last Activity**: Shows relative time (Today, Yesterday, X days ago)
- **Favorite Level**: Most frequently used obfuscation level

### History List
- **Search**: Filter files by name
- **Filter**: Filter by obfuscation level (All, Source, Intermediate, Binary)
- **Actions**: Download or delete each entry
- **Empty State**: Shows when no history exists

### Modals
- **Edit Profile**: Update user information
- **Change Password**: Update password (traditional auth only)
- Click outside or press X to close

---

## 🔒 Security Notes

### Current Implementation (Development):
- ⚠️ Profile data stored in localStorage
- ⚠️ History stored client-side
- ⚠️ No backend validation

### For Production:
- 🔐 Store user data in database
- 🔐 Store obfuscation history on server
- 🔐 Implement proper authentication tokens
- 🔐 Add file download from server
- 🔐 Validate all updates server-side

---

## 🎯 Testing the Profile Page

### Test Scenario 1: View Profile
1. Login with any account
2. Click your username in navigation
3. ✅ Should see your profile information

### Test Scenario 2: Edit Profile
1. Click "Edit Profile" button
2. Change your name/email/username
3. Click "Save Changes"
4. ✅ Profile should update

### Test Scenario 3: Change Password
1. Click "Change Password" button
2. Enter current password
3. Enter new password (min 8 chars)
4. Confirm new password
5. Click "Update Password"
6. ✅ Password should be updated

### Test Scenario 4: View History (with sample data)
1. Uncomment line at bottom of `profile.js`:
   ```javascript
   addSampleHistory();
   ```
2. Refresh the page
3. ✅ Should see 3 sample obfuscation entries

### Test Scenario 5: Search History
1. Type filename in search box
2. ✅ History should filter in real-time

### Test Scenario 6: Filter by Level
1. Select level from dropdown
2. ✅ History should show only that level

---

## 🐛 Troubleshooting

### Profile link not showing in navigation
**Solution**: Add `<link rel="stylesheet" href="../css/nav-profile.css">` to the page's `<head>`

### "No obfuscation history yet" message
**Solution**: This is normal if you haven't obfuscated any files yet. To test:
- Uncomment `addSampleHistory()` in profile.js
- Or integrate history tracking in app.html

### Can't edit profile
**Solution**: Make sure you're logged in and have user data in localStorage

### Google users can't change password
**Solution**: This is intentional - Google users authenticate through Google OAuth

---

## 📝 Next Steps

### To Complete Integration:

1. **Add nav-profile.css to all pages**:
   ```html
   <link rel="stylesheet" href="../css/nav-profile.css">
   ```

2. **Integrate history tracking in app.html**:
   - Add code to save obfuscation history after each operation
   - See "How Obfuscation History Works" section above

3. **Add Profile link to navigation**:
   - Already done via home.js
   - Profile link shows automatically when logged in

4. **Test all features**:
   - Login/logout
   - View profile
   - Edit profile
   - Change password
   - View history

---

## 🎉 Summary

You now have a fully functional profile page with:
- ✅ User information display
- ✅ Statistics dashboard
- ✅ Obfuscation history with search/filter
- ✅ Profile editing
- ✅ Password change
- ✅ Beautiful UI matching SPECTRE theme
- ✅ Responsive design
- ✅ Modal dialogs
- ✅ Integration with authentication system

**The profile page is ready to use!** Just add the CSS link to other pages and integrate history tracking in the obfuscation tool.
