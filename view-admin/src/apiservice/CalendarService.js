import axios from "axios";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const token  = localStorage.getItem('reconnect_access_token'); 
const token_type = localStorage.getItem('reconnect_token_type');


export const getAllAppointments = async (user_id) => {
  try {
    const response = await axios.get(`/api/appointments/get-by-user/${user_id}`, {
      headers : {
        'Authorization': `${token_type} ${token}`,
        'R-API-KEY': `${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;

  } catch (error) {
    throw error.response?.data || new Error('Signout failed');
  }
}

export const updateAppointment = async (data) => {
  try {
    const response = await axios.put(`/api/appointment/update/${data.user_id}`, data, {
      headers: {
          'R-API-KEY': `${apiKey}`,
          'Content-Type': 'application/json',
          'Authorization': `${token_type} ${token}`
      },
    });
    
    return response;
  } catch (error) {  
    throw error.response?.data || new Error('Failed to delete appointment'); 
}      
}

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
}