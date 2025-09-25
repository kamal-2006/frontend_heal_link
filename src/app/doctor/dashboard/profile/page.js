"use client";

import { useState, useEffect } from "react";
import { toTitleCase } from "../../../../utils/text";

export default function DoctorProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    specialty: "",
    department: "",
    experience: 0,
    qualifications: [],
    languages: [],
    licenseNumber: "",
    consultationHours: "",
    availabilityStatus: "on-duty",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [usingMockData, setUsingMockData] = useState(false);

  // Mock data for fallback
  const knownDoctor = {
    firstName: "Alex",
    lastName: "Johnson",
    bio: "Experienced cardiologist with 10+ years in interventional cardiology.",
    specialty: "Cardiology",
    department: "Cardiac Sciences",
    experience: 12,
    qualifications: ["MD", "DM (Cardiology)"],
    languages: ["English", "Spanish"],
    licenseNumber: "MD-CA-78910",
    consultationHours: "Mon-Fri 9AM-12PM",
    availabilityStatus: "on-duty",
  };

  
  // Fetch doctor profile from backend
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          loadKnownData("No authentication token found");
          return;
        }

        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

        try {
          // Fetch doctor profile
          const res = await fetch(`${baseUrl}/api/v1/doctor/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
            credentials: "include",
          });

          if (!res.ok) {
            // Try fallback endpoint if primary fails
            const fallbackRes = await fetch(`${baseUrl}/api/v1/users/me`, {
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
              credentials: "include",
            });

            if (!fallbackRes.ok) {
              throw new Error(
                `Both endpoints failed. Primary: ${res.status}, Fallback: ${fallbackRes.status}`
              );
            }

            const fallbackData = await fallbackRes.json();
            if (!fallbackData || !fallbackData.data) {
              throw new Error("Invalid response structure from fallback API");
            }

            setUser(fallbackData.data);
            setFormData({
              firstName: fallbackData.data.firstName || "",
              lastName: fallbackData.data.lastName || "",
              bio: fallbackData.data.bio || "",
              specialty: fallbackData.data.specialty || "",
              department: fallbackData.data.department || "",
              experience: fallbackData.data.experience || 0,
              qualifications: fallbackData.data.qualifications || [],
              languages: fallbackData.data.languages || [],
              licenseNumber: fallbackData.data.licenseNumber || "",
              consultationHours: fallbackData.data.consultationHours || "",
              availabilityStatus:
                fallbackData.data.availabilityStatus || "on-duty",
            });
            setUsingMockData(false);
            setMessage({
              type: "success",
              text: "Profile loaded successfully!",
            });
            return;
          }

          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Non-JSON response: ${contentType}`);
          }

          const data = await res.json();

          if (data && data.data) {
            setUser(data.data);
            setFormData({
              firstName: data.data.firstName || "",
              lastName: data.data.lastName || "",
              bio: data.data.bio || "",
              specialty: data.data.specialty || "",
              department: data.data.department || "",
              experience: data.data.experience || 0,
              qualifications: data.data.qualifications || [],
              languages: data.data.languages || [],
              licenseNumber: data.data.licenseNumber || "",
              consultationHours: data.data.consultationHours || "",
              availabilityStatus: data.data.availabilityStatus || "on-duty",
            });
            setUsingMockData(false);
            setMessage({
              type: "success",
              text: "Profile loaded successfully!",
            });
          } else {
            throw new Error("Invalid response structure from API");
          }
        } catch (error) {
          loadKnownData(`API error: ${error.message}`);
        }
      } catch (err) {
        console.error("General error:", err);
        loadKnownData(`General error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    function loadKnownData(errorMessage) {
      setUser(knownDoctor);
      setFormData(knownDoctor);
      setUsingMockData(true);
      setMessage({
        type: "warning",
        text:
          "Using locally stored data. Backend connection error: " +
          errorMessage,
      });
      setLoading(false);
    }

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    // If using mock data, just simulate a successful update
    if (usingMockData) {
      setTimeout(() => {
        setUser(formData);
        setIsEditMode(false);
        setMessage({
          type: "success",
          text: "Profile updated successfully! (Local mode - changes not saved to database)",
        });
        setIsSubmitting(false);
      }, 800);
      return;
    }

    // Real API update if not using mock data
    try {
      const token = localStorage.getItem("token");
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

      const res = await fetch(`${baseUrl}/api/v1/doctor/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Backend did not return JSON response");
      }

      const data = await res.json();
      if (data.data) {
        setUser(data.data);
        setIsEditMode(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        throw new Error(data.error || "Failed to update profile.");
      }
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-200"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border border-blue-300 opacity-20"></div>
          </div>
          <p className="text-sm font-medium text-blue-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800 mb-1">My Profile</h1>
              <p className="text-gray-600 text-sm">Manage your professional information</p>
            </div>
            <div className="flex items-center space-x-3">
              {usingMockData && (
                <div className="px-3 py-2 bg-amber-50 border border-amber-200 rounded text-amber-700 text-xs font-medium">
                  Local Data Mode
                </div>
              )}
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`px-4 py-2 text-sm font-medium rounded ${
                  isEditMode 
                    ? "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isEditMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>
          
          {/* Status Message */}
          {message.text && (
            <div className={`mt-4 p-3 rounded border-l-4 ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-500 text-green-800'
                : message.type === 'warning'
                ? 'bg-amber-50 border-amber-500 text-amber-800'
                : 'bg-blue-50 border-blue-500 text-blue-800'
            }`}>
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}
        </div>

      

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white p-6 rounded border border-gray-200 text-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 mx-auto flex items-center justify-center mb-4">
                <span className="text-2xl font-semibold text-blue-600">
                  {toTitleCase(formData.firstName?.[0])}
                  {toTitleCase(formData.lastName?.[0])}
                </span>
              </div>
              {isEditMode ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="First Name"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    placeholder="Last Name"
                  />
                </div>
              ) : (
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Dr. {toTitleCase(formData.firstName)}{" "}
                  {toTitleCase(formData.lastName)}
                </h2>
              )}
              <p className="text-gray-600 text-base mb-1">{formData.specialty}</p>
              <p className="text-sm text-gray-500">{formData.department}</p>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm text-gray-800">{user?.email || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="text-sm text-gray-800">{user?.phone || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="text-sm text-gray-800">{user?.location || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Availability Status</h3>
              {isEditMode ? (
                <select
                  name="availabilityStatus"
                  value={formData.availabilityStatus}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="on-duty">On-duty</option>
                  <option value="off-duty">Off-duty</option>
                </select>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    formData.availabilityStatus === "on-duty" ? "bg-green-600" : "bg-gray-500"
                  }`}></div>
                  <span className="text-sm font-medium text-gray-800">
                    {toTitleCase(formData.availabilityStatus)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isEditMode 
                        ? 'border-gray-300 bg-white' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditMode}
                    className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isEditMode 
                        ? 'border-gray-300 bg-white' 
                        : 'border-gray-200 bg-gray-50 cursor-not-allowed'
                    }`}
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">About</h3>
              {isEditMode ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <div className="text-gray-700 leading-relaxed text-sm bg-gray-50 p-3 rounded border border-gray-200">
                  {formData.bio || "No information available"}
                </div>
              )}
            </div>

            {/* Professional Details */}
            <div className="bg-white p-6 rounded border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Professional Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Cardiology"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">
                      {formData.specialty}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Cardiology Department"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">
                      {formData.department}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience
                  </label>
                  {isEditMode ? (
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Years of experience"
                      min="0"
                      max="50"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">
                      {formData.experience} years
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Medical license number"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">
                      {formData.licenseNumber}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages?.join(", ")}
                      onChange={(e) =>
                        setFormData((p) => ({
                          ...p,
                          languages: e.target.value
                            .split(",")
                            .map((l) => l.trim()),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., English, Spanish, French"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">
                      {formData.languages?.join(", ")}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consultation Hours
                  </label>
                  {isEditMode ? (
                    <input
                      type="text"
                      name="consultationHours"
                      value={formData.consultationHours}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., Mon-Fri 9AM-5PM"
                    />
                  ) : (
                    <div className="text-gray-800 font-medium">
                      {formData.consultationHours}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEditMode && (
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 text-sm font-medium text-white rounded ${
                isSubmitting 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
        </form>
      </div>
    </div>
  );
}