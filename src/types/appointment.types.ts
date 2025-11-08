/**
 * Appointment Types
 * Matching backend AppointmentDTO structure
 */

export enum AppointmentStatus {
  REQUESTING = 'REQUESTING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface AppointmentDTO {
  appointmentId?: string;
  service: string;
  customerId?: string;
  vehicleId?: string;
  vehicleNo: string;
  date: string; // ISO date string (YYYY-MM-DD)
  startTime?: string;
  endTime?: string;
  status: AppointmentStatus | string;
}

// Frontend-friendly appointment interface
export interface Appointment {
  id: string;
  customerId?: string;
  customerName?: string; // Customer's full name
  vehicleId?: string;
  vehicleNumber: string;
  serviceName: string;
  date: string;
  time: string;
  status: string;
  assignedEmployee?: string;
  approvedBy?: string;
  notes?: string;
}
