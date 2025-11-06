'use client';

import { MapPin, User, Calendar, Clock } from 'lucide-react';
import { AppointmentProgress } from '@/types/progress.types';

interface CustomerProgressCardProps {
  appointment: AppointmentProgress;
  onViewTimeline: (appointment: AppointmentProgress) => void;
}

export default function CustomerProgressCard({
  appointment,
  onViewTimeline,
}: CustomerProgressCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-green-600';
    if (percentage >= 70) return 'bg-blue-600';
    if (percentage >= 40) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden h-[250px] flex flex-col">
      {/* Card Header */}
      <div className="p-4 flex-shrink-0">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
              {appointment.serviceName}
            </h3>
            <div className="flex flex-col gap-1.5 text-sm text-gray-600">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{appointment.customerName}</span>
              </div>
              {appointment.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{appointment.location}</span>
                </div>
              )}
              {appointment.scheduledDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{formatDate(appointment.scheduledDate)}</span>
                </div>
              )}
            </div>
          </div>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium border flex-shrink-0 ml-2 ${getStatusColor(
              appointment.status
            )}`}
          >
            {appointment.status}
          </span>
        </div>
      </div>

      {/* Progress Section */}
      <div className="px-4 pb-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Current Stage */}
          <div className="mb-2">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 font-medium">Current Stage:</span>
              <span className="text-gray-900 font-semibold">{appointment.currentStage}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-gray-600">Progress</span>
              <span className="font-bold text-gray-900">{appointment.progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${getProgressColor(
                  appointment.progressPercentage
                )}`}
                style={{ width: `${appointment.progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Latest Update */}
          {appointment.latestRemarks && (
            <div className="mb-2">
              <p className="text-xs text-gray-500 mb-1">Latest Update:</p>
              <p className="text-sm text-gray-700 line-clamp-2">{appointment.latestRemarks}</p>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-gray-100">
          <button
            onClick={() => onViewTimeline(appointment)}
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Clock className="w-4 h-4" />
            View Full Timeline
          </button>
        </div>
      </div>
    </div>
  );
}
