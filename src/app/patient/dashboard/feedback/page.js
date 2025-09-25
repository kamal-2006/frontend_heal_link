"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function PatientFeedbackPage() {
  // State for past appointments that need feedback
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // State for the current appointment being reviewed
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // Feedback form state
  const [rating, setRating] = useState(0);
  const [waitTime, setWaitTime] = useState("on-time");
  const [comments, setComments] = useState("");

  // Fetch past appointments that need feedback
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          setAppointments([
            {
              id: 1,
              doctorName: "Dr. Sarah Johnson",
              specialty: "Cardiology",
              date: "2023-06-15",
              time: "10:00 AM",
            },
            {
              id: 2,
              doctorName: "Dr. Michael Chen",
              specialty: "Dermatology",
              date: "2023-06-20",
              time: "2:30 PM",
            },
            {
              id: 3,
              doctorName: "Dr. Emily Rodriguez",
              specialty: "Neurology",
              date: "2023-06-25",
              time: "11:15 AM",
            },
          ]);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setLoading(false);
        setMessage({
          type: "error",
          text: "Failed to load appointments. Please try again later.",
        });
      }
    };

    fetchAppointments();
  }, []);

  // Handle opening the feedback form for a specific appointment
  const handleOpenFeedback = (appointment) => {
    setCurrentAppointment(appointment);
    // Reset form
    setRating(0);
    setWaitTime("on-time");
    setComments("");
  };

  // Handle submitting feedback
  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    setLoading(true);

    // In a real app, this would be an API call to submit feedback
    setTimeout(() => {
      setLoading(false);
      setCurrentAppointment(null);
      setMessage({
        type: "success",
        text: "Thank you for your feedback! It helps us improve our services.",
      });

      // Remove the submitted appointment from the list
      setAppointments(
        appointments.filter((apt) => apt.id !== currentAppointment.id)
      );

      // Clear the message after 5 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
    }, 1000);
  };

  // Handle canceling feedback submission
  const handleCancelFeedback = () => {
    setCurrentAppointment(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          Appointment Feedback
        </h1>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 text-green-800"
              : "bg-red-50 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : currentAppointment ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Provide Feedback for Your Appointment
          </h2>

          <div className="mb-6">
            <p className="text-gray-700">
              <span className="font-medium">Doctor:</span>{" "}
              {currentAppointment.doctorName}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Specialty:</span>{" "}
              {currentAppointment.specialty}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Date:</span>{" "}
              {currentAppointment.date}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Time:</span>{" "}
              {currentAppointment.time}
            </p>
          </div>

          <form onSubmit={handleSubmitFeedback} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How would you rate your experience?
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-8 w-8 ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              {rating === 0 && (
                <p className="text-sm text-red-600 mt-1">
                  Please select a rating
                </p>
              )}
            </div>

            {/* Wait Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How was the wait time?
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setWaitTime("early")}
                  className={`py-2 px-3 text-sm font-medium rounded-md ${
                    waitTime === "early"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-gray-50 text-gray-800 border-gray-200"
                  } border`}
                >
                  Seen Early
                </button>
                <button
                  type="button"
                  onClick={() => setWaitTime("on-time")}
                  className={`py-2 px-3 text-sm font-medium rounded-md ${
                    waitTime === "on-time"
                      ? "bg-blue-100 text-blue-800 border-blue-300"
                      : "bg-gray-50 text-gray-800 border-gray-200"
                  } border`}
                >
                  On Time
                </button>
                <button
                  type="button"
                  onClick={() => setWaitTime("delayed")}
                  className={`py-2 px-3 text-sm font-medium rounded-md ${
                    waitTime === "delayed"
                      ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                      : "bg-gray-50 text-gray-800 border-gray-200"
                  } border`}
                >
                  Delayed
                </button>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label
                htmlFor="comments"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Additional Comments
              </label>
              <textarea
                id="comments"
                rows={4}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Share your experience with this doctor..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancelFeedback}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={rating === 0}
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm ${
                  rating === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-700"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                Submit Feedback
              </button>
            </div>
          </form>
        </div>
      ) : appointments.length > 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-medium text-gray-900">
              Appointments Awaiting Feedback
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      {appointment.doctorName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {appointment.specialty}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {appointment.date}
                    </p>
                    <p className="text-sm text-gray-500">{appointment.time}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleOpenFeedback(appointment)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Provide Feedback
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            All caught up!
          </h3>
          <p className="mt-2 text-gray-500">
            You have no appointments that need feedback.
          </p>
        </div>
      )}
    </div>
  );
}
