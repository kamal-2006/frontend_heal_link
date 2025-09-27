'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toTitleCase } from '../../../utils/text';

export default function PatientDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [patientName, setPatientName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Get patient name from localStorage
      const storedFirstName = localStorage.getItem('firstName') || 'Patient';
      const storedLastName = localStorage.getItem('lastName') || '';
      setFirstName(storedFirstName);
      setLastName(storedLastName);
      setPatientName(`${storedFirstName} ${storedLastName}`);

      try {
        const [appointmentsRes, prescriptionsRes] = await Promise.all([
          fetch('http://localhost:5000/api/v1/appointments', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/v1/prescriptions', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const appointmentsData = await appointmentsRes.json();
        const prescriptionsData = await prescriptionsRes.json();

        if (appointmentsRes.ok) {
          setAppointments(appointmentsData.data || []);
        } else {
          console.error('Failed to fetch appointments');
        }

        if (prescriptionsRes.ok) {
          setPrescriptions(prescriptionsData.data || []);
        } else {
          console.error('Failed to fetch prescriptions');
        }

        // Mock reports data for now
        setReports([
          { id: 1, name: 'Blood Test', date: '2023-06-15', status: 'New' },
          { id: 2, name: 'X-Ray Report', date: '2023-06-10', status: 'Viewed' },
          { id: 3, name: 'MRI Scan', date: '2023-05-28', status: 'New' },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Get upcoming appointments (max 3)
  const upcomingAppointments = appointments
    .filter(app => app.status === 'scheduled' || app.status === 'confirmed')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  // Get active medications from prescriptions
  const activeMedications = prescriptions
    .filter(prescription => {
      const endDate = new Date(prescription.endDate);
      return endDate >= new Date();
    })
    .flatMap(prescription => prescription.medications || [])
    .slice(0, 5);

  // Count unread reports
  const unreadReportsCount = reports.filter(report => report.status === 'New').length;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {toTitleCase(firstName)} {toTitleCase(lastName)}!
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
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* New Appointment Card */}
        <Link href="/patient/dashboard/book" className="block group">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 h-full min-h-[140px] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 leading-tight">Book Appointment</h3>
                <p className="text-blue-100 text-sm leading-relaxed">Schedule your next visit</p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 p-3 rounded-full ml-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <span className="text-blue-100 text-sm font-medium">Click to book</span>
                <svg className="w-4 h-4 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Reports Card */}
        <Link href="/patient/reports" className="block group">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 h-full min-h-[140px] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 leading-tight">Medical Reports</h3>
                <p className="text-purple-100 text-sm leading-relaxed">Lab results & documents</p>
              </div>
              <div className="bg-purple-400 bg-opacity-30 p-3 rounded-full ml-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">{unreadReportsCount}</span>
                  <span className="text-purple-100 text-sm ml-2">new reports</span>
                </div>
                <svg className="w-4 h-4 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Current Medications Card */}
        <Link href="/patient/medications" className="block group">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 h-full min-h-[140px] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 leading-tight">Medications</h3>
                <p className="text-green-100 text-sm leading-relaxed">Active prescriptions</p>
              </div>
              <div className="bg-green-400 bg-opacity-30 p-3 rounded-full ml-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">{activeMedications.length}</span>
                  <span className="text-green-100 text-sm ml-2">active meds</span>
                </div>
                <svg className="w-4 h-4 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>

        {/* Upcoming Appointments Card */}
        <Link href="/patient/appointments" className="block group">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-md p-6 text-white hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 h-full min-h-[140px] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 leading-tight">Appointments</h3>
                <p className="text-amber-100 text-sm leading-relaxed">Scheduled visits</p>
              </div>
              <div className="bg-amber-400 bg-opacity-30 p-3 rounded-full ml-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold">{upcomingAppointments.length}</span>
                  <span className="text-amber-100 text-sm ml-2">upcoming</span>
                </div>
                <svg className="w-4 h-4 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </Link>
      </div>

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
                      appointment.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {appointment.status === 'confirmed' ? 'Confirmed' : 'Scheduled'}
                    </span>
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
    </div>
  );
    
}
