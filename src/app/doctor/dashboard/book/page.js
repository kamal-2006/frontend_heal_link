"use client";

import { useState, useEffect } from "react";
import { patientApi, appointmentApi } from '../../../../utils/api';

export default function DoctorBookPage() {
  const [formData, setFormData] = useState({
    reason: "",
    patient: "",
    preferredDate: "",
    preferredTime: "",
    notes: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await patientApi.getPatients();
        setPatients(response.data || []);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(patient => 
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const appointmentData = {
        patient: formData.patient,
        date: `${formData.preferredDate}T${formData.preferredTime}:00`,
        reason: formData.reason,
        notes: formData.notes || ''
      };
      
      const response = await appointmentApi.bookAppointment(appointmentData);
      
      setMessage({ 
        type: "success", 
        text: "Appointment booked successfully!" 
      });
      
      setFormData({
        reason: "",
        patient: "",
        preferredDate: "",
        preferredTime: "",
        notes: ""
      });
    } catch (error) {
      setMessage({ type: "error", text: `Failed to book appointment: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Book New Appointment</h1>
      
      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === "success" 
            ? "bg-green-50 text-green-800 border-green-200" 
            : "bg-red-50 text-red-800 border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleBookAppointment} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-2">
                Patient *
              </label>
              <input 
                type="text"
                placeholder="Search for a patient..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none mb-2"
              />
              <select
                id="patient"
                name="patient"
                value={formData.patient}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Select a patient</option>
                {filteredPatients.map((p) => (
                  <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit *
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                value={formData.reason}
                onChange={handleChange}
                placeholder="Please describe the reason for this appointment..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                min={getTomorrowDate()}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="preferredTime" className="block text-sm font-medium text-gray-700 mb-2">
                Time *
              </label>
              <select
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                required
              >
                <option value="">Select time</option>
                <option value="09:00">09:00 AM</option>
                <option value="09:30">09:30 AM</option>
                <option value="10:00">10:00 AM</option>
                <option value="10:30">10:30 AM</option>
                <option value="11:00">11:00 AM</option>
                <option value="11:30">11:30 AM</option>
                <option value="14:00">02:00 PM</option>
                <option value="14:30">02:30 PM</option>
                <option value="15:00">03:00 PM</option>
                <option value="15:30">03:30 PM</option>
                <option value="16:00">04:00 PM</option>
                <option value="16:30">04:30 PM</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional information you'd like to share..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}