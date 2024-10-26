import axios from "axios";

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
      throw error.response?.data || new Error('Notification failed');
    }
}

export const userNotifications = async (hootloot_id) => {    
    try {
        const response = await axios.get(`/api/get/notifications/${hootloot_id}`, {
            headers: {
                'R-API-KEY': `${apiKey}`,
                'Content-Type': 'application/json',
                'Authorization': `${token_type} ${token}`
            },
        }); 
        
        return response.data;
                 
    } catch (error) {  
         throw error.response?.data || new Error('Failed to get user notifications'); 
    }      
}

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
         throw error.response?.data || new Error('Failed to delete notification'); 
    }      
}

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
         throw error.response?.data || new Error('Failed to clear notifications'); 
    }      
}

