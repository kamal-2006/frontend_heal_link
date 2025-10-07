'use client';

import { useState, useEffect } from 'react';

export default function AppointmentManagement() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Fetch appointments from database
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/v1/appointments');
      
      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }
      
      const result = await response.json();
      setAppointments(result.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Load appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

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

  const formatTime = (iso) => {
    const d = new Date(iso);
    return d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const formatDateTime = (isoDate, time) => `${formatDate(isoDate)} • ${time || formatTime(isoDate)}`;

  const formatCompactDateTime = (appointment) => {
    const date = formatDate(appointment.date);
    const time = appointment.time || formatTime(appointment.date);
    return { date, time };
  };

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
    // This will be handled by the update function
    handleUpdateAppointment(appointmentId, { status: newStatus });
  };

  // Handle view appointment details
  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  // Handle delete appointment
  const handleDeleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/v1/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete appointment');
      }

      // Remove from local state
      setAppointments(appointments.filter(app => app._id !== appointmentId));
      setSuccessMessage('Appointment deleted successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Close modal if open
      setIsDetailsModalOpen(false);
    } catch (err) {
      console.error('Error deleting appointment:', err);
      setError('Failed to delete appointment');
    }
  };

  // Handle update appointment
  const handleUpdateAppointment = async (appointmentId, updateData) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment');
      }

      const result = await response.json();
      
      // Update local state
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { ...app, ...updateData } : app
      ));
      
      setSuccessMessage('Appointment updated successfully');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Close modal
      setIsDetailsModalOpen(false);
      
      // Refresh appointments to get latest data
      fetchAppointments();
    } catch (err) {
      console.error('Error updating appointment:', err);
      setError('Failed to update appointment');
    }
  };

  // Handle reschedule appointment
  const handleRescheduleAppointment = async (appointmentId, newDateTime) => {
    try {
      console.log('Rescheduling appointment:', appointmentId, 'to:', newDateTime);
      
      // Get current appointment to preserve original date
      const currentAppointment = appointments.find(app => app._id === appointmentId);
      
      const updateData = {
        date: newDateTime,
        status: 'confirmed',
        isRescheduled: true,
        originalDate: currentAppointment.originalDate || currentAppointment.date, // Preserve original date
        rescheduleCount: (currentAppointment.rescheduleCount || 0) + 1
      };
      
      const response = await fetch(`http://localhost:5000/api/v1/appointments/${appointmentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const result = await response.json();
      console.log('Reschedule response:', result);

      if (!response.ok) {
        throw new Error(result.error || result.message || 'Failed to reschedule appointment');
      }
      
      // Send notification to patient
      await sendRescheduleNotification(appointmentId, newDateTime);
      
      // Update local state
      setAppointments(appointments.map(app => 
        app._id === appointmentId ? { 
          ...app, 
          ...updateData
        } : app
      ));
      
      setSuccessMessage('Appointment rescheduled successfully and patient notified');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      // Close modal
      setIsDetailsModalOpen(false);
      
      // Refresh appointments to get latest data
      fetchAppointments();
    } catch (err) {
      console.error('Error rescheduling appointment:', err);
      setError(err.message || 'Failed to reschedule appointment');
      setTimeout(() => setError(null), 5000);
    }
  };

  // Send reschedule notification to patient
  const sendRescheduleNotification = async (appointmentId, newDateTime) => {
    try {
      const appointment = appointments.find(app => app._id === appointmentId);
      if (!appointment) {
        console.warn('Appointment not found for notification');
        return;
      }

      const notificationData = {
        patientId: appointment.patient._id,
        type: 'appointment_rescheduled',
        title: 'Appointment Rescheduled',
        message: `Your appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName} has been rescheduled to ${new Date(newDateTime).toLocaleDateString()} at ${new Date(newDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}.`,
        appointmentId: appointmentId,
        newDateTime: newDateTime
      };

      console.log('Sending notification:', notificationData);

      const notificationResponse = await fetch(`http://localhost:5000/api/v1/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
      });

      if (!notificationResponse.ok) {
        const errorData = await notificationResponse.json();
        console.warn('Failed to send notification to patient:', errorData);
      } else {
        console.log('Reschedule notification sent to patient successfully');
      }
    } catch (err) {
      console.warn('Error sending notification (non-critical):', err);
      // Don't throw error - notification failure shouldn't block reschedule
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

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {successMessage}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

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
                  <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-600">Loading appointments...</span>
                      </div>
                    </td>
                  </tr>
                ) : appointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="h-9 w-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-semibold">
                            {getInitials(`${appointment.patient?.firstName} ${appointment.patient?.lastName}`)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.patient?.firstName} {appointment.patient?.lastName}
                            </div>
                            <div className="text-xs text-gray-500">{appointment.patient?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{appointment.doctor?.specialty || 'General Medicine'}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCompactDateTime(appointment).date}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatCompactDateTime(appointment).time}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.reason}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <span className={`inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                          </span>
                          {appointment.isRescheduled && (
                            <span className="inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                              Rescheduled
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleViewAppointment(appointment)}
                          className="inline-flex items-center justify-center h-8 w-8 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                          aria-label="View appointment details"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zm11 3a3 3 0 100-6 3 3 0 000 6z" />
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

      {/* Appointment Details Modal */}
      {isDetailsModalOpen && selectedAppointment && (
        <AppointmentDetailsModal 
          appointment={selectedAppointment}
          onClose={() => setIsDetailsModalOpen(false)}
          onReschedule={handleRescheduleAppointment}
          onDelete={handleDeleteAppointment}
        />
      )}
    </div>
  );
}
// Appointment Details Modal Component
function AppointmentDetailsModal({ appointment, onClose, onReschedule, onDelete }) {
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');

  useEffect(() => {
    if (appointment) {
      // Format date for input (YYYY-MM-DD)
      const date = new Date(appointment.date);
      const formattedDate = date.toISOString().split('T')[0];
      setNewDate(formattedDate);
      
      // Format time for input (HH:MM)
      const formattedTime = date.toTimeString().slice(0, 5);
      setNewTime(formattedTime);
    }
  }, [appointment]);

  const handleReschedule = () => {
    if (showTimeSlots && selectedTimeSlot && newDate) {
      // Combine date and selected time slot
      const dateTime = new Date(`${newDate}T${selectedTimeSlot}`);
      onReschedule(appointment._id, dateTime.toISOString());
    } else {
      // Show time slots for selection
      setShowTimeSlots(true);
    }
  };

  const handleDelete = () => {
    onDelete(appointment._id);
  };

  // Time slots array - same as used in doctor management
  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Appointment Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Patient Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Name</label>
              <p className="text-sm text-gray-900">
                {appointment.patient?.firstName} {appointment.patient?.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Email</label>
              <p className="text-sm text-gray-900">{appointment.patient?.email || 'N/A'}</p>
            </div>
            
            {/* Doctor Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
              <p className="text-sm text-gray-900">
                Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <p className="text-sm text-gray-900">{appointment.doctor?.specialty || 'General Medicine'}</p>
            </div>
            
            {/* Appointment Details */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Date</label>
              <p className="text-sm text-gray-900">{formatDate(appointment.date)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Time</label>
              <p className="text-sm text-gray-900">{formatTime(appointment.date)}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <span className={`inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Appointment ID</label>
              <p className="text-sm text-gray-900">{appointment._id}</p>
            </div>
            
            {/* Update Date/Time Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {!showTimeSlots ? (
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Time</label>
                <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded-md">{formatTime(appointment.date)}</p>
                <p className="text-xs text-gray-500 mt-1">Click "Reschedule" to select new time</p>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700">Select New Time Slot</label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="">Select a time slot...</option>
                  {timeSlots.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
                {selectedTimeSlot && (
                  <p className="text-sm text-green-600 mt-2">✓ Selected: {selectedTimeSlot}</p>
                )}
              </div>
            )}
          </div>
          
          {/* Full-width fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Appointment Reason</label>
            <p className="text-sm text-gray-900">{appointment.reason}</p>
          </div>
          
          {appointment.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes</label>
              <p className="text-sm text-gray-900">{appointment.notes}</p>
            </div>
          )}
          
          {appointment.patient?.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Patient Phone</label>
              <p className="text-sm text-gray-900">{appointment.patient.phone}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t border-gray-200">
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Appointment
            </button>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleReschedule}
                disabled={showTimeSlots && (!newDate || !selectedTimeSlot)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showTimeSlots && (!newDate || !selectedTimeSlot)
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {showTimeSlots ? 'Confirm Reschedule' : 'Reschedule'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}