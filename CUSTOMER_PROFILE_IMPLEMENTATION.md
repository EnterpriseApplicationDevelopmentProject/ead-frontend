# Customer Profile Page - Dynamic Implementation with Cloudinary Image Upload

## Overview
The customer profile page has been successfully updated to use real backend APIs instead of mock data. Profile images are now stored in Cloudinary cloud storage with automatic optimization and secure delivery.

## Changes Made

### 1. Created Customer Profile API Service (`src/lib/customerApi.ts`)
- **New file** implementing all customer profile API endpoints
- Functions implemented:
  - `getMyProfile()` - Fetch current user's profile
  - `updateMyProfile()` - Update current user's profile
  - `uploadMyProfileImage()` - **NEW:** Upload profile image to Cloudinary
  - `deleteMyProfileImage()` - **NEW:** Delete profile image from Cloudinary
  - `getProfileByUserId()` - Admin function to get profile by user ID
  - `getProfileByCustomerId()` - Admin function to get profile by customer ID
  - `updateProfileByUserId()` - Admin function to update profile by user ID
- Proper error handling with meaningful error messages
- Full TypeScript type safety with interfaces including `profileImageUrl` and `profileImagePublicId`

### 2. Updated Customer Type (`src/types/index.ts`)
- Added `userId?: number` - Backend user ID reference
- Added `phoneNumber?: string` - Backend uses phoneNumber field
- Added `photo?: string` - Profile photo URL or base64 data
- Maintains backward compatibility with existing code

### 3. Enhanced ProfileClient Component (`src/components/profile/ProfileClient.tsx`)
**Key Features:**
- Replaced mock API service with real backend API calls
- Added proper loading states
- Added comprehensive error handling and display
- Implemented data mapping between backend API format and frontend Customer type
- **NEW:** Photo upload now saves to Cloudinary via backend API
- **NEW:** Converts base64 preview to File object for upload
- **NEW:** Updates local state with Cloudinary HTTPS URL after successful upload
- Preserves local-only fields (NIC, address) that aren't in backend API

**Data Flow:**
1. Component loads → Calls `getMyProfile()` from backend
2. Backend response includes `profileImageUrl` from Cloudinary
3. User selects image → ProfileCard converts to base64 preview
4. User confirms → Image uploaded to Cloudinary via `uploadMyProfileImage()`
5. Backend returns secure HTTPS URL
6. Component updates state with new Cloudinary URL
7. Local fields (NIC, address) preserved in client state

### 4. Improved ProfileCard Component (`src/components/profile/ProfileCard.tsx`)
**Enhancements:**
- **NEW:** Upload progress indicator with spinner
- **NEW:** Real-time error display for upload failures
- **NEW:** File type validation (images only)
- **NEW:** File size validation (max 3MB)
- **NEW:** Async photo upload with loading state
- **NEW:** Automatic preview update with Cloudinary URL
- **NEW:** Error recovery - reverts to previous image on failure
- Shows Cloudinary-hosted image or placeholder camera icon
- Disabled upload button during processing

### 5. Backend API Enhancements

#### a. Database Schema Updates
**Customer Entity** (`model/entity/Customer.java`):
- Added `profileImageUrl` (VARCHAR 500) - Cloudinary HTTPS URL
- Added `profileImagePublicId` (VARCHAR 255) - For image deletion

#### b. DTO Updates
**CustomerProfileDTO** (`dto/CustomerProfileDTO.java`):
- Added `profileImageUrl` field
- Added `profileImagePublicId` field

#### c. Service Layer
**CloudinaryService** (`service/CloudinaryService.java`):
- Enhanced to support custom subfolders
- `uploadImage(file, "customers")` for profile images
- Images stored in `ead-automobile/customers/` folder

**CustomerProfileService** (`service/impl/CustomerProfileServiceImpl.java`):
- `uploadProfileImage()` - Uploads image and deletes old one
- `deleteProfileImage()` - Removes image from Cloudinary
- Automatic cleanup of old images on update

#### d. New Controller Endpoints
**CustomerProfileController** (`controller/CustomerProfileController.java`):
- `POST /api/customer/profile/me/image` - Upload/update profile image
- `DELETE /api/customer/profile/me/image` - Delete profile image

### 6. Improved ProfileForm Component (`src/components/profile/ProfileForm.tsx`)
**Enhancements:**
- Split "Customer Name" into separate "First Name" and "Last Name" fields (as per backend API)
- Added required field indicators (*)
- Added validation for phone number (10-15 digits as per API)
- Added success/error message displays
- Added helpful hints for each field
- Marked local-only fields (NIC, Address) to inform users they're stored locally
- Email field properly marked as read-only with explanation
- Improved button text and disabled states

## Backend API Integration

### Endpoints Used
- `GET /api/customer/profile/me` - Fetch profile
- `PUT /api/customer/profile/me` - Update profile

### Authentication
- Uses JWT token from `localStorage` via `apiClient.ts`
- Automatic token injection in request headers
- Automatic redirect to login on 401 errors

### Field Mapping

| Frontend Field | Backend Field | Notes |
|----------------|---------------|-------|
| firstName | firstName | Required, synced to backend |
| lastName | lastName | Required, synced to backend |
| phone/phoneNumber | phoneNumber | Optional, 10-15 digits, synced to backend |
| email | email | Read-only, cannot be changed |
| nic | - | Local only, not synced to backend |
| address | - | Local only, not synced to backend |
| photo | profileImageUrl | **Synced to Cloudinary cloud storage** |
| userId | userId | Backend reference, read-only |

## Features Preserved

✅ Photo upload and preview (**NOW CLOUDINARY CLOUD STORAGE**)
✅ Form validation
✅ Loading states
✅ Profile update functionality
✅ Responsive layout (mobile/desktop)
✅ Visual design and styling
✅ User experience flow

## New Features Added

✅ **Cloudinary Image Upload** - Profile photos stored in cloud
✅ **Automatic Image Optimization** - 800x600 max, auto quality
✅ **Secure HTTPS URLs** - All images served securely
✅ **Image Upload Progress** - Visual feedback during upload
✅ **Upload Error Handling** - Graceful failure recovery
✅ Real-time error display with backend error messages
✅ Success notification after profile update
✅ Proper validation feedback (phone number format)
✅ Clear indication of which fields are synced vs local-only
✅ Required field indicators
✅ Field-level help text
✅ **File Size Validation** - Client-side 3MB limit check
✅ **File Type Validation** - Images only

## Error Handling

### Network Errors
- Displayed in red alert box at top of form
- User-friendly error messages
- Preserves user input on error

### Validation Errors
- Backend validation errors shown to user
- HTML5 form validation for client-side checks
- Pattern validation for phone numbers

### Loading States
- Loading indicator while fetching profile
- Disabled button with "Updating..." text during save
- Prevents duplicate submissions

## Testing Checklist

- [ ] Profile loads successfully on page load
- [ ] Profile image loads from Cloudinary if exists
- [ ] Loading indicator shows while fetching data
- [ ] User data displays correctly in form fields
- [ ] First name and last name are separate and editable
- [ ] Email field is disabled and shows current email
- [ ] Phone number accepts 10-15 digits
- [ ] **Photo upload shows progress spinner**
- [ ] **Photo uploads successfully to Cloudinary**
- [ ] **Photo URL updates after successful upload**
- [ ] **Upload error shows if file too large (>3MB)**
- [ ] **Upload error shows if invalid file type**
- [ ] **Photo preview reverts on upload error**
- [ ] Update button triggers save operation
- [ ] Success message appears after successful update
- [ ] Error message appears on failed update
- [ ] Photo upload works and previews correctly
- [ ] Local fields (NIC, address) are preserved after backend sync
- [ ] Responsive layout works on mobile and desktop
- [ ] Authentication errors redirect to login page
- [ ] **Old profile image is deleted when uploading new one**
- [ ] **Profile image loads from HTTPS Cloudinary URL**

## Known Limitations

1. **Local-Only Fields**: NIC and address are stored only in component state and will be lost on page refresh. Consider implementing localStorage persistence if needed.

2. **Email Change**: Cannot change email through this interface (as per backend API design).

3. **Password Change**: Not available in profile form (use separate password change flow).

4. **Image File Size**: Client validates 3MB max, but backend may have different limits (check Cloudinary settings).

5. **Image Formats**: Supports JPEG, PNG, GIF, WebP. Other formats will be rejected.

## Future Enhancements

### Potential Improvements:
1. **localStorage Persistence**: Save local-only fields (NIC, address) to localStorage
2. **Image Cropping**: Add crop tool before upload for better framing
3. **Multiple Image Sizes**: Generate thumbnail and full-size versions
4. **Image Filters**: Apply filters/effects before upload
5. **Background Removal**: Automatic background removal for profile photos
6. **Face Detection**: Auto-center on detected faces
7. **Validation Enhancement**: Add more sophisticated client-side validation
8. **Loading Skeleton**: Replace loading text with skeleton UI
9. **Confirmation Dialog**: Ask for confirmation before updating
10. **Change History**: Show audit log of profile changes if backend provides it
11. **Image Compression**: Client-side compression before upload to reduce bandwidth
12. **Drag & Drop**: Support drag-and-drop image upload

## Files Modified

### Frontend - Created
- ✨ `src/lib/customerApi.ts` - Customer profile API service with image upload

### Frontend - Modified
- 📝 `src/types/index.ts` - Updated Customer interface with photo field
- 📝 `src/components/profile/ProfileClient.tsx` - Integrated real API with Cloudinary upload
- 📝 `src/components/profile/ProfileCard.tsx` - Enhanced with upload progress and validation

### Frontend - Unchanged
- ✅ `src/app/customer/profile/page.tsx` - No changes needed
- ✅ `src/components/profile/ProfileForm.tsx` - Updated with better UX

### Backend - Modified
- 📝 `model/entity/Customer.java` - Added profileImageUrl and profileImagePublicId
- 📝 `dto/CustomerProfileDTO.java` - Added image fields
- 📝 `service/CustomerProfileService.java` - Added uploadProfileImage and deleteProfileImage methods
- 📝 `service/impl/CustomerProfileServiceImpl.java` - Implemented image upload/delete logic
- 📝 `service/CloudinaryService.java` - Enhanced to support custom subfolders
- 📝 `controller/CustomerProfileController.java` - Added image upload endpoints

### Backend - Created
- ✨ `DATABASE_MIGRATION_PROFILE_IMAGE.sql` - Database migration script
- ✨ `PROFILE_IMAGE_UPLOAD_API.md` - Comprehensive API documentation

## Environment Setup

Ensure the following environment variables are set:

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Backend (Cloudinary)
```properties
cloudinary.cloud-name=your-cloud-name
cloudinary.api-key=your-api-key
cloudinary.api-secret=your-api-secret
```

**PowerShell:**
```powershell
$env:CLOUDINARY_CLOUD_NAME="your-cloud-name"
$env:CLOUDINARY_API_KEY="your-api-key"
$env:CLOUDINARY_API_SECRET="your-api-secret"
```

## Testing the Integration

1. **Run Database Migration**: Execute `DATABASE_MIGRATION_PROFILE_IMAGE.sql`
2. **Configure Cloudinary**: Set environment variables (see above)
3. **Start Backend**: Ensure backend API is running on `http://localhost:8080`
4. **Start Frontend**: Run Next.js development server
5. **Login as Customer**: Use customer credentials to get valid JWT token
6. **Navigate to Profile**: Go to `/customer/profile`
7. **Verify Load**: Profile should load with backend data and existing image (if any)
8. **Test Upload**: Click camera icon, select image, verify upload progress
9. **Verify Save**: Check success message and image appears from Cloudinary URL
10. **Check Cloudinary**: Log into Cloudinary dashboard to see uploaded image in `ead-automobile/customers/` folder

## Support

For backend API documentation, see:
- `CUSTOMER_PROFILE_API.md` - Profile data endpoints
- `PROFILE_IMAGE_UPLOAD_API.md` - Image upload endpoints (NEW)
- `CLOUDINARY_SETUP.md` - Cloudinary configuration

For issues or questions:
1. Check browser console for error details
2. Verify backend API is accessible
3. Confirm JWT token is valid
4. Check network tab for API responses
5. Verify Cloudinary credentials are correct
6. Check Cloudinary dashboard for upload status
7. Review backend logs for image upload errors
