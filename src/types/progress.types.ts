/**
 * Progress Types for Employee Operations
 */

export interface AppointmentProgress {
  appointmentId: number | string;
  serviceName: string;
  location: string;
  customerName: string;
  tag: string;
  progressPercentage: number;
  hoursLogged: number;
  estimatedHours: number;
  status: 'not started' | 'in progress' | 'paused' | 'completed';
  timerRunning: boolean;
  latestRemarks: string;
}

export interface ProgressUpdate {
  stage: string;
  percentage: number;
  remarks: string;
}

export interface TimeLog {
  hours: number;
  description: string;
}
