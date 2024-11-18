import axios from 'axios';
import {handleUnauthorizedError} from './ErrorService';

const apikey = import.meta.env.VITE_APP_API_KEY;
const token = localStorage.getItem('reconnect_access_token');
const token_type = localStorage.getItem('reconnect_token_type');


const headers = {
    'R-API-KEY': `${apikey}`,
    'Authorization': `${token_type} ${token}`
}


/**
 * get a user by their email
 * 
 * @param {String} email the faculty's email
 * @returns {JSON} the unser information
 */
export const getUserByEmail = async email => { 
    try {
        const response = await axios.get(`/api/user/email/${email}`, {
            headers: headers
        }); 
        
        return response.data;
                 
    } catch (error) {  
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to get user by email');
    }      
}

/**
 * Update a user by their id 
 * 
 * @param {String} userData the user's date to be updated
 * @returns {JSON} the user information
 */
export const updateUser = async (userData) => {  
    
    try {
        const response = await axios.put(`/api/user/update/${userData.user_id}`, userData, {
            headers: headers
        }); 
        
        return response.data;
                 
    } catch (error) {  
        handleUnauthorizedError(error);
        throw error.response?.data || new Error('Failed to update user');
    }      
} 
 