const arp = require('node-arp');

// Function to fetch MAC address based on IP
const getMacAddress = async (ip) => {
    console.log("first line of getMacAddress")
    return new Promise((resolve, reject) => {
        arp.getMAC(ip, (err, mac) => {
            if (err || !mac) {
                reject(`Could not fetch MAC address for IP: ${ip}`);
            } else {
                resolve(mac);
            }
        });
    });
};

const main = async()=>{
    let a = await (getMacAddress('192.168.73.73'));
    console.log(a)

}
main()