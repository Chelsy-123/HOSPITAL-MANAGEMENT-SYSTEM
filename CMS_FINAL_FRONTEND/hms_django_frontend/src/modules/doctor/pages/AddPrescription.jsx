import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPrescription } from '../../../shared/api/doctorAPI';
import DoctorLayout from '../components/DoctorLayout';
import MedicineDropdown from '../components/MedicineDropdown';

const AddPrescription = () => {
  const { id: consultationId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    consultation: consultationId,
    general_instructions: '',
  });

  const [medicines, setMedicines] = useState([
    { medicinename: '', dosage: '', frequency: '', timing: '', duration: '', quantity: '' }
  ]);

  const [tests, setTests] = useState([
    { testname: '', instructions: '' }
  ]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...medicines];
    updatedMedicines[index][field] = value;
    setMedicines(updatedMedicines);
  };

  const addMedicine = () => {
    setMedicines([...medicines, {
      medicinename: '', dosage: '', frequency: '', timing: '', duration: '', quantity: ''
    }]);
  };

  const removeMedicine = (index) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const handleTestChange = (index, field, value) => {
    const updatedTests = [...tests];
    updatedTests[index][field] = value;
    setTests(updatedTests);
  };

  const addTest = () => {
    setTests([...tests, { testname: '', instructions: '' }]);
  };

  const removeTest = (index) => {
    if (tests.length > 1) {
      setTests(tests.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const validMedicines = medicines.filter(m => m.medicinename.trim() !== '');
      const validTests = tests.filter(t => t.testname.trim() !== '');

      if (validMedicines.length === 0 && validTests.length === 0) {
        setError('Please add at least one medicine or lab test');
        setLoading(false);
        return;
      }

      const prescriptionData = {
        ...form,
        medicines: validMedicines,
        tests: validTests,
      };

      await createPrescription(prescriptionData);
      navigate(`/doctor/consultation/view/${consultationId}`);
    } catch (err) {
      const errorMessage = err.response?.data?.detail
        || err.response?.data?.message
        || JSON.stringify(err.response?.data)
        || 'Failed to add prescription';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DoctorLayout>
      <div className="max-w-4xl mx-auto bg-white rounded shadow-lg p-8 mt-10">
        <h2 className="text-2xl font-bold mb-6 text-blue-900">Add Prescription</h2>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* General Instructions */}
          <div>
            <label className="block mb-2 font-semibold text-blue-900">General Instructions</label>
            <textarea
              name="general_instructions"
              value={form.general_instructions}
              onChange={handleFormChange}
              className="w-full rounded bg-white p-3 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Enter general instructions for the patient"
            />
          </div>

          {/* Medicines Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-blue-900">💊 Medicines</h3>
              <button
                type="button"
                onClick={addMedicine}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
              >
                + Add Medicine
              </button>
            </div>
            {medicines.map((medicine, index) => (
              <div key={index} className="border rounded p-4 mb-3 bg-blue-50">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-medium">Medicine Name *</label>
                    <MedicineDropdown
                      value={medicine.medicinename}
                      onSelect={medicineName => handleMedicineChange(index, 'medicinename', medicineName)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-medium">Dosage *</label>
                    <input
                      type="text"
                      value={medicine.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 500mg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-medium">Frequency *</label>
                    <input
                      type="text"
                      value={medicine.frequency}
                      onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Twice a day"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-medium">Timing *</label>
                    <input
                      type="text"
                      value={medicine.timing}
                      onChange={(e) => handleMedicineChange(index, 'timing', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., After meals"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-medium">Duration *</label>
                    <input
                      type="text"
                      value={medicine.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 7 days"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-medium">Quantity *</label>
                    <input
                      type="number"
                      value={medicine.quantity}
                      onChange={(e) => handleMedicineChange(index, 'quantity', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 14"
                      min="1"
                    />
                  </div>
                </div>
                {medicines.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMedicine(index)}
                    className="mt-2 text-red-600 text-sm hover:text-red-800 font-medium"
                  >
                    ✕ Remove Medicine
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Tests Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-blue-900">🔬 Lab Tests</h3>
              <button
                type="button"
                onClick={addTest}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
              >
                + Add Test
              </button>
            </div>
            {tests.map((test, index) => (
              <div key={index} className="border rounded p-4 mb-3 bg-green-50">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-medium">Test Name *</label>
                    <input
                      type="text"
                      value={test.testname}
                      onChange={(e) => handleTestChange(index, 'testname', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Blood Test"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 font-medium">Instructions</label>
                    <input
                      type="text"
                      value={test.instructions}
                      onChange={(e) => handleTestChange(index, 'instructions', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Fasting required"
                    />
                  </div>
                </div>
                {tests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTest(index)}
                    className="mt-2 text-red-600 text-sm hover:text-red-800 font-medium"
                  >
                    ✕ Remove Test
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white px-4 py-3 rounded hover:bg-blue-800 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-lg"
          >
            {loading ? 'Submitting Prescription...' : 'Submit Prescription'}
          </button>
        </form>
      </div>
    </DoctorLayout>
  );
};

export default AddPrescription;
