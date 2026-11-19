import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Gauge, 
  Flame, 
  Check, 
  ShoppingCart, 
  Droplets, 
  Sliders, 
  Flag, 
  Activity, 
  Sparkles,
  Layers,
  ShieldCheck
} from 'lucide-react';

const SIZES = [
  {
    id: '330ml',
    label: '330 ML',
    tag: 'SPRINT STINT',
    desc: 'Lightweight, rapid absorption can for explosive short stints.',
    basePrice: 4.49,
    heightClass: 'h-64 sm:h-72 w-32 sm:w-36',
    canScale: 'scale-90',
    stintDuration: '45 MIN PEAK',
  },
  {
    id: '500ml',
    label: '500 ML',
    tag: 'GRAND PRIX DISTANCE',
    desc: 'Maximum volume tank engineered for 70+ lap endurance.',
    basePrice: 5.99,
    heightClass: 'h-80 sm:h-96 w-36 sm:w-40',
    canScale: 'scale-105',
    stintDuration: '120 MIN ENDURANCE',
  }
];

const FLAVOURS = [
  { 
    id: 'cran', 
    name: 'CRANBERRY APEX', 
    color: '#dc2626', 
    gradient: 'from-red-600 via-rose-700 to-red-950', 
    glow: 'rgba(220, 38, 38, 0.4)',
    img: '/can-cranberry.png',
    accentText: 'text-red-500',
    borderActive: 'border-red-500',
    notes: 'Sweet-tart velocity'
  },
  { 
    id: 'blue', 
    name: 'BLUEBERRY VOLT', 
    color: '#2563eb', 
    gradient: 'from-blue-600 via-indigo-700 to-blue-950', 
    glow: 'rgba(37, 99, 235, 0.4)',
    img: '/can-blueberry.png',
    accentText: 'text-blue-400',
    borderActive: 'border-blue-500',
    notes: 'Electric neural focus'
  },
  { 
    id: 'mint', 
    name: 'MINTY LAGOON', 
    color: '#0d9488', 
    gradient: 'from-teal-500 via-cyan-700 to-teal-950', 
    glow: 'rgba(13, 148, 136, 0.4)',
    img: '/can-mintylagoon.png',
    accentText: 'text-teal-400',
    borderActive: 'border-teal-400',
    notes: 'Sub-zero thermal chill'
  },
  { 
    id: 'apple', 
    name: 'GREEN APPLE TURBO', 
    color: '#22c55e', 
    gradient: 'from-green-500 via-emerald-700 to-green-950', 
    glow: 'rgba(34, 197, 94, 0.4)',
    img: '/can-greenapple.png',
    accentText: 'text-green-400',
    borderActive: 'border-green-500',
    notes: 'Crisp neon surge'
  },
  { 
    id: 'cherry', 
    name: 'SOUR CHERRY OVERDRIVE', 
    color: '#e11d48', 
    gradient: 'from-pink-600 via-rose-700 to-rose-950', 
    glow: 'rgba(225, 29, 72, 0.4)',
    img: '/can-sourcherry.png',
    accentText: 'text-pink-400',
    borderActive: 'border-pink-500',
    notes: 'Aggressive tart bite'
  },
  { 
    id: 'peach', 
    name: 'PEACH HYDRATION', 
    color: '#f97316', 
    gradient: 'from-orange-500 via-rose-600 to-orange-950', 
    glow: 'rgba(249, 115, 22, 0.4)',
    img: '/can-peachwater.png',
    accentText: 'text-orange-400',
    borderActive: 'border-orange-400',
    notes: 'Smooth electrolyte wave'
  },
  { 
    id: 'currant', 
    name: 'BLACK CURRANT SHADOW', 
    color: '#9333ea', 
    gradient: 'from-purple-600 via-fuchsia-800 to-purple-950', 
    glow: 'rgba(147, 51, 234, 0.4)',
    img: '/can-blackcurrant.png',
    accentText: 'text-purple-400',
    borderActive: 'border-purple-500',
    notes: 'Deep night dark fuel'
  },
  { 
    id: 'orange', 
    name: 'TANGY ORANGE CIRCUIT', 
    color: '#ea580c', 
    gradient: 'from-amber-500 via-orange-600 to-yellow-950', 
    glow: 'rgba(234, 88, 12, 0.4)',
    img: '/can-tangyorange.png',
    accentText: 'text-amber-400',
    borderActive: 'border-amber-400',
    notes: 'High-voltage citrus shock'
  }
];

const CAFFEINE_LEVELS = [
  {
    mg: 0,
    label: '0 mg',
    sublabel: 'PURE RECOVERY',
    badge: 'ZERO CAFFEINE',
    staminaMultiplier: 'Hydration Only',
    accentColor: 'text-gray-400',
    desc: 'Electrolyte-only hydration, 0 jitter, perfect for night recovery.'
  },
  {
    mg: 100,
    label: '100 mg',
    sublabel: 'SMOOTH FOCUS',
    badge: 'MEDIUM OCTANE',
    staminaMultiplier: '1.5x Reflex',
    accentColor: 'text-cyan-400',
    desc: 'Balanced clarity for simulator sessions and technical laps.'
  },
  {
    mg: 180,
    label: '180 mg',
    sublabel: 'F1 APEX STINT',
    badge: 'HIGH OCTANE',
    staminaMultiplier: '2.4x Stamina',
    accentColor: 'text-red-500',
    desc: 'Standard Formula 1 cockpit calibration. Unyielding focus.'
  },
  {
    mg: 250,
    label: '250 mg',
    sublabel: 'QUALIFYING MODE',
    badge: 'MAX VELOCITY',
    staminaMultiplier: '3.0x Hyper-Focus',
    accentColor: 'text-yellow-400',
    desc: 'Full throttle maximum cognitive yield for pole-position performance.'
  }
];

const ELECTROLYTE_FORMULAS = [
  {
    id: 'standard',
    name: 'Standard Telemetry Balance',
    sub: 'Sodium 180mg • Potassium 120mg',
    focus: 'Daily training & baseline hydration',
    badge: 'HARD TIRE (DURABLE)',
    badgeColor: 'border-white/20 text-gray-300'
  },
  {
    id: 'thermal_shield',
    name: 'Cockpit 50°C Thermal Shield',
    sub: 'Sodium 360mg • Potassium 240mg • Taurine',
    focus: 'Counteracts high cockpit sweating under 5G loads',
    badge: 'MEDIUM TIRE (BALANCED)',
    badgeColor: 'border-yellow-500/50 text-yellow-400'
  },
  {
    id: 'anti_cramp',
    name: 'Magnesium & Calcium Complex',
    sub: 'Magnesium Citrate 120mg • Calcium 100mg',
    focus: 'Prevents neck and forearm muscle fatigue during cornering',
    badge: 'INTERMEDIATE (REACTIVE)',
    badgeColor: 'border-emerald-500/50 text-emerald-400'
  },
  {
    id: 'grid_master',
    name: 'Full Grid Hyper-Electrolyte Matrix',
    sub: 'Sodium + Potassium + Magnesium + Zinc + Pink Salt',
    focus: 'Pro-grade total cellular osmotic balance',
    badge: 'SOFT TIRE (MAX GRIP)',
    badgeColor: 'border-red-500/50 text-red-500'
  }
];

export default function CustomDrinkLab({ addToCart, isAntigravityOn }) {
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [selectedFlavour, setSelectedFlavour] = useState(FLAVOURS[0]);
  const [selectedCaffeine, setSelectedCaffeine] = useState(CAFFEINE_LEVELS[2]);
  const [selectedElectrolyte, setSelectedElectrolyte] = useState(ELECTROLYTE_FORMULAS[1]);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  // Compute customized drink price
  const basePrice = selectedSize.basePrice;
  const caffeineExtra = selectedCaffeine.mg === 250 ? 0.50 : 0;
  const electrolyteExtra = selectedElectrolyte.id === 'grid_master' ? 0.50 : 0;
  const unitPrice = basePrice + caffeineExtra + electrolyteExtra;
  const priceFormatted = `$${unitPrice.toFixed(2)}`;

  const handleDeployToCart = () => {
    const customItem = {
      id: `custom-${selectedSize.id}-${selectedFlavour.id}-${selectedCaffeine.mg}mg-${selectedElectrolyte.id}`,
      name: `CUSTOM APEX FUEL (${selectedSize.label} - ${selectedFlavour.name})`,
      price: priceFormatted,
      img: selectedFlavour.img,
      desc: `${selectedSize.label} | ${selectedCaffeine.mg}mg Caffeine | ${selectedElectrolyte.name}`,
      cartQuantity: quantity,
      isCustom: true
    };

    addToCart(customItem, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2400);
  };

  return (
    <section id="custom-drink-lab" className="w-full relative z-20 py-20 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-black via-neutral-950 to-black border-t border-white/10">
      
      {/* Background Ambience & Telemetry Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[140px] pointer-events-none transition-all duration-700 rounded-full"
        style={{ backgroundColor: selectedFlavour.glow }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header with F1 Starting Lights Visual */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-red-600 text-white font-mono text-xs font-black tracking-widest uppercase rounded flex items-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                <Flag size={13} />
                PIT GARAGE R&D
              </span>
              <span className="text-gray-400 text-xs font-mono uppercase tracking-widest flex items-center gap-1">
                <Activity size={13} className="text-cyan-400" />
                TELEMETRY BLEND STATION
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black italic tracking-tighter uppercase text-white">
              BUILD YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white">CUSTOM FUEL</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-2xl font-normal">
              Directly calibrate your cockpit fuel. Select can volume, dialed-in caffeine dosage, electrolyte thermal buffer, and aerodynamic flavor profile.
            </p>
          </div>

          {/* F1 Five Starting Lights Visual Box */}
          <div className="flex flex-col items-start md:items-end font-mono">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
              F1 LAUNCH SEQUENCE READY
            </span>
            <div className="flex items-center gap-2 bg-neutral-900/90 border border-white/10 px-4 py-2.5 rounded-xl shadow-inner">
              {[1, 2, 3, 4, 5].map((light) => (
                <div key={light} className="flex flex-col items-center gap-1">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.9)] animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Main Interactive Calibration Console ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 items-start">
          
          {/* Left Column: Real-time Dynamic Can Preview (4 cols) */}
          <div className="lg:col-span-5 bg-neutral-900/70 border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between items-center relative overflow-hidden backdrop-blur-md shadow-2xl">
            
            {/* Top Can Telemetry Tag */}
            <div className="w-full flex justify-between items-center border-b border-white/10 pb-4 text-xs font-mono">
              <span className="text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Gauge size={13} className="text-red-500" />
                CAN SIMULATOR
              </span>
              <span className="px-2 py-0.5 rounded bg-white/5 text-cyan-400 font-bold tracking-widest">
                {selectedSize.id} • {selectedCaffeine.mg}MG
              </span>
            </div>

            {/* Visual Can Display Stage */}
            <div className="relative my-8 sm:my-12 flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px] w-full">
              
              {/* Backlight Aura Glow */}
              <motion.div 
                animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.55, 0.35] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-56 h-56 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: selectedFlavour.color }}
              />

              {/* F1 Checkered Track Marker Floor */}
              <div className="absolute bottom-2 w-48 h-6 bg-gradient-to-t from-red-600/20 to-transparent blur-md rounded-full" />
              <div className="absolute bottom-0 w-44 h-1 border-b-2 border-dashed border-white/20" />

              {/* Dynamic Can Image with Volume Scale Physics */}
              <motion.div
                key={`${selectedSize.id}-${selectedFlavour.id}`}
                initial={{ y: 20, opacity: 0, scale: 0.85 }}
                animate={{ y: 0, opacity: 1, scale: selectedSize.id === '500ml' ? 1.08 : 0.92 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative z-10 flex flex-col items-center cursor-pointer"
              >
                <img 
                  src={selectedFlavour.img} 
                  alt={selectedFlavour.name} 
                  className="max-h-72 sm:max-h-80 object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)] transition-all duration-300 hover:rotate-2"
                />

                {/* Overlaid Custom Can Decal Badge */}
                <div className="mt-3 px-3 py-1 bg-black/80 border border-white/20 rounded-full backdrop-blur-md flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedFlavour.color }} />
                  <span className="font-mono text-[10px] font-bold text-white tracking-widest uppercase">
                    {selectedSize.label} // {selectedFlavour.notes}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Telemetry Live Formula Specs Card */}
            <div className="w-full bg-black/50 border border-white/5 rounded-xl p-4 font-mono text-xs space-y-2.5">
              <div className="flex justify-between items-center text-gray-400">
                <span>FORMULA CODE:</span>
                <span className="text-white font-bold tracking-wider">
                  ADR-{selectedSize.id.toUpperCase()}-{selectedFlavour.id.toUpperCase()}-{selectedCaffeine.mg}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>STINT RUNTIME:</span>
                <span className="text-cyan-400 font-bold">{selectedSize.stintDuration}</span>
              </div>
              <div className="flex justify-between items-center text-gray-400">
                <span>PERFORMANCE YIELD:</span>
                <span className={selectedCaffeine.accentColor + " font-bold"}>
                  {selectedCaffeine.staminaMultiplier}
                </span>
              </div>
              <div className="flex justify-between items-center text-gray-400 border-t border-white/5 pt-2">
                <span>ESTIMATED UNIT PRICE:</span>
                <span className="text-lg font-black text-white">{priceFormatted}</span>
              </div>
            </div>

            {/* Quick Deploy Button */}
            <button
              onClick={handleDeployToCart}
              className={`w-full mt-6 py-4 font-black uppercase text-xs md:text-sm tracking-widest skew-x-[-10deg] transition flex items-center justify-center gap-2 cursor-pointer ${
                isAdded 
                  ? 'bg-green-600 text-white shadow-[0_0_25px_rgba(34,197,94,0.6)]'
                  : 'bg-red-600 hover:bg-white hover:text-black text-white shadow-[0_0_25px_rgba(220,38,38,0.5)]'
              }`}
            >
              <span className="skew-x-[10deg] flex items-center gap-2">
                {isAdded ? (
                  <>
                    <Check size={16} />
                    FUEL DISPATCHED TO CART!
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    DEPLOY CUSTOM FUEL ({priceFormatted})
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Right Column: Customization Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. CAN VOLUME SELECTION */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                    1
                  </span>
                  SELECT CAN CAPACITY
                </label>
                <span className="text-[10px] font-mono text-gray-500 uppercase">FIA REGULATED CHASSIS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SIZES.map((size) => (
                  <div
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                      selectedSize.id === size.id
                        ? 'bg-red-950/30 border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.3)]'
                        : 'bg-black/40 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black italic text-lg text-white">{size.label}</span>
                      <span className="text-xs font-mono font-bold text-gray-300">${size.basePrice.toFixed(2)}</span>
                    </div>
                    <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider bg-white/10 text-cyan-400 mb-2">
                      {size.tag}
                    </span>
                    <p className="text-xs text-gray-400 leading-snug">{size.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. FLAVOUR MATRIX SELECT */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                    2
                  </span>
                  SELECT AERODYNAMIC FLAVOUR
                </label>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                  {selectedFlavour.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {FLAVOURS.map((flavor) => {
                  const isActive = selectedFlavour.id === flavor.id;
                  return (
                    <button
                      key={flavor.id}
                      onClick={() => setSelectedFlavour(flavor)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-24 relative overflow-hidden ${
                        isActive
                          ? `${flavor.borderActive} bg-white/5 shadow-md`
                          : 'border-white/5 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div 
                          className="w-3.5 h-3.5 rounded-full" 
                          style={{ backgroundColor: flavor.color }} 
                        />
                        {isActive && <Check size={14} className={flavor.accentText} />}
                      </div>
                      <div>
                        <span className="font-bold text-xs uppercase tracking-tight text-white block truncate">
                          {flavor.name}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono block truncate">
                          {flavor.notes}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. CAFFEINE CONTENT SELECT */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                    3
                  </span>
                  CALIBRATE CAFFEINE DOSAGE
                </label>
                <span className="text-[10px] font-mono text-gray-400 uppercase">
                  ACTIVE: {selectedCaffeine.label} ({selectedCaffeine.sublabel})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {CAFFEINE_LEVELS.map((caff) => {
                  const isActive = selectedCaffeine.mg === caff.mg;
                  return (
                    <button
                      key={caff.mg}
                      onClick={() => setSelectedCaffeine(caff)}
                      className={`p-3.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isActive
                          ? 'bg-red-950/30 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                          : 'bg-black/40 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="text-lg font-black font-mono text-white block">
                        {caff.label}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400 mt-0.5">
                        {caff.sublabel}
                      </span>
                      {caff.mg === 250 && (
                        <span className="text-[8px] font-mono text-yellow-400 font-bold mt-1">
                          + $0.50
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 font-mono mt-3 pl-1">
                ℹ️ {selectedCaffeine.desc}
              </p>
            </div>

            {/* 4. ELECTROLYTE BUFFER SELECT */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 sm:p-7 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300 flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-red-600 text-white flex items-center justify-center text-[10px] font-black">
                    4
                  </span>
                  ELECTROLYTE COMPOUND (TIRE STRATEGY)
                </label>
                <span className="text-[10px] font-mono text-gray-500 uppercase">OSMOTIC RECOVERY</span>
              </div>

              <div className="space-y-3">
                {ELECTROLYTE_FORMULAS.map((elec) => {
                  const isActive = selectedElectrolyte.id === elec.id;
                  return (
                    <div
                      key={elec.id}
                      onClick={() => setSelectedElectrolyte(elec)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-red-950/30 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.25)]'
                          : 'bg-black/40 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Droplets size={14} className={isActive ? "text-cyan-400" : "text-gray-500"} />
                          <span className="font-bold text-sm text-white">{elec.name}</span>
                          <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${elec.badgeColor}`}>
                            {elec.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 font-mono mt-1">{elec.sub}</p>
                      </div>

                      <div className="text-left sm:text-right text-[11px] font-mono text-gray-500">
                        {elec.focus}
                        {elec.id === 'grid_master' && (
                          <span className="block text-yellow-400 font-bold">+ $0.50</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Quantity Selector & Deploy CTA Banner */}
            <div className="p-6 bg-black/60 border border-white/10 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono uppercase tracking-widest text-gray-400">BATCH QUANTITY:</span>
                <div className="flex items-center border border-white/10 rounded-lg bg-neutral-900">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-400 hover:text-white transition font-mono text-sm cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 font-mono text-sm font-bold text-white min-w-[2rem] text-center">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-gray-400 hover:text-white transition font-mono text-sm cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-gray-500 uppercase block">TOTAL BATCH PRICE</span>
                <span className="text-2xl font-mono font-bold text-white">
                  ${(unitPrice * quantity).toFixed(2)}
                </span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

