const mysql = require('mysql');

let connection;
try {
       connection = mysql.createConnection({
              host: "localhost",
              user: "root",
              password: "",
              database: "bgivundzrylpnlvsapmh",
              // port: 3307,
       })
        connection.connect((err) => {
            if (err) {
              console.error("Error al conectar a la base de datos:", err);
            } else {
              console.log(`Database connection succeful`);
            }
          });
} catch (error) {
       
}
module.exports = connection;
