// API configuration
const API_BASE_URL = 'http://localhost:8080/api';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Failed to fetch data');
  }
  return response.json();
};

export interface Appointment {
  id?: string;
  customerId?: string;
  vehicleNumber: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
}

export const appointmentService = {
  // Get all appointments
  getAllAppointments: async (): Promise<Appointment[]> => {
    const response = await fetch(`${API_BASE_URL}/appointments`);
    const data = await handleResponse(response);
  // map backend DTO to frontend Appointment shape
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((d: any) => ({
      id: d.appointmentId || d.id,
      customerId: d.customerId,
      vehicleNumber: d.vehicleNo || d.vehicleNumber,
      serviceName: d.service || d.serviceName,
      date: d.date,
      time: d.startTime || d.time,
      status: d.status
    }));
  },

  // Get appointments for a specific customer
  getCustomerAppointments: async (customerId: string): Promise<Appointment[]> => {
    const response = await fetch(`${API_BASE_URL}/appointments/customer/${customerId}`);
    const data = await handleResponse(response);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((d: any) => ({
      id: d.appointmentId || d.id,
      customerId: d.customerId,
      vehicleNumber: d.vehicleNo || d.vehicleNumber,
      serviceName: d.service || d.serviceName,
      date: d.date,
      time: d.startTime || d.time,
      status: d.status
    }));
  },

  // Create a new appointment
  createAppointment: async (appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    const d = await handleResponse(response);
    return {
      id: d.appointmentId || d.id,
      customerId: d.customerId,
      vehicleNumber: d.vehicleNo || d.vehicleNumber,
      serviceName: d.service || d.serviceName,
      date: d.date,
      time: d.startTime || d.time,
      status: d.status
    };
  },

  // Cancel an appointment
  cancelAppointment: async (appointmentId: string): Promise<Appointment> => {
    // Use the generic update endpoint to change status to CANCELLED
    const payload = { status: 'CANCELLED' };
    const response = await fetch(`${API_BASE_URL}/appointments/${appointmentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const d = await handleResponse(response);
    // map to frontend shape
    return {
      id: d.appointmentId || d.id,
      customerId: d.customerId,
      vehicleNumber: d.vehicleNo || d.vehicleNumber,
      serviceName: d.service || d.serviceName,
      date: d.date,
      time: d.startTime || d.time,
      status: d.status,
    };
  },

  // Delete an appointment
  deleteAppointment: async (appointmentId: string): Promise<void> => {
    if (!appointmentId) {
      throw new Error('Invalid appointment id');
    }
    const url = `${API_BASE_URL}/appointments/${encodeURIComponent(appointmentId)}`;
    const response = await fetch(url, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => response.statusText);
      throw new Error(errText || 'Failed to delete appointment');
    }
  }
};