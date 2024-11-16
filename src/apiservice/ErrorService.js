import React from "react"; 

/**
 * Handles unauthorized errors by checking the error response status.
 * If the status is 401 (Unauthorized), it removes specific items from localStorage
 * and redirects the user to the sign-in page with a session expired message.
 * If the status is not 401, it logs the error response to the console.
 *
 * @param {Object} error - The error object received from the API call.
 * @param {Object} error.response - The response object within the error.
 * @param {number} error.response.status - The HTTP status code of the response.
 */
export const handleUnauthorizedError = (error) => {
   

    const response = error.response;
    if (error.response) {
        if (response && error.response.status === 401) {
            localStorage.clear();
            localStorage.setItem('reconnect_token_expired', 'true');  
            
            window.location.href = '/signin?message=session-expired';
            
            return
        } 
    }  
}

 