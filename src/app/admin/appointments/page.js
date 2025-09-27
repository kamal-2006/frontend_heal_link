'use client';

import { useState } from 'react';

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientId: 'PT-001',
      patientName: 'Alice Johnson',
      doctorName: 'Dr. John Doe',
      doctorSpecialization: 'Cardiology',
      date: '2024-02-01',
      time: '09:00 AM',
      status: 'scheduled',
      type: 'Regular Checkup'
    },
    {
      id: 2,
      patientId: 'PT-002',
      patientName: 'Bob Wilson',
      doctorName: 'Dr. Jane Smith',
      doctorSpecialization: 'Dermatology',
      date: '2024-02-02',
      time: '10:30 AM',
      status: 'rescheduled',
      type: 'Follow-up'
    },
    {
      id: 3,
      patientId: 'PT-003',
      patientName: 'Carol Brown',
      doctorName: 'Dr. John Doe',
      doctorSpecialization: 'Cardiology',
      date: '2024-02-01',
      time: '02:00 PM',
      status: 'cancelled',
      type: 'Consultation'
    }
  ]);

  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    const first = parts[0]?.[0] || '';
    const last = parts[parts.length - 1]?.[0] || '';
    return (first + last).toUpperCase();
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatDateTime = (isoDate, time) => `${formatDate(isoDate)} • ${time}`;

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setIsRescheduleModalOpen(true);
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(appointments.map(appointment =>
      appointment.id === appointmentId
        ? { ...appointment, status: newStatus }
        : appointment
    ));
  };

  const handleRescheduleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newDate = formData.get('date');
    const newTime = formData.get('time');
    
    if (selectedAppointment && newDate && newTime) {
      setAppointments(appointments.map(appointment =>
        appointment.id === selectedAppointment.id
          ? { 
              ...appointment, 
              date: newDate,
              time: newTime,
              status: 'rescheduled'
            }
          : appointment
      ));
      setIsRescheduleModalOpen(false);
      setSelectedAppointment(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Breadcrumbs */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <nav className="text-sm text-gray-600 mb-2" aria-label="Breadcrumb">
              <ol className="list-reset inline-flex">
                <li>Home</li>
                <li className="mx-2">›</li>
                <li>Admin</li>
                <li className="mx-2">›</li>
                <li className="text-gray-900 font-medium">Appointments</li>
              </ol>
            </nav>
            <h1 className="text-3xl font-bold text-gray-900">Appointment Management</h1>
          </div>
          <div className="text-gray-600">
            {/* Current Date */}
            {new Date().toLocaleDateString('en-GB')}
          </div>
        </div>

        {/* Table only layout — filters removed per refined prompt */}

        {/* Appointments Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Appointments List</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Appointment Type
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
                          {getInitials(appointment.patientName)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{appointment.patientName}</div>
                          {appointment.patientId && (
                            <div className="text-xs text-gray-500">{appointment.patientId}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.doctorName}</div>
                      {appointment.doctorSpecialization && (
                        <div className="text-xs text-gray-500">{appointment.doctorSpecialization}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDateTime(appointment.date, appointment.time)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleReschedule(appointment)}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                        aria-label="View appointment details"
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

        {/* Empty State (if no appointments) */}
        {appointments.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by scheduling a new appointment.</p>
          </div>
        )}
      </div>

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Appointment Details</h2>
              <p className="text-sm text-gray-600 mt-1">
                Patient: <span className="font-medium">{selectedAppointment.patientName}</span>
                {selectedAppointment.patientId ? ` (${selectedAppointment.patientId})` : ''}
              </p>
              <p className="text-sm text-gray-600">
                Doctor: <span className="font-medium">{selectedAppointment.doctorName}</span>
                {selectedAppointment.doctorSpecialization ? ` • ${selectedAppointment.doctorSpecialization}` : ''}
              </p>
            </div>
            
            <form onSubmit={handleRescheduleSubmit} className="px-6 py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                    defaultValue={selectedAppointment.date}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    required
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this appointment?')) {
                      setAppointments(appointments.filter((a) => a.id !== selectedAppointment.id));
                      setIsRescheduleModalOpen(false);
                      setSelectedAppointment(null);
                    }
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-150"
                >
                  Delete Appointment
                </button>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRescheduleModalOpen(false);
                      setSelectedAppointment(null);
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-150"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150"
                  >
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}