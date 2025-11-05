/**
 * API Module for Employee Operations
 */

export interface Appointment {
  id: string | number;
  customerId?: string;
  vehicleId?: string;
  vehicleNumber?: string;
  serviceName: string;
  date?: string;
  time?: string;
  status?: string;
  assignedEmployee?: string;
  approvedBy?: string;
  notes?: string;
  location?: string;
  customerName?: string;
  type?: string;
  progressPercentage?: number;
  actualHours?: number;
  estimatedHours?: number;
  timerRunning?: boolean;
}

// Simulate network delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Get appointments assigned to employee
 */
export async function getEmployeeAppointments(employeeId?: string): Promise<Appointment[]> {
  await delay();
  // Mock data - replace with actual API call
  return [
    {
      id: 1,
      serviceName: 'Oil Change',
      location: 'Bay 1',
      customerName: 'John Doe',
      type: 'Appointment',
      progressPercentage: 25,
      actualHours: 0.5,
      estimatedHours: 2,
      status: 'in progress',
      timerRunning: false,
      notes: 'Regular maintenance check',
    },
    {
      id: 2,
      serviceName: 'Brake Inspection',
      location: 'Bay 2',
      customerName: 'Jane Smith',
      type: 'Project',
      progressPercentage: 60,
      actualHours: 1.5,
      estimatedHours: 3,
      status: 'in progress',
      timerRunning: false,
      notes: 'Front brake pads need replacement',
    }
  ];
}

/**
 * Start timer for an appointment
 */
export async function startTimer(appointmentId: string | number): Promise<void> {
  await delay();
  console.log('Timer started for appointment:', appointmentId);
}

/**
 * Pause timer for an appointment
 */
export async function pauseTimer(appointmentId: string | number): Promise<void> {
  await delay();
  console.log('Timer paused for appointment:', appointmentId);
}

/**
 * Log time for an appointment
 */
export async function logTime(appointmentId: string | number, timeData: any): Promise<void> {
  await delay();
  console.log('Time logged for appointment:', appointmentId, timeData);
}

/**
 * Update appointment progress
 */
export async function updateProgress(appointmentId: string | number, progressData: any): Promise<void> {
  await delay();
  console.log('Progress updated for appointment:', appointmentId, progressData);
}
