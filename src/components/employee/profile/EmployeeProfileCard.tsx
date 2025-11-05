"use client";

import React from 'react';
import { Camera, User, IdCard, Calendar } from 'lucide-react';

interface EmployeeProfileCardProps {
  name: string;
  position: string;
  department: string;
  employeeId: string;
  joinedDate: string;
  specialization: string[];
  photo?: string;
  photoPreview?: string;
  isEditing: boolean;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function EmployeeProfileCard({
  name,
  position,
  department,
  employeeId,
  joinedDate,
  specialization,
  photo,
  photoPreview,
  isEditing,
  onPhotoChange,
}: EmployeeProfileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Photo Upload */}
      <div className="relative mb-6">
        <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative">
          {photoPreview || photo ? (
            <img
              src={photoPreview || photo}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-16 h-16 text-white" />
          )}
          {isEditing && (
            <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer hover:bg-opacity-60 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={onPhotoChange}
                className="hidden"
              />
            </label>
          )}
        </div>
        {isEditing && (
          <p className="text-xs text-gray-500 text-center mt-2">
            Click to upload photo
          </p>
        )}
      </div>

      {/* Name and Position */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-1">{name}</h2>
        <p className="text-blue-600 font-medium">{position}</p>
        <p className="text-gray-600 text-sm">{department}</p>
      </div>

      {/* Employee ID */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-center gap-2 text-sm">
          <IdCard className="w-4 h-4 text-blue-600" />
          <span className="text-gray-600">Employee ID:</span>
          <span className="font-bold text-gray-800">{employeeId}</span>
        </div>
      </div>

      {/* Joined Date */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
        <Calendar className="w-4 h-4" />
        <span>
          Joined{' '}
          {new Date(joinedDate).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Specializations */}
      <div>
        
      </div>
    </div>
  );
}
