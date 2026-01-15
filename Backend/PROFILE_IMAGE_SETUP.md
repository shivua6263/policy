# Profile Image Upload Implementation Guide

## Overview
Users can now upload their profile images (PNG/JPG) which will be:
1. Converted to base64 on the frontend
2. Sent to the backend
3. Decoded and stored in the `media/profile_images` folder
4. Stored with filename format: `{username}_{userid}.{extension}`
5. Retrieved and displayed when users visit their profile

## Implementation Details

### Backend Changes

#### 1. **Customer Model Update**
- Added `profile_image` field to store the image filename
- File: `Backend/restapi/customer/models.py`

#### 2. **New API Endpoint**
- **Endpoint**: `POST/GET /api/customer/<id>/profile-image/`
- **POST Method**: Upload profile image as base64
  - Accepts: `image` (base64), `fileType` (png/jpg)
  - Validates file type (only PNG/JPG)
  - Converts base64 to binary and saves to disk
  - Updates customer record with image filename
  - Returns: Image URL for frontend display

- **GET Method**: Fetch customer's profile image
  - Returns: Image filename and URL if exists
  - Returns: null if no image

#### 3. **Settings Configuration**
- Added media files configuration to `settings.py`
- Media folder path: `MEDIA_ROOT = BASE_DIR / "media"`
- Media URL: `/media/`

#### 4. **URL Configuration**
- Updated `urls.py` to serve media files during development
- Images stored in: `/media/profile_images/`

#### 5. **Migration**
- Created migration: `0002_customer_profile_image.py`
- Run migration: `python manage.py migrate`

### Frontend Changes

#### 1. **HTML Updates**
- **File**: `Frontend/Customer Frontend/account.html`
- Added edit button (camera icon) overlaid on profile image
- Button positioned at bottom-right of image
- Hidden file input for image selection

#### 2. **JavaScript Functions**
- **File**: `Frontend/Customer Frontend/script.js`

**Key Functions:**
1. `loadUserProfile()` - Load user info from localStorage and fetch profile image
2. `fetchProfileImage(userId, backendUrl)` - Get image from backend
3. `setupProfileImageUpload()` - Setup edit button and file input
4. `uploadProfileImage(base64Data, fileType)` - Upload image to backend

**Features:**
- Validates file type (PNG/JPG only)
- Validates file size (max 5MB)
- Shows loading spinner during upload
- Converts image to base64 automatically
- Displays success/error notifications
- Updates profile image immediately after upload

## API Usage

### Upload Profile Image
```
POST /api/customer/<customer_id>/profile-image/
Content-Type: application/json

{
    "image": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
    "fileType": "png"
}

Response:
{
    "message": "Profile image uploaded successfully",
    "profile_image": "john_doe_123.png",
    "image_url": "/media/profile_images/john_doe_123.png"
}
```

### Fetch Profile Image
```
GET /api/customer/<customer_id>/profile-image/

Response:
{
    "profile_image": "john_doe_123.png",
    "image_url": "/media/profile_images/john_doe_123.png"
}
```

## File Structure
```
Backend/
  restapi/
    media/
      profile_images/
        {username}_{userid}.png
        {username}_{userid}.jpg
        ...
```

## Configuration

### Backend URL
Update the `backendUrl` variable in `script.js`:
```javascript
const backendUrl = 'http://localhost:8000'; // Change to your backend URL
```

### CORS Configuration
The backend already has CORS configured. If needed, add frontend URL to `CORS_ALLOWED_ORIGINS` in `settings.py`:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Your frontend port
    ...
]
```

## How to Use

### For Users
1. Click the camera icon on their profile image
2. Select a PNG or JPG image
3. Image is automatically converted to base64 and uploaded
4. Profile image updates immediately
5. Image persists across login/logout

### For Development
1. Apply migration: `python manage.py migrate`
2. Ensure `DEBUG = True` in settings.py for media serving
3. Create `media` folder manually if not auto-created:
   ```bash
   mkdir -p Backend/restapi/media/profile_images
   ```

## Validation Rules
- File Types: PNG, JPG, JPEG only
- Max File Size: 5MB
- Filename Format: `{username_with_underscores}_{userid}.{extension}`
- Default Image: Unsplash image is shown if no custom image uploaded

## Error Handling
- Invalid file type: "Only PNG and JPG/JPEG images are allowed"
- File too large: "Image size must be less than 5MB"
- Upload error: Shows specific error message
- Network error: "Error uploading image" with detailed message

## Security Notes
- Backend validates file type before processing
- Base64 data is decoded before storage
- Only PNG/JPG allowed (no executables or other formats)
- Images stored outside web root but served through Django
- Consider adding file size limit validation on backend for production

## Future Enhancements
1. Image compression before storage
2. Thumbnail generation for faster loading
3. Image cropping tool before upload
4. Drag & drop upload support
5. Multiple image formats support (WebP, etc.)
6. Image optimization for different screen sizes
