"use client";

import React, { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default function FeedbackPage() {
  const [appointments, setAppointments] = useState([]);
  const [feedbackHistory, setFeedbackHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeFilter, setActiveFilter] = useState("available");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    rating: 5,
    comment: "",
    feedbackType: "compliment"
  });

  useEffect(() => {
    fetchCompletedAppointments();
    fetchFeedbackHistory();
  }, []);

  // Fetch completed appointments
  const fetchCompletedAppointments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/feedback/patient/appointments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAppointments(data.data || []);
      } else {
        console.error("Failed to fetch appointments");
        setAppointments([]);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch submitted feedback history
  const fetchFeedbackHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/patient/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFeedbackHistory(data.data || []);
      } else {
        console.error("Failed to fetch feedback history");
        setFeedbackHistory([]);
      }
    } catch (error) {
      console.error("Error fetching feedback history:", error);
      setFeedbackHistory([]);
    }
  };

  // Submit feedback
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!selectedAppointment) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          appointment: selectedAppointment._id,
          rating: feedbackForm.rating,
          comment: feedbackForm.comment,
          feedbackType: feedbackForm.feedbackType
        }),
      });

      if (response.ok) {
        // Show success popup
        setShowSuccessPopup(true);
        
        // Auto-hide success popup after 3 seconds
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 3000);

        // Reset form and close modal
        setFeedbackForm({ rating: 5, comment: "", feedbackType: "compliment" });
        setShowFeedbackModal(false);
        setSelectedAppointment(null);
        
        // Refresh data
        fetchCompletedAppointments();
        fetchFeedbackHistory();
      } else {
        console.error("Failed to submit feedback");
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  // Open feedback modal
  const openFeedbackModal = (appointment) => {
    setSelectedAppointment(appointment);
    setShowFeedbackModal(true);
  };

  // Render star rating with SVG icons
  const renderStars = (rating, interactive = false, onRatingChange = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          disabled={!interactive}
          onClick={() => interactive && onRatingChange && onRatingChange(i)}
          className={`${interactive ? "cursor-pointer hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50" : "cursor-default"} transition-all duration-200 rounded p-1`}
        >
          <svg
            className={`w-6 h-6 ${i <= rating ? "text-yellow-400" : "text-gray-300"} ${interactive && i <= rating ? "drop-shadow-sm" : ""}`}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      );
    }
    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  // Format date for appointments
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format date for feedback submission
  const formatFeedbackDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    };
    return date.toLocaleDateString(undefined, options);
  };

  // Check if feedback already submitted for appointment
  const isFeedbackSubmitted = (appointmentId) => {
    return feedbackHistory.some(feedback => feedback.appointment?._id === appointmentId);
  };

  // Filter appointments based on active filter
  const filteredAppointments = appointments.filter(appointment => {
    if (activeFilter === "available") {
      return !isFeedbackSubmitted(appointment._id);
    } else {
      return isFeedbackSubmitted(appointment._id);
    }
  });

  // Generate pie chart data for feedback ratings
  const getPieChartData = () => {
    if (feedbackHistory.length === 0) {
      return {
        labels: ["No feedback yet"],
        datasets: [{
          data: [1],
          backgroundColor: ["#E5E7EB"],
          borderColor: ["#9CA3AF"],
          borderWidth: 1,
        }]
      };
    }

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedbackHistory.forEach(feedback => {
      ratingCounts[feedback.rating]++;
    });

    return {
      labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
      datasets: [{
        data: [ratingCounts[5], ratingCounts[4], ratingCounts[3], ratingCounts[2], ratingCounts[1]],
        backgroundColor: [
          "#4ADE80", // Bright green for 5 stars
          "#60A5FA", // Light blue for 4 stars  
          "#FBBF24", // Bright yellow for 3 stars
          "#FB923C", // Warm orange for 2 stars
          "#F87171", // Soft red for 1 star
        ],
        borderColor: [
          "#22C55E",
          "#3B82F6", 
          "#F59E0B",
          "#F97316",
          "#EF4444",
        ],
        borderWidth: 2,
        hoverBorderWidth: 3,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Calculate average rating
  const averageRating = feedbackHistory.length > 0 
    ? (feedbackHistory.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbackHistory.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feedback & Reviews</h1>
            <p className="text-gray-600 mt-2">Share your experience and help us improve our services</p>
          </div>
        </div>

        {/* Statistics Cards */}
        {feedbackHistory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1.1" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Feedback</p>
                  <p className="text-2xl font-semibold text-gray-900">{feedbackHistory.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-2xl font-semibold text-gray-900">{averageRating}</p>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Appointments Rated</p>
                  <p className="text-2xl font-semibold text-gray-900">{feedbackHistory.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-semibold text-gray-900">{appointments.filter(app => !isFeedbackSubmitted(app._id)).length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pie Chart Section */}
        {feedbackHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Rating Distribution</h2>
              <p className="text-gray-600">Overview of your feedback ratings</p>
            </div>
            <div className="p-6">
              <div className="h-64 flex justify-center">
                <Pie data={getPieChartData()} options={chartOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveFilter("available")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeFilter === "available"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Available for Feedback ({appointments.filter(app => !isFeedbackSubmitted(app._id)).length})
          </button>
          <button
            onClick={() => setActiveFilter("completed")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeFilter === "completed"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Feedback Submitted ({feedbackHistory.length})
          </button>
        </div>

        {/* Appointments Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {activeFilter === "available" ? "Appointments Available for Feedback" : "Feedback History"}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  {activeFilter === "completed" && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {activeFilter === "available" ? (
                  filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-1.1" />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">No appointments available for feedback</h3>
                          <p className="text-gray-500">Complete appointments will appear here for you to provide feedback.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAppointments.map((appointment) => (
                      <tr key={appointment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {appointment.doctor ? 
                                  `${appointment.doctor.firstName?.[0] || ''}${appointment.doctor.lastName?.[0] || ''}` : 
                                  'Dr'
                                }
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                Dr. {appointment.doctor ? 
                                  `${appointment.doctor.firstName} ${appointment.doctor.lastName}` : 
                                  'Unknown Doctor'
                                }
                              </div>
                              <div className="text-sm text-gray-500">
                                {appointment.doctor?.specialty || 'General Medicine'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatDate(appointment.date)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {appointment.reason || 'General Consultation'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openFeedbackModal(appointment)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            Give Feedback
                          </button>
                        </td>
                      </tr>
                    ))
                  )
                ) : (
                  feedbackHistory.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-900 mb-1">No feedback submitted yet</h3>
                          <p className="text-gray-500">Your feedback history will appear here after you submit reviews.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    feedbackHistory.map((feedback) => (
                      <tr key={feedback._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-sm">
                                {feedback.doctor ? 
                                  `${feedback.doctor.firstName?.[0] || ''}${feedback.doctor.lastName?.[0] || ''}` : 
                                  'Dr'
                                }
                              </span>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                Dr. {feedback.doctor ? 
                                  `${feedback.doctor.firstName} ${feedback.doctor.lastName}` : 
                                  'Unknown Doctor'
                                }
                              </div>
                              <div className="text-sm text-gray-500">
                                {feedback.doctor?.specialty || 'General Medicine'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatFeedbackDate(feedback.createdAt)}</div>
                          <div className="text-xs text-gray-500">Submitted</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {feedback.appointment?.reason || 'General Consultation'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Feedback Submitted
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStars(feedback.rating)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {feedback.comment ? (
                              <span className="text-gray-600 italic">"{feedback.comment.substring(0, 50)}..."</span>
                            ) : (
                              <span className="text-gray-400">No comment</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Success!</h3>
            <p className="text-gray-600">Feedback submitted successfully</p>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Share Your Feedback</h3>
                  <p className="text-sm text-gray-600">
                    Dr. {selectedAppointment.doctor ? 
                      `${selectedAppointment.doctor.firstName} ${selectedAppointment.doctor.lastName}` : 
                      'Unknown Doctor'
                    }
                  </p>
                </div>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmitFeedback} className="space-y-6">
                {/* Rating Section */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    How would you rate your experience? *
                  </label>
                  <div className="flex justify-center mb-3">
                    {renderStars(feedbackForm.rating, true, (rating) => 
                      setFeedbackForm({ ...feedbackForm, rating })
                    )}
                  </div>
                  <div className="text-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      feedbackForm.rating === 5 ? "bg-green-100 text-green-800" :
                      feedbackForm.rating === 4 ? "bg-blue-100 text-blue-800" :
                      feedbackForm.rating === 3 ? "bg-yellow-100 text-yellow-800" :
                      feedbackForm.rating === 2 ? "bg-orange-100 text-orange-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {feedbackForm.rating === 5 ? "Excellent!" :
                       feedbackForm.rating === 4 ? "Good" :
                       feedbackForm.rating === 3 ? "Average" :
                       feedbackForm.rating === 2 ? "Poor" :
                       "Very Poor"}
                    </span>
                  </div>
                </div>

                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Type of feedback
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <label className="flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="feedbackType"
                        value="compliment"
                        checked={feedbackForm.feedbackType === "compliment"}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, feedbackType: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`text-center ${feedbackForm.feedbackType === "compliment" ? "text-green-600" : "text-gray-500"}`}>
                        <div className="text-2xl mb-1">😊</div>
                        <div className="text-sm font-medium">Compliment</div>
                      </div>
                    </label>
                    <label className="flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="feedbackType"
                        value="complaint"
                        checked={feedbackForm.feedbackType === "complaint"}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, feedbackType: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`text-center ${feedbackForm.feedbackType === "complaint" ? "text-red-600" : "text-gray-500"}`}>
                        <div className="text-2xl mb-1">😞</div>
                        <div className="text-sm font-medium">Complaint</div>
                      </div>
                    </label>
                    <label className="flex items-center justify-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="feedbackType"
                        value="suggestion"
                        checked={feedbackForm.feedbackType === "suggestion"}
                        onChange={(e) => setFeedbackForm({ ...feedbackForm, feedbackType: e.target.value })}
                        className="sr-only"
                      />
                      <div className={`text-center ${feedbackForm.feedbackType === "suggestion" ? "text-blue-600" : "text-gray-500"}`}>
                        <div className="text-2xl mb-1">💡</div>
                        <div className="text-sm font-medium">Suggestion</div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Comment Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {feedbackForm.feedbackType === "complaint" ? "What went wrong?" : 
                     feedbackForm.feedbackType === "suggestion" ? "Your suggestion:" : 
                     "What did you like?"}
                  </label>
                  <textarea
                    value={feedbackForm.comment}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder={
                      feedbackForm.feedbackType === "complaint" ? "Please describe the issue you experienced..." :
                      feedbackForm.feedbackType === "suggestion" ? "How can we improve your experience?" :
                      "Share what made your visit great..."
                    }
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
                  >
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Submit Feedback
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}