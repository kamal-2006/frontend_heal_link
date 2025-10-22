
import { useState, useEffect } from 'react';
import { doctorApi } from '../utils/api';

const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'doctor') {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const response = await doctorApi.getMyProfile();
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUser();

    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        fetchUser();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const refetch = () => {
    fetchUser();
  };

  return { user, loading, refetch, setUser };
};

export default useUser;
