'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DoctorLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'doctor') {
      router.push('/login');
    }
  }, [router]);

  return <>{children}</>;
}
