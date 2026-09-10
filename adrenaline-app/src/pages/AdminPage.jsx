import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, RefreshCw, TrendingUp, AlertTriangle, XCircle, Lock, Database } from 'lucide-react';

const ADMIN_PIN = 'ADRENALINE2026';
const API = 'http://localhost:5000';

function StockBadge({ stock }) {
  if (stock === 0) return <span className="px-2 py-0.5 text-[10px] font-black bg-red-900/60 text-red-400 rounded tracking-widest uppercase">Out of Stock</span>;
  if (stock <= 10) return <span className="px-2 py-0.5 text-[10px] font-black bg-yellow-900/60 text-yellow-400 rounded tracking-widest uppercase">Low Stock</span>;
  return <span className="px-2 py-0.5 text-[10px] font-black bg-green-900/60 text-green-400 rounded tracking-widest uppercase">In Stock</span>;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [seedLoading, setSeedLoading] = useState(false);
  const [editStock, setEditStock] = useState({}); // { slug: newStockValue }
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();
      setProducts(data);
      // Initialise edit values
      const initial = {};
      data.forEach(p => { initial[p.slug] = p.stock; });
      setEditStock(initial);
    } catch {
      showToast('Failed to fetch products. Is the backend running?', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authenticated) fetchProducts();
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
      const res = await fetch(`${API}/api/products/seed`, { method: 'POST' });
      if (res.ok) {
        showToast('Database seeded with all 8 flavors!');
        fetchProducts();
      } else {
        showToast('Seeding failed. Check backend auth.', 'error');
      }
    } catch {
      showToast('Network error — backend offline?', 'error');
    } finally {
      setSeedLoading(false);
    }
  };

  const handleUpdateStock = async (slug) => {
    const newStock = parseInt(editStock[slug], 10);
    if (isNaN(newStock) || newStock < 0) return showToast('Invalid stock value', 'error');
    try {
      const res = await fetch(`${API}/api/products/${slug}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: newStock }),
      });
      if (res.ok) {
        showToast(`${slug.toUpperCase()} stock updated to ${newStock}`);
        fetchProducts();
      } else {
        showToast('Update failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  };

  // ── PIN Gate ────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 relative z-10 min-h-[calc(100dvh-80px)]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm bg-neutral-900 border border-white/10 p-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900" />
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/40 flex items-center justify-center">
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
              placeholder="ENTER ADMIN PIN"
              className={`w-full bg-black/50 border px-4 py-3 focus:outline-none transition tracking-widest text-sm font-mono ${
                pinError ? 'border-red-500 text-red-400' : 'border-white/10 focus:border-red-600'
              }`}
            />
            {pinError && <p className="text-red-500 text-xs font-mono tracking-widest">INVALID ACCESS CODE</p>}
            <button className="w-full bg-red-600 hover:bg-white text-white hover:text-black transition py-3 font-black italic tracking-widest">
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
    <div className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-6 pt-20 md:pt-24 pb-32 relative z-10">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-[200] px-6 py-3 font-mono text-sm tracking-widest border ${
              toast.type === 'error' ? 'bg-red-900/90 border-red-500 text-red-300' : 'bg-green-900/90 border-green-500 text-green-300'
            }`}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8 border-b border-white/10 pb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-500 mb-2">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-mono tracking-widest uppercase">Admin Control Panel</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black italic uppercase">
              Inventory <span className="text-red-500">Matrix</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">Live stock telemetry for all 8 Adrenaline fuel cells.</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={fetchProducts}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 text-xs font-bold tracking-widest transition"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              REFRESH
            </button>
            <button
              onClick={handleSeedDB}
              disabled={seedLoading}
              className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600 border border-red-600/50 text-red-400 hover:text-white px-4 py-2 text-xs font-bold tracking-widest transition disabled:opacity-50"
            >
              <Database size={14} />
              {seedLoading ? 'SEEDING...' : 'SEED DB'}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Units', value: totalStock, icon: TrendingUp, color: 'text-cyan-400' },
          { label: 'Low Stock', value: lowStock, icon: AlertTriangle, color: 'text-yellow-400' },
          { label: 'Out of Stock', value: outOfStock, icon: XCircle, color: 'text-red-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-neutral-900 border border-white/10 p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Icon size={14} className={color} />
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">{label}</span>
            </div>
            <span className={`text-2xl md:text-3xl font-black font-mono ${color}`}>{value}</span>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20 text-gray-500 font-mono tracking-widest animate-pulse">
          LOADING TELEMETRY...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-neutral-950 border border-white/5">
          <p className="text-gray-500 font-mono tracking-widest mb-4">NO PRODUCTS IN DATABASE</p>
          <p className="text-gray-600 text-xs">Click <span className="text-red-500 font-bold">SEED DB</span> to initialize the 8 Adrenaline flavors.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-neutral-900 border p-4 flex flex-col gap-4 ${
                product.stock === 0 ? 'border-red-900/50' :
                product.stock <= 10 ? 'border-yellow-900/50' :
                'border-white/10'
              }`}
            >
              {/* Can preview */}
              <div className="flex items-center gap-3">
                <img src={product.img} alt={product.name} className="w-8 h-16 object-contain" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-black italic text-sm uppercase truncate">{product.name}</h3>
                  <p className="text-gray-500 text-[10px] line-clamp-1">{product.desc}</p>
                  <StockBadge stock={product.stock} />
                </div>
              </div>

              {/* Stock editor */}
              <div className="border-t border-white/5 pt-3 flex flex-col gap-2">
                <label className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Stock Qty</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditStock(s => ({ ...s, [product.slug]: Math.max(0, (s[product.slug] ?? product.stock) - 1) }))}
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center font-bold text-lg transition"
                  >−</button>
                  <input
                    type="number"
                    min="0"
                    value={editStock[product.slug] ?? product.stock}
                    onChange={e => setEditStock(s => ({ ...s, [product.slug]: parseInt(e.target.value) || 0 }))}
                    className="flex-1 bg-black/50 border border-white/10 px-2 py-1 text-center font-mono text-sm focus:outline-none focus:border-red-500 transition"
                  />
                  <button
                    onClick={() => setEditStock(s => ({ ...s, [product.slug]: (s[product.slug] ?? product.stock) + 1 }))}
                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center font-bold text-lg transition"
                  >+</button>
                </div>
                <button
                  onClick={() => handleUpdateStock(product.slug)}
                  className="w-full bg-red-600/20 hover:bg-red-600 border border-red-600/40 text-red-400 hover:text-white py-2 text-[10px] font-black tracking-widest transition"
                >
                  UPDATE STOCK
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
