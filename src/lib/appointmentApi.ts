const API_BASE_URL = 'http://localhost:8080/api';

export interface Appointment {
  id: number;
  serviceName: string;
  vehicleNumber: string;
  date: string;
  time: string;
  status: string;
  customerId?: string;
  customerName?: string;
}

export const appointmentApi = {
  // Get all appointments
  getAllAppointments: async (): Promise<Appointment[]> => {
    const response = await fetch(`${API_BASE_URL}/appointments`);
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    return response.json();
  },

  // Get appointments by customer ID
  getCustomerAppointments: async (customerId: string): Promise<Appointment[]> => {
    const response = await fetch(`${API_BASE_URL}/appointments/customer/${customerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch customer appointments');
    }
    return response.json();
  },

  // Create a new appointment
  createAppointment: async (appointmentData: {
    serviceName: string;
    vehicleNumber: string;
    date: string;
    time: string;
    status: string;
  }): Promise<Appointment> => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      throw new Error('Failed to create appointment');
    }

    return response.json();
  }
};