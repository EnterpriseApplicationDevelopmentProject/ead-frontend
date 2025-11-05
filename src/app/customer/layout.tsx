'use client';

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { usePathname } from "next/navigation";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Extract page title from pathname
  const getPageTitle = () => {
    if (pathname?.includes('/my-appointments')) return 'My Appointments';
    if (pathname?.includes('/my-projects')) return 'My Projects';
    if (pathname?.includes('/dashboard')) return 'Dashboard';
    if (pathname?.includes('/vehicles')) return 'My Vehicles';
    if (pathname?.includes('/profile')) return 'Profile';
    if (pathname?.includes('/chatbot')) return 'Chatbot';
    return 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Header title={getPageTitle()} />
      
      {/* Main Content Area with responsive margins */}
      <div className="lg:ml-64 xl:ml-72">
        <div className="pt-20 pr-6 pb-6 pl-6 lg:pt-24 lg:pr-8 lg:pb-4 lg:pl-8 xl:pt-24 xl:pr-12 xl:pb-2 xl:pl-4">
          {children}
        </div>
      </div>
    </div>
  );
}
