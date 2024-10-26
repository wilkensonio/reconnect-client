import React, { createContext, useContext, useEffect, useState } from 'react';

const WebSocketContext = createContext();
const WS_URL = import.meta.env.VITE_APP_WS_URL || "localhost:8000";

console.log(WS_URL);

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};

export const WebSocketProvider = ({ userId, children }) => {
    const [notifications, setNotifications] = useState([]);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = new WebSocket(`ws://localhost:8000/ws/notifications/${userId}`);

        newSocket.onopen = () => {
            console.log("WebSocket connection established");
        };

        newSocket.onmessage = (event) => {
            const notificationMessage = event.data;
            setNotifications((prev) => [...prev, notificationMessage]);
            // You can also trigger a toast or alert here
            alert(notificationMessage); // For demonstration
        };

        newSocket.onclose = (event) => {
            console.log("WebSocket connection closed", event);
        };

        newSocket.onerror = (error) => {
            console.log("WebSocket error:", error);
        };

        setSocket(newSocket);

        // Cleanup function to close the WebSocket connection when the component unmounts
        return () => {
            newSocket.close();
        };
    }, [userId]);

    return (
        <WebSocketContext.Provider value={{ notifications }}>
            {children}
        </WebSocketContext.Provider>
    );
};
