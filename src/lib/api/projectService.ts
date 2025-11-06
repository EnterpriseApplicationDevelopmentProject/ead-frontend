import { axiosInstance } from '@/lib/apiClient';
import type { Project as AppProject } from '@/types';

export interface ProjectDTO {
  projectId?: string;
  id?: string;
  customerId?: string;
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  status?: string; // PLANNED | IN_PROGRESS | COMPLETED | CANCELLED | ON_HOLD
}

const mapDtoToProject = (d: ProjectDTO): AppProject => {
  const statusEnum = String(d.status || '').toUpperCase();
  const statusMap: Record<string, AppProject['status']> = {
    PLANNED: 'Ongoing',
    IN_PROGRESS: 'Ongoing',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    ON_HOLD: 'Ongoing',
  };
  const status = statusMap[statusEnum] || 'Ongoing';

  return {
    id: String(d.projectId || d.id || ''),
    customerId: String(d.customerId || ''),
    vehicleId: '',
    vehicleNumber: '',
    vehicleType: '',
    taskName: String(d.name || ''),
    description: String(d.description || ''),
    startDate: String(d.startDate || ''),
    estimatedEndDate: d.endDate ? String(d.endDate) : undefined,
    completedDate: undefined,
    time: '',
    status,
  };
};

export const projectService = {
  // Get projects for current authenticated customer (principal inferred by backend)
  getAllProjects: async (): Promise<AppProject[]> => {
    const { data } = await axiosInstance.get('/projects');
    return (data || []).map((d: ProjectDTO) => mapDtoToProject(d));
  },

  // Get projects for a specific customer id (if needed explicitly)
  getCustomerProjects: async (customerId: string): Promise<AppProject[]> => {
    const { data } = await axiosInstance.get('/projects', { params: { customerId } });
    return (data || []).map((d: ProjectDTO) => mapDtoToProject(d));
  },

  getProjectById: async (projectId: string): Promise<AppProject | undefined> => {
    const { data } = await axiosInstance.get(`/projects/${encodeURIComponent(projectId)}`);
    return data ? mapDtoToProject(data as ProjectDTO) : undefined;
  },

  createProject: async (payload: { name: string; description: string; startDate: string; status?: string; }): Promise<AppProject> => {
    const { data } = await axiosInstance.post('/projects', payload);
    return mapDtoToProject(data as ProjectDTO);
  },

  updateProject: async (projectId: string, payload: Partial<ProjectDTO>): Promise<AppProject> => {
    const { data } = await axiosInstance.put(`/projects/${encodeURIComponent(projectId)}`, payload);
    return mapDtoToProject(data as ProjectDTO);
  },

  deleteProject: async (projectId: string): Promise<void> => {
    await axiosInstance.delete(`/projects/${encodeURIComponent(projectId)}`);
  }
};
