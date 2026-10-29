import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Trash2, Plus, AlertCircle, Loader2 } from 'lucide-react';
import { API_BASE, getToken, getUser } from '../utils/auth';

export default function AddressPage() {
  const token = getToken();
  const user = getUser();
  const [addresses, setAddresses] = useState([
    { _id: 'local-1', name: user?.name || 'Guest Driver', street: '123 Apex Corner', city: 'Monaco', state: 'MC', postalCode: '98000', country: 'Monaco', isDefault: true }
  ]);
  
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', state: '', postalCode: '', country: 'Monaco' });
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch addresses if authenticated
  useEffect(() => {
    if (!token) return;

    const fetchAddresses = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/addresses`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setAddresses(data);
          }
        }
      } catch (err) {
        console.error('Failed to load telemetry coordinates', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [token]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city) return;
    setError('');

    if (token) {
      try {
        const res = await fetch(`${API_BASE}/api/addresses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            street: newAddress.street,
            city: newAddress.city,
            state: newAddress.state,
            postalCode: newAddress.postalCode,
            country: newAddress.country || 'Global'
          })
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to lock coordinates.');
        }

        const saved = await res.json();
        setAddresses(prev => [saved, ...prev]);
        setNewAddress({ name: '', street: '', city: '', state: '', postalCode: '', country: 'Monaco' });
        setIsAdding(false);
        return;
      } catch (err) {
        setError(err.message);
      }
    }

    // Local fallback if guest
    setAddresses(prev => [
      ...prev, 
      { 
        _id: `local-${Date.now()}`, 
        name: newAddress.name || user?.name || 'Driver',
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        postalCode: newAddress.postalCode,
        country: newAddress.country || 'Monaco',
        isDefault: prev.length === 0 
      }
    ]);
    setNewAddress({ name: '', street: '', city: '', state: '', postalCode: '', country: 'Monaco' });
    setIsAdding(false);
  };

  const handleDelete = async (id) => {
    if (token && !String(id).startsWith('local-')) {
      try {
        await fetch(`${API_BASE}/api/addresses/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Error removing address', err);
      }
    }
    setAddresses(prev => prev.filter(a => a._id !== id));
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-6 pt-24 pb-32 relative z-10 min-h-[calc(100vh-80px)]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 border-b border-white/10 pb-6 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase">Shipping <span className="text-cyan-500">Telemetry</span></h2>
          <p className="text-gray-400 text-sm md:text-base mt-2">Manage your fuel supply drop coordinates.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="w-full sm:w-auto bg-white/10 hover:bg-white text-white hover:text-black px-6 py-2 font-bold tracking-widest text-sm transition cursor-pointer"
        >
          {isAdding ? 'CANCEL' : '+ NEW DROP ZONE'}
        </button>
      </div>

      {!token && (
        <div className="mb-8 p-4 bg-yellow-950/40 border border-yellow-500/30 flex items-center justify-between gap-4 text-xs">
          <div className="text-yellow-400">
            <strong>GUEST MODE:</strong> You are not signed in. Saved coordinates are currently stored locally.
          </div>
          <Link to="/auth" className="bg-yellow-500 text-black px-4 py-1.5 font-bold uppercase tracking-wider hover:bg-white transition shrink-0">
            Sign In with JWT
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-950/60 border border-red-500/50 text-red-300 text-xs font-mono flex items-center gap-2">
          <AlertCircle size={16} className="text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold tracking-widest text-gray-400">SAVED COORDINATES</h3>
            {loading && <Loader2 size={16} className="animate-spin text-cyan-400" />}
          </div>
          
          {addresses.map(addr => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              key={addr._id}
              className={`p-6 border ${addr.isDefault ? 'border-cyan-500/50 bg-cyan-900/10' : 'border-white/10 bg-neutral-900'} relative`}
            >
              {addr.isDefault && <span className="absolute top-4 right-4 text-[10px] bg-cyan-500 text-black px-2 py-1 font-black">DEFAULT</span>}
              <div className="font-bold text-lg mb-2 flex items-center gap-2">
                <MapPin size={16} className="text-cyan-400" />
                {addr.name || user?.name || 'Driver'}
              </div>
              <div className="text-gray-400 text-sm leading-relaxed">
                {addr.street}<br/>
                {addr.city}, {addr.state} {addr.postalCode || addr.zip}
                {addr.country && <span className="block text-gray-500 text-xs mt-1">{addr.country}</span>}
              </div>
              <div className="mt-4 flex gap-4 text-xs font-bold tracking-widest">
                <button 
                  onClick={() => handleDelete(addr._id)}
                  className="text-gray-500 hover:text-red-500 transition flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  REMOVE
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {isAdding && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-neutral-900 border border-white/10 p-6 h-fit">
            <h3 className="text-xl font-bold tracking-widest mb-6 border-b border-white/10 pb-4">NEW DROP ZONE</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input 
                type="text" 
                placeholder="RECIPIENT CALLSIGN" 
                value={newAddress.name} 
                onChange={e => setNewAddress({...newAddress, name: e.target.value})} 
                className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm tracking-widest" 
              />
              <input 
                type="text" 
                placeholder="STREET ADDRESS" 
                value={newAddress.street} 
                onChange={e => setNewAddress({...newAddress, street: e.target.value})} 
                className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm tracking-widest" 
                required 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="CITY" 
                  value={newAddress.city} 
                  onChange={e => setNewAddress({...newAddress, city: e.target.value})} 
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm tracking-widest" 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="STATE/PROVINCE" 
                  value={newAddress.state} 
                  onChange={e => setNewAddress({...newAddress, state: e.target.value})} 
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm tracking-widest" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="POSTAL CODE" 
                  value={newAddress.postalCode} 
                  onChange={e => setNewAddress({...newAddress, postalCode: e.target.value})} 
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm tracking-widest" 
                  required 
                />
                <input 
                  type="text" 
                  placeholder="COUNTRY" 
                  value={newAddress.country} 
                  onChange={e => setNewAddress({...newAddress, country: e.target.value})} 
                  className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm tracking-widest" 
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-cyan-500 hover:bg-white text-black font-black py-4 tracking-widest transition mt-4 cursor-pointer"
              >
                SAVE COORDINATES
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
