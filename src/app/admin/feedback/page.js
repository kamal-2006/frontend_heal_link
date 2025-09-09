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
      date: '2023-09-03',
      content: 'The staff was very helpful and friendly.',
      priority: 'low',
      status: 'resolved'
    }
  ]);

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Feedback & Complaints</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search feedback..."
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
              {['all', 'feedback', 'complaint'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`
                    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                    ${activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                  `}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFeedbacks.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${feedback.type === 'feedback' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{feedback.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.patient}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{feedback.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(feedback.priority)}`}>
                        {feedback.priority.charAt(0).toUpperCase() + feedback.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(feedback.status)}`}>
                        {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedFeedback(feedback);
                          setIsModalOpen(true);
                        }}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md flex items-center justify-center transition-colors duration-150 w-full sm:w-auto"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Details
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
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Feedback Details</h3>
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

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedFeedback.type === 'feedback' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
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
                  <p className="mt-1 text-sm text-gray-900">{selectedFeedback.patient}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedFeedback.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <span className={`mt-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(selectedFeedback.priority)}`}>
                    {selectedFeedback.priority.charAt(0).toUpperCase() + selectedFeedback.priority.slice(1)}
                  </span>
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
                Send Response
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}