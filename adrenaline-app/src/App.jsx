import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gauge, Wind, ShoppingCart, X, User, Instagram, Twitter } from 'lucide-react';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import AddressPage from './pages/AddressPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import HelpSupportPage from './pages/HelpSupportPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsConditionPage from './pages/TermsConditionPage';
import ScrollToTop from './components/ScrollToTop';
import AgentWidget from './components/AgentWidget';

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
  const rawTotal = cart.reduce((sum, item) => sum + (parseFloat(item.price.replace('$', '')) * item.cartQuantity), 0);
  const totalStr = '$' + rawTotal.toFixed(2);

  const handlePayment = async () => {
    const res = await loadRazorpayScript();
    
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // Convert $ back to approximately INR for the dummy checkout display (using ~83 multiplier)
    const amountInINR = Math.round(rawTotal * 83);

    const options = {
      key: 'rzp_test_DUMMY123456789', // Dummy Test Key
      amount: amountInINR * 100, // Amount in paise
      currency: 'INR',
      name: 'ADRENALINE INC.',
      description: 'Fuel Purchase Transaction',
      image: '/can-cranberry.png', // Placeholder logo
      handler: function (response) {
        // Mock Success
        alert(`Payment Successful! \nPayment ID: ${response.razorpay_payment_id}\nYour fuel is being prepped for launch.`);
        setOrders(prev => [{ id: Date.now().toString().slice(-6), date: new Date().toISOString(), status: 'PROCESSING', total: totalStr, items: [...cart] }, ...prev]);
        setCart([]); // Clear Cart
        onClose(); // Close Modal
      },
      prefill: {
        name: 'Guest Driver',
        email: 'driver@adrenaline.test',
        contact: '9999999999'
      },
      theme: {
        color: '#dc2626' // Matches text-red-600
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
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
            className="bg-neutral-900 border border-white/10 p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
              <X />
            </button>
            <h2 className="text-4xl font-black italic uppercase mb-8 text-white">YOUR <span className="text-red-500">CART</span></h2>
            
            {cart.length === 0 ? (
              <div className="text-center py-12 text-gray-500 italic">No fuel in cart. Hit the pit lane.</div>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map(f => (
                  <div key={f.id} className="flex justify-between items-center p-4 bg-black/50 border border-white/5 hover:border-red-500/50 transition group">
                    <div className="flex items-center gap-4">
                      <img src={f.img} alt={f.name} className="w-12 h-24 object-contain" />
                      <div>
                        <h3 className="font-bold text-lg">{f.name}</h3>
                        <p className="text-sm text-gray-500">{f.desc}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3">
                        <button onClick={() => updateCartQuantity(f.id, -1)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">-</button>
                        <span className="font-mono text-xl w-6 text-center">{f.cartQuantity}</span>
                        <button onClick={() => updateCartQuantity(f.id, 1)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center">+</button>
                      </div>
                      <span className="font-mono text-xl w-20 text-right mr-4">${(parseFloat(f.price.replace('$','')) * f.cartQuantity).toFixed(2)}</span>
                      <button 
                        onClick={() => removeFromCart(f.id)}
                        className="bg-white/10 text-white p-2 rounded-full hover:bg-red-500 transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 pt-8 border-t border-white/10 flex justify-between items-center">
              <div>
                <span className="text-gray-500 block text-xs">Total</span>
                <span className="text-3xl font-mono font-bold">{totalStr}</span>
              </div>
              <button 
                onClick={handlePayment}
                className={`px-8 py-4 font-black text-xl skew-x-[-12deg] transition ${cart.length > 0 ? 'bg-red-600 text-white hover:bg-white hover:text-black' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                disabled={cart.length === 0}
              >
                <span className="skew-x-[12deg] block">CHECKOUT</span>
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
  const [isBuyMenuOpen, setIsBuyMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isAntigravityOn, setIsAntigravityOn] = useState(true);

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
        <div className="w-full mx-auto px-6 md:px-16 py-6 flex justify-between items-center relative z-50">
          <Link to="/" className="hover:opacity-80 transition">
            <h1 className="text-3xl font-black italic tracking-tighter">ADRENALINE</h1>
          </Link>
          <div className="flex gap-8 font-bold uppercase text-sm tracking-widest items-center relative z-50">
          <Link to="/" className="hover:text-red-500 transition">Pit Lane (Products)</Link>
          <a href="#" className="hover:text-red-500 transition">Telemetry</a>
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
                  <Link to="/auth" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-6 py-4 border-b border-white/5 hover:bg-white/5 transition text-red-500 font-black tracking-widest text-xs">
                    Sign In / Sign Up
                  </Link>
                  <Link to="/address" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-6 py-3 hover:bg-white/5 transition text-gray-300 hover:text-white text-xs tracking-wider">
                    Your Address
                  </Link>
                  <Link to="/orders" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-6 py-3 hover:bg-white/5 transition text-gray-300 hover:text-white text-xs tracking-wider">
                    Order History
                  </Link>
                  <Link to="/support" onClick={() => setIsProfileMenuOpen(false)} className="flex items-center px-6 py-3 border-t border-white/5 hover:bg-white/5 transition text-gray-300 hover:text-white text-xs tracking-wider">
                    Help & Support
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
        </div>
        </div>
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
      <div className="fixed bottom-0 w-full z-30 p-4 border-t border-white/10 bg-black/80 flex justify-around items-center">
        <div className="flex items-center gap-4">
          <Gauge className="text-red-500" />
          <div>
            <div className="text-[10px] text-gray-500">ENGINE STATUS</div>
            <div className="font-mono text-xs text-green-400">OPTIMAL_READY</div>
          </div>
        </div>
        <div className="h-8 w-[1px] bg-white/10" />
        <div 
          className="flex items-center gap-4 cursor-pointer hover:bg-white/5 p-2 rounded transition"
          onClick={() => setIsAntigravityOn(!isAntigravityOn)}
        >
          <Wind className={isAntigravityOn ? "text-cyan-400" : "text-gray-500"} />
          <div>
            <div className="text-[10px] text-gray-500">AERODYNAMICS</div>
            <div className={`font-mono text-xs uppercase transition-colors ${isAntigravityOn ? "text-cyan-400" : "text-gray-500"}`}>
              Antigravity Mode: {isAntigravityOn ? 'ON' : 'OFF'}
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
      <AgentWidget />
    </div>
    </Router>
  );
}
