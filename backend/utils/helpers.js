const crypto = require('crypto');
const { logger } = require('./logger');
const os = require('os');

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

exports.getCounts = (combinedData) => {
    // Initialize counters
    let presentCount = 0;
    let absentCount = 0;
  
    // Iterate through combinedData to count statuses
    combinedData.forEach((item) => {
      if (item.status === 'Present') {
        presentCount++;
      } else if (item.status === 'Absent') {
        absentCount++;
      }
    });
  
    // Return counts as an object
    return { presentCount, absentCount };
  };

exports.getFormattedDate = (timestamp) => {
  logger.debug("getFormattedDate : Entering timestamp"+timestamp);

  const date = new Date(parseInt(timestamp));
  
  if (!timestamp || isNaN(date.getTime())) {
    throw new Error("Invalid timestamp provided");
}
    // Formatting Date
    const options = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date).replace(":", "-");
    return formattedDate;
}

// Function to ger the Ip address
exports.getLocalIP = () => {
  logger.debug("Fetching the Ip Address")
    const interfaces = os.networkInterfaces();
    let localIP = '0.0.0.0'; // Default fallback IP in case no valid address is found

    // Loop through all network interfaces
    for (const iface in interfaces) {
        for (const alias of interfaces[iface]) {
            // Check if the alias is IPv4 and not internal (loopback address)
            if (alias.family === 'IPv4' && !alias.internal) {
                localIP = alias.address; // Use the first non-internal IPv4 address
                break; // Stop further searching once a valid IP is found
            }
        }
        if (localIP !== '0.0.0.0') break; // If a valid IP is found, exit the loop
    }
    return localIP;
};
