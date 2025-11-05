"use client";

import React, { useState, useEffect } from 'react';
import { User, LogOut, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserProfileCardProps {
  pictureSrc?: string;
  pictureAlt?: string;
  userName?: string;
  userRole?: string;
  useCurrentUser?: boolean;
}

export default function UserProfileCard({
  pictureSrc,
  pictureAlt = 'User Profile',
  userName,
  userRole,
  useCurrentUser = true,
}: UserProfileCardProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
    role: string;
    photo?: string;
  } | null>(null);

  useEffect(() => {
    if (useCurrentUser) {
      // Get user from localStorage
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          setCurrentUser(user);
        } catch (error) {
          console.error('Error parsing user:', error);
        }
      }
    }
  }, [useCurrentUser]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    router.push('/auth/login');
  };

  const displayName = userName || currentUser?.name || 'User';
  const displayRole = userRole || currentUser?.role || 'Guest';
  const displayPhoto = pictureSrc || currentUser?.photo;

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200"
      >
        {/* Profile Picture */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          {displayPhoto ? (
            <img
              src={displayPhoto}
              alt={pictureAlt}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-6 h-6 text-white" />
          )}
        </div>

        {/* User Info */}
        <div className="text-left hidden sm:block">
          <p className="text-sm font-semibold text-gray-800">{displayName}</p>
          <p className="text-xs text-gray-500 capitalize">{displayRole}</p>
        </div>

        {/* Dropdown Icon */}
        <ChevronDown
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop to close dropdown */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown Content */}
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            {/* User Info Section */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {displayPhoto ? (
                    <img
                      src={displayPhoto}
                      alt={pictureAlt}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-7 h-7 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {displayName}
                  </p>
                  {currentUser?.email && (
                    <p className="text-xs text-gray-500">{currentUser.email}</p>
                  )}
                  <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium capitalize">
                    {displayRole}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
