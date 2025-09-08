"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PatientAppointmentsPage() {
  // State for appointments
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState("upcoming");

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setAppointments([
          { 
            id: 101, 
            doctorName: "Dr. Sarah Johnson", 
            specialty: "General Physician",
            date: "2023-09-15", 
            time: "10:00 AM",
            status: "upcoming",
            notificationStatus: "confirmed"
          },
          { 
            id: 102, 
            doctorName: "Dr. Michael Chen", 
            specialty: "Cardiologist",
            date: "2023-09-20", 
            time: "2:30 PM",
            status: "upcoming",
            notificationStatus: "doctor_changed",
            previousDoctor: "Dr. Robert Wilson"
          },
          { 
            id: 103, 
            doctorName: "Dr. Emma Davis", 
            specialty: "Dermatologist",
            date: "2023-09-01", 
            time: "11:15 AM",
            status: "completed",
            feedbackSubmitted: true
          },
          { 
            id: 104, 
            doctorName: "Dr. Lisa Thompson", 
            specialty: "Pediatrician",
            date: "2023-09-05", 
            time: "9:00 AM",
            status: "completed",
            feedbackSubmitted: false
          },
          { 
            id: 105, 
            doctorName: "Dr. James Wilson", 
            specialty: "Orthopedic",
            date: "2023-08-25", 
            time: "3:45 PM",
            status: "cancelled",
            cancellationReason: "Doctor unavailable"
          },
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchAppointments();
  }, []);

  // Filter appointments based on active tab
  const filteredAppointments = appointments.filter(appointment => {
    if (activeTab === "upcoming") return appointment.status === "upcoming";
    if (activeTab === "completed") return appointment.status === "completed";
    if (activeTab === "cancelled") return appointment.status === "cancelled";
    return true;
  });

  // Handle cancelling an appointment
  const handleCancel = (appointmentId) => {
    setLoading(true);
    
    // In a real app, this would be an API call to cancel the appointment
    setTimeout(() => {
      setAppointments(appointments.map(app => 
        app.id === appointmentId ? {...app, status: "cancelled", cancellationReason: "Patient cancelled"} : app
      ));
      
      setMessage({
        type: "success",
        text: "Appointment cancelled successfully."
      });
      
      setLoading(false);
      
      // Clear the message after 5 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
    }, 1000);
  };

  // Handle rescheduling an appointment (in a real app, this would navigate to a reschedule page)
  const handleReschedule = (appointmentId) => {
    // For demo purposes, just show a message
    setMessage({
      type: "info",
      text: "Rescheduling functionality would open a calendar to select a new date/time."
    });
    
    // Clear the message after 5 seconds
    setTimeout(() => {
      setMessage({ type: "", text: "" });
    }, 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <Link href="/patient/dashboard/book" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Book New Appointment
        </Link>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md ${
          message.type === "success" ? "bg-green-50 text-green-800" : 
          message.type === "info" ? "bg-blue-50 text-blue-800" : 
          "bg-red-50 text-red-800"
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "upcoming" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "completed" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === "cancelled" ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"}`}
          >
            Cancelled
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                    <p className="text-sm text-gray-500">{appointment.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{appointment.date}</p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                  </div>
                </div>
                
                {/* Notification for doctor change */}
                {appointment.notificationStatus === "doctor_changed" && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <span className="font-medium">Notice:</span> Your doctor has been changed from {appointment.previousDoctor} to {appointment.doctorName}.
                    </p>
                  </div>
                )}
                
                {/* Actions for upcoming appointments */}
                {appointment.status === "upcoming" && (
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => handleCancel(appointment.id)}
                      className="px-3 py-1 text-xs font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReschedule(appointment.id)}
                      className="px-3 py-1 text-xs font-medium text-blue-600 border border-blue-200 rounded-md hover:bg-blue-50"
                    >
                      Reschedule
                    </button>
                  </div>
                )}
                
                {/* Actions for completed appointments */}
                {appointment.status === "completed" && !appointment.feedbackSubmitted && (
                  <div className="mt-4 flex justify-end">
                    <Link 
                      href="/patient/dashboard/feedback"
                      className="px-3 py-1 text-xs font-medium text-green-600 border border-green-200 rounded-md hover:bg-green-50"
                    >
                      Provide Feedback
                    </Link>
                  </div>
                )}
                
                {/* Status for completed appointments with feedback */}
                {appointment.status === "completed" && appointment.feedbackSubmitted && (
                  <div className="mt-4 flex justify-end">
                    <span className="px-3 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded-md">
                      Feedback Submitted
                    </span>
                  </div>
                )}
                
                {/* Status for cancelled appointments */}
                {appointment.status === "cancelled" && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Cancellation reason:</span> {appointment.cancellationReason}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments found</h3>
          <p className="mt-2 text-gray-500">
            {activeTab === "upcoming" ? "You don't have any upcoming appointments." :
             activeTab === "completed" ? "You don't have any completed appointments." :
             "You don't have any cancelled appointments."}
          </p>
          {activeTab === "upcoming" && (
            <div className="mt-6">
              <Link href="/patient/dashboard/book" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Book an Appointment
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}