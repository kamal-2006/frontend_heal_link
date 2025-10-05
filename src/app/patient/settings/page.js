'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi, notificationApi } from '../../../utils/api';
import { toTitleCase } from '../../../utils/text';
import usePatient from '../../../hooks/usePatient';

export default function SettingsPage() {
  const router = useRouter();
  const { patient, loading: patientLoading } = usePatient();
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
  
  // Notification preferences state
  const [notificationPreferences, setNotificationPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    appointmentReminders: true,
    testResults: true
  });
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  // 2FA state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isLoading2FA, setIsLoading2FA] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
    
    // Fetch notification preferences and 2FA status
    fetchNotificationPreferences();
    fetch2FAStatus();
  }, [router]);

  const fetchNotificationPreferences = async () => {
    try {
      setIsLoadingNotifications(true);
      const response = await notificationApi.getNotificationPreferences();
      setNotificationPreferences(response.data);
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const fetch2FAStatus = async () => {
    try {
      const response = await authApi.get2FAStatus();
      setTwoFactorEnabled(response.data.enabled);
    } catch (error) {
      console.error('Error fetching 2FA status:', error);
    }
  };

  const handleNotificationToggle = async (preferenceKey) => {
    try {
      const updatedPreferences = {
        ...notificationPreferences,
        [preferenceKey]: !notificationPreferences[preferenceKey]
      };
      
      // Update local state immediately for better UX
      setNotificationPreferences(updatedPreferences);
      
      // Update in backend
      await notificationApi.updateNotificationPreferences(updatedPreferences);
      
      setSuccessMessage('Notification preferences updated successfully');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      // Revert local state on error
      setNotificationPreferences(prev => ({
        ...prev,
        [preferenceKey]: !prev[preferenceKey]
      }));
    }
  };

  const handle2FAToggle = async () => {
    try {
      setIsLoading2FA(true);
      
      if (!twoFactorEnabled) {
        // Enable 2FA - generate QR code
        const response = await authApi.enable2FA();
        setQrCodeUrl(response.data.qrCodeUrl);
        setBackupCodes(response.data.backupCodes);
        setShowQRCode(true);
      } else {
        // Disable 2FA
        await authApi.disable2FA();
        setTwoFactorEnabled(false);
        setSuccessMessage('Two-factor authentication disabled successfully');
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
      }
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      setSuccessMessage(`Error: Failed to ${twoFactorEnabled ? 'disable' : 'enable'} 2FA. Please try again.`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 5000);
    } finally {
      setIsLoading2FA(false);
    }
  };

  const verify2FA = async (e) => {
    e.preventDefault();
    try {
      setIsLoading2FA(true);
      await authApi.verify2FA({ code: verificationCode });
      setTwoFactorEnabled(true);
      setShowQRCode(false);
      setVerificationCode('');
      setSuccessMessage('Two-factor authentication enabled successfully');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      console.error('Error verifying 2FA:', error);
    } finally {
      setIsLoading2FA(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    try {
      setPasswordLoading(true);
      setPasswordError('');
      
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setSuccessMessage('Password changed successfully');
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (patientLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
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
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your security and notification preferences
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              {patient?.user ? (
                <span className="text-blue-600 font-semibold">
                  {patient.user.firstName.charAt(0)}{patient.user.lastName.charAt(0)}
                </span>
              ) : (
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">
                {patient?.user ? (
                  `${toTitleCase(patient.user.firstName)} ${toTitleCase(patient.user.lastName)}`
                ) : (
                  'Loading...'
                )}
              </p>
              <p className="text-xs text-gray-500">{patient?.user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Alert */}
      {showSuccessAlert && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {successMessage}
          </div>
        </div>
      )}

      {/* Security Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Security</h2>
            <p className="text-sm text-gray-500">Manage your account security settings</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Change Password */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
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

          {/* 2 Factor Authentication */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500">
                {twoFactorEnabled 
                  ? 'Your account is protected with 2FA' 
                  : 'Add an extra layer of security to your account'
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className={`flex items-center ${twoFactorEnabled ? 'text-green-600' : 'text-gray-400'}`}>
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.25-7.5A2.25 2.25 0 0118 2.25H6A2.25 2.25 0 013.75 4.5v15A2.25 2.25 0 006 21.75h12A2.25 2.25 0 0020.25 19.5V4.5A2.25 2.25 0 0018 2.25z" />
                </svg>
                <span className="text-sm font-medium">
                  {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <button
                type="button"
                onClick={handle2FAToggle}
                disabled={isLoading2FA}
                className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  twoFactorEnabled
                    ? 'bg-red-100 text-red-700 hover:bg-red-200 focus:ring-red-500'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                }`}
              >
                {isLoading2FA ? 'Loading...' : (twoFactorEnabled ? 'Disable' : 'Enable')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
            <p className="text-sm text-gray-500">Choose how you want to receive notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-500">Receive appointment reminders and updates via email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationPreferences.emailNotifications}
                onChange={() => handleNotificationToggle('emailNotifications')}
                disabled={isLoadingNotifications}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
            </label>
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <div>
                <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-500">Receive urgent notifications via text message</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationPreferences.smsNotifications}
                onChange={() => handleNotificationToggle('smsNotifications')}
                disabled={isLoadingNotifications}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
            </label>
          </div>

          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM4 19h7c.55 0 1-.45 1-1v-3c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v3c0 .55.45 1 1 1zM4 5h16c.55 0 1 .45 1 1v6c0 .55-.45 1-1 1H4c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1z"></path>
              </svg>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                <p className="text-sm text-gray-500">Receive real-time notifications on your device</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationPreferences.pushNotifications}
                onChange={() => handleNotificationToggle('pushNotifications')}
                disabled={isLoadingNotifications}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
            </label>
          </div>

          {/* Appointment Reminders */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Appointment Reminders</h3>
                <p className="text-sm text-gray-500">Get reminded 24 hours before your appointments</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationPreferences.appointmentReminders}
                onChange={() => handleNotificationToggle('appointmentReminders')}
                disabled={isLoadingNotifications}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
            </label>
          </div>

          {/* Test Results */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Test Results</h3>
                <p className="text-sm text-gray-500">Get notified when lab results and test reports are available</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={notificationPreferences.testResults}
                onChange={() => handleNotificationToggle('testResults')}
                disabled={isLoadingNotifications}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-8 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Setup Two-Factor Authentication</h3>
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p className="mb-2">1. Install an authenticator app (Google Authenticator, Authy, etc.)</p>
                  <p className="mb-4">2. Scan this QR code with your authenticator app:</p>
                </div>
                
                {qrCodeUrl && (
                  <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                    <img src={qrCodeUrl} alt="QR Code for 2FA" className="w-48 h-48" />
                  </div>
                )}
                
                <form onSubmit={verify2FA} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Enter verification code from your app
                    </label>
                    <input
                      type="text"
                      required
                      maxLength="6"
                      placeholder="000000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  
                  {backupCodes.length > 0 && (
                    <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
                      <p className="font-medium mb-1">⚠️ Save these backup codes:</p>
                      <div className="grid grid-cols-2 gap-1 font-mono">
                        {backupCodes.map((code, index) => (
                          <span key={index}>{code}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowQRCode(false);
                        setVerificationCode('');
                        setQrCodeUrl('');
                        setBackupCodes([]);
                      }}
                      className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading2FA || verificationCode.length !== 6}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading2FA ? 'Verifying...' : 'Verify & Enable'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative p-8 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  />
                </div>
                {passwordError && (
                  <div className="text-red-600 text-sm">{passwordError}</div>
                )}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordError('');
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 text-base font-medium rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {passwordLoading ? 'Changing...' : 'Change Password'}
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