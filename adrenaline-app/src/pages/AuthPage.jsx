import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, Loader2, LogOut, CheckCircle2, User } from 'lucide-react';
import { API_BASE, setAuth, getUser, clearAuth } from '../utils/auth';

export default function AuthPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getUser());
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const handleAuthChange = () => setCurrentUser(getUser());
    window.addEventListener('adrenaline_auth_change', handleAuthChange);
    return () => window.removeEventListener('adrenaline_auth_change', handleAuthChange);
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Form validation
    if (!formData.email || !formData.password) {
      setError('Please provide all required credentials.');
      return;
    }
    if (!isSignIn && !formData.name) {
      setError('Please enter your callsign (name).');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSignIn ? `${API_BASE}/api/auth/login` : `${API_BASE}/api/auth/register`;
      const payload = isSignIn 
        ? { email: formData.email, password: formData.password }
        : { name: formData.name, email: formData.email, password: formData.password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication sequence failed.');
      }

      // Save token and user details
      setAuth(data.token, data.user);
      setSuccess(isSignIn ? 'TELEMETRY VERIFIED. WELCOME BACK, DRIVER.' : 'PROFILE CREATED. ACCESS GRANTED.');
      
      setTimeout(() => {
        navigate('/');
      }, 1200);

    } catch (err) {
      setError(err.message || 'Unable to communicate with Adrenaline HQ.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    setSuccess('SESSION TERMINATED. DRIVER LOGGED OUT.');
    setTimeout(() => setSuccess(''), 2500);
  };

  // If already authenticated and not showing just-logged-out state
  if (currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 relative z-10 min-h-[calc(100vh-80px)]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-neutral-900 border border-white/10 p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-cyan-500" />
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center text-green-400">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="text-[10px] font-mono tracking-widest text-green-400 uppercase">AUTHENTICATED DRIVER</span>
              <h2 className="text-2xl font-black italic uppercase text-white">{currentUser.name}</h2>
            </div>
          </div>

          <div className="bg-black/60 border border-white/5 p-4 mb-6 font-mono text-xs space-y-2">
            <div className="flex justify-between text-gray-400">
              <span>CALLSIGN:</span>
              <span className="text-white font-bold">{currentUser.name}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>LOGON EMAIL:</span>
              <span className="text-white font-bold">{currentUser.email}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>SECURITY STATUS:</span>
              <span className="text-green-400 font-bold">JWT_TOKEN_ACTIVE</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link 
              to="/#products"
              className="w-full bg-red-600 hover:bg-white text-white hover:text-black transition py-3 font-black italic tracking-widest text-center text-sm"
            >
              CONTINUE TO PIT LANE
            </Link>
            <Link 
              to="/address"
              className="w-full bg-white/10 hover:bg-white text-white hover:text-black transition py-3 font-bold tracking-widest text-center text-xs"
            >
              DROP ZONE ADDRESSES
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition py-3 font-bold tracking-widest text-xs flex items-center justify-center gap-2 mt-2"
            >
              <LogOut size={14} />
              DISENGAGE PROFILE (LOG OUT)
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center p-6 relative z-10 min-h-[calc(100vh-80px)]">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md bg-neutral-900 border border-white/10 p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-red-900" />
        
        <h2 className="text-2xl md:text-3xl font-black italic uppercase mb-2">
          {isSignIn ? 'Welcome Back.' : 'Join the Elite.'}
        </h2>
        <p className="text-gray-400 text-xs md:text-sm mb-6 leading-relaxed">
          {isSignIn ? 'Enter your telemetry data to authenticate.' : 'Register new driver telemetry and generate JWT key.'}
        </p>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-2"
            >
              <AlertCircle size={16} className="text-red-400 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }}
              className="mb-4 p-3 bg-green-950/60 border border-green-500/50 text-green-300 text-xs font-mono flex items-center gap-2"
            >
              <CheckCircle2 size={16} className="text-green-400 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          {!isSignIn && (
            <div>
              <label className="block text-[10px] font-mono tracking-widest text-gray-400 mb-1">CALLSIGN (FULL NAME)</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Max Verstappen" 
                disabled={loading}
                className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-red-600 transition tracking-wider text-sm disabled:opacity-50"
              />
            </div>
          )}
          
          <div>
            <label className="block text-[10px] font-mono tracking-widest text-gray-400 mb-1">DRIVER LOGON (EMAIL)</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="driver@adrenaline.io" 
              disabled={loading}
              className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-red-600 transition tracking-wider text-sm disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono tracking-widest text-gray-400 mb-1">SECURITY KEY (PASSWORD)</label>
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••" 
              disabled={loading}
              className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-red-600 transition tracking-wider text-sm disabled:opacity-50"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-white text-white hover:text-black transition py-4 font-black italic tracking-widest mt-2 flex justify-center items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                TRANSMITTING TELEMETRY...
              </>
            ) : (
              isSignIn ? 'INITIALIZE LAUNCH' : 'CREATE PROFILE & RECEIVE KEY'
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-500 tracking-wider">
          {isSignIn ? "Don't have a profile? " : "Already registered? "}
          <button 
            type="button"
            onClick={() => {
              setIsSignIn(!isSignIn);
              setError('');
              setSuccess('');
            }}
            className="text-white hover:text-red-500 font-bold transition uppercase ml-1 cursor-pointer"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
