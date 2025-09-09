'use client';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = {
    doctors: {
      total: 15,
      available: 12,
      unavailable: 3
    },
    patients: {
      total: 150,
      newThisMonth: 12,
      activeAppointments: 45
    },
    appointments: {
      upcoming: 25,
      rescheduled: 5,
      cancelled: 3
    },
    feedback: {
      pending: 8,
      inProgress: 4,
      resolved: 15
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="text-sm font-medium text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-white bg-opacity-80 rounded-lg shadow-sm">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-semibold text-blue-700">{stats.doctors.available}/{stats.doctors.total}</span>
              <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Available</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.doctors.total}</h3>
          <p className="text-sm font-medium text-gray-600">Total Doctors</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-white bg-opacity-80 rounded-lg shadow-sm">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-semibold text-green-700">+{stats.patients.newThisMonth}</span>
              <span className="text-xs font-medium text-green-600 uppercase tracking-wider">New This Month</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.patients.total}</h3>
          <p className="text-sm font-medium text-gray-600">Total Patients</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-white bg-opacity-80 rounded-lg shadow-sm">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-semibold text-purple-700">{stats.appointments.upcoming}</span>
              <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">Today</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.appointments.upcoming + stats.appointments.rescheduled}</h3>
          <p className="text-sm font-medium text-gray-600">Upcoming Appointments</p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="p-3 bg-white bg-opacity-80 rounded-lg shadow-sm">
              <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-lg font-semibold text-amber-700">{stats.feedback.pending}</span>
              <span className="text-xs font-medium text-amber-600 uppercase tracking-wider">Pending</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{stats.feedback.pending + stats.feedback.inProgress}</h3>
          <p className="text-sm font-medium text-gray-600">Active Feedback</p>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Upcoming Appointments</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
              View All
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {[
            { id: 1, patient: 'Sarah Johnson', doctor: 'Dr. Emily Chen', type: 'Check-up', time: '10:00 AM', avatar: 'SJ', status: 'confirmed' },
            { id: 2, patient: 'Michael Chen', doctor: 'Dr. James Wilson', type: 'Follow-up', time: '11:30 AM', avatar: 'MC', status: 'confirmed' },
            { id: 3, patient: 'Emma Davis', doctor: 'Dr. Robert Smith', type: 'Consultation', time: '2:15 PM', avatar: 'ED', status: 'rescheduled' }
          ].map((appointment) => (
            <div key={appointment.id} className="flex items-center justify-between p-5 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-medium">
                  {appointment.avatar}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{appointment.patient}</div>
                  <div className="text-sm text-gray-500">{appointment.doctor} • {appointment.type}</div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-500">{appointment.time}</div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  {appointment.status === 'confirmed' ? 'Confirmed' : 'Rescheduled'}
                </span>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Add Doctor', icon: 'M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z', path: '/admin/doctors', color: 'blue' },
            { name: 'View Patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', path: '/admin/patients', color: 'green' },
            { name: 'Schedule Appointment', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', path: '/admin/appointments', color: 'purple' },
            { name: 'Review Feedback', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z', path: '/admin/feedback', color: 'amber' },
          ].map((action) => (
            <Link 
              key={action.name} 
              href={action.path}
              className={`flex flex-row sm:flex-col items-center p-4 rounded-lg border border-${action.color}-200 bg-${action.color}-50 hover:bg-${action.color}-100 transition-colors`}
            >
              <div className={`p-3 bg-white rounded-full shadow-sm sm:mb-3 mr-3 sm:mr-0 text-${action.color}-600 flex-shrink-0`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                </svg>
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}