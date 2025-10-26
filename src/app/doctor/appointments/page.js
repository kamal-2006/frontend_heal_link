"use client";

import { useState, useEffect } from "react";
import { appointmentApi, get } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [showActionsFor, setShowActionsFor] = useState(null);
  const [rescheduleData, setRescheduleData] = useState({ date: "", doctor: "" });
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const data = await appointmentApi.getDoctorAppointments();
        if (data.success && data.data) {
          const formattedAppointments = data.data.map((appointment) => ({
            id: appointment._id,
            patientName: appointment.patient?.firstName && appointment.patient?.lastName
              ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
              : 'Unknown Patient',
            patientId: appointment.patient?.patientInfo?.patientId || "",
            fullDate: appointment.date ? new Date(appointment.date) : null,
            date: appointment.date ? new Date(appointment.date).toISOString().split("T")[0] : 'N/A',
            time: appointment.date ? new Date(appointment.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }) : 'N/A',
            type: appointment.reason || 'N/A',
            status: appointment.status,
            notes: appointment.notes,
            contact: appointment.patient?.phone || appointment.patient?.email || '',
            doctor: appointment.doctor,
          }));
          setAppointments(formattedAppointments);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") {
      const now = new Date();
      return (
        (appointment.status === "pending" ||
          appointment.status === "confirmed" ||
          appointment.status === "scheduled" ||
          appointment.status === "rescheduled") &&
        appointment.fullDate > now
      );
    }
    return appointment.status === activeTab;
  });

  const handleCancelAppointment = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }

    try {
      await appointmentApi.cancelAppointment(id);
      setAppointments(
        appointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: "cancelled" }
            : appointment
        )
      );
      alert("Appointment cancelled successfully");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment");
    }
  };

  const fetchAvailableDoctors = async (date, appointmentId) => {
    try {
      let url = `/doctors/available?date=${date}`;
      if (appointmentId) {
        url += `&appointmentId=${appointmentId}`;
      }
      const response = await get(url);
      if (response.success) {
        setAvailableDoctors(response.data || []);
      } else {
        alert("Failed to load available doctors");
      }
    } catch (error) {
      console.error("Error fetching available doctors:", error);
      alert("Failed to load available doctors");
    }
  };

  const handleRescheduleClick = async (appointment) => {
    setEditingAppointmentId(appointment.id);
    setShowActionsFor(null);
    const date = new Date(appointment.fullDate).toISOString();
    setRescheduleData({
      date: date.slice(0, 16),
      doctor: appointment.doctor ? appointment.doctor._id : "",
    });
    await fetchAvailableDoctors(date, appointment.id);
  };

  const handleSaveReschedule = async (appointmentId) => {
    try {
      await appointmentApi.updateAppointment(appointmentId, {
        date: rescheduleData.date,
        doctor: rescheduleData.doctor,
      });

      const data = await appointmentApi.getDoctorAppointments();
      if (data.success && data.data) {
        const formattedAppointments = data.data.map((appointment) => ({
          id: appointment._id,
          patientName: `${appointment.patient?.firstName || ''} ${appointment.patient?.lastName || ''}`,
          patientId: appointment.patient?.patientInfo
            ? appointment.patient.patientInfo.patientId
            : "",
          fullDate: new Date(appointment.date),
          date: new Date(appointment.date).toISOString().split("T")[0],
          time: new Date(appointment.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: appointment.reason,
          status: appointment.status,
          notes: appointment.notes,
          contact: appointment.patient?.phone || '',
          doctor: appointment.doctor,
        }));
        setAppointments(formattedAppointments);
      }
      setEditingAppointmentId(null);
      alert("Appointment rescheduled successfully");
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      alert("Failed to reschedule appointment");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => router.push("/doctor/bulk-swap")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"
                clipRule="evenodd"
              />
            </svg>
            Bulk Swap
          </button>
          <button
            onClick={() => router.push("/doctor/appointments/new")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Appointment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "upcoming"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "completed"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "cancelled"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Cancelled
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "all"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            All
          </button>
        </nav>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Patient
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Time
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    {editingAppointmentId === appointment.id ? (
                      <td colSpan="5" className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                            <input
                              type="datetime-local"
                              value={rescheduleData.date}
                              onChange={(e) => {
                                const newDate = e.target.value;
                                setRescheduleData({
                                  ...rescheduleData,
                                  date: newDate,
                                });
                                fetchAvailableDoctors(new Date(newDate).toISOString(), editingAppointmentId);
                              }}
                              min={new Date().toISOString().slice(0, 16)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700">Doctor</label>
                            <select
                              value={rescheduleData.doctor}
                              onChange={(e) =>
                                setRescheduleData({
                                  ...rescheduleData,
                                  doctor: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded-md"
                            >
                              <option value="" disabled>Select a doctor</option>
                              {availableDoctors
                                .filter((doctor) => doctor.user)
                                .map((doctor) => (
                                  <option key={doctor._id} value={doctor._id}>
                                    {doctor.user.firstName} {doctor.user.lastName}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="flex items-end space-x-2">
                            <button
                              onClick={() => handleSaveReschedule(appointment.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingAppointmentId(null)}
                              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    ) : (
                      <>
                        {/* Read-only Row */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                              {appointment.patientName
                                .split(" ")
                                .map((name) => name[0])
                                .join("")}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {appointment.patientName}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {appointment.patientId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointment.date}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.time}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {appointment.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              appointment.status === "upcoming" ||
                              appointment.status === "confirmed" ||
                              appointment.status === "scheduled"
                                ? "bg-green-100 text-green-800"
                                : appointment.status === "completed"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {showActionsFor === appointment.id ? (
                            <div className="flex items-center justify-end space-x-4">
                              <button
                                onClick={() => handleRescheduleClick(appointment)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Reschedule
                              </button>
                              <button
                                onClick={() => handleCancelAppointment(appointment.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => setShowActionsFor(null)}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                Close
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowActionsFor(appointment.id)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}