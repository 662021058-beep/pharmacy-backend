import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, Search, ShieldAlert, Boxes, Tag, X, 
  History, Clock, Edit2, Save, Filter, MapPin, CheckCircle2, Warehouse, PackagePlus
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/api';

export default function Inventory({ products, setProducts, fetchProducts, productTypes, setProductTypes }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL');
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productLots, setProductLots] = useState([]);
  const [loadingLots, setLoadingLots] = useState(false);

  // Editing States
  const [editingLotId, setEditingLotId] = useState(null);
  const [editCostPrice, setEditCostPrice] = useState('');
  const [editSellingPrice, setEditSellingPrice] = useState('');
  const [editingMinStockId, setEditingMinStockId] = useState(null);
  const [tempMinStockMap, setTempMinStockMap] = useState({});

  // Autocomplete
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  // Dynamic Type Form State
  const [isCustomType, setIsCustomType] = useState(false);
  const [customTypeName, setCustomTypeName] = useState('');

  const [formData, setFormData] = useState({
    product_code: '', product_name: '', product_type: 'tablet', unit: 'เม็ด',
    category: 'ยาสามัญประจำบ้าน', cost_price: '', selling_price: '',
    location: 'ตู้ A1', lot_number: '', expiry_date: '', quantity: ''
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? String(dateStr) : d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleSelectProduct = async (product) => {
    setSelectedProduct(product);
    setLoadingLots(true);
    try {
      const res = await axios.get(`${API_URL}/products/${product.id || product.product_code}/lots`);
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      data.sort((a, b) => new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime());
      setProductLots(data);
    } catch (err) {
      setProductLots([]);
    } finally {
      setLoadingLots(false);
    }
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if ((name === 'product_code' || name === 'product_name') && value.trim()) {
      const matched = products.filter(p => 
        p.product_code?.toLowerCase().includes(value.toLowerCase()) ||
        p.product_name?.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(matched);
      setShowSuggestions(matched.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (item) => {
    setFormData(prev => ({
      ...prev,
      product_code: item.product_code || '',
      product_name: item.product_name || '',
      product_type: item.product_type || 'tablet',
      unit: item.unit || 'เม็ด',
      category: item.category || 'ยาสามัญประจำบ้าน',
      cost_price: item.cost_price || '',
      selling_price: item.selling_price || '',
      location: item.location || 'ตู้ A1'
    }));
    setIsCustomType(false);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalType = isCustomType ? customTypeName.trim() : formData.product_type;
    if (!finalType) return alert('กรุณาระบุประเภทยา');

    try {
      const res = await axios.post(`${API_URL}/products`, { ...formData, product_type: finalType });
      if (res.status < 300) {
        alert('✨ บันทึกการรับยาเรียบร้อย!');
        if (isCustomType && !productTypes.some(t => t.id === finalType)) {
          setProductTypes(prev => [...prev, { id: finalType, label: finalType }]);
        }
        setFormData({ product_code: '', product_name: '', product_type: 'tablet', unit: 'เม็ด', category: 'ยาสามัญประจำบ้าน', cost_price: '', selling_price: '', location: 'ตู้ A1', lot_number: '', expiry_date: '', quantity: '' });
        setIsCustomType(false); setCustomTypeName('');
        fetchProducts();
      }
    } catch (err) {
      alert('❌ เกิดข้อผิดพลาด');
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.product_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypeFilter === 'ALL' || p.product_type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '16px', height: '100%', minHeight: 0, padding: '16px 24px' }}>
      
      {/* LEFT FORM */}
      <div style={panelCardStyle} ref={dropdownRef}>
        <div style={panelHeader}><PackagePlus size={16} color="#0d9488" /><h3 style={panelTitle}>บันทึกรับยาเข้าสต็อก</h3></div>
        <form onSubmit={handleSubmit} style={{ padding: '14px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={formGroup}>
              <label style={labelStyle}>รหัสยา</label>
              <input type="text" name="product_code" value={formData.product_code} onChange={handleFormInputChange} required style={inputStyle} />
            </div>
            <div style={formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                <label style={labelStyle}>รูปแบบยา</label>
                <button type="button" onClick={() => setIsCustomType(!isCustomType)} style={linkBtn}>{isCustomType ? '← เลือกที่มี' : '+ เพิ่มประเภท'}</button>
              </div>
              {isCustomType ? (
                <input type="text" placeholder="ระบุประเภท" value={customTypeName} onChange={(e) => setCustomTypeName(e.target.value)} required style={inputStyle} />
              ) : (
                <select name="product_type" value={formData.product_type} onChange={handleFormInputChange} style={selectStyle}>
                  {productTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              )}
            </div>
          </div>

          {showSuggestions && (
            <div style={suggestionDropdown}>
              {suggestions.map(s => (
                <div key={s.id || s.product_code} onClick={() => handleSelectSuggestion(s)} style={suggestionItem}>
                  <span style={codeBadge}>{s.product_code}</span> <strong style={{ color: '#0f766e' }}>{s.product_name}</strong>
                </div>
              ))}
            </div>
          )}

          <div style={formGroup}>
            <label style={labelStyle}>ชื่อยา</label>
            <input type="text" name="product_name" value={formData.product_name} onChange={handleFormInputChange} required style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={formGroup}><label style={labelStyle}>ทุน (บาท)</label><input type="number" name="cost_price" value={formData.cost_price} onChange={handleFormInputChange} required style={inputStyle} /></div>
            <div style={formGroup}><label style={labelStyle}>ขาย (บาท)</label><input type="number" name="selling_price" value={formData.selling_price} onChange={handleFormInputChange} required style={inputStyle} /></div>
          </div>

          <div style={formGroup}><label style={labelStyle}>จุดเก็บ</label><input type="text" name="location" value={formData.location} onChange={handleFormInputChange} required style={inputStyle} /></div>
          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '8px 0' }} />
          <div style={formGroup}><label style={labelStyle}>เลขล็อต (Lot No.)</label><input type="text" name="lot_number" value={formData.lot_number} onChange={handleFormInputChange} required style={inputStyle} /></div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div style={formGroup}><label style={labelStyle}>วันหมดอายุ</label><input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleFormInputChange} required style={inputStyle} /></div>
            <div style={formGroup}><label style={labelStyle}>จำนวนรับเข้า</label><input type="number" name="quantity" value={formData.quantity} onChange={handleFormInputChange} required style={inputStyle} /></div>
          </div>

          <button type="submit" style={btnSubmit}><Plus size={16} /> บันทึกรับเข้าสต็อก</button>
        </form>
      </div>

      {/* RIGHT TABLE */}
      <div style={panelCardStyle}>
        <div style={{ ...panelHeader, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Warehouse size={16} color="#0d9488" />
            <h3 style={panelTitle}>ตารางสต็อกยา</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <select value={selectedTypeFilter} onChange={(e) => setSelectedTypeFilter(e.target.value)} style={{ ...selectStyle, width: '110px', height: '30px' }}>
              <option value="ALL">ทุกรูปแบบ</option>
              {productTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
            <input type="text" placeholder="ค้นหา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, width: '140px', height: '30px' }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                <th style={thStyle}>รหัส/ชื่อยา</th>
                <th style={thStyle}>รูปแบบ</th>
                <th style={thStyle}>ล็อต FEFO</th>
                <th style={thStyle}>ยอดคงเหลือ</th>
                <th style={thStyle}>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => {
                const totalQty = Number(p.total_quantity ?? p.quantity ?? 0);
                const isLow = totalQty <= Number(p.min_stock ?? 10);
                return (
                  <tr key={p.id || p.product_code} style={trStyle} onClick={() => handleSelectProduct(p)}>
                    <td style={tdStyle}><span style={codeBadge}>{p.product_code}</span> <strong style={{ color: '#0f766e' }}>{p.product_name}</strong></td>
                    <td style={tdStyle}>{p.product_type}</td>
                    <td style={tdStyle}><span style={lotBadge}>{p.fefo_lot || 'ไม่มีข้อมูล'}</span></td>
                    <td style={tdStyle}><strong style={{ color: isLow ? '#e11d48' : '#0f766e' }}>{totalQty.toLocaleString()} {p.unit}</strong></td>
                    <td style={tdStyle}>
                      <span style={{ backgroundColor: isLow ? '#ffe4e6' : '#d1fae5', color: isLow ? '#e11d48' : '#047857', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: '600' }}>
                        {isLow ? 'สต็อกต่ำ' : 'ปกติ'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// Minimal Styles
const panelCardStyle = { backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden' };
const panelHeader = { padding: '10px 16px', borderBottom: '1px solid #f1f5f9', backgroundColor: '#fafafa', display: 'flex', alignItems: 'center' };
const panelTitle = { margin: 0, fontSize: '13px', fontWeight: '600' };
const formGroup = { marginBottom: '8px' };
const labelStyle = { display: 'block', fontSize: '10px', fontWeight: '600', color: '#475569' };
const inputStyle = { width: '100%', height: '32px', padding: '0 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', outline: 'none', boxSizing: 'border-box' };
const selectStyle = { ...inputStyle };
const btnSubmit = { width: '100%', height: '34px', backgroundColor: '#0d9488', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' };
const linkBtn = { background: 'none', border: 'none', color: '#0d9488', fontSize: '10px', fontWeight: '600', cursor: 'pointer' };
const suggestionDropdown = { position: 'absolute', backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', zIndex: 10, width: '90%' };
const suggestionItem = { padding: '6px 10px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', fontSize: '11px' };
const thStyle = { padding: '8px 10px', fontSize: '11px', color: '#475569' };
const tdStyle = { padding: '8px 10px', borderBottom: '1px solid #f1f5f9' };
const trStyle = { cursor: 'pointer' };
const codeBadge = { backgroundColor: '#f1f5f9', color: '#475569', fontSize: '10px', padding: '1px 4px', borderRadius: '4px', fontFamily: 'monospace' };
const lotBadge = { backgroundColor: '#fef3c7', color: '#92400e', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' };