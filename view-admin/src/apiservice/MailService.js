import axios from 'axios';
import { handleUnauthorizedError } from './ErrorService';

const apiKey = import.meta.env.VITE_APP_API_KEY;
 
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


 