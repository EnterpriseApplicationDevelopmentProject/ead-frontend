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

// Base URL for real backend. Prefer NEXT_PUBLIC_API_BASE_URL when set. In
// development, default to http://localhost:8080 so local backend is used
// automatically. In production we keep an empty default which allows same-origin
// calls to /api if desired.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : '');

async function callApi(path: string, options?: RequestInit) {
  const base = API_BASE || '';

  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }

  // Try parse JSON; if no body, return undefined
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : undefined;
  } catch {
    return text;
  }
}

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
    // Always use backend API. This will throw if the backend is unreachable or
    // returns a non-2xx response so the UI can surface the error instead of
    // silently falling back to mock data.
    const dtos = await callApi(`/api/appointments`);
    if (!Array.isArray(dtos)) throw new Error('Invalid appointments response from server');
    const raw = dtos as Array<Record<string, unknown>>;
    const mapped = raw.map(mapDtoToAppointment);
    const hasCustomer = raw.some(d => d['customerId'] !== undefined && d['customerId'] !== null && String(d['customerId']).length > 0);
    return hasCustomer ? mapped.filter((a: Appointment) => a.customerId === customerId) : mapped;
  },

  async getUpcomingAppointments(customerId: string): Promise<Appointment[]> {
    const dtos = await callApi(`/api/appointments`);
    if (!Array.isArray(dtos)) throw new Error('Invalid appointments response from server');
    const raw = dtos as Array<Record<string, unknown>>;
    const mapped = raw.map(mapDtoToAppointment);
    const hasCustomer = raw.some(d => d['customerId'] !== undefined && d['customerId'] !== null && String(d['customerId']).length > 0);
    return hasCustomer ? mapped.filter((a: Appointment) => a.customerId === customerId && a.status === 'Upcoming') : mapped.filter((a: Appointment) => a.status === 'Upcoming');
  },

  async getCompletedAppointments(customerId: string): Promise<Appointment[]> {
    const dtos = await callApi(`/api/appointments`);
    if (!Array.isArray(dtos)) throw new Error('Invalid appointments response from server');
    const raw = dtos as Array<Record<string, unknown>>;
    const mapped = raw.map(mapDtoToAppointment);
    const hasCustomer = raw.some(d => d['customerId'] !== undefined && d['customerId'] !== null && String(d['customerId']).length > 0);
    return hasCustomer ? mapped.filter((a: Appointment) => a.customerId === customerId && a.status === 'Completed') : mapped.filter((a: Appointment) => a.status === 'Completed');
  },

  async getAppointmentById(appointmentId: string): Promise<Appointment | undefined> {
    const dto = await callApi(`/api/appointments/${encodeURIComponent(appointmentId)}`);
    return dto ? mapDtoToAppointment(dto as Record<string, unknown>) : undefined;
  },

  // Cancel appointment: try PATCH to update status to 'Cancelled' on backend, otherwise update mock in-memory data
  async cancelAppointment(appointmentId: string): Promise<void> {
    // Use GET -> modify -> PUT because backend doesn't expose PATCH
    const existing = await callApi(`/api/appointments/${encodeURIComponent(appointmentId)}`);
    if (!existing) throw new Error('Appointment not found');
    const updated = { ...(existing as Record<string, unknown>), status: 'Cancelled' } as Record<string, unknown>;
    await callApi(`/api/appointments/${encodeURIComponent(appointmentId)}`, {
      method: 'PUT',
      body: JSON.stringify(updated),
    });
  },

  // Delete appointment: try DELETE on backend, otherwise remove from mock data
  async deleteAppointment(appointmentId: string): Promise<void> {
    await callApi(`/api/appointments/${encodeURIComponent(appointmentId)}`, { method: 'DELETE' });
  },

  // Create an appointment
  async createAppointment(payload: Partial<Appointment>): Promise<Appointment> {
    const dto = await callApi(`/api/appointments`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (!dto) throw new Error('Invalid create response from server');
    return mapDtoToAppointment(dto as Record<string, unknown>);
  },

  // Update appointment
  async updateAppointment(appointmentId: string, payload: Partial<Appointment>): Promise<Appointment | undefined> {
    const dto = await callApi(`/api/appointments/${encodeURIComponent(appointmentId)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return dto ? mapDtoToAppointment(dto as Record<string, unknown>) : undefined;
  }
};

// Helper: map backend AppointmentDTO to frontend Appointment shape
function mapDtoToAppointment(dto: Record<string, unknown>): Appointment {
  // dto fields: appointmentId, service, vehicleNo, date (ISO), startTime, endTime, status
  const appointmentId = dto['appointmentId'] ?? dto['id'] ?? '';
  const customerId = dto['customerId'] ?? dto['customer'] ?? '';
  const vehicleNo = dto['vehicleNo'] ?? dto['vehicleNo'] ?? dto['vehicleNumber'] ?? '';
  const service = dto['service'] ?? dto['serviceName'] ?? '';
  const date = dto['date'] ?? dto['dateString'] ?? '';
  const startTime = dto['startTime'] ?? '';
  const endTime = dto['endTime'] ?? '';
  const status = dto['status'] ?? 'Upcoming';

  return {
    id: String(appointmentId),
    customerId: String(customerId),
    vehicleId: '',
    vehicleNumber: String(vehicleNo),
    serviceName: String(service),
    date: String(date),
    time: startTime && endTime ? `${String(startTime)}-${String(endTime)}` : String(dto['time'] ?? ''),
    status: String(status) as Appointment['status'],
  };
}

/**
 * Project Service (Custom Services)
 */
export const projectService = {
  async getCustomerProjects(customerId: string): Promise<Project[]> {
    const dtos = await callApi(`/api/projects`);
    if (!Array.isArray(dtos)) throw new Error('Invalid projects response from server');
    const raw = dtos as Array<Record<string, unknown>>;
    const mapped = raw.map(mapDtoToProject);
    const hasCustomer = raw.some(d => d['customerId'] !== undefined && d['customerId'] !== null && String(d['customerId']).length > 0);
    return hasCustomer ? mapped.filter((p: Project) => p.customerId === customerId) : mapped;
  },

  async getOngoingProjects(customerId: string): Promise<Project[]> {
    const dtos = await callApi(`/api/projects`);
    if (!Array.isArray(dtos)) throw new Error('Invalid projects response from server');
    const raw = dtos as Array<Record<string, unknown>>;
    const mapped = raw.map(mapDtoToProject);
    const hasCustomer = raw.some(d => d['customerId'] !== undefined && d['customerId'] !== null && String(d['customerId']).length > 0);
    return hasCustomer
      ? mapped.filter((p: Project) => p.customerId === customerId && p.status === 'Ongoing')
      : mapped.filter((p: Project) => p.status === 'Ongoing');
  },

  async getCompletedProjects(customerId: string): Promise<Project[]> {
    const dtos = await callApi(`/api/projects`);
    if (!Array.isArray(dtos)) throw new Error('Invalid projects response from server');
    const raw = dtos as Array<Record<string, unknown>>;
    const mapped = raw.map(mapDtoToProject);
    const hasCustomer = raw.some(d => d['customerId'] !== undefined && d['customerId'] !== null && String(d['customerId']).length > 0);
    return hasCustomer
      ? mapped.filter((p: Project) => p.customerId === customerId && p.status === 'Completed')
      : mapped.filter((p: Project) => p.status === 'Completed');
  },

  async getProjectById(projectId: string): Promise<Project | undefined> {
    const dto = await callApi(`/api/projects/${encodeURIComponent(projectId)}`);
    return dto ? mapDtoToProject(dto as Record<string, unknown>) : undefined;
  },

  async createProject(payload: { name: string; description: string; startDate: string; status?: string; }): Promise<Project> {
    const body = { ...payload, status: payload.status || 'PLANNED' };
    const dto = await callApi(`/api/projects`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!dto) throw new Error('Invalid project create response from server');
    return mapDtoToProject(dto as Record<string, unknown>);
  }
};

// Helper: map backend ProjectDTO to frontend Project shape
function mapDtoToProject(dto: Record<string, unknown>): Project {
  // dto fields: projectId, name, description, customerId, startDate, endDate, status (enum)
  const projectId = dto['projectId'] ?? dto['id'] ?? '';
  const customerId = dto['customerId'] ?? '';
  const name = dto['name'] ?? '';
  const description = dto['description'] ?? '';
  const startDate = dto['startDate'] ?? '';
  const endDate = dto['endDate'] ?? '';
  const statusEnum = String(dto['status'] ?? '').toUpperCase();
  // Map backend enum to UI status used across the app
  const statusMap: Record<string, string> = {
    'PLANNED': 'Ongoing',
    'IN_PROGRESS': 'Ongoing',
    'COMPLETED': 'Completed',
    'CANCELLED': 'Cancelled',
    'ON_HOLD': 'Ongoing'
  };
  const status = statusMap[statusEnum] || 'Ongoing';

  return {
    id: String(projectId),
    customerId: String(customerId),
    taskName: String(name),
    description: String(description),
    vehicleNumber: '',
    vehicleType: '',
    startDate: String(startDate),
    endDate: String(endDate),
    time: '',
    status: status as Project['status'],
  } as Project;
}

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
