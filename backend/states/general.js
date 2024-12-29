const { server } = require("../config/env");
const { getLocalIP } = require("../utils/helpers");

// Variable to store the Ip address
const IpAddress = getLocalIP();
let DOMAIN = null;
if (server.domain){
    DOMAIN = server.domain;
}

const getDomainName = () => {
    return DOMAIN || IpAddress;
}


exports.getBaseURL = () => {
    return `http://${getDomainName()}${server.port==80?"":":"+server.port}`;
}