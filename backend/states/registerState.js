const { logger } = require("../utils/logger");

let isRegistrationStarted = false; // Default state

let registrationStartTime = null ; // Default state

let registrationWindowInterval = 0; // Default state

// Get the current registration state
const getRegistrationState = () => isRegistrationStarted;

// Set the registration state
const setRegistrationState = (state) => {
    logger.debug("Registration State : "+state);
    if (state){
        // Set the start time of registration
        registrationStartTime = new Date();
        autoStopRegistration();
    }
    isRegistrationStarted = state;
};


// Function to set the Registration window interval
const setRegistrationWindowInterval = (interval) => {
    logger.debug("Registration Window Interval : "+interval);
    registrationWindowInterval = interval;
};

// Function to get the remaining time for Registration
const getRemainingRegistrationTime = () => {
    const currentTime = new Date();
    const timeDiff = currentTime - registrationStartTime;
    const remainingTime = registrationWindowInterval - timeDiff;
    return remainingTime;
};

// Function to automatically stop the Registration after the interval
const autoStopRegistration = () => {
    setTimeout(() => {
        logger.debug("Registration Stopped due to time up");
        setRegistrationState(false);
        // TODO: generate the results and notify host
    }, registrationWindowInterval);
};


module.exports = { getRegistrationState, setRegistrationState,setRegistrationWindowInterval,getRemainingRegistrationTime };
