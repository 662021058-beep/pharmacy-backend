import React, { useState } from 'react';
import { Settings, Save, Plus, Trash2, ShieldAlert, Tag, Layers } from 'lucide-react';

export default function SettingsView({ productTypes, setProductTypes }) {
  const [defaultMinStock, setDefaultMinStock] = useState(10);
  const [fefoWarningDays, setFefoWarningDays] = useState(60);
  
  // State เพิ่มประเภทยาใหม่ในหน้าการตั้งค่า
  const [newTypeName, setNewTypeName] = useState('');
  
  // รายการหมวดหมู่ยา
  const [categories, setCategories] = useState([
    'ยาสามัญประจำบ้าน', 'ยาอันตราย', 'ยาใช้ภายนอก', 'เวชภัณฑ์'
  ]);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddProductType = (e) => {
    e.preventDefault();
    if (!newTypeName.trim()) return;
    const newId = newTypeName.toLowerCase().replace(/\s+/g, '_');
    if (productTypes.some(t => t.id === newId || t.label === newTypeName)) {
      alert('ประเภทยานี้มีอยู่ในระบบแล้ว');
      return;
    }
    setProductTypes([...productTypes, { id: newId, label: newTypeName.trim() }]);
    setNewTypeName('');
  };

  const handleDeleteType = (id) => {
    if (confirm('คุณต้องการลบประเภทยานี้ใช่หรือไม่?')) {
      setProductTypes(productTypes.filter(t => t.id !== id));
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      alert('มีหมวดหมู่นี้อยู่แล้ว');
      return;
    }
    setCategories([...categories, newCategoryName.trim()]);
    setNewCategoryName('');
  };

  const handleSaveGeneralSettings = (e) => {
    e.preventDefault();
    alert('✅ บันทึกการตั้งค่าระบบเรียบร้อยแล้ว!');
  };

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto', height: '100%' }}>
      
      {/* 1. GENERAL ALERT SETTINGS */}
      <div style={panelCard}>
        <div style={panelHeader}>
          <ShieldAlert size={16} color="#0d9488" />
          <h3 style={panelTitle}>ตั้งค่าเกณฑ์การแจ้งเตือนระบบ (Default Alert Thresholds)</h3>
        </div>
        <form onSubmit={handleSaveGeneralSettings} style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={labelStyle}>ค่าเริ่มต้นเตือนสต็อกต่ำ (Default Min Stock)</label>
            <input 
              type="number" 
              value={defaultMinStock} 
              onChange={(e) => setDefaultMinStock(e.target.value)}
              style={inputStyle} 
            />
            <p style={helpTextStyle}>* หากไม่ได้ระบุ min_stock รายรายการ ระบบจะใช้ค่านี้เป็นเกณฑ์เตือนสต็อกต่ำ</p>
          </div>

          <div>
            <label style={labelStyle}>จำนวนวันเตือนยาใกล้หมดอายุ FEFO (วัน)</label>
            <input 
              type="number" 
              value={fefoWarningDays} 
              onChange={(e) => setFefoWarningDays(e.target.value)}
              style={inputStyle} 
            />
            <p style={helpTextStyle}>* แจ้งเตือนเมื่อยาล็อตนั้นมีวันหมดอายุเหลือน้อยกว่าจำนวนวันที่ตั้งไว้</p>
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" style={btnSubmit}><Save size={14} /> บันทึกการตั้งค่า</button>
          </div>
        </form>
      </div>

      {/* 2. DYNAMIC PRODUCT TYPES MANAGEMENT */}
      <div style={panelCard}>
        <div style={panelHeader}>
          <Tag size={16} color="#0d9488" />
          <h3 style={panelTitle}>จัดการรูปแบบยา (Product Types Management)</h3>
        </div>
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <form onSubmit={handleAddProductType}>
            <label style={labelStyle}>เพิ่มประเภทยาใหม่</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <input 
                type="text" 
                placeholder="เช่น ยาพ่น, ยาหยอดตา" 
                value={newTypeName} 
                onChange={(e) => setNewTypeName(e.target.value)} 
                style={inputStyle} 
              />
              <button type="submit" style={{ ...btnSubmit, width: 'auto', padding: '0 16px' }}><Plus size={14} /> เพิ่ม</button>
            </div>
          </form>

          <div>
            <label style={labelStyle}>รายการประเภทยาปัจจุบัน</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {productTypes.map(type => (
                <span key={type.id} style={chipStyle}>
                  {type.label}
                  <button type="button" onClick={() => handleDeleteType(type.id)} style={btnDeleteChip}>
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. CATEGORY MANAGEMENT */}
      <div style={panelCard}>
        <div style={panelHeader}>
          <Layers size={16} color="#0d9488" />
          <h3 style={panelTitle}>จัดการหมวดหมู่ยา (Categories)</h3>
        </div>
        <div style={{ padding: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <form onSubmit={handleAddCategory}>
            <label style={labelStyle}>เพิ่มหมวดหมู่ใหม่</label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <input 
                type="text" 
                placeholder="เช่น ยานอนหลับ, ยาปฏิชีวนะ" 
                value={newCategoryName} 
                onChange={(e) => setNewCategoryName(e.target.value)} 
                style={inputStyle} 
              />
              <button type="submit" style={{ ...btnSubmit, width: 'auto', padding: '0 16px' }}><Plus size={14} /> เพิ่ม</button>
            </div>
          </form>

          <div>
            <label style={labelStyle}>รายการหมวดหมู่ปัจจุบัน</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {categories.map((cat, idx) => (
                <span key={idx} style={{ ...chipStyle, backgroundColor: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' }}>
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

// Styles
const panelCard = { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' };
const panelHeader = { padding: '12px 16px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center', gap: '8px' };
const panelTitle = { margin: 0, fontSize: '13px', fontWeight: '600', color: '#0f172a' };
const labelStyle = { display: 'block', fontSize: '11px', fontWeight: '600', color: '#475569', marginBottom: '2px' };
const inputStyle = { width: '100%', height: '34px', padding: '0 10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px', outline: 'none', boxSizing: 'border-box' };
const helpTextStyle = { margin: '4px 0 0 0', fontSize: '10px', color: '#94a3b8' };
const btnSubmit = { height: '34px', backgroundColor: '#0d9488', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };
const chipStyle = { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#f1f5f9', borderRadius: '20px', fontSize: '11px', fontWeight: '600', color: '#334155' };
const btnDeleteChip = { background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center', padding: 0 };