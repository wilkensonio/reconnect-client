import React from 'react' 
const Logout = () => {
    localStorage.removeItem('reconnect_access_token');
    localStorage.removeItem('reconnect_token_type');
    localStorage.removeItem('reconnect_first_name');
    localStorage.removeItem('reconnect_last_name');
    localStorage.removeItem('reconnect_email_verification_code');
    localStorage.setItem('reconnect_token_expired', 'false');
    localStorage.removeItem('reconnect_signin_email');
    window.location.href = '/login?message=logout'
    console.log('logout was triggered');
    
    return
} 

export default Logout