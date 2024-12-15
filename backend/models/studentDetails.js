const fs = require('fs');
const { filePaths } = require('../config/env');
const { logger } = require('../utils/logger');

let studentCache = {};  // Using an object to store the details of student
let currentRegistrationCache = {}; // Students Registered in a session


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

// Save data back to the file system on-demand
const saveStudentData = () => {
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
};

loadStudentData()

module.exports = { loadStudentData, saveStudentData, addStudent, getStudentById, getStudentByName, getStudentByUSN, currentRegistration };
