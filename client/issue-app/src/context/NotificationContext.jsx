import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  useEffect(() => {
    // Connect to Socket.io server
    const socket = io('http://localhost:4002', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      console.log('✅ Connected to notification server');
    });

    socket.on('notification', (data) => {
      console.log('📬 Received notification:', data);

      // Show different toast styles based on notification type
      switch (data.type) {
        case 'NEW_ISSUE':
          if (data.urgency === 'HIGH') {
            toast.error(`🚨 URGENT: ${data.message}`, {
              position: 'top-right',
              autoClose: 8000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          } else {
            toast.info(`📝 ${data.message}`, {
              position: 'top-right',
              autoClose: 5000,
            });
          }
          break;

        case 'STATUS_UPDATE':
          toast.success(`✅ ${data.message}`, {
            position: 'top-right',
            autoClose: 4000,
          });
          break;

        default:
          toast(data.message, {
            position: 'top-right',
            autoClose: 5000,
          });
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from notification server');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{}}>
      {children}
    </NotificationContext.Provider>
  );
};
