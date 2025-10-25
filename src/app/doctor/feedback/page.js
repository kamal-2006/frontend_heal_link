"use client";

import { useState, useEffect } from "react";
import { get, put } from "@/utils/api";

export default function DoctorFeedback() {
  const [feedback, setFeedback] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  // Simulate fetching feedback data
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const { data } = await get("/feedback/doctor/me");
        setFeedback(data || []);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeedback();
  }, []);

  const filteredFeedback = feedback.filter(item => {
    if (filter === "all") return true;
    if (filter === "unread") return !item.read;
    if (filter === "5star") return item.rating === 5;
    if (filter === "lowRated") return item.rating < 4;
    return true;
  });

  const handleViewFeedback = async (feedbackItem) => { // Added async
    setSelectedFeedback(feedbackItem);
    setIsModalOpen(true);
    
    // Mark as read when viewed
    if (!feedbackItem.read) {
      try {
        await put(`/feedback/${feedbackItem._id}/read`, { read: true });
        setFeedback(feedback.map(item => 
          item._id === feedbackItem._id ? { ...item, read: true } : item
        ));
      } catch (error) {
        console.error("Error marking feedback as read:", error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const getAverageRating = () => {
    if (feedback.length === 0) return 0;
    const sum = feedback.reduce((acc, item) => acc + item.rating, 0);
    return (sum / feedback.length).toFixed(1);
  };

  const getRatingCounts = () => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    feedback.forEach(item => {
      counts[item.rating] += 1;
    });
    return counts;
  };

  const ratingCounts = getRatingCounts();
  const totalFeedback = feedback.length;

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <svg 
        key={index}
        className={`h-5 w-5 ${index < rating ? "text-yellow-400" : "text-gray-300"}`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
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
        <h1 className="text-2xl font-bold text-gray-900">Patient Feedback</h1>
      </div>

      {/* Feedback Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rating Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Rating Summary</h2>
          <div className="flex items-center mb-6">
            <div className="text-4xl font-bold text-gray-900 mr-4">{getAverageRating()}</div>
            <div className="flex">
              {renderStars(Math.round(getAverageRating()))}
            </div>
            <div className="text-sm text-gray-500 ml-4">({totalFeedback} reviews)</div>
          </div>
          
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map(rating => (
              <div key={rating} className="flex items-center">
                <div className="w-12 text-sm text-gray-600">{rating} stars</div>
                <div className="flex-1 mx-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${totalFeedback ? (ratingCounts[rating] / totalFeedback) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-8 text-sm text-gray-600 text-right">{ratingCounts[rating]}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Feedback Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Feedback Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{feedback.length}</div>
              <div className="text-sm text-gray-600">Total Feedback</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{feedback.filter(item => item.rating === 5).length}</div>
              <div className="text-sm text-gray-600">5-Star Reviews</div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{feedback.filter(item => !item.read).length}</div>
              <div className="text-sm text-gray-600">Unread Feedback</div>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="text-3xl font-bold text-red-600">{feedback.filter(item => item.rating < 4).length}</div>
              <div className="text-sm text-gray-600">Low Ratings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Recent Feedback</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => setFilter("all")} 
              className={`px-3 py-1 text-sm rounded-md ${filter === "all" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("unread")} 
              className={`px-3 py-1 text-sm rounded-md ${filter === "unread" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Unread
            </button>
            <button 
              onClick={() => setFilter("5star")} 
              className={`px-3 py-1 text-sm rounded-md ${filter === "5star" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              5 Star
            </button>
            <button 
              onClick={() => setFilter("lowRated")} 
              className={`px-3 py-1 text-sm rounded-md ${filter === "lowRated" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Low Rated
            </button>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredFeedback.length > 0 ? (
            filteredFeedback.map((item) => (
              <div 
                key={item._id} 
                className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer ${!item.read ? "bg-blue-50" : ""}`}
                onClick={() => handleViewFeedback(item)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center">
                        <h4 className="text-sm font-medium text-gray-900">{formatDate(item.createdAt)}</h4>
                        {!item.read && (
                          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">New</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {renderStars(item.rating)}
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-2">{item.comment}</p>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">
              No feedback found
            </div>
          )}
        </div>
      </div>

      {/* Feedback Detail Modal */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Feedback Details</h3>
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col items-start">
                  <div className="flex mb-1">
                    {renderStars(selectedFeedback.rating)}
                  </div>
                  <p className="text-sm text-gray-500">{formatDate(selectedFeedback.createdAt)}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Feedback</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900">{selectedFeedback.comment}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 flex justify-end">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-150"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}