'use client';

import { useState } from 'react';

export default function FeedbackManagement() {
  const [activeTab, setActiveTab] = useState('all');
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      type: 'feedback',
      title: 'Great Service',
      patient: 'Sarah Johnson',
      patientId: 'PT-001',
      rating: 5,
      date: '2023-09-01',
      content: 'The doctor was very professional and caring.',
      priority: 'medium',
      status: 'resolved'
    },
    {
      id: 2,
      type: 'complaint',
      title: 'Long Wait Time',
      patient: 'Michael Chen',
      patientId: 'PT-002',
      rating: null,
      date: '2023-09-02',
      content: 'Had to wait for more than an hour for my appointment.',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 3,
      type: 'feedback',
      title: 'Excellent Staff',
      patient: 'Emma Davis',
      patientId: 'PT-003',
      rating: 4,
      date: '2023-09-03',
      content: 'The staff was very helpful and friendly.',
      priority: 'low',
      status: 'resolved'
    }
  ]);

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSearch, setModalSearch] = useState('');

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts[parts.length - 1]?.[0] || '';
    return (first + last).toUpperCase();
  };

  const filteredFeedbacks = feedbacks.filter(feedback => {
    if (activeTab === 'all') return true;
    return feedback.type === activeTab;
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
    const headers = ['ID','Type','Title','Patient','PatientID','Rating','Date','Priority','Status'];
    const rows = feedbacks.map(f => [
      f.id,
      f.type,
      f.title,
      f.patient,
      f.patientId || '',
      f.type === 'feedback' ? (f.rating ?? '') : '',
      f.date,
      f.priority,
      f.status,
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
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-gray-500">
              {new Date().toLocaleDateString('en-GB')}
            </div>
            <div className="flex gap-2">
              <button onClick={exportCSV} className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">Export CSV</button>
              <button onClick={exportExcel} className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">Export Excel</button>
            </div>
          </div>
        </div>

        {/* KPI Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Rating Distribution Pie */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Rating Distribution</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative h-28 w-28 rounded-full"
                   style={{ background: 'conic-gradient(#16a34a 0% 30%, #22c55e 30% 55%, #fde047 55% 80%, #f97316 80% 95%, #ef4444 95% 100%)' }}>
                <div className="absolute inset-2 rounded-full bg-white" />
              </div>
              <div className="text-xs text-gray-600">
                <div><span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>5★ / 4★</div>
                <div><span className="inline-block w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>3★</div>
                <div><span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2"></span>2★</div>
                <div><span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>1★</div>
              </div>
            </div>
          </div>

          {/* Feedback Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Feedback Trends</h3>
            </div>
            <svg viewBox="0 0 200 80" className="w-full h-32">
              <polyline fill="none" stroke="#3b82f6" strokeWidth="2" points="0,60 40,50 80,55 120,35 160,40 200,25" />
              <polyline fill="none" stroke="#10b981" strokeWidth="2" points="0,70 40,60 80,62 120,50 160,55 200,45" />
            </svg>
          </div>

          {/* Resolved vs Pending Donut */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-900">Resolved vs Pending</h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative h-28 w-28 rounded-full"
                   style={{ background: 'conic-gradient(#22c55e 0% 60%, #fb923c 60% 100%)' }}>
                <div className="absolute inset-2 rounded-full bg-white" />
              </div>
              <div className="text-xs text-gray-600">
                <div><span className="inline-block w-2 h-2 rounded-full bg-green-600 mr-2"></span>Resolved</div>
                <div><span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2"></span>Pending</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs"></nav>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFeedbacks.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${feedback.type === 'feedback' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                        {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-semibold">
                          {getInitials(feedback.patient)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{feedback.patient}</div>
                          {feedback.patientId && (
                            <div className="text-xs text-gray-500">{feedback.patientId}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {feedback.type === 'feedback' ? (
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`h-4 w-4 ${i < (feedback.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.034a1 1 0 00-1.175 0l-2.802 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Feedback Details Modal */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Feedback & Complaints</h3>
              <button
                onClick={() => {
                  setSelectedFeedback(null);
                  setIsModalOpen(false);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mb-6">
              <input
                type="text"
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                placeholder="Search related feedback..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedFeedback.type === 'feedback' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'}`}>
                  {selectedFeedback.type.charAt(0).toUpperCase() + selectedFeedback.type.slice(1)}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="mt-1 text-sm text-gray-900">{selectedFeedback.title}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <p className="mt-1 text-sm text-gray-900">{selectedFeedback.content}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Patient</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedFeedback.patient}{selectedFeedback.patientId ? ` (${selectedFeedback.patientId})` : ''}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedFeedback.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`inline-block w-2 h-2 rounded-full ${getPriorityDot(selectedFeedback.priority)}`}></span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(selectedFeedback.priority)}`}>
                      {selectedFeedback.priority.charAt(0).toUpperCase() + selectedFeedback.priority.slice(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={selectedFeedback.status}
                    onChange={(e) => {
                      const updatedFeedback = { ...selectedFeedback, status: e.target.value };
                      setFeedbacks(feedbacks.map(f => f.id === selectedFeedback.id ? updatedFeedback : f));
                      setSelectedFeedback(updatedFeedback);
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Response</label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your response..."
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-2 sm:space-y-0">
              <button
                onClick={() => {
                  setSelectedFeedback(null);
                  setIsModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center w-full sm:w-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center justify-center w-full sm:w-auto"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Submit Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}