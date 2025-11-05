'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Users, 
  Calendar,
  Briefcase,
  Settings,
  Wrench,
  UserCog
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      href: '/admin/customers',
      icon: Users,
      label: 'Customers',
    },
    {
      href: '/admin/employees',
      icon: UserCog,
      label: 'Employees',
    },
    {
      href: '/admin/appointments',
      icon: Calendar,
      label: 'Appointments',
    },
    {
      href: '/admin/projects',
      icon: Briefcase,
      label: 'Projects',
    },
    {
      href: '/admin/services',
      icon: Wrench,
      label: 'Services',
    },
    {
      href: '/admin/settings',
      icon: Settings,
      label: 'Settings',
    },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white fixed h-full shadow-lg">
      <div className="p-6">
        <h1 className="text-xl font-bold mb-8 text-white">Admin Portal</h1>
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
