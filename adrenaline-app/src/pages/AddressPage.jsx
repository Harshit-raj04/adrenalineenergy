import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AddressPage() {
  const [addresses, setAddresses] = useState([
    { id: 1, name: 'Guest Driver', street: '123 Apex Corner', city: 'Monaco', state: 'MC', zip: '98000', isDefault: true }
  ]);
  
  const [newAddress, setNewAddress] = useState({ name: '', street: '', city: '', state: '', zip: '' });
  const [isAdding, setIsAdding] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city) return;
    setAddresses([...addresses, { id: Date.now(), ...newAddress, isDefault: addresses.length === 0 }]);
    setNewAddress({ name: '', street: '', city: '', state: '', zip: '' });
    setIsAdding(false);
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-6 pt-24 pb-32 relative z-10 min-h-[calc(100vh-80px)]">
      <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-4xl font-black italic uppercase">Shipping <span className="text-cyan-500">Telemetry</span></h2>
          <p className="text-gray-400 mt-2">Manage your fuel supply drop coordinates.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-white/10 hover:bg-white text-white hover:text-black px-6 py-2 font-bold tracking-widest text-sm transition"
        >
          {isAdding ? 'CANCEL' : '+ NEW DROP ZONE'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold tracking-widest text-gray-400 mb-6">SAVED COORDINATES</h3>
          {addresses.map(addr => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} key={addr.id}
              className={`p-6 border ${addr.isDefault ? 'border-cyan-500/50 bg-cyan-900/10' : 'border-white/10 bg-neutral-900'} relative`}
            >
              {addr.isDefault && <span className="absolute top-4 right-4 text-[10px] bg-cyan-500 text-black px-2 py-1 font-black">DEFAULT</span>}
              <div className="font-bold text-lg mb-2">{addr.name || 'Driver'}</div>
              <div className="text-gray-400 text-sm leading-relaxed">
                {addr.street}<br/>
                {addr.city}, {addr.state} {addr.zip}
              </div>
              <div className="mt-4 flex gap-4 text-xs font-bold tracking-widest">
                <button className="text-white hover:text-cyan-400 transition">EDIT</button>
                {!addr.isDefault && <button className="text-gray-500 hover:text-red-500 transition">REMOVE</button>}
              </div>
            </motion.div>
          ))}
        </div>

        {isAdding && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-neutral-900 border border-white/10 p-6 h-fit">
            <h3 className="text-xl font-bold tracking-widest mb-6 border-b border-white/10 pb-4">NEW DROP ZONE</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <input type="text" placeholder="RECIPIENT NAME" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm tracking-widest" />
              <input type="text" placeholder="STREET ADDRESS" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm tracking-widest" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="CITY" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm tracking-widest" required />
                <input type="text" placeholder="STATE/PROVINCE" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm tracking-widest" required />
              </div>
              <input type="text" placeholder="POSTAL CODE" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm tracking-widest" required />
              <button type="submit" className="w-full bg-cyan-500 hover:bg-white text-black font-black py-4 tracking-widest transition mt-4">
                SAVE COORDINATES
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
