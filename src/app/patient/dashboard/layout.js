'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import usePatient from '../../../hooks/usePatient';

export default function PatientDashboardLayout({ children }) {
  const router = useRouter();
  const { patient, loading, error } = usePatient();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'patient') {
      router.push('/login');
    }
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="w-full px-4 py-4">
        {children}
      </main>
    </div>
  );
}
