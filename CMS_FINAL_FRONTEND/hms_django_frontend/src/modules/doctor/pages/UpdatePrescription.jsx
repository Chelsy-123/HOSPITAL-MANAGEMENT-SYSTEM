import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPrescriptionById, updatePrescription } from "../../../shared/api/doctorAPI";
import DoctorLayout from "../components/DoctorLayout";

const UpdatePrescription = () => {
  const { prescriptionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [consultationId, setConsultationId] = useState(null);
  
  const [form, setForm] = useState({
    general_instructions: "",
    medicines: [],
    tests: []
  });

  useEffect(() => {
    const fetchPrescription = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getPrescriptionById(prescriptionId);
        const prescription = res.data;
        
        console.log('Fetched prescription:', prescription);
        
        setConsultationId(prescription.consultation);
        setForm({
          general_instructions: prescription.general_instructions || "",
          medicines: prescription.medicines || [],
          tests: prescription.tests || []
        });
      } catch (err) {
        setError("Failed to load prescription");
        console.error('Fetch error:', err);
        console.error('Error details:', err.response?.data);
      }
      setLoading(false);
    };

    fetchPrescription();
  }, [prescriptionId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...form.medicines];
    updatedMedicines[index] = { ...updatedMedicines[index], [field]: value };
    setForm({ ...form, medicines: updatedMedicines });
  };

  const handleTestChange = (index, field, value) => {
    const updatedTests = [...form.tests];
    updatedTests[index] = { ...updatedTests[index], [field]: value };
    setForm({ ...form, tests: updatedTests });
  };

  const addMedicine = () => {
    setForm({
      ...form,
      medicines: [...form.medicines, { 
        medicinename: "", 
        dosage: "", 
        frequency: "", 
        timing: "",
        duration: "", 
        quantity: ""
      }]
    });
  };

  const removeMedicine = (index) => {
    const updatedMedicines = form.medicines.filter((_, i) => i !== index);
    setForm({ ...form, medicines: updatedMedicines });
  };

  const addTest = () => {
    setForm({
      ...form,
      tests: [...form.tests, { testname: "", instructions: "" }]
    });
  };

  const removeTest = (index) => {
    const updatedTests = form.tests.filter((_, i) => i !== index);
    setForm({ ...form, tests: updatedTests });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Validate medicines have required fields
    const incompleteMedicines = form.medicines.some(
      med => !med.medicinename || !med.dosage || !med.frequency || 
             !med.timing || !med.duration || !med.quantity
    );
    
    if (incompleteMedicines) {
      setError('Please fill all required medicine fields (name, dosage, frequency, timing, duration, quantity).');
      return;
    }

    setLoading(true);

    try {
      const data = {
        general_instructions: form.general_instructions,
        medicines: form.medicines,
        tests: form.tests
      };

      await updatePrescription(prescriptionId, data);
      console.log('Updated prescription successfully');
      
      // Redirect back to view prescription
      navigate(`/doctor/consultation/${consultationId}/prescription/view`);
    } catch (err) {
      setError(
        err.response?.data
          ? JSON.stringify(err.response.data)
          : "Could not update prescription. Please try again."
      );
      console.error('Prescription update error:', err);
    }
    
    setLoading(false);
  };

  if (loading && !form.general_instructions && form.medicines.length === 0) {
    return (
      <DoctorLayout>
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6">
          <div className="text-center text-gray-800">Loading prescription data...</div>
        </div>
      </DoctorLayout>
    );
  }

  if (error && !consultationId) {
    return (
      <DoctorLayout>
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-6">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </DoctorLayout>
    );
  }

  return (
    <DoctorLayout>
      <div className="max-w-6xl mx-auto mt-6">
        <div className="bg-white shadow-lg rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-blue-900 mb-6">Update Prescription</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Instructions */}
            <div>
              <label className="block font-semibold text-blue-900 mb-2">General Instructions</label>
              <textarea
                name="general_instructions"
                value={form.general_instructions}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-3 border border-gray-300 focus:outline-none focus:border-blue-500"
                rows="4"
                placeholder="Enter general instructions for the patient"
              />
            </div>

            {/* Medicines Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-900">💊 Medicines</h3>
                <button
                  type="button"
                  onClick={addMedicine}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm font-semibold"
                >
                  + Add Medicine
                </button>
              </div>

              {form.medicines.map((medicine, index) => (
                <div key={index} className="bg-green-50 rounded-lg p-4 mb-4 border border-green-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-green-900">Medicine {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeMedicine(index)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
                      <input
                        type="text"
                        value={medicine.medicinename || ""}
                        onChange={(e) => handleMedicineChange(index, "medicinename", e.target.value)}
                        className="w-full rounded px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                        placeholder="e.g., Paracetamol"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label>
                      <input
                        type="text"
                        value={medicine.dosage || ""}
                        onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                        placeholder="e.g., 500 mg"
                        className="w-full rounded px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label>
                      <input
                        type="text"
                        value={medicine.frequency || ""}
                        onChange={(e) => handleMedicineChange(index, "frequency", e.target.value)}
                        placeholder="e.g., Twice daily"
                        className="w-full rounded px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Timing *</label>
                      <input
                        type="text"
                        value={medicine.timing || ""}
                        onChange={(e) => handleMedicineChange(index, "timing", e.target.value)}
                        placeholder="e.g., After meals"
                        className="w-full rounded px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration *</label>
                      <input
                        type="text"
                        value={medicine.duration || ""}
                        onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                        placeholder="e.g., 7 days"
                        className="w-full rounded px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                      <input
                        type="number"
                        value={medicine.quantity || ""}
                        onChange={(e) => handleMedicineChange(index, "quantity", e.target.value)}
                        placeholder="e.g., 14"
                        min="1"
                        className="w-full rounded px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}

              {form.medicines.length === 0 && (
                <p className="text-gray-500 text-center py-4">No medicines added yet. Click "Add Medicine" to start.</p>
              )}
            </div>

            {/* Tests Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-blue-900">🔬 Laboratory Tests</h3>
                <button
                  type="button"
                  onClick={addTest}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm font-semibold"
                >
                  + Add Test
                </button>
              </div>

              {form.tests.map((test, index) => (
                <div key={index} className="bg-purple-50 rounded-lg p-4 mb-4 border border-purple-200">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-purple-900">Test {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeTest(index)}
                      className="text-red-600 hover:text-red-800 font-semibold text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Name *</label>
                      <input
                        type="text"
                        value={test.testname || ""}
                        onChange={(e) => handleTestChange(index, "testname", e.target.value)}
                        placeholder="e.g., Complete Blood Count (CBC)"
                        className="w-full rounded px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Special Instructions</label>
                      <textarea
                        value={test.instructions || ""}
                        onChange={(e) => handleTestChange(index, "instructions", e.target.value)}
                        placeholder="e.g., Fasting required for 8-12 hours"
                        className="w-full rounded px-3 py-2 border border-gray-300 focus:outline-none focus:border-blue-500"
                        rows="2"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {form.tests.length === 0 && (
                <p className="text-gray-500 text-center py-4">No tests added yet. Click "Add Test" to start.</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(consultationId ? `/doctor/consultation/${consultationId}/prescription/view` : -1)}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Prescription'}
              </button>
            </div>
          </form>

          {error && (
            <div className="bg-red-100 text-red-800 px-4 py-3 rounded-lg mt-4">
              {error}
            </div>
          )}
        </div>
      </div>
    </DoctorLayout>
  );
};

export default UpdatePrescription;
