"use client";

import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { employeeService } from '@/lib/employeeService';
import { Appointment } from '@/types';

export default function EmployeeDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await employeeService.getMyAppointments();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats
  const totalAppointments = appointments.length;
  const inProgress = appointments.filter(a => {
    const status = a.status?.toLowerCase().replace('_', ' ');
    return status === 'in progress';
  }).length;
  const completedToday = appointments.filter(a => a.status?.toLowerCase() === 'completed').length;

  const getStatusBadge = (status?: string) => {
    const statusLower = status?.toLowerCase() || 'requesting';
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
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Employee Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Assigned Appointments</h3>
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{totalAppointments}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">In Progress</h3>
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{inProgress}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-600 text-sm font-medium">Completed</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{completedToday}</p>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Appointments</h2>
        
        {appointments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No appointments assigned yet.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div 
                key={appointment.id} 
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {appointment.serviceName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {appointment.date} {appointment.time && `at ${appointment.time}`}
                    </p>

                    {/* Time and Status */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(appointment.status)}`}>
                        {appointment.status || 'Not Started'}
                      </span>
                    </div>
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
