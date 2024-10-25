import axios from 'axios';
const apikey = import.meta.env.VITE_APP_API_KEY;
const token = localStorage.getItem('reconnect_access_token');
const token_type = localStorage.getItem('reconnect_token_type');


const headers = {
    'R-API-KEY': `${apikey}`,
    'Authorization': `${token_type} ${token}`
}

export const getUserByEmail = async email => { 
    try {
        const response = await axios.get(`/api/user/email/${email}`, {
            headers: headers
        }); 
        
        return response.data;
                 
    } catch (error) {  
        return handleError(error); 
    }      
}


export const updateUser = async (userData) => { 
    console.log(userData.user_id, "user_id form api service");
    
    try {
        const response = await axios.put(`/api/user/update/${userData.user_id}`, userData, {
            headers: headers
        }); 
        
        return response.data;
                 
    } catch (error) {  
        return handleError(error); 
    }      
}


const handleError = (error) => {
    
    if (error.response) {
        console.error(error.response.data);
        console.error(error.response.status);
        console.error(error.response.headers);
    } else if (error.request) 
        console.error(error.request); 
    console.error(error.config);
    return error;
}

 