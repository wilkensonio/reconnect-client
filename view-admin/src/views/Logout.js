import React from 'react' 
const Logout = () => {
    localStorage.removeItem('reconnect_access_token');
    localStorage.removeItem('reconnect_token_type');
    window.location.href = '/login?message=logout'
    return
} 

export default Logout