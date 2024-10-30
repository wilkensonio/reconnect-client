
/**
 * 
 * @param {Strin} funccall Endpoint of the function that called this function
 * @param {Error} error 
 * @returns 
 */
export const handleUnauthorizedError = (error) => {
    const response = error.response;
    if (error.response) {
        if (response && error.response.status === 401) {
            localStorage.removeItem('reconnect_access_token');
            localStorage.removeItem('reconnect_token_type');
            localStorage.removeItem('reconnect_first_name');
            localStorage.removeItem('reconnect_last_name');
            window.location.href = '/signin?message=session-expired';
        } else {
            console.error(response);
        } 
    }  
}

 