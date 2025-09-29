'use client';

import { useState, useEffect } from 'react';

export default function NursePatients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWard, setSelectedWard] = useState('all');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [nursingNotes, setNursingNotes] = useState('');

  // Mock patients data
  useEffect(() => {
    setPatients([
      {
        id: 'P-1024',
        name: 'John Williams',
        age: 45,
        gender: 'Male',
        ward: 'General Ward',
        room: '201A',
        admissionDate: '2024-09-25',
        contact: '+1-555-0123',
        emergencyContact: 'Jane Williams (+1-555-0124)',
        bloodType: 'O+',
        allergies: ['Penicillin', 'Latex'],
        currentConditions: ['Hypertension', 'Type 2 Diabetes'],
        lastVitals: {
          bp: '140/90',
          hr: '78',
          temp: '98.6',
          weight: '180',
          recorded: '2024-09-28 08:30 AM'
        },
        medications: ['Metformin 500mg', 'Lisinopril 10mg'],
        notes: 'Patient compliant with medication. Monitor blood pressure.',
        nextAppointment: '2024-09-30 10:00 AM'
      },
      {
        id: 'P-1025',
        name: 'Maria Garcia',
        age: 32,
        gender: 'Female',
        ward: 'Maternity Ward',
        room: '301B',
        admissionDate: '2024-09-26',
        contact: '+1-555-0125',
        emergencyContact: 'Carlos Garcia (+1-555-0126)',
        bloodType: 'A+',
        allergies: ['None known'],
        currentConditions: ['Pregnancy - 32 weeks'],
        lastVitals: {
          bp: '110/70',
          hr: '85',
          temp: '98.4',
          weight: '155',
          recorded: '2024-09-28 09:15 AM'
        },
        medications: ['Prenatal Vitamins', 'Iron Supplement'],
        notes: 'Regular prenatal checkup. Baby movements normal.',
        nextAppointment: '2024-10-02 02:00 PM'
      },
      {
        id: 'P-1026',
        name: 'Robert Chen',
        age: 67,
        gender: 'Male',
        ward: 'Cardiology',
        room: '205A',
        admissionDate: '2024-09-27',
        contact: '+1-555-0127',
        emergencyContact: 'Linda Chen (+1-555-0128)',
        bloodType: 'B+',
        allergies: ['Aspirin', 'Shellfish'],
        currentConditions: ['Atrial Fibrillation', 'CAD'],
        lastVitals: {
          bp: '125/82',
          hr: '65',
          temp: '98.8',
          weight: '165',
          recorded: '2024-09-28 07:45 AM'
        },
        medications: ['Warfarin 5mg', 'Metoprolol 25mg'],
        notes: 'Monitor INR levels. Patient on anticoagulation therapy.',
        nextAppointment: '2024-09-30 11:30 AM'
      },
      {
        id: 'P-1027',
        name: 'Lisa Anderson',
        age: 28,
        gender: 'Female',
        ward: 'General Ward',
        room: '207C',
        admissionDate: '2024-09-28',
        contact: '+1-555-0129',
        emergencyContact: 'Mark Anderson (+1-555-0130)',
        bloodType: 'AB-',
        allergies: ['None known'],
        currentConditions: ['Annual Physical'],
        lastVitals: {
          bp: '118/75',
          hr: '70',
          temp: '98.2',
          weight: '125',
          recorded: '2024-09-28 10:30 AM'
        },
        medications: ['Birth Control Pills'],
        notes: 'Healthy patient. Routine screening completed.',
        nextAppointment: '2024-10-28 10:00 AM'
      }
    ]);
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.contact.includes(searchTerm);
    const matchesWard = selectedWard === 'all' || patient.ward === selectedWard;
    return matchesSearch && matchesWard;
  });

  const wards = ['all', ...new Set(patients.map(p => p.ward))];

  const openPatientModal = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(true);
  };

  const openNotesModal = (patient) => {
    setSelectedPatient(patient);
    setNursingNotes(patient.notes || '');
    setShowNotesModal(true);
  };

  const handleSaveNotes = () => {
    setPatients(prev => 
      prev.map(p => 
        p.id === selectedPatient.id ? { ...p, notes: nursingNotes } : p
      )
    );
    setShowNotesModal(false);
    setSelectedPatient(null);
    setNursingNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              View and manage assigned patients
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, patient ID, or phone number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {wards.map(ward => (
                <option key={ward} value={ward}>
                  {ward === 'all' ? 'All Wards' : ward}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.id}</p>
                  </div>
                </div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {patient.ward}
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Age/Gender:</span>
                  <span className="font-medium">{patient.age}y, {patient.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Room:</span>
                  <span className="font-medium">{patient.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Blood Type:</span>
                  <span className="font-medium text-red-600">{patient.bloodType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Contact:</span>
                  <span className="font-medium text-blue-600">{patient.contact}</span>
                </div>
              </div>

              {/* Last Vitals */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Last Vitals</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">BP:</span> <span className="font-medium">{patient.lastVitals.bp}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">HR:</span> <span className="font-medium">{patient.lastVitals.hr}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Temp:</span> <span className="font-medium">{patient.lastVitals.temp}°F</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Weight:</span> <span className="font-medium">{patient.lastVitals.weight}lbs</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Recorded: {patient.lastVitals.recorded}</p>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => openPatientModal(patient)}
                  className="flex-1 bg-blue-600 text-white text-sm py-2 px-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  View Details
                </button>
                <button
                  onClick={() => openNotesModal(patient)}
                  className="flex-1 bg-gray-600 text-white text-sm py-2 px-3 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Add Notes
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Details Modal */}
      {showPatientModal && selectedPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-600">{selectedPatient.id} • Room {selectedPatient.room}</p>
                </div>
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Patient Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Patient Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{selectedPatient.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium">{selectedPatient.gender}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Blood Type:</span>
                      <span className="font-medium text-red-600">{selectedPatient.bloodType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ward:</span>
                      <span className="font-medium">{selectedPatient.ward}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admission:</span>
                      <span className="font-medium">{selectedPatient.admissionDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium text-blue-600">{selectedPatient.contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Emergency:</span>
                      <span className="font-medium text-red-600">{selectedPatient.emergencyContact}</span>
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Medical Information</h4>
                  
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Allergies</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedPatient.allergies.map((allergy, index) => (
                        <span key={index} className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Current Conditions</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedPatient.currentConditions.map((condition, index) => (
                        <span key={index} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {condition}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-1">Current Medications</h5>
                    <ul className="text-sm space-y-1">
                      {selectedPatient.medications.map((medication, index) => (
                        <li key={index} className="text-gray-600">• {medication}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Nursing Notes */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Nursing Notes</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{selectedPatient.notes || 'No notes available.'}</p>
                </div>
              </div>

              {/* Next Appointment */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Next Appointment</h4>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-800 font-medium">{selectedPatient.nextAppointment}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nursing Notes Modal */}
      {showNotesModal && selectedPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Nursing Notes - {selectedPatient.name}
                </h3>
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Patient ID: {selectedPatient.id} | Room: {selectedPatient.room}
              </p>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add/Update Nursing Notes
                </label>
                <textarea
                  rows="6"
                  value={nursingNotes}
                  onChange={(e) => setNursingNotes(e.target.value)}
                  placeholder="Enter nursing observations, patient status, care provided, etc..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNotes}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
