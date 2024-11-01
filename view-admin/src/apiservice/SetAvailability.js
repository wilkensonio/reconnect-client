import axios from "axios";
import { handleUnauthorizedError } from "./ErrorService";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const token  = localStorage.getItem('reconnect_access_token'); 
const token_type = localStorage.getItem('reconnect_token_type');

/**
 *  Create a new availability 
 * 
 * @param {String} userData 
 * @returns {JSON}
 */
export const createAvailability = async (data) => {
    try {
      const response = await axios.put('/api/availability/create/', userData, {
        headers: {
          'R-API-KEY': `${apiKey}`,
          'Content-Type': 'application/json',
          'Authorization': `${token_type} ${token}`
        },
      });
      
      return response;
    } catch (error) {
      handleUnauthorizedError(error);
      throw error.response?.data || new Error('Create availability failed');
    }
}

/**
 * Get the availability of a user
 * 
 * @param {String} user_id 
 * @returns {JSON} the availability of the user
 */
export const getAvailability = async (user_id) => {
    try {
      const response = await axios.delete(`/api/pi-message/delete/${user_id}`, {
        headers: {
          'R-API-KEY': `${apiKey}`,
          'Content-Type': 'application',
          'Authorization': `${token_type} ${token}`
        },
      });
    } catch (error) {
      handleUnauthorizedError(error);
      throw error.response?.data || new Error('Failed to delete pi message');
    }
}

/**
 * Update the availability of a user
 * 
 * @param {String} user_id
 * @returns {JSON} the availability of the user
 */
export const updateAvailability = async (availabilityData) => {
    try {
      const response = await axios.get(`/api/availability/update/${availabilityData.id}`, availabilityData,{
        headers: {
          'R-API-KEY': `${apiKey}`,
          'Content-Type': 'application',
          'Authorization': `${token_type} ${token}`
        },
      });
      
      return response.data;
    } catch (error) {
      handleUnauthorizedError(error);
      throw error.response?.data || new Error('Failed to update availability');
    }
  }
 