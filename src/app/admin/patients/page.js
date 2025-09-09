'use client';

import { useState } from 'react';

export default function PatientManagement() {
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      age: 35,
      gender: 'Female',
      contact: '+1 234-567-8901',
      lastVisit: '2023-09-01',
      upcomingAppointment: '2023-09-15',
      status: 'active'
    },
    {
      id: 2,
      name: 'Michael Chen',
      age: 28,
      gender: 'Male',
      contact: '+1 234-567-8902',
      lastVisit: '2023-08-25',
      upcomingAppointment: '2023-09-10',
      status: 'active'
    },
    {
      id: 3,
      name: 'Emma Davis',
      age: 42,
      gender: 'Female',
      contact: '+1 234-567-8903',
      lastVisit: '2023-08-15',
      upcomingAppointment: null,
      status: 'inactive'
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Patient Management</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search patients..."
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
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Next Appointment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {patients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium">{patient.name[0]}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                          <div className="text-sm text-gray-500">{patient.age} years • {patient.gender}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.lastVisit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.upcomingAppointment || 'No upcoming appointments'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${patient.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                      >
                        {patient.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsProfileModalOpen(true);
                        }}
                        className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 rounded-md flex items-center transition-colors duration-150"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          setPatients(patients.map(p => 
                            p.id === patient.id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p
                          ));
                        }}
                        className={`${patient.status === 'active' ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' : 'bg-green-50 text-green-600 hover:bg-green-100'} px-3 py-1 rounded-md flex items-center transition-colors duration-150 ml-2`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-4 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        {patient.status === 'active' ? 'Set Inactive' : 'Set Active'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Profile Modal */}
      {isProfileModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Patient Profile</h3>
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  setIsProfileModalOpen(false);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Personal Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500">Full Name</label>
                    <span className="text-sm text-gray-900">{selectedPatient.name}</span>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Age</label>
                    <span className="text-sm text-gray-900">{selectedPatient.age} years</span>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Gender</label>
                    <span className="text-sm text-gray-900">{selectedPatient.gender}</span>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Contact</label>
                    <span className="text-sm text-gray-900">{selectedPatient.contact}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Appointment History</h4>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Last Visit</div>
                    <div className="text-sm font-medium text-gray-900">{selectedPatient.lastVisit}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500">Next Appointment</div>
                    <div className="text-sm font-medium text-gray-900">
                      {selectedPatient.upcomingAppointment || 'No upcoming appointments'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  setIsProfileModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
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