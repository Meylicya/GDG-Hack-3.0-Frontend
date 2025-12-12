// src/config/api.js
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const API_ENDPOINTS = {
  // Auth routes
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_CAREGIVER_LOGIN: `${API_BASE_URL}/auth/caregiver/login`,
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  AUTH_CAREGIVER_REGISTER: `${API_BASE_URL}/auth/caregiver/register`,
  AUTH_VERIFY: `${API_BASE_URL}/auth/verify`,
  AUTH_LOGOUT: `${API_BASE_URL}/auth/logout`,

  // Password routes
  PASSWORD_FORGOT: `${API_BASE_URL}/password/forgot`,
  PASSWORD_RESET: `${API_BASE_URL}/password/reset`,

  // Users routes
  USERS_ALL: `${API_BASE_URL}/users`,
  USERS_BY_ID: (id) => `${API_BASE_URL}/users/${id}`,
  USERS_UPDATE: (id) => `${API_BASE_URL}/users/${id}`,
  USERS_DELETE: (id) => `${API_BASE_URL}/users/${id}`,

  // Patients routes
  PATIENTS_ALL: `${API_BASE_URL}/patients`,
  PATIENTS_BY_ID: (id) => `${API_BASE_URL}/patients/${id}`,
  PATIENTS_APPOINTMENTS: (id) => `${API_BASE_URL}/patients/${id}/appointments`,
  PATIENTS_MEDICAL_NOTES: (id) =>
    `${API_BASE_URL}/patients/${id}/medical-notes`,
  PATIENTS_SERVICE_REQUESTS: (id) =>
    `${API_BASE_URL}/patients/${id}/service-requests`,
  PATIENTS_MESSAGES: (id) => `${API_BASE_URL}/patients/${id}/messages`,

  // Caregivers routes
  CAREGIVERS_ALL: `${API_BASE_URL}/caregivers`,
  CAREGIVERS_BY_ID: (id) => `${API_BASE_URL}/caregivers/${id}`,
  CAREGIVERS_CREATE: `${API_BASE_URL}/caregivers`,
  CAREGIVERS_UPDATE: (id) => `${API_BASE_URL}/caregivers/${id}`,
  CAREGIVERS_DELETE: (id) => `${API_BASE_URL}/caregivers/${id}`,
  CAREGIVERS_PATIENTS: (id) => `${API_BASE_URL}/caregivers/${id}/patients`,
  CAREGIVERS_PENDING_REQUESTS: (id) =>
    `${API_BASE_URL}/caregivers/${id}/pending-requests`,
  CAREGIVERS_MY_REQUESTS: (id) =>
    `${API_BASE_URL}/caregivers/${id}/my-requests`,

  // Appointments routes
  APPOINTMENTS_ALL: `${API_BASE_URL}/appointments`,
  APPOINTMENTS_BY_ID: (id) => `${API_BASE_URL}/appointments/${id}`,
  APPOINTMENTS_BY_PATIENT: (patientId) =>
    `${API_BASE_URL}/appointments?patientId=${patientId}`,
  APPOINTMENTS_BY_CAREGIVER: (caregiverId) =>
    `${API_BASE_URL}/appointments?caregiverId=${caregiverId}`,
  APPOINTMENTS_CREATE: `${API_BASE_URL}/appointments`,
  APPOINTMENTS_UPDATE: (id) => `${API_BASE_URL}/appointments/${id}`,
  APPOINTMENTS_CANCEL: (id) => `${API_BASE_URL}/appointments/${id}/cancel`,
  APPOINTMENTS_DELETE: (id) => `${API_BASE_URL}/appointments/${id}`,

  // Messages routes
  MESSAGES_ALL: `${API_BASE_URL}/messages`,
  MESSAGES_BY_USER: (userId) => `${API_BASE_URL}/messages?userId=${userId}`,
  MESSAGES_SEND_TO_CAREGIVER: `${API_BASE_URL}/messages/send-to-caregiver`,
  MESSAGES_SEND_TO_USER: `${API_BASE_URL}/messages/send-to-user`,
  MESSAGES_READ: (id) => `${API_BASE_URL}/messages/${id}/read`,
  MESSAGES_DELETE: (id) => `${API_BASE_URL}/messages/${id}`,

  // Service Requests routes
  SERVICE_REQUESTS_ALL: `${API_BASE_URL}/service-requests`,
  SERVICE_REQUESTS_BY_ID: (id) => `${API_BASE_URL}/service-requests/${id}`,
  SERVICE_REQUESTS_BY_PATIENT: (patientId) =>
    `${API_BASE_URL}/service-requests?patientId=${patientId}`,
  SERVICE_REQUESTS_BY_CAREGIVER: (caregiverId) =>
    `${API_BASE_URL}/service-requests?caregiverId=${caregiverId}`,
  SERVICE_REQUESTS_CREATE: `${API_BASE_URL}/service-requests`,
  SERVICE_REQUESTS_UPDATE: (id) => `${API_BASE_URL}/service-requests/${id}`,
  SERVICE_REQUESTS_ACCEPT: (id, caregiverId) =>
    `${API_BASE_URL}/service-requests/${id}/accept/${caregiverId}`,
  SERVICE_REQUESTS_COMPLETE: (id) =>
    `${API_BASE_URL}/service-requests/${id}/complete`,
  SERVICE_REQUESTS_CANCEL: (id) =>
    `${API_BASE_URL}/service-requests/${id}/cancel`,

  // Availability routes
  AVAILABILITY_GET_SLOTS: (caregiverId) =>
    `${API_BASE_URL}/availability?caregiverId=${caregiverId}`,
  AVAILABILITY_ADD_SLOT: `${API_BASE_URL}/availability`,
  AVAILABILITY_UPDATE_SLOT: (slotId) =>
    `${API_BASE_URL}/availability/${slotId}`,
  AVAILABILITY_DELETE_SLOT: (slotId) =>
    `${API_BASE_URL}/availability/${slotId}`,

  // Medical Notes routes
  MEDICAL_NOTES_ALL: `${API_BASE_URL}/medical-notes`,
  MEDICAL_NOTES_BY_ID: (id) => `${API_BASE_URL}/medical-notes/${id}`,
  MEDICAL_NOTES_BY_PATIENT: (patientId) =>
    `${API_BASE_URL}/medical-notes?patientId=${patientId}`,
  MEDICAL_NOTES_BY_CAREGIVER: (caregiverId) =>
    `${API_BASE_URL}/medical-notes?caregiverId=${caregiverId}`,
  MEDICAL_NOTES_CREATE: `${API_BASE_URL}/medical-notes`,
  MEDICAL_NOTES_UPDATE: (id) => `${API_BASE_URL}/medical-notes/${id}`,
  MEDICAL_NOTES_DELETE: (id) => `${API_BASE_URL}/medical-notes/${id}`,
};

export default API_ENDPOINTS;
