require('dotenv').config();

const mysql = require('mysql');

// konfiguracja połączenia z bazą danych
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect(error => {
  if (error) throw error;
  console.log("Połączono z bazą danych!");
});

module.exports = connection;
