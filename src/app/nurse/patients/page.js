"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export default function NursePatients() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [patientReports, setPatientReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  // Debounced search effect
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== '') {
        handleSearch();
      } else {
        fetchPatients();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/nurse/patients/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatients(data.data || []);
      } else {
        console.error("Failed to fetch patients");
        setPatients([]);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setSearchLoading(true);
      const queryParams = new URLSearchParams();
      
      if (searchTerm) queryParams.append('search', searchTerm);

      const response = await fetch(`${API_BASE_URL}/nurse/patients/all?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatients(data.data || []);
      } else {
        console.error("Failed to fetch patients");
        setPatients([]);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatients([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchPatientReports = async (patientId) => {
    try {
      setReportsLoading(true);
      const response = await fetch(`${API_BASE_URL}/nurse/patients/${patientId}/reports`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPatientReports(data.data || []);
      } else if (response.status === 404) {
        // Reports endpoint might not exist, set empty array
        setPatientReports([]);
      } else {
        console.error("Failed to fetch patient reports");
        setPatientReports([]);
      }
    } catch (error) {
      console.error("Error fetching patient reports:", error);
      // If API endpoint doesn't exist, don't show error to user
      setPatientReports([]);
    } finally {
      setReportsLoading(false);
    }
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
    fetchPatientReports(patient._id);
  };

  const closeModal = () => {
    setShowPatientModal(false);
    setSelectedPatient(null);
    setPatientReports([]);
  };

  const formatAddress = (address) => {
    if (!address) return 'No address provided';
    if (typeof address === 'string') return address;
    
    // Handle address object
    const addressParts = [];
    if (address.street) addressParts.push(address.street);
    if (address.city) addressParts.push(address.city);
    if (address.state) addressParts.push(address.state);
    if (address.country) addressParts.push(address.country);
    if (address.zipCode) addressParts.push(address.zipCode);
    
    return addressParts.length > 0 ? addressParts.join(', ') : 'No address provided';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600 mt-1">View and manage all patient records</p>
        </div>
        <button
          onClick={() => router.push('/nurse')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <div className="max-w-md">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search Patients</label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or patient ID..."
              className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchLoading && (
              <div className="absolute right-3 top-2.5">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Patients Cards */}
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Patients ({patients.length})
          </h2>
        </div>
        
        {patients.length === 0 ? (
          <div className="py-12 text-center">
            <div className="flex flex-col items-center">
              <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No patients found</h3>
              <p className="text-gray-500">Try adjusting your search criteria.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patients.map((patient) => (
              <div key={patient._id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow duration-200">
                {/* Patient Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {patient.user?.firstName?.[0] || 'P'}
                        {patient.user?.lastName?.[0] || ''}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {patient.user?.firstName || ''} {patient.user?.lastName || ''}
                      </h3>
                      <p className="text-xs text-gray-500">
                        ID: {patient.patientId || 'Not assigned'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Patient Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-700 truncate">{patient.user?.email || 'No email'}</span>
                  </div>
                  
                  {patient.user?.phone && (
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">{patient.user?.phone}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-100">
                    <span className="text-gray-600">Age: {calculateAge(patient.dateOfBirth)}</span>
                    <span className="text-gray-600">{patient.gender || 'N/A'}</span>
                  </div>
                  
                  {patient.bloodType && (
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      <span className="text-gray-700">Blood Type: {patient.bloodType}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => handleViewPatient(patient)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>View Details</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Patient Details</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Personal Information */}
              <div className="border-b pb-4">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Personal Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Full Name:</span>
                    <p className="text-sm text-gray-900">{selectedPatient.user?.firstName || ''} {selectedPatient.user?.lastName || ''}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Patient ID:</span>
                    <p className="text-sm text-gray-900">{selectedPatient.patientId || 'Not assigned'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Age:</span>
                    <p className="text-sm text-gray-900">{calculateAge(selectedPatient.dateOfBirth)} years</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Gender:</span>
                    <p className="text-sm text-gray-900">{selectedPatient.gender || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Date of Birth:</span>
                    <p className="text-sm text-gray-900">{formatDate(selectedPatient.dateOfBirth)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Blood Type:</span>
                    <p className="text-sm text-gray-900">{selectedPatient.bloodType || 'Unknown'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-b pb-4">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Contact Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Email:</span>
                    <p className="text-sm text-gray-900">{selectedPatient.user?.email || 'No email'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Phone:</span>
                    <p className="text-sm text-gray-900">{selectedPatient.user?.phone || 'No phone'}</p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-600">Address:</span>
                    <p className="text-sm text-gray-900">{formatAddress(selectedPatient.address)}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="border-b pb-4">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Medical Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Height:</span>
                    <p className="text-sm text-gray-900">
                      {selectedPatient.height?.value ? `${selectedPatient.height.value}${selectedPatient.height.unit || 'cm'}` : 'Not recorded'}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Weight:</span>
                    <p className="text-sm text-gray-900">
                      {selectedPatient.weight?.value ? `${selectedPatient.weight.value}${selectedPatient.weight.unit || 'kg'}` : 'Not recorded'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-600">Allergies:</span>
                    <p className="text-sm text-gray-900">
                      {selectedPatient.allergies && selectedPatient.allergies.length > 0 
                        ? selectedPatient.allergies.join(', ') 
                        : 'No known allergies'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-600">Current Medications:</span>
                    <p className="text-sm text-gray-900">
                      {selectedPatient.currentMedications && selectedPatient.currentMedications.length > 0 
                        ? selectedPatient.currentMedications.join(', ') 
                        : 'No current medications'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-600">Medical History:</span>
                    <p className="text-sm text-gray-900">
                      {selectedPatient.medicalHistory || 'No medical history recorded'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              {selectedPatient.emergencyContact && (
                <div className="border-b pb-4">
                  <h4 className="text-md font-semibold text-gray-800 mb-2">Emergency Contact</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Name:</span>
                      <p className="text-sm text-gray-900">{selectedPatient.emergencyContact.name || 'Not provided'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Relationship:</span>
                      <p className="text-sm text-gray-900">{selectedPatient.emergencyContact.relationship || 'Not specified'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Phone:</span>
                      <p className="text-sm text-gray-900">{selectedPatient.emergencyContact.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical Reports */}
              <div className="border-b pb-4">
                <h4 className="text-md font-semibold text-gray-800 mb-2">Medical Reports</h4>
                {reportsLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : patientReports.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {patientReports.map((report, index) => (
                      <div key={report._id || index} className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-sm font-semibold text-gray-800">
                            {report.title || `Report #${index + 1}`}
                          </h5>
                          <span className="text-xs text-gray-500">
                            {formatDate(report.createdAt || report.date)}
                          </span>
                        </div>
                        {report.description && (
                          <p className="text-sm text-gray-700 mb-2">{report.description}</p>
                        )}
                        {report.diagnosis && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-gray-600">Diagnosis: </span>
                            <span className="text-xs text-gray-800">{report.diagnosis}</span>
                          </div>
                        )}
                        {report.treatment && (
                          <div className="mb-2">
                            <span className="text-xs font-medium text-gray-600">Treatment: </span>
                            <span className="text-xs text-gray-800">{report.treatment}</span>
                          </div>
                        )}
                        {report.doctorName && (
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-blue-600">Dr. {report.doctorName}</span>
                            {report.status && (
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                report.status === 'completed' ? 'bg-green-100 text-green-800' :
                                report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {report.status}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <svg className="h-8 w-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm text-gray-500">No medical reports available</p>
                  </div>
                )}
              </div>

              {/* Registration Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-800 mb-2">Registration Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Registration Date:</span>
                    <p className="text-sm text-gray-900">{formatDate(selectedPatient.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                    <p className="text-sm text-gray-900">{formatDate(selectedPatient.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

