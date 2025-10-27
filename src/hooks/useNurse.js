'use client';

import { useState, useEffect } from 'react';
import { getAuthUrl } from '@/config/api';

const useNurse = () => {
  const [nurse, setNurse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNurse = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(getAuthUrl(), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Nurse API response:', data); // Debug log
          
          // Check if user is a nurse
          if (data.data && data.data.role === 'nurse') {
            setNurse(data.data);
          } else {
            console.log('User role:', data.data?.role); // Debug log
            setError(`Access denied: Nurse role required. Current role: ${data.data?.role}`);
          }
        } else {
          const errorData = await response.json().catch(() => ({}));
          console.log('API error:', errorData); // Debug log
          // Token might be invalid
          localStorage.removeItem('token');
          setError(`Authentication failed: ${errorData.error || 'Unknown error'}`);
        }
      } catch (err) {
        console.error('Error fetching nurse data:', err);
        setError('Failed to load nurse data');
      } finally {
        setLoading(false);
      }
    };

    fetchNurse();
  }, []);

  return { nurse, loading, error };
};

export default useNurse;