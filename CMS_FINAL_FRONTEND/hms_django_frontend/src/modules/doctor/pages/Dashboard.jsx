import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorNavbar from '../components/DoctorNavbar';
import DoctorSidebar from '../components/DoctorSidebar';
import { getTodayAppointments, getDoctorProfile } from '../../../shared/api/doctorAPI';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [showAppointments, setShowAppointments] = useState(false);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch doctor profile and today's appointments
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch profile for specialization
        const profileData = await getDoctorProfile();
        setDoctorProfile(profileData.data);

        // Fetch today's appointments
        const appointmentsData = await getTodayAppointments();
        setTodayAppointments(appointmentsData);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const todayStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const doctorName = doctorProfile 
    ? `${doctorProfile.first_name} ${doctorProfile.last_name}`.trim() || doctorProfile.username
    : "Doctor";

  return (
    <>
      <DoctorNavbar/>
      <div className="flex bg-blue-50 min-h-screen">
        <DoctorSidebar />
        <main className="flex-1 p-10">
          {/* Welcome message */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Welcome, {doctorName}!
            </h2>
            <div className="text-blue-900 mb-1">
              Specialization: <span className="font-semibold">
                {doctorProfile?.specialization || "N/A"}
              </span>
            </div>
            <div className="text-blue-900">
              Today's Date: <span className="font-semibold">{todayStr}</span>
            </div>
          </div>

          <button
            className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-800 focus:outline-none mb-9"
            onClick={() => setShowAppointments(!showAppointments)}
          >
            View Today's Appointments
          </button>

          {loading && <p className="text-blue-900">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {showAppointments && !loading && !error && (
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
              <h3 className="font-bold text-lg text-blue-900 mb-6">Today's Appointments</h3>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-blue-900 border-b">
                    <th className="py-2 px-4 font-semibold">Patient Name</th>
                    <th className="py-2 px-4 font-semibold">Appointment Date</th>
                    <th className="py-2 px-4 font-semibold">Appointment Time</th>
                    <th className="py-2 px-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todayAppointments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-blue-900/60">
                        No appointments for today
                      </td>
                    </tr>
                  ) : (
                    todayAppointments.map(appt => (
                      <tr key={appt.id} className="hover:bg-blue-50">
                        <td className="py-2 px-4 text-blue-900">{appt.patient_name}</td>
                        <td className="py-2 px-4 text-blue-900">{appt.Appointment_date}</td>
                        <td className="py-2 px-4 text-blue-900">{appt.Appointment_time}</td>
                        <td className="py-2 px-4 text-center">
                          {appt.completed ? (
  <span className="inline-block bg-green-100 text-green-800 px-3 py-2 rounded font-semibold shadow" disabled>
    Completed
  </span>
) : (
    <button
      className="bg-blue-900 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 shadow transition"
      onClick={() => navigate(`/doctor/consultation/create?appointment=${appt.id}`)}
    >
      Create Consultation
    </button>
  )}

                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default DoctorDashboard;
