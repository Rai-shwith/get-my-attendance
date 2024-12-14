const fs = require('fs');
const fetch = require('node-fetch');
const { performance } = require('perf_hooks');
const cookieSignature = require('cookie-signature'); // Use cookie signature obfuscation
const { STUDENT_DETAILS_PATH, SECRET_KEY } = require('../config/env');

// Read student details from JSON
const studentDetails = JSON.parse(fs.readFileSync(STUDENT_DETAILS_PATH, 'utf8'));

/**
 * Signs a cookie value using cookie-signature's signed mechanism
 * to match the server's expected format
 * @param {string} cookieValue - Cookie value to sign
 * @returns {string} - Properly signed cookie
 */
function signCookieValue(cookieValue) {
    const signedValue = cookieSignature.sign(cookieValue, SECRET_KEY); // Create signed token
    return `s:${signedValue}`;
}

/**
 * Sends a GET request with the signed cookie to the server
 * @param {string} url - The endpoint URL.
 * @param {string} cookieValue - The cookie value used for simulation
 */
async function sendGetRequest(url, cookieValue) {
    try {
        const signedCookie = signCookieValue(cookieValue);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Cookie': `id=${signedCookie}`, // Send signed cookie to server
            },
        });

    } catch (error) {
        console.error(`Error sending request with cookie ${cookieValue}:`, error.message);
    }
}

/**
 * Simulates attendance by making GET requests to multiple users
 */
async function simulateAttendance() {
    try {
        // const targetUrl = 'http://192.168.97.57:1111'; // Update with your endpoint server
    const targetUrl = "http://172.29.240.1:80";


        const promises = [];
        for (const signedCookieKey in studentDetails) {
            if (studentDetails[signedCookieKey]?.usn) {
                promises.push(sendGetRequest(targetUrl, signedCookieKey));
            }
        }

        await Promise.all(promises);
        console.log('Attendance simulation completed.');
    } catch (error) {
        console.error('Error during simulation:', error.message);
    }
}

// Measure execution time
(async () => {
    const startTime = performance.now();
    await simulateAttendance();
    const endTime = performance.now();
    console.log(`Total execution time: ${(endTime - startTime) / 1000} seconds.`);
})();
