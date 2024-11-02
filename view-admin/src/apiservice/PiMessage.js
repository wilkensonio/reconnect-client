import axios from "axios";
import { handleUnauthorizedError } from "./ErrorService";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const token  = localStorage.getItem('reconnect_access_token'); 
const token_type = localStorage.getItem('reconnect_token_type');

/**
 *  Update the message the be displayed on the pi
 * data.user_id is the id of the user that the notification is for (hootloot id)
 * 
 * @param {String} userData 
 * @returns {JSON}
 */
export const updatePiMessage = async (userData) => {
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
      handleUnauthorizedError(error);
      throw error.response?.data || new Error('Pi Message failed');
    }
}

/**
 * Delete the message that is displayed on the pi
 * 
 * @param {String} user_id 
 * @returns {Boolean} true if successful false if not
 */
export const deletePiMessage = async (user_id) => {
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
 * Get the message that is displayed on the pi
 * 
 * @param {String} user_id
 * @returns {JSON} the message that is displayed on the pi
 */
export const getPiMessage = async (user_id) => {
    try {
      const response = await axios.get(`/api/pi-message/get/${user_id}`, {
        headers: {
          'R-API-KEY': `${apiKey}`,
          'Content-Type': 'application',
          'Authorization': `${token_type} ${token}`
        },
      });
      
      return response.data;
    } catch (error) {
      handleUnauthorizedError(error);
      throw error.response?.data || new Error('Failed to get pi message');
    }
  }
 