const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  
  console.log('Debug - API call with token:', !!token, 'role:', role);
  
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    console.log(`Making API request to ${endpoint}`);
    console.log('Auth details:', { hasToken: !!token, role });
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getAuthHeaders(),
      ...options,
    });

    const data = await response.json();
    
    console.log('API Response status:', response.status);
    console.log('API Response data:', data);

    if (!response.ok) {
      // Handle authorization errors specially
      if (response.status === 401 || response.status === 403) {
        console.error('Authorization error:', data.error);
        // Clear invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');

        // Redirect to login if not authorized (keep UX flow)
        if (window.location.pathname.includes('/admin')) {
          window.location.href = '/login';
        }
        // Throw so callers know an auth error occurred
        throw new Error(data.error || 'Authorization error');
      }

      // For non-auth errors, return a structured response so callers can
      // handle errors (like missing patient) without the whole app crashing.
      const errMsg = data?.error || 'API request failed';
      console.warn(`API ${endpoint} returned ${response.status}:`, errMsg);

      return {
        data: null,
        error: errMsg,
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// Patient API functions
export const patientApi = {
  // Get current patient profile
  getMyProfile: () => apiRequest("/patients/me"),

  // Update current patient profile
  updateMyProfile: (profileData) =>
    apiRequest("/patients/me", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),

  // Get patient dashboard data
  getDashboard: () => apiRequest("/patients/dashboard"),

  // Get patient appointments
  getAppointments: () => apiRequest("/appointments"),

  // Get patient medical records
  getMedicalRecords: () => apiRequest("/medicalRecords"),

  // Get patient medications
  getMedications: () => apiRequest("/medications"),
};

// Auth API functions
export const authApi = {
  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  register: (userData) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  googleLogin: (tokenId) =>
    apiRequest("/auth/google", {
      method: "POST",
      body: JSON.stringify({ tokenId }),
    }),

  changePassword: (passwordData) =>
    apiRequest("/auth/changepassword", {
      method: "PUT",
      body: JSON.stringify(passwordData),
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
  getDoctors: () => apiRequest("/doctors"),

  // Get available doctors for appointments
  getAvailableDoctors: (query = "") => apiRequest(`/doctors/available${query}`),

  // Get doctors by specialization
  getDoctorsBySpecialization: (specialization) =>
    apiRequest(`/doctors/specialization/${specialization}`),

  // Get single doctor
  getDoctor: (id) => apiRequest(`/doctors/${id}`),

  // Create doctor (admin only)
  createDoctor: (doctorData) =>
    apiRequest("/doctors", {
      method: "POST",
      body: JSON.stringify(doctorData),
    }),

  // Update doctor
  updateDoctor: (id, doctorData) =>
    apiRequest(`/doctors/${id}`, {
      method: "PUT",
      body: JSON.stringify(doctorData),
    }),
};

// Appointment API functions
export const appointmentApi = {
  // Get patient appointments
  getMyAppointments: () => apiRequest("/appointments"),

  // Book new appointment
  bookAppointment: (appointmentData) =>
    apiRequest("/appointments/book", {
      method: "POST",
      body: JSON.stringify(appointmentData),
    }),

  // Cancel appointment
  cancelAppointment: (id, data = {}) =>
    apiRequest(`/appointments/${id}/cancel`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Update appointment
  updateAppointment: (id, appointmentData) =>
    apiRequest(`/appointments/${id}`, {
      method: "PUT",
      body: JSON.stringify(appointmentData),
    }),
};

// Medication API functions
export const medicationApi = {
  // Get all my medications
  getMyMedications: (query = "") => apiRequest(`/medications/my${query}`),

  // Get my active medications
  getMyActiveMedications: () => apiRequest("/medications/my/active"),

  // Get medication reminders for today
  getMyMedicationReminders: () => apiRequest("/medications/my/reminders"),

  // Get single medication
  getMedication: (id) => apiRequest(`/medications/${id}`),

  // Update medication reminders
  updateMedicationReminders: (id, reminderData) =>
    apiRequest(`/medications/${id}/reminders`, {
      method: "PUT",
      body: JSON.stringify(reminderData),
    }),

  // Add medication note
  addMedicationNote: (id, noteData) =>
    apiRequest(`/medications/${id}/notes`, {
      method: "PUT",
      body: JSON.stringify(noteData),
    }),

  // Update medication status
  updateMedicationStatus: (id, statusData) =>
    apiRequest(`/medications/${id}/status`, {
      method: "PUT",
      body: JSON.stringify(statusData),
    }),
};

// Feedback API functions
export const feedbackApi = {
  // Get all feedback for the current patient
  getMyFeedback: () => apiRequest("/feedback/me"),

  // Get all feedback for a specific doctor
  getDoctorFeedback: (doctorId) => apiRequest(`/feedback/doctor/${doctorId}`),

  // Submit new feedback
  submitFeedback: (feedbackData) =>
    apiRequest("/feedback", {
      method: "POST",
      body: JSON.stringify(feedbackData),
    }),

  // Update existing feedback
  updateFeedback: (id, feedbackData) =>
    apiRequest(`/feedback/${id}`, {
      method: "PUT",
      body: JSON.stringify(feedbackData),
    }),

  // Delete feedback
  deleteFeedback: (id) =>
    apiRequest(`/feedback/${id}`, {
      method: "DELETE",
    }),

  // Get appointments that need feedback
  getAppointmentsNeedingFeedback: () =>
    apiRequest("/appointments/needFeedback"),
};

// Notification preferences API functions
export const notificationApi = {
  // Get notification preferences
  getNotificationPreferences: () => apiRequest("/patients/me/notifications"),

  // Update notification preferences
  updateNotificationPreferences: (preferences) =>
    apiRequest("/patients/me/notifications", {
      method: "PUT",
      body: JSON.stringify(preferences),
    }),
};

// Medical Reports API functions
export const reportsApi = {
  // Upload medical report with files
  uploadReport: (formData) => {
    // For file uploads, we need to use fetch directly with FormData
    const token = localStorage.getItem('token');
    return fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/records/patient/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }).then(response => response.json());
  },

  // Get patient's own medical records
  getMyReports: (params = {}) => {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.recordType) queryParams.append('recordType', params.recordType);
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    
    const queryString = queryParams.toString();
    return apiRequest(`/records/patient/my-records${queryString ? `?${queryString}` : ''}`);
  },

  // Update medical record
  updateReport: (id, data) =>
    apiRequest(`/records/patient/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  // Delete medical record
  deleteReport: (id) =>
    apiRequest(`/records/patient/${id}`, {
      method: "DELETE",
    }),

  // Get single medical record
  getReport: (id) => apiRequest(`/records/${id}`),

  // Download medical record file
  downloadReport: (id) => {
    const token = localStorage.getItem('token');
    return fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"}/records/${id}/download`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};

export default apiRequest;

