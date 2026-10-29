import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Wind, ShoppingCart, X, User, Instagram, Twitter } from 'lucide-react';
import { getUser, clearAuth } from './utils/auth';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AddressPage from './pages/AddressPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import HelpSupportPage from './pages/HelpSupportPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionPage from './pages/TermsConditionPage';
import ScrollToTop from './components/ScrollToTop';
import AgentWidget from './components/AgentWidget';
import AdminPage from './pages/AdminPage';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

function BuyModal({ isOpen, onClose, cart, setCart, removeFromCart, updateCartQuantity, setOrders }) {
  const [checkoutError, setCheckoutError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const rawTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace('$', '')) * item.cartQuantity), 0);
  const totalStr = '$' + rawTotal.toFixed(2);

  const handlePayment = async () => {
    setCheckoutError('');
    setIsProcessing(true);
    const token = getToken();

    // If user is authenticated, call server-side atomic reservation & verification
    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/orders/checkout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader()
          },
          body: JSON.stringify({
            items: cart,
            paymentId: `pay_auth_${Date.now()}`
          })
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Checkout denied by Adrenaline HQ.');
        }

        setOrders(prev => [data.order, ...prev]);
        setCart([]);
        onClose();
        alert(`Fuel Requisition Confirmed!\nManifest: ${data.order.razorpayOrderId}\nStatus: PROCESSING. Stock deducted atomically.`);
        return;
      } catch (err) {
        setCheckoutError(err.message);
        setIsProcessing(false);
        return;
      }
    }

    // Guest checkout fallback with persistent prompt
    const mockOrder = { 
      id: 'ord_guest_' + Date.now().toString().slice(-6), 
      date: new Date().toISOString(), 
      status: 'PROCESSING', 
      total: totalStr, 
      items: [...cart] 
    };
    setOrders(prev => [mockOrder, ...prev]);
    setCart([]);
    onClose();
    alert(`Guest Checkout Completed!\nSession Manifest: ${mockOrder.id}\nTip: Sign in with your driver profile to save orders permanently to Adrenaline HQ.`);
    setIsProcessing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 50 }}
            className="bg-neutral-900 border border-white/10 p-4 md:p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto rounded-xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition z-10 p-1 hover:bg-white/10 rounded-full cursor-pointer">
              <X />
            </button>
            <h2 className="text-2xl md:text-4xl font-black italic uppercase mb-6 text-white">YOUR <span className="text-red-500">CART</span></h2>
            
            {checkoutError && (
              <div className="mb-6 p-4 bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-mono rounded">
                ⚠️ {checkoutError}
              </div>
            )}

            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500 italic">No fuel in cart. Hit the pit lane.</div>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map(f => (
                  <div key={f.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-black/50 border border-white/5 hover:border-red-500/50 transition group gap-4 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img src={f.img} alt={f.name} className="w-10 h-20 md:w-12 md:h-24 object-contain" />
                      <div>
                        <h3 className="font-bold text-base md:text-lg uppercase italic">{f.name}</h3>
                        <p className="text-[10px] md:text-sm text-gray-500 line-clamp-1">{f.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 md:gap-6">
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateCartQuantity(f.id, -1)} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer">-</button>
                        <span className="font-mono text-lg md:text-xl w-6 text-center">{f.cartQuantity}</span>
                        <button onClick={() => updateCartQuantity(f.id, 1)} className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer">+</button>
                      </div>
                      <span className="font-mono text-lg md:text-xl w-20 text-right mr-2 md:mr-4">${(parseFloat(f.price.replace('$','')) * f.cartQuantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(f.id)}
                        className="bg-white/10 text-white p-2 rounded-full hover:bg-red-500 transition cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
              <div>
                <span className="text-gray-500 block text-xs font-mono uppercase tracking-widest">Calculated Subtotal</span>
                <span className="text-3xl font-mono font-bold text-white">{totalStr}</span>
              </div>
              <button 
                onClick={handlePayment}
                disabled={cart.length === 0 || isProcessing}
                className={`px-8 py-4 font-black text-lg md:text-xl skew-x-[-12deg] transition cursor-pointer ${
                  cart.length > 0 && !isProcessing
                    ? 'bg-red-600 text-white hover:bg-white hover:text-black shadow-[0_0_20px_rgba(220,38,38,0.5)]' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <span className="skew-x-[12deg] block">
                  {isProcessing ? 'RESERVING FUEL...' : 'CONFIRM ORDER'}
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ProductCard component was moved to HomePage.jsx

export default function App() {
  const [currentUser, setCurrentUser] = useState(getUser());
  const [isBuyMenuOpen, setIsBuyMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isAntigravityOn, setIsAntigravityOn] = useState(true);

  useEffect(() => {
    const syncUser = () => setCurrentUser(getUser());
    window.addEventListener('adrenaline_auth_change', syncUser);
    return () => window.removeEventListener('adrenaline_auth_change', syncUser);
  }, []);

  const cartTotalItems = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

  const addToCart = (product, quantity) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + quantity } : item);
      }
      return [...prev, { ...product, cartQuantity: quantity }];
    });
  };

  const updateCartQuantity = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQ = Math.max(1, item.cartQuantity + delta);
        return { ...item, cartQuantity: newQ };
      }
      return item;
    }));
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(c => c.id !== productId));
  };

  return (
    <Router>
      <ScrollToTop />
    <div className="w-full bg-black text-white overflow-x-hidden font-sans relative flex flex-col min-h-screen">
      {/* Global Looping MP4 Video Background */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="fixed inset-0 w-full h-full object-cover z-0 opacity-60 pointer-events-none"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* No need to overlay hero background here since we moved it into the Hero Container */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="w-full mx-auto px-4 sm:px-6 md:px-16 py-4 md:py-6 flex justify-between items-center relative z-50">
          <Link to="/" className="hover:opacity-80 transition">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black italic tracking-tighter">ADRENALINE</h1>
          </Link>
          <div className="hidden md:flex gap-8 font-bold uppercase text-sm tracking-widest items-center relative z-50">
            <a href="/#products" className="hover:text-red-500 transition">Pit Lane (Products)</a>
            <a href="#" className="hover:text-red-500 transition">Telemetry</a>
            <Link to="/admin" className="text-yellow-500 hover:text-yellow-400 transition">Admin Panel</Link>
            <button 
              onClick={() => setIsBuyMenuOpen(true)}
              className="flex items-center gap-2 bg-neutral-900 border border-white/10 px-6 py-2 hover:bg-red-600 transition hover:border-red-600 rounded-full"
            >
              <ShoppingCart size={18} />
              <span className="font-bold relative flex items-center justify-center">
                CART
                {cartTotalItems > 0 && (
                  <span className="absolute -top-3 -right-6 bg-white text-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black">
                    {cartTotalItems}
                  </span>
                )}
              </span>
            </button>
            
            {/* Profile Dropdown Menu */}
            <div className="relative">
              <button 
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center justify-center w-10 h-10 bg-neutral-900 border border-white/10 hover:bg-white/10 transition rounded-full"
              >
                <User size={18} />
              </button>
              
              <AnimatePresence>
                {isProfileMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-4 w-56 bg-neutral-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50 flex flex-col"
                  >
                    {currentUser ? (
                      <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                        <div className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">DRIVER ACTIVE</div>
                        <div className="text-white font-bold text-xs truncate mt-0.5">{currentUser.name}</div>
                        <div className="text-gray-500 text-[10px] truncate">{currentUser.email}</div>
                      </div>
                    ) : (
                      <Link to="/auth" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-6 py-4 border-b border-white/5 hover:bg-white/5 transition text-red-500 font-black tracking-widest text-xs">
                        Sign In / Sign Up
                      </Link>
                    )}
                    <Link to="/address" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-6 py-3 hover:bg-white/5 transition text-gray-300 hover:text-white text-xs tracking-wider">
                      Your Address
                    </Link>
                    <Link to="/orders" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-6 py-3 hover:bg-white/5 transition text-gray-300 hover:text-white text-xs tracking-wider">
                      Order History
                    </Link>
                    <Link to="/support" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-6 py-3 border-t border-white/5 hover:bg-white/5 transition text-gray-300 hover:text-white text-xs tracking-wider">
                      Help & Support
                    </Link>
                    <Link to="/admin" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-6 py-3 border-t border-white/5 hover:bg-white/5 transition text-yellow-500 hover:text-yellow-400 text-xs tracking-wider font-bold">
                      Admin Panel
                    </Link>
                    {currentUser && (
                      <button 
                        onClick={() => {
                          clearAuth();
                          setIsProfileMenuOpen(false);
                        }}
                        className="flex items-center px-6 py-3 border-t border-white/5 hover:bg-red-500/10 transition text-red-400 hover:text-red-300 text-xs tracking-wider text-left font-bold cursor-pointer"
                      >
                        Sign Out
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <button onClick={() => setIsBuyMenuOpen(true)} className="relative p-2">
              <ShoppingCart size={24} />
              {cartTotalItems > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold px-1">{cartTotalItems}</span>}
            </button>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
              <Gauge size={24} className={isMobileMenuOpen ? "text-red-500" : "text-white"} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-black border-t border-white/10 overflow-hidden"
            >
              <div className="flex flex-col p-6 gap-6 font-bold uppercase tracking-[0.2em] text-sm">
                <a href="/#products" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-red-500">Pit Lane</a>
                {currentUser ? (
                  <div className="border-b border-white/10 pb-4">
                    <div className="text-[10px] font-mono text-cyan-400">DRIVER ACTIVE</div>
                    <div className="text-white font-bold text-sm">{currentUser.name}</div>
                    <button 
                      onClick={() => {
                        clearAuth();
                        setIsMobileMenuOpen(false);
                      }} 
                      className="text-red-400 hover:text-white text-xs uppercase tracking-wider mt-2 font-bold cursor-pointer block"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)} className="text-red-500">Authentication</Link>
                )}
                <Link to="/address" onClick={() => setIsMobileMenuOpen(false)}>Addresses</Link>
                <Link to="/orders" onClick={() => setIsMobileMenuOpen(false)}>Orders</Link>
                <Link to="/support" onClick={() => setIsMobileMenuOpen(false)}>Support</Link>
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-yellow-500">Admin Panel</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative z-10 flex-1 flex flex-col pt-16 mb-24">
        <Routes>
          <Route path="/" element={<HomePage isAntigravityOn={isAntigravityOn} addToCart={addToCart} />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/address" element={<AddressPage />} />
          <Route path="/orders" element={<OrderHistoryPage orders={orders} setOrders={setOrders} />} />
          <Route path="/support" element={<HelpSupportPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsConditionPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>

        {/* Global Footer */}
        <footer className="w-full px-6 md:px-16 py-6 border-t border-white/10 mt-4 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400 text-sm relative z-20 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="font-black italic text-white uppercase tracking-widest text-lg">Adrenaline</span>
            <span>© 2026. All rights reserved.</span>
          </div>
          <div className="flex gap-6 uppercase tracking-widest font-bold text-xs">
            <Link to="/privacy" className="hover:text-red-500 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-red-500 transition">Terms & Conditions</Link>
          </div>
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-red-500 transition"><Instagram size={20} /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-red-500 transition"><Twitter size={20} /></a>
          </div>
        </footer>
      </main>

      {/* Bottom Telemetry Bar */}
      <div className="fixed bottom-0 w-full z-30 p-4 border-t border-white/10 bg-black/80 flex flex-wrap justify-around items-center gap-4">
        <div className="flex items-center gap-4">
          <Gauge className="text-red-500 flex-shrink-0" />
          <div className="whitespace-nowrap">
            <div className="text-[10px] text-gray-500">ENGINE STATUS</div>
            <div className="font-mono text-xs text-green-400">OPTIMAL_READY</div>
          </div>
        </div>
        <div className="hidden sm:block h-8 w-[1px] bg-white/10" />
        <div 
          className="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-2 rounded transition"
          onClick={() => setIsAntigravityOn(!isAntigravityOn)}
        >
          <Wind className={isAntigravityOn ? "text-cyan-400 flex-shrink-0" : "text-gray-500 flex-shrink-0"} />
          <div className="whitespace-nowrap">
            <div className="text-[10px] text-gray-500 uppercase">Aerodynamics</div>
            <div className={`font-mono text-[10px] sm:text-xs uppercase transition-colors ${isAntigravityOn ? "text-cyan-400" : "text-gray-500"}`}>
              {isAntigravityOn ? 'Antigravity ON' : 'Antigravity OFF'}
            </div>
          </div>
        </div>
      </div>
      
      <BuyModal 
        isOpen={isBuyMenuOpen} 
        onClose={() => setIsBuyMenuOpen(false)} 
        cart={cart} 
        setCart={setCart}
        removeFromCart={removeFromCart} 
        updateCartQuantity={updateCartQuantity}
        setOrders={setOrders}
      />
      <AgentWidget addToCart={addToCart} />
    </div>
    </Router>
  );
}
