/**
 * TypeScript Types for Automobile Service Management
 */

// Customer Types
export interface Customer {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  phoneNumber?: string;
  address?: string;
  nic?: string;
  password?: string;
  joinedDate?: string;
  createdAt?: string;
}

// Vehicle Types
export interface Vehicle {
  id: string;
  customerId: string;
  vehicleNumber: string;
  make: string;
  model: string;
  year: number;
  type: 'Car' | 'Van' | 'Truck' | 'SUV';
}

// Appointment Types (Pre-defined Services)
export interface Appointment {
  id: string;
  customerId: number;
  customerName?: string;
  vehicleId: number;
  vehicleNumber: string;
  vehicleModel?: string;
  serviceName: string;
  appointmentTime?: string;
  date?: string;
  time?: string;
  status: string;
  assignedEmployee?: string;
  employeeName?: string;
  approvedBy?: string;
  notes?: string;
  customerNotes?: string;
  tasks?: string[];
  estimatedDurationMinutes?: number;
  createdAt?: string;
}

// Project Types (Custom Services)
export interface Project {
  id: string;
  customerId: number;
  customerName?: string;
  vehicleId: number;
  vehicleNumber: string;
  vehicleModel?: string;
  vehicleType: string;
  taskName: string;
  description: string;
  serviceDescription?: string;
  startDate: string;
  estimatedEndDate?: string;
  completedDate?: string;
  time: string;
  status: string;
  assignedEmployee?: string;
  employeeName?: string;
  approvedBy?: string;
  estimatedCost?: number;
  estimatedDurationDays?: number;
  notes?: string;
  adminNotes?: string;
  employeeNotes?: string;
  createdAt?: string;
  updatedAt?: string;
  assignedAt?: string;
  completedAt?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalVehicles: number;
  upcomingAppointments: number;
  ongoingProjects: number;
  completedAppointments: number;
  completedProjects: number;
}
