"use client";

import React from 'react';
import { User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

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

interface EmployeeProfileFormProps {
  profile: EmployeeProfile;
  isEditing: boolean;
  onInputChange: (field: keyof EmployeeProfile, value: string) => void;
}

export default function EmployeeProfileForm({
  profile,
  isEditing,
  onInputChange,
}: EmployeeProfileFormProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-6 pb-3 border-b border-gray-200">
        Personal Information
      </h3>

      <div className="space-y-6">
        {/* Full Name */}
        <div>
          {isEditing ? (
            <div className="relative">
              <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                value={profile.name}
                onChange={(e) => onInputChange('name', e.target.value)}
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <User className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <span className="text-xs text-gray-500 block">Full Name</span>
                <span className="text-gray-800 font-medium">{profile.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Email */}
        <div>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg cursor-not-allowed">
            <Mail className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <span className="text-xs text-gray-500 block">Email Address</span>
              <span className="text-gray-600">{profile.email}</span>
            </div>
            <span className="text-xs text-gray-500 italic">Cannot be changed</span>
          </div>
        </div>

        {/* Phone */}
        <div>
          {isEditing ? (
            <div className="relative">
              <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                placeholder="Phone Number"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <span className="text-xs text-gray-500 block">Phone Number</span>
                <span className="text-gray-800 font-medium">{profile.phone}</span>
              </div>
            </div>
          )}
        </div>

        {/* Address */}
        <div>
          {isEditing ? (
            <div className="relative">
              <MapPin className="w-5 h-5 text-gray-400 absolute left-3 top-3" />
              <textarea
                value={profile.address}
                onChange={(e) => onInputChange('address', e.target.value)}
                placeholder="Address"
                rows={3}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
          ) : (
            <div className="flex items-start gap-3 px-4 py-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <span className="text-xs text-gray-500 block">Address</span>
                <span className="text-gray-800 font-medium">{profile.address}</span>
              </div>
            </div>
          )}
        </div>

        {/* Position */}
        <div>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg cursor-not-allowed">
            <Briefcase className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <span className="text-xs text-gray-500 block">Position</span>
              <span className="text-gray-600">{profile.position}</span>
            </div>
            <span className="text-xs text-gray-500 italic">Managed by HR</span>
          </div>
        </div>

        {/* Department */}
        <div>
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 rounded-lg cursor-not-allowed">
            <Briefcase className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <span className="text-xs text-gray-500 block">Department</span>
              <span className="text-gray-600">{profile.department}</span>
            </div>
            <span className="text-xs text-gray-500 italic">Managed by HR</span>
          </div>
        </div>
      </div>
    </div>
  );
}
