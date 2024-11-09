import axios from 'axios';
import { handleUnauthorizedError } from './ErrorService';

const apiKey = import.meta.env.VITE_APP_API_KEY;


/**
 * Sends an email for verification purposes.
 *
 * @param {string} email - The email address to send the verification to.
 * @returns {Promise<Object>} The response from the server.
 * @throws Will throw an error if the email sending fails.
 */
export const sendEmail= async (email) => {
  try {
    const response = await axios.post('/api/verify-email/', { email }, {
      headers: {
        'R-API-KEY': `${apiKey}`,
      },
    });  
    
    localStorage.setItem('reconnect_email_verification_code', response.data.verification_code);

    return response 
  } catch (error) { 
    handleUnauthorizedError(error);
    throw error.response?.data || new Error('Failed to send email') 
  }
};


/**
 * Verifies the email code by sending a POST request to the server.
 *
 * @param {string} sentCode - The code sent to the user.
 * @param {string} verificationCode - The code to verify against.
 * @returns {Promise<Object>} The response from the server.
 * @throws Will throw an error if the verification fails.
 */
export const verifyEmailCode = async (sentCode, verificationCode) => {  
  try {
    const data = {
      user_code: sentCode.toString().toUpperCase(),
      secret_code: verificationCode.toString().toUpperCase(),
    };
    
    const response = await axios.post('/api/verify-email-code/', data, {
      headers: {
        'R-API-KEY': `${apiKey}`,
      },
    }); 
    
    return response
  } catch (error) {
    handleUnauthorizedError(error);
    throw error.response?.data || new Error('Failed to verify email code'); 
  }
};


 