import React, { useEffect, useRef } from 'react';
import { useMessage } from '../contexts/MessageContext'; // Updated to use the new context
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export const GeneralMessage = () => {
    const { message, isError, setMessage } = useMessage();
    const boxRef = useRef(null);

    const handleClickOutside = (event) => {
        if (boxRef.current && !boxRef.current.contains(event.target)) {
            boxRef.current.parentElement.style.display = 'none';
            setMessage(""); // Clear the message when clicking outside
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Determine styles based on message type
    const messageStyles = isError 
        ? "bg-red-500 text-white" 
        : "bg-green-500 text-white";

    const icon = isError 
        ? <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" /> 
        : <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />;

    return message ? (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
                ref={boxRef}
                className={`flex items-center p-4 rounded shadow-lg w-11/12 max-w-md text-center transition-opacity duration-300 ease-in-out opacity-0 transform translate-y-4 animate-fadeIn ${messageStyles} animate-fadeIn`}
                style={{ opacity: 1, transform: 'translateY(0)' }} // Inline styles for fade-in effect
            >
                {icon}
                <p className="text-sm font-semibold">{message}</p>
            </div>
        </div>
    ) : null;
};