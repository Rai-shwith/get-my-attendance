// backend/states/attendanceState.js

let isAttendanceStarted = false; // Default state

// Get the current attendance state
const getAttendanceState = () => isAttendanceStarted;

// Set the attendance state
const setAttendanceState = (state) => {
    isAttendanceStarted = state;
};

module.exports = { getAttendanceState, setAttendanceState };
