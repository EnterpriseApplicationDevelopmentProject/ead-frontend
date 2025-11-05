"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Briefcase, CheckCircle, AlertCircle, Phone, Mail } from 'lucide-react';
import { getEmployeeAppointments, type Appointment } from '@/lib/api';

interface Project {
  id: string | number;
  projectName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleInfo: string;
  startDate: string;
  endDate: string;
  status: string;
  completionPercentage: number;
  services: string[];
}

export default function EmployeeAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'appointments' | 'projects'>('appointments');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appointmentsData = await getEmployeeAppointments();
        setAppointments(appointmentsData);

        // Mock projects data
        const mockProjects: Project[] = [
          {
            id: 1,
            projectName: 'Full Service Package - Toyota Camry',
            customerName: 'John Smith',
            customerPhone: '+1 234-567-8901',
            customerEmail: 'john.smith@email.com',
            vehicleInfo: '2020 Toyota Camry - ABC-1234',
            startDate: '2025-11-01',
            endDate: '2025-11-15',
            status: 'In Progress',
            completionPercentage: 65,
            services: ['Oil Change', 'Brake Service', 'Tire Rotation', 'Engine Diagnostics'],
          },
          {
            id: 2,
            projectName: 'Engine Overhaul - Honda Civic',
            customerName: 'Sarah Johnson',
            customerPhone: '+1 234-567-8902',
            customerEmail: 'sarah.j@email.com',
            vehicleInfo: '2018 Honda Civic - XYZ-5678',
            startDate: '2025-11-03',
            endDate: '2025-11-20',
            status: 'In Progress',
            completionPercentage: 35,
            services: ['Engine Repair', 'Transmission Check', 'Cooling System'],
          },
        ];
        setProjects(mockProjects);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status?: string) => {
    const statusLower = status?.toLowerCase() || 'not started';
    switch (statusLower) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'paused':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Appointments & Projects</h1>
        <p className="text-gray-600">View and manage your assigned appointments and ongoing projects</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'appointments'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>Appointments ({appointments.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 px-4 font-medium transition-colors relative ${
              activeTab === 'projects'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              <span>Projects ({projects.length})</span>
            </div>
          </button>
        </div>
      </div>

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div>
          {appointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Appointments</h3>
              <p className="text-gray-600">You don't have any assigned appointments at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {appointment.serviceName}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                        {appointment.status || 'Not Started'}
                      </span>
                    </div>
                  </div>

                  {/* Customer Info */}
                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{appointment.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{appointment.location}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span className="font-medium">Progress</span>
                      <span className="font-semibold text-blue-600">
                        {appointment.progressPercentage || 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${appointment.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Time Info */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>
                        <span className="font-semibold">{appointment.actualHours?.toFixed(1) || 0}h</span>
                        <span className="text-gray-500"> / {appointment.estimatedHours || 0}h</span>
                      </span>
                    </div>
                    {appointment.timerRunning && (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                        Timer Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div>
          {projects.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Projects</h3>
              <p className="text-gray-600">You don't have any assigned projects at the moment.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {project.projectName}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {project.completionPercentage}%
                      </div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                  </div>

                  {/* Vehicle Info */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{project.vehicleInfo}</span>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Customer</div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{project.customerName}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Contact</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{project.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{project.customerEmail}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Start Date</div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <Calendar className="w-4 h-4 text-green-600" />
                        {new Date(project.startDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">End Date</div>
                      <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <Calendar className="w-4 h-4 text-red-600" />
                        {new Date(project.endDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${project.completionPercentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Services List */}
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">
                      Included Services:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.services.map((service, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
