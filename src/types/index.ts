/**
 * TypeScript Types for Automobile Service Management
 */

// Customer Types
export interface Customer {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  address?: string;
  nic?: string;
  password?: string;
  joinedDate: string;
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
  customerId: string;
  vehicleId: string;
  vehicleNumber: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  assignedEmployee?: string;
  approvedBy?: string;
  notes?: string;
}

// Project Types (Custom Services)
export interface Project {
  id: string;
  customerId: string;
  vehicleId: string;
  vehicleNumber: string;
  vehicleType: string;
  taskName: string;
  description: string;
  startDate: string;
  estimatedEndDate?: string;
  completedDate?: string;
  time: string;
  status: 'Ongoing' | 'Completed' | 'Cancelled';
  assignedEmployee?: string;
  approvedBy?: string;
  estimatedCost?: number;
  notes?: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalVehicles: number;
  upcomingAppointments: number;
  ongoingProjects: number;
  completedAppointments: number;
  completedProjects: number;
}
