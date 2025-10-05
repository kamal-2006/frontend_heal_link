"use client";

import { useState, useEffect } from "react";
import { toTitleCase } from "../../../../utils/text";
import api from "@/utils/api";

export default function DoctorProfilePage() {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    async function fetchDoctorProfile() {
      setLoading(true);
      setMessage({ type: "", text: "" });
      try {
        // Defensive: handle HTML error responses (e.g., 404/500 pages)
        let res;
        if (api.get) {
          res = await api.get("/doctor/me");
        } else {
          res = await api("/doctor/me");
        }
        // If response is a string and starts with '<', it's HTML, not JSON
        if (typeof res === "string" && res.trim().startsWith("<")) {
          throw new Error(
            "API returned HTML instead of JSON. Check endpoint and authentication."
          );
        }
        // If using fetch, check for .ok and parse JSON safely
        if (res && res.ok !== undefined) {
          const contentType = res.headers.get("content-type");
          if (!contentType || !contentType.includes("application/json")) {
            throw new Error(
              "API did not return JSON. Check endpoint and authentication."
            );
          }
          const data = await res.json();
          if (!data || !data.data) throw new Error("Doctor profile not found.");
          setDoctor(data.data);
          setFormData({
            firstName: data.data.user?.firstName || "",
            lastName: data.data.user?.lastName || "",
            email: data.data.user?.email || "",
            phone: data.data.user?.phone || "",
            specialization: data.data.specialization || "",
            experience: data.data.experience || "",
            qualification: data.data.qualification || "",
            about: data.data.about || "",
            consultationFee: data.data.consultationFee || "",
            hospital: data.data.hospital?.name || "",
            hospitalAddress: data.data.hospital?.address || "",
            hospitalPhone: data.data.hospital?.phone || "",
          });
        } else if (res && res.data) {
          // If using a custom API util that returns {data}
          setDoctor(res.data);
          setFormData({
            firstName: res.data.user?.firstName || "",
            lastName: res.data.user?.lastName || "",
            email: res.data.user?.email || "",
            phone: res.data.user?.phone || "",
            specialization: res.data.specialization || "",
            experience: res.data.experience || "",
            qualification: res.data.qualification || "",
            about: res.data.about || "",
            consultationFee: res.data.consultationFee || "",
            hospital: res.data.hospital?.name || "",
            hospitalAddress: res.data.hospital?.address || "",
            hospitalPhone: res.data.hospital?.phone || "",
          });
        } else {
          throw new Error("Doctor profile not found.");
        }
      } catch (err) {
        setMessage({
          type: "error",
          text: err.message || "Failed to load profile.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchDoctorProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });
    try {
      // Only send doctor fields for update (not user fields)
      const updated = await (api.put
        ? api.put(`/doctor/me`, {
            specialization: formData.specialization,
            experience: formData.experience,
            qualification: formData.qualification,
            about: formData.about,
            consultationFee: formData.consultationFee,
            hospital: {
              name: formData.hospital,
              address: formData.hospitalAddress,
              phone: formData.hospitalPhone,
            },
          })
        : api("PUT", `/doctor/me`, {
            specialization: formData.specialization,
            experience: formData.experience,
            qualification: formData.qualification,
            about: formData.about,
            consultationFee: formData.consultationFee,
            hospital: {
              name: formData.hospital,
              address: formData.hospitalAddress,
              phone: formData.hospitalPhone,
            },
          }));
      setDoctor({ ...doctor, ...updated.data });
      setIsEditMode(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update profile.",
      });
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
          <p className="text-sm font-medium text-blue-600">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-red-600 font-semibold">
            Unable to load doctor profile.
          </p>
          {message.text && <p className="mt-2 text-gray-700">{message.text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 mb-1">
              My Profile
            </h1>
            <p className="text-gray-600 text-sm">
              Manage your professional information
            </p>
          </div>
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

        {message.text && (
          <div
            className={`mb-4 p-3 rounded border-l-4 ${
              message.type === "success"
                ? "bg-green-50 border-green-500 text-green-800"
                : "bg-red-50 border-red-500 text-red-800"
            }`}
          >
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded border border-gray-200">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
                {toTitleCase(formData.firstName?.[0])}
                {toTitleCase(formData.lastName?.[0])}
              </div>
              <div className="ml-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Dr. {toTitleCase(formData.firstName)}{" "}
                  {toTitleCase(formData.lastName)}
                </h2>
                <p className="text-gray-600">{formData.email}</p>
                <p className="text-gray-500">{formData.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., Cardiology"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience (years)
                </label>
                <input
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Years of experience"
                  min="0"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., MBBS, MD"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Fee
                </label>
                <input
                  type="number"
                  name="consultationFee"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., 200"
                  min="0"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  rows={3}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Hospital Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Name
                </label>
                <input
                  type="text"
                  name="hospital"
                  value={formData.hospital}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., City General Hospital"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Phone
                </label>
                <input
                  type="text"
                  name="hospitalPhone"
                  value={formData.hospitalPhone}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., +1234567890"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hospital Address
                </label>
                <input
                  type="text"
                  name="hospitalAddress"
                  value={formData.hospitalAddress}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="e.g., 123 Main St, City, State"
                />
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
