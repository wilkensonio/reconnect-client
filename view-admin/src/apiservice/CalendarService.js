import axios from "axios";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const token  = localStorage.getItem('reconnect_access_token'); 
const token_type = localStorage.getItem('reconnect_token_type');


export const getAllAppointments = async (user_id) => {
  try {
    const response = await axios.get(`/api/appointments/get-by-user/${user_id}`, {
      headers : {
        "R-API-KEY": `${apiKey}`,
        "Content-Type": "application/json",
        Authorization: `${token_type} ${token}`,
      },
    });
    return response.data;

  } catch (error) {
    throw error.response?.data || new Error('Signout failed');
  }
}