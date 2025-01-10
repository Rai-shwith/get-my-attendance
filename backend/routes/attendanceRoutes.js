// backend/routes/attendanceRoutes.js

const express = require('express');
const router = express.Router();
/*
const attendanceController = require('../controllers/attendanceController');
const { attendance, getStudentById } = require('../models/studentDetails');
const { getAttendanceState, getRemainingAttendanceTime } = require('../states/attendanceState');
const { logger } = require('../utils/logger');
const AppError = require('../utils/AppError');


// Middleware to check if the Attendance process is active
const checkActive = (req, res, next) => {
    // if attendance process is not active 
    if (!getAttendanceState()) {
        logger.debug("Attendance not started yet")
        // TODO:
        next(new AppError())
    }
    next()
};

// Middleware to handle if student is not registered
const validateRegistration = (req,res,next) => {
    const registerID = req.session.registerID;
    if (!registerID) {
        logger.error("Student not registered!");
        const remainingTime = getRemainingAttendanceTime();
        return res.render('attendance', {
            name: "",
            usn: "",
            attendanceStarted: true,
            color: "#f44336",
            message: "You are not registered! 📋<br> Please contact the admin. 👨‍💻",
            showReasons: false,
            hideInfo: true,
            interval: remainingTime
        });
    }
    next()
};

// Middleware to check if student already gave attendance or not
const checkAttendanceAlreadyGiven = (req, res, next) => {
    const registerID = req.session.registerID;
    const student = attendance.getPresentStudentByID(registerID)
    // Student already marked the attendance
    if (student){
        logger.warn(student.name + " already gave attendance!");
        const remainingTime = getRemainingAttendanceTime();
        return res.render('attendance', {
            name: student.name,
            usn: student.usn,
            attendanceStarted: true,
            color: "#ff9800",
            message:  "Attendance already taken! 🙅‍♂️",
            showReasons: false,
            hideInfo: false,
            interval: remainingTime
        });
    }
    next();
};


// Start attendance
router.get('/', checkActive,validateRegistration,checkAttendanceAlreadyGiven,attendanceController.giveAttendance);

*/
module.exports = router;
