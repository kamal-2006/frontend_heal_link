'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    doctors: {
      total: 0,
      available: 0,
      unavailable: 0
    },
    patients: {
      total: 0,
      newThisMonth: 0,
      activeAppointments: 0
    },
    appointments: {
      upcoming: 0,
      rescheduled: 0,
      cancelled: 0
    },
    feedback: {
      pending: 0,
      inProgress: 0,
      resolved: 0
    }
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard statistics from backend
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [doctorsRes, patientsRes, appointmentsRes, feedbackRes] = await Promise.all([
        fetch(`${API_BASE_URL}/doctors`),
        fetch(`${API_BASE_URL}/patients/admin/patients`),
        fetch(`${API_BASE_URL}/appointments`),
        fetch(`${API_BASE_URL}/feedback`) // Assuming this endpoint exists
      ]);

      // Process doctors data
      const doctorsData = await doctorsRes.json();
      const doctors = doctorsData.success ? doctorsData.data : [];
      
      // Process patients data
      const patientsData = await patientsRes.json();
      const patients = patientsData.success ? patientsData.data : [];
      
      // Process appointments data
      const appointmentsData = await appointmentsRes.json();
      const appointments = appointmentsData.success ? appointmentsData.data : [];
      
      // Process feedback data (if available)
      const feedbackData = feedbackRes.ok ? await feedbackRes.json() : { data: [] };
      const feedback = feedbackData.success ? feedbackData.data : [];

      // Calculate statistics
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Calculate new patients this month
      const newPatientsThisMonth = patients.filter(patient => {
        const createdDate = new Date(patient.createdAt);
        return createdDate.getMonth() === currentMonth && 
               createdDate.getFullYear() === currentYear;
      }).length;

      // Calculate appointment statistics
      const today = new Date().toDateString();
      const upcomingAppointments = appointments.filter(apt => 
        new Date(apt.date).getTime() >= new Date().getTime()
      ).length;

      setStats({
        doctors: {
          total: doctors.length,
          available: doctors.filter(d => d.isActive).length,
          unavailable: doctors.filter(d => !d.isActive).length
        },
        patients: {
          total: patients.length,
          newThisMonth: newPatientsThisMonth,
          activeAppointments: upcomingAppointments
        },
        appointments: {
          upcoming: upcomingAppointments,
          rescheduled: appointments.filter(apt => apt.isRescheduled === true).length,
          cancelled: appointments.filter(apt => apt.status === 'cancelled').length
        },
        feedback: {
          pending: feedback.filter(f => f.status === 'pending').length,
          inProgress: feedback.filter(f => f.status === 'inProgress').length,
          resolved: feedback.filter(f => f.status === 'resolved').length
        }
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading dashboard statistics...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={fetchDashboardStats}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          <div className="text-sm font-medium text-gray-500">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
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
