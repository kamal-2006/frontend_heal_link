'use client';

import { useState, useEffect } from 'react';

export default function PatientManagement() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  
  // Patient detail modal states
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Toast notification function
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('http://localhost:5001/api/v1/patients/admin/patients', {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status >= 500) {
          throw new Error(`Server error (${response.status}): The backend server may be experiencing issues`);
        } else if (response.status >= 400) {
          throw new Error(`Request error (${response.status}): ${response.statusText}`);
        }
        throw new Error(`Failed to fetch patients: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setPatients(data.data);
        console.log(`Loaded ${data.data.length} patients from database`);
        setError(null);
      } else {
        setPatients([]);
        console.warn('No valid patient data received from API');
        setError('No patients found in database');
      }
    } catch (err) {
      console.error('Error fetching patients:', err);
      
      let errorMessage = 'Failed to load patients from database.';
      
      if (err.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check if the backend server is running.';
      } else if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        errorMessage = 'Cannot connect to server. Please ensure the backend server is running on port 5000.';
      } else {
        errorMessage = err.message || 'Unknown error occurred while fetching patients.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Filter patients based on search and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = searchQuery === '' || 
      (patient.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       patient.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       patient.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
       patient.patientId?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && patient.user) ||
      (statusFilter === 'inactive' && !patient.user);
    
    return matchesSearch && matchesStatus;
  });

  // Fetch detailed patient information from backend
  const fetchPatientDetails = async (patientId) => {
    try {
      setModalLoading(true);
      
      const response = await fetch(`http://localhost:5001/api/v1/patients/admin/patients/${patientId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch patient details: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setPatientDetails(data.data);
        console.log('Patient details loaded:', data.data);
      } else {
        throw new Error(data.error || 'Failed to load patient details');
      }
    } catch (err) {
      console.error('Error fetching patient details:', err);
      showToast(`Error loading patient details: ${err.message}`, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // View patient details in modal
  const handleViewPatient = (patient) => {
    console.log('Viewing patient:', patient);
    if (!patient._id) {
      console.error('Patient ID is missing:', patient);
      showToast('Error: Patient ID is missing. Cannot view details.', 'error');
      return;
    }
    
    try {
      setSelectedPatient(patient);
      setShowPatientModal(true);
      setPatientDetails(null);
      fetchPatientDetails(patient._id);
    } catch (error) {
      console.error('Error opening patient modal:', error);
      showToast('Error opening patient details.', 'error');
    }
  };

  // Close patient detail modal
  const closePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
    setPatientDetails(null);
  };

  // Calculate age
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading patients from database...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error: {error}</p>
              <button 
                onClick={fetchPatients}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className={toast.type === 'success' ? 'px-6 py-3 rounded-lg shadow-lg bg-green-500 text-white font-medium' : 'px-6 py-3 rounded-lg shadow-lg bg-red-500 text-white font-medium'}>
            {toast.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
              <p className="text-gray-600 mt-1">{today}</p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search patients by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Patients</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-hidden">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                    Patient
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Contact
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Age
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Status
                  </th>
                  <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-900 mb-1">No patients found</p>
                        <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr key={patient._id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full overflow-hidden">
                              {patient.user?.profilePicture ? (
                                <img 
                                  src={patient.user.profilePicture} 
                                  alt={`${patient.user.firstName} ${patient.user.lastName}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className={`h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center ${patient.user?.profilePicture ? 'hidden' : ''}`}>
                                <span className="text-sm font-medium text-indigo-600">
                                  {patient.user?.firstName?.charAt(0) || patient.name?.charAt(0) || 'P'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {patient.user ? `${patient.user.firstName} ${patient.user.lastName}` : (patient.name || 'N/A')}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {patient.patientId || patient._id?.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{patient.user?.email || patient.email || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{patient.user?.phone || patient.phone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {patient.age || calculateAge(patient.dateOfBirth || patient.user?.dateOfBirth)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          patient.user ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.user ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleViewPatient(patient)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50"
                          title="View patient details"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
                <button
                  onClick={closePatientModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {modalLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading patient details...</p>
                </div>
              ) : patientDetails ? (
                <div>
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-semibold">
                      {patientDetails.user ? `${patientDetails.user.firstName} ${patientDetails.user.lastName}` : 'N/A'}
                    </h3>
                    <p className="text-gray-600">ID: {patientDetails.patientId || patientDetails._id?.slice(-6)}</p>
                    <p className="text-sm text-gray-600">
                      Age: {patientDetails.age || calculateAge(patientDetails.dateOfBirth)} | Gender: {patientDetails.gender || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Contact Information</h4>
                      <p>Email: {patientDetails.user?.email || 'Not provided'}</p>
                      <p>Phone: {patientDetails.user?.phone || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Medical Information</h4>
                      <p>Blood Type: {patientDetails.bloodGroup || patientDetails.bloodType || 'Not provided'}</p>
                      <p>Date of Birth: {formatDate(patientDetails.dateOfBirth)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end space-x-3 pt-4 border-t">
                    <button
                      onClick={closePatientModal}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-red-500 text-4xl mb-4">!</div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to Load Patient Details</h3>
                  <button
                    onClick={() => fetchPatientDetails(selectedPatient._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
                  >
                    Retry
                  </button>
                  <button
                    onClick={closePatientModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}