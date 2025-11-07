"use client";

import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Calendar, FolderKanban, TrendingUp, Activity } from 'lucide-react';
import { adminService } from '@/lib/adminService';

interface DashboardStats {
  totalCustomers: number;
  totalEmployees: number;
  totalAppointments: number;
  totalProjects: number;
  upcomingAppointments: number;
  ongoingProjects: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalEmployees: 0,
    totalAppointments: 0,
    totalProjects: 0,
    upcomingAppointments: 0,
    ongoingProjects: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data in parallel
        const [customers, employees, appointments, projects] = await Promise.all([
          adminService.getAllCustomers(),
          adminService.getAllEmployees(),
          adminService.getAllAppointments(),
          adminService.getAllProjects(),
        ]);

        // Calculate stats
        const upcomingCount = appointments.filter(
          (apt: any) => apt.status === 'UPCOMING' || apt.status === 'Upcoming'
        ).length;

        const ongoingCount = projects.filter(
          (proj: any) => proj.status === 'IN_PROGRESS' || proj.status === 'Ongoing'
        ).length;

        setStats({
          totalCustomers: customers.length,
          totalEmployees: employees.length,
          totalAppointments: appointments.length,
          totalProjects: projects.length,
          upcomingAppointments: upcomingCount,
          ongoingProjects: ongoingCount,
        });

        // Create recent activity from appointments and projects
        const recentItems: any[] = [];
        
        // Add recent appointments (last 5)
        appointments.slice(0, 5).forEach((apt: any) => {
          recentItems.push({
            type: 'appointment',
            title: `Appointment: ${apt.service}`,
            description: `Vehicle: ${apt.vehicleNo}`,
            date: apt.date,
            status: apt.status,
          });
        });

        // Add recent projects (last 5)
        projects.slice(0, 5).forEach((proj: any) => {
          recentItems.push({
            type: 'project',
            title: `Project: ${proj.name}`,
            description: proj.description,
            date: proj.startDate,
            status: proj.status,
          });
        });

        // Sort by date and take top 8
        recentItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRecentActivity(recentItems.slice(0, 8));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const statusLower = status?.toLowerCase() || '';
    if (statusLower.includes('completed')) return 'text-green-600';
    if (statusLower.includes('in progress') || statusLower.includes('in_progress')) return 'text-orange-600';
    if (statusLower.includes('assigned')) return 'text-blue-600';
    if (statusLower.includes('requesting')) return 'text-yellow-600';
    if (statusLower.includes('cancelled')) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your automobile service center</p>
      </div>
      
      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-600 text-sm font-medium">Total Customers</h3>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{stats.totalCustomers}</p>
          <p className="text-xs text-gray-500 mt-2">Registered customers</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-600 text-sm font-medium">Total Employees</h3>
            <Briefcase className="w-8 h-8 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{stats.totalEmployees}</p>
          <p className="text-xs text-gray-500 mt-2">Active staff members</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-600 text-sm font-medium">Appointments</h3>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{stats.totalAppointments}</p>
          <p className="text-xs text-gray-500 mt-2">
            {stats.upcomingAppointments} upcoming
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-600 text-sm font-medium">Projects</h3>
            <FolderKanban className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-purple-600">{stats.totalProjects}</p>
          <p className="text-xs text-gray-500 mt-2">
            {stats.ongoingProjects} ongoing
          </p>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium opacity-90">Upcoming Appointments</h3>
              <p className="text-3xl font-bold mt-2">{stats.upcomingAppointments}</p>
            </div>
            <TrendingUp className="w-12 h-12 opacity-80" />
          </div>
          <p className="text-xs opacity-75">Requires attention soon</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-medium opacity-90">Ongoing Projects</h3>
              <p className="text-3xl font-bold mt-2">{stats.ongoingProjects}</p>
            </div>
            <Activity className="w-12 h-12 opacity-80" />
          </div>
          <p className="text-xs opacity-75">Currently in progress</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </h2>
        {recentActivity.length === 0 ? (
          <p className="text-gray-500">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <div className={`p-2 rounded-lg ${
                  item.type === 'appointment' ? 'bg-orange-100' : 'bg-purple-100'
                }`}>
                  {item.type === 'appointment' ? (
                    <Calendar className="w-5 h-5 text-orange-600" />
                  ) : (
                    <FolderKanban className="w-5 h-5 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-500">{item.date}</span>
                    <span className={`text-xs font-semibold ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
