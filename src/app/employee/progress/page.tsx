'use client';

import { useState, useEffect, useCallback } from 'react';
import { ClipboardList, Wifi, WifiOff, Bell } from 'lucide-react';
import { AppointmentProgress } from '@/types/progress.types';
import {
  getEmployeeAppointments,
  updateProgress,
  API_BASE_URL,
  type Appointment,
} from '@/lib/api';
import websocketService from '@/lib/websocket';
import ProgressCard from '@/components/progress/ProgressCard';
import StatusModal from '@/components/progress/StatusModal';
import Timeline from '@/components/progress/Timeline';

export default function EmployeeProgressPage() {
  const [appointments, setAppointments] = useState<AppointmentProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentProgress | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

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
      const data = await getEmployeeAppointments();
      const transformedData = data.map(transformAppointment);
      setAppointments(transformedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch appointments';
      console.error('Error fetching appointments:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUpdateStatus = async (data: { stage: string; percentage: number; remarks: string; }) => {
    if (!selectedAppointment) return;
    try {
      await updateProgress(selectedAppointment.appointmentId, data);
      setAppointments((prev) => prev.map((a) => a.appointmentId === selectedAppointment.appointmentId ? { ...a, progressPercentage: data.percentage, currentStage: data.stage, latestRemarks: data.remarks, } : a));
      showNotification('Progress updated to ' + data.percentage + '%');
    } catch (err) {
      console.error('Error updating status:', err);
      throw err;
    }
  };

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    const userId = '1';
    websocketService.connect(userId);
    const unsubscribeConnect = websocketService.onConnect(() => { setWsConnected(true); showNotification('Connected to real-time updates'); });
    const unsubscribeDisconnect = websocketService.onDisconnect(() => { setWsConnected(false); showNotification('Real-time updates disconnected'); });
    const unsubscribeMessage = websocketService.onMessage((notif) => { setAppointments((prev) => prev.map((a) => a.appointmentId === notif.appointmentId ? { ...a, progressPercentage: notif.data.percentage, currentStage: notif.data.stage, latestRemarks: notif.data.remarks, } : a)); showNotification(notif.message); });
    return () => { unsubscribeConnect(); unsubscribeDisconnect(); unsubscribeMessage(); websocketService.disconnect(); };
  }, []);

  useEffect(() => { fetchAppointments(); const interval = setInterval(fetchAppointments, 60000); return () => clearInterval(interval); }, [fetchAppointments]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Progress</h1>
          <p className="text-sm text-gray-500 mt-1">Track and update service progress</p>
        </div>
        <div className="flex items-center gap-2">
          {wsConnected ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 rounded-full">
              <Wifi className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-700">Live</span>
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
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
            <p className="text-sm text-gray-600">Loading appointments...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800 font-medium">{error}</p>
          <p className="text-xs text-red-700 mt-2">
            Please ensure the backend API is running at <code className="bg-red-100 px-1.5 py-0.5 rounded text-xs">{API_BASE_URL}</code>
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
          <p className="text-sm text-gray-600">You don't have any assigned appointments yet.</p>
        </div>
      )}

      {/* Appointments Grid */}
      {!loading && appointments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {appointments.map((appointment) => (
            <ProgressCard 
              key={appointment.appointmentId} 
              appointment={appointment} 
              onUpdateStatus={(apt) => { 
                setSelectedAppointment(apt); 
                setShowStatusModal(true); 
              }} 
              onViewTimeline={(apt) => { 
                setSelectedAppointment(apt); 
                setShowTimeline(true); 
              }} 
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <StatusModal 
        isOpen={showStatusModal} 
        onClose={() => { 
          setShowStatusModal(false); 
          setSelectedAppointment(null); 
        }} 
        appointment={selectedAppointment} 
        onUpdate={handleUpdateStatus} 
      />
      
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
