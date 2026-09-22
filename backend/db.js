require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || process.env.MYSQL_ADDON_HOST || 'brsnbcr7hjfgmgle84ag-mysql.services.clever-cloud.com',
  port: process.env.DB_PORT || process.env.MYSQL_ADDON_PORT || 3306,
  user: process.env.DB_USER || process.env.MYSQL_ADDON_USER || 'ufggp2rwcazaskip',
  password: process.env.DB_PASSWORD || process.env.MYSQL_ADDON_PASSWORD || '46SYyN9CC0DcGhiLLQ50',
  database: process.env.DB_NAME || process.env.MYSQL_ADDON_DB || 'brsnbcr7hjfgmgle84ag',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ เชื่อมต่อ MySQL ไม่สำเร็จ:', err.message);
  } else {
    console.log('✅ เชื่อมต่อ MySQL สำเร็จเรียบร้อย!');
    connection.release();
  }
});

module.exports = pool.promise();