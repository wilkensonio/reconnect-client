import axios from 'axios';
import { handleUnauthorizedError } from './ErrorService'; 

const apikey = import.meta.env.VITE_APP_API_KEY;
const token = localStorage.getItem('reconnect_access_token');
const token_type = localStorage.getItem('reconnect_token_type'); 

const headers = {
   'R-API-KEY': `${apikey}`,
   'Authorization': `${token_type} ${token}`
}  

export const scheduleAppointment = async (data) => { 
   try {
       const response = await axios.post('/api/appointment/create/', data, {
         headers });
       return response.data;
   } catch (error) { 
       handleUnauthorizedError(error);
       throw error.response?.data || new Error('Failed to schedule appointment');
   }
}


/**
* Get all appointments for a faculty by their id(hootloot id)
*
* @param {String} faculty_id
* @returns {JSON}
*/
export const getAppointments = async (faculty_id) => {


   try {
       const response = await axios.get(`/api/appointments/get-by-user/${faculty_id}`, { headers });
       
       return response.data;

   } catch (error) {
        
       handleUnauthorizedError(error);
       throw error.response?.data || new Error('Failed to get appointments');
   }
}


/**
* Update an appointment by its id
* Must have the list of appointments to get the id
*
* @param {int} id
* @param {JSON} data  
* @returns {JSON}
*/
export const updateAppointment = async (id, data) => {

   try {
       const response = await axios.put(`/api/appointment/update/${id}`, data, { headers });
       return response.data;
   } catch (error) {
       handleUnauthorizedError(error);
       throw error.response?.data || new Error('Failed to update appointment');
   }
}


/**
* Cancel an appointment by its id
* Must have the list of appointments to get the id
*
* @param {int} id
* @returns {Boolean}
*/
export const deleteAppointment = async (id) => {
  
   try {
       const response = await axios.delete(`/api/appointment/delete/${id}`, { headers });
       return response.data;
   } catch (error) {
       handleUnauthorizedError(error);
       return error
    //    throw error.response?.data || new Error('Failed to delete appointment');
   }
}

