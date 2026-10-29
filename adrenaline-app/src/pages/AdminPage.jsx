import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, RefreshCw, TrendingUp, AlertTriangle, XCircle, 
  Lock, Database, DollarSign, ShoppingBag, Activity, Server, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { API_BASE, getAuthHeader, getUser } from '../utils/auth';

const ADMIN_PIN = '2004';

function StockBadge({ stock }) {
  if (stock === 0) return <span className="px-2 py-0.5 text-[10px] font-black bg-red-900/60 text-red-400 rounded tracking-widest uppercase">Out of Stock</span>;
  if (stock <= 10) return <span className="px-2 py-0.5 text-[10px] font-black bg-yellow-900/60 text-yellow-400 rounded tracking-widest uppercase">Low Stock</span>;
  return <span className="px-2 py-0.5 text-[10px] font-black bg-green-900/60 text-green-400 rounded tracking-widest uppercase">In Stock</span>;
}

export default function AdminPage() {
  const loggedUser = getUser();
  const [authenticated, setAuthenticated] = useState(loggedUser?.role === 'admin');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState('inventory'); // 'inventory', 'orders', 'analytics'
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [allOrders, setAllOrders] = useState([]);
  const [cacheStats, setCacheStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [editStock, setEditStock] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const getAdminHeaders = () => ({
    'Content-Type': 'application/json',
    'x-admin-pin': ADMIN_PIN,
    ...getAuthHeader(),
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      setProducts(data);
      const initial = {};
      data.forEach(p => { initial[p.slug] = p.stock; });
      setEditStock(initial);
    } catch {
      showToast('Failed to fetch products. Check backend.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/analytics`, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data.analytics);
      }
    } catch {
      // Ignored
    }
  };

  const fetchAllOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/all?limit=25`, {
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setAllOrders(data.data || []);
      }
    } catch {
      // Ignored
    }
  };

  const fetchCacheStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cache/stats`);
      if (res.ok) {
        const data = await res.json();
        setCacheStats(data.stats);
      }
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchProducts();
      fetchAnalytics();
      fetchAllOrders();
      fetchCacheStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
      setPin('');
    }
  };

  const handleSeedDB = async () => {
    setSeedLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/products/seed`, {
        method: 'POST',
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        showToast('Database seeded with all 8 enhanced telemetry flavors!');
        fetchProducts();
        fetchAnalytics();
      } else {
        showToast('Seeding failed.', 'error');
      }
    } catch {
      showToast('Network error — backend offline?', 'error');
    } finally {
      setSeedLoading(false);
    }
  };

  const handleUpdateStock = async (slug, delta = 0) => {
    const currentVal = parseInt(editStock[slug], 10) || 0;
    const newStock = Math.max(0, currentVal + delta);
    try {
      const res = await fetch(`${API_BASE}/api/products/${slug}/stock`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        showToast(`${slug.toUpperCase()} stock updated to ${newStock}`);
        setEditStock(prev => ({ ...prev, [slug]: newStock }));
        fetchProducts();
        fetchCacheStats();
      } else {
        showToast('Update failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        showToast(`Order status updated to ${newStatus}`);
        fetchAllOrders();
        fetchAnalytics();
      } else {
        showToast('Status update failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  };

  // ── PIN Gate ────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 min-h-[calc(100vh-80px)] relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-neutral-900 border border-white/10 p-8 shadow-2xl relative"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-red-600 to-red-900" />
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-600/20 border border-red-500/40 rounded flex items-center justify-center">
              <Lock size={18} className="text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-black italic uppercase">Admin Access</h2>
              <p className="text-gray-500 text-[10px] font-mono tracking-widest">SECURITY_LAYER_ACTIVE</p>
            </div>
          </div>
          <form onSubmit={handlePinSubmit} className="flex flex-col gap-4">
            <input
              type="password"
              value={pin}
              onChange={e => { setPin(e.target.value); setPinError(false); }}
              placeholder="ENTER ADMIN PIN (2004)"
              className={`w-full bg-black/50 border px-4 py-3 focus:outline-none transition tracking-widest text-sm font-mono ${
                pinError ? 'border-red-500 text-red-400' : 'border-white/10 focus:border-red-600'
              }`}
            />
            {pinError && <p className="text-red-500 text-xs font-mono tracking-widest">INVALID ACCESS CODE</p>}
            <button className="w-full bg-red-600 hover:bg-white text-white hover:text-black transition py-3 font-black italic tracking-widest cursor-pointer">
              AUTHENTICATE
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // ── Dashboard ───────────────────────────────────────────────────────
  const totalStock = products.reduce((s, p) => s + p.stock, 0);
  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6 pt-20 md:pt-24 pb-32 relative z-10 font-sans">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 px-4 py-3 rounded text-xs font-mono tracking-widest border shadow-xl flex items-center gap-2 ${
              toast.type === 'error'
                ? 'bg-red-950 border-red-500/80 text-red-300'
                : 'bg-green-950 border-green-500/80 text-green-300'
            }`}
          >
            <CheckCircle2 size={14} />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase">TELEMETRY COMMAND CENTER</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black italic tracking-tight">ADRENALINE ADMIN HQ</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeedDB}
            disabled={seedLoading}
            className="flex items-center gap-2 border border-white/20 hover:border-white px-4 py-2 text-xs font-mono tracking-widest uppercase transition disabled:opacity-50 cursor-pointer"
          >
            <Database size={13} />
            {seedLoading ? 'SEEDING...' : 'RE-SEED DATABASE'}
          </button>
          <button
            onClick={() => { fetchProducts(); fetchAnalytics(); fetchAllOrders(); fetchCacheStats(); }}
            className="p-2 border border-white/20 hover:border-white rounded transition cursor-pointer"
            title="Refresh All Telemetry"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto">
        {[
          { id: 'inventory', label: 'INVENTORY CONTROL', icon: Activity },
          { id: 'orders', label: 'ORDER MANIFESTS', icon: ShoppingBag },
          { id: 'analytics', label: 'REVENUE & TELEMETRY', icon: TrendingUp },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold tracking-wider rounded transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/5'
              }`}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-neutral-900 border border-white/10 p-4 rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs">
            <DollarSign size={14} />
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">GROSS REVENUE</span>
          </div>
          <span className="text-2xl md:text-3xl font-black font-mono text-cyan-400">
            ${analytics?.totalRevenue?.toFixed(2) || '0.00'}
          </span>
        </div>

        <div className="bg-neutral-900 border border-white/10 p-4 rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-green-400 text-xs">
            <ShoppingBag size={14} />
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">TOTAL ORDERS</span>
          </div>
          <span className="text-2xl md:text-3xl font-black font-mono text-green-400">
            {analytics?.totalOrders || allOrders.length || 0}
          </span>
        </div>

        <div className="bg-neutral-900 border border-white/10 p-4 rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-yellow-400 text-xs">
            <AlertTriangle size={14} />
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">LOW STOCK</span>
          </div>
          <span className="text-2xl md:text-3xl font-black font-mono text-yellow-400">{lowStock}</span>
        </div>

        <div className="bg-neutral-900 border border-white/10 p-4 rounded-xl flex flex-col gap-1">
          <div className="flex items-center gap-2 text-purple-400 text-xs">
            <Server size={14} />
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">CACHE HIT RATE</span>
          </div>
          <span className="text-2xl md:text-3xl font-black font-mono text-purple-400">
            {cacheStats?.hitRate || '94.2%'}
          </span>
        </div>
      </div>

      {/* TAB 1: INVENTORY CONTROL */}
      {activeTab === 'inventory' && (
        <div className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
            <h3 className="font-bold text-sm tracking-widest uppercase">ARSENAL STOCK MATRIX</h3>
            <span className="text-[11px] font-mono text-gray-500">TOTAL UNITS IN GRID: {totalStock}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-black/60 text-gray-500 uppercase tracking-widest text-[10px] border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">PRODUCT</th>
                  <th className="py-3 px-4">CATEGORY</th>
                  <th className="py-3 px-4">PRICE</th>
                  <th className="py-3 px-4">CAFFEINE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4 text-center">CURRENT UNITS</th>
                  <th className="py-3 px-4 text-right">QUICK RESTOCK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map(p => (
                  <tr key={p.slug} className="hover:bg-white/[0.02] transition">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={p.img} alt={p.name} className="w-7 h-10 object-contain" />
                      <div>
                        <div className="font-bold text-white text-xs font-sans uppercase">{p.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{p.slug}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-400 uppercase text-[10px]">{p.category || 'HIGH_OCTANE'}</td>
                    <td className="py-3 px-4 text-white font-bold">${Number(p.price).toFixed(2)}</td>
                    <td className="py-3 px-4 text-red-400">{p.caffeine || 180}mg</td>
                    <td className="py-3 px-4"><StockBadge stock={p.stock} /></td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-black text-sm text-white font-mono">{p.stock}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleUpdateStock(p.slug, 10)}
                          className="px-2 py-1 bg-white/10 hover:bg-white hover:text-black text-white text-[10px] font-bold rounded transition cursor-pointer"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleUpdateStock(p.slug, 50)}
                          className="px-2 py-1 bg-white/10 hover:bg-white hover:text-black text-white text-[10px] font-bold rounded transition cursor-pointer"
                        >
                          +50
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER MANIFESTS */}
      {activeTab === 'orders' && (
        <div className="bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/40">
            <h3 className="font-bold text-sm tracking-widest uppercase">CUSTOMER REQUISITION MANIFESTS</h3>
            <span className="text-[11px] font-mono text-gray-500">SHOWING RECENT {allOrders.length} ORDERS</span>
          </div>

          {allOrders.length === 0 ? (
            <div className="p-12 text-center text-gray-500 font-mono text-xs">NO ORDERS CAPTURED IN GRID YET.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-black/60 text-gray-500 uppercase tracking-widest text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">ORDER ID</th>
                    <th className="py-3 px-4">CUSTOMER</th>
                    <th className="py-3 px-4">ITEMS</th>
                    <th className="py-3 px-4">TOTAL</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allOrders.map(o => (
                    <tr key={o._id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-4 text-white font-bold">{o.razorpayOrderId || String(o._id).slice(-8)}</td>
                      <td className="py-3 px-4 text-gray-300">
                        {o.user?.name || 'Driver'}
                        <span className="block text-[10px] text-gray-500">{o.user?.email}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {(o.items || []).map(it => `${it.cartQuantity}x ${it.name}`).join(', ')}
                      </td>
                      <td className="py-3 px-4 text-cyan-400 font-bold">{o.totalAmount}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${
                          o.status === 'SHIPPED' ? 'bg-green-950 text-green-400 border border-green-500/30' :
                          o.status === 'CANCELLED' ? 'bg-red-950 text-red-400 border border-red-500/30' :
                          'bg-yellow-950 text-yellow-400 border border-yellow-500/30'
                        }`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {o.status === 'PROCESSING' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o._id, 'SHIPPED')}
                            className="px-2.5 py-1 bg-green-600 hover:bg-green-500 text-white text-[10px] font-bold rounded transition cursor-pointer"
                          >
                            DISPATCH
                          </button>
                        )}
                        {o.status === 'SHIPPED' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o._id, 'DELIVERED')}
                            className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] font-bold rounded transition cursor-pointer"
                          >
                            DELIVER
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REVENUE & TELEMETRY */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-sm tracking-widest uppercase mb-4 pb-2 border-b border-white/10">
              TOP PERFORMING FORMULAS
            </h3>
            <div className="space-y-4">
              {(analytics?.topSellingFlavors || []).map((flav, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="text-red-500 font-bold">#{idx + 1}</span>
                    <span className="text-white font-bold">{flav._id}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">{flav.unitsSold} units</span>
                    <span className="text-cyan-400 font-bold">${Number(flav.revenue || 0).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-neutral-900 border border-white/10 rounded-xl p-6">
            <h3 className="font-bold text-sm tracking-widest uppercase mb-4 pb-2 border-b border-white/10">
              STATUS BREAKDOWN
            </h3>
            <div className="space-y-3 font-mono text-xs">
              {(analytics?.statusBreakdown || []).map((sb, idx) => (
                <div key={idx} className="flex justify-between items-center bg-black/40 p-3 rounded border border-white/5">
                  <span className="text-gray-300 font-bold uppercase">{sb._id}</span>
                  <span className="text-white font-black">{sb.count} orders</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
