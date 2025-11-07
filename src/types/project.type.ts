/**
 * Project Types
 * Matching backend ProjectDTO structure
 */

export enum ProjectStatus {
  REQUESTING = 'REQUESTING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface ProjectDTO {
  projectId?: string;
  name: string;
  description: string;
  customerId?: string;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate?: string;
  status: ProjectStatus | string;
  progressPercentage?: number;
}

// Frontend-friendly project interface
export interface Project {
  id: string;
  customerId?: string;
  vehicleId?: string;
  vehicleNumber?: string;
  vehicleType?: string;
  taskName: string;
  description: string;
  startDate: string;
  estimatedEndDate?: string;
  completedDate?: string;
  endDate?: string;
  time?: string;
  status: string;
  assignedEmployee?: string;
  approvedBy?: string;
  estimatedCost?: number;
  notes?: string;
}
