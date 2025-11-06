'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, Wifi, WifiOff, Bell, TrendingUp } from 'lucide-react';
import { AppointmentProgress } from '@/types/progress.types';
import {
  getCustomerAppointments,
  API_BASE_URL,
  type Appointment,
} from '@/lib/api';
import customerWebSocketService from '@/lib/customer-websocket';
import CustomerProgressCard from '@/components/progress/CustomerProgressCard';
import Timeline from '@/components/progress/Timeline';

export default function CustomerProgressPage() {
  const [appointments, setAppointments] = useState<AppointmentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentProgress | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // TODO: Replace with actual customer ID from auth context
  const CUSTOMER_ID = '1';

  const transformAppointment = (item: Appointment): AppointmentProgress => ({
    appointmentId: item.id,
    serviceName: item.serviceName || 'Service',
    serviceDescription: undefined,
    location: item.location || 'Location TBD',
    customerName: item.customerName || 'Unknown Customer',
    customerPhone: undefined,
    status: (item.status?.toLowerCase() || 'not started') as AppointmentProgress['status'],
    progressPercentage: item.progressPercentage || 0,
    currentStage: item.currentStage || 'Not Started',
    estimatedHours: item.estimatedHours,
    scheduledDate: item.scheduledDate,
    latestRemarks: item.notes,
    vehicleInfo: item.vehicleId ? `Vehicle #${item.vehicleId}` : undefined,
  });

  const fetchAppointments = useCallback(async () => {
    try {
      setError(null);
      const data = await getCustomerAppointments(Number(CUSTOMER_ID));
      const transformedData = data.map(transformAppointment);
      setAppointments(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch appointments';
      console.error('Error fetching customer appointments:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [CUSTOMER_ID]);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 5000);
  };

  // WebSocket setup for real-time updates
  useEffect(() => {
    customerWebSocketService.connect(CUSTOMER_ID);

    const unsubscribeConnect = customerWebSocketService.onConnect(() => {
      setWsConnected(true);
      showNotification('Connected to real-time updates');
    });

    const unsubscribeDisconnect = customerWebSocketService.onDisconnect(() => {
      setWsConnected(false);
      showNotification('Real-time updates disconnected');
    });

    const unsubscribeMessage = customerWebSocketService.onMessage((notif) => {
      // Update the appointment in the list with new progress data
      setAppointments((prev) =>
        prev.map((a) =>
          a.appointmentId === notif.appointmentId
            ? {
                ...a,
                progressPercentage: notif.data.percentage,
                currentStage: notif.data.stage,
                latestRemarks: notif.data.remarks,
              }
            : a
        )
      );

      // Show notification to user
      showNotification(notif.message);
    });

    return () => {
      unsubscribeConnect();
      unsubscribeDisconnect();
      unsubscribeMessage();
      customerWebSocketService.disconnect();
    };
  }, [CUSTOMER_ID]);

  // Fetch appointments on mount and periodically
  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [fetchAppointments]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-blue-600" />
            My Service Progress
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track real-time progress on your service appointments
          </p>
        </div>
        <div className="flex items-center gap-2">
          {wsConnected ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full">
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Live Updates</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full">
              <WifiOff className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-medium text-gray-600">Offline</span>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 flex items-center gap-2 min-w-[280px]">
            <Bell className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-gray-800">{notification}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Loading your appointments...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 font-medium">{error}</p>
          <p className="text-xs text-red-700 mt-2">
            Please ensure the backend API is running at{' '}
            <code className="bg-red-100 px-1.5 py-0.5 rounded text-xs">{API_BASE_URL}</code>
          </p>
          <button
            onClick={fetchAppointments}
            className="mt-3 px-4 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && appointments.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <ClipboardList className="w-14 h-14 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">No Appointments</h3>
          <p className="text-sm text-gray-600">
            You don't have any service appointments at the moment.
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Book a service to see progress updates here.
          </p>
        </div>
      )}

      {/* Appointments Grid */}
      {!loading && appointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {appointments.map((appointment) => (
            <CustomerProgressCard
              key={appointment.appointmentId}
              appointment={appointment}
              onViewTimeline={(apt) => {
                setSelectedAppointment(apt);
                setShowTimeline(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Stats Summary - Optional Enhancement */}
      {!loading && appointments.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Total Services</p>
            <p className="text-2xl font-bold text-gray-900">{appointments.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">In Progress</p>
            <p className="text-2xl font-bold text-blue-600">
              {appointments.filter((a) => a.status.toLowerCase() === 'in progress').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {appointments.filter((a) => a.status.toLowerCase() === 'completed').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Average Progress</p>
            <p className="text-2xl font-bold text-gray-900">
              {appointments.length > 0
                ? Math.round(
                    appointments.reduce((sum, a) => sum + a.progressPercentage, 0) /
                      appointments.length
                  )
                : 0}
              %
            </p>
          </div>
        </div>
      )}

      {/* Timeline Modal */}
      <Timeline
        isOpen={showTimeline}
        onClose={() => {
          setShowTimeline(false);
          setSelectedAppointment(null);
        }}
        appointment={selectedAppointment}
      />
    </div>
  );
}
