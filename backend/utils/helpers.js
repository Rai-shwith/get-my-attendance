const crypto = require('crypto');

exports.generateID = () => {
    return crypto.randomBytes(16).toString('hex');
}

// Function to get combined data with status
exports.combineData = (present,absent) => {
     // Combine and prepare data with status
     const combinedData = [
        ...Object.entries(absent).map(([_, value]) => ({ ...value, status: 'Absent' })),
        ...Object.entries(present).map(([_, value]) => ({ ...value, status: 'Present' })),
    ];
    return combinedData;
};