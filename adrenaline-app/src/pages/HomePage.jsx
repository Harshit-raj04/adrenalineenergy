import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, Stars } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const FLAVORS = [
  { id: 'cran', name: 'CRANBERRY', desc: 'Fierce sweet-tart energy rush', img: '/can-cranberry.png', imgSplash: '/can-cranberry-splash.png', color: 'from-red-600 to-red-900', price: '$4.99' },
  { id: 'blue', name: 'BLUEBERRY', desc: 'Electric blue focus blend', img: '/can-blueberry.png', imgSplash: '/can-blueberry-splash.png', color: 'from-blue-600 to-indigo-900', price: '$4.99' },
  { id: 'mint', name: 'MINTY LAGOON', desc: 'Cool refreshing hyper-chill', img: '/can-mintylagoon.png', imgSplash: '/can-mintylagoon-splash.png', color: 'from-teal-400 to-cyan-900', price: '$4.99' },
  { id: 'peach', name: 'PEACH WATER', desc: 'Smooth performance hydration', img: '/can-peachwater.png', imgSplash: '/can-peachwater-splash.png', color: 'from-orange-400 to-rose-700', price: '$4.99' },
  { id: 'apple', name: 'GREEN APPLE', desc: 'Crisp neon orchard blast', img: '/can-greenapple.png', imgSplash: '/can-greenapple-splash.png', color: 'from-green-500 to-lime-900', price: '$4.99' },
  { id: 'cherry', name: 'SOUR CHERRY', desc: 'Aggressive tart power', img: '/can-sourcherry.png', imgSplash: '/can-sourcherry-splash.png', color: 'from-pink-600 to-rose-900', price: '$4.99' },
  { id: 'currant', name: 'BLACK CURRANT', desc: 'Deep violet dark energy', img: '/can-blackcurrant.png', imgSplash: '/can-blackcurrant-splash.png', color: 'from-purple-600 to-fuchsia-900', price: '$4.99' },
  { id: 'orange', name: 'TANGY ORANGE', desc: 'High-voltage citrus shock', img: '/can-tangyorange.png', imgSplash: '/can-tangyorange-splash.png', color: 'from-orange-500 to-yellow-800', price: '$4.99' }
];

function ProductCard({ product, i, isAntigravityOn, addToCart }) {
  const [qty, setQty] = useState(1);
  return (
    <motion.div 
      initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} whileHover="hover"
      variants={{
        initial: { opacity: 0, y: 100 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.15, type: "spring", bounce: 0.25 } },
        hover: { y: -5, transition: { duration: 0.3 } }
      }}
      className={`relative bg-black border overflow-hidden flex flex-col items-center p-6 md:p-8 transition-all duration-500 cursor-default group ${
        isAntigravityOn ? 'border-red-900/30 hover:border-red-600/60 shadow-[0_0_0_rgba(220,38,38,0)] hover:shadow-[0_0_30px_rgba(220,38,38,0.15)]' : 'border-white/5 hover:border-cyan-400/30 shadow-none'
      }`}
    >
      <motion.div variants={{ initial: { opacity: 0 }, animate: { opacity: 0 }, hover: { opacity: 0.2 } }} transition={{ duration: 0.5 }} className={`absolute inset-0 bg-gradient-to-t ${product.color}`} />
      
      <div className="relative h-80 w-full flex items-center justify-center mb-8">
        <motion.img src={product.img} alt={product.name} variants={{ initial: { opacity: 1 }, animate: { opacity: 1 }, hover: { opacity: 0 } }} transition={{ duration: 0.2 }} className="absolute inset-0 m-auto h-full object-contain filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" />
        <motion.img src={product.imgSplash} alt={product.name + " Splash"} variants={{ initial: { opacity: 0, scale: 0.9, y: 20 }, animate: { opacity: 0, scale: 0.9, y: 20 }, hover: { opacity: 1, scale: 1.15, y: -10, rotate: [-1, 1, 0] } }} transition={{ type: "spring", bounce: 0.3, duration: 1.2 }} className="absolute inset-0 m-auto w-[130%] h-[130%] object-contain filter drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] z-10 pointer-events-none" />
      </div>
      
      <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
        <div className="text-[9px] text-gray-300 flex flex-col gap-1 text-left bg-black/80 backdrop-blur-md p-3 rounded border border-white/10 uppercase font-mono tracking-widest whitespace-nowrap">
          <span className="font-bold text-white border-b border-white/20 pb-1 mb-1">300ml PER CAN</span>
          {isAntigravityOn ? (
            <><span className="text-red-400">Caffeine: 180mg</span><span>Vitamin B3</span><span>Zero Sugar</span><span>Taurine (Safe Limit)</span></>
          ) : (
            <><span className="text-cyan-400">Essential Minerals</span><span>Electrolytes</span><span>Glucose</span><span className="text-gray-500">Zero Caffeine / Taurine</span></>
          )}
        </div>
      </div>

      <div className="relative z-10 text-center w-full mt-auto">
        <h3 className="text-2xl font-black italic tracking-wider mb-2">{product.name}</h3>
        <p className="text-xs text-gray-500 h-10">{product.desc}</p>
        
        <div className="mt-6 flex justify-between items-center border-t border-white/10 pt-6">
          <span className="font-mono text-xl">{product.price}</span>
          <div className="flex items-center gap-2 z-20 relative pointer-events-auto">
            <div className="flex items-center border border-white/20 rounded-full overflow-hidden bg-black/50">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 transition">-</button>
              <span className="font-mono w-6 text-center text-sm">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 transition">+</button>
            </div>
            <button className="bg-white/10 hover:bg-red-600 text-white px-4 py-2 text-sm font-bold tracking-widest transition rounded-full" onClick={() => { addToCart(product, qty); setQty(1); }}>ADD</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function HomePage({ isAntigravityOn, addToCart }) {
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
              <Zap size={14} md:size={20} fill="currentColor" />
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

      {/* Products Section */}
      <section id="products" className="relative w-full min-h-screen py-32 px-6 md:px-16 overflow-hidden transition-colors duration-1000">
        <div className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none z-0 ${isAntigravityOn ? 'opacity-100' : 'opacity-0'}`} style={{ background: 'radial-gradient(circle at center, rgba(153,0,0,0.15) 0%, rgba(0,0,0,1) 70%)' }} />
        <div className={`absolute inset-0 bg-neutral-950 transition-opacity duration-1000 pointer-events-none z-0 ${isAntigravityOn ? 'opacity-0' : 'opacity-100'}`} />
        <div className="max-w-7xl mx-auto relative z-20">
          <div className="mb-12 md:mb-16">
            <h2 className="text-4xl md:text-6xl font-black italic uppercase leading-tight">Arsenal <br className="sm:hidden" /> <span className={isAntigravityOn ? "text-red-500 transition-colors duration-1000" : "text-cyan-400 transition-colors duration-1000"}>Selection.</span></h2>
            <p className="text-gray-400 text-sm md:text-lg mt-4 max-w-xl transition-colors duration-1000 leading-relaxed">
              {isAntigravityOn 
                ? "Choose your tuning. Eight distinct profiles designed to optimize your neural and physical RPMs. Includes extreme-yield caffeinated beverages." 
                : "Smooth endurance. Eight essential hydration protocols built to keep the engine running across long sectors. Includes non-caffeinated endurance beverages."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FLAVORS.map((product, i) => <ProductCard key={product.id} product={product} i={i} isAntigravityOn={isAntigravityOn} addToCart={addToCart} />)}
          </div>
        </div>
      </section>
    </>
  );
}
