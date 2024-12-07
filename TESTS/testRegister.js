const fetch = require('node-fetch');
const { faker } = require('@faker-js/faker');
const { performance } = require('perf_hooks');

async function sendRequests(url, numRequests) {
    const tasks = [];

    for (let i = 0; i < numRequests; i++) {
        const info = {
            name: faker.person.fullName(),
            usn: `${faker.string.alpha({ length: 1, casing: 'upper' })}${faker.number.int({ min: 10, max: 99 })}${faker.string.alpha({ length: 1, casing: 'upper' })}${faker.number.int({ min: 1000, max: 9999 })}`
        };
        tasks.push(postRequest(url, info));
    }

    const responses = await Promise.all(tasks);
    return responses;
}

async function postRequest(url, info) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ info }),
        });
        return response.status;
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

(async () => {
    // const targetUrl = "http://192.168.97.57:1111/register";
    const targetUrl = "http://172.29.240.1:80/register";
    const numRequests = 5000;

    const startTime = performance.now();
    await sendRequests(targetUrl, numRequests);
    const endTime = performance.now();

    console.log(`Total time taken: ${(endTime - startTime) / 1000} seconds`);
})();
