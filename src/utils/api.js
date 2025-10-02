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
  })
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
  cancelAppointment: (id) => apiRequest(`/appointments/${id}`, {
    method: 'DELETE'
  }),
  
  // Update appointment
  updateAppointment: (id, appointmentData) => apiRequest(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(appointmentData)
  })
};

export default apiRequest;