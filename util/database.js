const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'nodejs-udemy',
  password: 'MiBceo5R',
});

module.exports = pool.promise();
