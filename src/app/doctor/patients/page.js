"use client";

import { useState, useEffect } from "react";
// import { get } from "@/utils/api";

export default function DoctorPatients() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulate fetching patients data
  useEffect(() => {
    const fetchPatients = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        const mockPatients = [
          {
            id: "P10045",
            firstName: "Sarah",
            lastName: "Johnson",
            age: 34,
            gender: "Female",
            email: "sarah.johnson@example.com",
            phone: "+1 (555) 123-4567",
            address: "123 Main St, Anytown, CA 94321",
            lastVisit: "2023-07-10",
            nextAppointment: "2023-07-24",
            medicalHistory: [
              {
                condition: "Hypertension",
                diagnosedDate: "2020-03-15",
                notes: "Well-controlled with medication",
              },
              {
                condition: "Migraine",
                diagnosedDate: "2018-06-22",
                notes: "Occasional episodes, triggers identified",
              },
            ],
            medications: [
              {
                name: "Lisinopril",
                dosage: "10mg",
                frequency: "Once daily",
                startDate: "2020-03-15",
              },
              {
                name: "Sumatriptan",
                dosage: "50mg",
                frequency: "As needed",
                startDate: "2018-07-10",
              },
            ],
            allergies: ["Penicillin", "Shellfish"],
          },
          {
            id: "P10046",
            firstName: "Michael",
            lastName: "Chen",
            age: 45,
            gender: "Male",
            email: "michael.chen@example.com",
            phone: "+1 (555) 234-5678",
            address: "456 Oak Ave, Somewhere, NY 10001",
            lastVisit: "2023-07-08",
            nextAppointment: "2023-07-22",
            medicalHistory: [
              {
                condition: "Coronary Artery Disease",
                diagnosedDate: "2019-11-05",
                notes: "Stent placed in 2019",
              },
              {
                condition: "Type 2 Diabetes",
                diagnosedDate: "2017-04-18",
                notes: "Diet controlled",
              },
            ],
            medications: [
              {
                name: "Aspirin",
                dosage: "81mg",
                frequency: "Once daily",
                startDate: "2019-11-05",
              },
              {
                name: "Atorvastatin",
                dosage: "20mg",
                frequency: "Once daily",
                startDate: "2019-11-05",
              },
              {
                name: "Metformin",
                dosage: "500mg",
                frequency: "Twice daily",
                startDate: "2017-04-18",
              },
            ],
            allergies: ["Sulfa drugs"],
          },
          {
            id: "P10047",
            firstName: "Emma",
            lastName: "Davis",
            age: 28,
            gender: "Female",
            email: "emma.davis@example.com",
            phone: "+1 (555) 345-6789",
            address: "789 Pine Ln, Elsewhere, TX 75001",
            lastVisit: "2023-07-05",
            nextAppointment: "2023-08-05",
            medicalHistory: [
              {
                condition: "Anxiety",
                diagnosedDate: "2021-02-10",
                notes: "Mild, managed with therapy",
              },
            ],
            medications: [
              {
                name: "Escitalopram",
                dosage: "10mg",
                frequency: "Once daily",
                startDate: "2021-02-10",
              },
            ],
            allergies: [],
          },
          {
            id: "P10048",
            firstName: "Robert",
            lastName: "Wilson",
            age: 62,
            gender: "Male",
            email: "robert.wilson@example.com",
            phone: "+1 (555) 456-7890",
            address: "101 Cedar Dr, Nowhere, FL 33101",
            lastVisit: "2023-07-01",
            nextAppointment: "2023-07-15",
            medicalHistory: [
              {
                condition: "Atrial Fibrillation",
                diagnosedDate: "2015-09-30",
                notes: "Paroxysmal",
              },
              {
                condition: "Hypertension",
                diagnosedDate: "2010-05-12",
                notes: "Well-controlled with medication",
              },
              {
                condition: "Osteoarthritis",
                diagnosedDate: "2018-11-20",
                notes: "Affecting knees",
              },
            ],
            medications: [
              {
                name: "Warfarin",
                dosage: "5mg",
                frequency: "Once daily",
                startDate: "2015-09-30",
              },
              {
                name: "Metoprolol",
                dosage: "25mg",
                frequency: "Twice daily",
                startDate: "2015-09-30",
              },
              {
                name: "Hydrochlorothiazide",
                dosage: "12.5mg",
                frequency: "Once daily",
                startDate: "2010-05-12",
              },
              {
                name: "Acetaminophen",
                dosage: "500mg",
                frequency: "As needed",
                startDate: "2018-11-20",
              },
            ],
            allergies: ["Iodine", "Contrast dye"],
          },
          {
            id: "P10049",
            firstName: "Jennifer",
            lastName: "Lopez",
            age: 41,
            gender: "Female",
            email: "jennifer.lopez@example.com",
            phone: "+1 (555) 567-8901",
            address: "202 Maple St, Anywhere, WA 98101",
            lastVisit: "2023-06-28",
            nextAppointment: "2023-07-28",
            medicalHistory: [
              {
                condition: "Asthma",
                diagnosedDate: "2005-03-18",
                notes: "Exercise-induced",
              },
              {
                condition: "Seasonal Allergies",
                diagnosedDate: "2008-05-22",
                notes: "Spring and fall",
              },
            ],
            medications: [
              {
                name: "Albuterol",
                dosage: "90mcg",
                frequency: "As needed",
                startDate: "2005-03-18",
              },
              {
                name: "Fluticasone",
                dosage: "50mcg",
                frequency: "Once daily",
                startDate: "2005-03-18",
              },
              {
                name: "Cetirizine",
                dosage: "10mg",
                frequency: "Once daily",
                startDate: "2008-05-22",
              },
            ],
            allergies: ["Pollen", "Dust mites"],
          },
          {
            id: "P10050",
            firstName: "David",
            lastName: "Brown",
            age: 55,
            gender: "Male",
            email: "david.brown@example.com",
            phone: "+1 (555) 678-9012",
            address: "303 Birch Ave, Someplace, IL 60601",
            lastVisit: "2023-06-25",
            nextAppointment: "2023-07-25",
            medicalHistory: [
              {
                condition: "Arrhythmia",
                diagnosedDate: "2022-01-15",
                notes: "Premature ventricular contractions",
              },
            ],
            medications: [
              {
                name: "Propranolol",
                dosage: "10mg",
                frequency: "Twice daily",
                startDate: "2022-01-15",
              },
            ],
            allergies: ["Latex"],
          },
        ];

        setPatients(mockPatients);
        setIsLoading(false);
      }, 1000);

      // Uncomment and use the following lines to fetch real data from the API
      // const data = await get("/api/v1/patients");
      // setPatients(data.data || []);
      // setIsLoading(false);
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || patient.id.toLowerCase().includes(query);
  });

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
        <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center">
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
          Add New Patient
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search patients by name or ID"
          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Patients List */}
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
                  Contact
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Visit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Next Appointment
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
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                          {patient.firstName[0]}
                          {patient.lastName[0]}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {patient.id} • {patient.age} yrs • {patient.gender}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {patient.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(patient.lastVisit).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(patient.nextAppointment).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewPatient(patient)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Patient Details Modal */}
      {isModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium text-gray-900">
                Patient Details
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
              {/* Patient Basic Info */}
              <div className="flex items-start mb-6">
                <div className="h-16 w-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                  {selectedPatient.firstName[0]}
                  {selectedPatient.lastName[0]}
                </div>
                <div className="ml-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedPatient.firstName} {selectedPatient.lastName}
                  </h2>
                  <p className="text-gray-500">
                    {selectedPatient.id} • {selectedPatient.age} years •{" "}
                    {selectedPatient.gender}
                  </p>
                  <div className="mt-2 flex space-x-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      Call
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
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
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Message
                    </button>
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
                      {selectedPatient.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">
                      {selectedPatient.phone}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="text-sm text-gray-900">
                      {selectedPatient.address}
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
                      {new Date(selectedPatient.lastVisit).toLocaleDateString()}
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
                      {new Date(
                        selectedPatient.nextAppointment
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Medical History */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Medical History
                </h4>
                {selectedPatient.medicalHistory.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Condition
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Diagnosed
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Notes
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedPatient.medicalHistory.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                              {item.condition}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {new Date(
                                item.diagnosedDate
                              ).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {item.notes}
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
                {selectedPatient.medications.length > 0 ? (
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
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Started
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedPatient.medications.map((med, index) => (
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
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {new Date(med.startDate).toLocaleDateString()}
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

              {/* Allergies */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Allergies
                </h4>
                {selectedPatient.allergies.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedPatient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No known allergies</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-end space-x-4">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150">
                  Edit Patient
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
