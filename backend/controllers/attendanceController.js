// backend/controllers/attendanceController.js

const { attendance, getStudentById } = require('../models/studentDetails');
const excelService = require('../services/excelService');
const pdfService = require('../services/pdfService');
const { getAttendanceState, getRemainingAttendanceTime } = require('../states/attendanceState');
const helpers = require('../utils/helpers');
const { logger } = require('../utils/logger');





exports.giveAttendance = (req, res) => {
    logger.debug("giveAttendance: Entering");
    const registerID = req.session.registerID;
    const student = getStudentById(registerID);
    attendance.addStudent(registerID, student);
    const remainingTime = getRemainingAttendanceTime();
    res.render('attendance', {
        name: student.name,
        usn: student.usn,
        attendanceStarted:true,
        color:"#4caf50",
        message : "Attendance taken successfully! ✅",
        showReasons: false,
        hideInfo : false,
        interval: remainingTime
    });
    logger.info(`Attendance given by ${student.name}[${student.usn}]`);
};

// exports.stopAttendance = (req, res) => {
//     // Logic for stopping attendance and generating reports
//     const pdfPath = pdfService.generateAttendancePDF();
//     const excelPath = excelService.generateAttendanceExcel();
//     res.send({ pdfPath, excelPath });
// };

exports.getAttendanceReport = (req, res) => {
    // Logic to retrieve the attendance report
    res.send('Attendance report');
};
