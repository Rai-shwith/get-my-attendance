const fs = require('fs');
const { filePaths } = require('../config/env');
const { logger } = require('../utils/logger');
const { getCounts } = require('../utils/helpers');

let attendanceDetailsCache = {};  // Using an object to store the details of attendance History


// Load data into cache once at startup
const loadAttendanceData = () => {
    try {
        const data = fs.readFileSync(filePaths.attendanceDetailsPath, 'utf8');
        attendanceDetailsCache = JSON.parse(data);
        logger.debug('attendance data loaded successfully');
    } catch (error) {
        logger.error('Failed to load attendance data:', error);
    }
};

// Save data back to the file system on-demand
const saveAttendanceData = () => {
    try {
        fs.writeFileSync(filePaths.attendanceDetailsPath, JSON.stringify(attendanceDetailsCache, null, 2), 'utf8');
        logger.debug('attendance Data Saved .')
    } catch (error) {
        logger.error('Failed to save attendance data:', error);
    }
};

// Add a attendance to the cache
const addAttendanceEntry = (timestamp, AttendanceDetails) => {
    logger.debug("Adding attendance Entry")
    attendanceDetailsCache[timestamp] = AttendanceDetails;  // Use the timestamp as the key
    saveAttendanceData();
};

// Get attendance by timestamp
const getAttendanceReport = (timestamp) => {
    loadAttendanceData();
    const attendance = attendanceDetailsCache[timestamp] || null;  // Return null if the Attendance doesn't exist
    logger.debug(`getAttendanceReport`)
    return attendance
};

// get latest recent attendance report
const getRecentAttendanceTimestamp = () => {
    const timestamps = Object.keys(attendanceDetailsCache).sort((a, b) => a - b);
    const latestTimestamp = timestamps[timestamps.length - 1];
    return latestTimestamp;
};


// Get all attendance
const getAllAttendanceReport = () => {
    loadAttendanceData();
    return attendanceDetailsCache;
}

// Get the attendance history Summary
const getAttendanceHistorySummary = () =>{
    const attendanceHistorySummary = [];
    loadAttendanceData();
    for (let timestamp in attendanceDetailsCache){
        const {presentCount,absentCount} =getCounts(attendanceDetailsCache[timestamp]);
        attendanceHistorySummary.push({
            timestamp,
            presentCount,
            absentCount
        })
    }
    logger.debug("Sending AttendanceHistorySummary")
    return attendanceHistorySummary;
};

module.exports = { addAttendanceEntry, getAttendanceReport,getAllAttendanceReport,getAttendanceHistorySummary,getRecentAttendanceTimestamp};
