"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import { get } from "@/utils/api";

export default function FeedbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get("appointmentId");

  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [newFeedback, setNewFeedback] = useState({
    appointmentId: appointmentId || "",
    rating: 0,
    type: "Feedback",
    comment: "",
  });

  // Rating summary stats
  const [ratingStats, setRatingStats] = useState({
    total: 0,
    unread: 0,
    lowRating: 0,
    averageRating: 0,
    ratingCounts: [0, 0, 0, 0, 0],
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        setTimeout(() => router.push("/login"), 100);
        return;
      }

      if (role !== "patient") {
        alert("Access denied. Please login as a patient.");
        setTimeout(() => router.push("/login"), 100);
        return;
      }

      // Simulate data loading
      setTimeout(() => {
        const mockFeedbacks = [
          {
            _id: "f1",
            appointmentId: "a1",
            doctorName: "Dr. John Smith",
            doctorSpecialization: "Cardiology",
            rating: 5,
            type: "Feedback",
            comment:
              "Great experience! The doctor was very attentive and explained everything clearly.",
            date: "2023-10-15T10:30:00",
            status: "read",
          },
          {
            _id: "f2",
            appointmentId: "a2",
            doctorName: "Dr. Sarah Johnson",
            doctorSpecialization: "Dermatology",
            rating: 4,
            type: "Feedback",
            comment:
              "Good consultation, but had to wait a bit longer than expected.",
            date: "2023-09-22T14:15:00",
            status: "read",
          },
          {
            _id: "f3",
            appointmentId: "a3",
            doctorName: "Dr. Michael Chen",
            doctorSpecialization: "Neurology",
            rating: 2,
            type: "Complaint",
            comment:
              "The doctor seemed rushed and didn't address all my concerns.",
            date: "2023-08-05T09:45:00",
            status: "unread",
          },
          {
            _id: "f4",
            appointmentId: "a4",
            doctorName: "Dr. Emily Wilson",
            doctorSpecialization: "Pediatrics",
            rating: 5,
            type: "Feedback",
            comment: "Excellent with my child! Very patient and thorough.",
            date: "2023-07-18T16:00:00",
            status: "unread",
          },
          {
            _id: "f5",
            appointmentId: "a5",
            doctorName: "Dr. Robert Lee",
            doctorSpecialization: "Orthopedics",
            rating: 3,
            type: "Feedback",
            comment:
              "Treatment was effective but could improve on explaining the recovery process.",
            date: "2023-06-30T11:20:00",
            status: "read",
          },
        ];

        setFeedbacks(mockFeedbacks);

        // Calculate statistics
        const total = mockFeedbacks.length;
        const unread = mockFeedbacks.filter(
          (f) => f.status === "unread"
        ).length;
        const lowRating = mockFeedbacks.filter((f) => f.rating <= 2).length;
        const ratingSum = mockFeedbacks.reduce((sum, f) => sum + f.rating, 0);
        const averageRating = total > 0 ? (ratingSum / total).toFixed(1) : 0;

        const ratingCounts = [0, 0, 0, 0, 0];
        mockFeedbacks.forEach((f) => {
          if (f.rating >= 1 && f.rating <= 5) {
            ratingCounts[f.rating - 1]++;
          }
        });

        setRatingStats({
          total,
          unread,
          lowRating,
          averageRating,
          ratingCounts,
        });

        setIsLoading(false);

        if (appointmentId) {
          setShowFeedbackModal(true);
        }
      }, 1000);
    };

    fetchData();
  }, [router, appointmentId]);

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setShowFeedbackModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback({
      ...newFeedback,
      [name]: value,
    });
  };

  const handleRatingChange = (rating) => {
    setNewFeedback({
      ...newFeedback,
      rating,
    });
  };

  const handleTypeChange = (type) => {
    setNewFeedback({
      ...newFeedback,
      type,
    });
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();

    if (newFeedback.rating === 0 || !newFeedback.comment.trim()) {
      alert("Please provide both a rating and comment");
      return;
    }

    // Add new feedback
    const newFeedbackItem = {
      _id: `new-${Date.now()}`,
      appointmentId: newFeedback.appointmentId,
      doctorName: "Dr. New Feedback",
      doctorSpecialization: "General",
      rating: newFeedback.rating,
      type: newFeedback.type,
      comment: newFeedback.comment,
      date: new Date().toISOString(),
      status: "unread",
    };

    setFeedbacks([newFeedbackItem, ...feedbacks]);

    // Update stats
    const newTotal = ratingStats.total + 1;
    const newRatingCounts = ratingStats.ratingCounts.map((count, index) =>
      index === newFeedback.rating - 1 ? count + 1 : count
    );
    const totalRatingSum = newRatingCounts.reduce(
      (sum, count, index) => sum + count * (index + 1),
      0
    );
    const newAverageRating = newTotal > 0 ? totalRatingSum / newTotal : 0;

    setRatingStats({
      ...ratingStats,
      total: newTotal,
      unread: ratingStats.unread + 1,
      lowRating:
        newFeedback.rating <= 2
          ? ratingStats.lowRating + 1
          : ratingStats.lowRating,
      averageRating: newAverageRating,
      ratingCounts: newRatingCounts,
    });

    // Reset form and close modal
    setNewFeedback({
      appointmentId: "",
      rating: 0,
      type: "Feedback",
      comment: "",
    });
    setShowFeedbackModal(false);
  };

  const maxRatingCount = Math.max(
    ...(ratingStats.ratingCounts || [0, 0, 0, 0, 0]),
    1
  );

  // Hospital color scheme - calming blues and greens
  const colors = {
    primary: "#2563eb", // Professional blue
    secondary: "#059669", // Healing green
    accent: "#0891b2", // Light blue
    background: "#f8fafc", // Soft gray
    card: "#ffffff",
    text: "#1e293b",
    muted: "#64748b",
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
  };

  // Remove the full-screen loading - we'll use inline loading like reports page

  return (
    <div
      className="min-h-screen p-6"
      style={{ backgroundColor: colors.background }}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
              Patient Feedback Center
            </h1>
            <p className="text-gray-600 mt-1">
              Help us improve our healthcare services
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedFeedback(null);
              setNewFeedback({
                appointmentId: "",
                rating: 0,
                type: "Feedback",
                comment: "",
              });
              setShowFeedbackModal(true);
            }}
            className="px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: colors.primary, color: "white" }}
          >
            <span className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Share Feedback
            </span>
          </button>
        </div>

        {/* Rating Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            className="rounded-lg p-4 shadow-sm border-l-4"
            style={{
              backgroundColor: colors.card,
              borderLeftColor: colors.primary,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-medium"
                  style={{ color: colors.muted }}
                >
                  Average Rating
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  {typeof ratingStats.averageRating === "number"
                    ? ratingStats.averageRating.toFixed(1)
                    : "0.0"}
                </p>
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(ratingStats.averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: `${colors.primary}10` }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: colors.primary }}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg p-4 shadow-sm border-l-4"
            style={{
              backgroundColor: colors.card,
              borderLeftColor: colors.success,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-medium"
                  style={{ color: colors.muted }}
                >
                  Total Reviews
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  {ratingStats.total}
                </p>
              </div>
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: `${colors.success}10` }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: colors.success }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg p-4 shadow-sm border-l-4"
            style={{
              backgroundColor: colors.card,
              borderLeftColor: colors.warning,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-medium"
                  style={{ color: colors.muted }}
                >
                  Unread
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  {ratingStats.unread}
                </p>
              </div>
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: `${colors.warning}10` }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: colors.warning }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div
            className="rounded-lg p-4 shadow-sm border-l-4"
            style={{
              backgroundColor: colors.card,
              borderLeftColor: colors.error,
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p
                  className="text-xs font-medium"
                  style={{ color: colors.muted }}
                >
                  Low Ratings
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: colors.text }}
                >
                  {ratingStats.lowRating}
                </p>
              </div>
              <div
                className="p-2 rounded-full"
                style={{ backgroundColor: `${colors.error}10` }}
              >
                <svg
                  className="w-6 h-6"
                  style={{ color: colors.error }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Analytics Dashboard */}
        <div
          className="rounded-lg shadow-sm overflow-hidden"
          style={{ backgroundColor: colors.card }}
        >
          <div className="p-4 border-b" style={{ borderColor: "#f1f5f9" }}>
            <h2
              className="text-lg font-semibold flex items-center"
              style={{ color: colors.text }}
            >
              <svg
                className="w-4 h-4 mr-2"
                style={{ color: colors.primary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
              Feedback Analytics
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Satisfaction Overview */}
              <div className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="relative w-36 h-36 mb-3">
                  {/* Circular Progress Ring */}
                  <svg
                    className="w-36 h-36 transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="transparent"
                      className="text-gray-200"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      stroke="url(#gradient)"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${
                        2 * Math.PI * 42 * (1 - ratingStats.averageRating / 5)
                      }`}
                      className="transition-all duration-1500 ease-out"
                      strokeLinecap="round"
                    />
                    {/* Gradient definition */}
                    <defs>
                      <linearGradient
                        id="gradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#3b82f6" />
                        <stop offset="100%" stopColor="#1d4ed8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        {typeof ratingStats.averageRating === "number"
                          ? ratingStats.averageRating.toFixed(1)
                          : "0.0"}
                      </div>
                      <div className="text-xs font-medium text-gray-500 -mt-1">
                        out of 5
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center space-y-2">
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(ratingStats.averageRating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        } transition-colors duration-300`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    Overall Satisfaction
                  </p>
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-600 bg-white bg-opacity-60 rounded-lg px-3 py-1">
                    <span>Total Reviews: {ratingStats.total}</span>
                  </div>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Rating Breakdown
                  </h3>
                  <div className="px-3 py-1 bg-gray-100 rounded-full">
                    <span className="text-xs font-medium text-gray-600">
                      Last 30 days
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      rating: 5,
                      label: "Excellent",
                      color: "bg-emerald-500",
                      bgColor: "bg-emerald-50",
                      textColor: "text-emerald-700",
                      borderColor: "border-emerald-200",
                      icon: "😊",
                    },
                    {
                      rating: 4,
                      label: "Good",
                      color: "bg-blue-500",
                      bgColor: "bg-blue-50",
                      textColor: "text-blue-700",
                      borderColor: "border-blue-200",
                      icon: "👍",
                    },
                    {
                      rating: 3,
                      label: "Average",
                      color: "bg-amber-500",
                      bgColor: "bg-amber-50",
                      textColor: "text-amber-700",
                      borderColor: "border-amber-200",
                      icon: "😐",
                    },
                    {
                      rating: 2,
                      label: "Poor",
                      color: "bg-orange-500",
                      bgColor: "bg-orange-50",
                      textColor: "text-orange-700",
                      borderColor: "border-orange-200",
                      icon: "😟",
                    },
                    {
                      rating: 1,
                      label: "Very Poor",
                      color: "bg-red-500",
                      bgColor: "bg-red-50",
                      textColor: "text-red-700",
                      borderColor: "border-red-200",
                      icon: "😞",
                    },
                  ].map((item) => {
                    const count =
                      ratingStats.ratingCounts[item.rating - 1] || 0;
                    const percentage =
                      ratingStats.total > 0
                        ? (count / ratingStats.total) * 100
                        : 0;

                    return (
                      <div
                        key={item.rating}
                        className={`p-4 rounded-xl ${item.bgColor} border ${item.borderColor} hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full shadow-sm">
                              <span className="text-lg">{item.icon}</span>
                            </div>
                            <div>
                              <div className="flex items-center space-x-1">
                                {[...Array(item.rating)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className="w-3 h-3 text-yellow-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                                {[...Array(5 - item.rating)].map((_, i) => (
                                  <svg
                                    key={i}
                                    className="w-3 h-3 text-gray-300"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span
                                className={`text-sm font-semibold ${item.textColor}`}
                              >
                                {item.label}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div
                              className={`text-lg font-bold ${item.textColor}`}
                            >
                              {count}
                            </div>
                            <div className="text-xs text-gray-500 font-medium">
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        <div className="relative">
                          <div className="w-full bg-white bg-opacity-70 rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                              className={`h-full rounded-full ${item.color} transition-all duration-1000 ease-out relative overflow-hidden`}
                              style={{ width: `${percentage}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform -skew-x-12 animate-pulse"></div>
                            </div>
                          </div>
                          {percentage > 0 && (
                            <div className="absolute top-0 right-0 transform translate-y-[-100%] mb-1">
                              <div
                                className={`px-2 py-1 text-xs font-medium ${item.textColor} bg-white rounded shadow-sm`}
                              >
                                {percentage.toFixed(1)}%
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback History Table */}
        <div
          className="rounded-xl shadow-lg overflow-hidden"
          style={{ backgroundColor: colors.card }}
        >
          <div className="p-6 border-b" style={{ borderColor: "#f1f5f9" }}>
            <h2
              className="text-xl font-semibold flex items-center"
              style={{ color: colors.text }}
            >
              <svg
                className="w-5 h-5 mr-3"
                style={{ color: colors.primary }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Feedback History
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Doctor & Specialty
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                      <div className="mt-2">Loading feedback...</div>
                    </td>
                  </tr>
                ) : feedbacks && feedbacks.length > 0 ? (
                  feedbacks.map((feedback) => (
                    <tr
                      key={feedback._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: `${colors.primary}10` }}
                          >
                            <span
                              className="text-sm font-medium"
                              style={{ color: colors.primary }}
                            >
                              {feedback.doctorName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div>
                            <div
                              className="text-sm font-medium"
                              style={{ color: colors.text }}
                            >
                              {feedback.doctorName}
                            </div>
                            <div
                              className="text-sm"
                              style={{ color: colors.muted }}
                            >
                              {feedback.doctorSpecialization}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-5 w-5 ${
                                star <= feedback.rating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            feedback.type === "Complaint"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {feedback.type}
                        </span>
                      </td>
                      <td
                        className="px-6 py-4 text-sm"
                        style={{ color: colors.muted }}
                      >
                        {new Date(feedback.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            feedback.status === "unread"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {feedback.status.charAt(0).toUpperCase() +
                            feedback.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewFeedback(feedback)}
                          className="p-2 rounded-full transition-all duration-300 hover:shadow-md hover:bg-blue-50"
                          style={{ color: colors.primary }}
                          title="View Feedback Details"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
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
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="text-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mx-auto mb-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <p className="text-gray-500 text-sm">
                          No feedback history available
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Your feedback will appear here after appointments
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b" style={{ borderColor: "#f1f5f9" }}>
              <div className="flex items-center justify-between">
                <h3
                  className="text-xl font-semibold flex items-center"
                  style={{ color: colors.text }}
                >
                  <svg
                    className="w-6 h-6 mr-3"
                    style={{ color: colors.primary }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  {selectedFeedback
                    ? "Feedback Details"
                    : "Share Your Experience"}
                </h3>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
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
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {selectedFeedback ? (
                <div className="space-y-6">
                  <div
                    className="flex items-center space-x-4 pb-4 border-b"
                    style={{ borderColor: "#f1f5f9" }}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${colors.primary}10` }}
                    >
                      <span
                        className="font-medium"
                        style={{ color: colors.primary }}
                      >
                        {selectedFeedback.doctorName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div
                        className="font-medium"
                        style={{ color: colors.text }}
                      >
                        {selectedFeedback.doctorName}
                      </div>
                      <div className="text-sm" style={{ color: colors.muted }}>
                        {selectedFeedback.doctorSpecialization}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4
                        className="text-sm font-medium mb-2"
                        style={{ color: colors.muted }}
                      >
                        Rating
                      </h4>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`h-6 w-6 ${
                              star <= selectedFeedback.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4
                        className="text-sm font-medium mb-2"
                        style={{ color: colors.muted }}
                      >
                        Type
                      </h4>
                      <span
                        className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                          selectedFeedback.type === "Complaint"
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {selectedFeedback.type}
                      </span>
                    </div>

                    <div>
                      <h4
                        className="text-sm font-medium mb-2"
                        style={{ color: colors.muted }}
                      >
                        Date
                      </h4>
                      <p className="text-sm" style={{ color: colors.text }}>
                        {new Date(selectedFeedback.date).toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <h4
                        className="text-sm font-medium mb-2"
                        style={{ color: colors.muted }}
                      >
                        Status
                      </h4>
                      <span
                        className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                          selectedFeedback.status === "unread"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedFeedback.status.charAt(0).toUpperCase() +
                          selectedFeedback.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4
                      className="text-sm font-medium mb-3"
                      style={{ color: colors.muted }}
                    >
                      Your Feedback
                    </h4>
                    <div
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: colors.background }}
                    >
                      <p className="text-sm" style={{ color: colors.text }}>
                        {selectedFeedback.comment}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-6">
                  {/* Rating Selection */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-3"
                      style={{ color: colors.text }}
                    >
                      How would you rate your experience?
                    </label>
                    <div className="flex justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-colors"
                        >
                          <svg
                            className={`h-10 w-10 ${
                              star <= newFeedback.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            } hover:text-yellow-400`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Type */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-3"
                      style={{ color: colors.text }}
                    >
                      What type of feedback is this?
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          newFeedback.type === "Feedback"
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleTypeChange("Feedback")}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            checked={newFeedback.type === "Feedback"}
                            onChange={() => handleTypeChange("Feedback")}
                            className="h-4 w-4 text-blue-600"
                          />
                          <div className="ml-3">
                            <div
                              className="font-medium"
                              style={{ color: colors.text }}
                            >
                              Positive Feedback
                            </div>
                            <div
                              className="text-sm"
                              style={{ color: colors.muted }}
                            >
                              Share a good experience
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          newFeedback.type === "Complaint"
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleTypeChange("Complaint")}
                      >
                        <div className="flex items-center">
                          <input
                            type="radio"
                            checked={newFeedback.type === "Complaint"}
                            onChange={() => handleTypeChange("Complaint")}
                            className="h-4 w-4 text-red-600"
                          />
                          <div className="ml-3">
                            <div
                              className="font-medium"
                              style={{ color: colors.text }}
                            >
                              Complaint
                            </div>
                            <div
                              className="text-sm"
                              style={{ color: colors.muted }}
                            >
                              Report an issue
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <div>
                    <label
                      htmlFor="comment"
                      className="block text-sm font-medium mb-3"
                      style={{ color: colors.text }}
                    >
                      Please share your experience
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows="4"
                      value={newFeedback.comment}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: colors.primary }}
                      placeholder="Your feedback helps us improve our healthcare services..."
                    ></textarea>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowFeedbackModal(false)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                      style={{ color: colors.text }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 rounded-lg text-sm font-medium text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: colors.primary }}
                      disabled={
                        newFeedback.rating === 0 || !newFeedback.comment.trim()
                      }
                    >
                      Submit Feedback
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
