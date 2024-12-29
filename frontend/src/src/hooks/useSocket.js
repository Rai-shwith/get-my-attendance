// src/hooks/useSocket.js
import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

const useSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(url);

    socketRef.current.on('message', (message) => {
        console.log("New Message Received: ", message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (socketRef.current) {
      socketRef.current.emit('message', message);
    }
  };

  return { messages, sendMessage };
};

export default useSocket;