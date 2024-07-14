const mysql = require("mysql2");
const ENV = require("../config/config");
const pool = mysql.createPool({
  host: ENV.dbHost,
  user: ENV.dbUser,
  password: ENV.dbPassword,
  database: ENV.dbName,
  // port:3307,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool.promise();
