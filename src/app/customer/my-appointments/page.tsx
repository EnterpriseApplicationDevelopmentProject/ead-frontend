'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Clock, Car, CheckCircle, XCircle, Plus } from 'lucide-react';
import { appointmentService, type Appointment } from '@/lib/api/appointmentService';

export default function MyAppointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'requesting' | 'upcoming' | 'completed' | 'cancelled'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const apts = await appointmentService.getAllAppointments();
      setAppointments(apts);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      setError('Failed to load appointments. Please try again later.');
      setAppointments([]);
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

  const filteredAppointments = appointments.filter(apt => {
    const status = apt.status.toLowerCase();
    if (activeTab === 'all') return true;
    if (activeTab === 'requesting') return status === 'requesting';
    if (activeTab === 'upcoming') return status === 'assigned';
    if (activeTab === 'completed') return status === 'completed';
    if (activeTab === 'cancelled') return status === 'cancelled';
    return true;
  });

  const requestingCount = appointments.filter(a => a.status.toLowerCase() === 'requesting').length;
  const upcomingCount = appointments.filter(a => a.status.toLowerCase() === 'assigned').length;
  const completedCount = appointments.filter(a => a.status.toLowerCase() === 'completed').length;
  const cancelledCount = appointments.filter(a => a.status.toLowerCase() === 'cancelled').length;

  // Cancel an appointment
  const handleCancel = async (appointmentId?: string) => {
    if (!appointmentId) {
      console.error('Attempted to cancel appointment with empty id');
      alert('Unable to cancel appointment: invalid id');
      return;
    }

    const confirmed = window.confirm('Are you sure you want to cancel this appointment?');
    if (!confirmed) return;

    try {
      await appointmentService.cancelAppointment(appointmentId);
      // Reload appointments to get updated status
      await loadAppointments();
      alert('Appointment cancelled successfully');
    } catch (err: unknown) {
      console.error('Cancel failed:', err);
      const msg = err instanceof Error ? err.message : String(err);
      alert('Failed to cancel appointment: ' + (msg || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Appointments</h1>
            <p className="text-gray-600">View and manage your service appointments</p>
          </div>
          <button
            onClick={() => router.push('/customer/my-appointments/book')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Book Appointment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Requesting</p>
              <p className="text-3xl font-bold text-yellow-600">{requestingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming</p>
              <p className="text-3xl font-bold text-blue-600">{upcomingCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Cancelled</p>
              <p className="text-3xl font-bold text-red-600">{cancelledCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              All ({appointments.length})
            </button>
            <button
              onClick={() => setActiveTab('requesting')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'requesting'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Requesting ({requestingCount})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'upcoming'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Upcoming ({upcomingCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'cancelled'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Cancelled ({cancelledCount})
            </button>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    {activeTab === 'all' && 'No appointments found'}
                    {activeTab === 'requesting' && 'No requesting appointments'}
                    {activeTab === 'upcoming' && 'No upcoming appointments'}
                    {activeTab === 'completed' && 'No completed appointments'}
                    {activeTab === 'cancelled' && 'No cancelled appointments'}
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.serviceName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Car className="w-4 h-4 text-gray-400" />
                        {appointment.vehicleNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {appointment.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {appointment.progressPercentage ?? 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              (appointment.progressPercentage ?? 0) === 100
                                ? 'bg-green-600'
                                : (appointment.progressPercentage ?? 0) > 50
                                ? 'bg-blue-600'
                                : 'bg-yellow-500'
                            }`}
                            style={{ width: `${appointment.progressPercentage ?? 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-3">
                        {(() => {
                          const statusLower = appointment.status.toLowerCase();
                          
                          // Cancel button - show ONLY for REQUESTING status (before assignment)
                          if (statusLower === 'requesting') {
                            return (
                              <button
                                onClick={() => handleCancel(appointment.id)}
                                className="text-red-600 hover:text-red-900 transition-colors"
                              >
                                Cancel
                              </button>
                            );
                          }
                          
                          // No actions for completed or cancelled appointments
                          return <span className="text-gray-400 text-sm">-</span>;
                        })()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
