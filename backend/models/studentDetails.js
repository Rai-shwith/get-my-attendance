const fs = require('fs');
const { filePaths } = require('../config/env');

let studentCache = {};  // Using an object instead of an array

// Load data into cache once at startup
const loadStudentData = () => {
    try {
        const data = fs.readFileSync(filePaths.studentDetailsPath, 'utf8');
        studentCache = JSON.parse(data);
    } catch (error) {
        console.error('Failed to load student data:', error);
    }
};

// Save data back to the file system on-demand
const saveStudentData = () => {
    try {
        fs.writeFileSync(filePaths.studentDetailsPath, JSON.stringify(studentCache, null, 2), 'utf8');
    } catch (error) {
        console.error('Failed to save student data:', error);
    }
};

// Add a student to the cache
const addStudent = (id, student) => {
    studentCache[id] = student;  // Use the unique ID as the key
};

// Get student by ID
const getStudentById = (id) => {
    return studentCache[id] || null;  // Return null if the student doesn't exist
};

// Get student by name 
const getStudentByName = (name) => {
    for (let id in studentCache) {
        if (studentCache[id].name === name) {
            return studentCache[id];  // Return student if name matches
        }
    }
    return null;  // Return null if no match is found
};

// Get student by name 
const getStudentByUSN = (usn) => {
    for (let id in studentCache) {
        if (studentCache[id].usn === usn) {
            return studentCache[id];  // Return student if USN matches
        }
    }
    return null;  // Return null if no match is found
};


module.exports = { loadStudentData, addStudent, getStudentById, getStudentByName, getStudentByUSN };
