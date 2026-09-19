// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'brsnbcr7hjfgmgle84ag-mysql.services.clever-cloud.com',
  port: 3306,
  user: 'ufggp2rwcazaskip',
  password: '46SYyN9CC0DcGhiLlQ5O',
  database: 'brsnbcr7hjfgmgle84ag',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ เชื่อมต่อ Cloud MySQL ไม่สำเร็จ:', err.message);
  } else {
    console.log('✅ เชื่อมต่อ Cloud MySQL สำเร็จเรียบร้อย!');
    connection.release();
  }
});

module.exports = pool.promise();