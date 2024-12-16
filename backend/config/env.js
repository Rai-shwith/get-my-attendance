// backend/config/env.js
const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file
module.exports = {
    // Server configuration
    server: {
        port: process.env.PORT || 3000, // Default to 3000 if not set in .env
        secretKey: process.env.SERVER_SECRET_KEY || 3000, // 
        domain: process.env.DOMAIN 
    },

    // Database configuration (Example)
    db: {
        host: process.env.DB_HOST || 'localhost',
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'attendance_db',
    },

    // Authentication configuration
    auth: {
        password: process.env.AUTH_PASSWORD || 'your-password',
        secretKey: process.env.AUTH_SECRET_KEY || 'your-secret-key',
        sessionTimeout: process.env.SESSION_TIMEOUT || 3600, // 1 hour session default
    },

    // File paths for reports (just an example)
    filePaths: {
        studentDetailsPath: process.env.STUDENT_DETAILS_PATH, // Path to student details file
        attendanceDetailsPath: process.env.ATTENDANCE_DETAILS_PATH // Path to attendance details history
    },

    // Other settings (can be added)
    otherSettings: {
        debugMode: process.env.DEBUG_MODE === 'true', // Example of a toggle for debugging
    },
};
