import axios from 'axios'; 
import { handleUnauthorizedError } from './ErrorService';

const apikey = import.meta.env.VITE_APP_API_KEY;
const token = localStorage.getItem('reconnect_access_token');
const token_type = localStorage.getItem('reconnect_token_type');



const headers = {
    'R-API-KEY': `${apikey}`,
    'Authorization': `${token_type} ${token}`
}

/**
 * 
 * @param {String} faculty_id 
 * @returns {JSON} 
 */
export const getAppointments = async (faculty_id) => {

    try {
        console.log(response.data, "data")
        const response = await axios.get(`/api/appointments/get_by_user/${faculty_id}`, { headers });
        return response.data;
    } catch (error) {
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to get appointments');
    }
}
