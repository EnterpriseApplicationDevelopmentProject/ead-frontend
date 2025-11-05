/**
 * Mock API Service
 * Simulates backend API calls with mock data
 * Replace these with real API calls when backend is ready
 */

import {
  mockCustomer,
  mockVehicles,
  mockAppointments,
  mockProjects
} from '@/data/mockData';
import type { Customer, Vehicle, Appointment, Project, DashboardStats } from '@/types';

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Customer Service
 */
export const customerService = {
  async getProfile(): Promise<Customer> {
    await delay();
    return mockCustomer;
  }
  ,
  async updateProfile(update: Partial<Customer>): Promise<Customer> {
    await delay();
    // shallow update the mock customer
    Object.assign(mockCustomer, update);
    return mockCustomer;
  }
};

/**
 * Vehicle Service
 */
export const vehicleService = {
  async getCustomerVehicles(customerId: string): Promise<Vehicle[]> {
    await delay();
    return mockVehicles.filter(v => v.customerId === customerId);
  },

  async getVehicleById(vehicleId: string): Promise<Vehicle | undefined> {
    await delay();
    return mockVehicles.find(v => v.id === vehicleId);
  }
};

/**
 * Appointment Service (Pre-defined Services)
 */
export const appointmentService = {
  async getCustomerAppointments(customerId: string): Promise<Appointment[]> {
    await delay();
    return mockAppointments.filter(a => a.customerId === customerId);
  },

  async getUpcomingAppointments(customerId: string): Promise<Appointment[]> {
    await delay();
    return mockAppointments.filter(
      a => a.customerId === customerId && a.status === 'Upcoming'
    );
  },

  async getCompletedAppointments(customerId: string): Promise<Appointment[]> {
    await delay();
    return mockAppointments.filter(
      a => a.customerId === customerId && a.status === 'Completed'
    );
  },

  async getAppointmentById(appointmentId: string): Promise<Appointment | undefined> {
    await delay();
    return mockAppointments.find(a => a.id === appointmentId);
  }
};

/**
 * Project Service (Custom Services)
 */
export const projectService = {
  async getCustomerProjects(customerId: string): Promise<Project[]> {
    await delay();
    return mockProjects.filter(p => p.customerId === customerId);
  },

  async getOngoingProjects(customerId: string): Promise<Project[]> {
    await delay();
    return mockProjects.filter(
      p => p.customerId === customerId && p.status === 'Ongoing'
    );
  },

  async getCompletedProjects(customerId: string): Promise<Project[]> {
    await delay();
    return mockProjects.filter(
      p => p.customerId === customerId && p.status === 'Completed'
    );
  },

  async getProjectById(projectId: string): Promise<Project | undefined> {
    await delay();
    return mockProjects.find(p => p.id === projectId);
  }
};

/**
 * Dashboard Service
 */
export const dashboardService = {
  async getDashboardStats(customerId: string): Promise<DashboardStats> {
    await delay();
    
    const vehicles = mockVehicles.filter(v => v.customerId === customerId);
    const upcomingAppointments = mockAppointments.filter(
      a => a.customerId === customerId && a.status === 'Upcoming'
    );
    const completedAppointments = mockAppointments.filter(
      a => a.customerId === customerId && a.status === 'Completed'
    );
    const ongoingProjects = mockProjects.filter(
      p => p.customerId === customerId && p.status === 'Ongoing'
    );
    const completedProjects = mockProjects.filter(
      p => p.customerId === customerId && p.status === 'Completed'
    );

    return {
      totalVehicles: vehicles.length,
      upcomingAppointments: upcomingAppointments.length,
      ongoingProjects: ongoingProjects.length,
      completedAppointments: completedAppointments.length,
      completedProjects: completedProjects.length
    };
  }
};
