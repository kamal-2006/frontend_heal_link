"use client";

import { useState, useEffect } from "react";

export default function PatientProfilePage() {
  // State for profile data and form
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState({ type: "", text: "" });

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      // In a real app, this would be an API call
      setTimeout(() => {
        const profileData = {
          id: 1001,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "(555) 123-4567",
          dateOfBirth: "1985-06-15",
          gender: "Male",
          address: "123 Main Street",
          city: "Springfield",
          state: "IL",
          zipCode: "62704",
          emergencyContact: "Jane Doe",
          emergencyPhone: "(555) 987-6543",
          medicalConditions: "None",
          allergies: "Penicillin",
          currentMedications: "Vitamin D",
          insuranceProvider: "Health Plus",
          insurancePolicyNumber: "HP12345678",
          bloodType: "O+",
          height: "5'10\"",
          weight: "170 lbs"
        };
        
        setProfile(profileData);
        setFormData(profileData);
        setLoading(false);
      }, 1000);
    };

    fetchProfile();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // In a real app, this would be an API call to update the profile
    setTimeout(() => {
      setProfile(formData);
      setIsEditing(false);
      setLoading(false);
      
      setMessage({
        type: "success",
        text: "Profile updated successfully."
      });
      
      // Clear the message after 5 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
    }, 1000);
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit Profile
          </button>
        )}
      </div>

      {message.text && (
        <div className={`p-4 rounded-md ${
          message.type === "success" ? "bg-green-50 text-green-800" : 
          message.type === "info" ? "bg-blue-50 text-blue-800" : 
          "bg-red-50 text-red-800"
        }`}>
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information Section */}
                <div className="col-span-2">
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h2>
                </div>
                
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    id="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    id="dateOfBirth"
                    value={formData.dateOfBirth || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                  <select
                    name="gender"
                    id="gender"
                    value={formData.gender || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                
                {/* Address Section */}
                <div className="col-span-2">
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-4">Address</h2>
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    id="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">ZIP Code</label>
                  <input
                    type="text"
                    name="zipCode"
                    id="zipCode"
                    value={formData.zipCode || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {/* Medical Information Section */}
                <div className="col-span-2">
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-4">Medical Information</h2>
                </div>
                
                <div>
                  <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">Blood Type</label>
                  <select
                    name="bloodType"
                    id="bloodType"
                    value={formData.bloodType || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">Allergies</label>
                  <input
                    type="text"
                    name="allergies"
                    id="allergies"
                    value={formData.allergies || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter allergies or 'None'"
                  />
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700">Medical Conditions</label>
                  <textarea
                    name="medicalConditions"
                    id="medicalConditions"
                    rows="3"
                    value={formData.medicalConditions || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter any medical conditions or 'None'"
                  ></textarea>
                </div>
                
                <div className="col-span-2">
                  <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700">Current Medications</label>
                  <textarea
                    name="currentMedications"
                    id="currentMedications"
                    rows="3"
                    value={formData.currentMedications || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter current medications or 'None'"
                  ></textarea>
                </div>
                
                {/* Emergency Contact Section */}
                <div className="col-span-2">
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-4">Emergency Contact</h2>
                </div>
                
                <div>
                  <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
                  <input
                    type="text"
                    name="emergencyContact"
                    id="emergencyContact"
                    value={formData.emergencyContact || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
                  <input
                    type="text"
                    name="emergencyPhone"
                    id="emergencyPhone"
                    value={formData.emergencyPhone || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                {/* Insurance Information Section */}
                <div className="col-span-2">
                  <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-4">Insurance Information</h2>
                </div>
                
                <div>
                  <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700">Insurance Provider</label>
                  <input
                    type="text"
                    name="insuranceProvider"
                    id="insuranceProvider"
                    value={formData.insuranceProvider || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label htmlFor="insurancePolicyNumber" className="block text-sm font-medium text-gray-700">Policy Number</label>
                  <input
                    type="text"
                    name="insurancePolicyNumber"
                    id="insurancePolicyNumber"
                    value={formData.insurancePolicyNumber || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="p-6 space-y-6">
              {/* Personal Information Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 mt-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.firstName} {profile.lastName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Date of Birth</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.dateOfBirth}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Gender</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.gender}</dd>
                  </div>
                </dl>
              </div>
              
              {/* Address Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-6">Address</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 mt-4">
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Street Address</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.address}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">City</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.city}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">State</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.state}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ZIP Code</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.zipCode}</dd>
                  </div>
                </dl>
              </div>
              
              {/* Medical Information Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-6">Medical Information</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 mt-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Blood Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.bloodType}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Height</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.height}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Weight</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.weight}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Allergies</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.allergies || 'None'}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Medical Conditions</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.medicalConditions || 'None'}</dd>
                  </div>
                  <div className="col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Current Medications</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.currentMedications || 'None'}</dd>
                  </div>
                </dl>
              </div>
              
              {/* Emergency Contact Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-6">Emergency Contact</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 mt-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.emergencyContact}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.emergencyPhone}</dd>
                  </div>
                </dl>
              </div>
              
              {/* Insurance Information Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mt-6">Insurance Information</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 mt-4">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Provider</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.insuranceProvider}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Policy Number</dt>
                    <dd className="mt-1 text-sm text-gray-900">{profile.insurancePolicyNumber}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}