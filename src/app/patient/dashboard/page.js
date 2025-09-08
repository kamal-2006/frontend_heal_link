export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
      <p className="text-gray-600">Welcome to your health dashboard</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/patient/dashboard/book" className="block p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
              Book an Appointment
            </a>
            <a href="/patient/dashboard/appointments" className="block p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
              View Appointments
            </a>
            <a href="/patient/dashboard/feedback" className="block p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100">
              Submit Feedback
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}