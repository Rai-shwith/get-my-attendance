const arp = require('node-arp');
const { logger } = require('../utils/logger');

const macAddressMiddleware = async (req, res, next) => {
    const ip = req.ip; // Get the IP address of the connected device

    // Resolve the MAC address using the ARP table
    arp.getMAC(ip, (err, mac) => {
        logger.info("Entering macAddressMiddleware");
        if (err) {
            logger.error(`Error fetching MAC address for IP ${ip}:`, err);
            req.macAddress = null; // Set MAC address to null if there's an error
        } else {
            logger.info(`\nIP: ${ip}, MAC Address: ${mac}\n`);
            req.macAddress = mac; // Attach MAC address to the request object
        }
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = macAddressMiddleware;