'use client';

import { useState, useEffect } from 'react';

import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;
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
  
  // Edit patient modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [editLoading, setEditLoading] = useState(false);

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
      
      const response = await fetch(`${API_BASE_URL}/patients/admin/patients`, {
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
      
      const response = await fetch(`${API_BASE_URL}/patients/admin/patients/${patientId}`);
      
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
  // View patient details in modal (viewOnly = true disables edit)
  const handleViewPatient = (patient, viewOnly = false) => {
    if (!patient._id) {
      showToast('Error: Patient ID is missing. Cannot view details.', 'error');
      return;
    }
  setSelectedPatient(patient);
  setShowPatientModal(true);
  setPatientDetails(null);
  fetchPatientDetails(patient._id);
  };

  // Close patient detail modal
  const closePatientModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
    setPatientDetails(null);
  };

  // Open edit modal
  const openEditModal = () => {
    if (patientDetails) {
      setEditFormData({
        firstName: patientDetails.user?.firstName || '',
        lastName: patientDetails.user?.lastName || '',
        email: patientDetails.user?.email || '',
        phone: patientDetails.user?.phone || '',
        gender: patientDetails.gender || '',
        dateOfBirth: patientDetails.dateOfBirth ? patientDetails.dateOfBirth.split('T')[0] : '',
        bloodGroup: patientDetails.bloodGroup || patientDetails.bloodType || '',
        street: patientDetails.address?.street || '',
        city: patientDetails.address?.city || '',
        state: patientDetails.address?.state || '',
        zipCode: patientDetails.address?.zipCode || '',
        emergencyContactName: patientDetails.emergencyContact?.name || '',
        emergencyContactPhone: patientDetails.emergencyContact?.phone || '',
        height: patientDetails.height?.value || '',
        heightUnit: patientDetails.height?.unit || 'cm',
        weight: patientDetails.weight?.value || '',
        weightUnit: patientDetails.weight?.unit || 'kg'
      });
      setShowEditModal(true);
    }
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditFormData({});
  };

  // Handle form input changes
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update patient information
  const updatePatient = async () => {
    try {
      setEditLoading(true);
      
      const updateData = {
        // User information
        user: {
          firstName: editFormData.firstName,
          lastName: editFormData.lastName,
          email: editFormData.email,
          phone: editFormData.phone
        },
        // Patient-specific information
        gender: editFormData.gender,
        dateOfBirth: editFormData.dateOfBirth,
        bloodGroup: editFormData.bloodGroup,
        address: {
          street: editFormData.street,
          city: editFormData.city,
          state: editFormData.state,
          zipCode: editFormData.zipCode
        },
        emergencyContact: {
          name: editFormData.emergencyContactName,
          phone: editFormData.emergencyContactPhone
        },
        height: editFormData.height ? {
          value: parseFloat(editFormData.height),
          unit: editFormData.heightUnit
        } : null,
        weight: editFormData.weight ? {
          value: parseFloat(editFormData.weight),
          unit: editFormData.weightUnit
        } : null
      };

      const response = await fetch(`${API_BASE_URL}/patients/admin/patients/${patientDetails._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update patient: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success) {
        showToast('Patient information updated successfully!', 'success');
        setPatientDetails(data.data); // Update the patient details with new data
        closeEditModal();
        fetchPatients(); // Refresh the patient list
      } else {
        throw new Error(data.error || 'Failed to update patient');
      }
    } catch (err) {
      console.error('Error updating patient:', err);
      showToast(`Error updating patient: ${err.message}`, 'error');
    } finally {
      setEditLoading(false);
    }
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
                    Blood Group
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
                        {patient.bloodGroup || patient.user?.bloodGroup || patient.bloodType || patient.user?.bloodType || 'N/A'}
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
                          onClick={() => handleViewPatient(patient, true)}
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
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-lg text-gray-600">Loading patient details...</span>
                </div>
              ) : patientDetails ? (
                <div className="space-y-6">
                  {/* Patient Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="h-20 w-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                            {patientDetails.user?.profilePicture ? (
                              <img 
                                src={patientDetails.user.profilePicture} 
                                alt="Patient Avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl font-bold text-indigo-700">
                                {patientDetails.user?.firstName?.charAt(0) || 'P'}
                                {patientDetails.user?.lastName?.charAt(0) || ''}
                              </span>
                            )}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">
                            {patientDetails.user ? `${patientDetails.user.firstName} ${patientDetails.user.lastName}` : 'N/A'}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            Patient ID: {patientDetails.patientId || patientDetails._id?.slice(-6)}
                          </p>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm bg-white px-3 py-1 rounded-full text-gray-700">
                              Age: {patientDetails.age || calculateAge(patientDetails.dateOfBirth)}
                            </span>
                            <span className="text-sm bg-white px-3 py-1 rounded-full text-gray-700">
                              {patientDetails.gender || 'Gender not specified'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Quick Actions */}
                      <div className="flex space-x-2">
                        {patientDetails.user?.phone && (
                          <button 
                            onClick={() => window.location.href = `tel:${patientDetails.user.phone}`}
                            className="p-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors duration-200 shadow-sm"
                            title="Call Patient"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                          </button>
                        )}
                        {patientDetails.user?.email && (
                          <button 
                            onClick={() => window.location.href = `mailto:${patientDetails.user.email}`}
                            className="p-3 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors duration-200 shadow-sm"
                            title="Email Patient"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </button>
                        )}
                        <button 
                          onClick={() => showToast('Messaging feature coming soon!', 'info')}
                          className="p-3 bg-purple-100 text-purple-700 rounded-xl hover:bg-purple-200 transition-colors duration-200 shadow-sm"
                          title="Message Patient"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Contact Information */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Contact Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <span className="text-sm text-gray-600 font-medium">Email:</span>
                          <span className="text-sm text-gray-900 ml-2">{patientDetails.user?.email || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <span className="text-sm text-gray-600 font-medium">Phone:</span>
                          <span className="text-sm text-gray-900 ml-2">{patientDetails.user?.phone || 'Not provided'}</span>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-4 h-4 mr-3 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <div>
                            <span className="text-sm text-gray-600 font-medium">Address:</span>
                            <p className="text-sm text-gray-900 mt-1">
                              {patientDetails.address?.street ? 
                                `${patientDetails.address.street}, ${patientDetails.address.city || ''}, ${patientDetails.address.state || ''} ${patientDetails.address.zipCode || ''}`.replace(/,\s*,/g, ',').trim() : 
                                'Not provided'
                              }
                            </p>
                          </div>
                        </div>
                        {patientDetails.emergencyContact?.name && (
                          <div className="pt-2 border-t border-gray-100">
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                              <span className="text-sm text-gray-600 font-medium">Emergency Contact:</span>
                            </div>
                            <p className="text-sm text-gray-900 ml-7 mt-1">
                              {patientDetails.emergencyContact.name} - {patientDetails.emergencyContact.phone}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Medical Information */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Medical Information
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 font-medium w-24">Blood Type:</span>
                          <span className="text-sm text-gray-900">{patientDetails.bloodGroup || patientDetails.bloodType || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 font-medium w-24">Birth Date:</span>
                          <span className="text-sm text-gray-900">{formatDate(patientDetails.dateOfBirth)}</span>
                        </div>
                        {patientDetails.height?.value && (
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 font-medium w-24">Height:</span>
                            <span className="text-sm text-gray-900">{patientDetails.height.value} {patientDetails.height.unit}</span>
                          </div>
                        )}
                        {patientDetails.weight?.value && (
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 font-medium w-24">Weight:</span>
                            <span className="text-sm text-gray-900">{patientDetails.weight.value} {patientDetails.weight.unit}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Appointments Section */}
                  {patientDetails.appointments && patientDetails.appointments.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Appointments History ({patientDetails.appointments.length})
                      </h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {patientDetails.appointments.slice(0, 5).map((appointment, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <div className="text-sm font-medium text-gray-900">
                                  {formatDate(appointment.date)} at {appointment.time}
                                </div>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  appointment.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {appointment.status}
                                </span>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                Dr. {appointment.doctor?.user ? 
                                  `${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}` : 
                                  'N/A'
                                }
                              </div>
                              {appointment.reason && (
                                <div className="text-sm text-gray-500 mt-1">{appointment.reason}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medical History */}
                  {patientDetails.medicalConditions && patientDetails.medicalConditions.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Medical History
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-2 font-semibold text-gray-700">Condition</th>
                              <th className="text-left py-3 px-2 font-semibold text-gray-700">Diagnosed Date</th>
                              <th className="text-left py-3 px-2 font-semibold text-gray-700">Notes</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {patientDetails.medicalConditions.map((condition, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="py-3 px-2 text-gray-900 font-medium">{condition.name || condition}</td>
                                <td className="py-3 px-2 text-gray-600">{formatDate(condition.diagnosedDate) || 'N/A'}</td>
                                <td className="py-3 px-2 text-gray-600">{condition.notes || 'No notes'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Current Medications */}
                  {patientDetails.medications && patientDetails.medications.length > 0 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                        Current Medications
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-3 px-2 font-semibold text-gray-700">Medication</th>
                              <th className="text-left py-3 px-2 font-semibold text-gray-700">Dosage</th>
                              <th className="text-left py-3 px-2 font-semibold text-gray-700">Frequency</th>
                              <th className="text-left py-3 px-2 font-semibold text-gray-700">Started Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {patientDetails.medications.map((medication, index) => (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="py-3 px-2 text-gray-900 font-medium">{medication.name || medication}</td>
                                <td className="py-3 px-2 text-gray-600">{medication.dosage || 'N/A'}</td>
                                <td className="py-3 px-2 text-gray-600">{medication.frequency || 'N/A'}</td>
                                <td className="py-3 px-2 text-gray-600">{formatDate(medication.startDate) || 'N/A'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Allergies */}
                  {patientDetails.allergies && patientDetails.allergies.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
                      <h4 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                        <svg className="w-6 h-6 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        Allergies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {patientDetails.allergies.map((allergy, index) => (
                          <span key={index} className="inline-flex items-center px-4 py-2 bg-red-100 text-red-800 text-sm font-semibold rounded-full border border-red-300">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            {allergy.name || allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      onClick={closePatientModal}
                      className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
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

      {/* Edit Patient Modal */}
      {showEditModal && patientDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Patient Information</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); updatePatient(); }} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={editFormData.firstName}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={editFormData.lastName}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={editFormData.dateOfBirth}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <select
                        name="gender"
                        value={editFormData.gender}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-green-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editFormData.email}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={editFormData.street}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={editFormData.city}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={editFormData.state}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={editFormData.zipCode}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="bg-red-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    Medical Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                      <select
                        name="bloodGroup"
                        value={editFormData.bloodGroup}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
                      <div className="flex">
                        <input
                          type="number"
                          name="height"
                          value={editFormData.height}
                          onChange={handleEditInputChange}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Height"
                        />
                        <select
                          name="heightUnit"
                          value={editFormData.heightUnit}
                          onChange={handleEditInputChange}
                          className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        >
                          <option value="cm">cm</option>
                          <option value="ft">ft</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
                      <div className="flex">
                        <input
                          type="number"
                          name="weight"
                          value={editFormData.weight}
                          onChange={handleEditInputChange}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Weight"
                        />
                        <select
                          name="weightUnit"
                          value={editFormData.weightUnit}
                          onChange={handleEditInputChange}
                          className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        >
                          <option value="kg">kg</option>
                          <option value="lbs">lbs</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-yellow-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                      <input
                        type="text"
                        name="emergencyContactName"
                        value={editFormData.emergencyContactName}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                      <input
                        type="tel"
                        name="emergencyContactPhone"
                        value={editFormData.emergencyContactPhone}
                        onChange={handleEditInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={closeEditModal}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {editLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Update Patient'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}