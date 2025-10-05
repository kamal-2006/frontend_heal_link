'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    } catch (e) {
      // no-op
    }
    router.push('/login');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-semibold">
            A
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">Admin</div>
            <div className="text-sm text-gray-500">admin@heallink.local</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Account</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-gray-900">Sign out of your account</div>
            <div className="text-xs text-gray-500">You will need to login again to continue</div>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}





