import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Info, AlertTriangle, Search, Filter, SlidersHorizontal, PackageX } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { API_BASE } from '../utils/auth';

const FLAVORS = [
  { id: 'cran',    name: 'CRANBERRY APEX',    desc: 'Fierce sweet-tart energy rush',   img: '/can-cranberry.png',    imgSplash: '/can-cranberry-splash.png',    color: 'from-red-600 to-red-900',       price: '$4.99', category: 'HIGH_OCTANE', caffeine: 180, sugar: 0, rating: 4.9 },
  { id: 'blue',    name: 'BLUEBERRY VOLT',    desc: 'Electric blue focus blend',        img: '/can-blueberry.png',    imgSplash: '/can-blueberry-splash.png',    color: 'from-blue-600 to-indigo-900',   price: '$4.99', category: 'HIGH_OCTANE', caffeine: 180, sugar: 2, rating: 4.9 },
  { id: 'mint',    name: 'MINTY LAGOON', desc: 'Cool refreshing hyper-chill',      img: '/can-mintylagoon.png',  imgSplash: '/can-mintylagoon-splash.png',  color: 'from-teal-400 to-cyan-900',     price: '$4.99', category: 'ENDURANCE', caffeine: 100, sugar: 0, rating: 4.7 },
  { id: 'peach',   name: 'PEACH HYDRATION',  desc: 'Smooth performance hydration',     img: '/can-peachwater.png',   imgSplash: '/can-peachwater-splash.png',   color: 'from-orange-400 to-rose-700',   price: '$4.99', category: 'RECOVERY', caffeine: 0, sugar: 0, rating: 4.8 },
  { id: 'apple',   name: 'GREEN APPLE TURBO',  desc: 'Crisp neon orchard blast',         img: '/can-greenapple.png',   imgSplash: '/can-greenapple-splash.png',   color: 'from-green-500 to-lime-900',    price: '$4.99', category: 'HIGH_OCTANE', caffeine: 180, sugar: 3, rating: 4.8 },
  { id: 'cherry',  name: 'SOUR CHERRY OVERDRIVE',  desc: 'Aggressive tart power',            img: '/can-sourcherry.png',   imgSplash: '/can-sourcherry-splash.png',   color: 'from-pink-600 to-rose-900',     price: '$4.99', category: 'HIGH_OCTANE', caffeine: 200, sugar: 0, rating: 4.9 },
  { id: 'currant', name: 'BLACK CURRANT SHADOW',desc: 'Deep violet dark energy',          img: '/can-blackcurrant.png', imgSplash: '/can-blackcurrant-splash.png', color: 'from-purple-600 to-fuchsia-900',price: '$4.99', category: 'ENDURANCE', caffeine: 140, sugar: 0, rating: 4.7 },
  { id: 'orange',  name: 'TANGY ORANGE CIRCUIT', desc: 'High-voltage citrus shock',        img: '/can-tangyorange.png',  imgSplash: '/can-tangyorange-splash.png',  color: 'from-orange-500 to-yellow-800', price: '$4.99', category: 'RECOVERY', caffeine: 80, sugar: 4, rating: 4.8 },
];

function ProductCard({ product, i, isAntigravityOn, addToCart, stock }) {
  const [qty, setQty] = useState(1);
  const outOfStock = stock === 0;
  const lowStock = stock > 0 && stock <= 10;

  return (
    <motion.div
      initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} whileHover={outOfStock ? undefined : "hover"}
      variants={{
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, type: "spring", bounce: 0.2 } },
        hover: { y: -5, transition: { duration: 0.3 } }
      }}
      className={`relative bg-black border overflow-hidden flex flex-col items-center p-6 md:p-8 transition-all duration-500 cursor-default group rounded-xl ${
        outOfStock
          ? 'border-red-900/30 opacity-60'
          : isAntigravityOn
            ? 'border-red-900/30 hover:border-red-600/60 shadow-[0_0_0_rgba(220,38,38,0)] hover:shadow-[0_0_30px_rgba(220,38,38,0.2)]'
            : 'border-white/5 hover:border-cyan-400/30 shadow-none'
      }`}
    >
      {/* Color gradient on hover */}
      <motion.div variants={{ initial: { opacity: 0 }, animate: { opacity: 0 }, hover: { opacity: outOfStock ? 0 : 0.2 } }} transition={{ duration: 0.5 }} className={`absolute inset-0 bg-gradient-to-t ${product.color}`} />

      {/* Out of Stock Overlay */}
      {outOfStock && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-red-900/80 border border-red-500/60 px-4 py-2 text-center rounded">
            <p className="text-red-400 font-black italic text-sm tracking-widest uppercase">Out of Stock</p>
            <p className="text-gray-400 text-[10px] font-mono mt-0.5">Awaiting resupply</p>
          </div>
        </div>
      )}

      {/* Low stock warning badge */}
      {lowStock && !outOfStock && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1 bg-yellow-950/80 border border-yellow-500/50 px-2 py-0.5 rounded">
          <AlertTriangle size={10} className="text-yellow-400" />
          <span className="text-[9px] text-yellow-400 font-black font-mono tracking-widest">ONLY {stock} LEFT</span>
        </div>
      )}

      {/* Nutrition info overlay */}
      <div className="absolute top-4 left-4 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
        <div className="text-[9px] text-gray-300 flex flex-col gap-1 text-left bg-black/80 backdrop-blur-md p-2.5 rounded border border-white/10 uppercase font-mono tracking-widest whitespace-nowrap shadow-xl">
          <span className="font-bold text-white border-b border-white/20 pb-1 mb-1 flex items-center gap-1">
            <Info size={10} className="text-red-500" />
            300ml PER CAN
          </span>
          <span className="text-red-400 font-bold">Caffeine: {product.caffeine}mg</span>
          <span className="text-cyan-400">Sugar: {product.sugar}g</span>
          <span>Rating: ★ {product.rating}</span>
        </div>
      </div>

      {/* Can image */}
      <div className="relative h-64 sm:h-72 w-full flex items-center justify-center mb-6 md:mb-8">
        <motion.img src={product.img} alt={product.name} variants={{ initial: { opacity: 1 }, animate: { opacity: 1 }, hover: { opacity: 0 } }} transition={{ duration: 0.2 }} className="absolute inset-0 m-auto h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
        <motion.img src={product.imgSplash} alt={product.name + " Splash"} variants={{ initial: { opacity: 0, scale: 0.9, y: 20 }, animate: { opacity: 0, scale: 0.9, y: 20 }, hover: { opacity: outOfStock ? 0 : 1, scale: 1.15, y: -10, rotate: [-1, 1, 0] } }} transition={{ type: "spring", bounce: 0.3, duration: 1.2 }} className="absolute inset-0 m-auto w-[130%] h-[130%] object-contain filter drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] z-10 pointer-events-none" />
      </div>

      <div className="relative z-10 text-center w-full mt-auto">
        <h3 className="text-lg md:text-xl font-black italic tracking-wider mb-1 uppercase truncate">{product.name}</h3>
        <p className="text-xs text-gray-500 h-8 line-clamp-2">{product.desc}</p>

        <div className="mt-4 md:mt-6 flex justify-between items-center border-t border-white/10 pt-4 md:pt-6">
          <span className="font-mono text-lg md:text-xl font-bold">{product.price}</span>
          <div className="flex items-center gap-2 z-20 relative pointer-events-auto">
            {!outOfStock && (
              <div className="flex items-center border border-white/20 rounded-full overflow-hidden bg-black/50">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-7 h-7 md:w-8 md:h-8 text-gray-400 hover:text-white hover:bg-white/10 transition flex items-center justify-center text-sm cursor-pointer">-</button>
                <span className="font-mono w-5 text-center text-xs">{qty}</span>
                <button onClick={() => setQty(Math.min(stock ?? 99, qty + 1))} className="w-7 h-7 md:w-8 md:h-8 text-gray-400 hover:text-white hover:bg-white/10 transition flex items-center justify-center text-sm cursor-pointer">+</button>
              </div>
            )}
            <button
              disabled={outOfStock}
              className={`text-white px-3 md:px-4 py-2 text-xs font-bold tracking-widest transition rounded-full cursor-pointer ${
                outOfStock ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-white/10 hover:bg-red-600 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]'
              }`}
              onClick={() => { if (!outOfStock) { addToCart(product, qty); setQty(1); } }}
            >
              {outOfStock ? 'SOLD OUT' : 'ADD'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage({ isAntigravityOn, addToCart }) {
  const { hash } = useLocation();
  const [stockMap, setStockMap] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState('popularity');
  const [zeroSugarOnly, setZeroSugarOnly] = useState(false);

  // Fetch live inventory from backend
  useEffect(() => {
    fetch(`${API_BASE}/api/products`)
      .then(r => r.json())
      .then(data => {
        const map = {};
        data.forEach(p => { map[p.slug] = p.stock; });
        setStockMap(map);
      })
      .catch(() => {
        console.warn('Inventory API unreachable — running in offline mode.');
      });
  }, []);

  useEffect(() => {
    if (hash === '#products') {
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [hash]);

  // Filter and sort products
  const filteredProducts = FLAVORS.filter(p => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.desc.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    // Category
    if (selectedCategory !== 'ALL' && p.category !== selectedCategory) {
      return false;
    }
    // Zero sugar
    if (zeroSugarOnly && p.sugar > 0) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    if (selectedSort === 'price_asc') {
      return parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''));
    }
    if (selectedSort === 'price_desc') {
      return parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''));
    }
    if (selectedSort === 'caffeine_desc') {
      return b.caffeine - a.caffeine;
    }
    if (selectedSort === 'rating') {
      return b.rating - a.rating;
    }
    return 0; // popularity / default
  });

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[100dvh] w-full overflow-hidden">
        <div className="absolute inset-0 z-10">
          <Canvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} color="#ff0000" />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={0.5} />
          </Canvas>
        </div>
        <main className="relative z-20 h-full flex flex-col px-6 md:px-16 pointer-events-none pt-24 md:pt-40">
          <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.8 }} className="max-w-2xl">
            <div className="flex items-center gap-2 text-red-500 mb-4">
              <Zap size={14} fill="currentColor" />
              <span className="font-bold tracking-[0.1em] md:tracking-[0.3em] text-[9px] md:text-xs italic uppercase">0-100% FOCUS IN 2.9s</span>
            </div>
            <h2 className="text-4xl sm:text-7xl md:text-8xl lg:text-9xl font-black leading-none italic uppercase mb-6">
              Defy <br /> <span className="text-transparent" style={{ WebkitTextStroke: '1px white' }}>Gravity.</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-lg mb-8 max-w-md pointer-events-auto leading-relaxed">
              Engineered for the elite. Adrenaline mimics the aerodynamics of F1 to deliver energy that hits faster than a hairpin turn.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 pointer-events-auto w-full">
              <div className="flex flex-col"><span className="text-2xl md:text-3xl font-black italic">180mg</span><span className="text-[9px] text-gray-500 tracking-widest uppercase">Caffeine / RPM</span></div>
              <div className="flex flex-col"><span className="text-2xl md:text-3xl font-black italic">0.0s</span><span className="text-[9px] text-gray-500 tracking-widest uppercase">Sugar / Drag</span></div>
            </div>
          </motion.div>
        </main>
      </div>

      {/* Products Discovery Section */}
      <section id="products" className="relative w-full min-h-screen py-16 md:py-32 px-4 md:px-16 overflow-hidden transition-colors duration-1000">
        <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none z-0 ${isAntigravityOn ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'radial-gradient(circle at center, rgba(153,0,0,0.15) 0%, rgba(0,0,0,1) 70%)' }} />
        <div className={`absolute inset-0 bg-neutral-950 transition-opacity duration-1000 pointer-events-none z-0 ${isAntigravityOn ? 'opacity-0' : 'opacity-100'}`} />
        <div className="max-w-7xl mx-auto relative z-20">
          
          {/* Header */}
          <div className="mb-8 md:mb-12">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase leading-tight">Arsenal <br className="sm:hidden" /> <span className={isAntigravityOn ? "text-red-500 transition-colors duration-1000" : "text-cyan-400 transition-colors duration-1000"}>Selection.</span></h2>
            <p className="text-gray-400 text-sm md:text-lg mt-3 max-w-xl transition-colors duration-1000 leading-relaxed">
              {isAntigravityOn
                ? "Choose your tuning. Eight distinct profiles designed to optimize your neural and physical RPMs. Includes extreme-yield caffeinated beverages."
                : "Smooth endurance. Eight essential hydration protocols built to keep the engine running across long sectors. Includes non-caffeinated endurance beverages."}
            </p>
          </div>

          {/* Search, Filter & Discovery Bar */}
          <div className="bg-neutral-900/80 backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-2xl mb-10 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search formulas by keyword (e.g. Cranberry, tart, focus)..."
                className="w-full bg-black/60 border border-white/10 pl-10 pr-4 py-2.5 rounded-xl text-xs font-mono text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: 'ALL', label: 'ALL FORMULAS' },
                { id: 'HIGH_OCTANE', label: 'HIGH-OCTANE' },
                { id: 'ENDURANCE', label: 'ENDURANCE' },
                { id: 'RECOVERY', label: 'RECOVERY' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
                      : 'bg-black/40 text-gray-400 hover:text-white border border-white/5 hover:border-white/20'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort & Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setZeroSugarOnly(!zeroSugarOnly)}
                className={`px-3 py-2 rounded-xl text-[10px] font-mono tracking-wider border transition cursor-pointer whitespace-nowrap ${
                  zeroSugarOnly
                    ? 'bg-cyan-950 border-cyan-500 text-cyan-400 font-bold'
                    : 'bg-black/40 border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                ZERO SUGAR
              </button>

              <select
                value={selectedSort}
                onChange={e => setSelectedSort(e.target.value)}
                className="bg-black/60 border border-white/10 text-gray-300 text-xs font-mono px-3 py-2.5 rounded-xl focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="popularity">Popularity</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="caffeine_desc">Highest Caffeine</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-24 text-center bg-neutral-900/50 border border-white/5 rounded-2xl flex flex-col items-center justify-center">
              <PackageX size={40} className="text-gray-600 mb-3" />
              <p className="font-mono text-sm text-gray-400 tracking-widest uppercase">NO FORMULAS MATCH TELEMETRY FILTERS</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('ALL'); setZeroSugarOnly(false); }}
                className="mt-4 text-xs font-mono text-red-400 underline hover:text-white cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  i={i}
                  isAntigravityOn={isAntigravityOn}
                  addToCart={addToCart}
                  stock={stockMap[product.id] !== undefined ? stockMap[product.id] : 99}
                />
              ))}
            </div>
          )}

        </div>
      </section>
    </>
  );
}
