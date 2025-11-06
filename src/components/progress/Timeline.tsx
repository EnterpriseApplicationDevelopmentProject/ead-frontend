'use client';

import { useState, useEffect } from 'react';
import { X, Clock, User, TrendingUp, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { AppointmentProgress, TimelineItem } from '@/types/progress.types';
import { getProgressUpdates, type ProgressResponse } from '@/lib/api';

interface TimelineProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentProgress | null;
}

export default function Timeline({ isOpen, onClose, appointment }: TimelineProps) {
  const [updates, setUpdates] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && appointment) {
      fetchTimeline();
    }
  }, [isOpen, appointment]);

  const fetchTimeline = async () => {
    if (!appointment) return;

    setLoading(true);
    setError('');

    try {
      const data = await getProgressUpdates(appointment.appointmentId);
      
      // Transform API response to TimelineItem
      const transformedData: TimelineItem[] = data.map((item: ProgressResponse) => ({
        id: item.id,
        appointmentId: item.appointmentId,
        stage: item.stage,
        percentage: item.percentage,
        remarks: item.remarks,
        updatedAt: item.updatedAt,
        updatedBy: item.employeeName || 'Unknown',
        employeeName: item.employeeName || 'Unknown',
      }));

      setUpdates(transformedData);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load timeline';
      setError(errorMsg);
      console.error('Error fetching timeline:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'text-green-600 bg-green-100';
    if (percentage >= 70) return 'text-blue-600 bg-blue-100';
    if (percentage >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Progress Timeline</h2>
            <p className="text-sm text-gray-600 mt-1">{appointment.serviceName}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Customer: {appointment.customerName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Loading timeline...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">{error}</p>
                <button
                  onClick={fetchTimeline}
                  className="text-sm text-red-600 hover:text-red-700 font-medium mt-2 underline"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && updates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Updates Yet</h3>
              <p className="text-gray-600 text-center">
                Progress updates will appear here as work progresses
              </p>
            </div>
          )}

          {/* Timeline Items */}
          {!loading && !error && updates.length > 0 && (
            <div className="space-y-4">
              {updates.map((update, index) => (
                <div
                  key={update.id}
                  className="relative pl-8 pb-6 last:pb-0"
                >
                  {/* Timeline Line */}
                  {index < updates.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-0.5 bg-gray-200" />
                  )}

                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-1">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  {/* Update Card */}
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{update.stage}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {update.employeeName}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(update.updatedAt)}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getProgressColor(
                          update.percentage
                        )}`}
                      >
                        {update.percentage}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                          style={{ width: `${update.percentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Remarks */}
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700 leading-relaxed">{update.remarks}</p>
                    </div>

                    {/* Full Timestamp */}
                    <p className="text-xs text-gray-400 mt-2">{formatFullDate(update.updatedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
