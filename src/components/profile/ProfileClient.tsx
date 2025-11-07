"use client";

import React, { useEffect, useState } from 'react';
import { getMyProfile, updateMyProfile, uploadMyProfileImage, CustomerProfileResponse } from '@/lib/customerApi';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileForm from '@/components/profile/ProfileForm';
import type { Customer } from '@/types';

/**
 * Maps backend CustomerProfileResponse to frontend Customer type
 */
function mapProfileToCustomer(profile: CustomerProfileResponse): Customer {
  return {
    id: String(profile.id),
    userId: profile.userId,
    name: `${profile.firstName} ${profile.lastName}`,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phoneNumber || '',
    phoneNumber: profile.phoneNumber,
    address: '', // Not provided by backend profile API
    nic: '', // Not provided by backend profile API
    joinedDate: new Date().toISOString(), // Not provided by backend profile API
    photo: profile.profileImageUrl, // Cloudinary URL
  };
}

export default function ProfileClient() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);
        const profile = await getMyProfile();
        
        if (!mounted) return;
        
        const customerData = mapProfileToCustomer(profile);
        setCustomer(customerData);
      } catch (err: any) {
        if (!mounted) return;
        console.error('Failed to load profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }
    
    loadProfile();
    
    return () => { 
      mounted = false; 
    };
  }, []);

  const handleSave = async (update: Partial<Customer>) => {
    if (!customer) return;
    
    try {
      // Map frontend Customer fields to backend API format
      const updateRequest = {
        firstName: update.firstName || customer.firstName || '',
        lastName: update.lastName || customer.lastName || '',
        phoneNumber: update.phone || update.phoneNumber || customer.phone,
      };
      
      const updatedProfile = await updateMyProfile(updateRequest);
      const updatedCustomer = mapProfileToCustomer(updatedProfile);
      
      // Preserve fields not in the backend response
      setCustomer({
        ...updatedCustomer,
        address: update.address || customer.address,
        nic: update.nic || customer.nic,
        photo: customer.photo,
      });
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      throw new Error(err.message || 'Failed to update profile');
    }
  };

  const handlePhotoUpdate = async (photo: string) => {
    if (!customer) return;
    
    try {
      // Convert base64 to File object
      const response = await fetch(photo);
      const blob = await response.blob();
      const file = new File([blob], 'profile-image.jpg', { type: blob.type });
      
      // Upload to Cloudinary via backend
      const updatedProfile = await uploadMyProfileImage(file);
      const updatedCustomer = mapProfileToCustomer(updatedProfile);
      
      // Update local state with Cloudinary URL
      setCustomer({
        ...updatedCustomer,
        address: customer.address,
        nic: customer.nic,
      });
    } catch (err: any) {
      console.error('Failed to upload profile image:', err);
      throw new Error(err.message || 'Failed to upload profile image');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          <p className="font-semibold mb-2">Error loading profile</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">No profile data available</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Left side - Photo Upload */}
      <div className="lg:col-span-1">
        <ProfileCard customer={customer} onPhotoUpdate={handlePhotoUpdate} />
      </div>
      
      {/* Right side - Form */}
      <div className="lg:col-span-3">
        <ProfileForm customer={customer} onSave={handleSave} />
      </div>
    </div>
  );
}
