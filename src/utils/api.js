const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Patient API functions
export const patientApi = {
  // Get current patient profile
  getMyProfile: () => apiRequest('/patients/me'),
  
  // Update current patient profile
  updateMyProfile: (profileData) => apiRequest('/patients/me', {
    method: 'PUT',
    body: JSON.stringify(profileData)
  }),
  
  // Get patient dashboard data
  getDashboard: () => apiRequest('/patients/dashboard'),
  
  // Get patient appointments
  getAppointments: () => apiRequest('/appointments'),
  
  // Get patient medical records
  getMedicalRecords: () => apiRequest('/medicalRecords'),
  
  // Get patient medications
  getMedications: () => apiRequest('/medications')
};

// Auth API functions
export const authApi = {
  login: (credentials) => apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  register: (userData) => apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  }),
  
  googleLogin: (tokenId) => apiRequest('/auth/google', {
    method: 'POST',
    body: JSON.stringify({ tokenId })
  }),

  changePassword: (passwordData) => apiRequest('/auth/changepassword', {
    method: 'PUT',
    body: JSON.stringify(passwordData)
  }),

  // 2FA functions
  enable2FA: () => apiRequest('/auth/2fa/enable', {
    method: 'POST'
  }),

  disable2FA: () => apiRequest('/auth/2fa/disable', {
    method: 'POST'
  }),

  verify2FA: (data) => apiRequest('/auth/2fa/verify', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  get2FAStatus: () => apiRequest('/auth/2fa/status')
};

// Doctor API functions
export const doctorApi = {
  // Get all doctors
  getDoctors: () => apiRequest('/doctors'),
  
  // Get available doctors for appointments
  getAvailableDoctors: (query = '') => apiRequest(`/doctors/available${query}`),
  
  // Get doctors by specialization
  getDoctorsBySpecialization: (specialization) => apiRequest(`/doctors/specialization/${specialization}`),
  
  // Get single doctor
  getDoctor: (id) => apiRequest(`/doctors/${id}`),
  
  // Create doctor (admin only)
  createDoctor: (doctorData) => apiRequest('/doctors', {
    method: 'POST',
    body: JSON.stringify(doctorData)
  }),
  
  // Update doctor
  updateDoctor: (id, doctorData) => apiRequest(`/doctors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(doctorData)
  })
};

// Appointment API functions
export const appointmentApi = {
  // Get patient appointments
  getMyAppointments: () => apiRequest('/appointments'),
  
  // Book new appointment
  bookAppointment: (appointmentData) => apiRequest('/appointments/book', {
    method: 'POST',
    body: JSON.stringify(appointmentData)
  }),
  
  // Cancel appointment
  cancelAppointment: (id) => apiRequest(`/appointments/${id}/cancel`, {
    method: 'PUT'
  }),
  
  // Update appointment
  updateAppointment: (id, appointmentData) => apiRequest(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(appointmentData)
  })
};

// Medication API functions
export const medicationApi = {
  // Get all my medications
  getMyMedications: (query = '') => apiRequest(`/medications/my${query}`),
  
  // Get my active medications
  getMyActiveMedications: () => apiRequest('/medications/my/active'),
  
  // Get medication reminders for today
  getMyMedicationReminders: () => apiRequest('/medications/my/reminders'),
  
  // Get single medication
  getMedication: (id) => apiRequest(`/medications/${id}`),
  
  // Update medication reminders
  updateMedicationReminders: (id, reminderData) => apiRequest(`/medications/${id}/reminders`, {
    method: 'PUT',
    body: JSON.stringify(reminderData)
  }),
  
  // Add medication note
  addMedicationNote: (id, noteData) => apiRequest(`/medications/${id}/notes`, {
    method: 'PUT',
    body: JSON.stringify(noteData)
  }),
  
  // Update medication status
  updateMedicationStatus: (id, statusData) => apiRequest(`/medications/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(statusData)
  })
};

// Feedback API functions
export const feedbackApi = {
  // Get all feedback for the current patient
  getMyFeedback: () => apiRequest('/feedback/me'),
  
  // Get all feedback for a specific doctor
  getDoctorFeedback: (doctorId) => apiRequest(`/feedback/doctor/${doctorId}`),
  
  // Submit new feedback
  submitFeedback: (feedbackData) => apiRequest('/feedback', {
    method: 'POST',
    body: JSON.stringify(feedbackData)
  }),
  
  // Update existing feedback
  updateFeedback: (id, feedbackData) => apiRequest(`/feedback/${id}`, {
    method: 'PUT',
    body: JSON.stringify(feedbackData)
  }),
  
  // Delete feedback
  deleteFeedback: (id) => apiRequest(`/feedback/${id}`, {
    method: 'DELETE'
  }),
  
  // Get appointments that need feedback
  getAppointmentsNeedingFeedback: () => apiRequest('/appointments/needFeedback')
};

// Notification preferences API functions
export const notificationApi = {
  // Get notification preferences
  getNotificationPreferences: () => apiRequest('/patients/me/notifications'),
  
  // Update notification preferences
  updateNotificationPreferences: (preferences) => apiRequest('/patients/me/notifications', {
    method: 'PUT',
    body: JSON.stringify(preferences)
  })
};

export default apiRequest;