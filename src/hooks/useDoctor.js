import { useState, useEffect } from 'react';
import { doctorApi } from '../utils/api';

const useDoctor = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await doctorApi.getMyProfile();
      setDoctor(response.data);
    } catch (err) {
      console.error('Error fetching doctor profile:', err);
      setError(err.message || 'Failed to fetch doctor profile');
    } finally {
      setLoading(false);
    }
  };

  const updateDoctorProfile = async (profileData) => {
    try {
      setError(null);
      const response = await doctorApi.updateMyProfile(profileData);
      setDoctor(response.data);
      return response.data;
    } catch (err) {
      console.error('Error updating doctor profile:', err);
      setError(err.message || 'Failed to update doctor profile');
      throw err;
    }
  };

  useEffect(() => {
    // Only fetch if user is authenticated
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token && role === 'doctor') {
      fetchDoctorProfile();
    } else {
      setLoading(false);
    }
  }, []);

  return {
    doctor,
    loading,
    error,
    refetchProfile: fetchDoctorProfile,
    updateProfile: updateDoctorProfile
  };
};

export default useDoctor;