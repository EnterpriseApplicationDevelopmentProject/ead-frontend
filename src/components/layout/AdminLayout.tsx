'use client';

import UserProfileCard from './UserProfileCard';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        {/* Top Bar with User Profile */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-end items-center sticky top-0 z-10">
          <UserProfileCard useCurrentUser={true} />
        </div>
        
        {/* Main Content */}
        <div>{children}</div>
      </main>
    </div>
  );
}
