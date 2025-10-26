"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getDoctorName } from "../../utils/doctorUtils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api/v1";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    totalFeedback: 0,
  });
  
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    activeDoctors: 0,
    pendingAppointments: 0,
    completedToday: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Test backend connection first
      console.log("Attempting to connect to backend at:", API_BASE_URL);

      // Fetch real data from backend APIs using public endpoints (no auth required)
      const apiCalls = [
        { url: `${API_BASE_URL}/doctors`, name: 'doctors' },
        { url: `${API_BASE_URL}/patients/admin/patients`, name: 'patients' },
        { url: `${API_BASE_URL}/appointments/public`, name: 'appointments' },
        { url: `${API_BASE_URL}/feedback/public/admin`, name: 'feedback' }
      ];

      const results = await Promise.allSettled(
        apiCalls.map(async ({ url, name }) => {
          try {
            console.log(`Fetching ${name} from:`, url);
            const response = await fetch(url, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (!response.ok) {
              console.warn(
                `${name} API failed:`,
                response.status,
                response.statusText
              );
              return {
                success: false,
                name,
                data: null,
                error: `HTTP ${response.status}`,
              };
            }

            const data = await response.json();
            console.log(`${name} API response:`, data);
            return { success: true, name, data };
          } catch (error) {
            console.warn(`${name} API error:`, error.message);
            return { success: false, name, data: null, error: error.message };
          }
        })
      );

      // Process results and extract real data
      let doctorsData = null;
      let patientsData = null;
      let appointmentsData = null;
      let feedbackData = null;
      let hasErrors = false;

      results.forEach((result, index) => {
        if (
          result.status === "fulfilled" &&
          result.value &&
          result.value.success
        ) {
          const resultData = result.value;
          switch (resultData.name) {
            case "doctors":
              doctorsData = resultData.data;
              break;
            case "patients":
              patientsData = resultData.data;
              break;
            case "appointments":
              appointmentsData = resultData.data;
              break;
            case "feedback":
              feedbackData = resultData.data;
              break;
          }
        } else {
          hasErrors = true;
          const apiName = apiCalls[index]?.name || "unknown";
          const errorMsg =
            result.status === "fulfilled"
              ? result.value?.error
              : result.reason?.message || "Unknown error";
          console.error(`Failed to fetch ${apiName}:`, errorMsg);
        }
      });

      // Calculate today's appointments if data is available
      let todayAppointments = 0;
      let completedToday = 0;
      let pendingAppointments = 0;
      const today = new Date().toISOString().split('T')[0];
      
      if (appointmentsData?.data && Array.isArray(appointmentsData.data)) {
        const todaysAppointments = appointmentsData.data.filter(apt => 
          apt.date && apt.date.startsWith(today)
        );
        todayAppointments = todaysAppointments.length;
        completedToday = todaysAppointments.filter(apt => apt.status === 'completed').length;
        pendingAppointments = appointmentsData.data.filter(apt => apt.status === 'pending').length;
        
        // Set recent appointments (last 5)
        setRecentAppointments(appointmentsData.data.slice(0, 5));
      }

      // Set recent patients (last 5)
      if (patientsData?.data && Array.isArray(patientsData.data)) {
        setRecentPatients(patientsData.data.slice(0, 5));
      }

      // Calculate active doctors
      const activeDoctors = doctorsData?.data?.filter(doc => doc.isActive !== false).length || 0;

      // Use real data from backend API (with proper data structure)
      const stats = {
        totalDoctors: doctorsData?.count || doctorsData?.data?.length || 0,
        totalPatients: patientsData?.count || patientsData?.data?.length || 0,
        totalAppointments:
          appointmentsData?.count || appointmentsData?.data?.length || 0,
        todayAppointments,
        totalFeedback: feedbackData?.count || feedbackData?.data?.length || 0,
      };

      const healthStats = {
        activeDoctors,
        pendingAppointments,
        completedToday
      };

      console.log('Final stats:', stats);
      console.log('Health stats:', healthStats);
      setStats(stats);
      setSystemHealth(healthStats);

      if (hasErrors) {
        setError(
          "Some data could not be loaded from backend. Showing available data."
        );
        setTimeout(() => setError(null), 5000); // Auto-clear error after 5 seconds
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      let errorMessage = "Unable to connect to backend server.";

      if (error.message.includes("fetch")) {
        errorMessage =
          "Backend server is not responding. Please check if it's running on port 5000.";
      } else if (error.message.includes("CORS")) {
        errorMessage = "CORS error: Backend server configuration issue.";
      }

      setError(errorMessage);

      // Only use demo data as last resort
      setStats({
        totalDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        todayAppointments: 0,
        totalFeedback: 0,
      });
      setSystemHealth({
        activeDoctors: 0,
        pendingAppointments: 0,
        completedToday: 0
      });
      setRecentAppointments([]);
      setRecentPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    
    // Auto-refresh every 30 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchDashboardStats();
      }, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Connection Error
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Healthcare Management System Overview</p>

          {/* Show warning if using demo data */}
          {error && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center">
                <div className="text-amber-600 mr-2">⚠️</div>
                <p className="text-sm text-amber-800">{error}</p>
              </div>
            </div>
          )}

          <button
            onClick={fetchDashboardStats}
            className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3"
          >
            🔄 Refresh Data
          </button>
          
          <button 
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {autoRefresh ? '🔴 Stop Auto-Refresh' : '🟢 Start Auto-Refresh'}
          </button>
        </div>

        {/* Professional 4-Box Grid - Equal Sizes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Doctors Box */}
          <Link href="/admin/doctors" className="group">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-6 h-48 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalDoctors}
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-1">
                Doctors
              </div>
              <div className="text-sm text-blue-700">Manage all doctors</div>
            </div>
          </Link>

          {/* Patients Box */}
          <Link href="/admin/patients" className="group">
            <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-2xl p-6 h-48 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63c-.37-1.11-1.56-1.87-2.87-1.37L16 12l-1.99-2.03c-.47-.6-1.21-.97-2.01-.97h-1.09c-1.3 0-2.42.84-2.87 2.37L1.5 16H4v6h3v-6h2v6h3v-6h2v6h3z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalPatients}
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-1">
                Patients
              </div>
              <div className="text-sm text-green-700">View patient records</div>
            </div>
          </Link>

          {/* Appointments Box */}
          <Link href="/admin/appointments" className="group">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-2xl p-6 h-48 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalAppointments}
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-1">
                Appointments
              </div>
              <div className="text-sm text-purple-700">
                Today: {stats.todayAppointments}
              </div>
            </div>
          </Link>

          {/* Feedback Box */}
          <Link href="/admin/feedback" className="group">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 h-48 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-lg transition-all duration-300 group-hover:scale-105">
              <div className="bg-white p-3 rounded-full mb-3 shadow-sm">
                <svg
                  className="w-8 h-8 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stats.totalFeedback}
              </div>
              <div className="text-lg font-semibold text-gray-800 mb-1">
                Feedback
              </div>
              <div className="text-sm text-orange-700">Review feedback</div>
            </div>
          </Link>
        </div>

        {/* Quick Stats Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalDoctors}
              </div>
              <div className="text-sm text-gray-600">Total Doctors</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {stats.totalPatients}
              </div>
              <div className="text-sm text-gray-600">Total Patients</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {stats.todayAppointments}
              </div>
              <div className="text-sm text-gray-600">Today's Appointments</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {stats.totalFeedback}
              </div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </div>
          </div>
        </div>

        {/* System Health & Activity Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Today's Activity */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Today's Activity
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Scheduled Appointments</span>
                <span className="font-semibold text-blue-600">{stats.todayAppointments}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed Today</span>
                <span className="font-semibold text-green-600">{systemHealth.completedToday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Active Doctors</span>
                <span className="font-semibold text-purple-600">{systemHealth.activeDoctors}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                  style={{
                    width: stats.todayAppointments > 0 
                      ? `${(systemHealth.completedToday / stats.todayAppointments) * 100}%` 
                      : '0%'
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 text-center">
                Completion Rate: {stats.todayAppointments > 0 
                  ? Math.round((systemHealth.completedToday / stats.todayAppointments) * 100) 
                  : 0}%
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></div>
              System Health
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Appointments</span>
                <div className="flex items-center">
                  <span className="font-semibold text-yellow-600">{systemHealth.pendingAppointments}</span>
                  {systemHealth.pendingAppointments > 5 && (
                    <div className="w-2 h-2 bg-red-500 rounded-full ml-2"></div>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Doctors</span>
                <span className="font-semibold text-blue-600">{stats.totalDoctors}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Patients</span>
                <span className="font-semibold text-green-600">{stats.totalPatients}</span>
              </div>
              <div className="pt-2">
                <div className="text-xs text-gray-500 mb-1">System Status</div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-medium text-green-600">Healthy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link 
                href="/admin/doctors"
                className="block w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-900">Add New Doctor</span>
                  <span className="text-blue-600">→</span>
                </div>
              </Link>
              <Link 
                href="/admin/patients"
                className="block w-full p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-green-900">View All Patients</span>
                  <span className="text-green-600">→</span>
                </div>
              </Link>
              <Link 
                href="/admin/appointments"
                className="block w-full p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-purple-900">Manage Appointments</span>
                  <span className="text-purple-600">→</span>
                </div>
              </Link>
              <Link 
                href="/admin/feedback"
                className="block w-full p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-orange-900">Review Feedback</span>
                  <span className="text-orange-600">→</span>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Appointments */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Appointments</h3>
              <Link href="/admin/appointments" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {recentAppointments.length > 0 ? (
                recentAppointments.map((appointment, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {appointment.patient ? 
                          `${appointment.patient.firstName || ''} ${appointment.patient.lastName || ''}`.trim() || 'Unknown Patient'
                          : 'Unknown Patient'
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        Dr. {getDoctorName(appointment.doctor)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.date ? new Date(appointment.date).toLocaleDateString() : 'No date'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status || 'pending'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📅</div>
                  <p>No recent appointments</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Recent Patients</h3>
              <Link href="/admin/patients" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                View All →
              </Link>
            </div>
            <div className="space-y-3">
              {recentPatients.length > 0 ? (
                recentPatients.map((patient, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-medium mr-3">
                      {patient.user?.firstName ? patient.user.firstName.charAt(0).toUpperCase() : 'P'}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {patient.user ? 
                          `${patient.user.firstName || ''} ${patient.user.lastName || ''}`.trim() || 'Unknown Patient'
                          : 'Unknown Patient'
                        }
                      </div>
                      <div className="text-sm text-gray-600">
                        {patient.user?.email || 'No email'}
                      </div>
                      <div className="text-xs text-gray-500">
                        Joined: {patient.createdAt 
                          ? new Date(patient.createdAt).toLocaleDateString() 
                          : 'Unknown'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">👥</div>
                  <p>No recent patients</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
