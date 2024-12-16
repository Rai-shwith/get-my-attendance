const { server } = require("../config/env");
const { getLocalIP } = require("../utils/helpers");

// Variable to store the Ip address
const IpAddress = getLocalIP();

exports.getDomain = () => {
    return IpAddress;
}

exports.getBaseURL = () => {
    return `http://${IpAddress}${server.port==80?"":":"+server.port}`;
}