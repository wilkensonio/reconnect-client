import axios from "axios";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const token  = localStorage.getItem('reconnect_access_token'); 
const token_type = localStorage.getItem('reconnect_token_type');

// Get all appointments for a user
export const getAllAppointments = async (user_id) => {
  try {
    const response = await axios.get(`/api/appointments/get-by-user/${user_id}`, {
      headers: {
        "R-API-KEY": `${apiKey}`,
        "Content-Type": "application/json",
        Authorization: `${token_type} ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch appointments');
  }
};

// Get appointment details by ID
export const getAppointmentById = async (appointmentId) => {
  try {
    const response = await axios.get(`/api/appointment/get-by-id/${appointmentId}`, {
      headers: {
        "R-API-KEY": `${apiKey}`,
        "Content-Type": "application/json",
        Authorization: `${token_type} ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch appointment details');
  }
};

// Update an appointment
export const updateAppointment = async (id, updatedData) => {
  try {
    const response = await axios.put(`/api/appointment/update/${id}`, updatedData, {
      headers: {
        'R-API-KEY': `${apiKey}`,
        'Content-Type': 'application/json',
        'Authorization': `${token_type} ${token}`
      },
    });
    return response.data;
  } catch (error) {  
    throw error.response?.data || new Error('Failed to update appointment'); 
  }
};

// Delete an appointment by ID
export const deleteAppointment = async (id) => {
  try {
    const response = await axios.delete(`/api/appointment/delete/${id}`, {
      headers: {
        'R-API-KEY': `${apiKey}`,
        'Content-Type': 'application/json',
        'Authorization': `${token_type} ${token}`
      },
    });
    return response.data;
  } catch (error) {  
    throw error.response?.data || new Error('Failed to delete appointment'); 
  }
};

export const AppointmentById = async (appointmentId) => {
  try {
    const response = await axios.get(`/api/appointment/get-by-id/${appointmentId}`, {
      headers: {
        "R-API-KEY": `${apiKey}`,
        "Content-Type": "application/json",
        Authorization: `${token_type} ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch appointment details');
  }
};
