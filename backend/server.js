const express = require('express');
const cors = require('cors');

const axios = require('axios');
const cron = require('node-cron');
const db = require('./db');

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 🔑 ตั้งค่า LINE Messaging API Token
const CHANNEL_ACCESS_TOKEN = 'usa+9GHFHDZU51oWCbsaKCCannqWYEttN9rT4iU6zZZ6QXb1xJ2t57r1lOyY/awsgvVNhVISp6BSky/AoX6pe2f6Qr4xfmWc1hnn8g9EPyjKyAb+5L+H2kYxyaXNiXSypZRbsbC9Z0M8Utt82lRINAdB04t89/1O/w1cDnyilFU=';

// ----------------------------------------------------
// 📲 HELPER FUNCTIONS FOR LINE MESSAGING
// ----------------------------------------------------
async function sendPushMessage(toUserId, textMessage) {
  if (!toUserId) return;
  try {
    await axios.post(
      'https://api.line.me/v2/bot/message/push',
      {
        to: toUserId,
        messages: [{ type: 'text', text: textMessage }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
        }
      }
    );
    console.log(`✅ ส่ง LINE Notification ไปยัง ${toUserId} สำเร็จ`);
  } catch (error) {
    console.error(`❌ เกิดข้อผิดพลาดในการส่ง LINE หา ${toUserId}:`, error.response?.data || error.message);
  }
}

async function replyLineMessage(replyToken, textMessage) {
  try {
    await axios.post(
      'https://api.line.me/v2/bot/message/reply',
      {
        replyToken: replyToken,
        messages: [{ type: 'text', text: textMessage }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CHANNEL_ACCESS_TOKEN}`
        }
      }
    );
  } catch (error) {
    console.error('❌ Reply Line Error:', error.response?.data || error.message);
  }
}

// ⏰ AUTOMATED DAILY NOTIFICATION (กรองเฉพาะล็อตที่ยังไม่หมดอายุเท่านั้น)
async function generateStockReportAndNotify() {
  try {
    // 1. ดึงยาสต็อกต่ำกว่าเกณฑ์ (สำหรับ Admin)
    const [lowStock] = await db.query(`
      SELECT p.product_code, p.product_name, p.min_stock, p.unit, COALESCE(SUM(l.quantity), 0) AS total_qty
      FROM products p
      LEFT JOIN product_lots l ON p.product_id = l.product_id AND l.expiry_date > CURDATE()
      GROUP BY p.product_id
      HAVING total_qty <= p.min_stock
    `);

    // 2. ดึงยาล็อตที่หมดอายุแล้ว (รวมล็อตที่หมดอายุวันนี้) (สำหรับ Admin)
    const [expired] = await db.query(`
      SELECT p.product_code, p.product_name, l.lot_number, l.quantity, l.expiry_date, p.unit,
             COALESCE(l.cost_price, p.cost_price, 0) AS cost_price
      FROM product_lots l
      JOIN products p ON l.product_id = p.product_id
      WHERE l.expiry_date <= CURDATE() AND l.quantity > 0
      ORDER BY l.expiry_date ASC
    `);

    // 3. ดึงยาล็อตใกล้หมดอายุใน 90 วัน (เฉพาะล็อตที่ยังไม่หมดอายุ / เหลือ 1 วันขึ้นไป)
    const [expiring] = await db.query(`
      SELECT p.product_code, p.product_name, l.lot_number, l.quantity, l.expiry_date, p.unit,
             DATEDIFF(l.expiry_date, CURDATE()) AS days_left,
             COALESCE(l.cost_price, p.cost_price, 0) AS cost_price
      FROM product_lots l
      JOIN products p ON l.product_id = p.product_id
      WHERE l.expiry_date > CURDATE() 
        AND DATEDIFF(l.expiry_date, CURDATE()) <= 90 
        AND l.quantity > 0
      ORDER BY days_left ASC
    `);

    // 4. คำนวณมูลค่าเสียหาย (ยาล็อตที่หมดอายุแล้ว) และมูลค่าเสี่ยง (ยาล็อตใกล้หมดอายุ)
    const expiredLossValue = expired.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.cost_price)), 0);
    const expiringRiskValue = expiring.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.cost_price)), 0);

    // 5. ดึงรายชื่อผู้ใช้ทั้งหมดที่มี line_user_id
    const [users] = await db.query('SELECT name, role, line_user_id FROM users WHERE line_user_id IS NOT NULL AND line_user_id != ""');

    if (users.length === 0) {
      console.log('⚠️ ไม่พบผู้ใช้งานที่ลงทะเบียน LINE User ID ในระบบ');
      return;
    }

    const todayStr = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });

    // 🅰️ ข้อความรายงานสำหรับ ผู้ดูแลระบบ (Admin)
    let adminMsg = `🔔 [Lalita Pharmacy] รายงานสำหรับผู้ดูแลระบบ (Admin)\n📅 วันที่: ${todayStr} (08:00 น.)\n\n`;

    adminMsg += `⚠️ 1. ยาสต็อกต่ำกว่าเกณฑ์ (${lowStock.length} รายการ):\n`;
    if (lowStock.length > 0) {
      lowStock.forEach((item, idx) => {
        adminMsg += `${idx + 1}. [${item.product_code}] ${item.product_name} (เหลือ ${item.total_qty} ${item.unit} / เกณฑ์ ${item.min_stock})\n`;
      });
    } else {
      adminMsg += ` - สต็อกอยู่ในระดับปกติทุกรายการ\n`;
    }

    adminMsg += `\n❌ 2. ยาล็อตหมดอายุแล้ว (${expired.length} ล็อต):\n`;
    if (expired.length > 0) {
      expired.forEach((item, idx) => {
        adminMsg += `${idx + 1}. [${item.product_code}] ${item.product_name} Lot: ${item.lot_number} (คงค้าง: ${item.quantity} ${item.unit})\n`;
      });
      adminMsg += `💸 รวมมูลค่าความเสียหาย: ฿${expiredLossValue.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
    } else {
      adminMsg += ` - ไม่มียาล็อตที่หมดอายุแล้ว\n`;
    }

    adminMsg += `\n⏳ 3. ยาล็อตใกล้หมดอายุใน 90 วัน (${expiring.length} ล็อต):\n`;
    if (expiring.length > 0) {
      expiring.forEach((item, idx) => {
        adminMsg += `${idx + 1}. [${item.product_code}] ${item.product_name} Lot: ${item.lot_number} (เหลือ ${item.days_left} วัน | จำนวน: ${item.quantity} ${item.unit})\n`;
      });
      adminMsg += `💰 รวมมูลค่าเสี่ยง: ฿${expiringRiskValue.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
    } else {
      adminMsg += ` - ไม่มียาล็อตเสี่ยงหมดอายุ\n`;
    }

    // 💊 ข้อความรายงานสำหรับ เภสัชกร (Pharmacist)
    let pharmMsg = `🔔 [Lalita Pharmacy] รายงานยาล็อตใกล้หมดอายุ (เภสัชกร)\n📅 วันที่: ${todayStr} (08:00 น.)\n\n`;

    pharmMsg += `⏳ ยาล็อตใกล้หมดอายุภายใน 90 วัน (${expiring.length} ล็อต):\n`;
    if (expiring.length > 0) {
      expiring.forEach((item, idx) => {
        pharmMsg += `${idx + 1}. [${item.product_code}] ${item.product_name} Lot: ${item.lot_number} (เหลือ ${item.days_left} วัน | จำนวน: ${item.quantity} ${item.unit})\n`;
      });
    } else {
      pharmMsg += ` - ไม่มียาล็อตเสี่ยงหมดอายุ\n`;
    }
    pharmMsg += `\n💡 โปรดจ่ายยาล็อตใกล้หมดอายุก่อนตามหลัก FEFO ในหน้าเบิกจ่ายหน้าร้านครับ`;

    // 📲 วนลูปส่งข้อความหาผู้ใช้แยกตาม Role
    for (const u of users) {
      const userRoleLower = (u.role || '').toLowerCase();
      const isAdmin = userRoleLower.includes('admin') || userRoleLower.includes('ผู้ดูแลระบบ');
      
      const targetMsg = isAdmin ? adminMsg : pharmMsg;
      await sendPushMessage(u.line_user_id, `สวัสดีครับคุณ ${u.name}\n\n${targetMsg}`);
    }

  } catch (err) {
    console.error('❌ เกิดข้อผิดพลาดในการประมวลผล Cron Job:', err.message);
  }
}

// ตั้งเวลาทำรายการตอน 8:00 น. ของทุกวัน (เวลาประเทศไทย Asia/Bangkok)
cron.schedule('0 8 * * *', () => {
  console.log('⏰ [Cron Job] กำลังส่งข้อความแจ้งเตือนคลังยาประจำวันเวลา 08:00 น...');
  generateStockReportAndNotify();
}, {
  scheduled: true,
  timezone: "Asia/Bangkok"
});

// 🚀 Health Check
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');
    return res.status(200).json({ success: true, message: '🚀 Backend & Database พร้อมทำงาน!' });
  } catch (error) {
    return res.status(500).json({ success: false, message: '❌ DB Error: ' + error.message });
  }
});

// 🔑 API Authentication
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'กรุณากรอก Username และ Password ให้ครบถ้วน' });
  }

  try {
    const [rows] = await db.query(
      'SELECT user_id, name, role, username, password_hash, line_user_id FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'ไม่พบชื่อผู้ใช้งานนี้ในระบบ' });
    }

    const user = rows[0];

    if (user.password_hash !== password) {
      return res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
    }

    const { password_hash, ...userInfo } = user;
    return res.status(200).json({
      success: true,
      message: 'เข้าสู่ระบบสำเร็จ',
      user: userInfo
    });
  } catch (error) {
    console.error('❌ Error during login:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 👤 API User Management
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, name, role, username, line_user_id FROM users ORDER BY user_id DESC');
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/users', async (req, res) => {
  const { user_id, username, password, name, role, line_user_id } = req.body;
  if (!username || !password || !name || !role) {
    return res.status(400).json({ success: false, message: 'กรุณากรอกข้อมูลผู้ใช้ให้ครบถ้วน' });
  }

  try {
    const [existing] = await db.query('SELECT user_id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username นี้มีในระบบแล้ว' });
    }

    if (user_id) {
      await db.query(
        'INSERT INTO users (user_id, username, password_hash, name, role, line_user_id) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, username, password, name, role, line_user_id || null]
      );
    } else {
      await db.query(
        'INSERT INTO users (username, password_hash, name, role, line_user_id) VALUES (?, ?, ?, ?, ?)',
        [username, password, name, role, line_user_id || null]
      );
    }

    return res.status(201).json({ success: true, message: 'เพิ่มผู้ใช้งานสำเร็จ!' });
  } catch (error) {
    console.error('❌ Error creating user:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.patch('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, role, password, line_user_id, username } = req.body;

  try {
    let updateFields = [];
    let params = [];

    if (name !== undefined) { updateFields.push('name = ?'); params.push(name); }
    if (role !== undefined) { updateFields.push('role = ?'); params.push(role); }
    if (line_user_id !== undefined) { updateFields.push('line_user_id = ?'); params.push(line_user_id || null); }
    if (username !== undefined) { updateFields.push('username = ?'); params.push(username); }
    if (password !== undefined && password !== '') { updateFields.push('password_hash = ?'); params.push(password); }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'ไม่มีข้อมูลที่จะอัปเดต' });
    }

    params.push(id);
    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`;
    const [result] = await db.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้งาน ID นี้ในระบบ' });
    }

    return res.status(200).json({ success: true, message: 'อัปเดตข้อมูลผู้ใช้เรียบร้อย!' });
  } catch (error) {
    console.error('❌ Error updating user:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE user_id = ?', [id]);
    return res.status(200).json({ success: true, message: 'ลบผู้ใช้งานเรียบร้อย' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 📦 API Products & Stock
app.get('/api/products', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products ORDER BY product_id DESC');
    const [lots] = await db.query('SELECT * FROM product_lots ORDER BY expiry_date ASC');

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dataList = products.map(p => {
      const productLots = lots.filter(l => l.product_id === p.product_id);
      const activeLots = productLots.filter(l => {
        const exp = new Date(l.expiry_date);
        exp.setHours(0, 0, 0, 0);
        return l.quantity > 0 && exp >= today;
      });

      activeLots.sort((a, b) => new Date(a.expiry_date) - new Date(b.expiry_date));

      const total_quantity = activeLots.reduce((sum, l) => sum + Number(l.quantity), 0);
      const fefo_lot = activeLots.length > 0 ? activeLots[0].lot_number : null;
      const nearest_expiry = activeLots.length > 0 ? activeLots[0].expiry_date : null;

      return {
        id: p.product_id,
        product_id: p.product_id,
        product_code: p.product_code,
        product_name: p.product_name,
        product_type: p.product_type,
        unit: p.unit,
        category: p.category,
        cost_price: p.cost_price,
        selling_price: p.selling_price,
        min_stock: p.min_stock,
        location: p.location,
        total_quantity,
        nearest_expiry,
        fefo_lot,
        lots: productLots.map(l => ({
          lot_id: l.lot_id,
          lot_number: l.lot_number,
          expiry_date: l.expiry_date,
          quantity: l.quantity,
          cost_price: l.cost_price,
          selling_price: l.selling_price
        }))
      };
    });

    return res.status(200).json({ success: true, data: dataList });
  } catch (error) {
    console.error('❌ Error fetching products:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  const { 
    product_code, product_name, product_type, unit, category,
    cost_price, selling_price, min_stock, location,
    lot_number, expiry_date, quantity 
  } = req.body;

  try {
    let productId;
    const [existingProduct] = await db.query(
      'SELECT product_id FROM products WHERE product_code = ?',
      [product_code]
    );

    if (existingProduct.length > 0) {
      productId = existingProduct[0].product_id;
      await db.query(
        `UPDATE products SET 
          product_name = ?, product_type = ?, unit = ?, category = ?, 
          cost_price = ?, selling_price = ?, location = ?
        WHERE product_id = ?`,
        [
          product_name, product_type, unit || 'เม็ด', category || 'ยาสามัญประจำบ้าน',
          parseFloat(cost_price) || 0, parseFloat(selling_price) || 0,
          location || 'ตู้ทั่วไป', productId
        ]
      );
    } else {
      const [productResult] = await db.query(
        `INSERT INTO products 
        (product_code, product_name, product_type, unit, category, cost_price, selling_price, min_stock, location) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          product_code, product_name, product_type, unit || 'เม็ด', category || 'ยาสามัญประจำบ้าน',
          parseFloat(cost_price) || 0, parseFloat(selling_price) || 0,
          parseInt(min_stock) || 10, location || 'ตู้ทั่วไป'
        ]
      );
      productId = productResult.insertId;
    }

    await db.query(
      `INSERT INTO product_lots 
        (product_id, lot_number, expiry_date, quantity, cost_price, selling_price) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        productId, lot_number, expiry_date, parseInt(quantity) || 0,
        parseFloat(cost_price) || 0, parseFloat(selling_price) || 0
      ]
    );

    return res.status(201).json({ 
      success: true, 
      message: existingProduct.length > 0 ? 'เพิ่มล็อตใหม่ให้ยาเดิมเรียบร้อย!' : 'บันทึกยาและล็อตใหม่เรียบร้อย!' 
    });
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/dispense', async (req, res) => {
  const { product_id, lot_id, lot_number, quantity, dispensed_by } = req.body;

  const qtyToDeduct = parseInt(quantity);
  if (isNaN(qtyToDeduct) || qtyToDeduct <= 0) {
    return res.status(400).json({ success: false, message: 'จำนวนเบิกต้องเป็นตัวเลขที่มากกว่า 0' });
  }

  try {
    let lots = [];
    if (lot_id) {
      const [rows] = await db.query(
        'SELECT lot_id, product_id, lot_number, quantity, selling_price, expiry_date FROM product_lots WHERE lot_id = ?',
        [lot_id]
      );
      lots = rows;
    }

    if (lots.length === 0 && lot_number) {
      const [rows] = await db.query(
        'SELECT lot_id, product_id, lot_number, quantity, selling_price, expiry_date FROM product_lots WHERE lot_number = ?',
        [lot_number]
      );
      lots = rows;
    }

    if (lots.length === 0 && product_id) {
      const [rows] = await db.query(
        `SELECT l.lot_id, l.product_id, l.lot_number, l.quantity, l.selling_price, l.expiry_date 
         FROM product_lots l
         JOIN products p ON l.product_id = p.product_id
         WHERE (p.product_id = ? OR p.product_code = ?) 
           AND l.quantity > 0 
           AND l.expiry_date >= CURDATE()
         ORDER BY l.expiry_date ASC LIMIT 1`,
        [product_id, product_id]
      );
      lots = rows;
    }

    if (lots.length === 0) {
      return res.status(404).json({ success: false, message: `ไม่พบล็อตยาที่พร้อมใช้งานหรือยังไม่หมดอายุในระบบ` });
    }

    const targetLot = lots[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(targetLot.expiry_date);
    expDate.setHours(0, 0, 0, 0);

    if (expDate < today) {
      return res.status(400).json({
        success: false,
        message: `❌ ไม่สามารถเบิกจ่ายได้: ยาล็อต ${targetLot.lot_number} หมดอายุแล้ว`
      });
    }

    if (targetLot.quantity < qtyToDeduct) {
      return res.status(400).json({ 
        success: false, 
        message: `จำนวนยาในล็อตนี้ (${targetLot.quantity}) มีไม่พอสำหรับการเบิกจ่าย (${qtyToDeduct})` 
      });
    }

    await db.query(
      'UPDATE product_lots SET quantity = quantity - ? WHERE lot_id = ?',
      [qtyToDeduct, targetLot.lot_id]
    );

    try {
      let userId = dispensed_by || 'U001';
      const [uRows] = await db.query('SELECT user_id FROM users WHERE user_id = ? OR username = ?', [userId, userId]);
      if (uRows.length > 0) userId = uRows[0].user_id;

      const [txResult] = await db.query(
        "INSERT INTO stock_transactions (user_id, transaction_type) VALUES (?, 'DISPENSE')",
        [userId]
      );
      if (txResult.insertId) {
        await db.query(
          "INSERT INTO stock_transaction_details (transaction_id, product_id, lot_id, quantity, unit_price) VALUES (?, ?, ?, ?, ?)",
          [txResult.insertId, targetLot.product_id, targetLot.lot_id, qtyToDeduct, targetLot.selling_price || 0]
        );
      }
    } catch (txErr) {
      console.warn('⚠️ บันทึก Transaction log ไม่สำเร็จ:', txErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `เบิกจ่ายยาเรียบร้อย ตัดสต็อกออก ${qtyToDeduct} หน่วย`
    });
  } catch (error) {
    console.error('❌ Error during dispense:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.patch('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  const { min_stock } = req.body;

  if (min_stock === undefined || isNaN(min_stock)) {
    return res.status(400).json({ success: false, message: 'กรุณาระบุ min_stock เป็นตัวเลข' });
  }

  try {
    const [result] = await db.query(
      'UPDATE products SET min_stock = ? WHERE product_id = ? OR product_code = ?',
      [parseInt(min_stock), id, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `ไม่พบรายการยาสำหรับ ID/Code: ${id}` });
    }

    return res.status(200).json({ success: true, message: 'อัปเดตเกณฑ์เตือนสต็อกต่ำเรียบร้อย!' });
  } catch (error) {
    console.error('❌ Error updating min_stock:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/products/:id/lots', async (req, res) => {
  const { id } = req.params;
  try {
    const query = `
      SELECT 
        l.lot_id, l.lot_id AS id, l.product_id, l.lot_number, l.expiry_date,
        l.quantity, l.created_at, l.cost_price, l.selling_price,
        p.location, p.category, p.product_type
      FROM product_lots l
      JOIN products p ON l.product_id = p.product_id
      WHERE p.product_id = ? OR p.product_code = ?
      ORDER BY l.expiry_date ASC;
    `;
    const [rows] = await db.query(query, [id, id]);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ Error fetching product lots:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

app.patch('/api/lots/:lotId', async (req, res) => {
  const { lotId } = req.params;
  const { cost_price, selling_price } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE product_lots SET cost_price = ?, selling_price = ? WHERE lot_id = ?',
      [parseFloat(cost_price) || 0, parseFloat(selling_price) || 0, lotId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'ไม่พบรายการล็อตนี้' });
    }

    return res.status(200).json({ success: true, message: 'อัปเดตราคาประวัติล็อตเรียบร้อย!' });
  } catch (error) {
    console.error('❌ Error updating lot price:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 🤖 API CHATBOT ASSISTANT ENGINE (ตอบละเอียด + รองรับการกดปุ่มคำถามยอดฮิต)
app.post('/api/chat', async (req, res) => {
  const { message, userName, userRole } = req.body;
  if (!message) {
    return res.status(400).json({ success: false, reply: 'กรุณากรอกข้อความคำถาม' });
  }

  const q = message.toLowerCase().trim();

  try {
    // 1. ตรวจสอบยาสต็อกต่ำกว่าเกณฑ์
    if (q.includes('สต็อก') || q.includes('ต่ำ') || q.includes('เหลือน้อย') || q.includes('เติม')) {
      const [rows] = await db.query(`
        SELECT p.product_code, p.product_name, p.min_stock, p.unit, p.location, COALESCE(SUM(l.quantity), 0) AS total_qty
        FROM products p
        LEFT JOIN product_lots l ON p.product_id = l.product_id AND l.expiry_date >= CURDATE()
        GROUP BY p.product_id
        HAVING total_qty <= p.min_stock
      `);

      if (rows.length === 0) {
        return res.status(200).json({ success: true, reply: '✅ สต็อกยาในคลังสมบูรณ์ดีทุกรายการครับ ไม่มีรายการยาที่ต่ำกว่าเกณฑ์เตือน' });
      }

      let replyText = `⚠️ รายงานยาที่สต็อกต่ำกว่าเกณฑ์เตือน (รวมทั้งหมด ${rows.length} รายการ):\n\n`;
      rows.forEach((item, index) => {
        replyText += `${index + 1}. [${item.product_code}] ${item.product_name}\n   - สต็อกคงเหลือ: ${item.total_qty} ${item.unit} (เกณฑ์ต่ำสุด: ${item.min_stock} ${item.unit})\n   - ตำแหน่งจัดเก็บ: ${item.location || 'ตู้ทั่วไป'}\n\n`;
      });
      replyText += `💡 คำแนะนำ: แนะนำให้ทำรายการรับยาเข้าในเมนู "จัดการคลังยา" เพื่อสั่งซื้อเติมคลังครับ`;
      return res.status(200).json({ success: true, reply: replyText });
    }

    // 2. เช็คยาหมดอายุ / ใกล้หมดอายุ
    if (q.includes('หมดอายุ') || q.includes('exp') || q.includes('เสื่อม')) {
      const [expired] = await db.query(`
        SELECT p.product_code, p.product_name, l.lot_number, l.quantity, l.expiry_date, p.unit
        FROM product_lots l
        JOIN products p ON l.product_id = p.product_id
        WHERE l.expiry_date < CURDATE() AND l.quantity > 0
      `);

      const [expiring] = await db.query(`
        SELECT p.product_code, p.product_name, l.lot_number, l.quantity, l.expiry_date, p.unit,
               DATEDIFF(l.expiry_date, CURDATE()) AS days_left
        FROM product_lots l
        JOIN products p ON l.product_id = p.product_id
        WHERE l.expiry_date >= CURDATE() AND DATEDIFF(l.expiry_date, CURDATE()) <= 90 AND l.quantity > 0
        ORDER BY days_left ASC
      `);

      let replyText = `📊 รายงานสถานะวันหมดอายุของล็อตยาในคลัง:\n\n`;
      replyText += `❌ ล็อตหมดอายุแล้ว (${expired.length} ล็อต):\n`;
      if (expired.length > 0) {
        expired.slice(0, 5).forEach((item, idx) => {
          replyText += `${idx + 1}. [${item.product_code}] ${item.product_name}\n   - Lot: ${item.lot_number} (คงค้าง: ${item.quantity} ${item.unit})\n`;
        });
        if (expired.length > 5) replyText += `   ...และอีก ${expired.length - 5} ล็อต\n`;
      } else {
        replyText += `   - ไม่มียาล็อตที่หมดอายุแล้ว\n`;
      }

      replyText += `\n⚠️ ล็อตใกล้หมดอายุภายใน 90 วัน (${expiring.length} ล็อต):\n`;
      if (expiring.length > 0) {
        expiring.slice(0, 5).forEach((item, idx) => {
          replyText += `${idx + 1}. [${item.product_code}] ${item.product_name}\n   - Lot: ${item.lot_number} (เหลือ ${item.days_left} วัน | จำนวน: ${item.quantity} ${item.unit})\n`;
        });
        if (expiring.length > 5) replyText += `   ...และอีก ${expiring.length - 5} ล็อต\n`;
      } else {
        replyText += `   - ไม่มียาล็อตเสี่ยงหมดอายุใน 90 วัน\n`;
      }

      replyText += `\n💡 ระบบจะไม่อนุญาตให้กดเบิกยาล็อตที่หมดอายุแล้วหน้าร้านเพื่อความปลอดภัยของผู้ป่วยครับ`;
      return res.status(200).json({ success: true, reply: replyText });
    }

    // 3. วิธีลงทะเบียน LINE ID
    if (q.includes('line') || q.includes('ไลน์') || q.includes('แจ้งเตือน')) {
      return res.status(200).json({
        success: true,
        reply: `📱 ขั้นตอนการลงทะเบียนรับ LINE Notification อัตโนมัติ (ทุก 8 โมงเช้า):\n\n1. เพิ่มเพื่อน (Add Line) บัญชี LINE Official ของร้านยา\n2. พิมพ์ข้อความสั่งซื้อหรือลงทะเบียนว่า:\n   "ลงทะเบียน <Username ของคุณ>"\n   ตัวอย่างเช่น: ลงทะเบียน pharmacist1\n3. ระบบจะบันทึก LINE User ID เข้ากับชื่อบัญชีของคุณโดยอัตโนมัติ และตอบกลับข้อความยืนยัน\n4. จากนั้นคุณจะได้รับรายงานสรุปยาสต็อกต่ำและล็อตใกล้หมดอายุทาง LINE ทุกวันเวลา 08:00 น. ครับ`
      });
    }

    // 4. วิธีใช้งาน/หลัก FEFO
    if (q.includes('fefo') || q.includes('เบิกจ่าย')) {
      return res.status(200).json({
        success: true,
        reply: '💡 หลักการเบิกจ่ายยา FEFO (First Expired, First Out):\n\n1. ระบบจะเลือกล็อตยาที่หมดอายุเร็วที่สุดที่ยังไม่หมดอายุให้อัตโนมัติในหน้าเบิกจ่ายหน้าร้าน\n2. ล็อตยาที่หมดอายุแล้ว จะถูกบล็อก (Disabled) และแสดงสถานะเตือน เพื่อป้องกันไม่ให้จ่ายยาหมดอายุให้ผู้ป่วย\n3. เภสัชกรสามารถเลือกเปลี่ยนล็อตยาด้วยตนเองได้หากมีความจำเป็นทางคลินิก'
      });
    }

    if (q.includes('สิทธิ์') || q.includes('สมัคร') || q.includes('เพิ่มผู้ใช้') || q.includes('role')) {
      return res.status(200).json({
        success: true,
        reply: '🔒 สิทธิ์การใช้งานระบบ LALITA PHARMACY:\n\n• ผู้ดูแลระบบ (Admin): เข้าถึงได้ทุกหน้าจอ (Dashboard, จัดการคลังยา, กำหนดสิทธิ์ผู้ใช้งาน, แชทบอท)\n• เภสัชกรหน้าร้าน (Pharmacist): เข้าถึงเฉพาะหน้าเบิกจ่ายยาหน้าร้าน และแชทบอท\n\nการเพิ่มหรือแก้ไขสิทธิ์สามารถทำได้โดย Admin ที่เมนู "กำหนดสิทธิ์ผู้ใช้งาน" ครับ'
      });
    }

    // 5. ค้นหายาเฉพาะตัว
    const [matchedProducts] = await db.query(`
      SELECT p.product_code, p.product_name, p.unit, p.location, COALESCE(SUM(l.quantity), 0) AS total_qty
      FROM products p
      LEFT JOIN product_lots l ON p.product_id = l.product_id AND l.expiry_date >= CURDATE()
      WHERE p.product_name LIKE ? OR p.product_code LIKE ?
      GROUP BY p.product_id
    `, [`%${q}%`, `%${q}%`]);

    if (matchedProducts.length > 0) {
      const item = matchedProducts[0];
      return res.status(200).json({
        success: true,
        reply: `💊 ผลการค้นหาข้อมูลยา:\n\n• รหัสยา: ${item.product_code}\n• ชื่อรายการ: ${item.product_name}\n• ตำแหน่งจัดเก็บ: ${item.location || 'ตู้ทั่วไป'}\n• ยอดคงเหลือที่พร้อมเบิกจ่าย: ${item.total_qty} ${item.unit}`
      });
    }

    // Response ทั่วไป
    return res.status(200).json({
      success: true,
      reply: `สวัสดีครับคุณ ${userName || ''}! ผมคือ AI Assistant ประจำระบบร้านยา LALITA PHARMACY ครับ\n\nคุณสามารถกดเลือกปุ่ม "คำถามยอดฮิต" ด้านบน หรือพิมพ์คำถามที่ต้องการ เช่น "เช็คยาสต็อกต่ำ", "ล็อตใกล้หมดอายุ", "วิธีผูก LINE" ได้เลยครับ`
    });

  } catch (error) {
    console.error('❌ Chatbot Error:', error.message);
    return res.status(500).json({ success: false, reply: 'เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล Chatbot' });
  }
});

// 📩 LINE Webhook Endpoint (ถูกต้อง: ระบุเฉพาะ Path)
app.post('/api/line/webhook', async (req, res) => {
  try {
    const events = req.body.events || [];
    
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const lineUserId = event.source.userId;
        const text = event.message.text.trim();
        const replyToken = event.replyToken;

        console.log('📌 รับข้อความจาก LINE User ID:', lineUserId, '| ข้อความ:', text);

        // รูปแบบคำสั่ง: "ลงทะเบียน <username>" หรือ "register <username>"
        const regMatch = text.match(/^(?:ลงทะเบียน|register|reg)\s+(.+)$/i);

        if (regMatch) {
          const targetUsername = regMatch[1].trim();

          // ตรวจสอบและอัปเดต line_user_id ในตาราง users
          const [result] = await db.query(
            'UPDATE users SET line_user_id = ? WHERE username = ? OR user_id = ?',
            [lineUserId, targetUsername, targetUsername]
          );

          if (result.affectedRows > 0) {
            const [uInfo] = await db.query('SELECT name, role FROM users WHERE username = ? OR user_id = ?', [targetUsername, targetUsername]);
            const nameStr = uInfo.length > 0 ? uInfo[0].name : targetUsername;
            
            await replyLineMessage(
              replyToken, 
              `✅ บันทึก LINE User ID สำเร็จแล้วครับ!\n\n👤 บัญชีผู้ใช้: ${nameStr} (${targetUsername})\n🆔 LINE ID: ${lineUserId}\n\nระบบจะส่งการแจ้งเตือนเตือนยาสต็อกต่ำและล็อตใกล้หมดอายุให้คุณทุกวันเวลา 08:00 น. ครับ`
            );
          } else {
            await replyLineMessage(
              replyToken, 
              `❌ ไม่พบบัญชีผู้ใช้ "${targetUsername}" ในระบบ LALITA PHARMACY\nกรุณาตรวจสอบ Username ที่ถูกต้อง หรือติดต่อ Admin ครับ`
            );
          }
        } else {
          // ตอบกลับคำแนะนำถ้าพิมพ์ข้อความอื่นเข้ามา
          await replyLineMessage(
            replyToken,
            `📌 LINE User ID ของคุณคือ:\n${lineUserId}\n\n💡 พิมพ์ "ลงทะเบียน <Username>" เพื่อผูกบัญชีเข้ากับระบบแจ้งเตือนร้านยา LALITA PHARMACY ครับ`
          );
        }
      }
    }

    return res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Webhook Error:', error.message);
    return res.status(500).send('Internal Server Error');
  }
});





// 🧪 API สำหรับทดสอบยิงแจ้งเตือนเข้า LINE ทันที
app.get('/api/test-notify', async (req, res) => {
  try {
    await generateStockReportAndNotify();
    return res.status(200).json({ 
      success: true, 
      message: '🚀 ส่งการแจ้งเตือนคลังยาเข้า LINE เรียบร้อยแล้ว!' 
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});



const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});