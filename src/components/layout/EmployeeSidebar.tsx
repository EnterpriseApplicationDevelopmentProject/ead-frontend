'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Calendar,
  User,
  Clock
} from 'lucide-react';

export default function EmployeeSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/employee/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      href: '/employee/progress',
      icon: ClipboardList,
      label: 'Service Progress',
    },
    {
      href: '/employee/appointments',
      icon: Calendar,
      label: 'Appointments & Requests',
    },
    {
      href: '/employee/time-logs',
      icon: Clock,
      label: 'Time Logs',
    },
    {
      href: '/employee/profile',
      icon: User,
      label: 'Profile',
    },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white fixed h-full shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-8 text-white">Employee Portal</h1>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
