# Debugging Instructions - Profile Image Upload

## What I Added

I added **comprehensive console logging** throughout the JavaScript to help identify exactly where the issue is.

---

## STEP 1: Open Browser Console

1. Go to `http://localhost:3000/account.html`
2. Press **F12** (opens DevTools)
3. Click on **Console** tab
4. **Refresh page** (F5)

You should see:
```
📄 Page detection: { path: "...", fileName: "account.html" }
✓ Account page detected, initializing...
🏠 initAccountPage() called
🔧 setupProfileImageUpload() called
📍 editProfileBtn found: true
📍 profileImageInput found: true
✓ Both button and input found, adding event listeners...
✓ setupProfileImageUpload() complete
```

**If you see ALL these logs** → Problem is not in initialization ✓  
**If you see SOME missing** → Tell me which ones are missing ✗

---

## STEP 2: Click the "Upload Photo" Button

1. While looking at the Console
2. Click the **"Upload Photo"** button on profile page
3. Watch the Console for:
   ```
   🖱️ Upload Photo button clicked!
   📂 Triggering file input...
   ```

**If you see these logs** → Button is working ✓  
**If NO logs appear** → Button event listener isn't attached ✗

---

## STEP 3: Select an Image File

1. A **file dialog** should open
2. Select any **PNG or JPG** file
3. Watch the Console for:
   ```
   📁 File selected
   📊 File info: { name: "...", type: "image/png", size: ..., sizeInMB: "..." }
   ✓ File validation passed, converting to base64...
   📖 Starting FileReader...
   ✓ Base64 conversion complete, size: 12345
   ```

**If you see file dialog but NO logs** → JavaScript isn't running ✗  
**If you see all logs** → Image is ready to upload ✓

---

## STEP 4: Test API with Thunder Client

### Test GET (No Upload Yet)

```
Method:  GET
URL:     http://localhost:8000/api/customer/1/profile-image/
Headers: Content-Type: application/json
```

**Expected Response:**
```json
{
  "profile_image": null
}
```

**Status:** 200 OK ✓

---

### Test POST (Upload Image)

**First**, you need a base64 test image. Use this minimal PNG:

```
Method:  POST
URL:     http://localhost:8000/api/customer/1/profile-image/
Headers: Content-Type: application/json

Body (JSON):
{
  "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "fileType": "png"
}
```

**Expected Response:**
```json
{
  "message": "Profile image uploaded successfully",
  "profile_image": "John_Doe_1.png",
  "image_url": "/media/profile_images/John_Doe_1.png"
}
```

**Status:** 200 OK ✓

---

### Test GET (After Upload)

```
Method:  GET
URL:     http://localhost:8000/api/customer/1/profile-image/
```

**Expected Response:**
```json
{
  "profile_image": "John_Doe_1.png",
  "image_url": "/media/profile_images/John_Doe_1.png"
}
```

---

## Troubleshooting Checklist

| Check | Action | Result |
|-------|--------|--------|
| **Init Logs** | Do you see all 🔧 logs on page load? | ✓ or ✗ |
| **Button Click** | Do you see 🖱️ and 📂 logs when clicking? | ✓ or ✗ |
| **File Select** | Do you see 📊 file info logs? | ✓ or ✗ |
| **Base64** | Do you see ✓ Base64 conversion logs? | ✓ or ✗ |
| **GET API** | Does Thunder Client GET return success? | ✓ or ✗ |
| **POST API** | Does Thunder Client POST return success? | ✓ or ✗ |

**Fill in the Result column and tell me which ones failed!**

---

## Send Me This Info

When you test, please provide:

1. **Console Screenshot** - Show me what logs appear (or don't)
2. **Which step fails** - Does button click work? Does file select work?
3. **Thunder Client response** - Copy the JSON response
4. **Backend status** - Is Django running on port 8000?

Example:
```
Browser Console Logs:
✓ Init logs show
✗ Button click - NO logs after clicking
✓ GET API returns null
✗ POST API - getting 404 error
```

---

## Quick Diagnostics

```bash
# Check if backend is running
curl http://localhost:8000/api/customer/1/ -v

# Check if media folder exists
ls -la /home/labuser/Desktop/Policy/Backend/restapi/media/

# Check Django logs (if available)
tail -50 /var/log/django.log  # or check error output in terminal
```

---

## Files Updated

- ✅ `script.js` - Added comprehensive console logging
- ✅ `account.html` - Changed camera icon to "Upload Photo" button

**Status: Ready for testing!**

Run through the steps above and let me know exactly where it fails.
