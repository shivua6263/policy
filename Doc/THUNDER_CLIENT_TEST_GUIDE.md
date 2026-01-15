# Thunder Client Testing Guide - Profile Image API

## Step 1: Check Frontend Logs

1. **Open Browser DevTools** (Press F12)
2. Go to **Console** tab
3. **Refresh the page** (F5)
4. Look for these messages:
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

5. **Click the "Upload Photo" button** and watch for:
   ```
   🖱️ Upload Photo button clicked!
   📂 Triggering file input...
   ```

**If you see these logs** → Frontend is working ✓  
**If you DON'T see these logs** → Tell me what you see in console

---

## Step 2: Test API with Thunder Client

### 2.1 GET Current Profile Image

1. **Open Thunder Client**
2. Create new request:
   - **Method**: GET
   - **URL**: `http://localhost:8000/api/customer/1/profile-image/`
   - **Headers**: `Content-Type: application/json`

3. **Send** and check response:
   ```json
   {
     "profile_image": null
   }
   ```
   OR if image exists:
   ```json
   {
     "profile_image": "John_Doe_1.png",
     "image_url": "/media/profile_images/John_Doe_1.png"
   }
   ```

### 2.2 POST Upload Image

1. Create new request:
   - **Method**: POST
   - **URL**: `http://localhost:8000/api/customer/1/profile-image/`
   - **Headers**: `Content-Type: application/json`

2. **Body** (select JSON):
   ```json
   {
     "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
     "fileType": "png"
   }
   ```

3. **Send** and check response:
   ```json
   {
     "message": "Profile image uploaded successfully",
     "profile_image": "John_Doe_1.png",
     "image_url": "/media/profile_images/John_Doe_1.png"
   }
   ```

   **Status should be**: `200 OK` ✓

---

## Step 3: Verify Backend File

1. **Open Terminal**
   ```bash
   ls -la /home/labuser/Desktop/Policy/Backend/restapi/media/profile_images/
   ```

2. Should see files like:
   ```
   John_Doe_1.png
   John_Doe_1.jpg
   ```

---

## Step 4: Troubleshooting

### Issue: Console shows nothing
**Solution**: 
- Clear browser cache: F12 → Application → Clear All
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Make sure you're on `account.html` page

### Issue: Console shows errors
**Solution**:
- Screenshot the console error
- Share with me the exact error message

### Issue: Button click but no file dialog
**Solution**:
- Check if `profileImageInput` is found in console
- Verify `<input type="file" id="profileImageInput">` exists in HTML

### Issue: API POST fails
**Solution**:
- Check if `backend` is running: `http://localhost:8000` should be accessible
- Verify customer ID exists: `curl http://localhost:8000/api/customer/1/`
- Check `/media/profile_images/` folder exists

---

## Complete Testing Workflow

### ✓ IF EVERYTHING WORKS:

1. **Browser Console** shows all logs ✓
2. **GET request** shows current image (or null) ✓
3. **Click button** opens file dialog ✓
4. **Select image** shows file details in console ✓
5. **POST request** succeeds (200 OK) ✓
6. **Image appears** on profile ✓
7. **File exists** on disk ✓

### ✗ IF SOMETHING FAILS:

1. Take a **screenshot** of browser console
2. Run **GET request** in Thunder Client → screenshot response
3. Copy the **exact error message** and share with me

---

## Quick Commands

```bash
# Check if backend is running
curl http://localhost:8000/api/customer/1/

# Check uploaded images
ls /home/labuser/Desktop/Policy/Backend/restapi/media/profile_images/

# Check backend logs
cd /home/labuser/Desktop/Policy/Backend/restapi
tail -f /tmp/django.log  # if logging is enabled
```

---

## Expected Results

| Action | Expected | Status |
|--------|----------|--------|
| Console logs on page load | See all 🔧 logs | ? |
| Click Upload button | File dialog opens | ? |
| Select image | 📁 File selected logs | ? |
| GET API | Returns profile_image (null or filename) | ? |
| POST API | Status 200, returns image_url | ? |
| Image displays | Photo shows on profile | ? |

**Fill in Status column with ✓ (works) or ✗ (fails) and let me know!**
