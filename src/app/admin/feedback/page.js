'use client';

import { useState, useEffect } from 'react';
import { getDoctorName } from '../../../utils/doctorUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function FeedbackManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    compliments: 0,
    complaints: 0,
    suggestions: 0,
    avgRating: 0,
    pending: 0,
    completed: 0
  });
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Fetch feedback data from backend (public access for admin)
  const fetchFeedbackData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching feedback data from:', `${API_BASE_URL}/feedback/public/admin`);
      
      const response = await fetch(`${API_BASE_URL}/feedback/public/admin`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Feedback API response:', data);

      if (data.success && data.data) {
        setFeedbacks(data.data);
        calculateStats(data.data);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error) {
      console.error('Error fetching feedback:', error);
      setError(error.message || 'Failed to load feedback data');
      // Set empty data on error
      setFeedbacks([]);
      setStats({
        total: 0,
        compliments: 0,
        complaints: 0,
        suggestions: 0,
        avgRating: 0,
        pending: 0,
        completed: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from feedback data
  const calculateStats = (feedbackData) => {
    const total = feedbackData.length;
    const compliments = feedbackData.filter(f => f.feedbackType === 'compliment').length;
    const complaints = feedbackData.filter(f => f.feedbackType === 'complaint').length;
    const suggestions = feedbackData.filter(f => f.feedbackType === 'suggestion').length;
    const pending = feedbackData.filter(f => f.status === 'pending').length;
    const completed = feedbackData.filter(f => f.status === 'completed').length;
    
    const totalRating = feedbackData.reduce((sum, f) => sum + (f.rating || 0), 0);
    const avgRating = total > 0 ? (totalRating / total).toFixed(1) : 0;

    setStats({
      total,
      compliments,
      complaints,
      suggestions,
      avgRating: parseFloat(avgRating),
      pending,
      completed
    });
  };

  // Auto-refresh effect
  useEffect(() => {
    fetchFeedbackData();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchFeedbackData();
      }, 30000); // Refresh every 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  // Utility functions
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts[parts.length - 1]?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

  const getFullName = (user) => {
    if (!user) return 'Unknown User';
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || user.firstName || user.lastName || 'Unknown User';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const getProfilePicture = (user) => {
    if (user?.profilePicture) {
      // Handle both full URLs and relative paths
      if (user.profilePicture.startsWith('http')) {
        return user.profilePicture;
      }
      return `${API_BASE_URL.replace('/api/v1', '')}/${user.profilePicture}`;
    }
    return null;
  };

  // Filter feedbacks based on active tab and search
  const filteredFeedbacks = feedbacks.filter(feedback => {
    const matchesTab = activeTab === 'all' || feedback.feedbackType === activeTab;
    const matchesSearch = !searchTerm || 
      getFullName(feedback.patient).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getDoctorName(feedback.doctor).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feedback.comment && feedback.comment.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesTab && matchesSearch;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityDot = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-400';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-400';
    }
  };

  const exportCSV = () => {
    const headers = ['ID','Type','Patient','Doctor','Rating','Date','Status','Comment'];
    const rows = filteredFeedbacks.map(f => [
      f._id,
      f.feedbackType,
      getFullName(f.patient),
      getDoctorName(f.doctor),
      f.rating || '',
      formatDate(f.createdAt),
      f.status,
      f.comment || '',
    ]);
    const csv = [headers, ...rows].map(r => r.map(String).map(v => '"' + v.replace(/"/g,'""') + '"').join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedback_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading Feedback...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && feedbacks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Feedback</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchFeedbackData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const exportExcel = () => {
    const tableRows = feedbacks.map(f => `
      <tr>
        <td>${f.id}</td>
        <td>${f.type}</td>
        <td>${f.title}</td>
        <td>${f.patient}</td>
        <td>${f.patientId || ''}</td>
        <td>${f.type === 'feedback' ? (f.rating ?? '') : ''}</td>
        <td>${f.date}</td>
        <td>${f.priority}</td>
        <td>${f.status}</td>
      </tr>
    `).join('');
    const html = `
      <html><head><meta charset="UTF-8" /></head><body>
        <table border="1">
          <tr><th>ID</th><th>Type</th><th>Title</th><th>Patient</th><th>PatientID</th><th>Rating</th><th>Date</th><th>Priority</th><th>Status</th></tr>
          ${tableRows}
        </table>
      </body></html>
    `;
    const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'feedback_export.xls';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header & Breadcrumbs */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <nav className="text-sm text-gray-600 mb-2" aria-label="Breadcrumb">
              <ol className="list-reset inline-flex">
                <li>Home</li>
                <li className="mx-2">›</li>
                <li>Admin</li>
                <li className="mx-2">›</li>
                <li className="text-gray-900 font-medium">Feedback</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
            <p className="text-gray-600 mt-1">Manage and respond to patient feedback</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-gray-500">
              {new Date().toLocaleDateString('en-GB')}
            </div>
            <button 
              onClick={fetchFeedbackData}
              className="px-3 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 text-sm mr-2"
            >
              🔄 Refresh
            </button>
            <button 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors mr-2 ${
                autoRefresh 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {autoRefresh ? '🔴 Stop Auto-Refresh' : '🟢 Auto-Refresh'}
            </button>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center">
              <div className="text-amber-600 mr-2">⚠️</div>
              <p className="text-sm text-amber-800">{error}</p>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <div className="flex items-center">
                  <p className="text-3xl font-bold text-gray-900">{stats.avgRating}</p>
                  <div className="ml-2 flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`h-4 w-4 ${i < Math.floor(stats.avgRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Type Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Feedback Distribution</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Compliments</span>
                </div>
                <span className="font-semibold text-green-600">{stats.compliments}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Complaints</span>
                </div>
                <span className="font-semibold text-red-600">{stats.complaints}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Suggestions</span>
                </div>
                <span className="font-semibold text-blue-600">{stats.suggestions}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
                <div className="font-medium text-blue-900">Review Pending</div>
                <div className="text-sm text-blue-700">{stats.pending} items need attention</div>
              </button>
              <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
                <div className="font-medium text-green-900">High Ratings</div>
                <div className="text-sm text-green-700">View 5-star feedback</div>
              </button>
              <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg text-left transition-colors">
                <div className="font-medium text-red-900">Complaints</div>
                <div className="text-sm text-red-700">{stats.complaints} complaints to address</div>
              </button>
              <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left transition-colors">
                <div className="font-medium text-yellow-900">Export Report</div>
                <div className="text-sm text-yellow-700">Generate detailed report</div>
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex gap-4 items-center">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {['all', 'compliment', 'complaint', 'suggestion'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1) + 's'}
                      <span className="ml-2 text-xs">
                        ({tab === 'all' ? stats.total : stats[tab + 's'] || 0})
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Feedback Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFeedbacks.length > 0 ? (
                  filteredFeedbacks.map((feedback) => (
                    <tr key={feedback._id} className="hover:bg-gray-50 transition-colors">
                      {/* Patient */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            {getProfilePicture(feedback.patient) ? (
                              <img
                                src={getProfilePicture(feedback.patient)}
                                alt={getFullName(feedback.patient)}
                                className="h-10 w-10 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div 
                              className={`h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-sm ${
                                getProfilePicture(feedback.patient) ? 'hidden' : 'flex'
                              }`}
                            >
                              {getInitials(getFullName(feedback.patient))}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {getFullName(feedback.patient)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Patient ID: {feedback.patient?._id?.slice(-6) || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Dr. {getDoctorName(feedback.doctor)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {feedback.doctor?.specialization || feedback.doctor?.specialty || 'General Practice'}
                        </div>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          feedback.feedbackType === 'compliment' 
                            ? 'bg-green-100 text-green-800'
                            : feedback.feedbackType === 'complaint'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {feedback.feedbackType?.charAt(0).toUpperCase() + feedback.feedbackType?.slice(1)}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`h-4 w-4 ${i < (feedback.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {feedback.rating || 'N/A'}
                          </span>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(feedback.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          feedback.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {feedback.status?.charAt(0).toUpperCase() + feedback.status?.slice(1)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => {
                            setSelectedFeedback(feedback);
                            setIsModalOpen(true);
                          }}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11 3a3 3 0 100-6 3 3 0 000 6z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-gray-500">
                        <div className="text-6xl mb-4">📝</div>
                        <p className="text-lg font-medium">No feedback found</p>
                        <p className="text-sm">
                          {searchTerm ? 'Try adjusting your search criteria' : 'No feedback has been submitted yet'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enhanced Feedback Details Modal */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Feedback Details</h3>
                  <p className="text-gray-600 mt-1">Review and respond to patient feedback</p>
                </div>
                <button
                  onClick={() => {
                    setSelectedFeedback(null);
                    setIsModalOpen(false);
                  }}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Patient Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Patient Information</h4>
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {getProfilePicture(selectedFeedback.patient) ? (
                          <img
                            src={getProfilePicture(selectedFeedback.patient)}
                            alt={getFullName(selectedFeedback.patient)}
                            className="h-16 w-16 rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`h-16 w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-lg ${
                            getProfilePicture(selectedFeedback.patient) ? 'hidden' : 'flex'
                          }`}
                        >
                          {getInitials(getFullName(selectedFeedback.patient))}
                        </div>
                      </div>
                      <div>
                        <div className="text-lg font-medium text-gray-900">
                          {getFullName(selectedFeedback.patient)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Patient ID: {selectedFeedback.patient?._id?.slice(-6) || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">
                          Email: {selectedFeedback.patient?.email || 'Not provided'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Doctor Information */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Doctor Information</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-medium text-gray-900">
                          Dr. {getDoctorName(selectedFeedback.doctor)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {selectedFeedback.doctor?.specialization || 'General Practice'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Content */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Feedback Content</h4>
                    <div className="bg-white border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-800 leading-relaxed">
                        {selectedFeedback.comment || 'No additional comments provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  {selectedFeedback.appointment && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Related Appointment</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Date:</span>
                          <div className="font-medium">
                            {formatDate(selectedFeedback.appointment.date)}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Reason:</span>
                          <div className="font-medium">
                            {selectedFeedback.appointment.reason || 'General consultation'}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <div className="font-medium">
                            {selectedFeedback.appointmentType || 'Consultation'}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            selectedFeedback.appointment.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {selectedFeedback.appointment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Response Section */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Admin Response</h4>
                    <textarea
                      rows={4}
                      className="w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your response to this feedback..."
                    />
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Feedback Details</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-gray-600">Type</span>
                        <div className="mt-1">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            selectedFeedback.feedbackType === 'compliment' 
                              ? 'bg-green-100 text-green-800'
                              : selectedFeedback.feedbackType === 'complaint'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {selectedFeedback.feedbackType?.charAt(0).toUpperCase() + selectedFeedback.feedbackType?.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-gray-600">Rating</span>
                        <div className="mt-1 flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`h-5 w-5 ${i < (selectedFeedback.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {selectedFeedback.rating}/5
                          </span>
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-gray-600">Date Submitted</span>
                        <div className="mt-1 text-sm font-medium text-gray-900">
                          {formatDate(selectedFeedback.createdAt)}
                        </div>
                      </div>

                      <div>
                        <span className="text-sm text-gray-600">Status</span>
                        <div className="mt-1">
                          <select
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={selectedFeedback.status}
                            onChange={(e) => {
                              const updatedFeedback = { ...selectedFeedback, status: e.target.value };
                              setFeedbacks(feedbacks.map(f => f._id === selectedFeedback._id ? updatedFeedback : f));
                              setSelectedFeedback(updatedFeedback);
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                        Send Response
                      </button>
                      <button className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
                        Mark as Resolved
                      </button>
                      <button className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium">
                        Export Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="mt-6 flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedFeedback(null);
                    setIsModalOpen(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}