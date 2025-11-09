"use client";

import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, User, CheckCircle, XCircle, UserPlus } from 'lucide-react';
import type { Appointment } from '@/types';

interface Employee {
  id: string | number;
  name: string;
  position: string;
  isAvailable: boolean;
  currentAppointments: number;
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments from admin API
        const { adminService } = await import('@/lib/adminService');
        const appointmentsData = await adminService.getAllAppointments();
        const employeesData = await adminService.getAllEmployees();
        
        // Transform backend employee data to match frontend interface
        const transformedEmployees = employeesData.map((emp: any) => ({
          id: emp.id,
          name: `${emp.firstName} ${emp.lastName}`,
          position: emp.role,
          isAvailable: true, // Default to available
          currentAppointments: 0, // Default to 0
        }));

        // Create a map of employee IDs to names for quick lookup
        const employeeMap = new Map(transformedEmployees.map(emp => [emp.id, emp.name]));
        
        // Transform backend appointment data to match frontend interface
        const transformedAppointments = appointmentsData.map((apt: any) => ({
          id: apt.appointmentId,
          serviceName: apt.service,
          vehicleNumber: apt.vehicleNo,
          date: apt.date,
          time: apt.startTime,
          status: apt.status,
          assignedEmployee: apt.employee ? employeeMap.get(apt.employee.id) || null : null, // Get employee name if assigned
        }));

        setAppointments(transformedAppointments);
        setEmployees(transformedEmployees);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data on error
        const { mockAppointments } = await import('@/data/mockData');
        const mockEmployees: Employee[] = [
          {
            id: 1,
            name: 'Mike Wilson',
            position: 'Senior Technician',
            isAvailable: true,
            currentAppointments: 0,
          },
          {
            id: 2,
            name: 'Robert Martinez',
            position: 'Technician',
            isAvailable: true,
            currentAppointments: 0,
          },
        ];
        setAppointments(mockAppointments);
        setEmployees(mockEmployees);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredAppointments = appointments.filter(appointment =>
    appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'requesting':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
      case 'in_progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setSelectedEmployee(appointment.assignedEmployee || '');
    setShowAssignModal(true);
  };

  const handleAssignEmployee = async () => {
    if (!selectedEmployee || !selectedAppointment) {
      alert('Please select an employee');
      return;
    }

    try {
      const { adminService } = await import('@/lib/adminService');
      await adminService.assignEmployeeToAppointment(
        selectedAppointment.id,
        Number(selectedEmployee)
      );

      // Refresh the appointments list to show the updated assignment
      const appointmentsData = await adminService.getAllAppointments();
      
      // Create a map of employee IDs to names for quick lookup
      const employeeMap = new Map(employees.map(emp => [emp.id, emp.name]));
      
      const transformedAppointments = appointmentsData.map((apt: any) => ({
        id: apt.appointmentId,
        serviceName: apt.service,
        vehicleNumber: apt.vehicleNo,
        date: apt.date,
        time: apt.startTime,
        status: apt.status,
        assignedEmployee: apt.employee ? employeeMap.get(apt.employee.id) || null : null,
      }));
      
      setAppointments(transformedAppointments);

      alert(`Employee has been assigned successfully!`);
    } catch (error) {
      console.error('Error assigning employee:', error);
      alert('Failed to assign employee. Please try again.');
    }

    setShowAssignModal(false);
    setSelectedAppointment(null);
    setSelectedEmployee('');
  };

  const handleCloseModal = () => {
    setShowAssignModal(false);
    setSelectedAppointment(null);
    setSelectedEmployee('');
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  const availableEmployees = employees.filter(emp => emp.isAvailable);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Appointments Management</h1>
        <p className="text-gray-600">View and assign employees to customer appointments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Total Appointments</div>
          <div className="text-2xl font-bold text-gray-800">{appointments.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Upcoming</div>
          <div className="text-2xl font-bold text-blue-600">
            {appointments.filter(a => {
              const status = a.status?.toUpperCase();
              return status === 'REQUESTING' || status === 'ASSIGNED' || status === 'IN_PROGRESS';
            }).length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-600">
            {appointments.filter(a => a.status?.toUpperCase() === 'COMPLETED').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Available Employees</div>
          <div className="text-2xl font-bold text-purple-600">{availableEmployees.length}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by service, vehicle number, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No appointments found
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {appointment.serviceName}
                      </div>
                      <div className="text-sm text-gray-500">ID: {appointment.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.vehicleNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {appointment.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {appointment.time}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {appointment.assignedEmployee ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-900">
                            {appointment.assignedEmployee}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleAssignClick(appointment)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        {appointment.assignedEmployee ? 'Reassign' : 'Assign'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assign Employee Modal */}
      {showAssignModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Assign Employee</h2>

              {/* Appointment Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Appointment Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Service:</span>
                    <span className="ml-2 font-medium">{selectedAppointment.serviceName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="ml-2 font-medium">{selectedAppointment.vehicleNumber}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Date:</span>
                    <span className="ml-2 font-medium">{selectedAppointment.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Time:</span>
                    <span className="ml-2 font-medium">{selectedAppointment.time}</span>
                  </div>
                </div>
              </div>

              {/* Employee Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Available Employee
                </label>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {employees.map((employee) => (
                    <div
                      key={employee.id}
                      onClick={() => employee.isAvailable && setSelectedEmployee(employee.id.toString())}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedEmployee === employee.id.toString()
                          ? 'border-blue-500 bg-blue-50'
                          : employee.isAvailable
                          ? 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                          : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                            {employee.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-600">{employee.position}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-gray-600">
                            Current: {employee.currentAppointments} appointments
                          </div>
                          {employee.isAvailable ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAssignEmployee}
                  disabled={!selectedEmployee}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                  Assign Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
