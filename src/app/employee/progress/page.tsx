'use client';

import { useState, useEffect } from 'react';
import { 
  Clock, 
  CheckCircle, 
  ClipboardList
} from 'lucide-react';
import { AppointmentProgress, ProgressUpdate, TimeLog } from '@/types/progress.types';
import {
  getEmployeeAppointments,
  logTime,
  updateProgress,
  type Appointment
} from '@/lib/api';

// Modal Components
function UpdateStatusModal({ 
  isOpen, 
  onClose, 
  appointment, 
  onUpdate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  appointment: AppointmentProgress | null;
  onUpdate: (data: ProgressUpdate) => Promise<void>;
}) {
  const [stage, setStage] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      setStage(appointment.status);
      setPercentage(appointment.progressPercentage);
      setRemarks(appointment.latestRemarks || '');
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (percentage < 0 || percentage > 100) {
      alert('Percentage must be between 0 and 100');
      return;
    }
    setLoading(true);
    try {
      await onUpdate({ stage, percentage, remarks });
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Update Progress Status</h2>
        <p className="text-sm text-gray-600 mb-4">{appointment.serviceName}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select status</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Progress Percentage (0-100)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes or comments..."
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LogTimeModal({ 
  isOpen, 
  onClose, 
  appointment, 
  onLog 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  appointment: AppointmentProgress | null;
  onLog: (data: TimeLog) => Promise<void>;
}) {
  const [hours, setHours] = useState(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hours <= 0) {
      alert('Hours must be greater than 0');
      return;
    }
    setLoading(true);
    try {
      await onLog({ hours, description });
      setHours(0);
      setDescription('');
      onClose();
    } catch (error) {
      console.error('Failed to log time:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Log Work Time</h2>
        <p className="text-sm text-gray-600 mb-4">{appointment.serviceName}</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hours Worked
            </label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={hours || ''}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., 1.5"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What work was completed?"
              required
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Logging...' : 'Log Time'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Service Card Component
function ServiceProgressCard({ 
  appointment, 
  onLogTime, 
  onUpdateStatus 
}: {
  appointment: AppointmentProgress;
  onLogTime: (appointment: AppointmentProgress) => void;
  onUpdateStatus: (appointment: AppointmentProgress) => void;
}) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'requesting':
        return 'bg-yellow-500';
      case 'assigned':
        return 'bg-blue-500';
      case 'in progress':
        return 'bg-orange-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getTagColor = (tag: string) => {
    return tag.toLowerCase() === 'appointment' 
      ? 'bg-purple-100 text-purple-700'
      : 'bg-blue-100 text-blue-700';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">
            {appointment.serviceName}
          </h3>
          <p className="text-sm text-gray-600">{appointment.location}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTagColor(appointment.tag)}`}>
          {appointment.tag}
        </span>
      </div>

      {/* Customer */}
      <p className="text-sm text-gray-700 mb-4">
        <span className="font-medium">Customer:</span> {appointment.customerName}
      </p>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-800">{appointment.progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-900 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${appointment.progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Time Progress */}
      <p className="text-sm text-gray-600 mb-4">
        <Clock className="inline w-4 h-4 mr-1" />
        <span className="font-medium">{appointment.hoursLogged.toFixed(2)}h</span> / {appointment.estimatedHours}h
      </p>

      {/* Status */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-2.5 h-2.5 rounded-full ${getStatusColor(appointment.status)}`}></div>
        <span className="text-sm font-medium capitalize text-gray-700">
          {appointment.status}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onLogTime(appointment)}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition flex items-center justify-center gap-2"
          title="Log Time"
        >
          <Clock className="w-4 h-4" />
          Log Time
        </button>

        <button
          onClick={() => onUpdateStatus(appointment)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Update Status
        </button>
      </div>
    </div>
  );
}

// Main Page Component
export default function EmployeeProgressPage() {
  const [appointments, setAppointments] = useState<AppointmentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentProgress | null>(null);
  const [showLogTimeModal, setShowLogTimeModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);

  // Transform API appointment data to AppointmentProgress format
  const transformAppointment = (item: Appointment): AppointmentProgress => ({
    appointmentId: item.id, // Keep as is (string UUID or number)
    serviceName: item.serviceName || 'Service',
    location: item.location || 'Location TBD',
    customerName: item.customerName || 'Unknown Customer',
    tag: item.type || 'Appointment',
    progressPercentage: item.progressPercentage || 0,
    hoursLogged: item.actualHours || 0,
    estimatedHours: item.estimatedHours || 1,
    status: (item.status?.toLowerCase() || 'not started') as any,
    timerRunning: item.timerRunning || false,
    latestRemarks: item.notes || '',
  });

  // Fetch appointments from real API
  const fetchAppointments = async () => {
    try {
      setError(null);
      const [appointmentsData, projectsData] = await Promise.all([
        getEmployeeAppointments(),
        (await import('@/lib/employeeService')).employeeService.getMyProjects()
      ]);
      const transformedAppointments = appointmentsData.map(transformAppointment);
      
      // Transform projects to appointment progress format
      const transformedProjects = projectsData.map((proj: any) => ({
        appointmentId: proj.id, // Keep as is (string UUID or number)
        serviceName: proj.taskName || 'Project',
        location: 'On-site',
        customerName: 'Customer',
        tag: 'Project',
        progressPercentage: proj.progressPercentage ?? 0,  // Use backend value or default to 0
        hoursLogged: 0,
        estimatedHours: 40,
        status: (proj.status?.toLowerCase() || 'planned') as any,
        timerRunning: false,
        latestRemarks: proj.description || '',
      }));
      
      // Combine both
      setAppointments([...transformedAppointments, ...transformedProjects]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      console.error('Error fetching data:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Log time handler
  const handleLogTime = async (data: TimeLog) => {
    if (!selectedAppointment) return;

    try {
      await logTime(selectedAppointment.appointmentId, data);

      // Update local state
      setAppointments(prev =>
        prev.map(a =>
          a.appointmentId === selectedAppointment.appointmentId
            ? { ...a, hoursLogged: a.hoursLogged + data.hours }
            : a
        )
      );

      alert('Time logged successfully!');
    } catch (err) {
      console.error('Error logging time:', err);
      alert('Failed to log time. Please try again.');
      throw err;
    }
  };

  // Update status handler
  const handleUpdateStatus = async (data: ProgressUpdate) => {
    if (!selectedAppointment) return;

    try {
      await updateProgress(selectedAppointment.appointmentId, data);

      // Refetch appointments from backend to get updated data
      await fetchAppointments();

      alert('Status updated successfully!');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
      throw err;
    }
  };

  return (
    <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Service Progress</h1>
          <p className="text-gray-600">Track time and update work status</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">
              <strong>Error:</strong> {error}
            </p>
            <p className="text-red-700 text-sm mt-2">
              Please ensure the backend API is running at{' '}
              <code className="bg-red-100 px-2 py-1 rounded">
                {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8081'}
              </code>
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && appointments.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Appointments</h3>
            <p className="text-gray-600">You don't have any assigned appointments yet.</p>
          </div>
        )}

        {/* Service Cards Grid */}
        {!loading && appointments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {appointments.map((appointment) => (
              <ServiceProgressCard
                key={appointment.appointmentId}
                appointment={appointment}
                onLogTime={(apt) => {
                  setSelectedAppointment(apt);
                  setShowLogTimeModal(true);
                }}
                onUpdateStatus={(apt) => {
                  setSelectedAppointment(apt);
                  setShowUpdateStatusModal(true);
                }}
              />
            ))}
          </div>
        )}

      {/* Modals */}
      <LogTimeModal
        isOpen={showLogTimeModal}
        onClose={() => {
          setShowLogTimeModal(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        onLog={handleLogTime}
      />

      <UpdateStatusModal
        isOpen={showUpdateStatusModal}
        onClose={() => {
          setShowUpdateStatusModal(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
        onUpdate={handleUpdateStatus}
      />
    </div>
  );
}
