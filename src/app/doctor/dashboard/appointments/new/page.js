'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { get, post } from '@/utils/api';
import useUser from '../../../../../hooks/useUser';

export default function NewAppointment() {
  const router = useRouter();
  const { user } = useUser();
  const [formData, setFormData] = useState({
    patient: '',
    date: '',
  });
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPatients, setIsFetchingPatients] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await get('/patients');
        if (data.success) {
          setPatients(data.data || []);
        } else {
          // Do nothing
        }
      } catch (error) {
        // Do nothing
      } finally {
        setIsFetchingPatients(false);
      }
    };

    fetchPatients();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await post('/appointments/book', {
        ...formData,
        doctor: user._id,
      });

      if (response.success) {
        alert('Appointment created successfully!');
        router.push('/doctor/dashboard/appointments');
      } else {
        alert(response.error || 'Something went wrong');
      }
    } catch (error) {
      // Do nothing
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">New Appointment</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-2">
              Patient
            </label>
            {isFetchingPatients ? (
              <p>Loading patients...</p>
            ) : (
              <select
                id="patient"
                name="patient"
                value={formData.patient}
                onChange={handleInputChange}
                required
                className="w-full pl-3 pr-8 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="" disabled>Select a patient</option>
                {patients.map((p) => (
                  <option key={p._id} value={p.user._id}>
                    {p.user.firstName} {p.user.lastName}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date and Time
            </label>
            <input
              id="date"
              name="date"
              type="datetime-local"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading || isFetchingPatients}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
            >
              {isLoading ? 'Creating...' : 'Create Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
