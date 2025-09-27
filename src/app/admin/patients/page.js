'use client';

import { useState } from 'react';

export default function PatientManagement() {
  const [patients, setPatients] = useState([
    {
      id: 'P-001',
      name: 'Sarah Johnson',
      age: 35,
      gender: 'Female',
      phone: '+1 (555) 123-4567',
      email: 'sarah.johnson@example.com',
      address: '123 Main St, Anytown, CA 94321',
      lastVisit: '2023-09-01',
      lastVisitDoctor: 'Dr. Michael Brown',
      lastVisitStatus: 'Completed',
      upcomingAppointment: '2023-09-15',
      nextAppointmentStatus: 'Scheduled',
      status: 'active',
      medicalHistory: [
        { condition: 'Hypertension', diagnosedDate: '2020-03-15', notes: 'Well-controlled with medication' }
      ],
      medications: [
        { medication: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startedDate: '2020-03-15' }
      ],
      allergies: ['Penicillin', 'Shellfish']
    },
    {
      id: 'P-002',
      name: 'Michael Chen',
      age: 28,
      gender: 'Male',
      phone: '+1 (555) 987-6543',
      email: 'michael.chen@example.com',
      address: '456 Park Ave, Metropolis, NY 10001',
      lastVisit: '2023-08-25',
      lastVisitDoctor: 'Dr. Sarah Wilson',
      lastVisitStatus: 'Completed',
      upcomingAppointment: '2023-09-10',
      nextAppointmentStatus: 'Scheduled',
      status: 'active',
      medicalHistory: [],
      medications: [],
      allergies: []
    },
    {
      id: 'P-003',
      name: 'Emma Davis',
      age: 42,
      gender: 'Female',
      phone: '+1 (555) 222-7890',
      email: 'emma.davis@example.com',
      address: '789 Oak Rd, Smallville, TX 75001',
      lastVisit: '2023-08-15',
      lastVisitDoctor: 'Dr. Emily Davis',
      lastVisitStatus: 'Completed',
      upcomingAppointment: null,
      nextAppointmentStatus: null,
      status: 'inactive',
      medicalHistory: [],
      medications: [],
      allergies: ['Peanuts']
    }
  ]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const filteredPatients = patients.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Patient Management</h1>
          <div className="text-sm text-gray-500">{today}</div>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative w-full sm:w-2/3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search patients by name or ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="w-full sm:w-1/3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Patients</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit Doctor</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
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
                          <div className="text-xs text-gray-500">ID: {patient.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {String(patient.phone || '').replace(/\D/g, '')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.lastVisit}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{patient.lastVisitDoctor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedPatient(patient);
                          setIsProfileModalOpen(true);
                        }}
                        className="bg-gray-50 text-gray-700 hover:bg-gray-100 px-3 py-1 rounded-md flex items-center justify-center transition-colors duration-150"
                        aria-label="View patient details"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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

      {/* Patient Details Modal */}
      {isProfileModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-semibold text-gray-900">Patient Details</h3>
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  setIsProfileModalOpen(false);
                }}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close details"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Patient Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                  {selectedPatient.name.split(' ').map(n => n[0]).slice(0,2).join('')}
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900">{selectedPatient.name}</div>
                  <div className="text-sm text-gray-500">Patient ID: {selectedPatient.id}</div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="px-6 py-6 space-y-8">
              {/* Demographics & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-xs text-gray-500">Age</div>
                  <div className="text-sm font-medium text-gray-900">{selectedPatient.age}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Gender</div>
                  <div className="text-sm font-medium text-gray-900">{selectedPatient.gender}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Address</div>
                  <div className="text-sm font-medium text-gray-900">{selectedPatient.address}</div>
                </div>
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 4.73A2 2 0 014 3h16a2 2 0 012 1.73v.07a2 2 0 01-.79 1.58L12 12.99 2.8 6.38A2 2 0 012.01 4.8v-.07z"/><path d="M22 8.01V19a2 2 0 01-2 2H4a2 2 0 01-2-2V8l10 7 10-7z"/></svg>
                    <span className="text-sm text-gray-900">{selectedPatient.email}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" /></svg>
                    <span className="text-sm text-gray-900">{selectedPatient.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <a href={`tel:${selectedPatient.phone}`} className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm">Call</a>
                    <a href={`mailto:${selectedPatient.email}`} className="px-3 py-1 rounded-md bg-green-50 text-green-600 hover:bg-green-100 text-sm">Email</a>
                    <button className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-sm">Message</button>
                  </div>
                </div>
              </div>

              {/* Appointments */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-xs text-gray-500">Last Visit</div>
                  <div className="text-sm font-medium text-gray-900">{selectedPatient.lastVisit} • {selectedPatient.lastVisitStatus}</div>
                  <div className="text-xs text-gray-500 mt-1">Doctor: {selectedPatient.lastVisitDoctor}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-xs text-gray-500">Next Appointment</div>
                  <div className="text-sm font-medium text-gray-900">{selectedPatient.upcomingAppointment || 'None'} {selectedPatient.nextAppointmentStatus ? `• ${selectedPatient.nextAppointmentStatus}` : ''}</div>
                </div>
              </div>

              {/* Medical History */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Medical History</h4>
                <div className="overflow-x-auto bg-white border border-gray-100 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Condition</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosed Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 ? (
                        selectedPatient.medicalHistory.map((h, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-sm text-gray-700">{h.condition}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{h.diagnosedDate}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{h.notes}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={3} className="px-4 py-3 text-center text-sm text-gray-500">No history records</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Current Medications */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Current Medications</h4>
                <div className="overflow-x-auto bg-white border border-gray-100 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medication</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dosage</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Frequency</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedPatient.medications && selectedPatient.medications.length > 0 ? (
                        selectedPatient.medications.map((m, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2 text-sm text-gray-700">{m.medication}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{m.dosage}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{m.frequency}</td>
                            <td className="px-4 py-2 text-sm text-gray-700">{m.startedDate}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-3 text-center text-sm text-gray-500">No current medications</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Allergies */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Allergies</h4>
                {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.allergies.map((a, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs border border-red-100">{a}</span>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No known allergies</div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedPatient(null);
                  setIsProfileModalOpen(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setEditData({ ...selectedPatient });
                  setIsEditModalOpen(true);
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Edit Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Patient Modal Render */}
      <EditPatientModal
        isOpen={isEditModalOpen}
        data={editData}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditData(null);
        }}
        onSave={(partial, isPartial) => {
          if (isPartial && partial) {
            setEditData((prev) => ({ ...prev, ...partial }));
            return;
          }
          if (!editData) return;
          setPatients((prev) => prev.map((p) => (p.id === editData.id ? { ...p, ...editData } : p)));
          setSelectedPatient((prev) => (prev && prev.id === editData.id ? { ...prev, ...editData } : prev));
          setIsEditModalOpen(false);
          setEditData(null);
        }}
      />
    </div>
  );
}

// Edit Patient Modal
// Placed after component to keep patch simpler; could be inlined if preferred.
export function EditPatientModal({ isOpen, data, onClose, onSave }) {
  if (!isOpen || !data) return null;
  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Edit Patient</h3>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose} aria-label="Close edit">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(); }}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => onSave({ name: e.target.value }, true)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={data.email}
              onChange={(e) => onSave({ email: e.target.value }, true)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onSave({ phone: e.target.value }, true)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={data.address}
              onChange={(e) => onSave({ address: e.target.value }, true)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={data.status}
              onChange={(e) => onSave({ status: e.target.value }, true)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}