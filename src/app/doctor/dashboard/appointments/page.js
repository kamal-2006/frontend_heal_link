"use client";

import { useState, useEffect } from "react";
import { appointmentApi, put, get } from "@/utils/api";
import { useRouter } from "next/navigation";

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRescheduleMode, setIsRescheduleMode] = useState(false);
  const [isChangingDoctor, setIsChangingDoctor] = useState(false);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    doctor: "",
    doctorName: "",
  });
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Use the appointmentApi helper instead of direct get call
        const data = await appointmentApi.getDoctorAppointments();
        const formattedAppointments = data.data.map((appointment) => ({
          id: appointment._id,
          patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
          patientId: appointment.patient.patientInfo
            ? appointment.patient.patientInfo.patientId
            : "",
          date: new Date(appointment.date).toISOString().split("T")[0],
          time: new Date(appointment.date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: appointment.reason,
          status: appointment.status,
          notes: appointment.notes,
          contact: appointment.patient.phone,
        }));
        setAppointments(formattedAppointments);
      } catch (error) {
        // Do nothing
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
    if (activeTab === "all") return true;
    if (activeTab === "upcoming") {
      return (
        appointment.status === "pending" || appointment.status === "confirmed"
      );
    }
    return appointment.status === activeTab;
  });

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsRescheduleMode(false);
    setIsChangingDoctor(false);
    setAvailableDoctors([]);
    setRescheduleData({ date: "", doctor: "", doctorName: "" });
  };

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
      setIsModalOpen(false);
      alert("Appointment cancelled successfully");
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment");
    }
  };

  const handleReschedule = async (appointment) => {
    setIsRescheduleMode(true);
    setRescheduleData({
      date: new Date(appointment.date).toISOString().slice(0, 16),
      doctor: appointment.doctorId,
      doctorName: `Dr. ${appointment.doctorName || "Current Doctor"}`,
    });
  };

  const handleChangeDoctorClick = async () => {
    try {
      setIsChangingDoctor(true);
      // Fetch doctors from doctors endpoint
      const response = await get("/doctors");
      if (response.success) {
        setAvailableDoctors(response.data || []);
      } else {
        alert("Failed to load doctors");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      alert("Failed to load doctors");
    }
  };

  const handleDoctorSelect = (doctor) => {
    setRescheduleData({
      ...rescheduleData,
      doctor: doctor.user._id, // Use the user ID from the doctor object
      doctorName: `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`,
    });
    setIsChangingDoctor(false);
  };

  const handleCancelReschedule = () => {
    setIsRescheduleMode(false);
    setIsChangingDoctor(false);
    setAvailableDoctors([]);
  };

  const handleRescheduleSubmit = async () => {
    try {
      const updateData = {
        date: rescheduleData.date,
        doctor: rescheduleData.doctor,
      };

      await appointmentApi.updateAppointment(
        selectedAppointment.id,
        updateData
      );

      // Refresh appointments
      const data = await appointmentApi.getDoctorAppointments();
      const formattedAppointments = data.data.map((appointment) => ({
        id: appointment._id,
        patientName: `${appointment.patient?.firstName || ""} ${
          appointment.patient?.lastName || ""
        }`,
        patientId: appointment.patient?._id || "",
        doctorId: appointment.doctor?._id || appointment.doctor || "",
        doctorName:
          appointment.doctor?.firstName && appointment.doctor?.lastName
            ? `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
            : "Unknown Doctor",
        date: new Date(appointment.date).toISOString().split("T")[0],
        time: new Date(appointment.date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        type: appointment.reason || "General consultation",
        status: appointment.status,
        notes: appointment.notes || "",
        contact: appointment.patient?.phone || "",
      }));
      setAppointments(formattedAppointments);

      // Update the selected appointment for the modal
      const updatedAppointment = formattedAppointments.find(
        (apt) => apt.id === selectedAppointment.id
      );
      if (updatedAppointment) {
        setSelectedAppointment(updatedAppointment);
      }

      setIsRescheduleMode(false);
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
        <button
          onClick={() => router.push("/doctor/dashboard/appointments/new")}
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
                        {new Date(appointment.date).toLocaleDateString()}
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
                          appointment.status === "confirmed"
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
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View
                      </button>
                      {appointment.status === "pending" && (
                        <button
                          onClick={() =>
                            handleStatusChange(appointment.id, "cancelled")
                          }
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
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

      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                {isRescheduleMode
                  ? "Reschedule Appointment"
                  : "Appointment Details"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="px-6 py-4">
              {isRescheduleMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Patient Name
                      </h4>
                      <p className="text-gray-900">
                        {selectedAppointment.patientName}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">
                        Patient ID
                      </h4>
                      <p className="text-gray-900">
                        {selectedAppointment.patientId}
                      </p>
                    </div>
                  </div>

                  {isRescheduleMode ? (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Reschedule Appointment
                      </h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date and Time
                        </label>
                        <input
                          type="datetime-local"
                          value={rescheduleData.date}
                          onChange={(e) =>
                            setRescheduleData({
                              ...rescheduleData,
                              date: e.target.value,
                            })
                          }
                          required
                          min={new Date().toISOString().slice(0, 16)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assigned Doctor
                        </label>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                            {rescheduleData.doctorName}
                          </div>
                          <button
                            type="button"
                            onClick={handleChangeDoctorClick}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                          >
                            Change Doctor
                          </button>
                        </div>
                      </div>

                      {isChangingDoctor && (
                        <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">
                            Select New Doctor:
                          </h4>
                          <div className="max-h-40 overflow-y-auto space-y-2">
                            {availableDoctors.map((doctor) => (
                              <button
                                key={doctor._id}
                                onClick={() => handleDoctorSelect(doctor)}
                                className="w-full text-left px-3 py-2 border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors"
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">
                                    Dr. {doctor.user.firstName}{" "}
                                    {doctor.user.lastName}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {doctor.specialization}
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                          <button
                            onClick={() => setIsChangingDoctor(false)}
                            className="mt-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      )}

                      <div className="border-t border-gray-200 pt-4 flex justify-end space-x-3">
                        <button
                          onClick={handleCancelReschedule}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleRescheduleSubmit}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">
                          Notes
                        </h4>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                          {selectedAppointment.notes}
                        </p>
                      </div>

                      <div className="border-t border-gray-200 pt-4 flex justify-end space-x-4">
                        <button
                          onClick={handleCloseModal}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                        >
                          Close
                        </button>

                        {selectedAppointment.status === "pending" && (
                          <button
                            onClick={() =>
                              handleStatusChange(selectedAppointment.id, "confirmed")
                            }
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
                          >
                            Confirm Appointment
                          </button>
                        )}
                        
                        {(selectedAppointment.status === "pending" || selectedAppointment.status === "confirmed") && (
                          <button
                            onClick={() =>
                              handleStatusChange(selectedAppointment.id, "completed")
                            }
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-150"
                          >
                            Mark as Completed
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div>
                  {/* Normal view content would go here */}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}