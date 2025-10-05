"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// import { get } from "@/utils/api";

export default function ReportsPage() {
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // In a real app, this would be an API call to fetch reports
        // For now, we'll simulate with mock data
        // setTimeout(() => {
        const mockReports = [
          {
            _id: "r1",
            reportId: "LAB-2023-001",
            date: "2023-10-15T10:30:00",
            doctorName: "Dr. John Smith",
            type: "Lab",
            status: "new",
            title: "Complete Blood Count (CBC)",
            fileUrl: "/reports/cbc.pdf",
            description: "Routine blood work to check overall health",
          },
          {
            _id: "r2",
            reportId: "SCAN-2023-002",
            date: "2023-09-22T14:15:00",
            doctorName: "Dr. Sarah Johnson",
            type: "Scan",
            status: "viewed",
            title: "Chest X-Ray",
            fileUrl: "/reports/xray.pdf",
            description: "Chest X-ray to check for pneumonia",
          },
          {
            _id: "r3",
            reportId: "PRESC-2023-003",
            date: "2023-08-05T09:45:00",
            doctorName: "Dr. Michael Chen",
            type: "Prescription",
            status: "new",
            title: "Antibiotic Prescription",
            fileUrl: "/reports/prescription.pdf",
            description: "Prescription for respiratory infection",
          },
          {
            _id: "r4",
            reportId: "LAB-2023-004",
            date: "2023-07-18T16:00:00",
            doctorName: "Dr. Emily Wilson",
            type: "Lab",
            status: "viewed",
            title: "Lipid Panel",
            fileUrl: "/reports/lipid.pdf",
            description: "Cholesterol and triglycerides test",
          },
          {
            _id: "r5",
            reportId: "OTHER-2023-005",
            date: "2023-06-30T11:20:00",
            doctorName: "Dr. Robert Lee",
            type: "Other",
            status: "new",
            title: "Physical Therapy Plan",
            fileUrl: "/reports/pt_plan.pdf",
            description: "Rehabilitation plan for knee injury",
          },
        ];

        setReports(mockReports);
        setIsLoading(false);
        // }, 1000);
      } catch (error) {
        console.error("Error fetching reports:", error);
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [router]);

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);

    // In a real app, we would update the report status to 'viewed' via API
    // For now, we'll just update it in our local state
    if (report.status === "new") {
      const updatedReports = reports.map((r) => {
        if (r._id === report._id) {
          return { ...r, status: "viewed" };
        }
        return r;
      });
      setReports(updatedReports);
    }
  };

  const handleDownload = (report) => {
    // In a real app, this would trigger a file download
    // For now, we'll just log it
    console.log(`Downloading report: ${report.title}`);
    alert(`Downloading ${report.title}`);

    // Update status to viewed
    if (report.status === "new") {
      const updatedReports = reports.map((r) => {
        if (r._id === report._id) {
          return { ...r, status: "viewed" };
        }
        return r;
      });
      setReports(updatedReports);
    }
  };

  // Filter reports based on active filter
  const filteredReports = reports.filter((report) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "new") return report.status === "new";
    return report.type.toLowerCase() === activeFilter.toLowerCase();
  });

  // Get status badge color
  const getStatusColor = (status) => {
    return status === "new"
      ? "bg-blue-100 text-blue-800"
      : "bg-gray-100 text-gray-800";
  };

  // Get type badge color
  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "lab":
        return "bg-purple-100 text-purple-800";
      case "scan":
        return "bg-green-100 text-green-800";
      case "prescription":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Reports</h1>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </span>
          <input
            type="search"
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search reports..."
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          {["all", "new", "lab", "scan", "prescription", "other"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeFilter === filter
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            )
          )}
        </nav>
      </div>

      {/* Reports Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Report ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Doctor
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                  <div className="mt-2">Loading reports...</div>
                </td>
              </tr>
            ) : filteredReports.length > 0 ? (
              filteredReports.map((report) => (
                <tr key={report._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {report.reportId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(report.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.doctorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                        report.type
                      )}`}
                    >
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {report.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status === "new" ? "New" : "Viewed"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleViewReport(report)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                        title="View Report"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDownload(report)}
                        className="text-green-600 hover:text-green-900"
                      >
                        Download
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No reports found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Report View Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedReport.title}
                </h3>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg
                    className="h-6 w-6"
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
            </div>

            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Report ID</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedReport.reportId}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedReport.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Doctor</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {selectedReport.doctorName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <span
                    className={`mt-1 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(
                      selectedReport.type
                    )}`}
                  >
                    {selectedReport.type}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="mt-1 text-sm text-gray-900">
                  {selectedReport.description}
                </p>
              </div>

              <div className="border rounded-lg p-4 bg-gray-50 mb-6">
                <div className="flex items-center justify-center h-64 bg-gray-200 rounded">
                  {/* In a real app, this would be a PDF viewer or image preview */}
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">
                      {selectedReport.type === "Prescription"
                        ? "Prescription Document"
                        : "Report Document"}
                    </p>
                    <p className="text-xs text-gray-400">
                      (Preview not available in this demo)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => handleDownload(selectedReport)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
