"use client";

import ProfileClient from "../../../components/profile/ProfileClient";



export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Profile</h2>
      </div>

      <ProfileClient />
    </div>
  );
}
