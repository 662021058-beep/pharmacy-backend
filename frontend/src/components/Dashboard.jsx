import React from 'react';
import { 
  RefreshCw, AlertCircle, Calendar, DollarSign, AlertTriangle, ChevronDown 
} from 'lucide-react';

export default function Dashboard({
  expiredItems = [
    { code: 'P009', name: 'Cough Syrup Guaifenesin', lot: 'LOT6911', exp: '10 ส.ค. 2569', qty: '5 ขวด', cost: '฿175.00' },
    { code: 'P001', name: 'Paracetamol 500mg', lot: 'LOT6901', exp: '15 ส.ค. 2569', qty: '20 กล่อง', cost: '฿2,000.00' },
    { code: 'P013', name: 'Vitamin C 1000mg', lot: 'LOT-EXP-01', exp: '18 ส.ค. 2569', qty: '50 กระปุก', cost: '฿9,000.00' },
    { code: 'P003', name: 'Amoxicillin Syrup 60ml', lot: 'LOT6904', exp: '20 ส.ค. 2569', qty: '10 ขวด', cost: '฿450.00' },
  ],
  nearExpiryItems = [
    { code: 'P018', name: 'Berocca Effervescent', lot: 'LOT-EXP-02', exp: '2 ก.ย. 2569', daysLeft: 'เหลือ 7 วัน', qty: '40 หลอด', cost: '฿6,400.00' },
    { code: 'P002', name: 'Amoxicillin 500mg', lot: 'LOT-EXP-03', exp: '17 ก.ย. 2569', daysLeft: 'เหลือ 22 วัน', qty: '100 กล่อง', cost: '฿12,000.00' },
  ],
  reorderItems = [
    { code: 'P017', name: 'Antacid Suspension 240ml', location: 'ตู้ B2', minQty: '≤ 20', currentQty: '15 ขวด' }
  ]
}) {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100%', 
      padding: '24px', 
      gap: '16px', 
      boxSizing: 'border-box',
      backgroundColor: '#f8fafc' 
    }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#0f172a' }}>แดชบอร์ดภาพรวมคลังยา</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>สรุปภาพรวมมูลค่า ยาหมดอายุ และสต็อกยา</p>
        </div>
        <button style={btnRefreshStyle}>
          <RefreshCw size={14} /> รีเฟรชข้อมูล
        </button>
      </div>

      {/* TOP 4 STAT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        
        {/* Card 1: หมดอายุ */}
        <div style={{ ...cardBaseStyle, borderLeft: '4px solid #ef4444', backgroundColor: '#fef2f2' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#991b1b', fontWeight: '600' }}>มูลค่ายาหมดอายุ (ทุนรวม/สูญเสีย)</span>
            <h2 style={{ margin: '4px 0 2px 0', fontSize: '18px', color: '#991b1b', fontWeight: '700' }}>฿11,625.00</h2>
            <span style={{ fontSize: '10px', color: '#b91c1c' }}>รวม 4 ล็อต (ต้องเคลียร์สต็อก)</span>
          </div>
          <div style={iconCircleStyle('#fee2e2', '#ef4444')}><AlertCircle size={18} /></div>
        </div>

        {/* Card 2: ใกล้หมดอายุ */}
        <div style={{ ...cardBaseStyle, borderLeft: '4px solid #f43f5e', backgroundColor: '#fff1f2' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#9f1239', fontWeight: '600' }}>ทุนยาสุ่มเสี่ยงใกล้หมดอายุ (&lt;90 วัน)</span>
            <h2 style={{ margin: '4px 0 2px 0', fontSize: '18px', color: '#9f1239', fontWeight: '700' }}>฿40,500.00</h2>
            <span style={{ fontSize: '10px', color: '#be123c' }}>รวม 7 ล็อตเสี่ยง</span>
          </div>
          <div style={iconCircleStyle('#ffe4e6', '#f43f5e')}><Calendar size={18} /></div>
        </div>

        {/* Card 3: คลังพร้อมขาย */}
        <div style={{ ...cardBaseStyle, borderLeft: '4px solid #0d9488', backgroundColor: '#f0fdf4' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#166534', fontWeight: '600' }}>มูลค่าทุนคลังยาที่พร้อมขาย</span>
            <h2 style={{ margin: '4px 0 2px 0', fontSize: '18px', color: '#15803d', fontWeight: '700' }}>฿89,425.00</h2>
            <span style={{ fontSize: '10px', color: '#166534' }}>รวมมูลค่าขาย: ฿145,250</span>
          </div>
          <div style={iconCircleStyle('#dcfce7', '#16a34a')}><DollarSign size={18} /></div>
        </div>

        {/* Card 4: ยาต้องสั่งเติม */}
        <div style={{ ...cardBaseStyle, borderLeft: '4px solid #f97316', backgroundColor: '#fff7ed' }}>
          <div>
            <span style={{ fontSize: '11px', color: '#9a3412', fontWeight: '600' }}>ยาต้องสั่งเติม (ต่ำกว่าเกณฑ์)</span>
            <h2 style={{ margin: '4px 0 2px 0', fontSize: '18px', color: '#c2410c', fontWeight: '700' }}>1 <span style={{ fontSize: '13px' }}>รายการ</span></h2>
            <span style={{ fontSize: '10px', color: '#9a3412' }}>เกณฑ์เดือนเฉลี่ย ≤ 10</span>
          </div>
          <div style={iconCircleStyle('#ffedd5', '#f97316')}><AlertTriangle size={18} /></div>
        </div>
      </div>

      {/* EXPIRED BANNER TABLE */}
      <div style={bannerContainerStyle}>
        <div style={bannerHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#991b1b', fontSize: '12px', fontWeight: '700' }}>
            <AlertCircle size={15} /> รายการล็อตที่หมดอายุแล้วในคลัง (ตัดออกจากคลัง / Write-off)
          </div>
          <span style={{ backgroundColor: '#ef4444', color: '#fff', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
            {expiredItems.length} รายการ
          </span>
        </div>
        <table style={tableStyle}>
          <thead>
            <tr style={thRowStyle}>
              <th style={thStyle}>รหัส / ชื่อยา</th>
              <th style={thStyle}>เลขล็อต</th>
              <th style={thStyle}>วันหมดอายุ (EXP)</th>
              <th style={thStyle}>จำนวนตกค้าง</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>ต้นทุนเสียเปล่า</th>
            </tr>
          </thead>
          <tbody>
            {expiredItems.map((item, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #fee2e2' }}>
                <td style={tdStyle}><strong>{item.code}</strong> - {item.name}</td>
                <td style={tdStyle}><span style={badgeLotRed}>{item.lot}</span></td>
                <td style={tdStyle}>{item.exp}</td>
                <td style={{ ...tdStyle, color: '#b91c1c', fontWeight: '700' }}>{item.qty}</td>
                <td style={{ ...tdStyle, textAlign: 'right', color: '#b91c1c', fontWeight: '700' }}>{item.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MIDDLE SECTION: 2 PANELS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        
        {/* Left: รูปแบบยา */}
        <div style={panelBoxStyle}>
          <div style={panelTitleStyle}>สัดส่วนรูปแบบยาในคลัง</div>
          <div style={{ padding: '12px 16px' }}>
            <ProgressRow label="supplies" count="1 รายการ" total="80" percent={4.7} barColor="#0d9488" badgeBg="#e0f2fe" badgeColor="#0369a1" />
            <ProgressRow label="cream" count="2 รายการ" total="75" percent={4.4} barColor="#0d9488" badgeBg="#f3e8ff" badgeColor="#6b21a8" />
            <ProgressRow label="ยาเม็ด" count="10 รายการ" total="955" percent={56.3} barColor="#0d9488" badgeBg="#dcfce7" badgeColor="#15803d" />
          </div>
        </div>

        {/* Right: ตำแหน่งจัดเก็บ */}
        <div style={panelBoxStyle}>
          <div style={panelTitleStyle}>ปริมาณยาจำแนกตามตำแหน่งจัดเก็บ</div>
          <div style={{ padding: '12px 16px' }}>
            <ProgressRow label="📍 ตู้ C1" count="2 รายการ" total="380 ชิ้น" percent={22.4} barColor="#0284c7" labelColor="#0369a1" />
            <ProgressRow label="📍 ตู้ C2" count="3 รายการ" total="115 ชิ้น" percent={6.8} barColor="#0284c7" labelColor="#0369a1" />
            <ProgressRow label="📍 ตู้ D1" count="2 รายการ" total="95 ชิ้น" percent={5.6} barColor="#0284c7" labelColor="#0369a1" />
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: 2 PANELS (FLEX: 1 ยืดดันเต็มความสูงที่เหลือ) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', flex: 1, minHeight: 0 }}>
        
        {/* ล็อตยาใกล้หมดอายุ */}
        <div style={panelBoxStyle}>
          <div style={{ ...panelTitleStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} color="#e11d48" /> ล็อตยาใกล้หมดอายุ (&lt; 90 วัน)</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#64748b' }}>
              ระยะเวลา: <button style={dropdownBtnStyle}>90 วัน <ChevronDown size={12} /></button>
            </div>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <table style={tableStyle}>
              <thead>
                <tr style={thRowStyle}>
                  <th style={thStyle}>รหัส / ชื่อยา</th>
                  <th style={thStyle}>เลขล็อต</th>
                  <th style={thStyle}>วันหมดอายุ (EXP)</th>
                  <th style={thStyle}>คงเหลือ</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>ต้นทุนเสี่ยง</th>
                </tr>
              </thead>
              <tbody>
                {nearExpiryItems.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: '#fffbeb' }}>
                    <td style={tdStyle}><strong>{item.code}</strong> - {item.name}</td>
                    <td style={tdStyle}><span style={badgeLotYellow}>{item.lot}</span></td>
                    <td style={tdStyle}>{item.exp} <br/><span style={{ fontSize: '10px', color: '#d97706', fontWeight: '700' }}>({item.daysLeft})</span></td>
                    <td style={{ ...tdStyle, fontWeight: '700' }}>{item.qty}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: '#b91c1c', fontWeight: '700' }}>{item.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* รายการที่ต้องสั่งซื้อเพิ่ม */}
        <div style={panelBoxStyle}>
          <div style={panelTitleStyle}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c2410c' }}><AlertTriangle size={14} /> รายการที่ต้องสั่งซื้อเพิ่ม</span>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            <table style={tableStyle}>
              <thead>
                <tr style={thRowStyle}>
                  <th style={thStyle}>ชื่อรายการยา</th>
                  <th style={thStyle}>จุดเก็บ</th>
                  <th style={thStyle}>เกณฑ์เดือน</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>คงเหลือ</th>
                </tr>
              </thead>
              <tbody>
                {reorderItems.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>
                      <strong style={{ color: '#0f766e' }}>{item.name}</strong><br/>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>{item.code}</span>
                    </td>
                    <td style={{ ...tdStyle, color: '#0284c7' }}>📍 {item.location}</td>
                    <td style={tdStyle}>{item.minQty}</td>
                    <td style={{ ...tdStyle, textAlign: 'right', color: '#b91c1c', fontWeight: '700' }}>{item.currentQty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}

// --- Sub Component สัดส่วน ---
function ProgressRow({ label, count, total, percent, barColor, badgeBg, badgeColor, labelColor }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
        <span style={{ fontWeight: '600', color: labelColor || '#334155' }}>
          {badgeBg ? <span style={{ backgroundColor: badgeBg, color: badgeColor, padding: '1px 6px', borderRadius: '4px', fontSize: '11px' }}>{label}</span> : label}
        </span>
        <span style={{ color: '#64748b', fontSize: '11px' }}>
          <strong style={{ color: '#0f172a' }}>{count}</strong> &nbsp;|&nbsp; {total} &nbsp;|&nbsp; <strong>{percent}%</strong>
        </span>
      </div>
      <div style={{ width: '100%', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${percent * 1.5}%`, height: '100%', backgroundColor: barColor, borderRadius: '3px' }}></div>
      </div>
    </div>
  );
}

// --- Styles ---
const btnRefreshStyle = { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#fff', border: '1px solid #cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', color: '#334155' };
const cardBaseStyle = { borderRadius: '10px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' };
const iconCircleStyle = (bg, col) => ({ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: bg, color: col, display: 'flex', alignItems: 'center', justifyContent: 'center' });
const bannerContainerStyle = { border: '1px solid #fca5a5', borderRadius: '8px', backgroundColor: '#fff', overflow: 'hidden' };
const bannerHeaderStyle = { backgroundColor: '#fef2f2', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #fca5a5' };
const panelBoxStyle = { backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const panelTitleStyle = { padding: '10px 14px', fontSize: '13px', fontWeight: '700', borderBottom: '1px solid #f1f5f9', backgroundColor: '#fafafa', color: '#1e293b' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: '12px' };
const thRowStyle = { backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' };
const thStyle = { padding: '8px 12px', textAlign: 'left', fontSize: '11px', color: '#64748b', fontWeight: '600' };
const tdStyle = { padding: '8px 12px', color: '#334155' };
const badgeLotRed = { backgroundColor: '#fee2e2', color: '#991b1b', padding: '1px 5px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', fontFamily: 'monospace' };
const badgeLotYellow = { backgroundColor: '#fef3c7', color: '#92400e', padding: '1px 5px', borderRadius: '4px', fontSize: '10px', fontWeight: '600', fontFamily: 'monospace' };
const dropdownBtnStyle = { border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '2px', cursor: 'pointer' };