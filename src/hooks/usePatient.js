import { useState, useEffect } from 'react';
import { patientApi } from '../utils/api';

const usePatient = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatientProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await patientApi.getMyProfile();
      setPatient(response.data);
    } catch (err) {
      console.error('Error fetching patient profile:', err);
      setError(err.message || 'Failed to fetch patient profile');
    } finally {
      setLoading(false);
    }
  };

  const updatePatientProfile = async (profileData) => {
    try {
      setError(null);
      const response = await patientApi.updateMyProfile(profileData);
      setPatient(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating patient profile:', err);
      setError(err.message || 'Failed to update patient profile');
      throw err;
    }
  };

  useEffect(() => {
    // Only fetch if user is authenticated
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role === 'patient') {
      fetchPatientProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return {
    patient,
    loading,
    error,
    refetchProfile: fetchPatientProfile,
    updateProfile: updatePatientProfile
  };
};

export default usePatient;