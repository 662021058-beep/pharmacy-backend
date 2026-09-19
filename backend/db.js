// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'std.csit.scidi.tsu.ac.th',           // ชี้ไปที่ฐานข้อมูลในเซิร์ฟเวอร์มหาลัย
  port: 3306,                  // Port มาตรฐานของ MySQL
  user: 's662021058',          // Username ของมหาลัย
  password: 'earth0918658003',   // Password ของมหาลัย
  database: 'db662021058',      // ชื่อ Database ของมหาลัย (หรือ db662021058 ตามที่ระบุ)
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ เชื่อมต่อ MySQL มหาลัยไม่สำเร็จ:', err.message);
  } else {
    console.log('✅ เชื่อมต่อ MySQL มหาลัยสำเร็จเรียบร้อย!');
    connection.release();
  }
});

module.exports = pool.promise();