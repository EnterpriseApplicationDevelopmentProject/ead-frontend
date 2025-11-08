'use client';

import { useEffect, useState } from 'react';
import { Car, Calendar, Briefcase, Clock, MapPin, DollarSign, User, RefreshCw, XCircle ,MessageCircle} from 'lucide-react';
import { dashboardService } from '@/lib/api/dashboardService';
import { appointmentService, type Appointment } from '@/lib/api/appointmentService';
import { projectService, type Project } from '@/lib/api/projectService';
import type { DashboardStats } from '@/types/dashboard.types';
import ChatbotWidget from '@/components/chat/ChatbotWidget';

export default function CustomerDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [requestingAppointments, setRequestingAppointments] = useState<Appointment[]>([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [requestingProjects, setRequestingProjects] = useState<Project[]>([]);
  const [upcomingProjects, setUpcomingProjects] = useState<Project[]>([]);
  const [ongoingProjects, setOngoingProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem('auth_user');
        if (raw) {
          const parsed = JSON.parse(raw);
          const id = parsed?.id || parsed?.customerId || parsed?._id || null;
          if (id) setCustomerId(String(id));
        }
      }
    } catch (_) {}
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading dashboard data...'); // Debug log

      // Fetch dashboard data in parallel
      const [statsData, appointmentsData, projectsData] = await Promise.all([
        dashboardService.getDashboardStats(),
        appointmentService.getAllAppointments(),
        projectService.getAllProjects()
      ]);

      console.log('Dashboard stats:', statsData); // Debug log
      console.log('All appointments:', appointmentsData); // Debug log
      console.log('All projects:', projectsData); // Debug log

      // Filter appointments by status
      const requesting = appointmentsData.filter(apt => 
        apt.status.toLowerCase() === 'requesting'
      ).slice(0, 4);
      
      const upcoming = appointmentsData.filter(apt => 
        apt.status.toLowerCase() === 'assigned'
      ).slice(0, 4);

      // Filter projects by status
      const requestingProj = projectsData.filter(proj => 
        proj.status.toLowerCase() === 'requesting'
      ).slice(0, 4);
      
      const upcomingProj = projectsData.filter(proj => 
        proj.status.toLowerCase() === 'assigned'
      ).slice(0, 4);
      
      const ongoing = projectsData.filter(proj => 
        proj.status.toLowerCase() === 'in_progress' || proj.status.toLowerCase() === 'in progress'
      ).slice(0, 4);

      setStats(statsData);
      setRequestingAppointments(requesting);
      setUpcomingAppointments(upcoming);
      setRequestingProjects(requestingProj);
      setUpcomingProjects(upcomingProj);
      setOngoingProjects(ongoing);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
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
      case 'requesting':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
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

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadDashboardData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold mb-2">Customer Dashboard</h1>
          <p className="text-gray-600">Here's what's happening with your vehicles and services</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <p className="text-3xl font-bold text-blue-600">{stats?.upcomingAppointments || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Ongoing Projects</p>
              <p className="text-3xl font-bold text-blue-600">{stats?.ongoingProjects || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cancelled</p>
              <p className="text-3xl font-bold text-red-600">{stats?.cancelledAppointments || 0}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Requesting Appointments Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Requesting Appointments</h2>
          <a href="/customer/my-appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All →
          </a>
        </div>
        
        {requestingAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No requesting appointments</p>
            <a href="/customer/my-appointments/book" className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium">
              Book an Appointment
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requestingAppointments.map((appointment) => (
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Requesting Projects Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Requesting Projects</h2>
          <a href="/customer/my-projects" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All →
          </a>
        </div>
        
        {requestingProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No requesting projects</p>
            <a href="/customer/my-projects" className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium">
              Create a Project
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requestingProjects.map((project) => (
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
                    {project.endDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>End: {formatDate(project.endDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Projects Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upcoming Projects</h2>
          <a href="/customer/my-projects" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            View All →
          </a>
        </div>
        
        {upcomingProjects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No upcoming projects</p>
            <a href="/customer/my-projects" className="inline-block mt-3 text-blue-600 hover:text-blue-800 font-medium">
              Create a Project
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingProjects.map((project) => (
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
                    {project.endDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>End: {formatDate(project.endDate)}</span>
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
                    {project.endDate && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>End: {formatDate(project.endDate)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700"
        aria-label="Open chat"
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Popup Modal (kept mounted to preserve history) */}
      <div
        className={`fixed inset-0 z-50 transition-opacity ${isChatOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!isChatOpen}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsChatOpen(false)}
        />
        <div className="absolute bottom-20 right-6 w-[360px] h-[520px] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
            <div className="font-semibold text-gray-800">Assistant</div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <ChatbotWidget customerId={customerId ?? undefined} />
          </div>
        </div>
      </div>
    </div>
  );
}