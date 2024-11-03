import axios from "axios";
import { handleUnauthorizedError } from "./ErrorService";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const token  = localStorage.getItem('reconnect_access_token'); 
const token_type = localStorage.getItem('reconnect_token_type');


/**
 * Create an availability data for a specific user.
 *
 * @param {string} user_id - The ID (HootLoot) of the user whose availability data is being fetched.
 * @returns {Promise<Object>} The response object containing the availability data.
 * @throws Will throw an error if the request fails.
 */
export const createAvailability = async (data) => {
    try {
      const response = await axios.post('/api/availability/create/', data, {
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
 * Fetches the availability data for a specific user.
 *
 * @param {string} user_id - The ID of the user whose availability data is being fetched.
 * @returns {Promise<Object>} The response object containing the availability data.
 * @throws Will throw an error if the request fails.
 */
export const getAvailability = async (user_id) => {
    try {
      const response = await axios.get(`/api/availability/get-by-user/${user_id}`, {
        headers: {
          'R-API-KEY': `${apiKey}`,
          'Content-Type': 'application/json',
          'Authorization': `${token_type} ${token}`
        },
      });
      return response;
    } catch (error) {
      handleUnauthorizedError(error);
      throw error.response?.data || new Error('Failed to delete pi message');
    }
}

 
/**
 * Updates the availability data on the server.
 *
 * @param {Object} availabilityData - The availability data to be updated.
 * @param {number} availabilityData.id - The ID of the availability entry.
 * @param {string} availabilityData fields related to availability.
 * @returns {Promise<Object>} The response data from the server.
 * @throws Will throw an error if the update fails.
 */
export const updateAvailability = async (availabilityData) => {
    try {
      const response = await axios.put(`/api/availability/update/${availabilityData.id}`, availabilityData,{
        headers: {
          'R-API-KEY': `${apiKey}`,
          'Content-Type': 'application/json',
          'Authorization': `${token_type} ${token}`
        },
      });
      
      return response.data;
    } catch (error) {
      console.log(error);
      
      handleUnauthorizedError(error);
      throw error.response?.data || new Error('Failed to update availability');
    }
  }


 
/**
 * Deletes an availability entry by its ID.
 *
 * @param {string} availabilityId - The ID of the availability entry to delete.
 * @returns {Promise<Object>} The response from the server.
 * @throws Will throw an error if the deletion fails.
 */
export const deleteAvailability = async (availabilityId) => {

    try {
      const response = await axios.delete(`/api/availability/delete/${availabilityId}`, {
        headers: {
          'R-API-KEY': `${apiKey}`,
          'Content-Type': 'application/json',
          'Authorization': `${token_type} ${token}`
        },
      });
      return response;
    } catch (error) {
      handleUnauthorizedError(error);
      throw error.response?.data || new Error('Failed to delete availability');
    }
}
 
 