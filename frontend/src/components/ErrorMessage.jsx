import React, { useState, useEffect, useRef } from 'react';
import { useErrorMessage } from '../contexts/ErrorMessageContext';

export const ErrorMessage = () => {

    const {errorMessage, setErrorMessage} = useErrorMessage();

  const boxRef = useRef(null);

  const handleClickOutside = (event) => {
    if (boxRef.current && !boxRef.current.contains(event.target)) {
        boxRef.current.parentElement.style.display = 'none';
        setErrorMessage("");
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  console.log("Error message", errorMessage);
return errorMessage ? (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
    ref={boxRef}
      className="bg-red-500 text-white p-4 rounded shadow-lg w-72 text-center 
      animate-fadeIn"
    >
      <p className="text-sm font-semibold">{errorMessage}</p>
    </div>
  </div>
) : null;
};
