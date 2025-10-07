'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationsRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  // Notifications state similar to doctor dashboard
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New doctor added', time: '10 minutes ago', read: false },
    { id: 2, message: 'System update scheduled', time: '2 hours ago', read: false },
    { id: 3, message: 'Appointment rescheduled', time: 'Yesterday', read: true },
  ]);
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const markAllAsRead = () => setNotifications(notifications.map((n) => ({ ...n, read: true })));

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    } catch {}
    router.push('/login');
  };

  const isActive = (path) => {
    return pathname === path
      ? "bg-blue-100 text-blue-700"
      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600";
  };

  const menuItems = [
    {
      path: "/admin",
      label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      path: "/admin/doctors",
      label: "Doctors",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
    {
      path: "/admin/patients",
      label: "Patients",
      icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      path: "/admin/appointments",
      label: "Appointments",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      path: "/admin/feedback",
      label: "Feedback",
      icon: "M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z",
    },
  ];

  // Close dropdowns on outside click and Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    
    function handleEsc(event) {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
        setIsNotificationsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    setIsProfileOpen(false);
    setIsNotificationsOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
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
              {/* Notifications (right side) */}
              <div className="mr-3 relative" ref={notificationsRef}>
                <button
                  onClick={() => setIsNotificationsOpen((prev) => !prev)}
                  className="relative p-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Notifications"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-600 rounded-full">{unreadNotifications}</span>
                  )}
                </button>
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                      {unreadNotifications > 0 && (
                        <button onClick={markAllAsRead} className="text-xs font-medium text-blue-600 hover:text-blue-800">Mark all as read</button>
                      )}
                    </div>
                    <ul className="max-h-64 overflow-auto divide-y divide-gray-100">
                      <li className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          <span className="h-2 w-2 rounded-full bg-red-500 mt-2"></span>
                          <div>
                            <p className="text-sm text-gray-800">Doctor slot swap requested by Dr. Jane</p>
                            <p className="text-xs text-gray-500">5 minutes ago</p>
                          </div>
                        </div>
                      </li>
                      <li className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          <span className="h-2 w-2 rounded-full bg-blue-500 mt-2"></span>
                          <div>
                            <p className="text-sm text-gray-800">System update scheduled tonight</p>
                            <p className="text-xs text-gray-500">1 hour ago</p>
                          </div>
                        </div>
                      </li>
                      <li className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          <span className="h-2 w-2 rounded-full bg-amber-500 mt-2"></span>
                          <div>
                            <p className="text-sm text-gray-800">Appointment change: Patient John to 3:00 PM</p>
                            <p className="text-xs text-gray-500">Yesterday</p>
                          </div>
                        </div>
                      </li>
                      <li className="px-4 py-3 hover:bg-gray-50">
                        <div className="flex items-start gap-3">
                          <span className="h-2 w-2 rounded-full bg-gray-400 mt-2"></span>
                          <div>
                            <p className="text-sm text-gray-800">System maintenance window completed</p>
                            <p className="text-xs text-gray-500">2 days ago</p>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="ml-3 relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-gray-100"
                  aria-haspopup="true"
                  aria-expanded={isProfileOpen}
                >
                  <span className="text-sm font-medium text-gray-700">Admin</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    <span className="text-sm font-medium">A</span>
                  </div>
                </button>
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">Admin</p>
                      <p className="text-xs text-gray-500">admin@heallink.local</p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <Link href="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          Admin Profile
                        </Link>
                      </li>
                      <li className="border-t border-gray-100">
                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center gap-2">
                          <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0v-1m6-8V7a3 3 0 10-6 0v1" />
                          </svg>
                          Sign Out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {/* Sidebar */}
        <div
          className={`fixed left-0 h-[calc(100vh-4rem)] bg-white shadow-md transition-all duration-300 ${
            isCollapsed ? "w-20" : "w-64"
          } overflow-y-auto`}
        >
          <ul className="p-2 space-y-1 mt-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center p-3 space-x-4 rounded-md ${isActive(
                    item.path
                  )} transition-colors`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={item.icon}
                    />
                  </svg>
                  <span
                    className={`transition-all ${
                      isCollapsed ? "opacity-0 w-0" : "opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Sign Out removed per requirements; access via Admin Profile page */}
        </div>
        
        {/* Main Content */}
        <main
          className={`transition-all duration-300 ${
            isCollapsed ? "ml-20" : "ml-64"
          } min-w-0 flex-1 overflow-hidden`}
        >
          {pathname === '/admin/appointments' ? (
            // Full width container with overflow control for appointments page
            <div className="p-4 min-w-0 overflow-hidden">
              {children}
            </div>
          ) : (
            // Standard container with overflow control for other pages
            <div className="bg-white rounded-lg shadow-sm p-6 m-6 min-w-0 overflow-hidden">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}