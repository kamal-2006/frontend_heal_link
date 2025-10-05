'use client';

import { useState, useEffect } from 'react';

export default function NurseAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [vitalsData, setVitalsData] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
    height: '',
    oxygenSaturation: '',
    notes: ''
  });

  // Mock appointments data
  useEffect(() => {
    setAppointments([
      {
        id: 'A001',
        patientName: 'John Williams',
        patientId: 'P-1024',
        age: 45,
        gender: 'Male',
        doctorName: 'Dr. Sarah Miller',
        time: '09:00 AM',
        endTime: '09:30 AM',
        status: 'scheduled',
        room: '201A',
        appointmentType: 'Consultation',
        phoneNumber: '+1-555-0123',
        reason: 'Regular checkup',
        priority: 'normal'
      },
      {
        id: 'A002',
        patientName: 'Maria Garcia',
        patientId: 'P-1025',
        age: 32,
        gender: 'Female',
        doctorName: 'Dr. James Wilson',
        time: '09:30 AM',
        endTime: '10:00 AM',
        status: 'checked-in',
        room: '203B',
        appointmentType: 'Follow-up',
        phoneNumber: '+1-555-0124',
        reason: 'Diabetes follow-up',
        priority: 'normal'
      },
      {
        id: 'A003',
        patientName: 'Robert Chen',
        patientId: 'P-1026',
        age: 67,
        gender: 'Male',
        doctorName: 'Dr. Emily Davis',
        time: '10:00 AM',
        endTime: '10:30 AM',
        status: 'waiting',
        room: '205A',
        appointmentType: 'Consultation',
        phoneNumber: '+1-555-0125',
        reason: 'Chest pain',
        priority: 'high'
      },
      {
        id: 'A004',
        patientName: 'Lisa Anderson',
        patientId: 'P-1027',
        age: 28,
        gender: 'Female',
        doctorName: 'Dr. Michael Brown',
        time: '10:30 AM',
        endTime: '11:00 AM',
        status: 'in-consultation',
        room: '207C',
        appointmentType: 'Consultation',
        phoneNumber: '+1-555-0126',
        reason: 'Annual physical',
        priority: 'normal'
      },
      {
        id: 'A005',
        patientName: 'David Thompson',
        patientId: 'P-1028',
        age: 55,
        gender: 'Male',
        doctorName: 'Dr. Sarah Miller',
        time: '11:00 AM',
        endTime: '11:30 AM',
        status: 'no-show',
        room: '201A',
        appointmentType: 'Follow-up',
        phoneNumber: '+1-555-0127',
        reason: 'Hypertension check',
        priority: 'normal'
      },
      {
        id: 'A006',
        patientName: 'Emma Wilson',
        patientId: 'P-1029',
        age: 34,
        gender: 'Female',
        doctorName: 'Dr. James Wilson',
        time: '11:30 AM',
        endTime: '12:00 PM',
        status: 'completed',
        room: '203B',
        appointmentType: 'Consultation',
        phoneNumber: '+1-555-0128',
        reason: 'Pregnancy checkup',
        priority: 'high'
      }
    ]);
  }, [selectedDate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-teal-100 text-teal-800';
      case 'checked-in':
        return 'bg-teal-100 text-teal-800';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-consultation':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'no-show':
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
        return 'text-teal-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleStatusUpdate = (appointmentId, newStatus) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      )
    );
  };

  const handleVitalsSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the vitals data to your backend
    console.log('Vitals data for patient', selectedPatient?.patientId, ':', vitalsData);
    
    // Reset form and close modal
    setVitalsData({
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: '',
      height: '',
      oxygenSaturation: '',
      notes: ''
    });
    setShowVitalsModal(false);
    setSelectedPatient(null);
  };

  const openVitalsModal = (patient) => {
    setSelectedPatient(patient);
    setShowVitalsModal(true);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'checked-in', label: 'Checked In' },
    { value: 'waiting', label: 'Waiting' },
    { value: 'in-consultation', label: 'In Consultation' },
    { value: 'completed', label: 'Completed' },
    { value: 'no-show', label: 'No Show' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointments Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage patient appointments and update their status
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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
              placeholder="Search by patient name, ID, or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor & Room
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time & Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                        <div className="text-sm text-gray-500">{appointment.patientId}</div>
                        <div className="text-xs text-gray-500">{appointment.age}y, {appointment.gender}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{appointment.doctorName}</div>
                    <div className="text-sm text-gray-500">Room {appointment.room}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{appointment.time} - {appointment.endTime}</div>
                    <div className="text-sm text-gray-500">{appointment.appointmentType}</div>
                    <div className="text-xs text-gray-500">{appointment.reason}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-medium ${getPriorityColor(appointment.priority)}`}>
                      {appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {appointment.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'checked-in')}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Check In
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'no-show')}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            No Show
                          </button>
                        </>
                      )}
                      {appointment.status === 'checked-in' && (
                        <>
                          <button
                            onClick={() => openVitalsModal(appointment)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            Add Vitals
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => handleStatusUpdate(appointment.id, 'waiting')}
                            className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                          >
                            Mark Waiting
                          </button>
                        </>
                      )}
                      {appointment.status === 'waiting' && (
                        <button
                          onClick={() => handleStatusUpdate(appointment.id, 'in-consultation')}
                          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                        >
                          In Consultation
                        </button>
                      )}
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vitals Modal */}
      {showVitalsModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Record Vitals - {selectedPatient?.patientName}
                </h3>
                <button
                  onClick={() => setShowVitalsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Patient ID: {selectedPatient?.patientId} | Room: {selectedPatient?.room}
              </p>
            </div>
            
            <form onSubmit={handleVitalsSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Pressure (mmHg)
                  </label>
                  <input
                    type="text"
                    placeholder="120/80"
                    value={vitalsData.bloodPressure}
                    onChange={(e) => setVitalsData(prev => ({ ...prev, bloodPressure: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    placeholder="75"
                    value={vitalsData.heartRate}
                    onChange={(e) => setVitalsData(prev => ({ ...prev, heartRate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature (°F)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="98.6"
                    value={vitalsData.temperature}
                    onChange={(e) => setVitalsData(prev => ({ ...prev, temperature: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    placeholder="160"
                    value={vitalsData.weight}
                    onChange={(e) => setVitalsData(prev => ({ ...prev, weight: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (inches)
                  </label>
                  <input
                    type="number"
                    placeholder="68"
                    value={vitalsData.height}
                    onChange={(e) => setVitalsData(prev => ({ ...prev, height: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Oxygen Saturation (%)
                  </label>
                  <input
                    type="number"
                    placeholder="98"
                    value={vitalsData.oxygenSaturation}
                    onChange={(e) => setVitalsData(prev => ({ ...prev, oxygenSaturation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nursing Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Enter any observations or notes..."
                  value={vitalsData.notes}
                  onChange={(e) => setVitalsData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowVitalsModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Save Vitals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
