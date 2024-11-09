import React, { createContext, useContext, useState } from 'react'; 

const blurDashboardContext = createContext();

export const BlurDashboardProvider = ({ children }) => { 
    const [popup, setPopup] = useState(false);

    const togglePiPopup = () => {
        setPopup((prev) => !prev);
    };

    return (
        <blurDashboardContext.Provider value={{ popup, togglePiPopup }}>
            {children}
        </blurDashboardContext.Provider>
    );
};

export const useBlur = () => {
    const context =  useContext(blurDashboardContext);
    if (!context) {
        throw new Error('useBlur must be used within a BlurDashboardProvider');
    }
    return context;
};
