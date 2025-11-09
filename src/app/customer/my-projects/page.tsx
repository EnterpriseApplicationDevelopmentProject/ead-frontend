'use client';

import { useEffect, useState } from 'react';
import { FolderKanban, Clock, CheckCircle, XCircle, Plus, Calendar } from 'lucide-react';
import { projectService, type Project } from '@/lib/api/projectService';

export default function MyProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'requesting' | 'assigned' | 'inprogress' | 'completed'>('all');
  const [error, setError] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newVehicleModel, setNewVehicleModel] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const allProjects = await projectService.getAllProjects();
      setProjects(allProjects);
    } catch (error) {
      console.error('Failed to load projects:', error);
      setError('Failed to load projects. Please try again later.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // helper to derive vehicle model from description if stored as 'Vehicle Model: <value>'
  const getVehicleModel = (p: Project) => {
    if (!p.description) return p.vehicleNumber || '';
    const m = p.description.match(/Vehicle Model:\s*(.+)/i);
    return m ? m[1].trim() : p.vehicleNumber || '';
  };

  const handleCreateProject = async () => {
    if (!newName || !newDescription || !newVehicleModel || !newStartDate) {
      alert('Please fill in all fields');
      return;
    }
    try {
      setSubmitting(true);
      const combinedDescription = `${newDescription}\n\nVehicle Model: ${newVehicleModel}`;
      await projectService.createProject({
        taskName: newName,
        description: combinedDescription,
        startDate: newStartDate
        // status will be set to REQUESTING by backend automatically
      });
      // reset and refresh
      setNewName('');
      setNewDescription('');
      setNewVehicleModel('');
      setNewStartDate('');
      setShowNewForm(false);
      await loadProjects();
      alert('Project created successfully');
    } catch (err) {
      console.error('Failed to create project', err);
      alert('Failed to create project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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

  const filteredProjects = projects.filter(proj => {
    const status = proj.status.toLowerCase();
    if (activeTab === 'all') return true;
    if (activeTab === 'requesting') return status === 'requesting';
    if (activeTab === 'assigned') return status === 'assigned';
    if (activeTab === 'inprogress') return status === 'in progress' || status === 'in_progress';
    if (activeTab === 'completed') return status === 'completed';
    return true;
  });

  const requestingCount = projects.filter(p => p.status.toLowerCase() === 'requesting').length;
  const assignedCount = projects.filter(p => p.status.toLowerCase() === 'assigned').length;
  const inProgressCount = projects.filter(p => {
    const s = p.status.toLowerCase();
    return s === 'in progress' || s === 'in_progress';
  }).length;
  const completedCount = projects.filter(p => p.status.toLowerCase() === 'completed').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">My Projects</h1>
            <p className="text-gray-600">View and manage your custom service projects</p>
          </div>
          <button
            onClick={() => setShowNewForm(!showNewForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            New Project
          </button>
        </div>
      </div>

      {/* New Project Form */}
      {showNewForm && (
        <div className="mb-6 bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Create New Project</h2>
            <button
              onClick={() => setShowNewForm(false)}
              className="text-gray-500 hover:text-gray-700 font-medium"
            >
              ✕ Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Enter project name"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Vehicle Model</label>
              <input
                type="text"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newVehicleModel}
                onChange={e => setNewVehicleModel(e.target.value)}
                placeholder="e.g., Toyota Camry 2020"
              />
            </div>
            <div className="flex flex-col md:col-span-2">
              <label className="text-sm font-medium text-gray-700 mb-2">Project Description</label>
              <textarea
                className="border border-gray-300 rounded-lg px-3 py-2 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newDescription}
                onChange={e => setNewDescription(e.target.value)}
                placeholder="Describe what kind of project you want"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newStartDate}
                onChange={e => setNewStartDate(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleCreateProject}
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {submitting ? 'Creating...' : 'Create Project'}
            </button>
            <button
              onClick={() => setShowNewForm(false)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Requesting</p>
              <p className="text-3xl font-bold text-yellow-600">{requestingCount}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Assigned</p>
              <p className="text-3xl font-bold text-blue-600">{assignedCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-orange-600">{inProgressCount}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('requesting')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'requesting'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Requesting ({requestingCount})
            </button>
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'assigned'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Assigned ({assignedCount})
            </button>
            <button
              onClick={() => setActiveTab('inprogress')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'inprogress'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'completed'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="bg-white rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {activeTab === 'all' && 'No projects found'}
                    {activeTab === 'requesting' && 'No requesting projects'}
                    {activeTab === 'assigned' && 'No assigned projects'}
                    {activeTab === 'inprogress' && 'No projects in progress'}
                    {activeTab === 'completed' && 'No completed projects'}
                  </td>
                </tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {project.taskName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {project.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(project.startDate)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {project.progressPercentage ?? 0}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              (project.progressPercentage ?? 0) === 100
                                ? 'bg-green-600'
                                : (project.progressPercentage ?? 0) > 50
                                ? 'bg-blue-600'
                                : 'bg-yellow-500'
                            }`}
                            style={{ width: `${project.progressPercentage ?? 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(project.status)}`}>
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
