const {auth} = require('../config/env');
// Exporting a function that checks if the password is correct
const authenticateHost = (password) => {
    return password === auth.password;
};

module.exports = { authenticateHost };