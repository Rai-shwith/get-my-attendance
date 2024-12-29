const { Pool } = require('pg');
const { db } = require('./env');
const { logger } = require('../utils/logger');

// Configure the PostgreSQL connection pool
exports.pool = new Pool({
    user: db.username,
    host: db.host,
    database: db.database,
    password: db.password,
    port: db.port,
});

//  Function to check database connection
const checkDatabaseConnection = async () => {
    try {
        const client = await exports.pool.connect();
        logger.info('Database connection successful');
        client.release(); // Release the client back to the pool
    } catch (error) {
        logger.error('Database connection error : '+ error);
        process.exit(1); // Exit the process if the database is not reachable
    }
};

// Check the database connection when the module is loaded
checkDatabaseConnection();