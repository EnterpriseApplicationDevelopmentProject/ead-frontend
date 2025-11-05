"use client";

import React, { useEffect, useState } from 'react';
import { customerService } from '@/api/mockApiService';
import ProfileCard from '@/components/profile/ProfileCard';
import ProfileForm from '@/components/profile/ProfileForm';
import type { Customer } from '@/types';

export default function ProfileClient() {
  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      const c = await customerService.getProfile();
      if (!mounted) return;
      setCustomer(c);
    }
    load();
    return () => { mounted = false; };
  }, []);

  const handleSave = async (update: Partial<Customer>) => {
    const updated = await customerService.updateProfile(update);
    setCustomer({ ...updated });
  };

  const handlePhotoUpdate = async (photo: string) => {
    const updated = await customerService.updateProfile({ ...customer, photo } as any);
    setCustomer({ ...updated });
  };

  if (!customer) return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>;

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
