import axios from "axios";

const apiKey = import.meta.env.VITE_APP_API_KEY;
const token  = localStorage.getItem('reconnect_access_token'); 
const token_type = localStorage.getItem('reconnect_token_type');

export const signupUser = async (userData) => {
    try {
      const response = await axios.post('/api/signup/', userData, {
        headers: {
          'R-API-KEY': `${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      return response;
    } catch (error) {
      throw error.response?.data || new Error('Signup failed');
    }
  };


export const signinUser = async (email, password) => {
    
  try { 
      const response = await axios.post('/api/signin/', { email, password }, {
        headers: {
          'R-API-KEY': `${apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      localStorage.setItem('reconnect_signin_email', email); 
      return response;
      
    } catch (error) {
      throw error.response?.data || new Error('Signin failed');
    }
}

export const signoutUser = async () => {
  try {
    const response = await axios.post('/api/signout/', {}, {
      headers : {
        'Authorization': `${token_type} ${token}`,
        'R-API-KEY': `${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    throw error.response?.data || new Error('Signout failed');
  }
}


export const resetPassword = async (email, password) => {
  
  try {
    const response = await axios.put('/api/reset-password/', {email, password}, {
      headers: {
        'R-API-KEY': `${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    return response;
  } catch (error) {
    console.log(error); 
    throw error.response?.data || new Error('Reset password failed');
  }
}




