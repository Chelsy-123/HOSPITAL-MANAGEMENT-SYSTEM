import axiosInstance from '../utils/axiosInstance';

// Consultation APIs
export const createConsultation = (data) =>
  axiosInstance.post('/api/doctor/consultations/', data);

export const getConsultations = () => 
  axiosInstance.get('/api/doctor/consultations/');

export const getConsultationById = (id) =>
  axiosInstance.get(`/api/doctor/consultations/${id}/`);

export const updateConsultation = (consultationId, data) =>
  axiosInstance.put(`/api/doctor/consultations/${consultationId}/`, data);

// Fetch today's date string in ISO format YYYY-MM-DD
const getTodayDateString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0];
};

// Fetch doctor appointments for today
export const getTodayAppointments = async () => {
  const todayStr = getTodayDateString();
  const response = await axiosInstance.get(`/api/doctor/doctor-appointments/?date=${todayStr}`);
  return response.data;
};

// Fetch doctor appointments by date (format: 'YYYY-MM-DD')
export const getDoctorAppointmentsByDate = async (date) => {
  const response = await axiosInstance.get(`/api/doctor/doctor-appointments/?date=${date}`);
  return response.data;
};

// Prescription APIs
export const createPrescription = (data) =>
  axiosInstance.post('/api/doctor/prescriptions/', data);

export const getPrescriptionByConsultation = (consultationId) =>
  axiosInstance.get(`/api/doctor/prescriptions/?consultation=${consultationId}`);

export const updatePrescription = (id, data) =>
  axiosInstance.put(`/api/doctor/prescriptions/${id}/`, data);

export const deletePrescription = (id) =>
  axiosInstance.delete(`/api/doctor/prescriptions/${id}/`);

export const getPrescriptionById = (prescriptionId) =>
  axiosInstance.get(`/api/doctor/prescriptions/${prescriptionId}/`);

export const getDoctorProfile = () =>
  axiosInstance.get('/api/doctor/profile/');

export const getConsultationPrescription = (consultationId) =>
  axiosInstance.get(`/api/doctor/consultations/${consultationId}/prescription/`);

