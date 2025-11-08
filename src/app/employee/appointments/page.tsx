"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Briefcase, CheckCircle, AlertCircle, Phone, Mail, Edit, X } from 'lucide-react';
import { employeeService, ProgressUpdateData } from '@/lib/employeeService';
import api from '@/lib/apiClient';
import { Appointment } from '@/types';

interface UpdateModalState {
  isOpen: boolean;
  appointment: Appointment | null;
}

export default function EmployeeAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateModal, setUpdateModal] = useState<UpdateModalState>({
    isOpen: false,
    appointment: null,
  });
  const [statusUpdate, setStatusUpdate] = useState('');
  const [progressData, setProgressData] = useState<ProgressUpdateData>({
    stage: '',
    percentage: 0,
    remarks: '',
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [appointmentsData, projectsData] = await Promise.all([
        employeeService.getMyAppointments(),
        employeeService.getMyProjects()
      ]);
      setAppointments(appointmentsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openUpdateModal = (appointment: Appointment) => {
    setUpdateModal({ isOpen: true, appointment });
    setStatusUpdate(appointment.status || 'PENDING');
    setProgressData({
      stage: '',
      percentage: 0,
      remarks: '',
    });
  };

  const closeUpdateModal = () => {
    setUpdateModal({ isOpen: false, appointment: null });
    setStatusUpdate('');
    setProgressData({ stage: '', percentage: 0, remarks: '' });
  };

  const handleUpdateAppointment = async () => {
    if (!updateModal.appointment) return;

    try {
      setUpdating(true);
      setError(null);

      // Update the appointment status directly
      const updateData = {
        service: updateModal.appointment.serviceName,
        customerId: updateModal.appointment.customerId,
        vehicleId: updateModal.appointment.vehicleId,
        vehicleNo: updateModal.appointment.vehicleNumber,
        date: updateModal.appointment.date,
        startTime: updateModal.appointment.time,
        endTime: updateModal.appointment.time, // Use same time as end time
        status: statusUpdate || updateModal.appointment.status || 'PENDING'
      };

      await api.put(`/appointments/${updateModal.appointment.id}`, updateData);

      // Refresh appointments
      await fetchData();
      closeUpdateModal();
      
      alert('Update successful!');
    } catch (error) {
      console.error('Error updating appointment:', error);
      setError('Failed to update appointment. Please try again.');
      alert('Failed to update appointment. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status?: string) => {
    const statusLower = status?.toLowerCase() || 'requesting';
    switch (statusLower) {
      case 'requesting':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
      case 'in progress':
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
          <p className="text-gray-600">Loading your assignments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">My Appointments & Projects</h1>
        <p className="text-gray-600">View and manage your assigned appointments and projects</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Appointments and Projects List */}
      <div>
        {appointments.length === 0 && projects.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Assignments</h3>
            <p className="text-gray-600">You don't have any assigned appointments or projects at the moment.</p>
          </div>
        ) : (
          <>
            {/* Appointments Section */}
            {appointments.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-800">Appointments</h2>
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
                            {appointment.status || 'PENDING'}
                          </span>
                        </div>
                        <button
                          onClick={() => openUpdateModal(appointment)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Update Status"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Appointment Info */}
                      <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Customer: {appointment.customerName || 'Customer'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <span>Vehicle: {appointment.vehicleNumber}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {projects.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-gray-800">Projects</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 mb-1">
                            {project.taskName}
                          </h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(project.status)}`}>
                            {project.status || 'PLANNED'}
                          </span>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600">{project.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Start: {project.startDate}</span>
                        </div>
                        {project.completedDate && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span>End: {project.completedDate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Update Modal */}
      {updateModal.isOpen && updateModal.appointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Update Appointment</h3>
              <button
                onClick={closeUpdateModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                {updateModal.appointment.serviceName}
              </h4>
              <p className="text-sm text-gray-600">
                {updateModal.appointment.date} at {updateModal.appointment.time}
              </p>
            </div>

            {/* Status Update */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={statusUpdate}
                onChange={(e) => setStatusUpdate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Progress Update */}
            <div className="space-y-4 mb-6">
              <h4 className="font-medium text-gray-700">Add Progress Update</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stage
                </label>
                <input
                  type="text"
                  value={progressData.stage}
                  onChange={(e) => setProgressData({ ...progressData, stage: e.target.value })}
                  placeholder="e.g., Diagnosis, Repair, Testing"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Progress Percentage: {progressData.percentage}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressData.percentage}
                  onChange={(e) => setProgressData({ ...progressData, percentage: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <textarea
                  value={progressData.remarks}
                  onChange={(e) => setProgressData({ ...progressData, remarks: e.target.value })}
                  placeholder="Add any notes or comments..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={closeUpdateModal}
                disabled={updating}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateAppointment}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
