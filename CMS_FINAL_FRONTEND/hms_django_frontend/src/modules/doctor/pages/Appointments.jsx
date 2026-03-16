import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../components/DoctorLayout';
import { getDoctorAppointmentsByDate } from '../../../shared/api/doctorAPI';

const formatDate = (dateObj) => dateObj.toISOString().split('T')[0];

const Appointments = () => {
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [tomorrowAppointments, setTomorrowAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      setError(null);
      try {
        const todayStr = formatDate(today);
        const tomorrowStr = formatDate(tomorrow);

        // Log the date and data for debugging
        console.log("Fetching tomorrow with:", tomorrowStr);

        const [todayData, tomorrowData] = await Promise.all([
          getDoctorAppointmentsByDate(todayStr),
          getDoctorAppointmentsByDate(tomorrowStr)
        ]);

        // Log what you get from backend
        console.log("Tomorrow data result:", tomorrowData);

        setTodayAppointments(todayData);
        setTomorrowAppointments(tomorrowData);
      } catch (err) {
        setError('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const totalToday = todayAppointments.length;
  const completedCount = todayAppointments.filter(a => a.completed).length;
  const remainingCount = totalToday - completedCount;

  return (
    <DoctorLayout>
      <h2 className="text-2xl font-bold mb-8 text-blue-900">Today's Appointments</h2>
      <div className="mb-6">
        <p className="text-base font-medium text-blue-900">Total: <span className="font-semibold">{totalToday}</span></p>
        <p className="text-base font-medium text-blue-900">Completed (Consulted): <span className="font-semibold">{completedCount}</span></p>
        <p className="text-base font-medium text-blue-900">Remaining: <span className="font-semibold">{remainingCount}</span></p>
      </div>

      <table className="w-full bg-white rounded-xl shadow overflow-hidden mb-10">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left font-semibold text-blue-900 bg-white">Patient Name</th>
            <th className="p-4 text-left font-semibold text-blue-900 bg-white">Appointment Date</th>
            <th className="p-4 text-left font-semibold text-blue-900 bg-white">Appointment Time</th>
            <th className="p-4 text-left font-semibold text-blue-900 bg-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {totalToday === 0 ? (
            <tr><td colSpan={4} className="py-8 text-center text-blue-900/70">No appointments for today</td></tr>
          ) : (
            todayAppointments.map(appt => (
              <tr key={appt.id} className="border-b hover:bg-blue-50">
                <td className="p-4 text-blue-900">{appt.patient_name}</td>
                <td className="p-4 text-blue-900">{appt.Appointment_date}</td>
                <td className="p-4 text-blue-900">{appt.Appointment_time}</td>
                <td className="p-4 text-center">
                  {!appt.completed && (
                    <button
                      className="bg-blue-900 text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-blue-800 transition"
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

      <h2 className="text-2xl font-bold mb-8 text-blue-900">Tomorrow's Appointments</h2>
      <table className="w-full bg-white rounded-xl shadow overflow-hidden">
        <thead>
          <tr className="border-b">
            <th className="p-4 text-left font-semibold text-blue-900 bg-white">Patient Name</th>
            <th className="p-4 text-left font-semibold text-blue-900 bg-white">Appointment Date</th>
            <th className="p-4 text-left font-semibold text-blue-900 bg-white">Appointment Time</th>
            <th className="p-4 text-left font-semibold text-blue-900 bg-white">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tomorrowAppointments.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-8 text-center text-blue-900/70">No appointments for tomorrow</td>
            </tr>
          ) : (
            tomorrowAppointments.map(appt => (
              <tr key={appt.id} className="border-b hover:bg-blue-50">
                <td className="p-4 text-blue-900">{appt.patient_name}</td>
                <td className="p-4 text-blue-900">{appt.Appointment_date}</td>
                <td className="p-4 text-blue-900">{appt.Appointment_time}</td>
                <td className="p-4 text-center text-blue-900">--</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {loading && <p className="mt-4">Loading...</p>}
    </DoctorLayout>
  );
};

export default Appointments;
