import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Truck, AlertCircle, RefreshCw, XCircle, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_BASE, getAuthHeader, getToken } from '../utils/auth';

export default function OrderHistoryPage({ orders: propOrders = [], setOrders: setPropOrders }) {
  const token = getToken();
  const [dbOrders, setDbOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        headers: getAuthHeader(),
      });
      if (res.ok) {
        const data = await res.json();
        setDbOrders(data);
      }
    } catch (err) {
      console.error('Failed to load orders telemetry:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // Combine DB orders with local prop orders
  const displayOrders = token && dbOrders.length > 0 
    ? dbOrders 
    : propOrders.map(o => ({
        _id: o.id,
        razorpayOrderId: o.id,
        createdAt: o.date,
        status: o.status,
        totalAmount: o.total,
        items: o.items,
      }));

  const filteredOrders = displayOrders.filter(o => {
    if (filterStatus === 'ALL') return true;
    return o.status === filterStatus;
  });

  const handleUpdateStatus = async (orderId, newStatus) => {
    setActionLoading(orderId);
    try {
      if (token && !String(orderId).startsWith('ord_mock')) {
        const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify({ status: newStatus }),
        });
        if (res.ok) {
          fetchOrders();
        }
      } else if (setPropOrders) {
        setPropOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-6 pt-24 pb-32 relative z-10 min-h-[calc(100vh-80px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 border-b border-white/10 pb-6 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase">Shipment <span className="text-red-500">Telemetry</span></h2>
          <p className="text-gray-400 text-sm md:text-base mt-2">Track real-time deployments, manifests, and logistics coordinates.</p>
        </div>
        
        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-2">
          {['ALL', 'PROCESSING', 'SHIPPED', 'CANCELLED'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 text-xs font-mono font-bold tracking-wider rounded transition cursor-pointer ${
                filterStatus === st 
                  ? 'bg-red-600 text-white' 
                  : 'bg-white/5 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {!token && (
        <div className="mb-8 p-4 bg-yellow-950/40 border border-yellow-500/30 flex items-center justify-between gap-4 text-xs">
          <div className="text-yellow-400">
            <strong>GUEST MODE:</strong> Showing session order log. Sign in to synchronize your persistent order manifests with Adrenaline HQ.
          </div>
          <Link to="/auth" className="bg-yellow-500 text-black px-4 py-1.5 font-bold uppercase tracking-wider hover:bg-white transition shrink-0">
            Sign In with JWT
          </Link>
        </div>
      )}

      {loading ? (
        <div className="text-center py-24 flex flex-col items-center gap-3">
          <RefreshCw size={24} className="animate-spin text-red-500" />
          <p className="font-mono text-xs text-gray-500 tracking-widest">QUERYING SATELLITE MANIFEST...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-20 bg-neutral-950 border border-white/5 rounded-xl">
          <Package size={36} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 font-mono tracking-widest text-sm">NO SHIPMENT LOGS FOUND.</p>
          <p className="text-gray-600 text-xs mt-1">Acquire fuel from the Pit Lane to initiate telemetry tracking.</p>
          <Link to="/#products" className="inline-block mt-4 bg-red-600 hover:bg-white text-white hover:text-black px-6 py-2.5 font-black italic tracking-widest text-xs transition rounded">
            ENTER PIT LANE
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              key={order._id || order.id}
              className="bg-neutral-900 border border-white/10 p-6 flex flex-col md:flex-row gap-6 relative rounded-xl overflow-hidden shadow-xl"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs text-gray-400 font-mono mb-1 tracking-wider">
                      MANIFEST #{order.razorpayOrderId || String(order._id).slice(-8)}
                    </div>
                    <div className="font-bold text-lg text-white">
                      {new Date(order.createdAt || order.date || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className={`px-3 py-1 text-[11px] font-black tracking-widest rounded uppercase ${
                    order.status === 'CANCELLED' || order.status === 'REFUNDED'
                      ? 'bg-red-950 text-red-400 border border-red-500/40' 
                      : order.status === 'SHIPPED' 
                        ? 'bg-green-950 text-green-400 border border-green-500/40' 
                        : 'bg-yellow-950 text-yellow-400 border border-yellow-500/40'
                  }`}>
                    {order.status}
                  </div>
                </div>
                
                <div className="space-y-2 mb-6 bg-black/50 p-4 rounded-lg border border-white/5">
                  {(order.items || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm text-gray-300">
                      <div className="flex items-center gap-3">
                        {item.img && <img src={item.img} alt={item.name} className="w-8 h-10 object-contain" />}
                        <span className="font-bold">{item.cartQuantity || 1}x {item.name}</span>
                      </div>
                      <span className="font-mono text-white">{item.price}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <span className="text-xs text-gray-500 font-mono uppercase tracking-wider block">REQUISITION TOTAL</span>
                    <span className="font-black text-2xl text-white font-mono">{order.totalAmount}</span>
                  </div>

                  {order.status === 'PROCESSING' && (
                    <div className="flex gap-3">
                      <button 
                        onClick={() => handleUpdateStatus(order._id || order.id, 'CANCELLED')}
                        disabled={actionLoading === (order._id || order.id)}
                        className="border border-red-500/50 hover:bg-red-600 hover:text-white text-red-400 px-4 py-2 font-bold tracking-wider text-xs transition rounded cursor-pointer disabled:opacity-50"
                      >
                        {actionLoading === (order._id || order.id) ? 'UPDATING...' : 'CANCEL DEPLOYMENT'}
                      </button>
                    </div>
                  )}

                  {order.status === 'SHIPPED' && (
                    <button 
                      onClick={() => handleUpdateStatus(order._id || order.id, 'RETURN_REQUESTED')}
                      disabled={actionLoading === (order._id || order.id)}
                      className="border border-white/20 hover:bg-white hover:text-black text-gray-300 px-4 py-2 font-bold tracking-wider text-xs transition rounded cursor-pointer disabled:opacity-50"
                    >
                      REQUEST RETURN (48H REPLACEMENT)
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
