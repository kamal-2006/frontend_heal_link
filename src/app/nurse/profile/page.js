"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export default function NurseProfile() {
  const router = useRouter();
  const [nurseData, setNurseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    department: '',
    shift: '',
    qualification: '',
    experience: '',
    specialization: ''
  });

  useEffect(() => {
    fetchNurseProfile();
  }, []);

  const fetchNurseProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/nurse/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch profile');

      const data = await response.json();
      setNurseData(data.data);
      setFormData({
        firstName: data.data.user?.firstName || '',
        lastName: data.data.user?.lastName || '',
        email: data.data.user?.email || '',
        phone: data.data.user?.phone || '',
        licenseNumber: data.data.licenseNumber || '',
        department: data.data.department || '',
        shift: data.data.shift || '',
        qualification: data.data.qualification || '',
        experience: data.data.experience || 0,
        specialization: data.data.specialization || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('token');
      const requestData = new FormData();
      
      Object.keys(formData).forEach(key => requestData.append(key, formData[key]));
      if (profileImage) requestData.append('profilePhoto', profileImage);

      const response = await fetch(`${API_BASE_URL}/nurse/profile`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: requestData
      });

      if (!response.ok) throw new Error('Failed to update profile');

      const data = await response.json();
      setNurseData(data.data);
      setIsEditing(false);
      setProfileImage(null);
      setImagePreview(null);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const getFileUrl = (path) => {
    if (!path) return null;
    const apiBase = API_BASE_URL.replace('/api/v1', '');
    return path.startsWith('/') ? `${apiBase}${path}` : `${apiBase}/${path}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Profile Picture */}
      <div className="bg-gradient-to-r from-blue-500 via-purple-400 to-pink-300 rounded-xl shadow-lg p-8 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            {/* Profile Picture */}
            <div className="relative w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center overflow-hidden ring-4 ring-white ring-opacity-50 shadow-lg">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : nurseData?.user?.profilePicture ? (
                <img 
                  src={getFileUrl(nurseData.user.profilePicture)} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="w-full h-full flex items-center justify-center text-2xl font-bold"
                style={{ display: (imagePreview || nurseData?.user?.profilePicture) ? 'none' : 'flex' }}
              >
                {nurseData?.user ? (
                  `${nurseData.user.firstName?.charAt(0) || ''}${nurseData.user.lastName?.charAt(0) || ''}`
                ) : (
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {nurseData?.user?.firstName || 'N/A'} {nurseData?.user?.lastName || ''}
              </h1>
              <p className="text-sm opacity-90">
                {nurseData?.department || 'General'} • {nurseData?.shift || 'Morning'} Shift
              </p>
              <p className="text-sm opacity-90">
                License: {nurseData?.licenseNumber || 'Not Provided'}
              </p>
            </div>
          </div>
          <div>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-md"
              >
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-md disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setProfileImage(null);
                    setImagePreview(null);
                    fetchNurseProfile();
                  }}
                  disabled={isSaving}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium shadow-md disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
        
        <form onSubmit={handleSave} className="space-y-6">
          {/* Profile Picture Upload */}
          {isEditing && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                disabled={!isEditing}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                disabled={!isEditing}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            {/* Professional Information */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.licenseNumber}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
              <select
                disabled={!isEditing}
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              >
                <option value="General">General</option>
                <option value="ICU">ICU</option>
                <option value="Emergency">Emergency</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Surgery">Surgery</option>
                <option value="Cardiology">Cardiology</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Shift</label>
              <select
                disabled={!isEditing}
                value={formData.shift}
                onChange={(e) => handleInputChange('shift', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              >
                <option value="Morning">Morning</option>
                <option value="Afternoon">Afternoon</option>
                <option value="Night">Night</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
              <input
                type="number"
                disabled={!isEditing}
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Qualification</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.qualification}
                onChange={(e) => handleInputChange('qualification', e.target.value)}
                placeholder="e.g., RN, BSN, MSN"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
              <input
                type="text"
                disabled={!isEditing}
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                placeholder="e.g., General Care, Critical Care, Pediatric Care"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>
        </form>

        {/* Statistics */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Assigned Patients</p>
              <p className="text-2xl font-bold text-blue-600">{nurseData?.assignedPatients?.length || 0}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Experience</p>
              <p className="text-2xl font-bold text-green-600">{formData.experience} years</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-2xl font-bold text-purple-600">{nurseData?.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
