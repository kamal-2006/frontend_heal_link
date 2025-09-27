'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FeedbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [newFeedback, setNewFeedback] = useState({
    appointmentId: appointmentId || '',
    rating: 0,
    type: 'Feedback',
    comment: '',
  });
  
  // Rating summary stats
  const [ratingStats, setRatingStats] = useState({
    total: 0,
    unread: 0,
    lowRating: 0,
    averageRating: 0,
    ratingCounts: [0, 0, 0, 0, 0], // Count of 1-5 star ratings
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
      console.log('Authentication check - Token:', token ? 'Found' : 'Not found', 'Role:', role);
      
      if (!token) {
        console.log('No authentication token found, redirecting to login');
        // Add a small delay to prevent flash of content
        setTimeout(() => router.push('/login'), 100);
        return;
      }
      
      if (role !== 'patient') {
        console.log('Invalid role for patient area:', role);
        alert('Access denied. Please login as a patient.');
        setTimeout(() => router.push('/login'), 100);
        return;
      }
      
      console.log('Authentication successful, loading feedback data');

      try {
        // In a real app, this would be an API call to fetch feedback data
        // For now, we'll simulate with mock data
        console.log('Fetching feedback data...');
        setTimeout(() => {
          const mockFeedbacks = [
            {
              _id: 'f1',
              appointmentId: 'a1',
              doctorName: 'Dr. John Smith',
              doctorSpecialization: 'Cardiology',
              rating: 5,
              type: 'Feedback',
              comment: 'Great experience! The doctor was very attentive and explained everything clearly.',
              date: '2023-10-15T10:30:00',
              status: 'read'
            },
            {
              _id: 'f2',
              appointmentId: 'a2',
              doctorName: 'Dr. Sarah Johnson',
              doctorSpecialization: 'Dermatology',
              rating: 4,
              type: 'Feedback',
              comment: 'Good consultation, but had to wait a bit longer than expected.',
              date: '2023-09-22T14:15:00',
              status: 'read'
            },
            {
              _id: 'f3',
              appointmentId: 'a3',
              doctorName: 'Dr. Michael Chen',
              doctorSpecialization: 'Neurology',
              rating: 2,
              type: 'Complaint',
              comment: 'The doctor seemed rushed and didn\'t address all my concerns.',
              date: '2023-08-05T09:45:00',
              status: 'unread'
            },
            {
              _id: 'f4',
              appointmentId: 'a4',
              doctorName: 'Dr. Emily Wilson',
              doctorSpecialization: 'Pediatrics',
              rating: 5,
              type: 'Feedback',
              comment: 'Excellent with my child! Very patient and thorough.',
              date: '2023-07-18T16:00:00',
              status: 'unread'
            },
            {
              _id: 'f5',
              appointmentId: 'a5',
              doctorName: 'Dr. Robert Lee',
              doctorSpecialization: 'Orthopedics',
              rating: 3,
              type: 'Feedback',
              comment: 'Treatment was effective but could improve on explaining the recovery process.',
              date: '2023-06-30T11:20:00',
              status: 'read'
            }
          ];

          setFeedbacks(mockFeedbacks);
          
          // Calculate rating statistics
          const total = mockFeedbacks.length;
          const unread = mockFeedbacks.filter(f => f.status === 'unread').length;
          const lowRating = mockFeedbacks.filter(f => f.rating <= 2).length;
          const ratingSum = mockFeedbacks.reduce((sum, f) => sum + f.rating, 0);
          const averageRating = total > 0 ? (ratingSum / total).toFixed(1) : 0;
          
          // Count ratings by star level (1-5)
          const ratingCounts = [0, 0, 0, 0, 0];
          mockFeedbacks.forEach(f => {
            if (f.rating >= 1 && f.rating <= 5) {
              ratingCounts[f.rating - 1]++;
            }
          });
          
          setRatingStats({
            total,
            unread,
            lowRating,
            averageRating,
            ratingCounts
          });
          
          console.log('Feedback data loaded successfully:', { total, unread, lowRating, averageRating });
          setIsLoading(false);
          
          // If appointmentId is provided, open the feedback form
          if (appointmentId) {
            console.log('Opening feedback form for appointment:', appointmentId);
            setShowFeedbackModal(true);
          }
        }, 1000);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
        setIsLoading(false);
        // Show user-friendly error message
        alert('Unable to load feedback data. Please check your connection and try again.');
      }
    };

    fetchData();
  }, [router, appointmentId]);

  const handleViewFeedback = (feedback) => {
    try {
      console.log('Viewing feedback:', feedback);
      setSelectedFeedback(feedback);
      setShowFeedbackModal(true);
    } catch (error) {
      console.error('Error viewing feedback:', error);
      alert('Error opening feedback details. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewFeedback({
      ...newFeedback,
      [name]: value
    });
  };

  const handleRatingChange = (rating) => {
    setNewFeedback({
      ...newFeedback,
      rating
    });
  };

  const handleTypeChange = (type) => {
    setNewFeedback({
      ...newFeedback,
      type
    });
  };

  const handleSubmitFeedback = (e) => {
    e.preventDefault();
    console.log('Submitting feedback:', newFeedback);
    
    try {
      // Validate form
      if (newFeedback.rating === 0 || !newFeedback.comment.trim()) {
        alert('Please provide both a rating and comment');
        return;
      }
    
    // In a real app, this would be an API call to submit feedback
    // For now, we'll just add it to our local state
    const newFeedbackItem = {
      _id: `new-${Date.now()}`,
      appointmentId: newFeedback.appointmentId,
      doctorName: 'Dr. New Feedback',
      doctorSpecialization: 'General',
      rating: newFeedback.rating,
      type: newFeedback.type,
      comment: newFeedback.comment,
      date: new Date().toISOString(),
      status: 'unread'
    };
    
    setFeedbacks([newFeedbackItem, ...feedbacks]);
    
    // Update stats with recalculated average
    const newTotal = ratingStats.total + 1;
    const newRatingCounts = ratingStats.ratingCounts.map((count, index) => 
      index === newFeedback.rating - 1 ? count + 1 : count
    );
    const totalRatingSum = newRatingCounts.reduce((sum, count, index) => sum + (count * (index + 1)), 0);
    const newAverageRating = newTotal > 0 ? (totalRatingSum / newTotal) : 0;
    
    setRatingStats({
      ...ratingStats,
      total: newTotal,
      unread: ratingStats.unread + 1,
      lowRating: newFeedback.rating <= 2 ? ratingStats.lowRating + 1 : ratingStats.lowRating,
      averageRating: newAverageRating,
      ratingCounts: newRatingCounts
    });
    
      // Reset form and close modal
      setNewFeedback({
        appointmentId: '',
        rating: 0,
        type: 'Feedback',
        comment: '',
      });
      setShowFeedbackModal(false);
      console.log('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  // Calculate the maximum count for scaling the rating bars
  const maxRatingCount = Math.max(...(ratingStats.ratingCounts || [0, 0, 0, 0, 0]), 1);

  // Show loading screen while authenticating
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-lg">Loading Feedback Page...</p>
        <p className="text-gray-400 text-sm mt-2">Verifying your authentication</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Feedback</h1>
        <button
          onClick={() => {
            setSelectedFeedback(null);
            setNewFeedback({
              appointmentId: '',
              rating: 0,
              type: 'Feedback',
              comment: '',
            });
            setShowFeedbackModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
        >
          Submit New Feedback
        </button>
      </div>

      {/* Rating Summary Section */}
      <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Rating Summary & Distribution
          </h2>
          <p className="text-sm text-gray-600 mt-1">Overview of all feedback and ratings received</p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600 text-sm">Loading feedback data...</p>
            <p className="text-gray-400 text-xs mt-1">Please wait while we fetch your feedback history</p>
          </div>
        ) : (
          <div className="p-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Average Rating */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-blue-700">
                      {typeof ratingStats.averageRating === 'number' 
                        ? ratingStats.averageRating.toFixed(1) 
                        : '0.0'}
                    </div>
                    <div className="text-sm font-medium text-blue-600">Average Rating</div>
                  </div>
                  <div className="bg-blue-600 rounded-full p-2">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <div className="flex mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(ratingStats.averageRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              {/* Total Feedback */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-5 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-green-700">{ratingStats.total}</div>
                    <div className="text-sm font-medium text-green-600">Total Reviews</div>
                  </div>
                  <div className="bg-green-600 rounded-full p-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
                <div className="text-xs text-green-600 mt-1">All-time feedback</div>
              </div>
              
              {/* Unread Feedback */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-amber-700">{ratingStats.unread}</div>
                    <div className="text-sm font-medium text-amber-600">Unread</div>
                  </div>
                  <div className="bg-amber-600 rounded-full p-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-xs text-amber-600 mt-1">Needs attention</div>
              </div>
              
              {/* Low Rating Count */}
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-red-700">{ratingStats.lowRating}</div>
                    <div className="text-sm font-medium text-red-600">Low Ratings</div>
                  </div>
                  <div className="bg-red-600 rounded-full p-2">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                </div>
                <div className="text-xs text-red-600 mt-1">≤2 stars rated</div>
              </div>
            </div>

            {/* Rating Distribution Chart */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Rating Distribution
                </h3>
                <div className="text-sm text-gray-500">
                  {ratingStats.total} total reviews
                </div>
              </div>
              
              <div className="space-y-4">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = ratingStats.ratingCounts[rating - 1];
                  const percentage = ratingStats.total > 0 ? ((count / ratingStats.total) * 100).toFixed(1) : 0;
                  const barWidth = maxRatingCount > 0 ? (count / maxRatingCount) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center group hover:bg-white hover:shadow-sm rounded-lg p-2 transition-all duration-200">
                      <div className="flex items-center w-20">
                        <span className="text-sm font-medium text-gray-700 mr-2">{rating}</span>
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      
                      <div className="flex-1 mx-4">
                        <div className="h-6 bg-gray-200 rounded-full overflow-hidden relative">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ease-out ${
                              rating === 5 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                              rating === 4 ? 'bg-gradient-to-r from-blue-400 to-blue-500' :
                              rating === 3 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                              rating === 2 ? 'bg-gradient-to-r from-orange-400 to-orange-500' :
                              'bg-gradient-to-r from-red-400 to-red-500'
                            }`}
                            style={{ width: `${barWidth}%` }}
                          >
                            <div className="absolute inset-0 bg-white bg-opacity-20"></div>
                          </div>
                          {barWidth > 15 && (
                            <div className="absolute inset-0 flex items-center pl-3">
                              <span className="text-xs font-medium text-white drop-shadow-sm">
                                {count}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="w-16 text-right">
                        <div className="text-sm font-semibold text-gray-700">{count}</div>
                        <div className="text-xs text-gray-500">({percentage}%)</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {ratingStats.total === 0 && (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-500 text-sm">No feedback received yet</p>
                  <p className="text-gray-400 text-xs mt-1">Start collecting reviews from your patients</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Feedback History Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <h2 className="text-lg font-medium text-gray-900 p-6 border-b border-gray-200">Feedback History</h2>
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : feedbacks && feedbacks.length > 0 ? (
              feedbacks.map((feedback) => (
                <tr key={feedback._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {feedback.doctorName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {feedback.doctorSpecialization}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-5 w-5 ${
                            star <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      feedback.type === 'Complaint' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {feedback.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(feedback.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      feedback.status === 'unread' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {feedback.status.charAt(0).toUpperCase() + feedback.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewFeedback(feedback)}
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
                  No feedback found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedFeedback ? 'Feedback Details' : 'Submit New Feedback'}
                </h3>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              {selectedFeedback ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Doctor</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedFeedback.doctorName}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Type</h4>
                    <span className={`mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedFeedback.type === 'Complaint' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {selectedFeedback.type}
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Rating</h4>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`h-5 w-5 ${
                            star <= selectedFeedback.rating ? 'text-yellow-400' : 'text-gray-300'
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
                    <h4 className="text-sm font-medium text-gray-500">Date</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedFeedback.date).toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Feedback</h4>
                    <p className="mt-1 text-sm text-gray-900">{selectedFeedback.comment}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  {/* Rating Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Rating
                    </label>
                    <div className="flex mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          className="focus:outline-none"
                        >
                          <svg
                            className={`h-8 w-8 ${
                              star <= newFeedback.rating ? 'text-yellow-400' : 'text-gray-300'
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
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <div className="mt-1 flex space-x-4">
                      <div className="flex items-center">
                        <input
                          id="feedback-type"
                          name="type"
                          type="radio"
                          checked={newFeedback.type === 'Feedback'}
                          onChange={() => handleTypeChange('Feedback')}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="feedback-type" className="ml-2 block text-sm text-gray-700">
                          Feedback
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="complaint-type"
                          name="type"
                          type="radio"
                          checked={newFeedback.type === 'Complaint'}
                          onChange={() => handleTypeChange('Complaint')}
                          className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <label htmlFor="complaint-type" className="ml-2 block text-sm text-gray-700">
                          Complaint
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Comment */}
                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
                      Your Feedback
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      rows="4"
                      value={newFeedback.comment}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Please share your experience..."
                    ></textarea>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowFeedbackModal(false)}
                      className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                      disabled={newFeedback.rating === 0 || !newFeedback.comment.trim()}
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