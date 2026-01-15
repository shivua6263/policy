# 🔍 Code Reference - All Changes Made

## Backend - New Code Added

### 1. customer/views.py - New API Class

```python
class CustomerProfileImageAPI(APIView):
    """API endpoint for uploading and managing customer profile images"""
    
    def post(self, request, id):
        """Upload profile image as base64"""
        try:
            customer = Customer.objects.get(id=id)
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            # Get base64 image and file type from request
            image_data = request.data.get('image')
            file_type = request.data.get('fileType', 'png')
            
            if not image_data:
                return Response({"error": "No image data provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Validate file type
            if file_type not in ['png', 'jpg', 'jpeg']:
                return Response({"error": "Only PNG and JPG/JPEG formats are allowed"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create media directory if it doesn't exist
            media_dir = os.path.join(settings.BASE_DIR, 'media', 'profile_images')
            os.makedirs(media_dir, exist_ok=True)
            
            # Generate filename with username and id
            filename = f"{customer.name.replace(' ', '_')}_{customer.id}.{file_type}"
            file_path = os.path.join(media_dir, filename)
            
            # Remove base64 header if present (data:image/png;base64,)
            if ',' in image_data:
                image_data = image_data.split(',')[1]
            
            # Decode base64 and save image
            image_binary = base64.b64decode(image_data)
            with open(file_path, 'wb') as f:
                f.write(image_binary)
            
            # Update customer profile image field
            customer.profile_image = filename
            customer.save()
            
            return Response({
                "message": "Profile image uploaded successfully",
                "profile_image": filename,
                "image_url": f"/media/profile_images/{filename}"
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": f"Error uploading image: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, id):
        """Get customer profile image"""
        try:
            customer = Customer.objects.get(id=id)
            if customer.profile_image:
                return Response({
                    "profile_image": customer.profile_image,
                    "image_url": f"/media/profile_images/{customer.profile_image}"
                }, status=status.HTTP_200_OK)
            else:
                return Response({"profile_image": None}, status=status.HTTP_200_OK)
        except Customer.DoesNotExist:
            return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)
```

---

## Frontend - New JavaScript Functions

### 1. loadUserProfile()
```javascript
function loadUserProfile() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    const backendUrl = 'http://localhost:8000'; // Update with your backend URL
    
    // Update profile name and email
    const profileNameEl = document.getElementById('profileName');
    const profileEmailEl = document.getElementById('profileEmail');
    
    if (profileNameEl) profileNameEl.textContent = user.name || 'John Doe';
    if (profileEmailEl) profileEmailEl.textContent = user.email || 'john.doe@email.com';
    
    // Fetch and display profile image from backend
    if (user.id) {
        fetchProfileImage(user.id, backendUrl);
    }
}
```

### 2. fetchProfileImage()
```javascript
function fetchProfileImage(userId, backendUrl) {
    const apiUrl = `${backendUrl}/api/customer/${userId}/profile-image/`;
    
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.profile_image) {
            const imageUrl = `${backendUrl}/media/profile_images/${data.profile_image}`;
            const profileImg = document.getElementById('profileImage');
            if (profileImg) {
                profileImg.src = imageUrl;
            }
        }
    })
    .catch(error => {
        console.log('No custom profile image found, using default');
    });
}
```

### 3. setupProfileImageUpload()
```javascript
function setupProfileImageUpload() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const profileImageInput = document.getElementById('profileImageInput');
    
    if (!editProfileBtn || !profileImageInput) return;
    
    // Trigger file input when edit button is clicked
    editProfileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        profileImageInput.click();
    });
    
    // Handle file selection
    profileImageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        
        if (!file) return;
        
        // Validate file type
        const allowedTypes = ['image/png', 'image/jpeg'];
        if (!allowedTypes.includes(file.type)) {
            showNotification('Only PNG and JPG/JPEG images are allowed', 'warning');
            return;
        }
        
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            showNotification('Image size must be less than 5MB', 'warning');
            return;
        }
        
        // Convert image to base64 and upload
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const base64Data = event.target.result;
            uploadProfileImage(base64Data, file.type);
        };
        
        reader.onerror = function() {
            showNotification('Error reading file', 'danger');
        };
        
        reader.readAsDataURL(file);
    });
}
```

### 4. uploadProfileImage()
```javascript
function uploadProfileImage(base64Data, fileType) {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) return;
    
    const user = JSON.parse(currentUser);
    const backendUrl = 'http://localhost:8000'; // Update with your backend URL
    const apiUrl = `${backendUrl}/api/customer/${user.id}/profile-image/`;
    
    // Determine file extension
    let fileExtension = 'png';
    if (fileType === 'image/jpeg') {
        fileExtension = 'jpg';
    }
    
    const uploadBtn = document.getElementById('editProfileBtn');
    if (uploadBtn) {
        uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        uploadBtn.disabled = true;
    }
    
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            image: base64Data,
            fileType: fileExtension
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        showNotification('Profile image updated successfully!', 'success');
        
        // Update profile image in UI
        const imageUrl = `${backendUrl}${data.image_url}`;
        const profileImg = document.getElementById('profileImage');
        if (profileImg) {
            profileImg.src = imageUrl;
        }
        
        // Reset file input
        const profileImageInput = document.getElementById('profileImageInput');
        if (profileImageInput) {
            profileImageInput.value = '';
        }
    })
    .catch(error => {
        console.error('Error uploading image:', error);
        showNotification(`Error uploading image: ${error.message}`, 'danger');
    })
    .finally(() => {
        if (uploadBtn) {
            uploadBtn.innerHTML = '<i class="fas fa-camera"></i>';
            uploadBtn.disabled = false;
        }
    });
}
```

---

## Frontend - HTML Changes

### account.html - Profile Section Update

```html
<!-- BEFORE: -->
<div class="col-lg-3">
    <div class="card border-0 shadow-sm">
        <div class="card-body text-center p-4">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
                 alt="Profile" class="rounded-circle mb-3" 
                 style="width: 80px; height: 80px; object-fit: cover;">
            <h5 class="mb-1">John Doe</h5>
            <p class="text-muted small mb-3">john.doe@email.com</p>
            <div class="badge bg-success mb-3">Verified Account</div>
        </div>

<!-- AFTER: -->
<div class="col-lg-3">
    <div class="card border-0 shadow-sm">
        <div class="card-body text-center p-4">
            <div style="position: relative; display: inline-block; margin-bottom: 1rem;">
                <img id="profileImage" 
                     src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" 
                     alt="Profile" class="rounded-circle" 
                     style="width: 80px; height: 80px; object-fit: cover; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <button id="editProfileBtn" class="btn btn-sm btn-primary" 
                        style="position: absolute; bottom: -5px; right: -5px; border-radius: 50%; 
                               width: 32px; height: 32px; padding: 0; display: flex; align-items: center; 
                               justify-content: center;">
                    <i class="fas fa-camera"></i>
                </button>
            </div>
            <input type="file" id="profileImageInput" accept=".png,.jpg,.jpeg" style="display: none;">
            <h5 class="mb-1" id="profileName">John Doe</h5>
            <p class="text-muted small mb-3" id="profileEmail">john.doe@email.com</p>
            <div class="badge bg-success mb-3">Verified Account</div>
        </div>
```

---

## Configuration Files

### settings.py - Media Configuration Added

```python
# Media files configuration for user uploads
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
```

### urls.py - Media Serving Added

```python
from django.conf.urls.static import static

# At the end of urlpatterns:
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## Database Migration

### 0002_customer_profile_image.py

```python
from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('customer', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customer',
            name='profile_image',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
```

---

## Integration Points

### In initAccountPage() function

```javascript
// Added at the beginning of initAccountPage():
function initAccountPage() {
    // Load user profile information
    loadUserProfile();
    
    // Setup profile image upload
    setupProfileImageUpload();
    
    // ... rest of the function
}
```

---

## Summary of Changes

| File | Type | Change |
|------|------|--------|
| `customer/models.py` | Model | Added profile_image field |
| `customer/views.py` | View | Added CustomerProfileImageAPI class |
| `customer/urls.py` | URL | Added profile-image route |
| `customer/serializers.py` | Serializer | Added profile_image field |
| `restapi/settings.py` | Config | Added MEDIA_URL and MEDIA_ROOT |
| `restapi/urls.py` | URL Config | Added static media serving |
| `customer/migrations/0002_*.py` | Migration | Database schema change |
| `account.html` | HTML | Added edit button and image IDs |
| `script.js` | JavaScript | Added 4 new functions, integrated into initAccountPage |

**Total Files Modified:** 9
**New Functions:** 4 (JavaScript) + 1 (API Class)
**New Fields:** 1 (Database model)
**Total Lines of Code Added:** ~400+
