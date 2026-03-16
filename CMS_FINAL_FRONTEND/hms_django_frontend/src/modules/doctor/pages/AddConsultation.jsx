import { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../shared/context/AuthContext";
import { createConsultation, getConsultationById, updateConsultation } from "../../../shared/api/doctorAPI";
import DoctorLayout from "../components/DoctorLayout";


function useQuery() {
  return new URLSearchParams(useLocation().search);
}


const AddConsultation = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get consultation ID if updating
  const isUpdateMode = Boolean(id); // Determine if we're in update mode
  
  const [form, setForm] = useState({
    symptoms: "",
    diagnosis: "",
    consultation_notes: "",
    status: "SCHEDULED",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const query = useQuery();
  const appointmentId = query.get("appointment");
  const { user } = useAuth();


  // Fetch existing consultation data if in update mode
  useEffect(() => {
    const fetchConsultation = async () => {
      if (isUpdateMode) {
        setLoading(true);
        try {
          const res = await getConsultationById(id);
          const consultation = res.data;
          
          // Pre-fill the form with existing data
          setForm({
            symptoms: consultation.symptoms || "",
            diagnosis: consultation.diagnosis || "",
            consultation_notes: consultation.consultation_notes || "",
            status: consultation.status || "SCHEDULED",
          });
        } catch (err) {
          setError("Failed to load consultation data");
          console.error('Fetch error:', err);
        }
        setLoading(false);
      }
    };
    
    fetchConsultation();
  }, [id, isUpdateMode]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      if (isUpdateMode) {
        // Update existing consultation
        const data = {
          symptoms: form.symptoms,
          diagnosis: form.diagnosis,
          consultation_notes: form.consultation_notes,
          status: form.status,
        };
        
        const res = await updateConsultation(id, data);
        console.log('Updated consultation:', res.data);
        
        // Redirect back to view consultation
        navigate(`/doctor/consultation/view/${id}`);
      } else {
        // Create new consultation
        const data = {
          symptoms: form.symptoms,
          diagnosis: form.diagnosis,
          consultation_notes: form.consultation_notes,
          status: form.status,
          appointment: appointmentId,
        };
        
        const res = await createConsultation(data);
        console.log('Created consultation:', res.data);
        
        // Redirect to view consultation
        const newConsultationId = res.data.consultationid;
        navigate(`/doctor/consultation/view/${newConsultationId}`);
      }
    } catch (err) {
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : `Could not ${isUpdateMode ? 'update' : 'create'} consultation. Please try again.`
      );
      console.error('Consultation error:', err);
    }
    
    setLoading(false);
  };


  if (loading && isUpdateMode) {
    return (
      <DoctorLayout>
        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
          <div className="text-center text-gray-800">Loading consultation data...</div>
        </div>
      </DoctorLayout>
    );
  }


  return (
    <DoctorLayout>
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      <h2 className="text-2xl font-bold text-blue-900 mb-6">
        {isUpdateMode ? 'Update Consultation' : 'Create Consultation'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block font-semibold text-blue-900 mb-1">Symptoms</label>
          <textarea
            name="symptoms"
            value={form.symptoms}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
            required
            rows="3"
          />
        </div>
        
        <div className="mb-5">
          <label className="block font-semibold text-blue-900 mb-1">Diagnosis</label>
          <textarea
            name="diagnosis"
            value={form.diagnosis}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
            required
            rows="3"
          />
        </div>
        
        <div className="mb-5">
          <label className="block font-semibold text-blue-900 mb-1">Consultation Notes</label>
          <textarea
            name="consultation_notes"
            value={form.consultation_notes}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
            rows="4"
          />
        </div>
        
        <div className="mb-6">
          <label className="block font-semibold text-blue-900 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded px-4 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
            required
          >
            <option value="SCHEDULED">SCHEDULED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(isUpdateMode ? `/doctor/consultation/view/${id}` : -1)}
            className="flex-1 bg-gray-400 text-white py-3 rounded-lg font-semibold shadow hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-semibold shadow hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : (isUpdateMode ? 'Update Consultation' : 'Save Consultation')}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="bg-red-100 text-red-800 px-4 py-2 rounded mt-4">
          {error}
        </div>
      )}
    </div>
    </DoctorLayout>
  );
};


export default AddConsultation;
