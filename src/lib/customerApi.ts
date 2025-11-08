import { api } from './apiClient';

/**
 * Customer Profile API Response from Backend
 */
export interface CustomerProfileResponse {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl?: string;
  profileImagePublicId?: string;
}

/**
 * Customer Profile Update Request
 */
export interface CustomerProfileUpdateRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

/**
 * Get the profile of the currently authenticated customer
 */
export async function getMyProfile(): Promise<CustomerProfileResponse> {
  try {
    const response = await api.get<CustomerProfileResponse>('/customer/profile/me');
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch profile'
    );
  }
}

/**
 * Update the profile of the currently authenticated customer
 */
export async function updateMyProfile(
  profileData: CustomerProfileUpdateRequest
): Promise<CustomerProfileResponse> {
  try {
    const response = await api.put<CustomerProfileResponse>(
      '/customer/profile/me',
      profileData
    );
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to update profile'
    );
  }
}

/**
 * Upload profile image for the currently authenticated customer
 */
export async function uploadMyProfileImage(imageFile: File): Promise<CustomerProfileResponse> {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post<CustomerProfileResponse>(
      '/customer/profile/me/image',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to upload profile image'
    );
  }
}

/**
 * Delete profile image for the currently authenticated customer
 */
export async function deleteMyProfileImage(): Promise<CustomerProfileResponse> {
  try {
    const response = await api.delete<CustomerProfileResponse>('/customer/profile/me/image');
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to delete profile image'
    );
  }
}

/**
 * Get profile by user ID (Admin use)
 */
export async function getProfileByUserId(userId: number): Promise<CustomerProfileResponse> {
  try {
    const response = await api.get<CustomerProfileResponse>(`/customer/profile/user/${userId}`);
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch profile'
    );
  }
}

/**
 * Get profile by customer ID (Admin use)
 */
export async function getProfileByCustomerId(customerId: number): Promise<CustomerProfileResponse> {
  try {
    const response = await api.get<CustomerProfileResponse>(`/customer/profile/${customerId}`);
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch profile'
    );
  }
}

/**
 * Update profile by user ID (Admin use)
 */
export async function updateProfileByUserId(
  userId: number,
  profileData: CustomerProfileUpdateRequest
): Promise<CustomerProfileResponse> {
  try {
    const response = await api.put<CustomerProfileResponse>(
      `/customer/profile/user/${userId}`,
      profileData
    );
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to update profile'
    );
  }
}
