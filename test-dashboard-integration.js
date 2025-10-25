// Test dashboard appointment count update after booking
console.log('=== TESTING APPOINTMENT DASHBOARD INTEGRATION ===\n');

// Simulate the dashboard's upcoming appointments calculation
function getUpcomingAppointments(appointments) {
  const getActualAppointmentStatus = (appointment) => {
    const appointmentDate = new Date(appointment.date);
    const now = new Date();
    
    if (appointmentDate < now && (appointment.status === 'pending' || appointment.status === 'confirmed' || appointment.status === 'scheduled')) {
      return 'completed';
    }
    
    return appointment.status;
  };

  return appointments
    .filter(app => {
      const appointmentDate = new Date(app.date);
      const now = new Date();
      const actualStatus = getActualAppointmentStatus(app);
      
      return (actualStatus === 'pending' || actualStatus === 'confirmed' || actualStatus === 'scheduled') && appointmentDate >= now;
    })
    .sort((a, b) => new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id))
    .slice(0, 3);
}

// Test data: existing appointments
const existingAppointments = [
  {
    _id: 'apt1',
    date: '2025-10-25T10:00:00Z',
    status: 'scheduled',
    doctor: { firstName: 'John', lastName: 'Doe' },
    reason: 'Checkup',
    createdAt: '2025-10-20T00:00:00Z'
  },
  {
    _id: 'apt2', 
    date: '2025-10-26T14:30:00Z',
    status: 'scheduled',
    doctor: { firstName: 'Jane', lastName: 'Smith' },
    reason: 'Follow-up',
    createdAt: '2025-10-21T00:00:00Z'
  }
];

console.log('BEFORE booking:');
console.log('- Total appointments:', existingAppointments.length);
const upcomingBefore = getUpcomingAppointments(existingAppointments);
console.log('- Upcoming appointments:', upcomingBefore.length);
console.log('- Upcoming list:', upcomingBefore.map(apt => `${apt.doctor.firstName} ${apt.doctor.lastName} on ${new Date(apt.date).toLocaleDateString()}`));

// Simulate booking a new appointment
const newAppointment = {
  _id: 'apt3',
  date: '2025-10-27T16:00:00Z',
  status: 'scheduled',
  doctor: { firstName: 'Bob', lastName: 'Wilson' },
  reason: 'Consultation',
  createdAt: new Date().toISOString()
};

console.log('\n📅 BOOKING NEW APPOINTMENT:');
console.log('- Doctor:', newAppointment.doctor.firstName, newAppointment.doctor.lastName);
console.log('- Date:', new Date(newAppointment.date).toLocaleDateString());
console.log('- Time:', new Date(newAppointment.date).toLocaleTimeString());

// Simulate dashboard update
const updatedAppointments = [...existingAppointments, newAppointment];

console.log('\nAFTER booking:');
console.log('- Total appointments:', updatedAppointments.length);
const upcomingAfter = getUpcomingAppointments(updatedAppointments);
console.log('- Upcoming appointments:', upcomingAfter.length);
console.log('- Upcoming list:', upcomingAfter.map(apt => `${apt.doctor.firstName} ${apt.doctor.lastName} on ${new Date(apt.date).toLocaleDateString()}`));

console.log('\n✅ VERIFICATION:');
console.log('- Count increased:', upcomingAfter.length > upcomingBefore.length ? 'YES' : 'NO');
console.log('- New appointment in list:', upcomingAfter.some(apt => apt._id === newAppointment._id) ? 'YES' : 'NO');
console.log('- Most recent first:', upcomingAfter[0]._id === newAppointment._id ? 'YES' : 'NO');

console.log('\n=== TEST COMPLETE ===');