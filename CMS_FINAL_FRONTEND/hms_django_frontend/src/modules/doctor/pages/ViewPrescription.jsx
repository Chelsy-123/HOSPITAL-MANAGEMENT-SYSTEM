import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPrescriptionByConsultation } from "../../../shared/api/doctorAPI";
import DoctorLayout from "../components/DoctorLayout";

const ViewPrescription = () => {
  const { consultationId } = useParams();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getPrescriptionByConsultation(consultationId);
        console.log('API Response:', res);
        console.log('Response data:', res.data);
        
        // Handle different response formats
        let prescriptionData = [];
        
        if (Array.isArray(res.data)) {
          // Direct array response
          prescriptionData = res.data;
        } else if (res.data && Array.isArray(res.data.results)) {
          // Paginated response
          prescriptionData = res.data.results;
        } else if (res.data && typeof res.data === 'object') {
          // Single object response
          prescriptionData = [res.data];
        }
        
        console.log('Processed prescriptions:', prescriptionData);
        setPrescriptions(prescriptionData);
      } catch (err) {
        console.error('Fetch error:', err);
        console.error('Error response:', err.response);
        setError("Failed to load prescriptions");
      }
      setLoading(false);
    };

    fetchPrescriptions();
  }, [consultationId]);

  if (loading) {
    return (
      <DoctorLayout>
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6">
          <div className="text-center text-gray-800">Loading prescriptions...</div>
        </div>
      </DoctorLayout>
    );
  }

  if (error) {
    return (
      <DoctorLayout>
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6">
          <div className="text-red-600">{error}</div>
          <button
            onClick={() => navigate(`/doctor/consultation/view/${consultationId}`)}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Consultation
          </button>
        </div>
      </DoctorLayout>
    );
  }

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <DoctorLayout>
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">No Prescriptions Found</h2>
          <p className="text-gray-600 mb-6">No prescriptions have been added for this consultation yet.</p>
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/doctor/consultation/view/${consultationId}`)}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold"
            >
              Back to Consultation
            </button>
            <button
              onClick={() => navigate(`/doctor/consultation/${consultationId}/prescription/add`)}
              className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 font-semibold"
            >
              Add Prescription
            </button>
          </div>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="max-w-6xl mx-auto mt-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-blue-900">Prescription Details</h2>
              <p className="text-gray-600 mt-1">Consultation ID: #{consultationId}</p>
            </div>
            <button
              onClick={() => navigate(`/doctor/consultation/view/${consultationId}`)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 font-semibold text-sm"
            >
              ← Back to Consultation
            </button>
          </div>
        </div>

        {/* Prescriptions List */}
        {prescriptions.map((prescription, index) => {
          const medicines = prescription.medicines || [];
          const tests = prescription.tests || [];

          return (
            <div key={prescription.prescriptionid || index} className="bg-white shadow-md rounded-xl p-6">
              {/* Prescription Header */}
              <div className="flex items-start justify-between mb-6 pb-4 border-b-2 border-blue-100">
                <div>
                  <h3 className="text-xl font-semibold text-blue-900">
                    Prescription #{prescription.prescriptionid}
                  </h3>
                  <div className="flex gap-6 mt-2 text-sm">
                    <div>
                      <span className="text-gray-600">Date: </span>
                      <span className="text-gray-800 font-medium">
                        {prescription.prescriptiondate || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Doctor: </span>
                      <span className="text-gray-800 font-medium">
                        {prescription.doctorname || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/doctor/prescription/update/${prescription.prescriptionid}`)}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 font-semibold text-sm transition-colors"
                >
                  Update Prescription
                </button>
              </div>

              {/* General Instructions */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">General Instructions:</h4>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <p className="text-gray-800">
                    {prescription.general_instructions || 'No general instructions provided'}
                  </p>
                </div>
              </div>

              {/* Medicines Section */}
              {medicines && medicines.length > 0 ? (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">💊</span>
                    <h4 className="text-lg font-semibold text-blue-800">
                      Medicines ({medicines.length})
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {medicines.map((medicine, idx) => (
                      <div key={idx} className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-blue-900 font-bold text-lg mb-2">
                              {medicine.medicinename}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Dosage:</span> {medicine.dosage}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Frequency:</span> {medicine.frequency}
                            </p>
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Duration:</span> {medicine.duration}
                            </p>
                          </div>
                        </div>
                        
                        {/* Additional Fields */}
                        <div className="mt-3 pt-3 border-t border-green-300 grid grid-cols-2 gap-2">
                          {medicine.timing && (
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Timing:</span> {medicine.timing}
                            </p>
                          )}
                          {medicine.quantity && (
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Quantity:</span> {medicine.quantity}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-600 text-center">No medicines prescribed</p>
                </div>
              )}

              {/* Tests Section */}
              {tests && tests.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">🔬</span>
                    <h4 className="text-lg font-semibold text-blue-800">
                      Laboratory Tests ({tests.length})
                    </h4>
                  </div>
                  <div className="space-y-3">
                    {tests.map((test, idx) => (
                      <div key={idx} className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <p className="text-blue-900 font-bold text-lg mb-2">
                          {test.testname}
                        </p>
                        {test.instructions && (
                          <p className="text-sm text-gray-700">
                            <span className="font-semibold">Instructions:</span> {test.instructions}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-600 text-center">No tests prescribed</p>
                </div>
              )}
            </div>
          );
        })}

        {/* Action Buttons */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`/doctor/consultation/view/${consultationId}`)}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-semibold transition-colors"
            >
              Back to Consultation
            </button>
            <button
              onClick={() => navigate(`/doctor/consultation/${consultationId}/prescription/add`)}
              className="flex-1 bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 font-semibold transition-colors"
            >
              Add New Prescription
            </button>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default ViewPrescription;
