// backend/utils/logger.js
const winston = require('winston');

// Create a custom log format
const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
    })
);

// Create the logger with different transports (e.g., console and file)
const logger = winston.createLogger({
    level: 'debug',
    format: logFormat,
    transports: [
        // Log to console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // Adds color to the console output
                logFormat
            ),
        }),
        // Log to a file
        new winston.transports.File({
            filename: './logs/app.log',
            level: 'info', // Only logs 'info' level and above will be stored
        }),
    ],
});

module.exports = {logger};
