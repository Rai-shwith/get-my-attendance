// backend/states/attendanceState.js

let 

// Get the current attendance state
const getAttendanceState = () => isAttendanceStarted;

// Set the attendance state
const setAttendanceState = (state) => {
    isAttendanceStarted = state;
};

module.exports = { getAttendanceState, setAttendanceState };
