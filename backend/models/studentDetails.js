const fs = require('fs');
const { filePaths } = require('../config/env');
const { logger } = require('../utils/logger');

let studentCache = {};  // Using an object to store the details of student
let currentRegistrationCache = {}; // Students Registered in a session
let presentStudentCache = {}; // Students present in a attendance session


// Load data into cache once at startup
const loadStudentData = () => {
    try {
        const data = fs.readFileSync(filePaths.studentDetailsPath, 'utf8');
        studentCache = JSON.parse(data);
        logger.debug('Student data loaded successfully');
    } catch (error) {
        logger.error('Failed to load student data:', error);
    }
};

// Get All Registered Students values only
const getAllStudents = () => {
    loadStudentData();
    return Object.values(studentCache);
};

// Get All Registered Students with ID
const getAllStudentsWithId = () => {
    loadStudentData();
    return studentCache;
};

// Save data back to the file system on-demand
const saveStudentData = (newStudentDataBulk = null) => {
    if(newStudentDataBulk){
        logger.info("Updating the Entire Student Info");
        studentCache = newStudentDataBulk;
    }
    try {
        fs.writeFileSync(filePaths.studentDetailsPath, JSON.stringify(studentCache, null, 2), 'utf8');
        logger.debug('Student Data Saved .')
    } catch (error) {
        logger.error('Failed to save student data:', error);
    }
};

// Add a student to the cache
const addStudent = (id, student) => {
    logger.debug(`addStudent :${id} -> ${student.name}[${student.usn}]`)
    studentCache[id] = student;  // Use the unique ID as the key
};

// Get student by ID
const getStudentById = (id) => {
    const student = studentCache[id] || null;  // Return null if the student doesn't exist
    logger.debug(`getStudentByID :${id} -> ${student}]`)
    return student
};

// Get student by name 
const getStudentByName = (name) => {

    for (let id in studentCache) {
        if (studentCache[id].name === name) {
            logger.debug(`getStudentByName :${name} -> ${id}[${student.usn}]`)
            return studentCache[id];  // Return student if name matches
        }
    }
    return null;  // Return null if no match is found
};

// Get student by name 
const getStudentByUSN = (usn) => {
    for (let id in studentCache) {
        if (studentCache[id].usn === usn) {
            logger.debug(`getStudentByUSN :${usn} -> ${id}[${studentCache[id].name}]`)
            return studentCache[id];  // Return student if USN matches
        }
    }
    return null;  // Return null if no match is found
};


// Object to store operation on current Registration
const currentRegistration = {};
currentRegistration.addStudent = (id, student) => {
    logger.debug(`currentRegistration.addStudent :${id} -> ${student.name}[${student.usn}]`)
    currentRegistrationCache[id] = student;
    // Save permanently
    addStudent(id,student)
};

// Function to get Current Registered Students
currentRegistration.getCurrentRegisteredStudents = () => {
    return Object.values(currentRegistrationCache);
}

// Object to store operations on attendance
const attendance = {};

// Function to get the details of student who gave attendance
attendance.getPresentStudentByID = (id) => {
    const student = presentStudentCache[id] || null;  // Return null if the student doesn't exist
    logger.debug(`attendance.getStudentByID :${id} -> ${student}]`)
    return student
};

// Function to add student to presentStudentCache
attendance.addStudent = (id, student) => {
    logger.debug(`attendance.addStudent :${id} -> ${student.name}[${student.usn}]`)
    presentStudentCache[id] = student;
};

// Function to get present students
attendance.getPresentStudents = () => {
    logger.debug("getPresentStudents")
    return presentStudentCache;
};

// Function to get absent students
attendance.getAbsentStudents = () => {
    logger.debug("getAbsentStudents");
    const absentStudents = {};
    for (let id in studentCache) {
        if (!presentStudentCache[id]) {
            absentStudents[id] = studentCache[id];
        }
    }
    return absentStudents;
}

loadStudentData()

module.exports = { loadStudentData, saveStudentData, addStudent, getStudentById, getStudentByName, getStudentByUSN, getAllStudents,getAllStudentsWithId, currentRegistration,attendance };
