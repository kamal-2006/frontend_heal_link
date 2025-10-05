'use client';

import { useState, useEffect } from 'react';

export default function NurseReports() {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    patientId: '',
    patientName: '',
    reportType: '',
    title: '',
    description: '',
    file: null
  });

  // Mock reports data
  useEffect(() => {
    setReports([
      {
        id: 'R001',
        patientName: 'John Williams',
        patientId: 'P-1024',
        reportType: 'Lab Results',
        title: 'Blood Sugar Test',
        description: 'Fasting glucose and HbA1c results',
        uploadedBy: 'Nurse Sarah Johnson',
        uploadDate: '2024-09-28',
        status: 'pending-review',
        fileSize: '2.3 MB',
        fileType: 'PDF',
        doctorAssigned: 'Dr. Sarah Miller',
        priority: 'normal'
      },
      {
        id: 'R002',
        patientName: 'Maria Garcia',
        patientId: 'P-1025',
        reportType: 'Ultrasound',
        title: '32-week Prenatal Ultrasound',
        description: 'Routine pregnancy monitoring ultrasound',
        uploadedBy: 'Nurse Sarah Johnson',
        uploadDate: '2024-09-28',
        status: 'reviewed',
        fileSize: '15.7 MB',
        fileType: 'DICOM',
        doctorAssigned: 'Dr. Emily Davis',
        priority: 'high'
      },
      {
        id: 'R003',
        patientName: 'Robert Chen',
        patientId: 'P-1026',
        reportType: 'EKG',
        title: 'Electrocardiogram',
        description: 'Cardiac rhythm monitoring and analysis',
        uploadedBy: 'Nurse Sarah Johnson',
        uploadDate: '2024-09-27',
        status: 'reviewed',
        fileSize: '1.8 MB',
        fileType: 'PDF',
        doctorAssigned: 'Dr. James Wilson',
        priority: 'high'
      },
      {
        id: 'R004',
        patientName: 'Lisa Anderson',
        patientId: 'P-1027',
        reportType: 'X-Ray',
        title: 'Chest X-Ray',
        description: 'Routine chest examination',
        uploadedBy: 'Nurse Sarah Johnson',
        uploadDate: '2024-09-28',
        status: 'pending-review',
        fileSize: '8.2 MB',
        fileType: 'DICOM',
        doctorAssigned: 'Dr. Michael Brown',
        priority: 'normal'
      },
      {
        id: 'R005',
        patientName: 'David Thompson',
        patientId: 'P-1028',
        reportType: 'Lab Results',
        title: 'Lipid Panel',
        description: 'Cholesterol and triglycerides analysis',
        uploadedBy: 'Nurse Sarah Johnson',
        uploadDate: '2024-09-26',
        status: 'archived',
        fileSize: '1.1 MB',
        fileType: 'PDF',
        doctorAssigned: 'Dr. Sarah Miller',
        priority: 'normal'
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending-review':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-orange-600';
      case 'normal':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType.toUpperCase()) {
      case 'PDF':
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      case 'DICOM':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadData(prev => ({ ...prev, file }));
    }
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      id: `R${String(reports.length + 1).padStart(3, '0')}`,
      patientName: uploadData.patientName,
      patientId: uploadData.patientId,
      reportType: uploadData.reportType,
      title: uploadData.title,
      description: uploadData.description,
      uploadedBy: 'Nurse Sarah Johnson',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'pending-review',
      fileSize: uploadData.file ? `${(uploadData.file.size / (1024 * 1024)).toFixed(1)} MB` : '0 MB',
      fileType: uploadData.file ? uploadData.file.name.split('.').pop().toUpperCase() : 'Unknown',
      doctorAssigned: 'Dr. Sarah Miller',
      priority: 'normal'
    };

    setReports(prev => [newReport, ...prev]);
    setUploadData({
      patientId: '',
      patientName: '',
      reportType: '',
      title: '',
      description: '',
      file: null
    });
    setShowUploadModal(false);
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || report.status === filterStatus;
    const matchesType = filterType === 'all' || report.reportType === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const reportTypes = ['all', ...new Set(reports.map(r => r.reportType))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Upload and manage patient reports and test results
            </p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Upload Report</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'pending-review').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Reviewed</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'reviewed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.priority === 'high').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by patient name, ID, or report title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending-review">Pending Review</option>
              <option value="reviewed">Reviewed</option>
              <option value="archived">Archived</option>
            </select>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {reportTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredReports.map((report) => (
          <div key={report.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getFileIcon(report.fileType)}
                  <div>
                    <h3 className="font-semibold text-gray-900">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.patientName} • {report.patientId}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                    {report.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  <span className={`text-xs font-medium ${getPriorityColor(report.priority)}`}>
                    {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{report.reportType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Assigned Doctor:</span>
                  <span className="font-medium">{report.doctorAssigned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Upload Date:</span>
                  <span className="font-medium">{report.uploadDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">File Size:</span>
                  <span className="font-medium">{report.fileSize}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{report.description}</p>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View</span>
                </button>
                <button className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Upload New Report</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="P-1024"
                    value={uploadData.patientId}
                    onChange={(e) => setUploadData(prev => ({ ...prev, patientId: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Williams"
                    value={uploadData.patientName}
                    onChange={(e) => setUploadData(prev => ({ ...prev, patientName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Type
                  </label>
                  <select
                    required
                    value={uploadData.reportType}
                    onChange={(e) => setUploadData(prev => ({ ...prev, reportType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="Lab Results">Lab Results</option>
                    <option value="X-Ray">X-Ray</option>
                    <option value="MRI">MRI</option>
                    <option value="CT Scan">CT Scan</option>
                    <option value="Ultrasound">Ultrasound</option>
                    <option value="EKG">EKG</option>
                    <option value="Blood Test">Blood Test</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Report Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Blood Sugar Test"
                    value={uploadData.title}
                    onChange={(e) => setUploadData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Brief description of the report..."
                  value={uploadData.description}
                  onChange={(e) => setUploadData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File
                </label>
                <input
                  type="file"
                  required
                  accept=".pdf,.jpg,.jpeg,.png,.dicom"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Supported formats: PDF, JPG, PNG, DICOM (Max 50MB)
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Upload Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
