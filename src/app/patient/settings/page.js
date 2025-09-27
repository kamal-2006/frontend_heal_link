'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toTitleCase } from '../../../utils/text';

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Enhanced Profile form state with medical information
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    bloodType: '',
    height: '',
    weight: '',
    allergies: '',
    medicalConditions: '',
    currentMedications: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Notification preferences state
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    medicationReminders: true,
    reportNotifications: true,
    marketingEmails: false,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Load basic info from localStorage
        const firstName = localStorage.getItem('firstName') || '';
        const lastName = localStorage.getItem('lastName') || '';
        const email = localStorage.getItem('email') || '';
        
        // Set initial profile data (in real app, this would come from API)
        setProfileForm({
          firstName,
          lastName,
          email,
          phone: '(555) 123-4567',
          dateOfBirth: '1990-01-15',
          gender: 'Male',
          address: '123 Main Street',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62704',
          emergencyContactName: 'Jane Doe',
          emergencyContactPhone: '(555) 987-6543',
          bloodType: 'O+',
          height: '5\'10"',
          weight: '170 lbs',
          allergies: 'Penicillin',
          medicalConditions: 'None',
          currentMedications: 'Vitamin D',
          insuranceProvider: 'Health Plus',
          insurancePolicyNumber: 'HP12345678',
        });
        // In a real app, this would be an API call to fetch user data
        // For now, we'll simulate with mock data
        setTimeout(() => {
          const mockUserData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '(555) 123-4567',
            address: '123 Main Street',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345',
            notificationPreferences: {
              emailNotifications: true,
              smsNotifications: true,
              appointmentReminders: true,
              medicationReminders: true,
              reportNotifications: true,
              marketingEmails: false,
            }
          };

          setProfileForm({
            firstName: mockUserData.firstName,
            lastName: mockUserData.lastName,
            email: mockUserData.email,
            phone: mockUserData.phone,
            address: mockUserData.address,
            city: mockUserData.city,
            state: mockUserData.state,
            zipCode: mockUserData.zipCode,
          });
          
          setNotificationPrefs(mockUserData.notificationPreferences);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationPrefs({
      ...notificationPrefs,
      [name]: checked
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call to update profile
    // For now, we'll just simulate success
    setTimeout(() => {
      setSuccessMessage('Profile updated successfully!');
      setShowSuccessAlert(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    }, 500);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate password
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    
    // In a real app, this would be an API call to update password
    // For now, we'll just simulate success
    setTimeout(() => {
      setSuccessMessage('Password changed successfully!');
      setShowSuccessAlert(true);
      
      // Reset password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    }, 500);
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call to update notification preferences
    // For now, we'll just simulate success
    setTimeout(() => {
      setSuccessMessage('Notification preferences updated!');
      setShowSuccessAlert(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
        <p className="text-sm text-gray-500">Manage your profile information, medical data, and account settings</p>
      </div>
      
      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          {[
            { id: 'profile', name: 'Profile & Medical' },
            { id: 'password', name: 'Security' },
            { id: 'notifications', name: 'Notifications' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Profile Settings */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={profileForm.firstName}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={profileForm.lastName}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={profileForm.address}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={profileForm.city}
                        onChange={handleProfileChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={profileForm.state}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={profileForm.zipCode}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical Information Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Medical Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          id="dateOfBirth"
                          name="dateOfBirth"
                          value={profileForm.dateOfBirth}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>
                      <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={profileForm.gender}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                          Blood Type
                        </label>
                        <select
                          id="bloodType"
                          name="bloodType"
                          value={profileForm.bloodType}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
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
                        </select>
                      </div>
                      <div>
                        <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                          Height
                        </label>
                        <input
                          type="text"
                          id="height"
                          name="height"
                          value={profileForm.height}
                          onChange={handleProfileChange}
                          placeholder="e.g., 5'10&quot; or 178 cm"
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>
                      <div>
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                          Weight
                        </label>
                        <input
                          type="text"
                          id="weight"
                          name="weight"
                          value={profileForm.weight}
                          onChange={handleProfileChange}
                          placeholder="e.g., 170 lbs or 77 kg"
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>
                      <div>
                        <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                          Allergies
                        </label>
                        <input
                          type="text"
                          id="allergies"
                          name="allergies"
                          value={profileForm.allergies}
                          onChange={handleProfileChange}
                          placeholder="List any known allergies"
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="medicalConditions" className="block text-sm font-medium text-gray-700">
                          Medical Conditions
                        </label>
                        <textarea
                          id="medicalConditions"
                          name="medicalConditions"
                          value={profileForm.medicalConditions}
                          onChange={handleProfileChange}
                          rows={3}
                          placeholder="List any medical conditions or chronic illnesses"
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700">
                          Current Medications
                        </label>
                        <textarea
                          id="currentMedications"
                          name="currentMedications"
                          value={profileForm.currentMedications}
                          onChange={handleProfileChange}
                          rows={3}
                          placeholder="List current medications and dosages"
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Emergency Contact
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700">
                          Contact Name
                        </label>
                        <input
                          type="text"
                          id="emergencyContactName"
                          name="emergencyContactName"
                          value={profileForm.emergencyContactName}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>
                      <div>
                        <label htmlFor="emergencyContactPhone" className="block text-sm font-medium text-gray-700">
                          Contact Phone
                        </label>
                        <input
                          type="tel"
                          id="emergencyContactPhone"
                          name="emergencyContactPhone"
                          value={profileForm.emergencyContactPhone}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Insurance Information Section */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      Insurance Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="insuranceProvider" className="block text-sm font-medium text-gray-700">
                          Insurance Provider
                        </label>
                        <input
                          type="text"
                          id="insuranceProvider"
                          name="insuranceProvider"
                          value={profileForm.insuranceProvider}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>
                      <div>
                        <label htmlFor="insurancePolicyNumber" className="block text-sm font-medium text-gray-700">
                          Policy Number
                        </label>
                        <input
                          type="text"
                          id="insurancePolicyNumber"
                          name="insurancePolicyNumber"
                          value={profileForm.insurancePolicyNumber}
                          onChange={handleProfileChange}
                          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}

              {/* Password Settings */}
              {activeTab === 'password' && (
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                        minLength="8"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Password must be at least 8 characters long
                      </p>
                    </div>
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                      Change Password
                    </button>
                  </div>
                </form>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="emailNotifications"
                          checked={notificationPrefs.emailNotifications}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="border-t border-gray-200 pt-4"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications via text message</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="smsNotifications"
                          checked={notificationPrefs.smsNotifications}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="border-t border-gray-200 pt-4"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Appointment Reminders</h3>
                        <p className="text-sm text-gray-500">Receive reminders about upcoming appointments</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="appointmentReminders"
                          checked={notificationPrefs.appointmentReminders}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="border-t border-gray-200 pt-4"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Medication Reminders</h3>
                        <p className="text-sm text-gray-500">Receive reminders about medication schedules and refills</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="medicationReminders"
                          checked={notificationPrefs.medicationReminders}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="border-t border-gray-200 pt-4"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Report Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications when new reports are available</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="reportNotifications"
                          checked={notificationPrefs.reportNotifications}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="border-t border-gray-200 pt-4"></div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Marketing Emails</h3>
                        <p className="text-sm text-gray-500">Receive promotional emails and newsletters</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="marketingEmails"
                          checked={notificationPrefs.marketingEmails}
                          onChange={handleNotificationChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                    >
                      Save Preferences
                    </button>
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}