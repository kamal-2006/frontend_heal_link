'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PatientDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const [appointmentsRes, prescriptionsRes] = await Promise.all([
          fetch('http://localhost:5000/api/v1/appointments', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:5000/api/v1/prescriptions', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const appointmentsData = await appointmentsRes.json();
        const prescriptionsData = await prescriptionsRes.json();

        if (appointmentsRes.ok) {
          setAppointments(appointmentsData.data || []);
        } else {
          console.error('Failed to fetch appointments');
        }

        if (prescriptionsRes.ok) {
          setPrescriptions(prescriptionsData.data || []);
        } else {
          console.error('Failed to fetch prescriptions');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
      
      {/* Appointments Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">My Appointments</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="px-6 py-4 text-center text-gray-500">Loading...</div>
          ) : appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center">
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                    </h4>
                    <p className="text-sm text-gray-500">{appointment.status}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(appointment.date).toLocaleDateString()} - {new Date(appointment.date).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">No upcoming appointments</div>
          )}
        </div>
      </div>

      {/* Prescriptions Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">My Prescriptions</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {isLoading ? (
            <div className="px-6 py-4 text-center text-gray-500">Loading...</div>
          ) : prescriptions.length > 0 ? (
            prescriptions.map((prescription) => (
              <div key={prescription._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-150">
                <div className="flex items-center">
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{prescription.medication}</h4>
                    <p className="text-sm text-gray-500">
                      {prescription.dosage} - {prescription.frequency}
                    </p>
                    <p className="text-sm text-gray-500">
                      Dr. {prescription.doctor.firstName} {prescription.doctor.lastName}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-4 text-center text-gray-500">No prescriptions found</div>
          )}
        </div>
      </div>
    </div>
  );
}
