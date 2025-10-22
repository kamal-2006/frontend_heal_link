"use client";

import { useState, useEffect } from "react";
import { get, put } from "@/utils/api";

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPatientDetailsModalOpen, setIsPatientDetailsModalOpen] =
    useState(false);
  const [patientToView, setPatientToView] = useState(null);
  const [doctors, setDoctors] = useState([]);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data } = await get("/doctors/patients");
        setPatients(data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchDoctors = async () => {
      try {
        const { data } = await get("/doctors");
        setDoctors(data || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchPatients();
    fetchDoctors();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const fullName =
      `${patient.user.firstName} ${patient.user.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return (
      fullName.includes(query) ||
      patient.patientId.toLowerCase().includes(query)
    );
  });

  const handleViewPatient = (patient) => {
    setPatientToView(patient);
    setIsPatientDetailsModalOpen(true);
  };

  const handleClosePatientDetailsModal = () => {
    setIsPatientDetailsModalOpen(false);
    setPatientToView(null);
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return "N/A";
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };





  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500">Manage your patients.</p>
        </div>
        <p className="text-sm text-gray-500">{formatDate(new Date())}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search patients by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>
      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3">
                  Patient
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Contact
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  Gender
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                  Last Appointment
                </th>
                <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-1/12">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.length === 0 && !isLoading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        No patients found
                      </p>
                      <p className="text-gray-500">
                        Try adjusting your search or filter criteria, or ensure you are logged in as a doctor.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-600">
                              {patient.user?.firstName?.charAt(0) || "P"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.user
                              ? `${patient.user.firstName} ${patient.user.lastName}`
                              : "N/A"}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {patient.patientId || patient._id?.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left">
                      <div className="text-sm text-gray-900">
                        {patient.user?.email || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.user?.phone || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-900">
                      {patient.gender || "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-900">
                      {formatDate(patient.lastAppointment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => handleViewPatient(patient)}
                        className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        title="View patient details"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Details Modal */}
      {isPatientDetailsModalOpen && patientToView && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto hide-scrollbar">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium text-gray-900">
                Patient Details
              </h3>
              <button
                onClick={handleClosePatientDetailsModal}
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
              {/* Patient Basic Info */}
              <div className="flex items-start mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                  {patientToView.user.firstName[0]}
                  {patientToView.user.lastName[0]}
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {patientToView.user.firstName} {patientToView.user.lastName}
                  </h2>
                  <p className="text-gray-500">
                    {patientToView.patientId} •{" "}
                    {calculateAge(patientToView.dateOfBirth)} years •{" "}
                    {patientToView.gender}
                  </p>
                  <div className="mt-2 flex space-x-4">
                    <a
                      href={`tel:${patientToView.user.phone}`}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Call
                    </a>
                    <a
                      href={`mailto:${patientToView.user.email}`}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Email
                    </a>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Contact Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">
                      {patientToView.user.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">
                      {patientToView.user.phone}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm text-gray-900">
                      {patientToView.address?.street},{" "}
                      {patientToView.address?.city},{" "}
                      {patientToView.address?.state}{" "}
                      {patientToView.address?.zipCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointments */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Appointments
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-gray-500">Last Visit</p>
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        Completed
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(patientToView.lastAppointment)}
                    </p>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs text-gray-500">Next Appointment</p>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Scheduled
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(patientToView.nextAppointment)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Medical History
                </h4>
                {patientToView.medicalRecords?.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Title
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {patientToView.medicalRecords.map((record, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {record.title}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {record.recordType}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(record.date)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No medical history recorded
                  </p>
                )}
              </div>

              {/* Medications */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Current Medications
                </h4>
                {patientToView.medications?.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Medication
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Dosage
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Frequency
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {patientToView.medications.map((med, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {med.name}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {med.dosage}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {med.frequency}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No medications recorded
                  </p>
                )}
              </div>

              {/* Personal Information */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="text-sm text-gray-900">
                      {formatDate(patientToView.dateOfBirth)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Blood Type</p>
                    <p className="text-sm text-gray-900">
                      {patientToView.bloodType || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Height</p>
                    <p className="text-sm text-gray-900">
                      {patientToView.height?.value} {patientToView.height?.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Weight</p>
                    <p className="text-sm text-gray-900">
                      {patientToView.weight?.value} {patientToView.weight?.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Smoking Status</p>
                    <p className="text-sm text-gray-900">
                      {patientToView.smokingStatus || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Alcohol Use</p>
                    <p className="text-sm text-gray-900">
                      {patientToView.alcoholUse || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm text-gray-900">
                      {patientToView.emergencyContact?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Relationship</p>
                    <p className="text-sm text-gray-900">
                      {patientToView.emergencyContact?.relationship || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">
                      {patientToView.emergencyContact?.phone || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-900">
                      {patientToView.emergencyContact?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
