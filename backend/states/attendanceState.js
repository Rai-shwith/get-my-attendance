// backend/states/attendanceState.js

let isAttendanceStarted = false; // Default state
 
let attendanceStartTime = null ; // Default state

let attendanceWindowInterval = 0; // Default state

// Get the current attendance state
const getAttendanceState = () => isAttendanceStarted;

// Set the attendance state
const setAttendanceState = (state) => {
    if (state){
        // Set the start time of attendance
        attendanceStartTime = new Date();
        autoStopAttendance();
    }
    isAttendanceStarted = state;
};


// Function to set the attendance window interval
const setAttendanceWindowInterval = (interval) => {
    attendanceWindowInterval = interval;
};

// Function to get the remaining time for attendance
const getRemainingAttendanceTime = () => {
    const currentTime = new Date();
    const timeDiff = currentTime - attendanceStartTime;
    const remainingTime = attendanceWindowInterval - timeDiff;
    return remainingTime;
};

// Function to automatically stop the attendance after the interval
const autoStopAttendance = () => {
    setTimeout(() => {
        setAttendanceState(false);
        // TODO: generate the results and notify host
    }, attendanceWindowInterval);
};

module.exports = { getAttendanceState, setAttendanceState,getRemainingAttendanceTime,setAttendanceWindowInterval };
