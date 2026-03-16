import { useState, useEffect } from "react";
import DoctorLayout from "../components/DoctorLayout";
import { getConsultations, getConsultationPrescription } from "../../../shared/api/doctorAPI";

const PatientConsultations = () => {
  const [consultations, setConsultations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [sortAsc, setSortAsc] = useState(false);
  const [loading, setLoading] = useState(true);

  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [prescription, setPrescription] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    getConsultations()
      .then(res => {
        setConsultations(res.data);
        setFiltered(res.data);
      })
      .catch(err => {
        setConsultations([]);
        setFiltered([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let temp = [...consultations];

    if (patientId.trim()) {
      temp = temp.filter(c =>
        c.patientid?.toString().includes(patientId.trim())
      );
    }
    if (date) {
      temp = temp.filter(c => c.consultationdate === date);
    }
    temp.sort((a, b) => {
      const aDate = new Date(a.consultationdate);
      const bDate = new Date(b.consultationdate);
      return sortAsc ? aDate - bDate : bDate - aDate;
    });

    setFiltered(temp);
  }, [patientId, date, sortAsc, consultations]);

  const handleViewDetails = (consultation) => {
    setSelectedConsultation(consultation);
    setShowModal(true);
    setPrescription(null);
    setLoadingDetails(true);
    getConsultationPrescription(consultation.consultationid)
      .then(res => setPrescription(res.data))
      .catch(() => setPrescription(null))
      .finally(() => setLoadingDetails(false));
  };

  if (loading) {
    return <p>Loading consultations...</p>;
  }

  return (
    <DoctorLayout>
      <h2 className="text-2xl font-bold text-blue-900 mb-5">Consultation History</h2>
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Patient ID"
          value={patientId}
          onChange={e => setPatientId(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={() => setSortAsc(!sortAsc)}
          className="border rounded p-2"
        >
          Sort by Date {sortAsc ? "(Asc)" : "(Desc)"}
        </button>
      </div>

      <table className="w-full bg-white rounded shadow text-blue-900">
       <thead>
  <tr>
    <th className="p-3">Patient ID</th>
    <th className="p-3">Patient Name</th>
    <th className="p-3">Patient Age</th>
    <th className="p-3">Date</th>
    <th className="p-3">Time</th>
    <th className="p-3">Diagnosis</th>
    <th className="p-3">Action</th> {/* New column */}
  </tr>
</thead>

        <tbody>
  {filtered.length === 0 ? (
    <tr>
      <td colSpan={7} className="p-3 text-center">
        No consultations found.
      </td>
    </tr>
  ) : (
    filtered.map(c => (
      <tr key={c.consultationid}>
        <td className="p-3">{c.patientid || "N/A"}</td>
        <td className="p-3">{c.patientname || "N/A"}</td>
        <td className="p-3">{c.patientage || "N/A"}</td>
        <td className="p-3">{c.consultationdate || "N/A"}</td>
        <td className="p-3">{c.consultationtime || "N/A"}</td>
        <td className="p-3">{c.diagnosis || "N/A"}</td>
        <td className="p-3 align-middle">
          <button
            className="w-32 px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-800"
            onClick={() => handleViewDetails(c)}
          >
            View Details
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>

      </table>

      {showModal && selectedConsultation && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded shadow-lg max-w-xl w-full p-8 text-blue-900">
      <h3 className="text-lg font-bold mb-4 text-blue-800">Consultation Details</h3>
      <table className="w-full mb-6">
        <tbody>
          <tr>
            <td className="font-semibold pr-4 pb-2 text-right align-top">Patient Name:</td>
            <td className="pb-2 align-top">{selectedConsultation.patientname}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4 pb-2 text-right align-top">Patient ID:</td>
            <td className="pb-2 align-top">{selectedConsultation.patientid}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4 pb-2 text-right align-top">Age:</td>
            <td className="pb-2 align-top">{selectedConsultation.patientage}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4 pb-2 text-right align-top">Date:</td>
            <td className="pb-2 align-top">{selectedConsultation.consultationdate}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4 pb-2 text-right align-top">Time:</td>
            <td className="pb-2 align-top">{selectedConsultation.consultationtime}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4 pb-2 text-right align-top">Diagnosis:</td>
            <td className="pb-2 align-top">{selectedConsultation.diagnosis}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4 pb-2 text-right align-top">Symptoms:</td>
            <td className="pb-2 align-top">{selectedConsultation.symptoms || "N/A"}</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4 pb-2 text-right align-top">Consultation Notes:</td>
            <td className="pb-2 align-top">{selectedConsultation.consultation_notes || "N/A"}</td>
          </tr>
        </tbody>
      </table>
     <h4 className="font-semibold text-blue-700 mb-2">Prescription</h4>
{loadingDetails && <p className="text-blue-600 mb-2">Loading prescription...</p>}

{!loadingDetails && prescription && Object.keys(prescription).length > 0 ? (
  <div className="bg-blue-50 p-3 mb-4 rounded text-sm text-blue-900 max-h-60 overflow-auto">
    <div className="mb-1">
      <span className="font-semibold">Prescription ID:</span> {prescription.prescriptionid || "N/A"}
    </div>
    <div className="mb-1">
      <span className="font-semibold">Patient Name:</span> {prescription.patientname || "N/A"}
    </div>
    <div className="mb-1">
      <span className="font-semibold">Doctor Name:</span> {prescription.doctorname || "N/A"}
    </div>

    {/* Medicines */}
    <div className="mb-2 mt-2">
      <div className="font-semibold">Medicines:</div>
      {prescription.medicines && prescription.medicines.length > 0 ? (
        <table className="w-full mt-1 mb-2 border border-blue-200 rounded">
          <thead>
            <tr>
              <th className="p-1 text-left border-b border-blue-200">Name</th>
              <th className="p-1 text-left border-b border-blue-200">Dosage</th>
              <th className="p-1 text-left border-b border-blue-200">Frequency</th>
              <th className="p-1 text-left border-b border-blue-200">Timing</th>
              <th className="p-1 text-left border-b border-blue-200">Duration</th>
              <th className="p-1 text-left border-b border-blue-200">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {prescription.medicines.map(med => (
              <tr key={med.id}>
                <td className="p-1">{med.medicinename}</td>
                <td className="p-1">{med.dosage}</td>
                <td className="p-1">{med.frequency}</td>
                <td className="p-1">{med.timing}</td>
                <td className="p-1">{med.duration}</td>
                <td className="p-1">{med.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="text-gray-500 mt-2">No medicines prescribed.</div>
      )}
    </div>

    {/* Tests */}
    <div className="mb-2">
      <div className="font-semibold">Tests:</div>
      {prescription.tests && prescription.tests.length > 0 ? (
        <ul className="ml-4 mt-1 list-disc">
          {prescription.tests.map(test => (
            <li key={test.id}>
              <span className="font-semibold">Name:</span> {test.testname}
              {test.instructions && (
                <>
                  <span className="font-semibold ml-2">Instructions:</span> {test.instructions}
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-gray-500 mt-2">No tests prescribed.</div>
      )}
    </div>

    {prescription.general_instructions && (
      <div className="mb-1">
        <span className="font-semibold">General Instructions:</span> {prescription.general_instructions}
      </div>
    )}
  </div>
) : (
  !loadingDetails && <p className="text-gray-500 mb-4">No prescription data available.</p>
)}

<div className="flex justify-end">
  <button
    className="px-5 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-700"
    onClick={() => setShowModal(false)}
  >
    Close
  </button>
</div>

      </div>
    </div>
  
)}
    </DoctorLayout>
  );
};

export default PatientConsultations;
