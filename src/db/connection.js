const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bgivundzrylpnlvsapmh',
    port: 3307
});

module.exports = pool.promise();