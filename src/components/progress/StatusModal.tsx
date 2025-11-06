'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { AppointmentProgress } from '@/types/progress.types';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentProgress | null;
  onUpdate: (data: { stage: string; percentage: number; remarks: string }) => Promise<void>;
}

export default function StatusModal({
  isOpen,
  onClose,
  appointment,
  onUpdate,
}: StatusModalProps) {
  const [stage, setStage] = useState('');
  const [percentage, setPercentage] = useState(0);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (appointment) {
      setStage(appointment.currentStage);
      setPercentage(appointment.progressPercentage);
      setRemarks(appointment.latestRemarks || '');
      setError('');
    }
  }, [appointment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (percentage < 0 || percentage > 100) {
      setError('Percentage must be between 0 and 100');
      return;
    }

    if (!stage.trim()) {
      setError('Please select a stage');
      return;
    }

    if (!remarks.trim()) {
      setError('Please provide remarks about the progress');
      return;
    }

    setLoading(true);
    try {
      await onUpdate({ stage, percentage, remarks });
      onClose();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to update status';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Update Progress Status</h2>
            <p className="text-sm text-gray-600 mt-1">{appointment.serviceName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Stage Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Current Stage <span className="text-red-500">*</span>
            </label>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
              disabled={loading}
            >
              <option value="">Select stage</option>
              <option value="Inspection">Inspection</option>
              <option value="Diagnosis">Diagnosis</option>
              <option value="Parts Ordering">Parts Ordering</option>
              <option value="Repair In Progress">Repair In Progress</option>
              <option value="Quality Check">Quality Check</option>
              <option value="Final Testing">Final Testing</option>
              <option value="Ready for Pickup">Ready for Pickup</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Progress Percentage */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Progress Percentage <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                disabled={loading}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                %
              </span>
            </div>
            {/* Progress Preview */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Remarks / Update Notes <span className="text-red-500">*</span>
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              placeholder="Describe what work has been completed and any important details..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              This will be visible to the customer in real-time
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Updating...
                </span>
              ) : (
                'Update Progress'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
