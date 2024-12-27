import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const NotFound = () => {
  const {theme} = useTheme();
  return (
    <div className="flex items-center justify-center min-h-screen ">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-3xl mb-2">Page Not Found</h2>
        <p className="mb-6">
          Oops! It seems the page you are looking for does not exist.
        </p>
        <Link
          to="/" 
          className="inline-block px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg transition duration-300 hover:bg-gray-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;