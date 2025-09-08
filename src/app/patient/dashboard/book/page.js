"use client";

import { useState, useEffect, useMemo } from "react";

export default function PatientBookPage() {
  // State for doctors, selected doctor, and availability
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        setDoctors([
          { id: 1, name: "Dr. Sarah Johnson", specialty: "General Physician", rating: 4.8 },
          { id: 2, name: "Dr. Michael Chen", specialty: "Cardiologist", rating: 4.9 },
          { id: 3, name: "Dr. Emma Davis", specialty: "Dermatologist", rating: 4.7 },
          { id: 4, name: "Dr. Robert Wilson", specialty: "Neurologist", rating: 4.6 },
          { id: 5, name: "Dr. Lisa Thompson", specialty: "Pediatrician", rating: 4.9 },
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchDoctors();
  }, []);

  // Fetch availability when a doctor is selected
  useEffect(() => {
    if (!selectedDoctorId) {
      setAvailability([]);
      return;
    }

    setLoading(true);
    // In a real app, this would be an API call with the doctor ID
    setTimeout(() => {
      // Generate some mock availability slots for the next 7 days
      const mockAvailability = [];
      const today = new Date();
      
      for (let i = 1; i <= 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        // Skip weekends for some doctors to show variation
        if ((date.getDay() === 0 || date.getDay() === 6) && selectedDoctorId % 2 === 0) {
          continue;
        }
        
        // Add 2-4 slots per day
        const slots = [];
        const numSlots = 2 + Math.floor(Math.random() * 3);
        const startHour = 9 + (selectedDoctorId % 3); // Vary start times slightly
        
        for (let j = 0; j < numSlots; j++) {
          const hour = startHour + j;
          slots.push({
            id: `${date.toISOString().split('T')[0]}-${hour}`,
            time: `${hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
          });
        }
        
        mockAvailability.push({
          date: date.toISOString().split('T')[0],
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          slots: slots,
        });
      }
      
      setAvailability(mockAvailability);
      setLoading(false);
    }, 800);
  }, [selectedDoctorId]);

  // Get the selected doctor object
  const selectedDoctor = useMemo(() => {
    return doctors.find(doctor => doctor.id === selectedDoctorId) || null;
  }, [doctors, selectedDoctorId]);

  // Handle booking an appointment
  const handleBook = (date, slotId) => {
    setLoading(true);
    // In a real app, this would be an API call to book the appointment
    setTimeout(() => {
      setMessage({
        type: "success",
        text: `Appointment booked successfully with ${selectedDoctor.name} on ${date} at ${slotId.split('-')[1]}:00.`
      });
      setLoading(false);
      
      // Clear the message after 5 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
      </div>

      {message.text && (
        <div className={`p-4 rounded-md ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Doctor Selection */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Select a Doctor</h2>
            
            {loading && !selectedDoctorId ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {doctors.map(doctor => (
                  <div 
                    key={doctor.id}
                    onClick={() => setSelectedDoctorId(doctor.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedDoctorId === doctor.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{doctor.name}</h3>
                        <p className="text-sm text-gray-500">{doctor.specialty}</p>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-700 ml-1">{doctor.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Availability Calendar */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {selectedDoctor ? `Available Slots for ${selectedDoctor.name}` : "Select a doctor to view availability"}
            </h2>

            {selectedDoctorId && loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedDoctorId && availability.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {availability.map(day => (
                  <div key={day.date} className="border rounded-lg p-4">
                    <div className="text-center mb-3">
                      <p className="font-medium text-gray-900">{day.day}</p>
                      <p className="text-sm text-gray-500">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div className="space-y-2">
                      {day.slots.map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => handleBook(day.date, slot.id)}
                          className="w-full py-2 px-3 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : selectedDoctorId ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No available slots for this doctor.</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">Please select a doctor to view their availability.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}