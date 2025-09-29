'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MedicationsPage() {
  const router = useRouter();
  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMedicationModal, setShowMedicationModal] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [activeFilter, setActiveFilter] = useState('active');

  useEffect(() => {
    const fetchMedications = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // In a real app, this would be an API call to fetch medications
        // For now, we'll simulate with mock data
        setTimeout(() => {
          const mockMedications = [
            {
              _id: 'm1',
              name: 'Amoxicillin',
              dosage: '500mg',
              frequency: 'Three times daily',
              startDate: '2023-10-01',
              endDate: '2023-10-14',
              status: 'active',
              instructions: 'Take with food. Complete the full course even if you feel better.',
              prescribedBy: 'Dr. John Smith',
              refillsRemaining: 0,
              sideEffects: 'May cause nausea, diarrhea, or rash.'
            },
            {
              _id: 'm2',
              name: 'Lisinopril',
              dosage: '10mg',
              frequency: 'Once daily',
              startDate: '2023-09-15',
              endDate: '2024-03-15',
              status: 'active',
              instructions: 'Take in the morning. Monitor blood pressure regularly.',
              prescribedBy: 'Dr. Sarah Johnson',
              refillsRemaining: 5,
              sideEffects: 'May cause dizziness, headache, or dry cough.'
            },
            {
              _id: 'm3',
              name: 'Ibuprofen',
              dosage: '400mg',
              frequency: 'As needed for pain',
              startDate: '2023-08-20',
              endDate: '2023-09-03',
              status: 'completed',
              instructions: 'Take with food. Do not exceed 1200mg in 24 hours.',
              prescribedBy: 'Dr. Michael Chen',
              refillsRemaining: 0,
              sideEffects: 'May cause stomach upset, heartburn, or dizziness.'
            },
            {
              _id: 'm4',
              name: 'Atorvastatin',
              dosage: '20mg',
              frequency: 'Once daily at bedtime',
              startDate: '2023-07-10',
              endDate: '2024-01-10',
              status: 'active',
              instructions: 'Take at bedtime. Avoid grapefruit juice.',
              prescribedBy: 'Dr. Emily Wilson',
              refillsRemaining: 3,
              sideEffects: 'May cause muscle pain, weakness, or liver problems.'
            },
            {
              _id: 'm5',
              name: 'Prednisone',
              dosage: '10mg tapering dose',
              frequency: 'As directed',
              startDate: '2023-06-15',
              endDate: '2023-06-29',
              status: 'completed',
              instructions: 'Take with food. Follow tapering schedule exactly.',
              prescribedBy: 'Dr. Robert Lee',
              refillsRemaining: 0,
              sideEffects: 'May cause increased appetite, mood changes, or insomnia.'
            }
          ];

          setMedications(mockMedications);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching medications:', error);
        setIsLoading(false);
      }
    };

    fetchMedications();
  }, [router]);

  const handleViewMedication = (medication) => {
    setSelectedMedication(medication);
    setShowMedicationModal(true);
  };

  // Filter medications based on active filter
  const filteredMedications = medications.filter(medication => {
    if (activeFilter === 'all') return true;
    return medication.status === activeFilter;
  });

  // Calculate days remaining for active medications
  const calculateDaysRemaining = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Check if medication needs refill soon (within 7 days)
  const needsRefillSoon = (medication) => {
    if (medication.status !== 'active') return false;
    if (medication.refillsRemaining <= 0) return false;
    
    const daysRemaining = calculateDaysRemaining(medication.endDate);
    return daysRemaining <= 7 && daysRemaining > 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Medications</h1>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </span>
          <input 
            type="search" 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search medications..."
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          {['active', 'completed', 'all'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeFilter === filter
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Medications Table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medication
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dosage
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Frequency
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  <div className="mt-2">Loading medications...</div>
                </td>
              </tr>
            ) : filteredMedications.length > 0 ? (
              filteredMedications.map((medication) => (
                <tr key={medication._id} className={`hover:bg-gray-50 ${needsRefillSoon(medication) ? 'bg-yellow-50' : ''}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {medication.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Prescribed by {medication.prescribedBy}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medication.dosage}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {medication.frequency}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(medication.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(medication.endDate).toLocaleDateString()}
                    {medication.status === 'active' && (
                      <div className="text-xs text-blue-600">
                        {calculateDaysRemaining(medication.endDate)} days remaining
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      medication.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {medication.status.charAt(0).toUpperCase() + medication.status.slice(1)}
                    </span>
                    {needsRefillSoon(medication) && (
                      <span className="ml-2 px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Refill Soon
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewMedication(medication)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                      title="View Medication Details"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  No medications found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Medication Detail Modal */}
      {showMedicationModal && selectedMedication && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{selectedMedication.name}</h3>
                <button
                  onClick={() => setShowMedicationModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Dosage</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedMedication.dosage}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Frequency</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedMedication.frequency}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Start Date</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedMedication.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">End Date</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(selectedMedication.endDate).toLocaleDateString()}
                    {selectedMedication.status === 'active' && (
                      <span className="ml-2 text-xs text-blue-600">
                        ({calculateDaysRemaining(selectedMedication.endDate)} days remaining)
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Prescribed By</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedMedication.prescribedBy}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Refills Remaining</p>
                  <p className="mt-1 text-sm text-gray-900">{selectedMedication.refillsRemaining}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Instructions</p>
                <p className="mt-1 text-sm text-gray-900">{selectedMedication.instructions}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-500">Possible Side Effects</p>
                <p className="mt-1 text-sm text-gray-900">{selectedMedication.sideEffects}</p>
              </div>
              
              {selectedMedication.status === 'active' && selectedMedication.refillsRemaining > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Refill Information</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          You have {selectedMedication.refillsRemaining} refill(s) remaining. 
                          {needsRefillSoon(selectedMedication) && ' Consider requesting a refill soon.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              {selectedMedication.status === 'active' && selectedMedication.refillsRemaining > 0 && (
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Request Refill
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}