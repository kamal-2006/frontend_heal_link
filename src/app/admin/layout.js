'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import NotificationBell from '@/components/NotificationBell';
import { getAuthUrl } from '@/config/api';

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const profileRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch admin user info for NotificationBell
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        console.log('[Admin Layout] Fetching user info...');
        console.log('[Admin Layout] Token exists:', !!token);
        console.log('[Admin Layout] Stored user exists:', !!storedUser);
        
        // If we have a stored user, use it immediately
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            console.log('[Admin Layout] Loaded user from storage:', user);
            setAdminUser(user);
          } catch (e) {
            console.error('[Admin Layout] Error parsing stored user:', e);
          }
        }
        
        // If no token, return
        if (!token) {
          console.warn('[Admin Layout] No token found - notification bell will not render');
          return;
        }
        
        // Try to fetch fresh user data
        const response = await fetch(getAuthUrl(), {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            console.log('[Admin Layout] Fresh user data fetched:', data.data);
            setAdminUser(data.data);
            localStorage.setItem('user', JSON.stringify(data.data));
          }
        } else {
          console.warn('[Admin Layout] Failed to fetch user:', response.status);
        }
      } catch (error) {
        console.error('[Admin Layout] Error fetching user:', error);
      }
    };
    fetchUserInfo();
  }, [router]);

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
      path: "/admin/nurses",
      label: "Nurses",
      icon: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z", // user group icon
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

  // Close dropdown on outside click and Escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    
    function handleEsc(event) {
      if (event.key === 'Escape') {
        setIsProfileOpen(false);
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
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold sm:text-2xl bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Heal Link
                </span>
              </Link>
            </div>
            
            {/* Right Side: Notification Bell + User Profile */}
            <div className="flex items-center gap-3">
              {/* Real-Time Notification Bell */}
              {mounted && adminUser && (
                <NotificationBell 
                  userId={adminUser._id} 
                  role="admin" 
                />
              )}

              {/* User Profile Dropdown */}
              <div className="relative" ref={profileRef}>
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
                      <p className="text-sm font-semibold text-gray-800">{adminUser?.firstName || 'Admin'}</p>
                      <p className="text-xs text-gray-500">{adminUser?.email || 'admin@heallink.local'}</p>
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