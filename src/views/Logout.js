import React from 'react' 
const Logout = () => {
    localStorage.clear();
    localStorage.setItem('reconnect_token_expired', 'false'); 
    window.location.href = '/login?message=logout' 
    return
} 

export default Logout