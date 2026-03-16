import React, { useEffect, useState } from 'react';
import { getPrescriptionByConsultation } from '../../../shared/api/doctorAPI';

const PrescriptionList = ({ consultationId }) => {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const res = await getPrescriptionByConsultation(consultationId);
        console.log('Prescription response:', res.data); // ✅ Debug log
        // Since it's OneToOne, get the first result
        if (res.data && res.data.length > 0) {
          setPrescription(res.data[0]);
        } else {
          setPrescription(null);
        }
      } catch (err) {
        console.error('Failed to load prescription:', err);
        setError('Failed to load prescription');
        setPrescription(null);
      }
      setLoading(false);
    }
    load();
  }, [consultationId]);

  if (loading) {
    return (
      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-900">Prescription</h3>
        <div className="text-gray-600">Loading prescription...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-900">Prescription</h3>
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!prescription) {
    return (
      <div className="mt-8 border-t pt-6">
        <h3 className="text-xl font-semibold mb-4 text-blue-900">Prescription</h3>
        <div className="text-gray-600 bg-gray-50 p-4 rounded">
          No prescription added yet for this consultation.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-xl font-semibold mb-4 text-blue-900">Prescription Details</h3>
      
      <div className="bg-gray-50 p-6 rounded-lg space-y-4 border">
        {/* General Info */}
        <div className="bg-white p-4 rounded border">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="font-semibold text-gray-700">Date:</span>
              <span className="ml-2 text-gray-800">{prescription.prescriptiondate || 'N/A'}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Doctor:</span>
              <span className="ml-2 text-gray-800">{prescription.doctorname || 'N/A'}</span>
            </div>
          </div>
          {prescription.general_instructions && (
            <div className="mt-3 pt-3 border-t">
              <div className="font-semibold text-gray-700 mb-1">General Instructions:</div>
              <p className="text-gray-800 bg-blue-50 p-3 rounded">{prescription.general_instructions}</p>
            </div>
          )}
        </div>

        {/* Medicines */}
        {prescription.medicines && prescription.medicines.length > 0 && (
          <div>
            <h4 className="font-semibold text-lg mb-3 text-blue-900">💊 Medicines</h4>
            <div className="space-y-3">
              {prescription.medicines.map((med, idx) => (
                <div key={idx} className="bg-white p-4 rounded border border-blue-200">
                  <div className="font-semibold text-blue-900 text-lg mb-2">{med.medicinename}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Dosage:</span>
                      <span className="ml-2 text-gray-800">{med.dosage}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Frequency:</span>
                      <span className="ml-2 text-gray-800">{med.frequency}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Timing:</span>
                      <span className="ml-2 text-gray-800">{med.timing}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Duration:</span>
                      <span className="ml-2 text-gray-800">{med.duration}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Quantity:</span>
                      <span className="ml-2 text-gray-800">{med.quantity}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tests */}
        {prescription.tests && prescription.tests.length > 0 && (
          <div>
            <h4 className="font-semibold text-lg mb-3 text-blue-900">🔬 Lab Tests</h4>
            <div className="space-y-3">
              {prescription.tests.map((test, idx) => (
                <div key={idx} className="bg-white p-4 rounded border border-green-200">
                  <div className="font-semibold text-green-900 text-lg">{test.testname}</div>
                  {test.instructions && (
                    <div className="text-sm text-gray-700 mt-2 bg-green-50 p-2 rounded">
                      <span className="font-medium">Instructions:</span> {test.instructions}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionList;
