const { Pool } = require('pg');
const { db } = require('./env');

// Configure the PostgreSQL connection pool
exports.pool = new Pool({
    user: db.username,
    host: db.host,
    database: db.database,
    password: db.password,
    port: db.port,
});

