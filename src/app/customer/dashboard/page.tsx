'use client';

import { useEffect, useState } from 'react';
import { Car, Calendar, Briefcase, Clock, MapPin, DollarSign, User } from 'lucide-react';
import { dashboardService, customerService, appointmentService, projectService } from '@/api/mockApiService';
import type { Customer, Appointment, Project, DashboardStats } from '@/types';

export default function CustomerDashboard() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const customerData = await customerService.getProfile();
      setCustomer(customerData);

      const [statsData, appointmentsData, projectsData] = await Promise.all([
        dashboardService.getDashboardStats(customerData.id),
        appointmentService.getUpcomingAppointments(customerData.id),
        projectService.getOngoingProjects(customerData.id)
      ]);

      setStats(statsData);
      setUpcomingAppointments(appointmentsData);
      setOngoingProjects(projectsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {customer?.name}!</h1>
        <p className="text-gray-600">Here's what's happening with your vehicles and services</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">My Vehicles</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.totalVehicles || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming Appointments</p>
              <p className="text-3xl font-bold text-yellow-600">{stats?.upcomingAppointments || 0}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ongoing Projects</p>
              <p className="text-3xl font-bold text-green-600">{stats?.ongoingProjects || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Appointments Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upcoming Appointments</h2>
          <a href="/customer/my-appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All →
          </a>
        </div>
        
        {upcomingAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No upcoming appointments</p>
            <a href="/customer/appointments" className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium">
              Book an Appointment
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingAppointments.slice(0, 4).map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {appointment.serviceName}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        {appointment.vehicleNumber}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{appointment.time}</span>
                    </div>
                    {appointment.assignedEmployee && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{appointment.assignedEmployee}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Ongoing Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Ongoing Projects</h2>
          <a href="/customer/my-projects" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All →
          </a>
        </div>
        
        {ongoingProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No ongoing projects</p>
            <a href="/customer/projects" className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium">
              Create a Project
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ongoingProjects.slice(0, 4).map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">
                        {project.taskName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">{project.description}</p>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Car className="w-4 h-4" />
                        {project.vehicleNumber} - {project.vehicleType}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(project.status)}`}>
                      {project.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>Started: {formatDate(project.startDate)}</span>
                    </div>
                    {project.assignedEmployee && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{project.assignedEmployee}</span>
                      </div>
                    )}
                    {project.estimatedCost && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-green-600">${project.estimatedCost}</span>
                      </div>
                    )}
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