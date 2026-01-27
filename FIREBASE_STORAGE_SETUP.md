# Firebase Storage Configuration

## Storage Rules Setup

To enable profile photo and project image uploads, you need to configure Firebase Storage rules in your Firebase Console.

### Steps to Configure:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `zestfolio-247`
3. Navigate to **Storage** in the left sidebar
4. Click on the **Rules** tab
5. Replace the existing rules with the following:

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload profile photos
    match /profile-photos/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
    
    // Allow authenticated users to upload project images
    match /project-images/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

### What These Rules Do:

- **Read Access**: Anyone can view uploaded images (public read)
- **Write Access**: Only authenticated users can upload to their own folders
- **File Size Limit**: Maximum 5MB per image
- **File Type**: Only image files are allowed (jpg, png, gif, etc.)
- **User Isolation**: Users can only upload to folders matching their UID

### Testing Upload Functionality:

After updating the rules:

1. Sign in to your application
2. Go to **Dashboard > Profile**
3. Try uploading a profile photo
4. Go to **Dashboard > Projects**
5. Try adding a project with an image

### Common Issues:

**Error: "Permission denied"**
- Make sure you're signed in
- Verify the Storage rules are published
- Check that the storage bucket name matches in `.env.local`

**Error: "File too large"**
- Ensure image is under 5MB
- Try compressing the image

**Error: "Invalid file type"**
- Only image files (jpg, png, gif, webp) are allowed
- Check the file extension

### Current Storage Bucket:
`zestfolio-247.firebasestorage.app`

---

## Features Implemented:

### Profile Photo Upload
- Location: `Dashboard > Profile`
- Max size: 5MB
- Supported formats: JPG, PNG, GIF, WebP
- Auto-save to Firestore

### Project Image Upload
- Location: `Dashboard > Projects`
- Max size: 5MB
- Supported formats: JPG, PNG, GIF, WebP
- Preview before saving
- Remove/replace functionality
- Displays in project cards

---

## Troubleshooting:

If uploads still fail after configuring rules:

1. **Check Browser Console**: Look for specific error messages
2. **Verify Authentication**: Ensure user is logged in
3. **Test Storage Connection**: 
   ```javascript
   // In browser console
   console.log(firebase.storage().ref().toString());
   ```
4. **Clear Cache**: Sometimes browser cache can cause issues
5. **Check Network Tab**: Look for failed requests to Firebase Storage

---

## Next Steps:

1. Configure the Firebase Storage rules as shown above
2. Test profile photo upload
3. Test project image upload
4. If issues persist, check the browser console for specific error messages
