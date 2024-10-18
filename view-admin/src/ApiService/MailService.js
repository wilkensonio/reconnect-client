import axios from 'axios';

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
    console.log(error); 
    handleError(error);
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
    handleError(error);
  }
};


const handleError = (error) => {
    const response = error.response;
    if (error.response) {
        if (response && error.response.status === 401) {
        localStorage.removeItem('reconnect_access_token');
        localStorage.removeItem('reconnect_token_type');
        localStorage.removeItem('reconnect_first_name');
        localStorage.removeItem('reconnect_last_name');
        window.location.href = '/';
        }
        throw new Error(error.response.data.message);
    } else {
        console.error('api/mailService', error);
        return response;
    }
}