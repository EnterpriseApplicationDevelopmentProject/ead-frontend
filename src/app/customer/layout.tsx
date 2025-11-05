'use client';

import CustomerSidebar from "@/components/layout/CustomerSidebar";
import UserProfileCard from "@/components/layout/UserProfileCard";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CustomerSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Top Bar with User Profile - Sticky */}
        <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex justify-end">
            <UserProfileCard useCurrentUser={true} />
          </div>
        </div>
        
        {/* Page Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
