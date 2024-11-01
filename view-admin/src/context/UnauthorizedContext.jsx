import React, { createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedContext = createContext();

export const UnauthorizedProvider = ({ children }) => {
    const navigate = useNavigate();

    const handleUnauthorizedError = (error) => {
        const response = error.response;
        if (response && response.status === 401) {
            
            localStorage.removeItem('reconnect_access_token');
            localStorage.removeItem('reconnect_token_type'); 
            
            navigate('/signin?message=session-expired');
        } else {
            console.error(response);
            return response;
        }
    };

    return (
        <UnauthorizedContext.Provider value={{ handleUnauthorizedError }}>
            {children}
        </UnauthorizedContext.Provider>
    );
};

// Custom hook for accessing the unauthorized context
export const useUnauthorized = () => {
    return useContext(UnauthorizedContext);
};
