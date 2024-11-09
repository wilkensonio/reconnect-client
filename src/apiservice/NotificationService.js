import axios from "axios";
import { handleUnauthorizedError  } from "./ErrorService";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const token  = localStorage.getItem('reconnect_access_token'); 
const token_type = localStorage.getItem('reconnect_token_type');
 
 
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
 * Fetches user notifications based on the provided hootloot ID.
 *
 * @param {string} hootloot_id - The ID of the hootloot to fetch notifications for.
 * @returns {Promise<Object>} A promise that resolves to the data of the user notifications.
 * @throws Will throw an error if the request fails, including unauthorized errors.
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
 * Deletes a notification by its ID.
 *
 * @param {string} notification_id - The ID of the notification to delete.
 * @returns {Promise<Object>} The response data from the delete request.
 * @throws Will throw an error if the delete request fails.
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
 * Deletes notifications for a specific user.
 *
 * @param {string} user_id - The ID of the user whose notifications are to be deleted.
 * @returns {Promise<Object>} The response data from the server.
 * @throws Will throw an error if the request fails.
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

