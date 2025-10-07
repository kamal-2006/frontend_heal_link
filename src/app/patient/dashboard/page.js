'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toTitleCase } from '../../../utils/text';
import usePatient from '../../../hooks/usePatient';
import { patientApi, appointmentApi } from '../../../utils/api';

export default function PatientDashboard() {
  const router = useRouter();
  const { patient, loading: patientLoading, error: patientError } = usePatient();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showReasonDialog, setShowReasonDialog] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      
      if (!token || role !== 'patient') {
        router.push('/login');
        return;
      }

      try {
        // Fetch patient-specific data
        const { appointmentApi, medicationApi, reportsApi } = await import('../../../utils/api');
        const [appointmentsRes, medicationsRes, notificationsRes, dashboardRes, reportsRes] = await Promise.all([
          appointmentApi.getMyAppointments().catch(() => ({ data: [] })),
          medicationApi.getMyActiveMedications().catch(() => ({ data: [] })),
          fetch('http://localhost:5000/api/v1/notifications/patient', {
            headers: { Authorization: `Bearer ${token}` }
          }).then(res => res.json()).catch(() => ({ data: [] })),
          patientApi.getDashboard().catch(() => ({ data: null, error: 'Network error' })),
          reportsApi.getMyReports().catch(() => ({ data: [] }))
        ]);

        setAppointments(appointmentsRes?.data || []);
        setPrescriptions(medicationsRes?.data || []);
        setNotifications(notificationsRes?.data || []);
        setReports(reportsRes?.data || []);

        // dashboardRes may be { data: null, error, status } when patient not found
        if (dashboardRes && typeof dashboardRes === 'object') {
          setDashboardData(dashboardRes.data ?? null);
          if (dashboardRes.error) {
            console.warn('Patient dashboard error:', dashboardRes.error);
          }
        } else {
          setDashboardData(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Listen for medical report changes
  useEffect(() => {
    const handleReportDeleted = async (event) => {
      console.log('Report deleted:', event.detail);
      // Refresh reports data
      try {
        const { reportsApi } = await import('../../../utils/api');
        const reportsRes = await reportsApi.getMyReports();
        setReports(reportsRes?.data || []);
      } catch (error) {
        console.error('Error refreshing reports:', error);
      }
    };

    const handleReportUploaded = async (event) => {
      console.log('Report uploaded:', event.detail);
      // Refresh reports data
      try {
        const { reportsApi } = await import('../../../utils/api');
        const reportsRes = await reportsApi.getMyReports();
        setReports(reportsRes?.data || []);
      } catch (error) {
        console.error('Error refreshing reports:', error);
      }
    };

    window.addEventListener('medicalReportDeleted', handleReportDeleted);
    window.addEventListener('medicalReportUploaded', handleReportUploaded);

    return () => {
      window.removeEventListener('medicalReportDeleted', handleReportDeleted);
      window.removeEventListener('medicalReportUploaded', handleReportUploaded);
    };
  }, []);

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
      
      const result = await appointmentApi.cancelAppointment(appointmentToCancel._id, {
        reason: cancellationReason.trim()
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Appointment cancelled successfully!' 
      });
      
      // Refresh the appointments list
      const appointmentsRes = await appointmentApi.getMyAppointments();
      setAppointments(appointmentsRes.data || []);
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

  // Helper function to get the actual status of an appointment based on current time
  const getActualAppointmentStatus = (appointment) => {
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    
    // If appointment is in the past and was pending or confirmed, mark as completed
    if (appointmentDate < now && (appointment.status === 'pending' || appointment.status === 'confirmed')) {
      return 'completed';
    }
    
    // Otherwise, return the original status
    return appointment.status;
  };

  // Get upcoming appointments (max 3) - latest booked first
  const upcomingAppointments = appointments
    .filter(app => {
      const appointmentDate = new Date(app.date);
      const now = new Date();
      const actualStatus = getActualAppointmentStatus(app);
      
      // Only show future appointments that are pending or confirmed
      return (actualStatus === 'pending' || actualStatus === 'confirmed') && appointmentDate >= now;
    })
    .sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id))
    .slice(0, 3);

  // Get active medications count
  const activeMedications = prescriptions || [];

  // Count unread reports (adjust for real data structure)
  const unreadReportsCount = reports.filter(report => report.status === 'new').length;

  return (
    <div className="space-y-4">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {patient?.user ? (
              `${toTitleCase(patient.user.firstName)} ${toTitleCase(patient.user.lastName)}`
            ) : (
              'Patient'
            )}!
          </h1>
          <p className="text-sm text-gray-500">
            Here is a summary of your healthcare activities.
          </p>
        </div>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
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
      
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* New Appointment Card */}
        <Link href="/patient/dashboard/book" className="block group">
          <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm p-4 hover:shadow-md transition-all duration-300 h-full min-h-[120px] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 leading-tight text-gray-900">Book Appointment</h3>
                <p className="text-blue-700 text-sm leading-relaxed">Schedule your next visit</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-sm ml-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-blue-700 text-sm font-semibold">Click to book</span>
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Reports Card */}
        <Link href="/patient/reports" className="block group">
          <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 shadow-sm p-4 hover:shadow-md transition-all duration-300 h-full min-h-[120px] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 leading-tight text-gray-900">Medical Reports</h3>
                <p className="text-purple-700 text-sm leading-relaxed">Lab results & documents</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-sm ml-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-gray-900">{unreadReportsCount}</span>
                  <span className="text-purple-700 text-sm ml-2 font-semibold">new reports</span>
                </div>
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Current Medications Card */}
        <Link href="/patient/medications" className="block group">
          <div className="rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-sm p-4 hover:shadow-md transition-all duration-300 h-full min-h-[120px] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 leading-tight text-gray-900">Medications</h3>
                <p className="text-green-700 text-sm leading-relaxed">Active prescriptions</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white text-green-600 flex items-center justify-center shadow-sm ml-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-gray-900">{activeMedications.length}</span>
                  <span className="text-green-700 text-sm ml-2 font-semibold">active meds</span>
                </div>
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Upcoming Appointments Card */}
        <Link href="/patient/appointments" className="block group">
          <div className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm p-4 hover:shadow-md transition-all duration-300 h-full min-h-[120px] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 leading-tight text-gray-900">Appointments</h3>
                <p className="text-amber-700 text-sm leading-relaxed">Scheduled visits</p>
              </div>
              <div className="h-10 w-10 rounded-xl bg-white text-amber-600 flex items-center justify-center shadow-sm ml-2 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-extrabold text-gray-900">{upcomingAppointments.length}</span>
                  <span className="text-amber-700 text-sm ml-2 font-semibold">upcoming</span>
                </div>
                <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Notifications Section */}
      {notifications && notifications.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
          <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">Recent Notifications</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-60 overflow-y-auto">
            {notifications.slice(0, 5).map((notification, index) => (
              <div key={index} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    notification.type === 'appointment_rescheduled' ? 'bg-orange-500' :
                    notification.type === 'appointment_confirmed' ? 'bg-green-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(notification.createdAt || new Date()).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Appointments Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Appointments</h3>
          <Link href="/patient/appointments" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">View all</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="px-4 sm:px-6 py-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <div key={appointment._id} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">
                        Dr. {appointment.doctor?.firstName || 'Unknown'} {appointment.doctor?.lastName || ''}
                      </h4>
                      <p className="text-sm text-gray-500">{appointment.reason || 'General Checkup'}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 ml-14 sm:ml-0">
                    <div className="text-left sm:text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(appointment.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(appointment.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full font-medium ${
                      getActualAppointmentStatus(appointment) === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : getActualAppointmentStatus(appointment) === 'completed'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {getActualAppointmentStatus(appointment) === 'confirmed' 
                        ? 'Confirmed' 
                        : getActualAppointmentStatus(appointment) === 'completed'
                        ? 'Completed'
                        : 'Scheduled'}
                    </span>
                    {getActualAppointmentStatus(appointment) === 'pending' && 
                     new Date(appointment.date) > new Date() && (
                      <button
                        onClick={() => handleCancelAppointment(appointment._id)}
                        disabled={cancellingId === appointment._id}
                        className="px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded border border-red-300 hover:border-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {cancellingId === appointment._id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 sm:px-6 py-8 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">No upcoming appointments</p>
              <Link href="/patient/dashboard/book" className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800">
                Book your first appointment
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Current Medications Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
          <h3 className="text-lg font-medium text-gray-900">Current Medications</h3>
          <Link href="/patient/medications" className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">View all</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="px-4 sm:px-6 py-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
            </div>
          ) : activeMedications.length > 0 ? (
            activeMedications.map((medication, index) => (
              <div key={index} className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-150">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{medication.name}</h4>
                      <p className="text-sm text-gray-500">{medication.dosage}</p>
                    </div>
                  </div>
                  <div className="ml-14 sm:ml-0">
                    <span className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                      {medication.frequency}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 sm:px-6 py-8 text-center text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-sm">No active medications</p>
            </div>
          )}
        </div>
      </div>
        </>
      )}

      {/* Cancellation Reason Dialog */}
      {showReasonDialog && appointmentToCancel && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Reason for Cancellation
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Please provide a reason for cancelling your appointment with Dr. {appointmentToCancel.doctor?.firstName} {appointmentToCancel.doctor?.lastName} on {new Date(appointmentToCancel.date).toLocaleDateString()}.
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
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
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
                    Dr. {appointmentToCancel?.doctor?.firstName} {appointmentToCancel?.doctor?.lastName}
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
