import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getConsultationById } from "../../../shared/api/doctorAPI";
import DoctorLayout from "../components/DoctorLayout";


const ViewConsultation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchConsultation = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getConsultationById(id);
        console.log('Fetched consultation:', res.data);
        setConsultation(res.data);
      } catch (err) {
        setError("Failed to load consultation");
        console.error('Fetch error:', err);
      }
      setLoading(false);
    };
    fetchConsultation();
  }, [id]);


  if (loading) {
    return (
      <DoctorLayout>
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6">
          <div className="text-center text-gray-800">Loading...</div>
        </div>
      </DoctorLayout>
    );
  }


  if (error) {
    return (
      <DoctorLayout>
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6">
          <div className="text-red-600">{error}</div>
        </div>
      </DoctorLayout>
    );
  }


  if (!consultation) {
    return (
      <DoctorLayout>
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6">
          <div className="text-gray-800">No consultation data found.</div>
        </div>
      </DoctorLayout>
    );
  }

  // Status color mapping
  const statusColors = {
    'COMPLETED': 'bg-green-100 text-green-800 border-green-200',
    'IN_PROGRESS': 'bg-blue-100 text-blue-800 border-blue-200',
    'SCHEDULED': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'CANCELLED': 'bg-red-100 text-red-800 border-red-200'
  };

  const statusColor = statusColors[consultation.status] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <DoctorLayout>
      <div className="max-w-6xl mx-auto mt-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-blue-900">Consultation Details</h2>
              <p className="text-gray-600 mt-1">ID: #{consultation.consultationid}</p>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColor}`}>
                {consultation.status || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Patient & Doctor Info */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-4 pb-2 border-b-2 border-blue-100">
              Patient & Doctor Information
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-32 flex-shrink-0">
                  <strong className="text-blue-800 text-sm">Patient Name:</strong>
                </div>
                <div className="flex-1">
                  <span className="text-gray-800 font-medium">{consultation.patientname || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-32 flex-shrink-0">
                  <strong className="text-blue-800 text-sm">Patient Age:</strong>
                </div>
                <div className="flex-1">
                  <span className="text-gray-800 font-medium">{consultation.patientage ?? 'N/A'} years</span>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-32 flex-shrink-0">
                  <strong className="text-blue-800 text-sm">Doctor:</strong>
                </div>
                <div className="flex-1">
                  <span className="text-gray-800 font-medium">{consultation.doctorname || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-32 flex-shrink-0">
                  <strong className="text-blue-800 text-sm">Date:</strong>
                </div>
                <div className="flex-1">
                  <span className="text-gray-800 font-medium">{consultation.consultationdate || 'N/A'}</span>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-32 flex-shrink-0">
                  <strong className="text-blue-800 text-sm">Time:</strong>
                </div>
                <div className="flex-1">
                  <span className="text-gray-800 font-medium">{consultation.consultationtime || 'N/A'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Medical Details */}
          <div className="bg-white shadow-md rounded-xl p-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-4 pb-2 border-b-2 border-blue-100">
              Medical Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <strong className="text-blue-800 text-sm block mb-1">Symptoms:</strong>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                  <p className="text-gray-800 text-sm">{consultation.symptoms || 'N/A'}</p>
                </div>
              </div>

              <div>
                <strong className="text-blue-800 text-sm block mb-1">Diagnosis:</strong>
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <p className="text-gray-800 text-sm font-medium">{consultation.diagnosis || 'N/A'}</p>
                </div>
              </div>

              <div>
                <strong className="text-blue-800 text-sm block mb-1">Consultation Notes:</strong>
                <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
                  <p className="text-gray-800 text-sm">{consultation.consultation_notes || 'No additional notes'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 font-semibold transition-colors shadow-sm hover:shadow-md"
              onClick={() => navigate(`/doctor/consultation/update/${consultation.consultationid}`)}
            >
              Update Consultation
            </button>
            
              <button
    className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold transition-colors shadow-sm hover:shadow-md"
    onClick={() => navigate(`/doctor/consultation/${consultation.consultationid}/prescription/view`)}
  >
    View Prescription
  </button>
            
            <button
              className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 font-semibold transition-colors shadow-sm hover:shadow-md"
              onClick={() => navigate(`/doctor/consultation/${consultation.consultationid}/prescription/add`)}
            >
              Add Prescription
            </button>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};


export default ViewConsultation;
