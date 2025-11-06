'use client';

import { Clock, CheckCircle } from 'lucide-react';
import { AppointmentProgress } from '@/types/progress.types';

interface ProgressCardProps {
  appointment: AppointmentProgress;
  onUpdateStatus: (appointment: AppointmentProgress) => void;
  onViewTimeline: (appointment: AppointmentProgress) => void;
}

export default function ProgressCard({
  appointment,
  onUpdateStatus,
  onViewTimeline,
}: ProgressCardProps) {
  // Get status badge color matching the design
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'in progress':
        return 'bg-blue-500 text-white';
      case 'paused':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  // Get progress bar color - always blue like in design
  const getProgressColor = () => 'bg-blue-600';

  // Format the type badge (Appointment/Project)
  const getTypeBadge = () => {
    return appointment.vehicleInfo ? 'Appointment' : 'Project';
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              {appointment.serviceName}
            </h3>
            <p className="text-sm text-gray-500">
              Customer: {appointment.customerName}
            </p>
          </div>
          {/* Status Badge */}
          <span
            className={`px-3 py-1 rounded text-xs font-medium ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status}
          </span>
        </div>

        {/* Type Badge */}
        <div className="mb-4">
          <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
            {getTypeBadge()}
          </span>
        </div>

        {/* Progress Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-semibold text-gray-900">
              {appointment.progressPercentage}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full ${getProgressColor()} transition-all duration-500 ease-out`}
              style={{ width: `${appointment.progressPercentage}%` }}
            />
          </div>

          {/* Time Info */}
          {appointment.estimatedHours && (
            <div className="flex items-center gap-1 text-sm text-gray-600 mt-3">
              <Clock className="w-4 h-4" />
              <span>Est: {appointment.estimatedHours}h</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 flex gap-2">
        <button
          onClick={() => onUpdateStatus(appointment)}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm font-medium flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          Update Status
        </button>
        <button
          onClick={() => onViewTimeline(appointment)}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Log Time
        </button>
      </div>
    </div>
  );
}
