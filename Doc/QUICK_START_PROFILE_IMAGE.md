# Profile Image Upload - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Apply Database Migration
```bash
cd Backend/restapi
python manage.py migrate
```

### Step 2: Create Media Directory
```bash
mkdir -p Backend/restapi/media/profile_images
```

### Step 3: Verify Backend URL
Open `Frontend/Customer Frontend/script.js` and check:
```javascript
const backendUrl = 'http://localhost:8000';
```
Update if your backend runs on different port/host.

### Step 4: Start Backend (if not running)
```bash
cd Backend/restapi
python manage.py runserver
```

### Step 5: Start Frontend (if not running)
Open `Frontend/Customer Frontend/` in browser or run your server.

---

## 📸 How to Use

1. **Login** to customer account
2. **Navigate** to "My Account" page
3. **Click** the camera icon ✓ on profile image
4. **Select** a PNG or JPG image (max 5MB)
5. **Wait** for upload to complete
6. **See** your image appear instantly!

---

## ✅ What Works

- ✅ Click camera icon to upload image
- ✅ Supports PNG and JPG formats
- ✅ Automatic base64 conversion
- ✅ Image stored with username + ID
- ✅ Image persists on profile
- ✅ Error handling and notifications
- ✅ Loading spinner during upload
- ✅ Logout and login - image still shows

---

## 🐛 Troubleshooting

### Image Upload Button Not Working?
- Check browser console for errors
- Ensure backend URL is correct in `script.js`
- Make sure CORS is configured (already done)

### Image Not Saving?
- Run migration: `python manage.py migrate`
- Check `Backend/restapi/media/profile_images/` folder exists
- Check folder permissions (should be writable)

### Images Not Displaying?
- Clear browser cache
- Check image URL in browser (should be `/media/profile_images/{image_name}`)
- Ensure Django is serving media files (DEBUG=True in settings.py)

### "Only PNG and JPG allowed" Error?
- Use PNG or JPG format only
- Other formats (GIF, WebP, etc.) are not supported yet

### "Image size must be less than 5MB" Error?
- Compress image before uploading
- Use smaller resolution image

---

## 📁 File Structure After Setup

```
Backend/restapi/
├── media/                          # Created automatically when image uploaded
│   └── profile_images/
│       ├── john_doe_1.png
│       ├── jane_smith_2.jpg
│       └── ...
├── customer/
│   ├── models.py                   # ✅ UPDATED
│   ├── views.py                    # ✅ UPDATED  
│   ├── urls.py                     # ✅ UPDATED
│   ├── serializers.py              # ✅ UPDATED
│   └── migrations/
│       └── 0002_customer_profile_image.py  # ✅ NEW
├── restapi/
│   ├── settings.py                 # ✅ UPDATED
│   └── urls.py                     # ✅ UPDATED
└── ...
```

---

## 🔌 API Endpoints

### Upload Profile Image
```
POST /api/customer/{id}/profile-image/
Content-Type: application/json

{
  "image": "data:image/png;base64,...",
  "fileType": "png"
}
```

### Get Profile Image
```
GET /api/customer/{id}/profile-image/
```

---

## 💡 Tips & Tricks

1. **Default Image**: If no custom image, a default Unsplash image is shown
2. **Quick Update**: No page refresh needed after upload - updates instantly
3. **Naming**: Images are named as `{username}_{id}.{ext}` for easy management
4. **Storage**: Images stored in media folder, accessible via `/media/profile_images/`

---

## ❌ Known Limitations (Can Add Later)

- No image cropping tool (frontend)
- No image compression (added in future)
- Single image only (multiple images can be added)
- No drag & drop (can add Bootstrap drag-drop)
- Limited formats (PNG/JPG only, WebP can be added)

---

## 📞 Support

For detailed setup guide, see: `Backend/PROFILE_IMAGE_SETUP.md`
For implementation details, see: `PROFILE_IMAGE_IMPLEMENTATION.md`

---

## ✨ Summary

**What You Get:**
- Profile image upload with camera button
- Base64 conversion (frontend)
- Image storage in media folder
- Image retrieval on profile load
- Persistent storage (survives logout/login)
- File type & size validation
- Error notifications

**Files Modified:** 8
**Files Created:** 2  
**Setup Time:** ~5 minutes
**Status:** ✅ Ready to Use!
