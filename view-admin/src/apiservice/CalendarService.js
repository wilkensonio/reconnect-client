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
export const getAvailabilties = async (faculty_id) => { 
    try {
        const response = await axios.get(`/api/students/${faculty_id}`, {
            headers: headers
        }); 
        
        return response.data;
                
    } catch (error) { 
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to get availabilities');
    }      
} 

/**
 * 
 * @param {int} id 
 * @param {JSON} data 
 * @returns {JSON}
 */
export const updateAvailability = async (id, data) => {
    
    try {
        const response = await axios.put(`/api/availability/update${id}`, data, { headers });
        return response.data;
    } catch (error) {
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to update availability');
    }
};

/**
 * 
 * @param {int} id 
 * @returns {JSON}
 */
export const deleteAvailability = async (id) => {
    
    try {
        const response = await axios.delete(`/api/availability/delete/${id}`, { headers });
        return response.data;
    } catch (error) {
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to delete availability');
    }
};
/**
 * 
 * @param {JSON} data 
 * @returns {JSON}
 */

export const sheduleAppointment = async (data) => {

    try {
        const response = await axios.post(`/api/appointment/create`, data, { headers });
        return response.data;
    } catch (error) {
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to schedule appointment');
    }
}

/**
 * 
 * @param {String} faculty_id 
 * @returns {JSON} 
 */
export const getAppointments = async (faculty_id) => {

    try {
        const response = await axios.get(`/api/appointments/get_by_user/${faculty_id}`, { headers });
        return response.data;
    } catch (error) {
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to get appointments');
    }
}

/**
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
        throw error.response?.data || new Error('Failed to delete appointment');
    }
}
 