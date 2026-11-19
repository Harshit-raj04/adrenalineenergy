import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Trophy, 
  Flag, 
  Zap, 
  MapPin, 
  Sparkles,
  ArrowRight,
  Flame
} from 'lucide-react';

const EVENTS_SLIDES = [
  {
    id: 'monaco',
    title: 'Adrenaline Monaco Grand Prix 2026',
    subtitle: 'The crown jewel in Port Hercule: VIP superyacht lounge, rooftop DJ sets & pit wall telemetry.',
    date: '22 - 24 May 2026',
    category: 'F1 Street Circuit',
    location: 'Monte Carlo, Monaco',
    badgeText: 'CROWN JEWEL',
    badgeGradient: 'from-amber-500 to-red-600',
    themeBg: 'from-blue-950/90 via-slate-950/80 to-black',
    accentColor: '#dc2626',
    speedKpi: '335 KM/H',
    staminaKpi: '5.2G CORNERING',
    bgVisual: 'monaco'
  },
  {
    id: 'vegas',
    title: 'Adrenaline Las Vegas Grand Prix 2026',
    subtitle: 'Full throttle down the Strip at 350 km/h under 100,000 lumens of neon & the 50ft Adrenaline Hologram.',
    date: '19 - 21 November 2026',
    category: 'F1 Night Race',
    location: 'Las Vegas Strip, USA',
    badgeText: 'NEON SHOWDOWN',
    badgeGradient: 'from-fuchsia-500 to-indigo-600',
    themeBg: 'from-purple-950/90 via-slate-950/80 to-black',
    accentColor: '#d946ef',
    speedKpi: '350 KM/H',
    staminaKpi: '5.5G CORNERING',
    bgVisual: 'vegas'
  },
  {
    id: 'silverstone',
    title: 'Adrenaline British Grand Prix 2026',
    subtitle: 'Copse, Maggotts & Becketts: Surviving sustained 5.5G cornering loads at the home of motorsport speed.',
    date: '03 - 05 July 2026',
    category: 'High-Speed Circuit',
    location: 'Silverstone Circuit, UK',
    badgeText: 'HOME OF SPEED',
    badgeGradient: 'from-emerald-500 to-cyan-600',
    themeBg: 'from-emerald-950/90 via-slate-950/80 to-black',
    accentColor: '#10b981',
    speedKpi: '352 KM/H',
    staminaKpi: '5.8G CORNERING',
    bgVisual: 'silverstone'
  },
  {
    id: 'singapore',
    title: 'Adrenaline Singapore Grand Prix 2026',
    subtitle: 'The ultimate physical endurance test: 50°C cockpit humidity lab & the Marina Bay Electro-Dome.',
    date: '02 - 04 October 2026',
    category: 'F1 Night Race',
    location: 'Marina Bay Street Circuit',
    badgeText: 'ELECTRO NIGHT',
    badgeGradient: 'from-cyan-500 to-blue-600',
    themeBg: 'from-cyan-950/90 via-slate-950/80 to-black',
    accentColor: '#06b6d4',
    speedKpi: '325 KM/H',
    staminaKpi: '4.8G CORNERING',
    bgVisual: 'singapore'
  },
  {
    id: 'monza',
    title: 'Adrenaline Italian Grand Prix 2026',
    subtitle: '360 km/h slipstream warfare through Curva Parabolica at the historic Temple of Speed.',
    date: '04 - 06 September 2026',
    category: 'High-Speed Circuit',
    location: 'Monza Autodromo, Italy',
    badgeText: 'TEMPLE OF SPEED',
    badgeGradient: 'from-red-600 to-rose-700',
    themeBg: 'from-red-950/90 via-neutral-950/80 to-black',
    accentColor: '#ef4444',
    speedKpi: '360 KM/H',
    staminaKpi: '5.4G CORNERING',
    bgVisual: 'monza'
  }
];

export default function EventsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const totalSlides = EVENTS_SLIDES.length;

  // Auto-play timer (6 seconds, pauses on hover)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(timer);
  }, [isHovered, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const activeEvent = EVENTS_SLIDES[currentSlide];

  return (
    <section 
      className="w-full relative z-20 py-12 px-4 sm:px-6 md:px-12 bg-black overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="max-w-7xl mx-auto relative">
        
        {/* Section Pill Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-red-600 text-white font-mono text-[11px] font-black tracking-widest uppercase rounded flex items-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.4)]">
              <Flame size={12} className="animate-pulse" />
              GLOBAL RACE EXPERIENCES
            </span>
            <span className="text-gray-400 text-xs font-mono uppercase tracking-widest hidden sm:inline-flex items-center gap-1">
              <Flag size={13} className="text-cyan-400" />
              FORMULA 1® TITLE SPONSOR
            </span>
          </div>

          <Link 
            to="/events" 
            className="text-xs font-mono font-bold uppercase tracking-widest text-gray-400 hover:text-white flex items-center gap-1.5 transition group"
          >
            VIEW ALL 24 RACES
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform text-red-500" />
          </Link>
        </div>

        {/* ─── Main Hero Carousel Card (Red Bull Inspired Layout) ─── */}
        <div className="relative w-full min-h-[460px] sm:min-h-[500px] md:min-h-[540px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeEvent.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={`absolute inset-0 bg-gradient-to-br ${activeEvent.themeBg} flex flex-col justify-between p-6 sm:p-10 md:p-16`}
            >
              {/* Atmospheric Background Motion Lights & Sparks */}
              <div 
                className="absolute -top-24 -right-24 w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-all duration-700"
                style={{ backgroundColor: activeEvent.accentColor }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

              {/* Dynamic Silhouette / Motorsport Graphic Backdrop */}
              <div className="absolute right-0 bottom-0 top-0 w-full md:w-3/5 pointer-events-none overflow-hidden flex items-end justify-end opacity-25 md:opacity-40">
                <svg className="w-full h-full max-h-[480px]" viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* F1 High Speed Aerodynamic Slipstream Waves */}
                  <path d="M50 350 C 200 320, 350 380, 580 330" stroke={activeEvent.accentColor} strokeWidth="3" strokeDasharray="12 12" className="animate-pulse" opacity="0.6" />
                  <path d="M0 320 C 180 290, 320 350, 600 300" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="6 6" opacity="0.3" />
                  <path d="M120 280 C 260 250, 420 300, 600 270" stroke={activeEvent.accentColor} strokeWidth="2" opacity="0.5" />
                  
                  {/* High-Octane Speed Trail Polygons */}
                  <polygon points="380,360 480,220 540,240 440,380" fill={activeEvent.accentColor} fillOpacity="0.1" />
                  <polygon points="460,320 560,180 600,200 500,340" fill="#ffffff" fillOpacity="0.05" />

                  {/* F1 Racing Car Geometric Silhouette */}
                  <g transform="translate(180, 160) scale(0.65)" opacity="0.85">
                    <path d="M50 200 L120 190 L180 160 L280 160 L340 185 L480 190 L520 210 L50 210 Z" fill="#ffffff" fillOpacity="0.2" />
                    <circle cx="140" cy="210" r="32" fill="#000000" stroke={activeEvent.accentColor} strokeWidth="6" />
                    <circle cx="430" cy="210" r="32" fill="#000000" stroke={activeEvent.accentColor} strokeWidth="6" />
                    <path d="M220 160 L240 120 L280 120 L300 160 Z" fill={activeEvent.accentColor} fillOpacity="0.6" />
                    <rect x="470" y="160" width="40" height="12" fill={activeEvent.accentColor} />
                  </g>
                </svg>
              </div>

              {/* Top Row: Event Badge & Speed Telemetry Indicators */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md">
                  <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeEvent.badgeGradient} animate-ping`} />
                  <span className="font-mono text-[10px] sm:text-xs font-bold text-white tracking-widest uppercase">
                    {activeEvent.badgeText}
                  </span>
                </div>

                {/* Live Speed / Telemetry KPIs */}
                <div className="hidden sm:flex items-center gap-6 font-mono bg-black/40 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase block">MAX VELOCITY</span>
                    <span className="text-sm font-bold text-red-500">{activeEvent.speedKpi}</span>
                  </div>
                  <div className="w-[1px] h-6 bg-white/10" />
                  <div>
                    <span className="text-[9px] text-gray-400 uppercase block">CORNERING FORCE</span>
                    <span className="text-sm font-bold text-cyan-400">{activeEvent.staminaKpi}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Content Area (Title, Tagline, Red Pill CTA, Badge, Date) */}
              <div className="relative z-10 mt-auto pt-8">
                
                {/* Event Title */}
                <motion.h3 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-tighter text-white max-w-3xl leading-none"
                >
                  {activeEvent.title}
                </motion.h3>

                {/* Subtitle / Description */}
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl mt-3 leading-relaxed font-normal"
                >
                  {activeEvent.subtitle}
                </motion.p>

                {/* Action CTA + Badge Logo + Date/Category Row */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mt-6 sm:mt-8 flex flex-wrap items-center gap-4 sm:gap-6"
                >
                  {/* Red Pill "View Event Info" Button (Direct reference to Red Bull CTA) */}
                  <Link 
                    to="/events"
                    className="px-6 py-3 bg-red-600 hover:bg-white hover:text-black text-white font-black uppercase tracking-wider text-xs sm:text-sm rounded-full transition-all duration-300 flex items-center gap-2 shadow-[0_0_30px_rgba(220,38,38,0.55)] cursor-pointer group"
                  >
                    <Calendar size={16} className="text-white group-hover:text-black transition-colors" />
                    <span>View Event Info</span>
                  </Link>

                  {/* Circular Shield Emblem */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-black via-neutral-900 to-white/10 border border-white/20 flex items-center justify-center text-yellow-400 shadow-md">
                      <Trophy size={18} />
                    </div>

                    {/* Date & Sport/Event Category Info */}
                    <div className="font-mono text-xs text-gray-300">
                      <span className="font-bold text-white block sm:inline">{activeEvent.date}</span>
                      <span className="hidden sm:inline mx-2 text-gray-500">•</span>
                      <span className="text-cyan-400">{activeEvent.category}</span>
                      <span className="hidden sm:inline mx-2 text-gray-500">•</span>
                      <span className="text-gray-400">{activeEvent.location}</span>
                    </div>
                  </div>
                </motion.div>

              </div>

            </motion.div>
          </AnimatePresence>

          {/* ─── Bottom-Left Elongated Dot Pagination (Matching Reference Image) ─── */}
          <div className="absolute bottom-6 left-6 sm:left-10 md:left-16 z-30 flex items-center gap-2">
            {EVENTS_SLIDES.map((slide, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={slide.id}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-400 cursor-pointer rounded-full ${
                    isActive
                      ? 'w-10 h-2 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]'
                      : 'w-2 h-2 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* ─── Navigation Arrows (Right Bottom) ─── */}
          <div className="absolute bottom-6 right-6 sm:right-10 md:right-16 z-30 flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-white hover:text-black text-white border border-white/15 flex items-center justify-center transition backdrop-blur-md cursor-pointer"
              aria-label="Previous event"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-black/60 hover:bg-white hover:text-black text-white border border-white/15 flex items-center justify-center transition backdrop-blur-md cursor-pointer"
              aria-label="Next event"
            >
              <ChevronRight size={20} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

