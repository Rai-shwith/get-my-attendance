let isRegistrationStarted = false; // Default state

// Get the current registration state
const getRegistrationState = () => isRegistrationStarted;

// Set the registration state
const setRegistrationState = (state) => {
    isRegistrationStarted = state;
};

module.exports = { getRegistrationState, setRegistrationState };
