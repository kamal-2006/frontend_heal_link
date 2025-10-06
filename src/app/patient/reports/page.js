"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReportsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Reports</h1>
          <p className="text-sm text-gray-500">Upload and manage medical documents</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Upload Report
        </button>
      </div>

      <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
        <p className="text-sm font-medium">
          Reports system ready! Backend API fully implemented.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Medical Reports Management
          </h2>
          <p className="text-gray-600 mb-8">
            Upload, organize, and manage medical reports securely.
          </p>
        </div>
      </div>
    </div>
  );
}
