'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) => {
    return pathname === path ? 
      "bg-blue-100 text-blue-700" : 
      "text-gray-600 hover:bg-blue-50 hover:text-blue-600";
  };

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/admin/doctors', label: 'Doctors', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { path: '/admin/patients', label: 'Patients', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { path: '/admin/appointments', label: 'Appointments', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { path: '/admin/feedback', label: 'Feedback', icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold text-blue-600">Heal Link</h1>
              </Link>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">Admin</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <span className="text-sm font-medium">A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16"> {/* Add padding top to account for fixed navbar */}
        {/* Sidebar */}
        <div className={`fixed left-0 h-[calc(100vh-4rem)] bg-white shadow-md transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'} overflow-y-auto`}>
          <ul className="p-2 space-y-1 mt-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center p-3 space-x-4 rounded-md ${isActive(item.path)} transition-colors`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className={`transition-all ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Sign Out Button */}
          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
            <button 
              onClick={() => router.push('/login')}
              className="flex items-center w-full p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <svg className="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className={`${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className={`transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'} p-6 w-full`}>
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}