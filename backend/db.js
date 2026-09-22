// db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: '127.0.0.1',       // ใช้ IP ชี้ไปที่เครื่องตัวเอง
  port: 3306,              // Port มาตรฐานของ MySQL ใน XAMPP
  user: 'root',
  password: '',            // XAMPP ค่าเริ่มต้นไม่มีรหัสผ่าน (ปล่อยว่าง)
  database: 'lalita_pharmacy',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ เชื่อมต่อ MySQL ไม่สำเร็จ:', err.message);
  } else {
    console.log('✅ เชื่อมต่อ MySQL ใน XAMPP สำเร็จเรียบร้อย!');
    connection.release();
  }
});

module.exports = pool.promise();