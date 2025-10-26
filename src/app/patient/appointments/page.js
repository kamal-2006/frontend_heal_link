'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getDoctorName, toTitleCase } from '../../../utils/doctorUtils';
import { appointmentApi } from '../../../utils/api';

export default function PatientAppointments() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, past, cancelled
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cancellationReason, setCancellationReason] = useState('');
  const [showReasonDialog, setShowReasonDialog] = useState(false);

  useEffect(() => {
    const fetchAppointments = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await appointmentApi.getMyAppointments();
        setAppointments(response.data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [router]);

  // Listen for appointment booking events
  useEffect(() => {
    const handleAppointmentBooked = async (event) => {
      console.log('Appointment booked:', event.detail);
      // Refresh appointments list
      try {
        const response = await appointmentApi.getMyAppointments();
        setAppointments(response?.data || []);
        setMessage({ 
          type: 'success', 
          text: 'New appointment has been added!' 
        });
        // Clear message after 3 seconds
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      } catch (error) {
        console.error('Error refreshing appointments:', error);
      }
    };

    window.addEventListener('appointmentBooked', handleAppointmentBooked);

    return () => {
      window.removeEventListener('appointmentBooked', handleAppointmentBooked);
    };
  }, []);

  // Helper function to get the actual status of an appointment based on current time
  const getActualAppointmentStatus = (appointment) => {
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    
    // If appointment is in the past and was scheduled or confirmed, mark as completed
    if (appointmentDate < now && (appointment.status === 'scheduled' || appointment.status === 'confirmed')) {
      return 'completed';
    }
    
    // Otherwise, return the original status
    return appointment.status;
  };

  const handleCancelAppointment = async (appointmentId) => {
    const appointment = appointments.find(apt => apt._id === appointmentId);
    setAppointmentToCancel(appointment);
    setCancellationReason('');
    setShowReasonDialog(true);
  };

  const proceedWithCancellation = () => {
    if (!cancellationReason.trim()) {
      alert('Please provide a reason for cancellation');
      return;
    }
    setShowReasonDialog(false);
    setShowConfirmDialog(true);
  };

  const confirmCancellation = async () => {
    if (!appointmentToCancel) return;
    
    try {
      setCancellingId(appointmentToCancel._id);
      setMessage({ type: '', text: '' });
      setShowConfirmDialog(false);
      
      const result =       await appointmentApi.cancelAppointment(appointmentToCancel._id, {
        reason: cancellationReason.trim()
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Appointment cancelled successfully!' 
      });
      
      // Refresh the appointments list
      const response = await appointmentApi.getMyAppointments();
      setAppointments(response.data || []);
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to cancel appointment. Please try again.' 
      });
    } finally {
      setCancellingId(null);
      setAppointmentToCancel(null);
    }
  };

  const cancelCancellation = () => {
    setShowConfirmDialog(false);
    setShowReasonDialog(false);
    setAppointmentToCancel(null);
    setCancellationReason('');
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    let filtered;
    switch (filter) {
      case 'upcoming':
        filtered = appointments.filter(apt => new Date(apt.date) > now && apt.status !== 'cancelled');
        break;
      case 'past':
        filtered = appointments.filter(apt => new Date(apt.date) < now);
        break;
      case 'cancelled':
        filtered = appointments.filter(apt => apt.status === 'cancelled');
        break;
      default:
        filtered = appointments;
    }
    
    // Apply search filter if search query exists
    if (searchQuery.trim()) {
      filtered = filtered.filter(apt => {
        const doctorName = `${apt.doctor?.firstName || ''} ${apt.doctor?.lastName || ''}`.toLowerCase();
        const appointmentType = (apt.type || '').toLowerCase();
        const reason = (apt.reason || '').toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return doctorName.includes(query) || 
               appointmentType.includes(query) || 
               reason.includes(query);
      });
    }
    
    // Sort by creation date (latest booked first)
    return filtered.sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id));
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-700'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredAppointments = getFilteredAppointments();

  const formatTime = (isoDate) => {
    try {
      return new Date(isoDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (_) {
      return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-sm text-gray-500">View and manage your medical appointments</p>
        </div>
        <Link
          href="/patient/dashboard/book"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Book New Appointment
        </Link>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by doctor name, appointment type, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600">
            Showing results for: <span className="font-medium">"{searchQuery}"</span>
            {filteredAppointments.length === 0 && (
              <span className="text-red-600 ml-2">No appointments found</span>
            )}
          </p>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'all', label: 'All Appointments', count: appointments.length },
              { key: 'upcoming', label: 'Upcoming', count: appointments.filter(apt => new Date(apt.date) > new Date() && apt.status !== 'cancelled').length },
              { key: 'past', label: 'Past', count: appointments.filter(apt => new Date(apt.date) < new Date() || apt.status === 'completed').length },
              { key: 'cancelled', label: 'Cancelled', count: appointments.filter(apt => apt.status === 'cancelled').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  filter === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Appointments List */}
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <div key={appointment._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Dr. {getDoctorName(appointment.doctor)}
                      </h3>
                      <p className="text-sm text-gray-600">{appointment.type || 'General Medicine'}</p>
                      <p className="text-sm text-gray-500">{appointment.reason}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(appointment.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-500">{formatTime(appointment.date)}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(getActualAppointmentStatus(appointment))}`}>
                        {toTitleCase(getActualAppointmentStatus(appointment))}
                      </span>
                      {appointment.status === 'scheduled' && 
                       new Date(appointment.date) > new Date() && (
                        <button
                          onClick={() => handleCancelAppointment(appointment._id)}
                          disabled={cancellingId === appointment._id}
                          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md border border-red-300 hover:border-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancellingId === appointment._id ? 'Cancelling...' : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {searchQuery ? `No appointments found for "${searchQuery}"` : 'No appointments found'}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery 
                  ? 'Try adjusting your search terms or clear the search to see all appointments.'
                  : filter === 'all' 
                    ? "You don't have any appointments yet." 
                    : `No ${filter} appointments found.`
                }
              </p>
              <div className="mt-6 space-y-3">
                {searchQuery ? (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Search
                  </button>
                ) : (
                  <Link
                    href="/patient/dashboard/book"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Book your first appointment
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cancellation Reason Dialog */}
      {showReasonDialog && appointmentToCancel && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Reason for Cancellation
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Please provide a reason for cancelling your appointment with Dr. {getDoctorName(appointmentToCancel.doctor)} on {new Date(appointmentToCancel.date).toLocaleDateString()}.
              </p>
              <textarea
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                placeholder="Enter your reason for cancellation..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1">
                {cancellationReason.length}/500 characters
              </p>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={cancelCancellation}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Back
                </button>
                <button
                  onClick={proceedWithCancellation}
                  disabled={!cancellationReason.trim()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="relative p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">Cancel Appointment</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to cancel your appointment with{' '}
                  <span className="font-medium">
                    Dr. {getDoctorName(appointmentToCancel?.doctor)}
                  </span>{' '}
                  on{' '}
                  <span className="font-medium">
                    {appointmentToCancel && new Date(appointmentToCancel.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>?
                </p>
                <p className="text-sm text-red-600 mt-2">
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={cancelCancellation}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  Keep Appointment
                </button>
                <button
                  onClick={confirmCancellation}
                  disabled={cancellingId === appointmentToCancel?._id}
                  className="flex-1 px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancellingId === appointmentToCancel?._id ? 'Cancelling...' : 'Yes, Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
