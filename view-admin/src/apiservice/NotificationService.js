import axios from "axios";
import { handleUnauthorizedError  } from "./ErrorService";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const token  = localStorage.getItem('reconnect_access_token'); 
const token_type = localStorage.getItem('reconnect_token_type');

/**
 * Data is the JSON object that contains the user_id and the message
 * data.user_id is the id of the user that the notification is for
 * 
 * @param {String} data
 * @returns {JSON}
 */

export const newNotification = async (data) => {
    try {
      const response = await axios.put(`/api/new/notification/${data.user_id}`, data, {
        headers: {
            'R-API-KEY': `${apiKey}`,
            'Content-Type': 'application/json',
            'Authorization': `${token_type} ${token}`
        },
      });
      
      return response;
    } catch (error) { 
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Notification failed');
    }
}

/**
 * Get all notifications for a user
 * 
 * @param {String} hootloot_id
 * @returns {JSON}
 */
export const userNotifications = async (hootloot_id) => {    
    try {
        const response = await axios.get(`/api/notifications_by_user/${hootloot_id}`, {
            headers: {
                'R-API-KEY': `${apiKey}`,
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${token}`
            },
        }); 
       
        return response.data;
        
    } catch (error) {  
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to get user notifications'); 
    }      
}

/**
 * Delete  a notification
 *  
 * @returns {JSON}
 */

export const deleteNotification = async (notification_id) => {
    try {
        const response = await axios.delete(`/api/delete/notification/${notification_id}`, {
            headers: {
                'R-API-KEY': `${apiKey}`,
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${token}`
            },
        }); 
        
        return response.data;
                 
    } catch (error) {  
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to delete notification'); 
    }      
}
/**
 * Delete all notifications for a user
 * 
 * @param {String} user_id the id of the user
 * @returns {JSON}
 */
export const deleteNotifications = async (user_id) => {
    try {
        const response = await axios.delete(`/api/delete/notifications/${user_id}`, {
            headers: {
                'R-API-KEY': `${apiKey}`,
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${token}`
            },
        }); 
        
        return response.data;
                 
    } catch (error) { 
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to clear notifications'); 
    }      
}

