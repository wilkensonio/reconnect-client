import qs from 'qs';
import axios from 'axios';

export const getToken = async (email, password) => {
    let token = null;
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    try {
        const tokenRes = await axios.post('/api/token',
        // must be username, not email for the API to work
        qs.stringify({username:email, password}),{ 
            Headers: {
                'R-API-KEY': `${apiKey}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        });
        token = tokenRes;
        const {access_token, token_type} = token.data;
        localStorage.setItem('reconnect_access_token', access_token);
        localStorage.setItem('reconnect_token_type', token_type); 
        return token;
    } catch (error) { 
        throw error.response?.data || new Error('Failed to get token'); 
    }
}