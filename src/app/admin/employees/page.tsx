"use client";

import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, Calendar, Eye, Edit, Trash2, Briefcase, Award } from 'lucide-react';

interface Employee {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  employeeId: string;
  position: string;
  department: string;
  joinedDate: string;
  specialization: string[];
  completedServices: number;
  status: 'active' | 'on-leave' | 'inactive';
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    status: 'active' as 'active' | 'on-leave' | 'inactive',
  });

  useEffect(() => {
    // Simulate fetching employees
    const fetchEmployees = async () => {
      // Mock data
      const mockEmployees: Employee[] = [
        {
          id: 1,
          name: 'Mike Wilson',
          email: 'mike.wilson@automobile.com',
          phone: '+1 234-567-9001',
          employeeId: 'EMP-2024-001',
          position: 'Senior Technician',
          department: 'Service Department',
          joinedDate: '2022-03-15',
          specialization: ['Engine Repair', 'Brake Systems', 'Electrical'],
          completedServices: 156,
          status: 'active',
        },
        {
          id: 2,
          name: 'Robert Martinez',
          email: 'robert.m@automobile.com',
          phone: '+1 234-567-9002',
          employeeId: 'EMP-2024-002',
          position: 'Technician',
          department: 'Service Department',
          joinedDate: '2023-01-20',
          specialization: ['Tire Service', 'Oil Change', 'Diagnostics'],
          completedServices: 98,
          status: 'active',
        },
        {
          id: 3,
          name: 'Jennifer Lee',
          email: 'jennifer.l@automobile.com',
          phone: '+1 234-567-9003',
          employeeId: 'EMP-2024-003',
          position: 'Service Advisor',
          department: 'Customer Service',
          joinedDate: '2023-06-10',
          specialization: ['Customer Relations', 'Service Scheduling'],
          completedServices: 210,
          status: 'active',
        },
        {
          id: 4,
          name: 'Carlos Rodriguez',
          email: 'carlos.r@automobile.com',
          phone: '+1 234-567-9004',
          employeeId: 'EMP-2024-004',
          position: 'Master Technician',
          department: 'Service Department',
          joinedDate: '2021-09-05',
          specialization: ['Transmission', 'Engine', 'Suspension'],
          completedServices: 245,
          status: 'active',
        },
        {
          id: 5,
          name: 'Amanda Taylor',
          email: 'amanda.t@automobile.com',
          phone: '+1 234-567-9005',
          employeeId: 'EMP-2024-005',
          position: 'Technician',
          department: 'Service Department',
          joinedDate: '2023-11-15',
          specialization: ['Paint & Body', 'Detailing'],
          completedServices: 42,
          status: 'on-leave',
        },
      ];

      setEmployees(mockEmployees);
      setLoading(false);
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      department: employee.department,
      status: employee.status,
    });
    setShowEditModal(true);
  };

  const handleDeleteEmployee = (id: string | number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(employees.filter(emp => emp.id !== id));
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setSelectedEmployee(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      status: 'active',
    });
  };

  const handleSaveEmployee = () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.position || !formData.department) {
      alert('Please fill in all required fields');
      return;
    }

    if (showAddModal) {
      // Add new employee
      const newEmployee: Employee = {
        id: Date.now(),
        ...formData,
        employeeId: `EMP-2024-${String(employees.length + 1).padStart(3, '0')}`,
        joinedDate: new Date().toISOString().split('T')[0],
        specialization: [],
        completedServices: 0,
      };
      setEmployees([...employees, newEmployee]);
    } else if (showEditModal && selectedEmployee) {
      // Update existing employee
      setEmployees(employees.map(emp =>
        emp.id === selectedEmployee.id
          ? { ...emp, ...formData }
          : emp
      ));
    }

    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employees...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Employees</h1>
        <p className="text-gray-600">Manage all registered employees</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, employee ID, or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="text-sm text-gray-600">
          Total: <span className="font-semibold">{filteredEmployees.length}</span> employees
        </div>
      </div>

      {/* Add Employee Button */}
      <div className="mb-6 flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <span className="text-xl">+</span>
          Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Services
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
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No employees found
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-semibold">
                          {employee.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{employee.position}</div>
                          <div className="text-sm text-gray-500">{employee.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-900">
                          {employee.completedServices}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(employee.status)}`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewEmployee(employee)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditEmployee(employee)}
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteEmployee(employee.id)}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Employee Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {showAddModal ? 'Add New Employee' : 'Edit Employee'}
              </h2>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter employee name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="employee@automobile.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1 234-567-8900"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position *
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select position</option>
                    <option value="Master Technician">Master Technician</option>
                    <option value="Senior Technician">Senior Technician</option>
                    <option value="Technician">Technician</option>
                    <option value="Service Advisor">Service Advisor</option>
                    <option value="Parts Specialist">Parts Specialist</option>
                  </select>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select department</option>
                    <option value="Service Department">Service Department</option>
                    <option value="Customer Service">Customer Service</option>
                    <option value="Parts Department">Parts Department</option>
                    <option value="Management">Management</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'on-leave' | 'inactive' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEmployee}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showAddModal ? 'Add Employee' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Employee Modal */}
      {showViewModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Employee Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white text-2xl font-semibold">
                    {selectedEmployee.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedEmployee.name}</h3>
                    <p className="text-gray-500">{selectedEmployee.employeeId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="font-medium">{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Phone</label>
                    <p className="font-medium">{selectedEmployee.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Position</label>
                    <p className="font-medium">{selectedEmployee.position}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Department</label>
                    <p className="font-medium">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Joined Date</label>
                    <p className="font-medium">
                      {new Date(selectedEmployee.joinedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Completed Services</label>
                    <p className="font-medium">{selectedEmployee.completedServices}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Status</label>
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(selectedEmployee.status)}`}>
                      {selectedEmployee.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500 block mb-2">Specializations</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.specialization.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
