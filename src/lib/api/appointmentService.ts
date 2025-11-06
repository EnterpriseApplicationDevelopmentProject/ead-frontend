// API configuration
import { axiosInstance } from '@/lib/apiClient';
import type { Appointment as AppAppointment } from '@/types';

const handleResponse = async (response: any) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch data');
  }
  return response.data;
};

// Use shared Appointment type from '@/types' for return values

export const appointmentService = {
  // Get all appointments
  getAllAppointments: async (): Promise<AppAppointment[]> => {
    const { data } = await axiosInstance.get('/appointments');
  // map backend DTO to frontend Appointment shape
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((d: any) => ({
      id: String(d.appointmentId || d.id || ''),
      customerId: String(d.customerId || ''),
      vehicleId: String(d.vehicleId || ''),
      vehicleNumber: String(d.vehicleNo || d.vehicleNumber || ''),
      serviceName: String(d.service || d.serviceName || ''),
      date: String(d.date || ''),
      time: String(d.startTime || d.time || ''),
      status: (String(d.status || 'Upcoming') as AppAppointment['status']),
    }));
  },

  // Get appointments for a specific customer
  getCustomerAppointments: async (customerId: string): Promise<AppAppointment[]> => {
    const { data } = await axiosInstance.get('/appointments', { params: { customerId } });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((d: any) => ({
      id: String(d.appointmentId || d.id || ''),
      customerId: String(d.customerId || ''),
      vehicleId: String(d.vehicleId || ''),
      vehicleNumber: String(d.vehicleNo || d.vehicleNumber || ''),
      serviceName: String(d.service || d.serviceName || ''),
      date: String(d.date || ''),
      time: String(d.startTime || d.time || ''),
      status: (String(d.status || 'Upcoming') as AppAppointment['status'])
    }));
  },

  // Create a new appointment
  createAppointment: async (appointmentData: Omit<AppAppointment, 'id'>): Promise<AppAppointment> => {
    const { data: d } = await axiosInstance.post('/appointments', appointmentData);
    return {
      id: String(d.appointmentId || d.id || ''),
      customerId: String(d.customerId || ''),
      vehicleId: String(d.vehicleId || ''),
      vehicleNumber: String(d.vehicleNo || d.vehicleNumber || ''),
      serviceName: String(d.service || d.serviceName || ''),
      date: String(d.date || ''),
      time: String(d.startTime || d.time || ''),
      status: (String(d.status || 'Upcoming') as AppAppointment['status'])
    };
  },

  // Cancel an appointment
  cancelAppointment: async (appointmentId: string): Promise<AppAppointment> => {
    // Use the generic update endpoint to change status to CANCELLED
    const payload = { status: 'CANCELLED' };
    const { data: d } = await axiosInstance.put(`/appointments/${appointmentId}`, payload);
    // map to frontend shape
    return {
      id: String(d.appointmentId || d.id || ''),
      customerId: String(d.customerId || ''),
      vehicleId: String(d.vehicleId || ''),
      vehicleNumber: String(d.vehicleNo || d.vehicleNumber || ''),
      serviceName: String(d.service || d.serviceName || ''),
      date: String(d.date || ''),
      time: String(d.startTime || d.time || ''),
      status: (String(d.status || 'Cancelled') as AppAppointment['status']),
    };
  },

  // Delete an appointment
  deleteAppointment: async (appointmentId: string): Promise<void> => {
    if (!appointmentId) {
      throw new Error('Invalid appointment id');
    }
    await axiosInstance.delete(`/appointments/${encodeURIComponent(appointmentId)}`);
  },

  // Get globally booked start times for a given date (across all users).
  // Tries a dedicated availability endpoint first; falls back to retrieving all appointments.
  getBookedStartTimesForDate: async (date: string): Promise<string[]> => {
    // Try availability endpoint
    try {
      const { data } = await axiosInstance.get(`/appointments/availability`, { params: { date } });
      // Expecting something like: { date: 'YYYY-MM-DD', booked: ['09:00', '09:30', ...] }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const booked = (data?.booked || []) as any[];
      return booked.map((t) => String(t));
    } catch {
      // Fallback to pulling all appointments if availability endpoint not present
      try {
        const all = await appointmentService.getAllAppointments();
        return all
          .filter(a => a.date === date && String(a.status).toUpperCase() !== 'CANCELLED')
          .map(a => (a.time?.length ? a.time : ''))
          .filter(Boolean) as string[];
      } catch {
        return [];
      }
    }
  }
};