import axios from 'axios';
import { handleUnauthorizedError } from './ErrorService';

const apiKey = import.meta.env.VITE_APP_API_KEY;

/**
 * Send email verification code
 * 
 * @param {String} email
 * @returns {JSON}
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
 * Verify email code
 * 
 * @param {String} sentCode the code entered by the user
 * @param {String} verificationCode  this code is to be compared with the code sent to the user
 * @returns {JSON}
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


 