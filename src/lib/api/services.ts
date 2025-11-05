import apiClient, { handleApiError } from './config';

// ==================== ENUMS ====================
export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

// ==================== PAGINATION INTERFACES ====================
export interface PageableResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: any;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: any;
  numberOfElements: number;
  empty: boolean;
}

// Category object structure from backend
export interface CategoryResponse {
  id: string | number;
  name: string;
  description: string;
}

// ==================== SERVICE INTERFACES ====================
// Matches Service.java entity
export interface VehicleService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  imageUrl?: string;
  category: string | CategoryResponse;
  categoryId?: string;
  popular?: boolean;
  features: string[];
  status?: ServiceStatus;
  estimatedTime?: number; // in minutes
  durationInHours?: number; // Backend field
  currency?: string; // Backend field
  createdAt?: string; // Backend field
  updatedAt?: string; // Backend field
}

// Matches ServiceResponse.java DTO
export interface ServiceResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  duration?: string;
  imageUrl?: string;
  category: string | CategoryResponse; // Can be string or object from backend
  categoryId?: string;
  popular?: boolean;
  features?: string[];
  status?: ServiceStatus;
  durationInHours?: number; // Backend field
  currency?: string; // Backend field
  createdAt?: string; // Backend field
  updatedAt?: string; // Backend field
}

// ==================== APPOINTMENT INTERFACES ====================
// Matches CreateAppointmentRequest.java
export interface CreateAppointmentRequest {
  serviceId: string;
  vehicleId: string;
  appointmentDate: string; // ISO 8601 format
  timeSlot: string;
  notes?: string;
}

// Matches AppointmentResponse.java
export interface AppointmentResponse {
  id: string;
  serviceId: string;
  serviceName: string;
  vehicleId: string;
  vehicleInfo: string;
  customerId: string;
  customerName: string;
  appointmentDate: string;
  timeSlot: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

// Matches AppointmentDetailsResponse.java
export interface AppointmentDetailsResponse extends AppointmentResponse {
  serviceDetails: ServiceResponse;
  vehicleDetails: VehicleResponse;
  progressUpdates?: ProgressResponse[];
  timeLogs?: TimeLogResponse[];
}

// ==================== VEHICLE INTERFACES ====================
export interface VehicleResponse {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  licensePlate: string;
  color?: string;
  customerId: string;
}

// ==================== PROGRESS INTERFACES ====================
export interface ProgressResponse {
  id: string;
  appointmentId: string;
  status: AppointmentStatus;
  description: string;
  percentage: number;
  updatedBy: string;
  updatedAt: string;
}

// ==================== TIME LOG INTERFACES ====================
export interface TimeLogResponse {
  id: string;
  appointmentId: string;
  employeeId: string;
  employeeName: string;
  startTime: string;
  endTime?: string;
  duration?: number; // in minutes
  description?: string;
}

// ==================== SERVICE CATALOG API ====================
// Maps to ServiceCatalogController.java (Member 3 - sulakshani)
export const serviceApi = {
  // Get all services (handles paginated response)
  getAllServices: async (params?: {
    page?: number;
    size?: number;
    category?: string;
    search?: string;
    status?: ServiceStatus;
  }): Promise<ServiceResponse[]> => {
    try {
      const response = await apiClient.get<PageableResponse<ServiceResponse>>('/customer/services', { 
        params: {
          page: params?.page || 0,
          size: params?.size || 100, // Get all services by default
          ...params
        }
      });

      // Extract content array from paginated response
      if (response.data && response.data.content) {
        return response.data.content;
      }

      // Fallback if response is already an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      // Silently fail and let the component handle fallback
      const errorMessage = handleApiError(error);
      console.info('Backend not available:', errorMessage);
      throw error;
    }
  },

  // GET /api/customer/services/{id}
  getServiceById: async (id: string): Promise<ServiceResponse> => {
    try {
      const response = await apiClient.get(`/customer/services/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching service:', handleApiError(error));
      throw error;
    }
  },

  // GET /api/customer/services/category/{categoryId}
  getServicesByCategory: async (categoryId: string): Promise<ServiceResponse[]> => {
    try {
      const response = await apiClient.get(`/customer/services/category/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching services by category:', handleApiError(error));
      throw error;
    }
  },

  // GET /api/customer/services/popular
  getPopularServices: async (): Promise<ServiceResponse[]> => {
    try {
      const response = await apiClient.get('/customer/services/popular');
      return response.data;
    } catch (error) {
      console.error('Error fetching popular services:', handleApiError(error));
      throw error;
    }
  },

  // GET /api/customer/services/search?query={query}
  searchServices: async (query: string): Promise<ServiceResponse[]> => {
    try {
      const response = await apiClient.get('/customer/services/search', {
        params: { query },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching services:', handleApiError(error));
      throw error;
    }
  },
};

// ==================== APPOINTMENT API ====================
// Maps to CustomerAppointmentController.java (Member 4 - charindu, Member 5 - dilusha)
export const appointmentApi = {
  // POST /api/customer/appointments - Create appointment
  createAppointment: async (request: CreateAppointmentRequest): Promise<AppointmentResponse> => {
    try {
      const response = await apiClient.post('/customer/appointments', request);
      return response.data;
    } catch (error) {
      console.error('Error creating appointment:', handleApiError(error));
      throw error;
    }
  },

  // GET /api/customer/appointments - Get user's appointments
  getMyAppointments: async (params?: {
    status?: AppointmentStatus;
    page?: number;
    size?: number;
  }): Promise<AppointmentResponse[]> => {
    try {
      const response = await apiClient.get('/customer/appointments', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching appointments:', handleApiError(error));
      throw error;
    }
  },

  // GET /api/customer/appointments/{id} - Get appointment details
  getAppointmentById: async (id: string): Promise<AppointmentDetailsResponse> => {
    try {
      const response = await apiClient.get(`/customer/appointments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching appointment:', handleApiError(error));
      throw error;
    }
  },

  // PUT /api/customer/appointments/{id}/cancel - Cancel appointment
  cancelAppointment: async (id: string, reason?: string): Promise<AppointmentResponse> => {
    try {
      const response = await apiClient.put(`/customer/appointments/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error canceling appointment:', handleApiError(error));
      throw error;
    }
  },

  // PUT /api/customer/appointments/{id}/reschedule
  rescheduleAppointment: async (
    id: string,
    newDate: string,
    newTimeSlot: string
  ): Promise<AppointmentResponse> => {
    try {
      const response = await apiClient.put(`/customer/appointments/${id}/reschedule`, {
        appointmentDate: newDate,
        timeSlot: newTimeSlot,
      });
      return response.data;
    } catch (error) {
      console.error('Error rescheduling appointment:', handleApiError(error));
      throw error;
    }
  },

  // GET /api/customer/appointments/available-slots
  getAvailableSlots: async (date: string, serviceId: string): Promise<string[]> => {
    try {
      const response = await apiClient.get('/customer/appointments/available-slots', {
        params: { date, serviceId },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching available slots:', handleApiError(error));
      throw error;
    }
  },

  // GET /api/appointments/customer/{customerId} - Get all customer appointments
  getAllAppointments: async (customerId: string): Promise<AppointmentResponse[]> => {
    try {
      const response = await apiClient.get(`/appointments/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all appointments:', handleApiError(error));
      throw error;
    }
  },

  // DELETE /api/appointments/{appointmentId} - Delete appointment
  deleteAppointment: async (appointmentId: string): Promise<void> => {
    try {
      await apiClient.delete(`/appointments/${appointmentId}`);
    } catch (error) {
      console.error('Error deleting appointment:', handleApiError(error));
      throw error;
    }
  },
};

// ==================== VEHICLE API ====================
// Maps to VehicleController.java (Member 2 - navindu)
export const vehicleApi = {
  // GET /api/customer/vehicles - Get user's vehicles
  getMyVehicles: async (): Promise<VehicleResponse[]> => {
    try {
      const response = await apiClient.get('/customer/vehicles');
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicles:', handleApiError(error));
      throw error;
    }
  },

  // GET /api/customer/vehicles/{id}
  getVehicleById: async (id: string): Promise<VehicleResponse> => {
    try {
      const response = await apiClient.get(`/customer/vehicles/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching vehicle:', handleApiError(error));
      throw error;
    }
  },

  // POST /api/customer/vehicles
  createVehicle: async (vehicle: Omit<VehicleResponse, 'id' | 'customerId'>): Promise<VehicleResponse> => {
    try {
      const response = await apiClient.post('/customer/vehicles', vehicle);
      return response.data;
    } catch (error) {
      console.error('Error creating vehicle:', handleApiError(error));
      throw error;
    }
  },

  // PUT /api/customer/vehicles/{id}
  updateVehicle: async (
    id: string,
    vehicle: Partial<VehicleResponse>
  ): Promise<VehicleResponse> => {
    try {
      const response = await apiClient.put(`/customer/vehicles/${id}`, vehicle);
      return response.data;
    } catch (error) {
      console.error('Error updating vehicle:', handleApiError(error));
      throw error;
    }
  },

  // DELETE /api/customer/vehicles/{id}
  deleteVehicle: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/customer/vehicles/${id}`);
    } catch (error) {
      console.error('Error deleting vehicle:', handleApiError(error));
      throw error;
    }
  },
};

// ==================== PROJECT API ====================
// Maps to ProjectController.java (Customer Projects)
export interface ProjectResponse {
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
  time: string;
  status: string;
  assignedEmployee?: string;
  employeeName?: string;
  estimatedCost?: number;
  estimatedDurationDays?: number;
  adminNotes?: string;
  employeeNotes?: string;
  createdAt?: string;
  updatedAt?: string;
  assignedAt?: string;
  completedAt?: string;
}

export const projectApi = {
  // GET /api/projects/customer/{customerId} - Get all customer projects
  getAllProjects: async (customerId: string): Promise<ProjectResponse[]> => {
    try {
      const response = await apiClient.get(`/projects/customer/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all projects:', handleApiError(error));
      throw error;
    }
  },

  // GET /api/projects/customer/{customerId}/completed - Get completed projects
  getCompletedProjects: async (customerId: string): Promise<ProjectResponse[]> => {
    try {
      const response = await apiClient.get(`/projects/customer/${customerId}/completed`);
      return response.data;
    } catch (error) {
      console.error('Error fetching completed projects:', handleApiError(error));
      throw error;
    }
  },

  // DELETE /api/projects/{projectId} - Delete project
  deleteProject: async (projectId: string): Promise<void> => {
    try {
      await apiClient.delete(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error deleting project:', handleApiError(error));
      throw error;
    }
  },
};

// ==================== PROGRESS TRACKING API ====================
// Maps to ProgressViewController.java (Member 8 - aloka)
export const progressApi = {
  // GET /api/customer/appointments/{appointmentId}/progress
  getAppointmentProgress: async (appointmentId: string): Promise<ProgressResponse[]> => {
    try {
      const response = await apiClient.get(`/customer/appointments/${appointmentId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching progress:', handleApiError(error));
      throw error;
    }
  },
};

// Authentication API functions
export const authApi = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', handleApiError(error));
      throw error;
    }
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', handleApiError(error));
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      localStorage.removeItem('authToken');
    } catch (error) {
      console.error('Logout error:', handleApiError(error));
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', handleApiError(error));
      throw error;
    }
  },
};

// ==================== DASHBOARD API ====================
// Maps to DashboardController.java (Customer Dashboard)
export const dashboardApi = {
  // GET /api/dashboard/stats/{customerId} - Get dashboard statistics
  getDashboardStats: async (customerId: string) => {
    try {
      const response = await apiClient.get(`/dashboard/stats/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', handleApiError(error));
      throw error;
    }
  },

  // GET /api/dashboard/profile/{customerId} - Get customer profile
  getCustomerProfile: async (customerId: string) => {
    try {
      const response = await apiClient.get(`/dashboard/profile/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching customer profile:', handleApiError(error));
      throw error;
    }
  },

  // GET /api/dashboard/appointments/upcoming/{customerId} - Get upcoming appointments
  getUpcomingAppointments: async (customerId: string) => {
    try {
      const response = await apiClient.get(`/dashboard/appointments/upcoming/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming appointments:', handleApiError(error));
      throw error;
    }
  },

  // GET /api/dashboard/projects/ongoing/{customerId} - Get ongoing projects
  getOngoingProjects: async (customerId: string) => {
    try {
      const response = await apiClient.get(`/dashboard/projects/ongoing/${customerId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ongoing projects:', handleApiError(error));
      throw error;
    }
  },

  // Helper methods for customer ID management
  getCurrentCustomerId: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('customerId');
    }
    return null;
  },

  setCurrentCustomerId: (customerId: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('customerId', customerId);
    }
  },
};

// Export all APIs as default for backward compatibility
export default {
  service: serviceApi,
  appointment: appointmentApi,
  vehicle: vehicleApi,
  project: projectApi,
  progress: progressApi,
  auth: authApi,
  dashboard: dashboardApi,
};

// Also export serviceApi as vehicleServiceApi for backward compatibility with existing code
export const vehicleServiceApi = serviceApi;