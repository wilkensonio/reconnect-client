import React from 'react';
import { useWebSocket } from '../../context/WebSocketProvider';

const NotificationDisplay = () => {
    const { notifications } = useWebSocket();
 
    
    return (
        <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 1000,
            maxWidth: '300px',
            overflow: 'auto',
        }}>
            {notifications.map((notification, index) => (
                <div key={index} style={{
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    marginBottom: '5px',
                    padding: '10px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                }}>
                    {notification}
                </div>
            ))}
        </div>
    );
};

export default NotificationDisplay;
