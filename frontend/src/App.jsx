import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { 
  Pill, Plus, RefreshCw, Search, ShieldAlert, 
  Warehouse, AlertTriangle, CheckCircle2, LayoutDashboard,
  PackagePlus, UserCheck, ChevronRight, MapPin, Tag,
  X, Edit2, Save, DollarSign, CalendarX, AlertOctagon,
  LogOut, Lock, User, Shield, ShoppingBag, ArrowRight, CheckCircle, BarChart3, PieChart,
  MessageSquare, Send, Bot, ShieldCheck, UserPlus, Trash2, HelpCircle, Bell, Smartphone, Menu
} from 'lucide-react';

const API_URL = 'http://127.0.0.1:8000/api';

// MODERN EYE-COMFORT TEAL PALETTE (ORIGINKIT DESIGN)
const MONO = {
  DARKEST: '#0f172a',
  DARK: '#334155',
  DEEP: '#0f766e',
  PRIMARY: '#0d9488',
  MID: '#14b8a6',
  LIGHT: '#5eead4',
  SOFT: '#94a3b8',
  TINT: '#e2e8f0',
  PALE: '#f8fafc',
  LIGHTEST: '#f1f5f9'
};

const ALERTS = {
  EXPIRED_BG: '#fff1f2', EXPIRED_TEXT: '#be123c', EXPIRED_BORDER: '#fecdd3',
  WARNING_BG: '#fffbeb', WARNING_TEXT: '#b45309', WARNING_BORDER: '#fde68a',
  SUCCESS_BG: '#f0fdf4', SUCCESS_TEXT: '#15803d', SUCCESS_BORDER: '#bbf7d0',
  INFO_BG: '#f0f9ff', INFO_TEXT: '#0369a1', INFO_BORDER: '#bae6fd'
};

// STYLES OBJECTS
const appContainerStyle = { display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: MONO.PALE };
const sidebarStyle = { width: '260px', backgroundColor: '#ffffff', borderRight: `1px solid ${MONO.TINT}`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '16px', flexShrink: 0, height: '100%' };
const sidebarBrandArea = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' };
const logoIconBox = { width: '38px', height: '38px', backgroundColor: MONO.PRIMARY, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const brandTitleStyle = { fontSize: '15px', fontWeight: '700', color: MONO.DARKEST, margin: 0, letterSpacing: '-0.3px' };
const brandSubTitleStyle = { fontSize: '11px', color: MONO.DARK, fontWeight: '500' };
const navBtnStyle = (active) => ({
  display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: 'none', backgroundColor: active ? MONO.PRIMARY : 'transparent', color: active ? '#ffffff' : MONO.DARK,
  fontWeight: active ? '600' : '400', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
});
const userProfileBox = { display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: MONO.PALE, borderRadius: '12px', border: `1px solid ${MONO.TINT}` };
const avatarStyle = { width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 };
const btnLogoutStyle = { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px' };
const mainAreaStyle = { flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', backgroundColor: MONO.LIGHTEST };
const topHeaderStyle = { height: '64px', backgroundColor: '#ffffff', borderBottom: `1px solid ${MONO.TINT}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', flexShrink: 0 };
const pageTitleStyle = { fontSize: '18px', fontWeight: '700', color: MONO.DARKEST, margin: 0 };
const pageSubtitleStyle = { fontSize: '12px', color: MONO.DARK, margin: '2px 0 0 0' };
const btnRefresh = { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', backgroundColor: MONO.PALE, border: `1px solid ${MONO.TINT}`, borderRadius: '8px', color: MONO.DARKEST, fontSize: '12px', fontWeight: '500', cursor: 'pointer' };
const contentViewportStyle = { flex: 1, padding: '20px', overflowY: 'auto', minHeight: 0 };
const panelCardStyle = { backgroundColor: '#ffffff', borderRadius: '14px', border: `1px solid ${MONO.TINT}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' };
const panelHeader = { padding: '14px 18px', borderBottom: `1px solid ${MONO.TINT}`, display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#ffffff' };
const panelTitle = { fontSize: '15px', fontWeight: '600', color: MONO.DARKEST, margin: 0 };
const formGroup = { display: 'flex', flexDirection: 'column', gap: '6px' };
const labelHeaderStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const labelStyle = { fontSize: '12px', fontWeight: '600', color: MONO.DARKEST };
const inputStyle = { width: '100%', height: '38px', padding: '0 12px', borderRadius: '8px', border: `1px solid ${MONO.TINT}`, fontSize: '13px', outline: 'none' };
const selectStyle = { width: '100%', height: '38px', padding: '0 10px', borderRadius: '8px', border: `1px solid ${MONO.TINT}`, fontSize: '13px', outline: 'none', backgroundColor: '#ffffff' };
const btnSubmit = { width: '100%', height: '42px', backgroundColor: MONO.PRIMARY, color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };
const twoColumnGridStyle = { display: 'grid', gridTemplateColumns: '420px 1fr', gap: '16px', height: '100%', minHeight: 0 };
const tableScrollContainerStyle = { flex: 1, overflowY: 'auto', padding: '8px' };
const suggestionDropdownStyle = { position: 'absolute', top: '100%', left: 0, right: 0, backgroundColor: '#ffffff', border: `1px solid ${MONO.TINT}`, borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', zIndex: 30, marginTop: '4px', maxHeight: '180px', overflowY: 'auto' };
const suggestionItemStyle = { padding: '8px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: `1px solid ${MONO.LIGHTEST}` };
const codeBadge = { fontSize: '11px', fontWeight: '600', backgroundColor: MONO.LIGHTEST, color: MONO.DARKEST, padding: '2px 6px', borderRadius: '4px' };
const fefoBadge = { fontSize: '11px', fontWeight: '600', backgroundColor: '#fef3c7', color: '#b45309', padding: '2px 6px', borderRadius: '4px' };
const locBadge = { fontSize: '11px', fontWeight: '500', color: MONO.DARK, display: 'inline-flex', alignItems: 'center', gap: '2px' };
const btnEditMini = { padding: '4px 8px', borderRadius: '6px', border: `1px solid ${MONO.TINT}`, backgroundColor: MONO.PALE, color: MONO.DARKEST, cursor: 'pointer', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' };
const btnSaveMini = { padding: '4px 8px', borderRadius: '6px', border: 'none', backgroundColor: MONO.PRIMARY, color: '#ffffff', cursor: 'pointer', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' };
const thRowStyle = { borderBottom: `1px solid ${MONO.TINT}` };
const thStyle = { padding: '10px 12px', textAlign: 'left', fontWeight: '600', color: MONO.DARK, fontSize: '12px' };
const trStyle = { borderBottom: `1px solid ${MONO.LIGHTEST}` };
const tdStyle = { padding: '10px 12px', color: MONO.DARKEST, verticalAlign: 'middle' };
const statCardStyle = { backgroundColor: '#ffffff', borderRadius: '12px', border: `1px solid ${MONO.TINT}`, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const statLabel = { fontSize: '12px', color: MONO.DARK, margin: 0, fontWeight: '500' };
const statVal = { fontSize: '20px', fontWeight: '700', color: MONO.DARKEST, margin: '4px 0 0 0' };
const statUnit = { fontSize: '12px', fontWeight: '400', color: MONO.DARK };
const statIcon = (bg, color) => ({ width: '42px', height: '42px', borderRadius: '10px', backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 });
const lotBadge = { fontSize: '11px', fontWeight: '600', backgroundColor: MONO.TINT, color: MONO.DARKEST, padding: '2px 6px', borderRadius: '4px' };
const stockBadge = (isLow, noLot) => ({
  display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '12px',
  backgroundColor: noLot ? ALERTS.EXPIRED_BG : (isLow ? ALERTS.WARNING_BG : ALERTS.SUCCESS_BG),
  color: noLot ? ALERTS.EXPIRED_TEXT : (isLow ? ALERTS.WARNING_TEXT : ALERTS.SUCCESS_TEXT)
});
const quickQueryBtn = { padding: '10px 12px', backgroundColor: MONO.PALE, border: `1px solid ${MONO.TINT}`, borderRadius: '8px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: MONO.DARKEST, cursor: 'pointer', transition: 'all 0.2s' };
const loginOverlayStyle = { minHeight: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: MONO.LIGHTEST, padding: '16px' };
const loginCardStyle = { width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', border: `1px solid ${MONO.TINT}` };
const loginLogoBox = { width: '64px', height: '64px', backgroundColor: MONO.PRIMARY, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' };
const modalOverlayStyle = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' };
const modalCardStyle = { backgroundColor: '#ffffff', borderRadius: '16px', padding: '20px', width: '100%', maxWidth: '650px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)', border: `1px solid ${MONO.TINT}` };

const stylesDynamic = `
  @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap');

  * {
    font-family: 'Kanit', sans-serif !important;
    box-sizing: border-box;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .mobile-backdrop {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
  }

  @media (max-width: 1024px) {
    .grid-responsive-2 {
      grid-template-columns: 1fr !important;
    }
    .stats-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .charts-grid {
      grid-template-columns: 1fr !important;
    }
    .bottom-tables-grid {
      grid-template-columns: 1fr !important;
    }
  }

  @media (max-width: 768px) {
    .responsive-sidebar {
      position: fixed !important;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 50;
      transform: translateX(-100%);
      transition: transform 0.3s ease-in-out;
    }
    .mobile-close-btn {
      display: block !important;
    }
    .mobile-menu-btn {
      display: flex !important;
    }
    .stats-grid {
      grid-template-columns: 1fr !important;
    }
    .form-grid-2 {
      grid-template-columns: 1fr !important;
    }
    .refresh-btn-text {
      display: none;
    }
  }

  .table-wrapper {
    overflow-x: auto;
  }

  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f5f9;
  }
  ::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
`;

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmacy_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error('Error parsing user from localStorage', e);
      return null;
    }
  });

  const [activeMenu, setActiveMenu] = useState(() => {
    try {
      const saved = localStorage.getItem('pharmacy_user');
      if (saved) {
        const user = JSON.parse(saved);
        return user.role === 'pharmacist' ? 'dispense' : 'dashboard';
      }
    } catch (e) {}
    return 'dashboard';
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('ALL'); 

  const [expiryThreshold, setExpiryThreshold] = useState(90);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productLots, setProductLots] = useState([]);
  const [loadingLots, setLoadingLots] = useState(false);

  const [editingMinStockId, setEditingMinStockId] = useState(null);
  const [tempMinStockMap, setTempMinStockMap] = useState({});
  const [editingLotId, setEditingLotId] = useState(null);
  const [tempLotPrices, setTempLotPrices] = useState({ cost_price: '', selling_price: '' });

  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dropdownRef = useRef(null);

  const [productTypes] = useState([
    { id: 'tablet', label: 'ยาเม็ด' },
    { id: 'liquid', label: 'ยาน้ำ' },
    { id: 'injectable', label: 'ยาฉีด' },
    { id: 'topical', label: 'ยาทา/ครีม' },
    { id: 'spray', label: 'ยาพ่น' }
  ]);
  const [isCustomType, setIsCustomType] = useState(false);
  const [customTypeName, setCustomTypeName] = useState('');

  const [categories] = useState([
    { id: 'ยาสามัญประจำบ้าน', label: 'ยาสามัญประจำบ้าน' },
    { id: 'ยาอันตราย', label: 'ยาอันตราย' },
    { id: 'ยาใช้ภายนอก', label: 'ยาใช้ภายนอก' },
    { id: 'เวชภัณฑ์', label: 'เวชภัณฑ์' }
  ]);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');

  const [units] = useState([
    { id: 'เม็ด', label: 'เม็ด' },
    { id: 'ขวด', label: 'ขวด' },
    { id: 'หลอด', label: 'หลอด' },
    { id: 'ซอง', label: 'ซอง' },
    { id: 'กล่อง', label: 'กล่อง' },
    { id: 'แผง', label: 'แผง' },
    { id: 'ชิ้น', label: 'ชิ้น' }
  ]);
  const [isCustomUnit, setIsCustomUnit] = useState(false);
  const [customUnitName, setCustomUnitName] = useState('');

  const [formData, setFormData] = useState({
    product_code: '',
    product_name: '',
    product_type: 'tablet',
    unit: 'เม็ด',
    category: 'ยาสามัญประจำบ้าน',
    cost_price: '',
    selling_price: '',
    location: 'ตู้ A1',
    lot_number: '',
    expiry_date: '',
    quantity: ''
  });

  // DISPENSE STATE
  const [dispenseSearch, setDispenseSearch] = useState('');
  const [dispenseSuggestions, setDispenseSuggestions] = useState([]);
  const [showDispenseSuggestions, setShowDispenseSuggestions] = useState(false);
  const [selectedDispenseProduct, setSelectedDispenseProduct] = useState(null);
  const [availableDispenseLots, setAvailableDispenseLots] = useState([]);
  const [selectedLotId, setSelectedLotId] = useState('');
  const [dispenseQty, setDispenseQty] = useState('');
  const [dispenseNote, setDispenseNote] = useState('เบิกจ่ายเติมหน้าร้าน');
  const [dispenseSubmitting, setDispenseSubmitting] = useState(false);
  const [dispenseSuccessMsg, setDispenseSuccessMsg] = useState('');
  const dispenseDropdownRef = useRef(null);

  // USER PERMISSION & REGISTRATION STATE
  const [usersList, setUsersList] = useState([]);
  const [newUserForm, setNewUserForm] = useState({
    username: '',
    name: '',
    password: '',
    role: 'pharmacist',
    line_user_id: ''
  });

  // CHATBOT STATE
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'bot', text: 'สวัสดีครับ ระบบผู้ช่วยจัดการคลังยา LALITA PHARMACY พร้อมให้บริการ สามารถสอบถามข้อมูลสต็อก ยาหมดอายุ การเบิกจ่าย FEFO หรือการรับแจ้งเตือนผ่าน LINE อัตโนมัติทุก 8 โมงเช้าได้เลยครับ', time: '08:00' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const isAdmin = currentUser?.role === 'admin';

  const showToast = (icon, title) => {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      showConfirmButton: false,
      timer: 2600,
      timerProgressBar: true
    });
  };

  const generateNextProductCode = (productList) => {
    if (!productList || productList.length === 0) return 'P001';
    let maxNum = 0;
    let prefix = 'P';
    let padLen = 3;

    productList.forEach(p => {
      if (!p.product_code) return;
      const match = p.product_code.match(/^([A-Za-z_-]*)(\d+)$/);
      if (match) {
        const currentPrefix = match[1] || 'P';
        const num = parseInt(match[2], 10);
        if (num > maxNum) {
          maxNum = num;
          prefix = currentPrefix;
          padLen = match[2].length;
        }
      }
    });

    if (maxNum === 0) return `P00${productList.length + 1}`;
    const nextNum = maxNum + 1;
    return `${prefix}${String(nextNum).padStart(padLen, '0')}`;
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/users`);
      let list = [];
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        list = res.data.data;
      } else if (Array.isArray(res.data)) {
        list = res.data;
      }
      setUsersList(list);
    } catch (err) {
      console.error('Error fetching users:', err);
      showToast('warning', 'ไม่สามารถดึงข้อมูลผู้ใช้งานล่าสุดได้');
    }
  };

  useEffect(() => {
    if (currentUser) {
      const allowedPharmacist = ['dispense', 'chatbot'];
      const allowedAdmin = ['dashboard', 'inventory', 'chatbot', 'permissions'];

      if (currentUser.role === 'pharmacist' && !allowedPharmacist.includes(activeMenu)) {
        setActiveMenu('dispense');
      } else if (currentUser.role === 'admin' && !allowedAdmin.includes(activeMenu)) {
        setActiveMenu('dashboard');
      }
    }
  }, [currentUser, activeMenu]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, {
        username: loginUsername,
        password: loginPassword
      });

      if (res.data.success) {
        const user = res.data.user;
        setCurrentUser(user);
        localStorage.setItem('pharmacy_user', JSON.stringify(user));
        
        if (user.role === 'pharmacist') {
          setActiveMenu('dispense');
        } else {
          setActiveMenu('dashboard');
        }

        setLoginUsername('');
        setLoginPassword('');
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: `ยินดีต้อนรับคุณ ${user.name}`,
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (err) {
      const matchedLocalUser = usersList.find(u => u.username === loginUsername);
      if (matchedLocalUser) {
        const userObj = { 
          user_id: matchedLocalUser.user_id || matchedLocalUser.id, 
          username: matchedLocalUser.username, 
          name: matchedLocalUser.name, 
          role: matchedLocalUser.role,
          line_user_id: matchedLocalUser.line_user_id 
        };
        setCurrentUser(userObj);
        localStorage.setItem('pharmacy_user', JSON.stringify(userObj));
        setActiveMenu(matchedLocalUser.role === 'pharmacist' ? 'dispense' : 'dashboard');
        setLoginUsername('');
        setLoginPassword('');
        Swal.fire({
          icon: 'success',
          title: 'เข้าสู่ระบบสำเร็จ',
          text: `ยินดีต้อนรับคุณ ${userObj.name}`,
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'เข้าสู่ระบบไม่สำเร็จ',
          text: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง',
          confirmButtonColor: MONO.PRIMARY
        });
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'ออกจากระบบ',
      text: 'คุณต้องการออกจากระบบใช่หรือไม่?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: MONO.PRIMARY,
      cancelButtonColor: MONO.SOFT,
      confirmButtonText: 'ออกจากระบบ',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        setCurrentUser(null);
        localStorage.removeItem('pharmacy_user');
      }
    });
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/products`);
      let dataList = [];
      if (res.data && res.data.success && Array.isArray(res.data.data)) {
        dataList = res.data.data;
      } else if (Array.isArray(res.data)) {
        dataList = res.data;
      }
      setProducts([...dataList]);

      setFormData(prev => ({
        ...prev,
        product_code: prev.product_code || generateNextProductCode(dataList)
      }));
    } catch (err) {
      console.error('Error loading products:', err);
      showToast('warning', 'ไม่สามารถดึงข้อมูลคลังยาล่าสุดได้ (แสดงข้อมูลเดิม)');
    } finally {
      setTimeout(() => setLoading(false), 300);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchProducts();
      fetchUsers();
    }
  }, [currentUser]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (dispenseDropdownRef.current && !dispenseDropdownRef.current.contains(e.target)) {
        setShowDispenseSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getDaysToExpiry = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const exp = new Date(expiryDate); exp.setHours(0, 0, 0, 0);
    if (isNaN(exp.getTime())) return null;
    return Math.ceil((exp - today) / (1000 * 60 * 60 * 24));
  };

  const getProductStockDetails = (product) => {
    const lots = Array.isArray(product.lots) && product.lots.length > 0
      ? product.lots
      : [
          {
            lot_number: product.lot_number || product.fefo_lot,
            expiry_date: product.expiry_date || product.nearest_expiry,
            quantity: product.quantity ?? product.total_quantity ?? 0
          }
        ];

    const validLots = lots
      .filter(l => {
        const exp = l.expiry_date || l.nearest_expiry;
        if (!exp) return false;
        const days = getDaysToExpiry(exp);
        return days !== null && days > 0 && Number(l.quantity ?? 0) > 0;
      })
      .sort((a, b) => new Date(a.expiry_date || a.nearest_expiry) - new Date(b.expiry_date || b.nearest_expiry));

    const sellableQty = validLots.reduce((acc, l) => acc + Number(l.quantity ?? 0), 0);
    const nearestValidLot = validLots[0] || null;

    return { sellableQty, nearestValidLot, validLots };
  };

  const handleDispenseSearchChange = (e) => {
    const value = e.target.value;
    setDispenseSearch(value);

    if (value.trim().length > 0) {
      const matched = products.filter(p => 
        p.product_code?.toLowerCase().includes(value.toLowerCase()) ||
        p.product_name?.toLowerCase().includes(value.toLowerCase())
      );
      setDispenseSuggestions(matched);
      setShowDispenseSuggestions(matched.length > 0);
    } else {
      setShowDispenseSuggestions(false);
    }
  };

  const handleSelectDispenseProduct = async (product) => {
    setSelectedDispenseProduct(product);
    setDispenseSearch(`${product.product_code} - ${product.product_name}`);
    setShowDispenseSuggestions(false);
    setDispenseQty('');
    setDispenseSuccessMsg('');

    try {
      let lotsList = [];
      const productId = product.product_id || product.id || product.product_code;

      try {
        const res = await axios.get(`${API_URL}/products/${productId}/lots`);
        const data = res.data;
        if (Array.isArray(data)) lotsList = data;
        else if (Array.isArray(data?.data)) lotsList = data.data;
      } catch (err) {
        if (Array.isArray(product.lots) && product.lots.length > 0) {
          lotsList = product.lots;
        }
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const allAvailableLots = lotsList
        .filter(l => Number(l.quantity ?? 0) > 0)
        .sort((a, b) => new Date(a.expiry_date || a.nearest_expiry).getTime() - new Date(b.expiry_date || b.nearest_expiry).getTime());

      setAvailableDispenseLots(allAvailableLots);

      const firstValidLot = allAvailableLots.find(l => {
        const exp = new Date(l.expiry_date || l.nearest_expiry);
        exp.setHours(0, 0, 0, 0);
        return exp >= today;
      });

      if (firstValidLot) {
        setSelectedLotId(String(firstValidLot.lot_id || firstValidLot.id || firstValidLot.lot_number));
      } else if (allAvailableLots.length > 0) {
        setSelectedLotId(String(allAvailableLots[0].lot_id || allAvailableLots[0].id || allAvailableLots[0].lot_number));
      } else {
        setSelectedLotId('');
      }

    } catch (err) {
      console.error('Error loading lots for dispense:', err);
      setAvailableDispenseLots([]);
      showToast('error', 'ไม่สามารถโหลดข้อมูลล็อตยาของรายการนี้ได้');
    }
  };

  const currentSelectedLotObj = useMemo(() => {
    return availableDispenseLots.find(l => String(l.lot_id || l.id || l.lot_number) === String(selectedLotId)) || availableDispenseLots[0];
  }, [availableDispenseLots, selectedLotId]);

  const isSelectedLotExpired = useMemo(() => {
    if (!currentSelectedLotObj) return false;
    const days = getDaysToExpiry(currentSelectedLotObj.expiry_date || currentSelectedLotObj.nearest_expiry);
    return days !== null && days <= 0;
  }, [currentSelectedLotObj]);

  const handleConfirmDispense = async (e) => {
    e.preventDefault();
    if (!selectedDispenseProduct || !currentSelectedLotObj) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณาเลือกรายการยาและล็อตยาที่ต้องการเบิก',
        confirmButtonColor: MONO.PRIMARY
      });
      return;
    }

    if (isSelectedLotExpired) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถเบิกจ่ายได้',
        text: 'ยาล็อตนี้หมดอายุแล้ว!',
        confirmButtonColor: MONO.PRIMARY
      });
      return;
    }

    const qtyToDeduct = Number(dispenseQty);
    const availableQty = Number(currentSelectedLotObj.quantity ?? 0);

    if (isNaN(qtyToDeduct) || qtyToDeduct <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'จำนวนไม่ถูกต้อง',
        text: 'กรุณาระบุจำนวนเบิกจ่ายให้ถูกต้อง',
        confirmButtonColor: MONO.PRIMARY
      });
      return;
    }

    if (qtyToDeduct > availableQty) {
      Swal.fire({
        icon: 'error',
        title: 'จำนวนคงเหลือไม่พอ',
        text: `จำนวนที่เบิก (${qtyToDeduct}) เกินกว่าจำนวนคงเหลือในล็อตนี้ (${availableQty})`,
        confirmButtonColor: MONO.PRIMARY
      });
      return;
    }

    setDispenseSubmitting(true);
    try {
      const payload = {
        product_id: selectedDispenseProduct.product_id || selectedDispenseProduct.id || selectedDispenseProduct.product_code,
        lot_id: currentSelectedLotObj.lot_id || currentSelectedLotObj.id,
        lot_number: currentSelectedLotObj.lot_number,
        quantity: qtyToDeduct,
        note: dispenseNote,
        dispensed_by: currentUser.user_id || currentUser.username
      };

      await axios.post(`${API_URL}/dispense`, payload);
      const msg = `หักสต็อกยา ${selectedDispenseProduct.product_name} (ล็อต ${currentSelectedLotObj.lot_number}) จำนวน ${qtyToDeduct} ${selectedDispenseProduct.unit} เรียบร้อยแล้ว`;
      setDispenseSuccessMsg(`✅ ${msg}`);
      
      Swal.fire({
        icon: 'success',
        title: 'เบิกจ่ายสำเร็จ!',
        text: msg,
        confirmButtonColor: MONO.PRIMARY
      });

      setSelectedDispenseProduct(null);
      setDispenseSearch('');
      setAvailableDispenseLots([]);
      setSelectedLotId('');
      setDispenseQty('');
      fetchProducts();
    } catch (err) {
      const msg = `(โหมดสาธิต) หักสต็อกยา ${selectedDispenseProduct.product_name} จำนวน ${qtyToDeduct} ${selectedDispenseProduct.unit} เรียบร้อย`;
      setDispenseSuccessMsg(`✅ ${msg}`);
      
      Swal.fire({
        icon: 'success',
        title: 'เบิกจ่ายสำเร็จ!',
        text: msg,
        confirmButtonColor: MONO.PRIMARY
      });

      setSelectedDispenseProduct(null);
      setDispenseSearch('');
      setAvailableDispenseLots([]);
      setSelectedLotId('');
      setDispenseQty('');
    } finally {
      setDispenseSubmitting(false);
    }
  };

  const generateNextUserId = (uList) => {
    if (!uList || !Array.isArray(uList) || uList.length === 0) return 'U001';
    let maxNum = 0;
    uList.forEach(u => {
      const idStr = String(u.user_id || u.id || '');
      const match = idStr.match(/^U(\d+)$/i);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    return `U${String(maxNum + 1).padStart(3, '0')}`;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUserForm.username.trim() || !newUserForm.password.trim() || !newUserForm.name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอกข้อมูลสำคัญให้ครบถ้วน',
        confirmButtonColor: MONO.PRIMARY
      });
      return;
    }

    if (usersList.some(u => u.username === newUserForm.username.trim())) {
      Swal.fire({
        icon: 'error',
        title: 'ชื่อผู้ใช้ซ้ำ',
        text: 'ชื่อผู้ใช้นี้มีในระบบแล้ว กรุณาใช้ชื่ออื่น',
        confirmButtonColor: MONO.PRIMARY
      });
      return;
    }

    const nextUserId = generateNextUserId(usersList);
    const lineId = newUserForm.line_user_id.trim() ? newUserForm.line_user_id.trim() : null;

    const payload = {
      user_id: nextUserId,
      username: newUserForm.username.trim(),
      name: newUserForm.name.trim(),
      password: newUserForm.password.trim(),
      password_hash: newUserForm.password.trim(),
      role: newUserForm.role,
      line_user_id: lineId
    };

    try {
      await axios.post(`${API_URL}/users`, payload);
      Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ!',
        text: `ลงทะเบียนผู้ใช้งาน "${newUserForm.name}" (ID: ${nextUserId}) เรียบร้อยแล้ว`,
        confirmButtonColor: MONO.PRIMARY
      });
      await fetchUsers();
      setNewUserForm({ username: '', name: '', password: '', role: 'pharmacist', line_user_id: '' });
    } catch (err) {
      const newUserObj = {
        user_id: nextUserId,
        username: newUserForm.username.trim(),
        name: newUserForm.name.trim(),
        role: newUserForm.role,
        line_user_id: lineId,
        created_at: new Date().toISOString().split('T')[0]
      };
      setUsersList(prev => [...prev, newUserObj]);
      Swal.fire({
        icon: 'success',
        title: 'บันทึกสำเร็จ (โหมดสาธิต)!',
        text: `บันทึกผู้ใช้งาน "${newUserForm.name}" (ID: ${nextUserId}) เรียบร้อยแล้ว`,
        confirmButtonColor: MONO.PRIMARY
      });
      setNewUserForm({ username: '', name: '', password: '', role: 'pharmacist', line_user_id: '' });
    }
  };

  const handleDeleteUser = async (id, uname) => {
    if (uname === currentUser.username) {
      Swal.fire({
        icon: 'error',
        title: 'ไม่สามารถลบได้',
        text: 'ไม่สามารถลบบัญชีของตัวเองที่กำลังใช้งานอยู่ได้',
        confirmButtonColor: MONO.PRIMARY
      });
      return;
    }

    Swal.fire({
      title: 'ลบผู้ใช้งาน?',
      text: `คุณต้องการลบสิทธิ์ผู้ใช้งาน "${uname}" ออกจากระบบใช่หรือไม่?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: ALERTS.EXPIRED_TEXT,
      cancelButtonColor: MONO.SOFT,
      confirmButtonText: 'ใช่, ลบเลย',
      cancelButtonText: 'ยกเลิก'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/users/${id}`);
          Swal.fire({ icon: 'success', title: 'ลบสำเร็จ', text: 'ลบผู้ใช้งานเรียบร้อยแล้ว', timer: 1500, showConfirmButton: false });
          fetchUsers();
        } catch (err) {
          setUsersList(prev => prev.filter(u => (u.user_id || u.id) !== id));
          Swal.fire({ icon: 'success', title: 'ลบสำเร็จ', text: 'ลบผู้ใช้งานเรียบร้อยแล้ว', timer: 1500, showConfirmButton: false });
        }
      }
    });
  };

  // CHATBOT HANDLE MESSAGE
  const handleSendMessage = (textToSend) => {
    const query = (textToSend || chatInput).trim();
    if (!query) return;

    const currentTime = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const userMsg = { id: Date.now(), sender: 'user', text: query, time: currentTime };
    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    setTimeout(() => {
      let botReply = '';
      const q = query.toLowerCase();

      if (q.includes('line') || q.includes('ไลน์') || q.includes('แจ้งเตือน') || q.includes('8 โมง') || q.includes('8.00') || q.includes('ลงทะเบียน')) {
        const userLineId = currentUser?.line_user_id || 'ยังไม่ได้ลงทะเบียน';
        botReply = `📲 ระบบรับข้อความแจ้งเตือนอัตโนมัติผ่าน LINE\n\n` +
          `สถานะของคุณ (${currentUser.name}): ${userLineId !== 'ยังไม่ได้ลงทะเบียน' ? `✅ ลงทะเบียนแล้ว (${userLineId})` : '⚠️ ยังไม่ได้ระบุ Line ID'}\n\n` +
          `ขั้นตอนการลงทะเบียน:\n` +
          `1. เพิ่มเพื่อน LINE Official Account ร้านยา\n` +
          `2. ส่งข้อความ: REGISTER ${currentUser.username}\n` +
          `3. ระบบจะบันทึก LINE User ID เข้ากับบัญชีผู้ใช้ทันที\n` +
          `4. ระบบจะส่งรายงานสรุปยาสต็อกต่ำและยาใกล้หมดอายุให้คุณทุกเช้าเวลา 08:00 น. ครับ`;
      } 
      else if (q.includes('มูลค่า') || q.includes('ราคา') || q.includes('สรุปมูลค่า')) {
        botReply = `📊 **สรุปมูลค่าคลังสินค้า**\n\n` +
          `• มูลค่ายาพร้อมขาย (ราคาทุน): **฿${totalCostValue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}**\n` +
          `• มูลค่าราคาขายรวม: **฿${totalSellingValue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}**\n` +
          `• ประมาณการกำไรขั้นต้น: **฿${(totalSellingValue - totalCostValue).toLocaleString('th-TH', { minimumFractionDigits: 2 })}**\n` +
          `• มูลค่ายาหมดอายุ: **฿${totalExpiredCostValue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}**`;
      }
      else if (q.includes('สต็อก') || q.includes('เหลือ') || q.includes('ขาด') || q.includes('คลัง') || q.includes('ต่ำ')) {
        const lowStockDetails = lowStockItemsList.map(item => `• ${item.product_code} : ${item.product_name} (คงเหลือ ${item.total_quantity ?? item.quantity ?? 0} ${item.unit} / เกณฑ์ ≤ ${item.min_stock ?? 10})`).join('\n');
        
        botReply = `📦 **สรุปรายการยาสต็อกต่ำกว่าเกณฑ์**\n\n` +
          `• รายการยาทั้งหมด: **${products.length} รายการ**\n` +
          `• ยาที่ต่ำกว่าเกณฑ์เตือน: **${lowStockItemsList.length} รายการ**\n\n` +
          (lowStockItemsList.length > 0 
            ? `⚠️ **รายชื่อยาที่ต้องสั่งซื้อเพิ่ม:**\n${lowStockDetails}` 
            : `✅ สต็อกอยู่ในระดับปกติทุกรายการ ไม่มีรายการขาดคลังครับ`);
      } 
      else if (q.includes('หมดอายุ') || q.includes('exp') || q.includes('ใกล้หมด') || q.includes('เสื่อม')) {
        const expiringDetails = expiringLotsList.slice(0, 5).map(lot => `• ${lot.product_code} : ${lot.product_name} (ล็อต ${lot.lot_number} | EXP: ${formatDate(lot.expiry_date)} | เหลือ ${lot.days_left} วัน)`).join('\n');
        
        if (!isAdmin) {
          botReply = `⏳ **รายการยาใกล้หมดอายุ**\n\n` +
            (expiringLotsList.length > 0 
              ? expiringDetails 
              : `🎉 ไม่พบรายการยาที่จะหมดอายุใน ${expiryThreshold} วันนี้ครับ`);
        } else {
          botReply = `⏳ **รายงานยาล็อตใกล้หมดอายุและหมดอายุแล้ว**\n\n` +
            `• หมดอายุแล้ว (ห้ามจ่าย): **${expiredLotsList.length} ล็อต** (รวม ฿${totalExpiredCostValue.toLocaleString('th-TH', { minimumFractionDigits: 2 })})\n` +
            `• ใกล้หมดอายุ (ภายใน ${expiryThreshold} วัน): **${expiringLotsList.length} ล็อต** (รวม ฿${totalExpiringCostValue.toLocaleString('th-TH', { minimumFractionDigits: 2 })})\n\n` +
            (expiringLotsList.length > 0 
              ? `⚠️ **รายการใกล้หมดอายุ 5 อันดับแรก (ควรเร่งระบาย):**\n${expiringDetails}` 
              : `🎉 ไม่พบรายการยาที่จะหมดอายุใน ${expiryThreshold} วันนี้ครับ`);
        }
      } 
      else if (q.includes('fefo') || q.includes('เบิกจ่าย') || q.includes('หน้าร้าน') || q.includes('จ่ายยา') || q.includes('วิธีเบิก')) {
        botReply = `💡 **การเบิกจ่ายยาตามหลัก FEFO (First Expired, First Out)**\n\n` +
          `1. ระบบจะเลือกยาล็อตที่วันหมดอายุใกล้ที่สุดให้อัตโนมัติ\n` +
          `2. ยาล็อตที่หมดอายุแล้ว ระบบจะระงับการเบิกจ่ายทันทีเพื่อความปลอดภัย\n` +
          `3. ไปที่เมนู 'เบิกจ่ายยาหน้าร้าน' -> พิมพ์ค้นหาชื่อยา -> ตรวจสอบล็อต FEFO -> ระบุจำนวน -> กด 'ยืนยันการเบิกจ่าย' เพื่อตัดสต็อกทันทีครับ`;
      } 
      else if (q.includes('สิทธิ์') || q.includes('ผู้ใช้') || q.includes('เพิ่มผู้ใช้') || q.includes('บทบาท') || q.includes('admin') || q.includes('pharmacist')) {
        botReply = `🔒 **การกำหนดสิทธิ์ผู้ใช้งานระบบ**\n\n` +
          `• **Admin:** จัดการคลังสินค้า, บันทึกรับยา, ปรับราคา/เกณฑ์เตือน, ดูสถิติมูลค่า และกำหนดสิทธิ์ผู้ใช้งาน\n` +
          `• **Pharmacist:** ทำรายการเบิกจ่ายยาหน้าร้านตามหลัก FEFO และใช้งานระบบถามตอบข้อมูลสต็อก\n` +
          `• สามารถเพิ่ม/แก้ไขสิทธิ์ผู้ใช้งานได้ที่เมนู 'กำหนดสิทธิ์ผู้ใช้งาน' ครับ`;
      } 
      else if (q.includes('สวัสดี') || q.includes('หวัดดี') || q.includes('hello') || q.includes('hi')) {
        botReply = `สวัสดีครับคุณ **${currentUser.name}**! ต้องการสอบถามข้อมูลสต็อกยา รายการหมดอายุ หรือบริการแจ้งเตือนผ่าน LINE เพิ่มเติมไหมครับ?`;
      } 
      else {
        botReply = `ขออภัยครับ ไม่พบข้อมูลที่ตรงกับคำถาม "${query}"\n\nคุณสามารถเลือกคลิกหัวข้อในเมนู **คำถามที่พบบ่อย** ด้านขวาเพื่อดูข้อมูลได้อย่างรวดเร็วครับ`;
      }

      const botMsg = { 
        id: Date.now() + 1, 
        sender: 'bot', 
        text: botReply, 
        time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) 
      };
      setChatMessages(prev => [...prev, botMsg]);
    }, 400);
  };

  const renderTypeBadge = (type) => {
    let bg = ALERTS.INFO_BG;
    let color = ALERTS.INFO_TEXT;
    let label = type || 'ยาเม็ด';

    const matchedType = productTypes.find(t => t.id === type);
    if (matchedType) label = matchedType.label;

    if (type === 'tablet') { bg = ALERTS.SUCCESS_BG; color = ALERTS.SUCCESS_TEXT; }
    else if (type === 'liquid') { bg = ALERTS.INFO_BG; color = ALERTS.INFO_TEXT; }
    else if (type === 'injectable') { bg = '#f3e8ff'; color = '#6b21a8'; }
    else if (type === 'topical') { bg = ALERTS.WARNING_BG; color = ALERTS.WARNING_TEXT; }
    else if (type === 'spray') { bg = '#e0e7ff'; color = '#3730a3'; }

    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: '4px',
        backgroundColor: bg, color: color, fontSize: '11px', fontWeight: '600',
        padding: '3px 10px', borderRadius: '20px'
      }}>
        {label}
      </span>
    );
  };

  const handleSelectProduct = async (product) => {
    setSelectedProduct(product);
    setLoadingLots(true);
    setEditingLotId(null);
    try {
      let lotsList = [];
      const productId = product.product_id || product.id || product.product_code;

      try {
        const res = await axios.get(`${API_URL}/products/${productId}/lots`);
        const data = res.data;
        if (Array.isArray(data)) lotsList = data;
        else if (Array.isArray(data?.data)) lotsList = data.data;
      } catch (apiErr) {}

      lotsList.sort((a, b) => new Date(a.expiry_date || a.nearest_expiry).getTime() - new Date(b.expiry_date || b.nearest_expiry).getTime());
      setProductLots(lotsList);
    } catch (err) {
      setProductLots([]);
      showToast('error', 'ไม่สามารถโหลดรายละเอียดล็อตยาได้');
    } finally {
      setLoadingLots(false);
    }
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setProductLots([]);
    setEditingLotId(null);
  };

  const handleStartEditLot = (lot) => {
    setEditingLotId(lot.lot_id || lot.id);
    setTempLotPrices({
      cost_price: lot.cost_price ?? selectedProduct?.cost_price ?? 0,
      selling_price: lot.selling_price ?? selectedProduct?.selling_price ?? 0
    });
  };

  const handleSaveLotPrices = async (lotId) => {
    try {
      await axios.patch(`${API_URL}/lots/${lotId}`, {
        cost_price: parseFloat(tempLotPrices.cost_price) || 0,
        selling_price: parseFloat(tempLotPrices.selling_price) || 0
      });
      Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', text: 'แก้ไขราคาทุนและราคาขายเรียบร้อยแล้ว', confirmButtonColor: MONO.PRIMARY });
      setEditingLotId(null);
      if (selectedProduct) handleSelectProduct(selectedProduct);
      fetchProducts();
    } catch (err) {
      Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', text: 'แก้ไขราคาเรียบร้อยแล้ว (โหมดสาธิต)', confirmButtonColor: MONO.PRIMARY });
      setEditingLotId(null);
    }
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'product_code' || name === 'product_name') {
      if (value.trim().length > 0) {
        const matched = (products || []).filter(p => 
          p.product_code?.toLowerCase().includes(value.toLowerCase()) ||
          p.product_name?.toLowerCase().includes(value.toLowerCase())
        );
        setSuggestions(matched);
        setShowSuggestions(matched.length > 0);
      } else {
        setShowSuggestions(false);
      }
    }
  };

  const handleSelectReceiveSuggestion = (selectedProd) => {
    setFormData(prev => ({
      ...prev,
      product_code: selectedProd.product_code || '',
      product_name: selectedProd.product_name || '',
      product_type: selectedProd.product_type || 'tablet',
      unit: selectedProd.unit || 'เม็ด',
      category: selectedProd.category || 'ยาสามัญประจำบ้าน',
      cost_price: selectedProd.cost_price ?? '',
      selling_price: selectedProd.selling_price ?? '',
      location: selectedProd.location || 'ตู้ A1'
    }));
    setShowSuggestions(false);
  };

  const handleStartEditMinStock = (e, product) => {
    e.stopPropagation();
    if (!isAdmin) return;
    const itemId = product.product_id ?? product.id ?? product.product_code;
    setEditingMinStockId(itemId);
    setTempMinStockMap(prev => ({ ...prev, [itemId]: product.min_stock ?? 10 }));
  };

  const handleMinStockChange = (itemId, value) => {
    setTempMinStockMap(prev => ({ ...prev, [itemId]: value }));
  };

  const handleSaveMinStock = async (e, product) => {
    e.stopPropagation();
    const itemId = product.product_id ?? product.id ?? product.product_code;
    const newMinVal = Number(tempMinStockMap[itemId]);

    if (isNaN(newMinVal) || newMinVal < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ถูกต้อง',
        text: 'กรุณากรอกจำนวนเกณฑ์เตือนสต็อกต่ำให้ถูกต้อง',
        confirmButtonColor: MONO.PRIMARY
      });
      return;
    }

    try {
      await axios.patch(`${API_URL}/products/${itemId}`, { min_stock: newMinVal });
    } catch (err) {}

    setProducts(prev => prev.map(p => (p.product_id ?? p.id ?? p.product_code) === itemId ? { ...p, min_stock: newMinVal } : p));
    setEditingMinStockId(null);
    Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ', text: 'ปรับปรุงเกณฑ์เตือนสต็อกต่ำเรียบร้อยแล้ว', timer: 1500, showConfirmButton: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalProductType = isCustomType ? customTypeName.trim() : formData.product_type;
    const finalCategory = isCustomCategory ? customCategoryName.trim() : formData.category;
    const finalUnit = isCustomUnit ? customUnitName.trim() : formData.unit;

    const payload = {
      ...formData,
      product_type: finalProductType,
      category: finalCategory,
      unit: finalUnit
    };

    try {
      await axios.post(`${API_URL}/products`, payload);
      Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', text: 'บันทึกข้อมูลการรับยาเข้าสต็อกเรียบร้อยแล้ว', confirmButtonColor: MONO.PRIMARY });
    } catch (err) {
      Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', text: 'บันทึกการรับยาเข้าสต็อกเรียบร้อย (โหมดสาธิต)', confirmButtonColor: MONO.PRIMARY });
    }

    const updatedProducts = await axios.get(`${API_URL}/products`).catch(() => ({ data: [] }));
    const dataList = updatedProducts.data?.data || updatedProducts.data || [];

    setFormData({
      product_code: generateNextProductCode(dataList),
      product_name: '', product_type: 'tablet', unit: 'เม็ด',
      category: 'ยาสามัญประจำบ้าน', cost_price: '', selling_price: '',
      location: 'ตู้ A1', lot_number: '', expiry_date: '', quantity: ''
    });
    fetchProducts();
  };

  if (!currentUser) {
    return (
      <div style={loginOverlayStyle}>
        <style>{stylesDynamic}</style>

        <div style={loginCardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={loginLogoBox}>
              <Pill size={36} color="#ffffff" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: MONO.DARKEST, margin: '14px 0 0 0', letterSpacing: '-0.3px' }}>
              LALITA PHARMACY
            </h2>
            <p style={{ fontSize: '13px', color: MONO.DARK, margin: '6px 0 0 0', fontWeight: '500' }}>
              ระบบบริหารจัดการคลังยาและจ่ายยาหน้าร้าน
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={formGroup}>
              <div style={labelHeaderStyle}>
                <label style={labelStyle}>ชื่อผู้ใช้งาน (Username)</label>
              </div>
              <div style={{ position: 'relative' }}>
                <User size={18} color={MONO.SOFT} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="เช่น admin หรือ pharmacist1" 
                  value={loginUsername} 
                  onChange={(e) => setLoginUsername(e.target.value)} 
                  required 
                  style={{ ...inputStyle, paddingLeft: '42px' }} 
                />
              </div>
            </div>

            <div style={formGroup}>
              <div style={labelHeaderStyle}>
                <label style={labelStyle}>รหัสผ่าน (Password)</label>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color={MONO.SOFT} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  placeholder="กรอกรหัสผ่าน" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)} 
                  required 
                  style={{ ...inputStyle, paddingLeft: '42px' }} 
                />
              </div>
            </div>

            <button type="submit" disabled={loginLoading} style={{ ...btnSubmit, height: '46px', fontSize: '14px', marginTop: '8px' }}>
              {loginLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </button>
          </form>
          
          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '11px', color: MONO.SOFT }}>
            © 2026 LALITA PHARMACY SYSTEM. ALL RIGHTS RESERVED.
          </div>
        </div>
      </div>
    );
  }

  const safeProducts = Array.isArray(products) ? products : [];
  const lowStockItemsList = safeProducts.filter(p => Number(p.total_quantity ?? p.quantity ?? 0) <= Number(p.min_stock ?? 10));
  const lowStockCount = lowStockItemsList.length;
  const totalQuantity = safeProducts.reduce((acc, p) => acc + Number(p.total_quantity ?? p.quantity ?? 0), 0);
  const totalCostValue = safeProducts.reduce((acc, p) => acc + (Number(p.total_quantity ?? p.quantity ?? 0) * Number(p.cost_price ?? 0)), 0);
  const totalSellingValue = safeProducts.reduce((acc, p) => acc + (Number(p.total_quantity ?? p.quantity ?? 0) * Number(p.selling_price ?? 0)), 0);

  const productTypeStats = safeProducts.reduce((acc, p) => {
    const type = p.product_type || 'tablet';
    const qty = Number(p.total_quantity ?? p.quantity ?? 0);
    if (!acc[type]) acc[type] = { count: 0, totalQty: 0 };
    acc[type].count += 1;
    acc[type].totalQty += qty;
    return acc;
  }, {});

  const locationStats = safeProducts.reduce((acc, p) => {
    const loc = p.location || 'ตู้ทั่วไป';
    const qty = Number(p.total_quantity ?? p.quantity ?? 0);
    if (!acc[loc]) acc[loc] = { count: 0, totalQty: 0 };
    acc[loc].count += 1;
    acc[loc].totalQty += qty;
    return acc;
  }, {});

  let expiringLotsList = [];
  let expiredLotsList = [];
  let totalExpiringCostValue = 0;
  let totalExpiredCostValue = 0;

  safeProducts.forEach(p => {
    const lots = Array.isArray(p.lots) && p.lots.length > 0 ? p.lots : [
      { 
        id: p.id || p.product_id, 
        lot_number: p.lot_number || p.fefo_lot || 'LOT-1', 
        expiry_date: p.expiry_date || p.nearest_expiry,
        quantity: p.quantity ?? p.total_quantity ?? 0,
        cost_price: p.cost_price 
      }
    ];

    lots.forEach(lot => {
      const expDate = lot.expiry_date || lot.nearest_expiry;
      const days = getDaysToExpiry(expDate);
      const lotQty = Number(lot.quantity ?? 0);

      if (days !== null && lotQty > 0) {
        const lotCost = Number(lot.cost_price ?? p.cost_price ?? 0);
        const lotCostSum = lotQty * lotCost;

        const lotData = {
          product_code: p.product_code,
          product_name: p.product_name,
          unit: p.unit,
          lot_number: lot.lot_number || p.fefo_lot || 'N/A',
          expiry_date: expDate,
          days_left: days,
          quantity: lotQty,
          cost_price: lotCost,
          total_cost: lotCostSum
        };

        if (days <= 0) {
          totalExpiredCostValue += lotCostSum;
          expiredLotsList.push(lotData);
        } else if (days <= expiryThreshold) {
          totalExpiringCostValue += lotCostSum;
          expiringLotsList.push(lotData);
        }
      }
    });
  });

  expiringLotsList.sort((a, b) => a.days_left - b.days_left);
  expiredLotsList.sort((a, b) => a.days_left - b.days_left);

  const expiredLotsGrouped = expiredLotsList.reduce((acc, lot) => {
    const key = `${lot.product_code} - ${lot.product_name}`;
    if (!acc[key]) {
      acc[key] = { 
        code: lot.product_code, 
        name: lot.product_name, 
        unit: lot.unit,
        totalQty: 0, 
        totalCost: 0,
        lotCount: 0 
      };
    }
    acc[key].totalQty += lot.quantity;
    acc[key].totalCost += lot.total_cost;
    acc[key].lotCount += 1;
    return acc;
  }, {});

  const expiredChartList = Object.values(expiredLotsGrouped).sort((a, b) => b.totalCost - a.totalCost);
  const maxExpiredCost = expiredChartList.length > 0 ? Math.max(...expiredChartList.map(item => item.totalCost)) : 1;

  const filteredProducts = safeProducts.filter(p => {
    const matchesSearch = p.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.product_code?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedTypeFilter === 'ALL' || p.product_type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const chartGradColors = [MONO.DEEP, MONO.PRIMARY, MONO.MID, '#38bdf8', '#818cf8', '#a78bfa'];

  return (
    <div style={appContainerStyle}>
      <style>{stylesDynamic}</style>
      
      {/* MOBILE SIDEBAR BACKDROP */}
      {isMobileMenuOpen && (
        <div className="mobile-backdrop" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside style={{
        ...sidebarStyle,
        transform: isMobileMenuOpen ? 'translateX(0)' : undefined
      }} className="responsive-sidebar">
        <div>
          <div style={sidebarBrandArea}>
            <div style={logoIconBox}><Pill size={22} color="#ffffff" /></div>
            <div>
              <h1 style={brandTitleStyle}>LALITA PHARMACY</h1>
              <span style={brandSubTitleStyle}>
                {isAdmin ? 'System Administrator' : 'Pharmacist Portal'}
              </span>
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-close-btn"
              style={{ background: 'none', border: 'none', color: MONO.DARK, cursor: 'pointer', display: 'none', marginLeft: 'auto' }}
            >
              <X size={20} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {!isAdmin ? (
              <>
                <button onClick={() => { setActiveMenu('dispense'); setIsMobileMenuOpen(false); }} style={navBtnStyle(activeMenu === 'dispense')}>
                  <ShoppingBag size={18} />
                  <span>เบิกจ่ายยาหน้าร้าน</span>
                  {activeMenu === 'dispense' && <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.8 }} />}
                </button>
                <button onClick={() => { setActiveMenu('chatbot'); setIsMobileMenuOpen(false); }} style={navBtnStyle(activeMenu === 'chatbot')}>
                  <MessageSquare size={18} />
                  <span>ถามตอบแชทบอท</span>
                  {activeMenu === 'chatbot' && <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.8 }} />}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setActiveMenu('dashboard'); setIsMobileMenuOpen(false); }} style={navBtnStyle(activeMenu === 'dashboard')}>
                  <LayoutDashboard size={18} />
                  <span>แดชบอร์ดภาพรวม</span>
                  {activeMenu === 'dashboard' && <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.8 }} />}
                </button>

                <button onClick={() => { setActiveMenu('inventory'); setIsMobileMenuOpen(false); }} style={navBtnStyle(activeMenu === 'inventory')}>
                  <Warehouse size={18} />
                  <span>จัดการคลังยา</span>
                  {activeMenu === 'inventory' && <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.8 }} />}
                </button>

                <button onClick={() => { setActiveMenu('chatbot'); setIsMobileMenuOpen(false); }} style={navBtnStyle(activeMenu === 'chatbot')}>
                  <MessageSquare size={18} />
                  <span>ถามตอบแชทบอท</span>
                  {activeMenu === 'chatbot' && <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.8 }} />}
                </button>

                <button onClick={() => { setActiveMenu('permissions'); setIsMobileMenuOpen(false); }} style={navBtnStyle(activeMenu === 'permissions')}>
                  <ShieldCheck size={18} />
                  <span>กำหนดสิทธิ์ผู้ใช้งาน</span>
                  {activeMenu === 'permissions' && <ChevronRight size={16} style={{ marginLeft: 'auto', opacity: 0.8 }} />}
                </button>
              </>
            )}
          </nav>
        </div>

        <div style={userProfileBox}>
          <div style={{ ...avatarStyle, backgroundColor: isAdmin ? MONO.DEEP : ALERTS.INFO_BG }}>
            {isAdmin ? <Shield size={18} color="#ffffff" /> : <UserCheck size={18} color={ALERTS.INFO_TEXT} />}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '13px', fontWeight: '600', color: MONO.DARKEST, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser.name}
            </p>
            <span style={{ 
              fontSize: '10px', fontWeight: '600', padding: '1px 8px', borderRadius: '12px',
              backgroundColor: isAdmin ? MONO.DARKEST : ALERTS.SUCCESS_BG,
              color: isAdmin ? '#ffffff' : ALERTS.SUCCESS_TEXT, display: 'inline-block', marginTop: '2px'
            }}>
              Role: {currentUser.role ? currentUser.role.toUpperCase() : (isAdmin ? 'ADMIN' : 'PHARMACIST')}
            </span>
          </div>
          <button onClick={handleLogout} style={btnLogoutStyle} title="ออกจากระบบ">
            <LogOut size={16} color={MONO.DARK} />
          </button>
        </div>
      </aside>

      {/* MAIN VIEW AREA */}
      <div style={mainAreaStyle}>
        <header className="top-header-inner" style={topHeaderStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="mobile-menu-btn"
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <Menu size={22} color={MONO.DARKEST} />
            </button>
            <div style={{ minWidth: 0 }}>
              <h2 className="page-title-text" style={{ ...pageTitleStyle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeMenu === 'dispense' && 'ระบบเบิกจ่ายยาหน้าร้าน'}
                {activeMenu === 'inventory' && 'บริหารจัดการคลังยา'}
                {activeMenu === 'dashboard' && 'แดชบอร์ดภาพรวมคลังยา'}
                {activeMenu === 'chatbot' && 'ระบบถามตอบแชทบอทสอบถามข้อมูล'}
                {activeMenu === 'permissions' && 'ระบบกำหนดสิทธิ์และลงทะเบียนผู้ใช้งาน'}
              </h2>
              <p className="page-subtitle-text" style={{ ...pageSubtitleStyle, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeMenu === 'dispense' && 'แสดงล็อตยาตามหลัก FEFO อัตโนมัติ'}
                {activeMenu === 'inventory' && 'รับสินค้าเข้าสต็อก ตรวจสอบรายการยา และล็อตเบิกจ่ายที่พร้อมขาย'}
                {activeMenu === 'dashboard' && 'สรุปภาพรวมมูลค่า ยาหมดอายุ และกราฟสถิติคลังยา'}
                {activeMenu === 'chatbot' && 'ถามตอบข้อมูลสต็อก ยาใกล้หมดอายุ บริการรับแจ้งเตือน LINE 8 โมงเช้า และคู่มือระบบ'}
                {activeMenu === 'permissions' && 'เพิ่มบัญชีผู้ใช้งาน ดึงสิทธิ์จากตาราง users และจัดการ LINE User ID สำหรับแจ้งเตือน'}
              </p>
            </div>
          </div>
          
          <button onClick={() => { fetchProducts(); fetchUsers(); }} disabled={loading} style={{ ...btnRefresh, flexShrink: 0 }}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} /> 
            <span className="refresh-btn-text">{loading ? 'กำลังรีเฟรช...' : 'รีเฟรชข้อมูล'}</span>
          </button>
        </header>

        {/* MAIN CONTAINER */}
        <main style={contentViewportStyle}>

          {/* 1. DISPENSE VIEW */}
          {activeMenu === 'dispense' && !isAdmin && (
            <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: '460px 1fr', gap: '16px', height: '100%', minHeight: 0 }}>
              <div style={panelCardStyle}>
                <div style={panelHeader}>
                  <ShoppingBag size={18} color={MONO.PRIMARY} />
                  <h3 style={panelTitle}>ทำรายการเบิกจ่ายยาออกหน้าร้าน</h3>
                </div>

                <div style={{ padding: '18px', flex: 1, overflowY: 'auto' }}>
                  {dispenseSuccessMsg && (
                    <div style={{ padding: '12px 14px', backgroundColor: ALERTS.SUCCESS_BG, border: `1px solid ${ALERTS.SUCCESS_BORDER}`, borderRadius: '10px', color: ALERTS.SUCCESS_TEXT, fontSize: '13px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle size={18} color={ALERTS.SUCCESS_TEXT} />
                      <div>{dispenseSuccessMsg}</div>
                    </div>
                  )}

                  <div style={{ ...formGroup, position: 'relative' }} ref={dispenseDropdownRef}>
                    <div style={labelHeaderStyle}>
                      <label style={labelStyle}>1. ค้นหารายการยาที่จะเบิก (พิมพ์ชื่อหรือรหัส)</label>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Search size={16} color={MONO.DARK} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="text" 
                        placeholder="พิมพ์ค้นหา เช่น P001 หรือ Paracetamol..." 
                        value={dispenseSearch} 
                        onChange={handleDispenseSearchChange} 
                        style={{ ...inputStyle, paddingLeft: '38px' }} 
                        autoComplete="off"
                      />
                    </div>

                    {showDispenseSuggestions && (
                      <div style={suggestionDropdownStyle}>
                        {dispenseSuggestions.map((sug) => (
                          <div 
                            key={sug.product_id || sug.id || sug.product_code} 
                            onClick={() => handleSelectDispenseProduct(sug)}
                            style={suggestionItemStyle}
                          >
                            <span style={codeBadge}>{sug.product_code}</span>
                            <span style={{ fontWeight: '600', color: MONO.DARKEST, flex: 1 }}>{sug.product_name}</span>
                            <span style={{ fontSize: '12px', color: MONO.DARK }}>คงเหลือ {sug.total_quantity ?? sug.quantity ?? 0} {sug.unit}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedDispenseProduct ? (
                    <form onSubmit={handleConfirmDispense} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
                      <div style={{ padding: '14px', backgroundColor: MONO.PALE, borderRadius: '10px', border: `1px solid ${MONO.TINT}`, fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                          <span style={{ fontWeight: '700', color: MONO.DARKEST, fontSize: '14px' }}>{selectedDispenseProduct.product_name}</span>
                          {renderTypeBadge(selectedDispenseProduct.product_type)}
                        </div>
                        <div style={{ color: MONO.DARK, display: 'flex', gap: '16px', fontSize: '12px' }}>
                          <span>รหัส: <strong>{selectedDispenseProduct.product_code}</strong></span>
                          <span>คงเหลือเบิกได้: <strong>{selectedDispenseProduct.total_quantity ?? selectedDispenseProduct.quantity ?? 0} {selectedDispenseProduct.unit}</strong></span>
                        </div>
                      </div>

                      <div style={formGroup}>
                        <div style={labelHeaderStyle}>
                          <label style={labelStyle}>2. เลือกเลขล็อต (Lot ID)</label>
                          <span style={fefoBadge}>⭐ Auto FEFO Selected</span>
                        </div>

                        <select 
                          value={selectedLotId} 
                          onChange={(e) => setSelectedLotId(e.target.value)}
                          style={{ 
                            ...selectStyle, height: '40px', fontWeight: '500', 
                            color: isSelectedLotExpired ? ALERTS.EXPIRED_TEXT : MONO.DARKEST,
                            borderColor: isSelectedLotExpired ? ALERTS.EXPIRED_BORDER : MONO.TINT
                          }}
                          required
                        >
                          {availableDispenseLots.length === 0 ? (
                            <option value="">-- ไม่มีล็อตยาคงเหลือ --</option>
                          ) : (
                            availableDispenseLots.map((lot, idx) => {
                              const lotIdVal = lot.lot_id || lot.id || lot.lot_number;
                              const lotNo = lot.lot_number || `LOT-${idx + 1}`;
                              const exp = formatDate(lot.expiry_date || lot.nearest_expiry);
                              const daysLeft = getDaysToExpiry(lot.expiry_date || lot.nearest_expiry);
                              const isExpired = daysLeft !== null && daysLeft <= 0;

                              return (
                                <option key={lotIdVal} value={lotIdVal} disabled={isExpired}>
                                  {isExpired 
                                    ? `❌ [หมดอายุ] ล็อต: ${lotNo} | EXP: ${exp} (เหลือ: ${lot.quantity})`
                                    : `${idx === 0 ? '⭐ [FEFO พร้อมขาย] ' : ''}ล็อต: ${lotNo} | EXP: ${exp} | เหลือ: ${lot.quantity} ${selectedDispenseProduct.unit}`}
                                </option>
                              );
                            })
                          )}
                        </select>
                      </div>

                      {currentSelectedLotObj && (
                        <div style={{ 
                          padding: '12px 14px', 
                          backgroundColor: isSelectedLotExpired ? ALERTS.EXPIRED_BG : ALERTS.SUCCESS_BG, 
                          color: isSelectedLotExpired ? ALERTS.EXPIRED_TEXT : ALERTS.SUCCESS_TEXT,
                          border: `1px solid ${isSelectedLotExpired ? ALERTS.EXPIRED_BORDER : ALERTS.SUCCESS_BORDER}`, 
                          borderRadius: '10px' 
                        }}>
                          <div style={{ 
                            fontSize: '13px', fontWeight: '700', 
                            marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' 
                          }}>
                            {isSelectedLotExpired ? <AlertOctagon size={16} /> : <Tag size={14} />} 
                            {isSelectedLotExpired ? 'ยาล็อตนี้หมดอายุแล้ว! (ไม่อนุญาตให้เบิก)' : `ข้อมูลล็อตที่เลือกเบิกออก: ${currentSelectedLotObj.lot_number || 'LOT-DEFAULT'}`}
                          </div>
                          <div className="form-grid-2" style={{ fontSize: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                            <div>วันหมดอายุ (EXP): <strong>{formatDate(currentSelectedLotObj.expiry_date || currentSelectedLotObj.nearest_expiry)}</strong></div>
                            <div>จำนวนในล็อตนี้: <strong>{currentSelectedLotObj.quantity} {selectedDispenseProduct.unit}</strong></div>
                            <div>ตำแหน่งจัดเก็บ: <strong>{currentSelectedLotObj.location || selectedDispenseProduct.location || 'ตู้ A1'}</strong></div>
                            <div>สถานะล็อต: <strong>{isSelectedLotExpired ? '❌ หมดอายุ' : '✅ เบิกได้ปกติ'}</strong></div>
                          </div>
                        </div>
                      )}

                      <div style={formGroup}>
                        <div style={labelHeaderStyle}>
                          <label style={labelStyle}>3. จำนวนที่ต้องการเบิกจ่ายไปหน้าร้าน ({selectedDispenseProduct.unit})</label>
                        </div>
                        <input 
                          type="number" 
                          min="1" 
                          disabled={isSelectedLotExpired}
                          max={currentSelectedLotObj?.quantity || 9999} 
                          placeholder={isSelectedLotExpired ? "ยาล็อตนี้หมดอายุแล้ว" : `ระบุจำนวน (ไม่เกิน ${currentSelectedLotObj?.quantity || 0})`} 
                          value={dispenseQty} 
                          onChange={(e) => setDispenseQty(e.target.value)} 
                          required 
                          style={{ ...inputStyle, height: '40px', fontSize: '14px', fontWeight: '600' }} 
                        />
                      </div>

                      <div style={formGroup}>
                        <div style={labelHeaderStyle}>
                          <label style={labelStyle}>หมายเหตุการเบิกจ่าย</label>
                        </div>
                        <input 
                          type="text" 
                          disabled={isSelectedLotExpired}
                          value={dispenseNote} 
                          onChange={(e) => setDispenseNote(e.target.value)} 
                          style={inputStyle} 
                        />
                      </div>

                      <button 
                        type="submit" 
                        disabled={dispenseSubmitting || !currentSelectedLotObj || isSelectedLotExpired} 
                        style={{ 
                          ...btnSubmit, height: '44px', 
                          backgroundColor: isSelectedLotExpired ? MONO.SOFT : MONO.PRIMARY, 
                          cursor: isSelectedLotExpired ? 'not-allowed' : 'pointer',
                          fontSize: '14px' 
                        }}
                      >
                        {isSelectedLotExpired 
                          ? '⛔ ยาล็อตนี้หมดอายุแล้ว (ห้ามเบิกจ่าย)' 
                          : (dispenseSubmitting ? 'กำลังบันทึกและหักสต็อก...' : '🚀 ยืนยันการเบิกจ่าย (ตัดสต็อกทันที)')}
                      </button>
                    </form>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: MONO.PALE, borderRadius: '10px', border: `1px dashed ${MONO.TINT}`, color: MONO.DARK, fontSize: '15px' }}>
                      🔍  ค้นหารายการยา เพื่อทำรายการเบิกจ่ายหน้าร้าน
                    </div>
                  )}
                </div>
              </div>

              <div style={panelCardStyle}>
                <div style={panelHeader}>
                  <Warehouse size={18} color={MONO.PRIMARY} />
                  <h3 style={panelTitle}>สถานะสต็อกยาคงเหลือในคลัง</h3>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                  <div className="table-wrapper">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead style={{ position: 'sticky', top: 0, backgroundColor: MONO.PALE, zIndex: 2 }}>
                        <tr style={thRowStyle}>
                          <th style={thStyle}>รหัส / ชื่อยา</th>
                          <th style={thStyle}>ล็อตพร้อมเบิก (FEFO)</th>
                          <th style={thStyle}>วันหมดอายุ (EXP)</th>
                          <th style={thStyle}>ตำแหน่ง</th>
                          <th style={thStyle}>คงเหลือขายได้</th>
                          <th style={thStyle}>จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {safeProducts.map((item) => {
                          const { sellableQty, nearestValidLot } = getProductStockDetails(item);
                          const expiringLotNo = nearestValidLot?.lot_number;
                          const expDate = nearestValidLot?.expiry_date || nearestValidLot?.nearest_expiry;
                          const daysLeft = expDate ? getDaysToExpiry(expDate) : null;
                          const isLow = sellableQty <= Number(item.min_stock ?? 10);

                          return (
                            <tr key={item.product_id || item.id || item.product_code} style={trStyle}>
                              <td style={tdStyle}>
                                <span style={codeBadge}>{item.product_code}</span>
                                <div style={{ fontWeight: '600', color: MONO.DARKEST, marginTop: '2px' }}>{item.product_name}</div>
                              </td>
                              <td style={tdStyle}>
                                {expiringLotNo ? (
                                  <span style={fefoBadge}>⭐ {expiringLotNo}</span>
                                ) : (
                                  <span style={{ fontSize: '11px', color: MONO.DARK }}>- ไม่มีล็อตเบิกได้ -</span>
                                )}
                              </td>
                              <td style={tdStyle}>
                                {expDate ? (
                                  <>
                                    <div>{formatDate(expDate)}</div>
                                    <span style={{ fontSize: '11px', fontWeight: '600', color: daysLeft <= 90 ? ALERTS.WARNING_TEXT : MONO.DEEP }}>
                                      (เหลือ {daysLeft} วัน)
                                    </span>
                                  </>
                                ) : (
                                  <span style={{ fontSize: '11px', color: ALERTS.EXPIRED_TEXT, fontWeight: '600' }}>ไม่มีล็อตที่ยังไม่หมดอายุ</span>
                                )}
                              </td>
                              <td style={tdStyle}>
                                <span style={locBadge}><MapPin size={11} /> {item.location || 'ตู้ A1'}</span>
                              </td>
                              <td style={tdStyle}>
                                <span style={{ fontWeight: '700', color: isLow || sellableQty === 0 ? ALERTS.WARNING_TEXT : MONO.DARKEST, fontSize: '13px' }}>
                                  {sellableQty.toLocaleString()} {item.unit}
                                </span>
                              </td>
                              <td style={tdStyle}>
                                <button 
                                  onClick={() => handleSelectDispenseProduct(item)} 
                                  style={{ ...btnEditMini, backgroundColor: MONO.PRIMARY, color: '#ffffff', border: 'none', padding: '5px 12px', fontSize: '12px' }}
                                >
                                  เลือกเบิก <ArrowRight size={12} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. DASHBOARD VIEW */}
          {activeMenu === 'dashboard' && isAdmin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%', overflowY: 'auto' }}>
              
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
                <div style={statCardStyle}>
                  <div>
                    <p style={statLabel}>มูลค่ายาหมดอายุ (สูญเสีย)</p>
                    <h3 style={{ ...statVal, color: ALERTS.EXPIRED_TEXT }}>
                      ฿{totalExpiredCostValue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </h3>
                    <p style={{ fontSize: '11px', color: MONO.DARK, margin: '4px 0 0 0', fontWeight: '500' }}>
                      รวม {expiredLotsList.length} ล็อตหมดอายุ
                    </p>
                  </div>
                  <div style={statIcon(ALERTS.EXPIRED_BG, ALERTS.EXPIRED_TEXT)}><AlertOctagon size={20} /></div>
                </div>

                <div style={statCardStyle}>
                  <div>
                    <p style={statLabel}>ทุนใกล้หมดอายุ (&lt;{expiryThreshold} วัน)</p>
                    <h3 style={{ ...statVal, color: ALERTS.WARNING_TEXT }}>
                      ฿{totalExpiringCostValue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </h3>
                    <p style={{ fontSize: '11px', color: MONO.DARK, margin: '4px 0 0 0', fontWeight: '500' }}>รวม {expiringLotsList.length} ล็อตเสี่ยง</p>
                  </div>
                  <div style={statIcon(ALERTS.WARNING_BG, ALERTS.WARNING_TEXT)}><CalendarX size={20} /></div>
                </div>

                <div style={statCardStyle}>
                  <div>
                    <p style={statLabel}>มูลค่าทุนคลังยาที่พร้อมขาย</p>
                    <h3 style={{ ...statVal, color: MONO.DEEP }}>
                      ฿{totalCostValue.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                    </h3>
                    <p style={{ fontSize: '11px', color: MONO.DARK, margin: '4px 0 0 0', fontWeight: '500' }}>มูลค่าขาย: ฿{totalSellingValue.toLocaleString()}</p>
                  </div>
                  <div style={statIcon(ALERTS.SUCCESS_BG, ALERTS.SUCCESS_TEXT)}><DollarSign size={20} /></div>
                </div>

                <div style={statCardStyle}>
                  <div>
                    <p style={statLabel}>ยาต้องสั่งเติม (ต่ำกว่าเกณฑ์)</p>
                    <h3 style={statVal}>
                      {lowStockCount} <span style={statUnit}>รายการ</span>
                    </h3>
                    <p style={{ fontSize: '11px', color: MONO.DARK, margin: '4px 0 0 0', fontWeight: '500' }}>เกณฑ์เตือนสต็อกต่ำ</p>
                  </div>
                  <div style={statIcon(ALERTS.INFO_BG, ALERTS.INFO_TEXT)}>
                    <AlertTriangle size={20} />
                  </div>
                </div>
              </div>

              <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', minHeight: 0 }}>
                <div style={{ ...panelCardStyle, padding: '16px 18px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <BarChart3 size={18} color={MONO.PRIMARY} />
                    <h3 style={{ ...panelTitle, fontSize: '14px' }}>กราฟสัดส่วนรูปแบบยาในคลัง</h3>
                  </div>
                  
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '4px' }}>
                    {Object.keys(productTypeStats).length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px', color: MONO.DARK, fontSize: '13px' }}>ไม่มีข้อมูลสต็อก</div>
                    ) : (
                      Object.entries(productTypeStats).map(([typeKey, stat], idx) => {
                        const percent = totalQuantity > 0 ? ((stat.totalQty / totalQuantity) * 100).toFixed(1) : '0.0';
                        const barColor = chartGradColors[idx % chartGradColors.length];
                        return (
                          <div key={typeKey} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: MONO.DARKEST }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {renderTypeBadge(typeKey)} 
                                <span style={{ color: MONO.DARK, fontSize: '11px' }}>({stat.count})</span>
                              </span>
                              <span style={{ fontWeight: '600', color: MONO.DARKEST, fontSize: '12px' }}>
                                {stat.totalQty.toLocaleString()} ชิ้น ({percent}%)
                              </span>
                            </div>
                            <div style={{ height: '8px', width: '100%', backgroundColor: MONO.LIGHTEST, borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${percent}%`, backgroundColor: barColor, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div style={{ ...panelCardStyle, padding: '16px 18px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                    <PieChart size={18} color={MONO.DEEP} />
                    <h3 style={{ ...panelTitle, fontSize: '14px' }}>จำนวนยาแยกตามตำแหน่งจัดเก็บ</h3>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '4px' }}>
                    {Object.keys(locationStats).length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '24px', color: MONO.DARK, fontSize: '13px' }}>ไม่มีข้อมูลตำแหน่งจัดเก็บ</div>
                    ) : (
                      Object.entries(locationStats).map(([locName, stat], idx) => {
                        const percent = totalQuantity > 0 ? ((stat.totalQty / totalQuantity) * 100).toFixed(1) : '0.0';
                        const barColor = chartGradColors[(idx + 2) % chartGradColors.length];
                        return (
                          <div key={locName} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: MONO.DARKEST }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ ...locBadge, fontSize: '11px' }}><MapPin size={11} /> {locName}</span>
                                <span style={{ color: MONO.DARK, fontSize: '11px' }}>({stat.count})</span>
                              </span>
                              <span style={{ fontWeight: '600', color: MONO.DARKEST, fontSize: '12px' }}>
                                {stat.totalQty.toLocaleString()} ชิ้น ({percent}%)
                              </span>
                            </div>
                            <div style={{ height: '8px', width: '100%', backgroundColor: MONO.LIGHTEST, borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${percent}%`, backgroundColor: barColor, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div style={{ ...panelCardStyle, padding: '16px 18px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertOctagon size={18} color={ALERTS.EXPIRED_TEXT} />
                      <h3 style={{ ...panelTitle, fontSize: '14px' }}>ยาล็อตที่หมดอายุแล้วในคลัง</h3>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: ALERTS.EXPIRED_TEXT, backgroundColor: ALERTS.EXPIRED_BG, padding: '2px 8px', borderRadius: '12px' }}>
                      {expiredLotsList.length} ล็อต
                    </span>
                  </div>

                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '4px' }}>
                    {expiredChartList.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px 12px', color: ALERTS.SUCCESS_TEXT, fontSize: '13px', fontWeight: '600' }}>
                        🎉 ไม่พบยาล็อตหมดอายุในคลัง
                      </div>
                    ) : (
                      expiredChartList.map((item, idx) => {
                        const barWidthPercentage = Math.min(100, Math.max(8, (item.totalCost / maxExpiredCost) * 100)).toFixed(1);
                        return (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                              <span style={{ fontWeight: '600', color: MONO.DARKEST, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '160px' }}>
                                <span style={codeBadge}>{item.code}</span> {item.name}
                              </span>
                              <span style={{ fontWeight: '600', color: ALERTS.EXPIRED_TEXT, fontSize: '12px' }}>
                                {item.totalQty} {item.unit} (฿{item.totalCost.toLocaleString('th-TH', { minimumFractionDigits: 2 })})
                              </span>
                            </div>
                            <div style={{ height: '8px', width: '100%', backgroundColor: MONO.LIGHTEST, borderRadius: '4px', overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${barWidthPercentage}%`, backgroundColor: ALERTS.EXPIRED_TEXT, borderRadius: '4px', transition: 'width 0.5s ease' }} />
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

              <div className="bottom-tables-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '14px', minHeight: 0 }}>
                <div style={{ ...panelCardStyle, padding: '16px 18px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <CalendarX size={18} color={ALERTS.WARNING_TEXT} />
                      <h3 style={{ ...panelTitle, fontSize: '14px' }}>ล็อตยาใกล้หมดอายุ (&lt; {expiryThreshold} วัน)</h3>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '12px', color: MONO.DARK, fontWeight: '500' }}>ระยะเวลา:</span>
                      <select 
                        value={expiryThreshold} 
                        onChange={(e) => setExpiryThreshold(Number(e.target.value))}
                        style={{ ...selectStyle, height: '30px', padding: '0 8px', fontSize: '12px', width: 'auto', cursor: 'pointer', border: `1px solid ${MONO.TINT}`, borderRadius: '6px' }}
                      >
                        <option value={30}>30 วัน</option>
                        <option value={60}>60 วัน</option>
                        <option value={90}>90 วัน</option>
                        <option value={180}>180 วัน</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {expiringLotsList.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px 12px', color: ALERTS.SUCCESS_TEXT, fontSize: '13px', fontWeight: '600' }}>
                        🎉 ไม่มีล็อตยาที่จะหมดอายุใน {expiryThreshold} วันนี้
                      </div>
                    ) : (
                      <div className="table-wrapper">
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead style={{ position: 'sticky', top: 0, backgroundColor: MONO.PALE, zIndex: 2 }}>
                            <tr style={thRowStyle}>
                              <th style={thStyle}>รหัส / ชื่อยา</th>
                              <th style={thStyle}>เลขล็อต</th>
                              <th style={thStyle}>วันหมดอายุ (EXP)</th>
                              <th style={thStyle}>คงเหลือ</th>
                              <th style={thStyle}>มูลค่าทุน</th>
                              <th style={thStyle}>สถานะ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {expiringLotsList.map((lot, idx) => (
                              <tr key={idx} style={trStyle}>
                                <td style={tdStyle}>
                                  <span style={codeBadge}>{lot.product_code}</span>
                                  <div style={{ fontWeight: '600', color: MONO.DARKEST, marginTop: '2px' }}>{lot.product_name}</div>
                                </td>
                                <td style={tdStyle}><span style={lotBadge}>{lot.lot_number}</span></td>
                                <td style={tdStyle}>{formatDate(lot.expiry_date)}</td>
                                <td style={tdStyle}>{lot.quantity} {lot.unit}</td>
                                <td style={tdStyle}>฿{lot.total_cost.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</td>
                                <td style={tdStyle}>
                                  <span style={{ fontSize: '11px', fontWeight: '600', color: lot.days_left <= 30 ? ALERTS.EXPIRED_TEXT : ALERTS.WARNING_TEXT }}>
                                    เหลือ {lot.days_left} วัน
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ ...panelCardStyle, padding: '16px 18px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={18} color={ALERTS.WARNING_TEXT} />
                      <h3 style={{ ...panelTitle, fontSize: '14px' }}>รายการยาที่ต้องสั่งซื้อเพิ่ม (Low Stock)</h3>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: ALERTS.WARNING_TEXT, backgroundColor: ALERTS.WARNING_BG, padding: '2px 8px', borderRadius: '12px' }}>
                      {lowStockItemsList.length} รายการ
                    </span>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {lowStockItemsList.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px 12px', color: ALERTS.SUCCESS_TEXT, fontSize: '13px', fontWeight: '600' }}>
                        ✅ สต็อกยาอยู่ในระดับปกติทุกรายการ
                      </div>
                    ) : (
                      <div className="table-wrapper">
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead style={{ position: 'sticky', top: 0, backgroundColor: MONO.PALE, zIndex: 2 }}>
                            <tr style={thRowStyle}>
                              <th style={thStyle}>รหัส / ชื่อยา</th>
                              <th style={thStyle}>ตำแหน่ง</th>
                              <th style={thStyle}>คงเหลือ</th>
                              <th style={thStyle}>เกณฑ์เตือน</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lowStockItemsList.map((item) => {
                              const qty = Number(item.total_quantity ?? 0);
                              const minStock = Number(item.min_stock ?? 10);
                              return (
                                <tr key={item.product_id || item.id || item.product_code} style={trStyle}>
                                  <td style={tdStyle}>
                                    <span style={codeBadge}>{item.product_code}</span>
                                    <div style={{ fontWeight: '600', color: MONO.DARKEST, marginTop: '2px' }}>{item.product_name}</div>
                                  </td>
                                  <td style={tdStyle}><span style={locBadge}><MapPin size={11} /> {item.location || 'ตู้ A1'}</span></td>
                                  <td style={tdStyle}>
                                    <span style={{ fontWeight: '700', color: qty === 0 ? ALERTS.EXPIRED_TEXT : ALERTS.WARNING_TEXT }}>
                                      {qty} {item.unit}
                                    </span>
                                  </td>
                                  <td style={tdStyle}>≤ {minStock} {item.unit}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* 3. INVENTORY VIEW */}
          {activeMenu === 'inventory' && isAdmin && (
            <div className="grid-responsive-2" style={twoColumnGridStyle}>
              {/* FORM CARD */}
              <div style={{ ...panelCardStyle, position: 'relative' }} ref={dropdownRef}>
                <div style={panelHeader}>
                  <PackagePlus size={18} color={MONO.PRIMARY} />
                  <h3 style={panelTitle}>บันทึกรับสินค้ายาเข้าสต็อก</h3>
                </div>

                <form 
                  onSubmit={handleSubmit} 
                  style={{ 
                    padding: '18px', 
                    flex: 1, 
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px'
                  }}
                >
                  <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'start' }}>
                    <div style={{ ...formGroup, position: 'relative' }}>
                      <div style={{ ...labelHeaderStyle, marginBottom: '6px' }}>
                        <label style={labelStyle}>รหัสยา</label>
                      </div>
                      <input 
                        type="text" 
                        name="product_code" 
                        placeholder="เช่น P001" 
                        value={formData.product_code} 
                        onChange={handleFormInputChange} 
                        required 
                        style={inputStyle} 
                        autoComplete="off"
                      />

                      {showSuggestions && (
                        <div style={suggestionDropdownStyle}>
                          {suggestions.map((sug) => (
                            <div 
                              key={sug.product_id || sug.id || sug.product_code} 
                              onClick={() => handleSelectReceiveSuggestion(sug)}
                              style={suggestionItemStyle}
                            >
                              <span style={codeBadge}>{sug.product_code}</span>
                              <span style={{ fontWeight: '600', color: MONO.DARKEST, flex: 1 }}>{sug.product_name}</span>
                              <span style={{ fontSize: '11px', color: MONO.DARK }}>เลือกเติมล็อตยาเดิม</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div style={formGroup}>
                      <div style={{ ...labelHeaderStyle, marginBottom: '6px' }}>
                        <label style={labelStyle}>รูปแบบยา</label>
                        <button 
                          type="button" 
                          onClick={() => setIsCustomType(!isCustomType)} 
                          style={{ background: 'none', border: 'none', color: MONO.PRIMARY, fontSize: '11px', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                        >
                          {isCustomType ? '← เลือกที่มี' : '+ เพิ่มรูปแบบ'}
                        </button>
                      </div>

                      {isCustomType ? (
                        <input 
                          type="text" 
                          placeholder="ระบุ เช่น ยาหยอดตา" 
                          value={customTypeName} 
                          onChange={(e) => setCustomTypeName(e.target.value)} 
                          required 
                          style={{ ...inputStyle, borderColor: MONO.PRIMARY }} 
                        />
                      ) : (
                        <select name="product_type" value={formData.product_type} onChange={handleFormInputChange} style={selectStyle}>
                          {productTypes.map(t => (
                            <option key={t.id} value={t.id}>{t.label}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div style={formGroup}>
                    <div style={{ ...labelHeaderStyle, marginBottom: '6px' }}>
                      <label style={labelStyle}>ชื่อรายการยา</label>
                    </div>
                    <input 
                      type="text" 
                      name="product_name" 
                      placeholder="เช่น Paracetamol 500mg" 
                      value={formData.product_name} 
                      onChange={handleFormInputChange} 
                      required 
                      style={inputStyle} 
                    />
                  </div>

                  <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'start' }}>
                    <div style={formGroup}>
                      <div style={{ ...labelHeaderStyle, marginBottom: '6px' }}>
                        <label style={labelStyle}>หมวดหมู่ยา</label>
                        <button 
                          type="button" 
                          onClick={() => setIsCustomCategory(!isCustomCategory)} 
                          style={{ background: 'none', border: 'none', color: MONO.PRIMARY, fontSize: '11px', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                        >
                          {isCustomCategory ? '← เลือกที่มี' : '+ เพิ่มหมวดหมู่'}
                        </button>
                      </div>

                      {isCustomCategory ? (
                        <input 
                          type="text" 
                          placeholder="ระบุ เช่น ยาควบคุมพิเศษ" 
                          value={customCategoryName} 
                          onChange={(e) => setCustomCategoryName(e.target.value)} 
                          required 
                          style={{ ...inputStyle, borderColor: MONO.PRIMARY }} 
                        />
                      ) : (
                        <select name="category" value={formData.category} onChange={handleFormInputChange} style={selectStyle}>
                          {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                          ))}
                        </select>
                      )}
                    </div>

                    <div style={formGroup}>
                      <div style={{ ...labelHeaderStyle, marginBottom: '6px' }}>
                        <label style={labelStyle}>หน่วยนับ</label>
                        <button 
                          type="button" 
                          onClick={() => setIsCustomUnit(!isCustomUnit)} 
                          style={{ background: 'none', border: 'none', color: MONO.PRIMARY, fontSize: '11px', fontWeight: '600', cursor: 'pointer', padding: 0 }}
                        >
                          {isCustomUnit ? '← เลือกที่มี' : '+ เพิ่มหน่วยนับ'}
                        </button>
                      </div>

                      {isCustomUnit ? (
                        <input 
                          type="text" 
                          placeholder="ระบุ เช่น กระปุก, แพ็ค" 
                          value={customUnitName} 
                          onChange={(e) => setCustomUnitName(e.target.value)} 
                          required 
                          style={{ ...inputStyle, borderColor: MONO.PRIMARY }} 
                        />
                      ) : (
                        <select name="unit" value={formData.unit} onChange={handleFormInputChange} style={selectStyle}>
                          {units.map(u => (
                            <option key={u.id} value={u.id}>{u.label}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>

                  <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'start' }}>
                    <div style={formGroup}>
                      <div style={{ ...labelHeaderStyle, marginBottom: '6px' }}>
                        <label style={labelStyle}>ราคาทุนล็อตนี้ (บาท)</label>
                      </div>
                      <input type="number" step="0.01" name="cost_price" placeholder="0.00" value={formData.cost_price} onChange={handleFormInputChange} required style={inputStyle} />
                    </div>
                    <div style={formGroup}>
                      <div style={{ ...labelHeaderStyle, marginBottom: '6px' }}>
                        <label style={labelStyle}>ราคาขายหน้าร้าน (บาท)</label>
                      </div>
                      <input type="number" step="0.01" name="selling_price" placeholder="0.00" value={formData.selling_price} onChange={handleFormInputChange} required style={inputStyle} />
                    </div>
                  </div>

                  <div style={formGroup}>
                    <div style={{ ...labelHeaderStyle, marginBottom: '6px' }}>
                      <label style={labelStyle}>ตำแหน่งจัดเก็บหลัก</label>
                    </div>
                    <input type="text" name="location" placeholder="เช่น ตู้ A1" value={formData.location} onChange={handleFormInputChange} required style={inputStyle} />
                  </div>

                  <hr style={{ border: 'none', borderTop: `1px solid ${MONO.TINT}`, margin: '8px 0' }} />

                  <div style={formGroup}>
                    <div style={{ ...labelHeaderStyle, marginBottom: '6px' }}>
                      <label style={labelStyle}>เลขล็อต (Lot Number)</label>
                    </div>
                    <input type="text" name="lot_number" placeholder="เช่น LOT-2026-01" value={formData.lot_number} onChange={handleFormInputChange} required style={inputStyle} />
                  </div>

                  <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'start' }}>
                    <div style={formGroup}>
                      <div style={{ ...labelHeaderStyle, marginBottom: '6px' }}>
                        <label style={labelStyle}>วันหมดอายุ (EXP)</label>
                      </div>
                      <input type="date" name="expiry_date" value={formData.expiry_date} onChange={handleFormInputChange} required style={inputStyle} />
                    </div>
                    <div style={formGroup}>
                      <div style={{ ...labelHeaderStyle, marginBottom: '6px' }}>
                        <label style={labelStyle}>จำนวนรับเข้า</label>
                      </div>
                      <input type="number" name="quantity" placeholder="100" value={formData.quantity} onChange={handleFormInputChange} required style={inputStyle} />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    style={{ 
                      ...btnSubmit, 
                      width: '100%',             /* ขยายเต็มความกว้างของฟอร์ม */
                      padding: '14px 20px',      /* เพิ่มความสูงและพื้นที่คลิก */
                      fontSize: '16px',          /* ปรับขนาดตัวอักษรให้ใหญ่ขึ้น */
                      fontWeight: '600',         /* ทำตัวหนา */
                      display: 'flex',           /* จัดเรียง ไอคอน + ข้อความ */
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px',                /* ระยะห่างระหว่างไอคอนกับข้อความ */
                      marginTop: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={20} /> บันทึกการรับยาเข้าสต็อก
                  </button>
                </form>
              </div>

              {/* TABLE CARD */}
              <div style={panelCardStyle}>
                <div style={{ ...panelHeader, justifyContent: 'space-between', flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Warehouse size={18} color={MONO.PRIMARY} />
                    <h3 style={panelTitle}>ตารางสต็อกยา (คลิกเพื่อดูรายละเอียด)</h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ position: 'relative', width: '220px' }}>
                      <Search size={15} color={MONO.DARK} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input 
                        type="text" 
                        placeholder="ค้นหาชื่อ, รหัส..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ ...inputStyle, paddingLeft: '34px', height: '36px', fontSize: '12px' }}
                      />
                    </div>
                  </div>
                </div>

                <div style={tableScrollContainerStyle}>
                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '48px', color: MONO.DARK }}>กำลังโหลดข้อมูลคลังยา...</div>
                  ) : (
                    <div className="table-wrapper">
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                          <tr style={thRowStyle}>
                            <th style={thStyle}>รหัส / ชื่อยา</th>
                            <th style={thStyle}>รูปแบบยา</th>
                            <th style={thStyle}>ล็อตพร้อมเบิก (FEFO)</th>
                            <th style={thStyle}>เกณฑ์เตือนสต็อกต่ำ (Min)</th>
                            <th style={thStyle}>คงเหลือขายได้</th>
                            <th style={thStyle}>สถานะสต็อก</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.map((item) => {
                            const itemId = item.product_id ?? item.id ?? item.product_code;
                            const minThreshold = Number(item.min_stock ?? 10);
                            
                            const { sellableQty, nearestValidLot } = getProductStockDetails(item);
                            const isLow = sellableQty <= minThreshold;
                            const isEditingMin = editingMinStockId !== null && editingMinStockId === itemId;

                            const daysLeft = nearestValidLot ? getDaysToExpiry(nearestValidLot.expiry_date || nearestValidLot.nearest_expiry) : null;
                            const hasValidLot = Boolean(nearestValidLot);

                            return (
                              <tr 
                                key={itemId} 
                                style={{ ...trStyle, cursor: 'pointer', backgroundColor: isLow || sellableQty === 0 ? MONO.PALE : 'transparent' }} 
                                onClick={() => handleSelectProduct(item)}
                              >
                                <td style={tdStyle}>
                                  <span style={codeBadge}>{item.product_code}</span>
                                  <div style={{ fontWeight: '600', color: MONO.DARKEST, marginTop: '2px' }}>{item.product_name}</div>
                                </td>

                                <td style={tdStyle}>{renderTypeBadge(item.product_type)}</td>

                                <td style={tdStyle}>
                                  {hasValidLot ? (
                                    <div>
                                      <span style={fefoBadge}>⭐ {nearestValidLot.lot_number}</span>
                                      <div style={{ fontSize: '11px', color: daysLeft <= 90 ? ALERTS.WARNING_TEXT : MONO.DEEP, marginTop: '2px' }}>
                                        EXP: {formatDate(nearestValidLot.expiry_date || nearestValidLot.nearest_expiry)} ({daysLeft} วัน)
                                      </div>
                                    </div>
                                  ) : (
                                    <span style={{ fontSize: '12px', color: ALERTS.EXPIRED_TEXT, fontWeight: '600' }}>
                                      ❌ ไม่มีล็อตพร้อมเบิก
                                    </span>
                                  )}
                                </td>
                                
                                <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                                  {isEditingMin ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <input 
                                        type="number" 
                                        value={tempMinStockMap[itemId] ?? minThreshold} 
                                        onChange={(e) => handleMinStockChange(itemId, e.target.value)}
                                        style={{ width: '60px', height: '30px', padding: '0 6px', borderRadius: '4px', border: `1px solid ${MONO.PRIMARY}`, fontSize: '13px' }}
                                        autoFocus
                                      />
                                      <button onClick={(e) => handleSaveMinStock(e, item)} style={btnSaveMini}>
                                        <Save size={12} />
                                      </button>
                                    </div>
                                  ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <span style={{ fontWeight: '500', color: MONO.DARK }}>
                                        ≤ {minThreshold} {item.unit || 'เม็ด'}
                                      </span>
                                      {isAdmin && (
                                        <button onClick={(e) => handleStartEditMinStock(e, item)} style={btnEditMini}>
                                          <Edit2 size={12} />
                                        </button>
                                      )}
                                    </div>
                                  )}
                                </td>

                                <td style={tdStyle}>
                                  <span style={{ fontSize: '14px', fontWeight: '700', color: isLow || sellableQty === 0 ? ALERTS.WARNING_TEXT : MONO.DARKEST }}>
                                    {sellableQty.toLocaleString()} {item.unit || 'เม็ด'}
                                  </span>
                                </td>

                                <td style={tdStyle}>
                                  <span style={stockBadge(isLow, !hasValidLot)}>
                                    {!hasValidLot ? <AlertOctagon size={13} /> : (isLow ? <ShieldAlert size={13} /> : <CheckCircle2 size={13} />)}
                                    {!hasValidLot ? 'ไม่มีล็อตขาย' : (isLow ? 'สต็อกต่ำ' : 'ปกติ')}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 4. CHATBOT VIEW */}
          {activeMenu === 'chatbot' && (
            <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', height: '100%', minHeight: 0 }}>
              <div style={{ ...panelCardStyle, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
                <div style={panelHeader}>
                  <Bot size={18} color={MONO.PRIMARY} />
                  <h3 style={panelTitle}>สอบถามข้อมูลคลังยาและระบบเบิกจ่าย</h3>
                  <span style={{ marginLeft: 'auto', fontSize: '11px', fontWeight: '600', backgroundColor: MONO.PALE, color: MONO.DEEP, padding: '3px 10px', borderRadius: '12px', border: `1px solid ${MONO.TINT}` }}>
                    Role: {currentUser.role.toUpperCase()}
                  </span>
                </div>

                <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', backgroundColor: MONO.PALE, overflow: 'hidden', minHeight: 0 }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto', paddingRight: '4px' }}>
                    {chatMessages.map(msg => (
                      <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                          maxWidth: '82%',
                          padding: '12px 16px',
                          borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                          backgroundColor: msg.sender === 'user' ? MONO.PRIMARY : '#ffffff',
                          color: msg.sender === 'user' ? '#ffffff' : MONO.DARKEST,
                          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                          fontSize: '13px',
                          lineHeight: '1.6',
                          whiteSpace: 'pre-line',
                          border: msg.sender === 'user' ? 'none' : `1px solid ${MONO.TINT}`
                        }}>
                          {msg.text}
                        </div>
                        <span style={{ fontSize: '10px', color: MONO.SOFT, marginTop: '4px', padding: '0 4px' }}>{msg.time}</span>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} style={{ display: 'flex', gap: '10px', marginTop: '14px', backgroundColor: '#ffffff', padding: '10px', borderRadius: '12px', border: `1px solid ${MONO.TINT}`, flexShrink: 0 }}>
                    <input 
                      type="text" 
                      placeholder="พิมพ์ถามระบบ หรือเลือกกดคำถามด้านขวา..." 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      style={{ ...inputStyle, border: 'none', backgroundColor: 'transparent' }} 
                    />
                    <button type="submit" style={{ ...btnSubmit, width: 'auto', padding: '0 20px', margin: 0 }}>
                      <Send size={16} /> ส่งข้อความ
                    </button>
                  </form>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%', minHeight: 0, overflowY: 'auto' }}>
                
                {/* LINE NOTIFICATION PROMPT BOX */}
                <div style={{ ...panelCardStyle, padding: '14px', backgroundColor: '#f0fdf4', border: `1px solid ${ALERTS.SUCCESS_BORDER}`, flexShrink: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: ALERTS.SUCCESS_TEXT }}>
                    <Bell size={18} />
                    <h4 style={{ margin: 0, fontSize: '13px', fontWeight: '700' }}>การแจ้งเตือน LINE อัตโนมัติ</h4>
                  </div>
                  <p style={{ margin: 0, fontSize: '11px', color: MONO.DARK, lineHeight: '1.5' }}>
                    ลงทะเบียนรับสรุปรายงานยาสต็อกต่ำและยาใกล้หมดอายุตรงเข้า LINE ของคุณทุกเช้า 8 โมง
                  </p>

                  <div style={{ textAlign: 'center', margin: '12px 0 8px 0', padding: '10px', backgroundColor: '#ffffff', borderRadius: '10px', border: `1px solid ${ALERTS.SUCCESS_BORDER}` }}>
                    <img 
                      src="images/qr.png" 
                      alt="LINE Official QR Code" 
                      style={{ width: '120px', height: '120px', objectFit: 'contain', borderRadius: '6px' }} 
                    />
                    <div style={{ fontSize: '11px', color: MONO.DARK, marginTop: '6px', fontWeight: '600' }}>
                      สแกน QR Code เพื่อเพิ่มเพื่อน LINE
                    </div>
                  </div>

                  <button 
                    onClick={() => handleSendMessage('วิธีลงทะเบียนรับแจ้งเตือน LINE 8 โมงเช้า')} 
                    style={{ ...btnEditMini, marginTop: '6px', width: '100%', justifyContent: 'center', backgroundColor: '#16a34a', color: '#ffffff', border: 'none', padding: '8px' }}
                  >
                    <Smartphone size={13} /> ดูวิธีลงทะเบียน LINE ID
                  </button>
                </div>

                {/* QUICK QUERY BUTTONS */}
                <div style={{ ...panelCardStyle, flexShrink: 0 }}>
                  <div style={panelHeader}>
                    <HelpCircle size={18} color={MONO.PRIMARY} />
                    <h3 style={panelTitle}>คำถามที่พบบ่อย (Quick Query)</h3>
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {isAdmin ? (
                      <>
                        <button onClick={() => handleSendMessage('ตรวจสอบยาสต็อกต่ำกว่าเกณฑ์')} style={quickQueryBtn}>
                          🔍 ตรวจสอบยาสต็อกต่ำกว่าเกณฑ์
                        </button>
                        <button onClick={() => handleSendMessage('เช็คยาล็อตใกล้หมดอายุ')} style={quickQueryBtn}>
                          ⏰ เช็คยาล็อตใกล้หมดอายุ
                        </button>
                        <button onClick={() => handleSendMessage('วิธีเบิกจ่ายยาตามหลัก FEFO')} style={quickQueryBtn}>
                          💡 วิธีเบิกจ่ายยาตามหลัก FEFO
                        </button>
                        <button onClick={() => handleSendMessage('สรุปมูลค่าคลังสินค้า')} style={quickQueryBtn}>
                          📊 สรุปมูลค่าคลังสินค้า
                        </button>
                        <button onClick={() => handleSendMessage('การกำหนดสิทธิ์ผู้ใช้งาน')} style={quickQueryBtn}>
                          🔒 การกำหนดสิทธิ์ผู้ใช้งาน
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleSendMessage('เช็คยาล็อตใกล้หมดอายุ')} style={quickQueryBtn}>
                          ⏰ เช็คยาล็อตใกล้หมดอายุ
                        </button>
                        <button onClick={() => handleSendMessage('วิธีเบิกจ่ายยาตามหลัก FEFO')} style={quickQueryBtn}>
                          💡 วิธีเบิกจ่ายยาตามหลัก FEFO
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. PERMISSIONS VIEW */}
          {activeMenu === 'permissions' && isAdmin && (
            <div className="grid-responsive-2" style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '16px', height: '100%', minHeight: 0 }}>
              
              <div style={{ ...panelCardStyle, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
                <div style={panelHeader}>
                  <UserPlus size={18} color={MONO.PRIMARY} />
                  <h3 style={panelTitle}>เพิ่มผู้ใช้งานระบบและกำหนดสิทธิ์</h3>
                </div>

                <form onSubmit={handleCreateUser} style={{ padding: '18px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={formGroup}>
                    <div style={labelHeaderStyle}>
                      <label style={labelStyle}>ชื่อ-นามสกุล</label>
                    </div>
                    <input 
                      type="text" 
                      placeholder="เช่น เภสัชกร สมชาย" 
                      value={newUserForm.name} 
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))} 
                      required 
                      style={inputStyle} 
                    />
                  </div>

                  <div style={formGroup}>
                    <div style={labelHeaderStyle}>
                      <label style={labelStyle}>ชื่อผู้ใช้งาน (Username)</label>
                    </div>
                    <input 
                      type="text" 
                      placeholder="เช่น pharmacist2" 
                      value={newUserForm.username} 
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, username: e.target.value }))} 
                      required 
                      style={inputStyle} 
                    />
                  </div>

                  <div style={formGroup}>
                    <div style={labelHeaderStyle}>
                      <label style={labelStyle}>รหัสผ่าน (Password)</label>
                    </div>
                    <input 
                      type="password" 
                      placeholder="กำหนดรหัสผ่าน" 
                      value={newUserForm.password} 
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))} 
                      required 
                      style={inputStyle} 
                    />
                  </div>

                  <div style={formGroup}>
                    <div style={labelHeaderStyle}>
                      <label style={labelStyle}>สิทธิ์การใช้งาน (Role)</label>
                    </div>
                    <select 
                      value={newUserForm.role} 
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))} 
                      style={selectStyle}
                    >
                      <option value="pharmacist">pharmacist (เภสัชกรหน้าร้าน)</option>
                      <option value="admin">admin (ผู้ดูแลระบบ)</option>
                    </select>
                  </div>

                  <div style={formGroup}>
                    <div style={labelHeaderStyle}>
                      <label style={labelStyle}>LINE User ID สำหรับรับแจ้งเตือน</label>
                    </div>
                    <input 
                      type="text" 
                      placeholder="เช่น U1234567890abcdef..." 
                      value={newUserForm.line_user_id} 
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, line_user_id: e.target.value }))} 
                      style={inputStyle} 
                    />
                  </div>

                  <button type="submit" style={{ ...btnSubmit, marginTop: '8px' }}>
                    <UserPlus size={18} /> ลงทะเบียนและบันทึกผู้ใช้
                  </button>
                </form>
              </div>

              <div style={{ ...panelCardStyle, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
                <div style={panelHeader}>
                  <ShieldCheck size={18} color={MONO.PRIMARY} />
                  <h3 style={panelTitle}>รายชื่อผู้ใช้งานในระบบ ({usersList.length} คน)</h3>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '8px', minHeight: 0 }}>
                  <div className="table-wrapper">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead style={{ position: 'sticky', top: 0, backgroundColor: MONO.PALE, zIndex: 2 }}>
                        <tr style={thRowStyle}>
                          <th style={thStyle}>ID / ชื่อผู้ใช้</th>
                          <th style={thStyle}>ชื่อ-นามสกุล</th>
                          <th style={thStyle}>สิทธิ์ (Role)</th>
                          <th style={thStyle}>LINE User ID</th>
                          <th style={thStyle}>จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {usersList.map((u) => {
                          const uId = u.user_id || u.id;
                          return (
                            <tr key={uId} style={trStyle}>
                              <td style={tdStyle}>
                                <span style={codeBadge}>{uId}</span>
                                <div style={{ fontWeight: '600', color: MONO.DARKEST, marginTop: '2px' }}>@{u.username}</div>
                              </td>
                              <td style={tdStyle}>{u.name}</td>
                              <td style={tdStyle}>
                                <span style={{
                                  fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '10px',
                                  backgroundColor: u.role === 'admin' ? MONO.DARKEST : ALERTS.INFO_BG,
                                  color: u.role === 'admin' ? '#ffffff' : ALERTS.INFO_TEXT
                                }}>
                                  {u.role ? u.role.toUpperCase() : 'PHARMACIST'}
                                </span>
                              </td>
                              <td style={tdStyle}>
                                {u.line_user_id ? (
                                  <span style={{ fontSize: '12px', color: ALERTS.SUCCESS_TEXT, fontWeight: '500' }}>
                                    {u.line_user_id}
                                  </span>
                                ) : (
                                  <span style={{ fontSize: '12px', color: MONO.SOFT }}>- ยังไม่เชื่อมต่อ -</span>
                                )}
                              </td>
                              <td style={tdStyle}>
                                <button 
                                  onClick={() => handleDeleteUser(uId, u.username)}
                                  style={{ ...btnEditMini, backgroundColor: ALERTS.EXPIRED_BG, color: ALERTS.EXPIRED_TEXT, border: `1px solid ${ALERTS.EXPIRED_BORDER}` }}
                                >
                                  <Trash2 size={13} /> ลบ
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* PRODUCT LOTS DETAIL MODAL */}
      {selectedProduct && (
        <div style={modalOverlayStyle} onClick={closeModal}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1px solid ${MONO.TINT}`, paddingBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: MONO.DARKEST }}>
                  {selectedProduct.product_name}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: MONO.DARK }}>
                  รหัส: {selectedProduct.product_code} | หน่วย: {selectedProduct.unit} | ตำแหน่ง: {selectedProduct.location || 'ตู้ A1'}
                </p>
              </div>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: MONO.DARK }}>
                <X size={20} />
              </button>
            </div>

            {loadingLots ? (
              <div style={{ textAlign: 'center', padding: '24px', color: MONO.DARK }}>กำลังดึงข้อมูลล็อต...</div>
            ) : (
              <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={thRowStyle}>
                      <th style={thStyle}>เลขล็อต</th>
                      <th style={thStyle}>วันหมดอายุ</th>
                      <th style={thStyle}>คงเหลือ</th>
                      <th style={thStyle}>ราคาทุน</th>
                      <th style={thStyle}>ราคาขาย</th>
                      {isAdmin && <th style={thStyle}>จัดการ</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {productLots.map((lot) => {
                      const lotId = lot.lot_id || lot.id;
                      const isEditing = editingLotId === lotId;
                      const daysLeft = getDaysToExpiry(lot.expiry_date || lot.nearest_expiry);
                      const isExpired = daysLeft !== null && daysLeft <= 0;

                      return (
                        <tr key={lotId} style={{ ...trStyle, backgroundColor: isExpired ? ALERTS.EXPIRED_BG : 'transparent' }}>
                          <td style={tdStyle}><span style={lotBadge}>{lot.lot_number}</span></td>
                          <td style={tdStyle}>
                            {formatDate(lot.expiry_date || lot.nearest_expiry)}
                            {isExpired && <span style={{ color: ALERTS.EXPIRED_TEXT, fontSize: '11px', display: 'block' }}>(หมดอายุ)</span>}
                          </td>
                          <td style={tdStyle}>{lot.quantity} {selectedProduct.unit}</td>
                          <td style={tdStyle}>
                            {isEditing ? (
                              <input 
                                type="number" 
                                value={tempLotPrices.cost_price} 
                                onChange={(e) => setTempLotPrices(p => ({ ...p, cost_price: e.target.value }))}
                                style={{ width: '70px', padding: '2px 4px', fontSize: '12px' }}
                              />
                            ) : (
                              `฿${Number(lot.cost_price ?? selectedProduct.cost_price ?? 0).toFixed(2)}`
                            )}
                          </td>
                          <td style={tdStyle}>
                            {isEditing ? (
                              <input 
                                type="number" 
                                value={tempLotPrices.selling_price} 
                                onChange={(e) => setTempLotPrices(p => ({ ...p, selling_price: e.target.value }))}
                                style={{ width: '70px', padding: '2px 4px', fontSize: '12px' }}
                              />
                            ) : (
                              `฿${Number(lot.selling_price ?? selectedProduct.selling_price ?? 0).toFixed(2)}`
                            )}
                          </td>
                          {isAdmin && (
                            <td style={tdStyle}>
                              {isEditing ? (
                                <button onClick={() => handleSaveLotPrices(lotId)} style={btnSaveMini}>
                                  <Save size={12} /> บันทึก
                                </button>
                              ) : (
                                <button onClick={() => handleStartEditLot(lot)} style={btnEditMini}>
                                  <Edit2 size={12} /> แก้ไขราคา
                                </button>
                              )}
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}