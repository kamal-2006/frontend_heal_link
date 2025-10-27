"use client";

import { useEffect, useState } from "react";

import { API_CONFIG } from "@/config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export default function NurseTable() {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchNurses();
  }, []);

  const fetchNurses = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/nurse/admin/all`);
      if (!res.ok) throw new Error("Failed to fetch nurses");
      const data = await res.json();
      setNurses(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewNurse = async (nurseId) => {
    setShowModal(true);
    setModalLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/nurse/admin/all`);
      if (!res.ok) throw new Error("Failed to fetch nurse details");
      const data = await res.json();
      const nurse = (data.data || []).find(n => n._id === nurseId);
      setSelectedNurse(nurse);
    } catch (err) {
      setSelectedNurse(null);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading nurses...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Shift</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {nurses.map((nurse) => (
                <tr key={nurse._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{nurse.user?.firstName} {nurse.user?.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{nurse.user?.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{nurse.user?.phone}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{nurse.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{nurse.shift}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${nurse.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{nurse.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button onClick={() => handleViewNurse(nurse._id)} className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50" title="View nurse details">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Nurse Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {modalLoading ? (
              <div>Loading nurse details...</div>
            ) : selectedNurse ? (
              <div>
                <h2 className="text-2xl font-bold mb-4">Nurse Details</h2>
                <div className="mb-2"><span className="font-semibold">Name:</span> {selectedNurse.user?.firstName} {selectedNurse.user?.lastName}</div>
                <div className="mb-2"><span className="font-semibold">Email:</span> {selectedNurse.user?.email}</div>
                <div className="mb-2"><span className="font-semibold">Phone:</span> {selectedNurse.user?.phone}</div>
                <div className="mb-2"><span className="font-semibold">Department:</span> {selectedNurse.department}</div>
                <div className="mb-2"><span className="font-semibold">Shift:</span> {selectedNurse.shift}</div>
                <div className="mb-2"><span className="font-semibold">License Number:</span> {selectedNurse.licenseNumber}</div>
                <div className="mb-2"><span className="font-semibold">Qualification:</span> {selectedNurse.qualification}</div>
                <div className="mb-2"><span className="font-semibold">Experience:</span> {selectedNurse.experience} years</div>
                <div className="mb-2"><span className="font-semibold">Specialization:</span> {selectedNurse.specialization}</div>
                <div className="mb-2"><span className="font-semibold">Status:</span> {selectedNurse.isActive ? 'Active' : 'Inactive'}</div>
              </div>
            ) : (
              <div className="text-red-500">Failed to load nurse details.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
