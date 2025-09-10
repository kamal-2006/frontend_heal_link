
import { useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

const useUser = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
    setLoading(false);
  }, []);

  return { user, loading, setUser };
};

export default useUser;
