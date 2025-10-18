"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import useDoctor from "@/hooks/useDoctor";
import { toTitleCase } from "@/utils/text";

export default function DoctorDashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: userLoading, setUser } = useUser();
  const { doctor, loading: doctorLoading } = useDoctor();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/login");
  };

  const loading = userLoading || doctorLoading;

  const isActive = (path) => {
    return pathname === `/doctor/dashboard${path}`
      ? "bg-blue-100 text-blue-700"
      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation - Fixed */}
      <nav className="bg-white shadow-md border-b border-gray-200 fixed top-0 left-0 right-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
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
                <div className="h-8 w-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-md flex items-center justify-center mr-2">
                  <svg
                    className="h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  Heal Link
                </h1>
              </Link>
            </div>

            {/* User Profile and Notification */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  className="p-2 rounded-full text-gray-600 hover:text-gray-900 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  aria-label="Notifications"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>

                {/* Notification Dropdown */}
                {isNotificationOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 transform transition-all duration-200">
                    <div className="p-4">
                      <div className="flex justify-between items-center border-b border-gray-200 pb-3 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <div className="text-center py-8">
                          <svg
                            className="mx-auto h-10 w-10 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">
                            No notifications
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile Dropdown */}
              <div className="ml-3 relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  {!loading && user && (
                    <>
                      <div className="text-right mr-2">
                        <span className="block text-sm font-medium text-gray-800">
                          Dr. {toTitleCase(user?.firstName)}{" "}
                          {toTitleCase(user?.lastName)}
                        </span>
                        <span className="block text-xs text-gray-500">
                          {user?.specialty ||
                            user?.specialization ||
                            "General Practitioner"}
                        </span>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white flex items-center justify-center shadow-md overflow-hidden">
                        {user?.profilePicture ? (
                          <img
                            src={`http://localhost:5000/${user.profilePicture}`}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium">
                            {toTitleCase(user?.firstName?.[0])}
                            {toTitleCase(user?.lastName?.[0])}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-xl bg-white ring-1 ring-gray-200 z-30 overflow-hidden transform transition-all duration-200">
                    {!loading && user && (
                      <div className="p-5 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-100">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md flex-shrink-0 overflow-hidden">
                            {user?.profilePicture ? (
                              <img
                                src={`http://localhost:5000/${user.profilePicture}`}
                                alt="Profile"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <>
                                {toTitleCase(user?.firstName?.[0])}
                                {toTitleCase(user?.lastName?.[0])}
                              </>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-base truncate">
                              Dr. {toTitleCase(user?.firstName)}{" "}
                              {toTitleCase(user?.lastName)}
                            </p>
                            <p className="text-sm text-gray-600 truncate mt-0.5">
                              {user?.email || "doctor@heallink.com"}
                            </p>
                            <p className="text-sm font-medium text-purple-600 mt-1">
                              ID: {doctor?.doctorId || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <div
                      className="py-2"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu"
                    >
                      <Link
                        href="/doctor/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="group flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        role="menuitem"
                      >
                        <svg
                          className="mr-3 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        View Profile
                      </Link>
                      <Link
                        href="/doctor/settings"
                        onClick={() => setIsProfileOpen(false)}
                        className="group flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                        role="menuitem"
                      >
                        <svg
                          className="mr-3 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsProfileOpen(false);
                        }}
                        className="group flex w-full items-center px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                        role="menuitem"
                      >
                        <svg
                          className="mr-3 h-5 w-5 text-red-500"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        {" "}
        {/* Added padding top to account for fixed navbar */}
        {/* Sidebar */}
        <div
          className={`${
            isSidebarOpen ? "block" : "hidden"
          } md:block md:w-64 bg-white shadow-lg h-[calc(100vh-4rem)] fixed overflow-y-auto z-10 transition-all duration-300`}
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="space-y-2">
              <Link
                href="/doctor/dashboard"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${isActive(
                  ""
                )}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-3 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                Dashboard
              </Link>

              <Link
                href="/doctor/appointments"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${isActive(
                  "/appointments"
                )}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-3 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Appointments
              </Link>

              <Link
                href="/doctor/bulk-swap"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${isActive(
                  "/bulk-swap"
                )}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-3 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"
                    clipRule="evenodd"
                  />
                </svg>
                Bulk Swap
              </Link>

              <Link
                href="/doctor/feedback"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${isActive(
                  "/feedback"
                )}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-3 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Feedback
              </Link>

              <Link
                href="/doctor/patients"
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${isActive(
                  "/patients"
                )}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-3 h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Patients
              </Link>
            </nav>

            <div className="mt-10 pt-6 border-t border-gray-100">
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 p-2 rounded-md bg-blue-600">
                    <svg
                      className="h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Need Help?
                    </h3>
                    <p className="mt-1 text-xs text-blue-700">
                      Check our documentation or contact support.
                    </p>
                    <Link
                      href="/support"
                      className="mt-2 block text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Get Support →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <main
          className={`flex-1 ${
            isSidebarOpen ? "md:ml-64" : ""
          } p-6 transition-all duration-300`}
        >
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            {children}
          </div>
        </main>
      </div>

      {/* Close modals when clicking outside */}
      {(isNotificationOpen || isProfileOpen) && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => {
            setIsNotificationOpen(false);
            setIsProfileOpen(false);
          }}
        ></div>
      )}
    </div>
  );
}
