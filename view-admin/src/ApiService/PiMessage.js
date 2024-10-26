import axios from "axios";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const token  = localStorage.getItem('reconnect_access_token'); 
const token_type = localStorage.getItem('reconnect_token_type');

export const piMessage = async (userData) => {
    try {
      const response = await axios.put(`/api/pi-message/update/${userData.user_id}`, userData, {
        headers: {
          'R-API-KEY': `${apiKey}`,
          'Content-Type': 'application/json',
          'Authorization': `${token_type} ${token}`
        },
      });
      
      return response;
    } catch (error) {
      throw error.response?.data || new Error('Pi Message failed');
    }
}

 