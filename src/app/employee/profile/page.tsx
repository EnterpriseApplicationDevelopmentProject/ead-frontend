"use client";

import React, { useState, useEffect } from 'react';
import { Edit2, Save, X } from 'lucide-react';
import EmployeeProfileCard from '@/components/employee/profile/EmployeeProfileCard';
import EmployeeProfileForm from '@/components/employee/profile/EmployeeProfileForm';
import EmployeeStatsCard from '@/components/employee/profile/EmployeeStatsCard';

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  employeeId: string;
  position: string;
  department: string;
  joinedDate: string;
  specialization: string[];
  photo?: string;
}

export default function EmployeeProfilePage() {
  const [profile, setProfile] = useState<EmployeeProfile>({
    id: '1',
    name: 'Mike Wilson',
    email: 'employee@automobile.com',
    phone: '+1 234-567-8903',
    address: '789 Oak Street, Springfield, IL 62701',
    employeeId: 'EMP-2024-001',
    position: 'Senior Technician',
    department: 'Service Department',
    joinedDate: '2022-03-15',
    specialization: ['Engine Repair', 'Brake Systems', 'Electrical Systems', 'Diagnostics'],
    photo: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editedProfile, setEditedProfile] = useState<EmployeeProfile>(profile);

  useEffect(() => {
    // Load profile from localStorage or API
    const savedProfile = localStorage.getItem('employeeProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setProfile(parsed);
      setEditedProfile(parsed);
      if (parsed.photo) {
        setPhotoPreview(parsed.photo);
      }
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        setEditedProfile({ ...editedProfile, photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProfile(profile);
    setPhotoPreview(profile.photo || '');
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setProfile(editedProfile);
    localStorage.setItem('employeeProfile', JSON.stringify(editedProfile));
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleInputChange = (field: keyof EmployeeProfile, value: string) => {
    setEditedProfile({ ...editedProfile, [field]: value });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your personal and professional information</p>
        </div>
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Photo and Basic Info */}
        <div className="lg:col-span-1">
          <EmployeeProfileCard
            name={editedProfile.name}
            position={editedProfile.position}
            department={editedProfile.department}
            employeeId={editedProfile.employeeId}
            joinedDate={editedProfile.joinedDate}
            specialization={editedProfile.specialization}
            photo={editedProfile.photo}
            photoPreview={photoPreview}
            isEditing={isEditing}
            onPhotoChange={handlePhotoChange}
          />
        
          {/* <div className="mt-6">
            <EmployeeStatsCard />
          </div> */}
        </div>
        

        {/* Right Column - Detailed Information */}
        <div className="lg:col-span-2">
          <EmployeeProfileForm
            profile={isEditing ? editedProfile : profile}
            isEditing={isEditing}
            onInputChange={handleInputChange}
          />

          
        </div>
      </div>
    </div>
  );
}
