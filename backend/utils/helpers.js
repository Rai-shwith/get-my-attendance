const crypto = require('crypto');

exports.generateID = () => {
    return crypto.randomBytes(16).toString('hex');
}