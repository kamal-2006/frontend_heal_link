"use client";

import { useState, useEffect } from "react";

export default function DoctorPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isNewPrescription, setIsNewPrescription] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    medications: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    diagnosis: "",
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });

  // Simulate fetching data
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, these would be API calls
      setTimeout(() => {
        const mockPatients = [
          { id: "P10045", name: "Sarah Johnson" },
          { id: "P10046", name: "Michael Chen" },
          { id: "P10047", name: "Emma Davis" },
          { id: "P10048", name: "Robert Wilson" },
          { id: "P10049", name: "Jennifer Lopez" },
          { id: "P10050", name: "David Brown" },
        ];

        const mockPrescriptions = [
          {
            id: "RX10001",
            patientId: "P10045",
            patientName: "Sarah Johnson",
            date: "2023-07-10",
            diagnosis: "Hypertension",
            medications: [
              { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "30 days", instructions: "Take with water in the morning" },
              { name: "Hydrochlorothiazide", dosage: "12.5mg", frequency: "Once daily", duration: "30 days", instructions: "Take with breakfast" }
            ],
            notes: "Monitor blood pressure weekly. Follow up in 1 month.",
            status: "active"
          },
          {
            id: "RX10002",
            patientId: "P10046",
            patientName: "Michael Chen",
            date: "2023-07-08",
            diagnosis: "Coronary Artery Disease, Type 2 Diabetes",
            medications: [
              { name: "Aspirin", dosage: "81mg", frequency: "Once daily", duration: "90 days", instructions: "Take with food" },
              { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", duration: "90 days", instructions: "Take at bedtime" },
              { name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "90 days", instructions: "Take with meals" }
            ],
            notes: "Continue diet and exercise regimen. Schedule lipid panel before next visit.",
            status: "active"
          },
          {
            id: "RX10003",
            patientId: "P10047",
            patientName: "Emma Davis",
            date: "2023-07-05",
            diagnosis: "Anxiety",
            medications: [
              { name: "Escitalopram", dosage: "10mg", frequency: "Once daily", duration: "30 days", instructions: "Take in the morning" }
            ],
            notes: "Continue therapy sessions. Follow up in 4 weeks to assess efficacy.",
            status: "active"
          },
          {
            id: "RX10004",
            patientId: "P10048",
            patientName: "Robert Wilson",
            date: "2023-07-01",
            diagnosis: "Atrial Fibrillation, Hypertension",
            medications: [
              { name: "Warfarin", dosage: "5mg", frequency: "Once daily", duration: "30 days", instructions: "Take at the same time each day" },
              { name: "Metoprolol", dosage: "25mg", frequency: "Twice daily", duration: "30 days", instructions: "Take with food" }
            ],
            notes: "Schedule INR test in 2 weeks. Avoid foods high in vitamin K.",
            status: "active"
          },
          {
            id: "RX10005",
            patientId: "P10049",
            patientName: "Jennifer Lopez",
            date: "2023-06-28",
            diagnosis: "Asthma, Seasonal Allergies",
            medications: [
              { name: "Albuterol", dosage: "90mcg", frequency: "As needed", duration: "30 days", instructions: "2 puffs every 4-6 hours as needed for shortness of breath" },
              { name: "Fluticasone", dosage: "50mcg", frequency: "Twice daily", duration: "30 days", instructions: "2 sprays in each nostril morning and evening" },
              { name: "Cetirizine", dosage: "10mg", frequency: "Once daily", duration: "30 days", instructions: "Take in the evening" }
            ],
            notes: "Avoid known triggers. Use peak flow meter daily.",
            status: "active"
          },
          {
            id: "RX10006",
            patientId: "P10050",
            patientName: "David Brown",
            date: "2023-06-25",
            diagnosis: "Arrhythmia",
            medications: [
              { name: "Propranolol", dosage: "10mg", frequency: "Twice daily", duration: "30 days", instructions: "Take with food" }
            ],
            notes: "Monitor heart rate daily. Report any episodes of palpitations.",
            status: "active"
          },
          {
            id: "RX10007",
            patientId: "P10045",
            patientName: "Sarah Johnson",
            date: "2023-06-10",
            diagnosis: "Migraine",
            medications: [
              { name: "Sumatriptan", dosage: "50mg", frequency: "As needed", duration: "30 days", instructions: "Take at onset of migraine. May repeat after 2 hours if needed. Do not exceed 200mg in 24 hours." }
            ],
            notes: "Continue to identify and avoid triggers. Keep headache diary.",
            status: "expired"
          }
        ];
        
        setPatients(mockPatients);
        setPrescriptions(mockPrescriptions);
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const query = searchQuery.toLowerCase();
    return (
      prescription.patientName.toLowerCase().includes(query) ||
      prescription.id.toLowerCase().includes(query) ||
      prescription.patientId.toLowerCase().includes(query) ||
      prescription.diagnosis.toLowerCase().includes(query)
    );
  });

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setIsNewPrescription(false);
    setIsModalOpen(true);
  };

  const handleNewPrescription = () => {
    setSelectedPrescription(null);
    setIsNewPrescription(true);
    setFormData({
      patientId: "",
      medications: [{ name: "", dosage: "", frequency: "", duration: "", instructions: "" }],
      diagnosis: "",
      notes: "",
      date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value
    };
    setFormData({
      ...formData,
      medications: updatedMedications
    });
  };

  const addMedication = () => {
    setFormData({
      ...formData,
      medications: [...formData.medications, { name: "", dosage: "", frequency: "", duration: "", instructions: "" }]
    });
  };

  const removeMedication = (index) => {
    if (formData.medications.length > 1) {
      const updatedMedications = formData.medications.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        medications: updatedMedications
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would be an API call to save the prescription
    const patientName = patients.find(p => p.id === formData.patientId)?.name || "";
    
    const newPrescription = {
      id: `RX${Math.floor(10000 + Math.random() * 90000)}`,
      patientId: formData.patientId,
      patientName,
      date: formData.date,
      diagnosis: formData.diagnosis,
      medications: formData.medications,
      notes: formData.notes,
      status: "active"
    };
    
    setPrescriptions([newPrescription, ...prescriptions]);
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
        <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
        <button 
          onClick={handleNewPrescription}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Prescription
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search prescriptions by patient name, ID, or diagnosis"
          className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prescription ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrescriptions.length > 0 ? (
                filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {prescription.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium text-xs">
                          {prescription.patientName.split(' ').map(name => name[0]).join('')}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{prescription.patientName}</div>
                          <div className="text-sm text-gray-500">{prescription.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(prescription.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {prescription.diagnosis}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${prescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {prescription.status === 'active' ? 'Active' : 'Expired'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleViewPrescription(prescription)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No prescriptions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h3 className="text-lg font-medium text-gray-900">
                {isNewPrescription ? "New Prescription" : "Prescription Details"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4">
              {isNewPrescription ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">Patient</label>
                      <select
                        id="patientId"
                        name="patientId"
                        value={formData.patientId}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select a patient</option>
                        {patients.map(patient => (
                          <option key={patient.id} value={patient.id}>{patient.name} ({patient.id})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">Diagnosis</label>
                    <input
                      type="text"
                      id="diagnosis"
                      name="diagnosis"
                      value={formData.diagnosis}
                      onChange={handleInputChange}
                      required
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter diagnosis"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">Medications</label>
                      <button
                        type="button"
                        onClick={addMedication}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Medication
                      </button>
                    </div>
                    
                    {formData.medications.map((medication, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-medium text-gray-700">Medication {index + 1}</h4>
                          {formData.medications.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeMedication(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Medication Name</label>
                            <input
                              type="text"
                              value={medication.name}
                              onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                              required
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Medication name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Dosage</label>
                            <input
                              type="text"
                              value={medication.dosage}
                              onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                              required
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., 10mg"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Frequency</label>
                            <input
                              type="text"
                              value={medication.frequency}
                              onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                              required
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., Once daily"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Duration</label>
                            <input
                              type="text"
                              value={medication.duration}
                              onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                              required
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., 30 days"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Instructions</label>
                          <textarea
                            value={medication.instructions}
                            onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                            required
                            rows="2"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Special instructions"
                          ></textarea>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Additional notes or instructions"
                    ></textarea>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row justify-end sm:space-x-4 space-y-2 sm:space-y-0">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150 flex items-center justify-center w-full sm:w-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150 flex items-center justify-center w-full sm:w-auto"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save Prescription
                    </button>
                  </div>
                </form>
              ) : selectedPrescription && (
                <div className="space-y-6">
                  {/* Prescription Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Prescription ID</div>
                      <div className="text-lg font-medium">{selectedPrescription.id}</div>
                    </div>
                    <span className={`px-3 py-1 text-sm rounded-full ${selectedPrescription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {selectedPrescription.status === 'active' ? 'Active' : 'Expired'}
                    </span>
                  </div>
                  
                  {/* Patient Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Patient Information</h4>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                        {selectedPrescription.patientName.split(' ').map(name => name[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{selectedPrescription.patientName}</div>
                        <div className="text-sm text-gray-500">{selectedPrescription.patientId}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Prescription Details */}
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-gray-500">Date</div>
                        <div className="text-sm font-medium">{new Date(selectedPrescription.date).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Diagnosis</div>
                        <div className="text-sm font-medium">{selectedPrescription.diagnosis}</div>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-medium text-gray-500 mb-3">Medications</h4>
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Medication
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Dosage
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Frequency
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedPrescription.medications.map((med, index) => (
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
                                {med.duration}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="space-y-4">
                      {selectedPrescription.medications.map((med, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">{med.name} ({med.dosage})</h5>
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Instructions:</span> {med.instructions}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {selectedPrescription.notes && (
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Additional Notes</h4>
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                          <p className="text-sm text-gray-700">{selectedPrescription.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-end space-x-4">
                    <button
                      onClick={handleCloseModal}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-150"
                    >
                      Close
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
                    >
                      Print Prescription
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}