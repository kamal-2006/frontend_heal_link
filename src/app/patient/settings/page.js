'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import usePatient from '../../../hooks/usePatient';
import { authApi } from '../../../utils/api';

export default function SettingsPage() {
  const router = useRouter();
  const { patient, loading, updateProfile } = usePatient();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [twoFAStep, setTwoFAStep] = useState('setup'); // 'setup', 'verify', 'disable'
  
  // Form state with all patient fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodType: '',
    height: '',
    weight: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
    emergencyContactEmail: '',
    allergies: '',
    medicalConditions: '',
    medications: '',
    insuranceProvider: '',
    insurancePolicyNumber: '',
    insuranceGroupNumber: '',
    maritalStatus: '',
    occupation: '',
    preferredLanguage: '',
    smokingStatus: '',
    alcoholUse: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  // Update form data when patient data is loaded
  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.user?.firstName || '',
        lastName: patient.user?.lastName || '',
        email: patient.user?.email || '',
        phone: patient.user?.phone || '',
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
        gender: patient.gender || '',
        bloodType: patient.bloodType || '',
        height: patient.height?.value ? `${patient.height.value} ${patient.height.unit}` : '',
        weight: patient.weight?.value ? `${patient.weight.value} ${patient.weight.unit}` : '',
        address: patient.address?.street || '',
        city: patient.address?.city || '',
        state: patient.address?.state || '',
        zipCode: patient.address?.zipCode || '',
        emergencyContactName: patient.emergencyContact?.name || '',
        emergencyContactPhone: patient.emergencyContact?.phone || '',
        emergencyContactRelationship: patient.emergencyContact?.relationship || '',
        emergencyContactEmail: patient.emergencyContact?.email || '',
        allergies: patient.allergies?.join(', ') || '',
        medicalConditions: patient.medicalConditions?.join(', ') || '',
        medications: patient.medications?.join(', ') || '',
        insuranceProvider: patient.insuranceInfo?.provider || '',
        insurancePolicyNumber: patient.insuranceInfo?.policyNumber || '',
        insuranceGroupNumber: patient.insuranceInfo?.groupNumber || '',
        maritalStatus: patient.maritalStatus || '',
        occupation: patient.occupation || '',
        preferredLanguage: patient.preferredLanguage || '',
        smokingStatus: patient.smokingStatus || '',
        alcoholUse: patient.alcoholUse || ''
      });
    }
  }, [patient]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Prepare data for API - comprehensive update matching backend
      const updateData = {
        dateOfBirth: formData.dateOfBirth || null,
        gender: formData.gender || null,
        bloodType: formData.bloodType || null,
        height: formData.height ? {
          value: parseFloat(formData.height.split(' ')[0]) || null,
          unit: formData.height.includes('ft') ? 'ft' : 'cm'
        } : null,
        weight: formData.weight ? {
          value: parseFloat(formData.weight.split(' ')[0]) || null,
          unit: formData.weight.includes('lbs') ? 'lbs' : 'kg'
        } : null,
        address: {
          street: formData.address || '',
          city: formData.city || '',
          state: formData.state || '',
          zipCode: formData.zipCode || '',
          country: 'United States'
        },
        allergies: formData.allergies ? formData.allergies.split(',').map(item => item.trim()).filter(item => item) : [],
        medicalConditions: formData.medicalConditions ? formData.medicalConditions.split(',').map(item => item.trim()).filter(item => item) : [],
        medications: formData.medications ? formData.medications.split(',').map(item => item.trim()).filter(item => item) : [],
        emergencyContact: {
          name: formData.emergencyContactName || '',
          relationship: formData.emergencyContactRelationship || '',
          phone: formData.emergencyContactPhone || '',
          email: formData.emergencyContactEmail || ''
        },
        insuranceInfo: {
          provider: formData.insuranceProvider || '',
          policyNumber: formData.insurancePolicyNumber || '',
          groupNumber: formData.insuranceGroupNumber || ''
        },
        preferredLanguage: formData.preferredLanguage || 'English',
        maritalStatus: formData.maritalStatus || null,
        occupation: formData.occupation || '',
        smokingStatus: formData.smokingStatus || null,
        alcoholUse: formData.alcoholUse || null
      };

      console.log('Sending update data:', updateData);
      const result = await updateProfile(updateData);
      console.log('Update result:', result);
      
      setSuccessMessage('Profile updated successfully!');
      setShowSuccessAlert(true);
      setIsEditing(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to update profile. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original patient data
    if (patient) {
      setFormData({
        firstName: patient.user?.firstName || '',
        lastName: patient.user?.lastName || '',
        email: patient.user?.email || '',
        phone: patient.user?.phone || '',
        dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth).toISOString().split('T')[0] : '',
        gender: patient.gender || '',
        bloodType: patient.bloodType || '',
        height: patient.height?.value ? `${patient.height.value} ${patient.height.unit}` : '',
        weight: patient.weight?.value ? `${patient.weight.value} ${patient.weight.unit}` : '',
        address: patient.address?.street || '',
        city: patient.address?.city || '',
        state: patient.address?.state || '',
        zipCode: patient.address?.zipCode || '',
        emergencyContactName: patient.emergencyContact?.name || '',
        emergencyContactPhone: patient.emergencyContact?.phone || '',
        emergencyContactRelationship: patient.emergencyContact?.relationship || '',
        emergencyContactEmail: patient.emergencyContact?.email || '',
        allergies: patient.allergies?.join(', ') || '',
        medicalConditions: patient.medicalConditions?.join(', ') || '',
        medications: patient.medications?.join(', ') || '',
        insuranceProvider: patient.insuranceInfo?.provider || '',
        insurancePolicyNumber: patient.insuranceInfo?.policyNumber || '',
        insuranceGroupNumber: patient.insuranceInfo?.groupNumber || '',
        maritalStatus: patient.maritalStatus || '',
        occupation: patient.occupation || '',
        preferredLanguage: patient.preferredLanguage || '',
        smokingStatus: patient.smokingStatus || '',
        alcoholUse: patient.alcoholUse || ''
      });
    }
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);

    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      // Success
      setSuccessMessage('Password changed successfully!');
      setShowSuccessAlert(true);
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError(error.message || 'Failed to change password. Please try again.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
  };

  const handle2FASetup = async () => {
    setTwoFALoading(true);
    try {
      // Simulate API call to get QR code
      const response = await fetch('/api/v1/auth/setup-2fa', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to setup 2FA');
      }
      
      const data = await response.json();
      setQrCode(data.qrCode);
      setTwoFAStep('verify');
    } catch (error) {
      console.error('Error setting up 2FA:', error);
      // For demo purposes, generate a mock QR code
      setQrCode('https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/HealLink:user@example.com?secret=JBSWY3DPEHPK3PXP&issuer=HealLink');
      setTwoFAStep('verify');
    } finally {
      setTwoFALoading(false);
    }
  };

  const handle2FAVerification = async (e) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      alert('Please enter a 6-digit verification code');
      return;
    }
    
    setTwoFALoading(true);
    try {
      // Simulate API call to verify 2FA
      const response = await fetch('/api/v1/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: verificationCode })
      });
      
      if (!response.ok) {
        throw new Error('Invalid verification code');
      }
      
      setTwoFAEnabled(true);
      setSuccessMessage('2FA enabled successfully!');
      setShowSuccessAlert(true);
      setShow2FAModal(false);
      setVerificationCode('');
      
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } catch (error) {
      console.error('Error verifying 2FA:', error);
      // For demo purposes, accept any 6-digit code
      if (verificationCode === '123456') {
        setTwoFAEnabled(true);
        setSuccessMessage('2FA enabled successfully!');
        setShowSuccessAlert(true);
        setShow2FAModal(false);
        setVerificationCode('');
        
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000);
      } else {
        alert('Invalid verification code. Try 123456 for demo.');
      }
    } finally {
      setTwoFALoading(false);
    }
  };

  const handle2FADisable = async () => {
    setTwoFALoading(true);
    try {
      // Simulate API call to disable 2FA
      const response = await fetch('/api/v1/auth/disable-2fa', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to disable 2FA');
      }
      
      setTwoFAEnabled(false);
      setSuccessMessage('2FA disabled successfully!');
      setShowSuccessAlert(true);
      setShow2FAModal(false);
      
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } catch (error) {
      console.error('Error disabling 2FA:', error);
      // For demo purposes, always succeed
      setTwoFAEnabled(false);
      setSuccessMessage('2FA disabled successfully!');
      setShowSuccessAlert(true);
      setShow2FAModal(false);
      
      setTimeout(() => {
        setShowSuccessAlert(false);
      }, 3000);
    } finally {
      setTwoFALoading(false);
    }
  };

  const handle2FAModalClose = () => {
    setShow2FAModal(false);
    setVerificationCode('');
    setQrCode('');
    setTwoFAStep('setup');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account settings and preferences</p>
            {patient?.patientId && (
              <p className="text-sm text-blue-600 font-medium mt-2">
                Patient ID: {patient.patientId}
              </p>
            )}
            {patient?.user && (
              <p className="text-sm text-gray-600 mt-1">
                Member: {patient.user.firstName} {patient.user.lastName}
              </p>
            )}
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${
              isEditing
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={true}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Contact support to change your name</p>
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.firstName || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={true}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Contact support to change your name</p>
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.lastName || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {isEditing ? (
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={true}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Contact support to change your email</p>
                </div>
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.email || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.phone || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">
                  {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not provided'}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.gender || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Medical Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Blood Type</label>
              {isEditing ? (
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
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
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.bloodType || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Height</label>
              {isEditing ? (
                <input
                  type="text"
                  name="height"
                  value={formData.height}
                  onChange={handleInputChange}
                  placeholder="e.g., 170 cm or 5.8 ft"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.height || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Weight</label>
              {isEditing ? (
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  placeholder="e.g., 70 kg or 154 lbs"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.weight || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Marital Status</label>
              {isEditing ? (
                <select
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                >
                  <option value="">Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.maritalStatus || 'Not provided'}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Allergies</label>
              {isEditing ? (
                <textarea
                  name="allergies"
                  value={formData.allergies}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="List any allergies, separated by commas"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.allergies || 'Not provided'}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
              {isEditing ? (
                <textarea
                  name="medicalConditions"
                  value={formData.medicalConditions}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="List any medical conditions, separated by commas"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.medicalConditions || 'Not provided'}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Current Medications</label>
              {isEditing ? (
                <textarea
                  name="medications"
                  value={formData.medications}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="List current medications, separated by commas"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm resize-none"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.medications || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.address || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.city || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State</label>
              {isEditing ? (
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.state || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
              {isEditing ? (
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.zipCode || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="emergencyContactName"
                  value={formData.emergencyContactName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.emergencyContactName || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Relationship</label>
              {isEditing ? (
                <input
                  type="text"
                  name="emergencyContactRelationship"
                  value={formData.emergencyContactRelationship}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.emergencyContactRelationship || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="emergencyContactPhone"
                  value={formData.emergencyContactPhone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.emergencyContactPhone || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="emergencyContactEmail"
                  value={formData.emergencyContactEmail}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.emergencyContactEmail || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Insurance Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Insurance Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Insurance Provider</label>
              {isEditing ? (
                <input
                  type="text"
                  name="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.insuranceProvider || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Policy Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="insurancePolicyNumber"
                  value={formData.insurancePolicyNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.insurancePolicyNumber || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Group Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="insuranceGroupNumber"
                  value={formData.insuranceGroupNumber}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.insuranceGroupNumber || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Occupation</label>
              {isEditing ? (
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.occupation || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Language</label>
              {isEditing ? (
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                >
                  <option value="">Select Language</option>
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.preferredLanguage || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Smoking Status</label>
              {isEditing ? (
                <select
                  name="smokingStatus"
                  value={formData.smokingStatus}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                >
                  <option value="">Select Status</option>
                  <option value="Never">Never</option>
                  <option value="Former">Former</option>
                  <option value="Current">Current</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.smokingStatus || 'Not provided'}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alcohol Use</label>
              {isEditing ? (
                <select
                  name="alcoholUse"
                  value={formData.alcoholUse}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                >
                  <option value="">Select Usage</option>
                  <option value="Never">Never</option>
                  <option value="Rarely">Rarely</option>
                  <option value="Occasionally">Occasionally</option>
                  <option value="Regularly">Regularly</option>
                </select>
              ) : (
                <p className="mt-1 text-sm text-gray-900 py-2">{formData.alcoholUse || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Password</h3>
                <p className="text-sm text-gray-500">Change your account password</p>
              </div>
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-500">
                  {twoFAEnabled ? 'Disable 2FA for your account' : 'Add an extra layer of security to your account'}
                </p>
                {twoFAEnabled && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                    ✓ Enabled
                  </span>
                )}
              </div>
              <button
                type="button"
                className={`px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                  twoFAEnabled
                    ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                    : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
                }`}
                onClick={() => {
                  if (twoFAEnabled) {
                    setTwoFAStep('disable');
                  } else {
                    setTwoFAStep('setup');
                  }
                  setShow2FAModal(true);
                }}
              >
                {twoFAEnabled ? 'Disable 2FA' : 'Setup 2FA'}
              </button>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors">
              <div>
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Email Notifications
                </h3>
                <p className="text-sm text-teal-700">Receive appointment reminders and updates via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors">
              <div>
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  SMS Notifications
                </h3>
                <p className="text-sm text-teal-700">Receive urgent notifications via text message</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors">
              <div>
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 19h7c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1zM4 5h16c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1z"></path>
                  </svg>
                  Push Notifications
                </h3>
                <p className="text-sm text-teal-700">Receive real-time notifications on your device</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors">
              <div>
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Appointment Reminders
                </h3>
                <p className="text-sm text-teal-700">Get reminded 24 hours before your appointments</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg border border-teal-200 hover:bg-teal-100 transition-colors">
              <div>
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                  <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                  Test Results
                </h3>
                <p className="text-sm text-teal-700">Get notified when lab results and test reports are available</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save/Cancel Buttons */}
        {isEditing && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={handlePasswordModalClose}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                <button
                  onClick={handlePasswordModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {passwordError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800">{passwordError}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handlePasswordModalClose}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                  >
                    {passwordLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Setup/Disable Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {twoFAStep === 'setup' && 'Setup Two-Factor Authentication'}
                  {twoFAStep === 'verify' && 'Verify Setup'}
                  {twoFAStep === 'disable' && 'Disable Two-Factor Authentication'}
                </h3>
                <button
                  onClick={handle2FAModalClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              {twoFAStep === 'setup' && (
                <div className="text-center">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-6">
                    Two-factor authentication adds an extra layer of security to your account. 
                    You'll need an authenticator app like Google Authenticator or Authy.
                  </p>
                  <button
                    onClick={handle2FASetup}
                    disabled={twoFALoading}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {twoFALoading ? 'Setting up...' : 'Generate QR Code'}
                  </button>
                </div>
              )}

              {twoFAStep === 'verify' && (
                <div>
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Scan this QR code with your authenticator app:
                    </p>
                    {qrCode && (
                      <div className="flex justify-center mb-4">
                        <img src={qrCode} alt="QR Code" className="border rounded" />
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      Manual entry key: JBSWY3DPEHPK3PXP
                    </p>
                  </div>
                  
                  <form onSubmit={handle2FAVerification}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter 6-digit verification code:
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg tracking-widest"
                        placeholder="123456"
                        maxLength="6"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        For demo: use 123456
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={handle2FAModalClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={twoFALoading || verificationCode.length !== 6}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                      >
                        {twoFALoading ? 'Verifying...' : 'Verify & Enable'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {twoFAStep === 'disable' && (
                <div className="text-center">
                  <div className="mb-4">
                    <svg className="mx-auto h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Disable Two-Factor Authentication?</h4>
                  <p className="text-sm text-gray-600 mb-6">
                    This will remove the extra security layer from your account. You can re-enable it at any time.
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={handle2FAModalClose}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handle2FADisable}
                      disabled={twoFALoading}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                    >
                      {twoFALoading ? 'Disabling...' : 'Disable 2FA'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
