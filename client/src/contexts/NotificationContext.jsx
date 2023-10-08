import React, { useState, useEffect, useContext } from 'react';


const NotificationContext = React.createContext();

const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);
    const [queue, setQueue] = useState([]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setNotification(null);
        }, notification ? notification.duration : 0);
        // }, 500000);
        return () => clearTimeout(timer);
    }, [notification]);

    useEffect(() => {
        if (!notification && queue.length > 0) {
            setNotification(queue.shift());
        }
    }, [notification, queue]);

    const showNotification = (type, message, duration = 5000, position, custom) => {
        // console.log(message)
        const newNotification = { type, message, duration, position, custom };
        // console.log(newNotification)
        if (notification) {
            setQueue([...queue, newNotification]);
        } else {
            setNotification(newNotification);
        }
    };

    const hideNotification = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotificationContext = () => {
    const context = useContext(NotificationContext)
    return context
}



export default NotificationProvider;