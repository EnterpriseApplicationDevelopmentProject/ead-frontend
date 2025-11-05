/**
 * Mock Data for Customer Dashboard
 * Simulates data from backend API
 */

import type { Customer, Vehicle, Appointment, Project } from '@/types';

// Current logged-in customer (mock)
export const mockCustomer: Customer = {
  id: 'CUST001',
  name: 'James Wilson',
  firstName: 'James',
  lastName: 'Wilson',
  email: 'james.wilson@email.com',
  phone: '+1 (555) 123-4567',
  address: '123 Main St, Springfield',
  nic: 'NIC123456',
  password: 'password123',
  joinedDate: '2024-01-15'
};

// Customer's vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: 'VEH001',
    customerId: 'CUST001',
    vehicleNumber: 'ABC-2345',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    type: 'Car'
  }
];

// Appointments (Pre-defined Services)
export const mockAppointments: Appointment[] = [
  {
    id: 'APT001',
    customerId: 'CUST001',
    vehicleId: 'VEH001',
    vehicleNumber: 'ABC-2345',
    serviceName: 'Brake Pad Checking',
    date: '2025-11-12',
    time: '11:00 AM - 12:00 PM',
    status: 'Upcoming',
    assignedEmployee: 'Mike Johnson',
    approvedBy: 'Admin Sarah'
  },
  {
    id: 'APT002',
    customerId: 'CUST001',
    vehicleId: 'VEH003',
    vehicleNumber: 'XYZ-7890',
    serviceName: 'Oil Change',
    date: '2025-11-15',
    time: '02:00 PM - 03:00 PM',
    status: 'Upcoming',
    assignedEmployee: 'David Smith'
  },
  {
    id: 'APT003',
    customerId: 'CUST001',
    vehicleId: 'VEH001',
    vehicleNumber: 'ABC-2345',
    serviceName: 'Regular Checkup',
    date: '2025-10-20',
    time: '10:00 AM - 11:00 AM',
    status: 'Completed',
    assignedEmployee: 'Mike Johnson',
    approvedBy: 'Admin Sarah'
  },
  {
    id: 'APT004',
    customerId: 'CUST001',
    vehicleId: 'VEH002',
    vehicleNumber: 'CBB-5475',
    serviceName: 'Tire Rotation',
    date: '2025-09-15',
    time: '09:00 AM - 10:00 AM',
    status: 'Completed',
    assignedEmployee: 'David Smith'
  },
  {
    id: 'APT005',
    customerId: 'CUST001',
    vehicleId: 'VEH003',
    vehicleNumber: 'XYZ-7890',
    serviceName: 'Battery Replacement',
    date: '2025-08-10',
    time: '03:00 PM - 04:00 PM',
    status: 'Completed',
    assignedEmployee: 'Mike Johnson'
  }
];

// Projects (Custom Services)
export const mockProjects: Project[] = [
  {
    id: 'PRJ001',
    customerId: 'CUST001',
    vehicleId: 'VEH002',
    vehicleNumber: 'CBB-5475',
    vehicleType: 'Van',
    taskName: 'Seats Repairing',
    description: 'Custom leather seat repair and modification',
    startDate: '2025-11-05',
    time: '09:00 AM - 05:00 PM',
    status: 'Ongoing',
    assignedEmployee: 'Robert Brown',
    approvedBy: 'Admin Sarah',
    estimatedCost: 1200,
    notes: 'High priority - Customer deadline: Nov 20'
  },
  {
    id: 'PRJ002',
    customerId: 'CUST001',
    vehicleId: 'VEH001',
    vehicleNumber: 'ABC-2345',
    vehicleType: 'Car',
    taskName: 'Modify Body',
    description: 'Custom body kit installation',
    startDate: '2025-10-25',
    time: '08:00 AM - 06:00 PM',
    status: 'Ongoing',
    assignedEmployee: 'James Miller',
    approvedBy: 'Admin John',
    estimatedCost: 2500
  },
  {
    id: 'PRJ003',
    customerId: 'CUST001',
    vehicleId: 'VEH003',
    vehicleNumber: 'XYZ-7890',
    vehicleType: 'SUV',
    taskName: 'Modify Engine',
    description: 'Engine performance upgrade',
    startDate: '2025-08-15',
    completedDate: '2025-09-10',
    time: '10:00 AM - 04:00 PM',
    status: 'Completed',
    assignedEmployee: 'Robert Brown',
    approvedBy: 'Admin Sarah',
    estimatedCost: 3500
  },
  {
    id: 'PRJ004',
    customerId: 'CUST001',
    vehicleId: 'VEH002',
    vehicleNumber: 'CBB-5475',
    vehicleType: 'Van',
    taskName: 'Modify Seats',
    description: 'Additional seats installation',
    startDate: '2025-07-20',
    completedDate: '2025-08-05',
    time: '09:00 AM - 05:00 PM',
    status: 'Completed',
    assignedEmployee: 'James Miller',
    estimatedCost: 1800
  },
  {
    id: 'PRJ005',
    customerId: 'CUST001',
    vehicleId: 'VEH001',
    vehicleNumber: 'ABC-2345',
    vehicleType: 'Car',
    taskName: 'Sound System Installation',
    description: 'Premium audio system upgrade',
    startDate: '2025-06-10',
    completedDate: '2025-06-15',
    time: '10:00 AM - 02:00 PM',
    status: 'Completed',
    assignedEmployee: 'David Smith',
    estimatedCost: 900
  }
];
