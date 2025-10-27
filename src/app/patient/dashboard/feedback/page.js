"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { feedbackApi } from "../../../../utils/api";

// Feedback visualization component
const FeedbackChart = ({ feedbackHistory }) => {
  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]; // For ratings 1-5
  
  feedbackHistory.forEach(feedback => {
    if (feedback.rating >= 1 && feedback.rating <= 5) {
      ratingCounts[feedback.rating - 1]++;
    }
  });
  
  // Calculate percentages for the chart
  const total = ratingCounts.reduce((sum, count) => sum + count, 0);
  const percentages = ratingCounts.map(count => total > 0 ? Math.round((count / total) * 100) : 0);
  
  return (
    <div className="p-6">
      <h4 className="text-md font-medium text-gray-900 mb-4">Your Feedback Summary</h4>
      
      {total > 0 ? (
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <div key={rating} className="flex items-center">
              <div className="w-12 text-sm font-medium text-gray-900">{rating} stars</div>
              <div className="flex-1 ml-4">
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${rating >= 4 ? 'bg-green-500' : rating === 3 ? 'bg-yellow-400' : 'bg-red-400'}`}
                    style={{ width: `${percentages[rating - 1]}%` }}
                  ></div>
                </div>
              </div>
              <div className="w-12 text-sm font-medium text-gray-500 text-right">
                {percentages[rating - 1]}%
              </div>
            </div>
          ))}
          
          <div className="mt-4 text-sm text-gray-500 text-center">
            Based on {total} feedback submissions
          </div>
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">
          No feedback data available to display
        </div>
      )}
    </div>
  );
};

export default function PatientFeedbackPage() {
  // State for past appointments that need feedback
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  // State for feedback history
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // State for the current appointment being reviewed
  const [currentAppointment, setCurrentAppointment] = useState(null);

  // Feedback form state
  const [rating, setRating] = useState(0);
  const [waitTime, setWaitTime] = useState("on-time");
  const [comments, setComments] = useState("");

  // Fetch past appointments that need feedback and feedback history
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setLoadingHistory(true);
        
        // Fetch appointments that need feedback
        const appointmentsRes = await feedbackApi.getAppointmentsNeedingFeedback();
        // Normalize to expected shape for this UI
        const normalized = (appointmentsRes.data || []).map((apt) => ({
          _id: apt._id,
          id: apt._id, // legacy usage in this page
          date: apt.date,
          time: apt.date ? new Date(apt.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          doctor: apt.doctor, // object with _id, firstName, lastName, specialization
          doctorName: apt.doctor ? `Dr. ${apt.doctor.firstName} ${apt.doctor.lastName}` : 'Doctor',
          specialty: apt.doctor?.specialization || 'General Medicine',
        }));
        setAppointments(normalized);
        setLoading(false);
        
        // Fetch feedback history
        const feedbackData = await feedbackApi.getMyFeedback();
        setFeedbackHistory(feedbackData.data || []);
        setLoadingHistory(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
        setLoadingHistory(false);
        setMessage({
          type: "error",
          text: "Failed to load data. Please try again later.",
        });
      }
    };

    fetchData();
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
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare feedback data
      const feedbackPayload = {
        doctor: currentAppointment?.doctor?._id || currentAppointment?.doctor,
        rating: rating,
        waitTime: waitTime,
        comment: comments,
        appointment: currentAppointment?._id || currentAppointment?.id,
      };

      // Submit feedback to backend
      await feedbackApi.submitFeedback(feedbackPayload);
      
      // Update UI
      setLoading(false);
      setCurrentAppointment(null);
      setMessage({
        type: "success",
        text: "Thank you for your feedback! It helps us improve our services.",
      });

      // Remove the submitted appointment from the list and refresh feedback history
      setAppointments((prev) => prev.filter((apt) => (apt._id || apt.id) !== (currentAppointment?._id || currentAppointment?.id)));
      
      // Refresh feedback history
      const updatedFeedbackData = await feedbackApi.getMyFeedback();
      setFeedbackHistory(updatedFeedbackData.data || []);

      // Clear the message after 5 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setLoading(false);
      setMessage({
        type: "error",
        text: "Failed to submit feedback. Please try again later.",
      });
    }
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
      
      {/* Tabs for navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setCurrentAppointment(null)}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              !currentAppointment
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Feedback Overview
          </button>
        </nav>
      </div>

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
              {currentAppointment.doctorName || `Dr. ${currentAppointment.doctor?.firstName} ${currentAppointment.doctor?.lastName}`}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Specialty:</span>{" "}
              {currentAppointment.specialty || currentAppointment.doctor?.specialization}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Date:</span>{" "}
              {currentAppointment.date ? new Date(currentAppointment.date).toLocaleDateString() : "N/A"}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Time:</span>{" "}
              {currentAppointment.time || "N/A"}
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
      ) : (
        <div className="space-y-6">
          {/* Appointments awaiting feedback */}
          {appointments.length > 0 && (
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
                          {appointment.doctorName || `Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {appointment.specialty || appointment.doctor?.specialization}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          {appointment.date ? new Date(appointment.date).toLocaleDateString() : "N/A"}
                        </p>
                        <p className="text-sm text-gray-500">{appointment.time || "N/A"}</p>
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
          )}

          {/* Feedback History */}
           <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
             <div className="px-6 py-5 border-b border-gray-100">
               <h3 className="text-lg font-medium text-gray-900">
                 Your Feedback History
               </h3>
             </div>
             
             {loadingHistory ? (
               <div className="flex items-center justify-center h-32">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
               </div>
             ) : feedbackHistory.length > 0 ? (
               <>
                 {/* Feedback Chart */}
                 <div className="border-b border-gray-100">
                   <FeedbackChart feedbackHistory={feedbackHistory} />
                 </div>
              <div className="divide-y divide-gray-100">
                {feedbackHistory.map((feedback) => (
                  <div key={feedback._id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {`Dr. ${feedback.doctor?.firstName} ${feedback.doctor?.lastName}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {feedback.doctor?.specialization}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${
                              star <= feedback.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{feedback.comment}</p>
                    <p className="mt-1 text-xs text-gray-500">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
               </>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-500">You haven't provided any feedback yet.</p>
              </div>
            )}
          </div>
          
          {appointments.length === 0 && feedbackHistory.length === 0 && (
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
      )}
    </div>
  );
}