import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Gauge, 
  Flame, 
  Check, 
  ShoppingCart, 
  Droplets, 
  Flag, 
  Activity, 
  Timer,
  ChevronRight
} from 'lucide-react';

const SIZES = [
  {
    id: '330ml',
    label: '330 ML',
    tag: 'SPRINT STINT',
    desc: 'Lightweight, rapid absorption can for explosive short stints.',
    basePrice: 4.49,
    stintDuration: '45 MIN SPRINT',
  },
  {
    id: '500ml',
    label: '500 ML',
    tag: 'GP DISTANCE',
    desc: 'Maximum volume tank engineered for 70+ lap endurance.',
    basePrice: 5.99,
    stintDuration: '120 MIN ENDURANCE',
  }
];

const FLAVOURS = [
  { 
    id: 'cran', 
    name: 'CRANBERRY APEX', 
    color: '#dc2626', 
    glow: 'rgba(220, 38, 38, 0.45)',
    img: '/can-cranberry.png',
    accentText: 'text-red-500',
    borderActive: 'border-red-500',
    notes: 'Sweet-tart velocity'
  },
  { 
    id: 'blue', 
    name: 'BLUEBERRY VOLT', 
    color: '#2563eb', 
    glow: 'rgba(37, 99, 235, 0.45)',
    img: '/can-blueberry.png',
    accentText: 'text-blue-400',
    borderActive: 'border-blue-500',
    notes: 'Electric focus'
  },
  { 
    id: 'mint', 
    name: 'MINTY LAGOON', 
    color: '#0d9488', 
    glow: 'rgba(13, 148, 136, 0.45)',
    img: '/can-mintylagoon.png',
    accentText: 'text-teal-400',
    borderActive: 'border-teal-400',
    notes: 'Sub-zero chill'
  },
  { 
    id: 'apple', 
    name: 'GREEN APPLE TURBO', 
    color: '#22c55e', 
    glow: 'rgba(34, 197, 94, 0.45)',
    img: '/can-greenapple.png',
    accentText: 'text-green-400',
    borderActive: 'border-green-500',
    notes: 'Crisp neon orchard'
  },
  { 
    id: 'cherry', 
    name: 'SOUR CHERRY OVERDRIVE', 
    color: '#e11d48', 
    glow: 'rgba(225, 29, 72, 0.45)',
    img: '/can-sourcherry.png',
    accentText: 'text-pink-400',
    borderActive: 'border-pink-500',
    notes: 'Tart aggressive bite'
  },
  { 
    id: 'peach', 
    name: 'PEACH HYDRATION', 
    color: '#f97316', 
    glow: 'rgba(249, 115, 22, 0.45)',
    img: '/can-peachwater.png',
    accentText: 'text-orange-400',
    borderActive: 'border-orange-400',
    notes: 'Performance hydrate'
  },
  { 
    id: 'currant', 
    name: 'BLACK CURRANT SHADOW', 
    color: '#9333ea', 
    glow: 'rgba(147, 51, 234, 0.45)',
    img: '/can-blackcurrant.png',
    accentText: 'text-purple-400',
    borderActive: 'border-purple-500',
    notes: 'Deep dark energy'
  },
  { 
    id: 'orange', 
    name: 'TANGY ORANGE CIRCUIT', 
    color: '#ea580c', 
    glow: 'rgba(234, 88, 12, 0.45)',
    img: '/can-tangyorange.png',
    accentText: 'text-amber-400',
    borderActive: 'border-amber-400',
    notes: 'High-voltage citrus'
  }
];

const CAFFEINE_LEVELS = [
  {
    mg: 0,
    label: '0 mg',
    sublabel: 'RECOVERY',
    staminaMultiplier: 'Hydration Only',
    accentColor: 'text-gray-400',
    desc: 'Pure electrolyte hydration with zero stimulant load.'
  },
  {
    mg: 100,
    label: '100 mg',
    sublabel: 'FOCUS',
    staminaMultiplier: '1.5x Reflex',
    accentColor: 'text-cyan-400',
    desc: 'Balanced clarity for simulator sessions and technical laps.'
  },
  {
    mg: 180,
    label: '180 mg',
    sublabel: 'APEX STINT',
    staminaMultiplier: '2.4x Stamina',
    accentColor: 'text-red-500',
    desc: 'Standard Formula 1 cockpit calibration. Unyielding focus.'
  },
  {
    mg: 250,
    label: '250 mg',
    sublabel: 'QUALIFYING',
    staminaMultiplier: '3.0x Max Velocity',
    accentColor: 'text-yellow-400',
    desc: 'Full throttle maximum cognitive yield for pole position.'
  }
];

const ELECTROLYTE_FORMULAS = [
  {
    id: 'standard',
    name: 'Standard Baseline',
    sub: '180mg Na • 120mg K',
    compound: 'Hard (Durable)',
    compoundColor: 'bg-white/10 text-gray-300 border-white/20',
    extra: 0
  },
  {
    id: 'thermal_shield',
    name: 'Thermal Shield',
    sub: '360mg Na • 240mg K',
    compound: 'Medium (Thermal)',
    compoundColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    extra: 0
  },
  {
    id: 'anti_cramp',
    name: 'Anti-Cramp Complex',
    sub: '120mg Mg • 100mg Ca',
    compound: 'Inter (Recovery)',
    compoundColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    extra: 0
  },
  {
    id: 'grid_master',
    name: 'Full Grid Matrix',
    sub: '5-Mineral + Pink Salt',
    compound: 'Soft (Max Grip) +$0.50',
    compoundColor: 'bg-red-500/10 text-red-400 border-red-500/30',
    extra: 0.50
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
  const electrolyteExtra = selectedElectrolyte.extra || 0;
  const unitPrice = basePrice + caffeineExtra + electrolyteExtra;
  const totalPrice = unitPrice * quantity;
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
    <section id="custom-drink-lab" className="w-full relative z-20 py-16 px-4 sm:px-6 md:px-12 bg-gradient-to-b from-black via-neutral-950 to-black border-t border-white/10">
      
      {/* Background Ambience & Telemetry Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
      <div 
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] blur-[150px] pointer-events-none transition-all duration-700 rounded-full"
        style={{ backgroundColor: selectedFlavour.glow }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header with F1 Starting Lights Visual */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-red-600 text-white font-mono text-xs font-black tracking-widest uppercase rounded flex items-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
                <Flag size={13} />
                PIT GARAGE R&D
              </span>
              <span className="text-gray-400 text-xs font-mono uppercase tracking-widest flex items-center gap-1">
                <Activity size={13} className="text-cyan-400" />
                TELEMETRY BLEND STATION
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black italic tracking-tighter uppercase text-white">
              BUILD YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white">CUSTOM FUEL</span>
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1.5 max-w-2xl font-normal">
              Directly calibrate your cockpit fuel. Select can volume, dialed-in caffeine dosage, electrolyte thermal buffer, and aerodynamic flavor profile.
            </p>
          </div>

          {/* F1 Five Starting Lights Visual Box */}
          <div className="flex flex-col items-start md:items-end font-mono">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
              F1 LAUNCH SEQUENCE READY
            </span>
            <div className="flex items-center gap-2 bg-neutral-900/90 border border-white/10 px-3.5 py-2 rounded-xl shadow-inner">
              {[1, 2, 3, 4, 5].map((light) => (
                <div key={light} className="flex flex-col items-center gap-1">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.9)] animate-pulse" />
                  <div className="w-1.5 h-1.5 rounded-full bg-black/60" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Main Interactive Calibration Console (Equal 50/50 Grid & Matched Height) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10 items-stretch">
          
          {/* Left Column: Real-time Dynamic Can Preview (Fully Stretched & Fitted) */}
          <div className="bg-neutral-900/70 border border-white/10 rounded-2xl p-6 sm:p-7 flex flex-col justify-between items-center relative overflow-hidden backdrop-blur-md shadow-2xl h-full">
            
            {/* Top Bar: Telemetry Header */}
            <div className="w-full flex justify-between items-center border-b border-white/10 pb-3 text-xs font-mono">
              <span className="text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Gauge size={14} className="text-red-500" />
                CAN SIMULATOR
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-cyan-400 font-bold tracking-widest text-[11px]">
                {selectedSize.id} • {selectedCaffeine.mg}MG • {selectedElectrolyte.name}
              </span>
            </div>

            {/* Central Can Stage (flex-1 to naturally fill all space without gaps) */}
            <div className="relative flex-1 w-full flex flex-col items-center justify-center my-4 py-4 min-h-[310px]">
              
              {/* Backlight Aura Glow */}
              <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.55, 0.35] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-64 h-64 rounded-full blur-3xl pointer-events-none"
                style={{ backgroundColor: selectedFlavour.color }}
              />

              {/* F1 Checkered Track Marker Floor */}
              <div className="absolute bottom-2 w-52 h-6 bg-gradient-to-t from-red-600/20 to-transparent blur-md rounded-full" />
              <div className="absolute bottom-0 w-48 h-1 border-b-2 border-dashed border-white/20" />

              {/* Dynamic Can Image with Volume Scale Physics */}
              <motion.div
                key={`${selectedSize.id}-${selectedFlavour.id}`}
                initial={{ y: 15, opacity: 0, scale: 0.88 }}
                animate={{ y: 0, opacity: 1, scale: selectedSize.id === '500ml' ? 1.05 : 0.92 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative z-10 flex flex-col items-center cursor-pointer"
              >
                <img 
                  src={selectedFlavour.img} 
                  alt={selectedFlavour.name} 
                  className="max-h-72 sm:max-h-80 object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.9)] transition-all duration-300 hover:rotate-1"
                />

                {/* Overlaid Custom Can Decal Badge */}
                <div className="mt-3 px-3.5 py-1 bg-black/85 border border-white/20 rounded-full backdrop-blur-md flex items-center gap-2 shadow-xl">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedFlavour.color }} />
                  <span className="font-mono text-[10px] font-bold text-white tracking-widest uppercase">
                    {selectedSize.label} // {selectedFlavour.notes}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Telemetry Live Formula Specs Card */}
            <div className="w-full bg-black/55 border border-white/5 rounded-xl p-3.5 font-mono text-xs space-y-2 mb-4">
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
            </div>

            {/* Bottom Controls: Batch Quantity & Deploy Button in Left Card */}
            <div className="w-full space-y-3 pt-3 border-t border-white/10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">BATCH:</span>
                  <div className="flex items-center border border-white/10 rounded-lg bg-black/60">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-gray-400 hover:text-white transition font-mono text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-2.5 py-1 font-mono text-xs font-bold text-white min-w-[1.75rem] text-center">
                      {quantity}
                    </span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-gray-400 hover:text-white transition font-mono text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[9px] font-mono text-gray-500 uppercase block">SUBTOTAL</span>
                  <span className="text-xl font-mono font-bold text-white">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleDeployToCart}
                className={`w-full py-3.5 font-black uppercase text-xs md:text-sm tracking-widest skew-x-[-10deg] transition flex items-center justify-center gap-2 cursor-pointer ${
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
                      DEPLOY CUSTOM FUEL (${totalPrice.toFixed(2)})
                    </>
                  )}
                </span>
              </button>
            </div>

          </div>

          {/* Right Column: Clean, Compact Customization Controls */}
          <div className="space-y-4 flex flex-col justify-between h-full">
            
            {/* 1. CAN VOLUME SELECTION (Compact Horizontal Segmented Selector) */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center text-[9px] font-black">
                    1
                  </span>
                  SELECT CAN CAPACITY
                </label>
                <span className="text-[10px] font-mono text-gray-400 uppercase font-bold">
                  {selectedSize.label} • {selectedSize.tag}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {SIZES.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                      selectedSize.id === size.id
                        ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                        : 'bg-black/40 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-black italic text-base text-white">{size.label}</span>
                      <span className="text-xs font-mono font-bold text-gray-300">${size.basePrice.toFixed(2)}</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wide block">
                      {size.tag}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. FLAVOUR MATRIX SELECT (Compact 4x2 Grid) */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center text-[9px] font-black">
                    2
                  </span>
                  SELECT AERODYNAMIC FLAVOUR
                </label>
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold">
                  {selectedFlavour.name}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FLAVOURS.map((flavor) => {
                  const isActive = selectedFlavour.id === flavor.id;
                  return (
                    <button
                      key={flavor.id}
                      onClick={() => setSelectedFlavour(flavor)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between h-20 relative overflow-hidden ${
                        isActive
                          ? `${flavor.borderActive} bg-white/5 shadow-md`
                          : 'border-white/5 bg-black/40 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: flavor.color }} 
                        />
                        {isActive && <Check size={12} className={flavor.accentText} />}
                      </div>
                      <div>
                        <span className="font-bold text-[11px] uppercase tracking-tight text-white block truncate">
                          {flavor.name}
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono block truncate">
                          {flavor.notes}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. CAFFEINE CONTENT SELECT (Clean 4-Option Horizontal Bar) */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center text-[9px] font-black">
                    3
                  </span>
                  CALIBRATE CAFFEINE DOSAGE
                </label>
                <span className="text-[10px] font-mono text-gray-400 uppercase">
                  {selectedCaffeine.label} ({selectedCaffeine.sublabel})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {CAFFEINE_LEVELS.map((caff) => {
                  const isActive = selectedCaffeine.mg === caff.mg;
                  return (
                    <button
                      key={caff.mg}
                      onClick={() => setSelectedCaffeine(caff)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                        isActive
                          ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)]'
                          : 'bg-black/40 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <span className="text-base font-black font-mono text-white block">
                        {caff.label}
                      </span>
                      <span className="text-[9px] font-mono uppercase tracking-wider text-gray-400 mt-0.5">
                        {caff.sublabel}
                      </span>
                      {caff.mg === 250 && (
                        <span className="text-[8px] font-mono text-yellow-400 font-bold mt-0.5">
                          +$0.50
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. ELECTROLYTE BUFFER SELECT (Clean, Less Messy 2x2 Grid) */}
            <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono font-bold uppercase tracking-widest text-gray-300 flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-red-600 text-white flex items-center justify-center text-[9px] font-black">
                    4
                  </span>
                  ELECTROLYTE COMPOUND
                </label>
                <span className="text-[10px] font-mono text-gray-400 uppercase">
                  {selectedElectrolyte.name}
                </span>
              </div>

              {/* Clean 2x2 Grid with concise telemetry and tire compound badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ELECTROLYTE_FORMULAS.map((elec) => {
                  const isActive = selectedElectrolyte.id === elec.id;
                  return (
                    <button
                      key={elec.id}
                      onClick={() => setSelectedElectrolyte(elec)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? 'bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(220,38,38,0.25)]'
                          : 'bg-black/40 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-bold text-xs uppercase tracking-tight text-white">
                          {elec.name}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${elec.compoundColor}`}>
                          {elec.compound}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
                        <Droplets size={12} className={isActive ? "text-cyan-400" : "text-gray-500"} />
                        <span>{elec.sub}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
