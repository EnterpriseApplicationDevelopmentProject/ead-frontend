"use client";

import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, User, CheckCircle, XCircle, UserPlus, DollarSign, FileText } from 'lucide-react';
import type { Project } from '@/types';

interface Employee {
  id: string | number;
  name: string;
  position: string;
  isAvailable: boolean;
  currentProjects: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      // Import mock projects
      const { mockProjects } = await import('@/data/mockData');
      
      // Mock employees with availability status
      const mockEmployees: Employee[] = [
        {
          id: 1,
          name: 'Robert Brown',
          position: 'Master Technician',
          isAvailable: true,
          currentProjects: 1,
        },
        {
          id: 2,
          name: 'James Miller',
          position: 'Senior Technician',
          isAvailable: true,
          currentProjects: 1,
        },
        {
          id: 3,
          name: 'David Smith',
          position: 'Technician',
          isAvailable: false,
          currentProjects: 3,
        },
        {
          id: 4,
          name: 'Carlos Rodriguez',
          position: 'Master Technician',
          isAvailable: true,
          currentProjects: 0,
        },
      ];

      setProjects(mockProjects);
      setEmployees(mockEmployees);
      setLoading(false);
    };

    fetchData();
  }, []);

  const filteredProjects = projects.filter(project =>
    project.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssignClick = (project: Project) => {
    setSelectedProject(project);
    setSelectedEmployee(project.assignedEmployee || '');
    setShowAssignModal(true);
  };

  const handleAssignEmployee = () => {
    if (!selectedEmployee || !selectedProject) {
      alert('Please select an employee');
      return;
    }

    // Only update the project with assigned employee - NO automatic availability updates
    setProjects(projects.map(proj =>
      proj.id === selectedProject.id
        ? { ...proj, assignedEmployee: selectedEmployee }
        : proj
    ));

    alert(`Employee ${selectedEmployee} has been assigned successfully!`);

    setShowAssignModal(false);
    setSelectedProject(null);
    setSelectedEmployee('');
  };

  const handleCloseModal = () => {
    setShowAssignModal(false);
    setSelectedProject(null);
    setSelectedEmployee('');
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  const availableEmployees = employees.filter(emp => emp.isAvailable);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Projects Management</h1>
        <p className="text-gray-600">View and assign employees to customer projects</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Total Projects</div>
          <div className="text-2xl font-bold text-gray-800">{projects.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {projects.filter(p => p.status === 'Pending').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Ongoing</div>
          <div className="text-2xl font-bold text-blue-600">
            {projects.filter(p => p.status === 'Ongoing').length}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-1">Completed</div>
          <div className="text-2xl font-bold text-green-600">
            {projects.filter(p => p.status === 'Completed').length}
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
          placeholder="Search by task name, vehicle number, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
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
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No projects found
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {project.taskName}
                      </div>
                      <div className="text-sm text-gray-500">{project.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{project.vehicleNumber}</div>
                      <div className="text-sm text-gray-500">{project.vehicleType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-900">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {project.startDate}
                      </div>
                      {project.completedDate && (
                        <div className="text-sm text-gray-500 mt-1">
                          Completed: {project.completedDate}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.estimatedCost && (
                        <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
                          <DollarSign className="w-4 h-4" />
                          {project.estimatedCost}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {project.assignedEmployee ? (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-900">
                            {project.assignedEmployee}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleAssignClick(project)}
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        {project.assignedEmployee ? 'Reassign' : 'Assign'}
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
      {showAssignModal && selectedProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Assign Employee to Project</h2>

              {/* Project Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">Project Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-gray-600">Task:</span>
                      <span className="ml-2 font-medium">{selectedProject.taskName}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-gray-600 ml-6">Description:</span>
                    <span className="ml-2 text-gray-700">{selectedProject.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600 ml-6">Vehicle:</span>
                    <span className="ml-2 font-medium">{selectedProject.vehicleNumber} ({selectedProject.vehicleType})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Start Date:</span>
                    <span className="ml-2 font-medium">{selectedProject.startDate}</span>
                  </div>
                  {selectedProject.estimatedCost && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">Estimated Cost:</span>
                      <span className="ml-2 font-medium text-green-600">${selectedProject.estimatedCost}</span>
                    </div>
                  )}
                  {selectedProject.notes && (
                    <div className="flex items-start gap-2 mt-2 p-2 bg-yellow-50 rounded">
                      <span className="text-gray-600">Notes:</span>
                      <span className="ml-2 text-gray-700">{selectedProject.notes}</span>
                    </div>
                  )}
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
                      onClick={() => employee.isAvailable && setSelectedEmployee(employee.name)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedEmployee === employee.name
                          ? 'border-blue-500 bg-blue-50'
                          : employee.isAvailable
                          ? 'border-gray-300 hover:border-blue-300 hover:bg-gray-50'
                          : 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-semibold">
                            {employee.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{employee.name}</div>
                            <div className="text-sm text-gray-600">{employee.position}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-sm text-gray-600">
                            Current: {employee.currentProjects} projects
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
