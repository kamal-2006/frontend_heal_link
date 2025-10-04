"use client";

import { useState, useEffect } from "react";
import { doctorApi, appointmentApi } from '../../../../utils/api';

export default function PatientBookPage() {
  const [formData, setFormData] = useState({
    reason: "",
    specialization: "",
    preferredDate: "",
    preferredTime: "",
    notes: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [step, setStep] = useState(1); // 1: Form, 2: Doctor Selection
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loadingDoctors, setLoadingDoctors] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Basic validation
    if (!formData.reason.trim() || !formData.preferredDate || !formData.preferredTime || !formData.specialization) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      setLoading(false);
      return;
    }

    try {
      // Fetch available doctors based on criteria
      setLoadingDoctors(true);
      console.log('Fetching doctors with criteria:', { date: formData.preferredDate, time: formData.preferredTime, specialization: formData.specialization });
      
      // Build query string
      const queryParams = new URLSearchParams({
        date: formData.preferredDate,
        time: formData.preferredTime,
        specialization: formData.specialization
      });
      
      // API call to fetch doctors using the proper API function
      const data = await doctorApi.getAvailableDoctors(`?${queryParams.toString()}`);
      console.log('Available doctors response:', data);
      
      setAvailableDoctors(data.data || []);
      
      // Move to doctor selection step if doctors are available
      if (data.data.length > 0) {
        setStep(2);
      } else {
        setMessage({ 
          type: 'info', 
          text: 'No doctors available for the selected criteria. Please try different date, time or specialization.' 
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to find available doctors. Please try again." });
    } finally {
      setLoading(false);
      setLoadingDoctors(false);
    }
  };
  
  const handleBookAppointment = async (doctorId) => {
    setSelectedDoctor(doctorId);
    setLoading(true);
    
    try {
      // API call to book appointment using the proper API function
      const appointmentData = {
        doctor: doctorId,
        date: `${formData.preferredDate}T${formData.preferredTime}:00`,
        reason: formData.reason,
        notes: formData.notes
      };
      
      console.log('Booking appointment with data:', appointmentData);
      const response = await appointmentApi.bookAppointment(appointmentData);
      console.log('Appointment booking response:', response);
      
      setMessage({ 
        type: "success", 
        text: "Appointment booked successfully! You can view it in your appointments." 
      });
      
      // Reset form and go back to step 1
      setFormData({
        reason: "",
        specialization: "",
        preferredDate: "",
        preferredTime: "",
        notes: ""
      });
      setStep(1);
      setSelectedDoctor(null);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to book appointment. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // Get tomorrow's date as minimum selectable date
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // List of specializations
  const specializations = [
    "General Medicine",
    "Cardiology",
    "Dermatology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Gynecology",
    "Ophthalmology",
    "ENT",
    "Psychiatry",
    "Dentistry"
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Book New Appointment</h1>
      
      {message.text && (
        <div className={`p-4 rounded-lg border ${
          message.type === "success" 
            ? "bg-green-50 text-green-800 border-green-200" 
            : "bg-red-50 text-red-800 border-red-200"
        }`}>
          <div className="flex items-center">
            <svg className={`w-5 h-5 mr-2 ${message.type === "success" ? "text-green-500" : "text-red-500"}`} fill="currentColor" viewBox="0 0 20 20">
              {message.type === "success" ? (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              )}
            </svg>
            {message.text}
          </div>
        </div>
      )}

      {step === 1 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  placeholder="Please describe your symptoms or the reason for this appointment..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization *
                </label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Select specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="preferredDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date *
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
                  Preferred Time *
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
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Finding Doctors...
                  </div>
                ) : (
                  'Find Available Doctors'
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900">Available Doctors</h2>
            <button 
              onClick={() => setStep(1)} 
              className="text-blue-600 hover:text-blue-800 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Form
            </button>
          </div>
          
          <div className="mb-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Appointment Details:</span> {formData.specialization} • {formData.preferredDate} • {formData.preferredTime}
            </p>
          </div>
          
          {loadingDoctors ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : availableDoctors.length === 0 ? (
            <div className="text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No doctors available</h3>
              <p className="mt-2 text-gray-500">Try selecting a different date, time, or specialization.</p>
              <button 
                onClick={() => setStep(1)} 
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Change Criteria
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableDoctors.map((doctor) => (
                <div key={doctor._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium text-lg">
                      {doctor.user.firstName.charAt(0)}{doctor.user.lastName.charAt(0)}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-medium text-gray-900">Dr. {doctor.user.firstName} {doctor.user.lastName}</h3>
                      <p className="text-sm text-gray-500">{doctor.specialization}</p>
                      <div className="mt-1 flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className={`h-4 w-4 ${i < doctor.rating ? "text-yellow-400" : "text-gray-300"}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-500">({doctor.totalReviews} reviews)</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>Experience: {doctor.experience} years</p>
                        <p>Fee: ${doctor.consultationFee}</p>
                      </div>
                      <div className="mt-3">
                        <button
                          onClick={() => handleBookAppointment(doctor._id)}
                          disabled={loading && selectedDoctor === doctor._id}
                          className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {loading && selectedDoctor === doctor._id ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                              Booking...
                            </div>
                          ) : (
                            'Book Appointment'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}