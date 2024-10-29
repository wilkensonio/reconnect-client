import axios from 'axios';
const apiKey = import.meta.env.VITE_APP_API_KEY;
const token = localStorage.getItem('reconnect_access_token');
const token_type = localStorage.getItem('reconnect_token_type');

export const getAllAppointments = async () => {
  try {
    const response = await axios.get('/api/appointment/get-all', {
      headers: {
        'R-API-KEY': apiKey,
        'Content-Type': 'application/json',
        'Authorization': `${token_type} ${token}`,
      },
    });
    return response.data; // Assume this returns an array of appointment objects
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch appointments';
    throw new Error(message);
  }
};