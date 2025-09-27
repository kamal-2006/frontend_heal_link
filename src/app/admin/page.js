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
        {/* Doctors Card */}
        <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 shadow-sm p-5">
          <div className="text-[12px] font-semibold text-blue-700 mb-2">Total Doctors</div>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-extrabold text-gray-900">{stats.doctors.total}</div>
            <div className="h-12 w-12 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-blue-700">
            <span className="font-semibold mr-2">{stats.doctors.available}</span>
            available today
          </div>
        </div>

        {/* Patients Card */}
        <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100 shadow-sm p-5">
          <div className="text-[12px] font-semibold text-green-700 mb-2">Total Patients</div>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-extrabold text-gray-900">{stats.patients.total}</div>
            <div className="h-12 w-12 rounded-xl bg-white text-green-600 flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-green-700">
            <span className="font-semibold mr-2">+{stats.patients.newThisMonth}</span>
            this month
          </div>
        </div>

        {/* Appointments Card */}
        <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 shadow-sm p-5">
          <div className="text-[12px] font-semibold text-purple-700 mb-2">Appointments Today</div>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-extrabold text-gray-900">{stats.appointments.upcoming}</div>
            <div className="h-12 w-12 rounded-xl bg-white text-purple-600 flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-purple-700">
            <span className="font-semibold mr-2">{stats.appointments.rescheduled}</span>
            rescheduled
          </div>
        </div>

        {/* Feedback Card */}
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-amber-100 shadow-sm p-5">
          <div className="text-[12px] font-semibold text-amber-700 mb-2">Active Feedback</div>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-extrabold text-gray-900">{stats.feedback.pending + stats.feedback.inProgress}</div>
            <div className="h-12 w-12 rounded-xl bg-white text-amber-600 flex items-center justify-center shadow-sm">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
          </div>
          <div className="mt-3 flex items-center text-xs text-amber-700">
            <span className="font-semibold mr-2">{stats.feedback.pending}</span>
            pending
          </div>
        </div>
      </div>

      {/* Upcoming Appointments removed per requirements */}

      {/* Quick Actions - Color Blocks (clearly different from stat cards) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              label: 'Total Doctors',
              value: stats.doctors.total,
              gradient: 'from-blue-700 to-sky-500',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              ),
              href: '/admin/doctors',
            },
            {
              label: 'Total Patients',
              value: stats.patients.total,
              gradient: 'from-emerald-700 to-teal-500',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              ),
              href: '/admin/patients',
            },
            {
              label: 'Appointments Today',
              value: stats.appointments.upcoming,
              gradient: 'from-indigo-700 to-violet-500',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              ),
              href: '/admin/appointments',
            },
            {
              label: 'Active Feedback',
              value: stats.feedback.pending + stats.feedback.inProgress,
              gradient: 'from-rose-700 to-amber-500',
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              ),
              href: '/admin/feedback',
            },
          ].map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${tile.gradient} text-white shadow hover:shadow-xl transition-all duration-200 min-h-36 flex flex-col`}
            >
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="flex items-center">
                  <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {tile.icon}
                    </svg>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider opacity-90">{tile.label}</div>
                    <div className="text-2xl font-extrabold leading-tight">{tile.value}</div>
                  </div>
                </div>
                <div className="mt-4 w-full flex justify-end">
                  <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">Go</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* KPI Diagram: Doctor Availability */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-800">Doctor Availability</h2>
          <span className="text-sm text-gray-600">{Math.round((stats.doctors.available / stats.doctors.total) * 100)}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-3 bg-blue-600 rounded-full"
            style={{ width: `${(stats.doctors.available / stats.doctors.total) * 100}%` }}
          ></div>
        </div>
        <div className="mt-2 text-xs text-gray-500">{stats.doctors.available} of {stats.doctors.total} doctors available today</div>
      </div>
    </div>
  );
}
