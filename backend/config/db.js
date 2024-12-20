const { Pool } = require('pg');
const { db } = require('./env');

// Configure the PostgreSQL connection pool
const pool = new Pool({
    user: db.username,
    host: db.host,
    database: db.database,
    password: db.password,
    port: db.port,
});

// Insert a student
async function addStudent(name,usn, password, branch, semester, section) {
    // const query = `
    //   INSERT INTO Students (name,usn, password, branch, semester, section)
    //   VALUES ($1, $2, $3, $4, $5,$6)
    //   RETURNING id;
    // `;

    const query = `
       SELECT * FROM Students WHERE usn = $1;
    `;
  
    const values = [usn];
    const result = await pool.query(query, values);
    console.log('New Student :', result.rows);
  }
  
  // Call the function
  addStudent('John Doe 2','1MS23EC029', 'password', 'CSE', 6, 'A');

// module.exports = pool;
