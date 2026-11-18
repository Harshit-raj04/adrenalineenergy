import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Flag, 
  Calendar, 
  MapPin, 
  Gauge, 
  Zap, 
  Flame, 
  Ticket, 
  Timer, 
  Clock, 
  Activity, 
  Award, 
  CheckCircle2, 
  Radio, 
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { getUser } from '../utils/auth';

const F1_RACES = [
  {
    round: '01',
    name: 'BAHRAIN GRAND PRIX',
    circuit: 'Bahrain International Circuit, Sakhir',
    country: '🇧🇭 Bahrain',
    date: 'MAR 20 - 22, 2026',
    status: 'SEASON OPENER',
    trackType: 'Night Race',
    length: '5.412 km',
    laps: 57,
    topSpeed: '338 km/h',
    drsZones: 3,
    featured: false,
    activation: 'Desert Night Neon Lounge + 10,000 Ice-Cold Can Drops at Main Grandstand',
    bgGradient: 'from-amber-600/20 via-red-950/40 to-black',
    accentColor: 'border-amber-500/50 text-amber-400',
  },
  {
    round: '06',
    name: 'MIAMI GRAND PRIX',
    circuit: 'Miami International Autodrome',
    country: '🇺🇸 United States',
    date: 'MAY 01 - 03, 2026',
    status: 'FAST-PACED',
    trackType: 'Street Circuit',
    length: '5.412 km',
    laps: 57,
    topSpeed: '344 km/h',
    drsZones: 3,
    featured: false,
    activation: 'Adrenaline Marina Beach Club + High-Octane DJ Stage at Turn 12',
    bgGradient: 'from-cyan-600/20 via-blue-950/40 to-black',
    accentColor: 'border-cyan-500/50 text-cyan-400',
  },
  {
    round: '08',
    name: 'MONACO GRAND PRIX',
    circuit: 'Circuit de Monaco, Monte Carlo',
    country: '🇲🇨 Monaco',
    date: 'MAY 22 - 24, 2026',
    status: 'CROWN JEWEL',
    trackType: 'Street Circuit',
    length: '3.337 km',
    laps: 78,
    topSpeed: '295 km/h',
    drsZones: 1,
    featured: true,
    activation: 'Official Adrenaline Superyacht in Port Hercule + Paddock Club Apex Suite',
    bgGradient: 'from-red-600/30 via-neutral-900/60 to-black',
    accentColor: 'border-red-500/70 text-red-500',
  },
  {
    round: '12',
    name: 'BRITISH GRAND PRIX',
    circuit: 'Silverstone Circuit, Northamptonshire',
    country: '🇬🇧 Great Britain',
    date: 'JUL 03 - 05, 2026',
    status: 'HOME OF SPEED',
    trackType: 'High Speed',
    length: '5.891 km',
    laps: 52,
    topSpeed: '352 km/h',
    drsZones: 2,
    featured: false,
    activation: 'Copse Corner High-G Soundstage + Driver Sim-Rig Challenge Zone',
    bgGradient: 'from-emerald-600/20 via-slate-900/40 to-black',
    accentColor: 'border-emerald-500/50 text-emerald-400',
  },
  {
    round: '14',
    name: 'BELGIAN GRAND PRIX',
    circuit: 'Circuit de Spa-Francorchamps, Stavelot',
    country: '🇧🇪 Belgium',
    date: 'JUL 24 - 26, 2026',
    status: 'ROLLERCOASTER',
    trackType: 'High Speed',
    length: '7.004 km',
    laps: 44,
    topSpeed: '348 km/h',
    drsZones: 2,
    featured: false,
    activation: 'Eau Rouge Full-Throttle Lookout Deck & Free Thermal Insulator Sleeves',
    bgGradient: 'from-yellow-600/20 via-red-950/40 to-black',
    accentColor: 'border-yellow-500/50 text-yellow-400',
  },
  {
    round: '16',
    name: 'ITALIAN GRAND PRIX',
    circuit: 'Autodromo Nazionale Monza',
    country: '🇮🇹 Italy',
    date: 'SEP 04 - 06, 2026',
    status: 'TEMPLE OF SPEED',
    trackType: 'High Speed',
    length: '5.793 km',
    laps: 53,
    topSpeed: '360 km/h',
    drsZones: 2,
    featured: false,
    activation: 'Curva Parabolica Adrenaline Red Zone & Tifosi Fuel Bars',
    bgGradient: 'from-red-700/20 via-rose-950/40 to-black',
    accentColor: 'border-red-500/50 text-red-400',
  },
  {
    round: '18',
    name: 'SINGAPORE GRAND PRIX',
    circuit: 'Marina Bay Street Circuit',
    country: '🇸🇬 Singapore',
    date: 'OCT 02 - 04, 2026',
    status: 'ELECTRO NIGHT',
    trackType: 'Night Race',
    length: '4.940 km',
    laps: 62,
    topSpeed: '320 km/h',
    drsZones: 3,
    featured: false,
    activation: 'Marina Bay Electro-Dome: High-Humidity Hydration Lab & Hologram Car',
    bgGradient: 'from-purple-600/20 via-indigo-950/40 to-black',
    accentColor: 'border-purple-500/50 text-purple-400',
  },
  {
    round: '22',
    name: 'LAS VEGAS GRAND PRIX',
    circuit: 'Las Vegas Strip Circuit, Nevada',
    country: '🇺🇸 United States',
    date: 'NOV 19 - 21, 2026',
    status: 'NEON SHOWDOWN',
    trackType: 'Night Race',
    length: '6.201 km',
    laps: 50,
    topSpeed: '350 km/h',
    drsZones: 2,
    featured: true,
    activation: 'The Strip Roof-Deck Party + 50ft Adrenaline Holographic Energy Can Display',
    bgGradient: 'from-fuchsia-600/30 via-neutral-900/60 to-black',
    accentColor: 'border-fuchsia-500/70 text-fuchsia-400',
  },
  {
    round: '24',
    name: 'ABU DHABI GRAND PRIX',
    circuit: 'Yas Marina Circuit',
    country: '🇦🇪 United Arab Emirates',
    date: 'DEC 04 - 06, 2026',
    status: 'SEASON FINALE',
    trackType: 'Night Race',
    length: '5.281 km',
    laps: 58,
    topSpeed: '335 km/h',
    drsZones: 2,
    featured: false,
    activation: 'Championship Podium Toast with Gold-Edition Adrenaline Apex Cans',
    bgGradient: 'from-yellow-500/20 via-orange-950/40 to-black',
    accentColor: 'border-yellow-400/50 text-yellow-300',
  }
];

export default function EventsPage() {
  const [filter, setFilter] = useState('ALL');
  const [selectedRaceForPass, setSelectedRaceForPass] = useState(null);
  const [passForm, setPassForm] = useState({
    name: '',
    email: '',
    driverTier: 'VIP Paddock Club',
    guests: '1',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-fill logged-in user details if available
  useEffect(() => {
    const user = getUser();
    if (user) {
      setPassForm(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, []);

  const filteredRaces = F1_RACES.filter(race => {
    if (filter === 'ALL') return true;
    if (filter === 'STREET') return race.trackType === 'Street Circuit';
    if (filter === 'SPEED') return race.trackType === 'High Speed';
    if (filter === 'NIGHT') return race.trackType === 'Night Race';
    return true;
  });

  const handlePassSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedRaceForPass(null);
    }, 3500);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 md:px-12 pt-20 pb-36 relative z-10">
      
      {/* ─── Hero Sponsorship Banner ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-2xl border border-red-600/30 bg-gradient-to-r from-red-950/60 via-black to-neutral-950 p-6 md:p-12 mb-16 shadow-[0_0_50px_rgba(220,38,38,0.2)]"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 font-mono text-xs tracking-widest uppercase mb-4">
              <Flame size={14} className="animate-pulse" />
              OFFICIAL GLOBAL ENERGY SPONSOR OF FORMULA 1®
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
              F1® WORLD <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-rose-400 to-white">CHAMPIONSHIP</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mt-4 leading-relaxed font-normal">
              Fuelling 20 drivers at 350+ km/h. Adrenaline delivers high-G cognitive stamina, zero sugar crashes, and uninterrupted focus through 24 Grand Prix circuits worldwide.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 font-mono">
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-widest block">Races Sponsored</span>
                <span className="text-2xl md:text-3xl font-black text-white">24 GP</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-widest block">Peak Velocity</span>
                <span className="text-2xl md:text-3xl font-black text-red-500">360 KM/H</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-widest block">G-Force Stamina</span>
                <span className="text-2xl md:text-3xl font-black text-cyan-400">5.5G</span>
              </div>
              <div>
                <span className="text-xs text-gray-400 uppercase tracking-widest block">Pit Stops Fueled</span>
                <span className="text-2xl md:text-3xl font-black text-yellow-400">1.8 SEC</span>
              </div>
            </div>
          </div>

          {/* Title Sponsor Badge Callout */}
          <div className="w-full lg:w-80 bg-black/60 border border-white/10 p-6 rounded-xl flex flex-col items-center text-center backdrop-blur-md">
            <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-500/50 flex items-center justify-center text-red-500 mb-4 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
              <Trophy size={32} />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">EXCLUSIVE PADDOCK INVITATIONAL</span>
            <h4 className="text-lg font-black italic tracking-wide text-white mt-1">WIN PADDOCK CLUB PASSES</h4>
            <p className="text-xs text-gray-400 mt-2 mb-4 leading-relaxed">
              Step behind the pit wall. VIP access to the Adrenaline Garage, paddock hospitality, and driver warmups.
            </p>
            <button 
              onClick={() => setSelectedRaceForPass(F1_RACES[2])} // Default to Monaco
              className="w-full py-3 bg-red-600 hover:bg-white hover:text-black text-white font-black uppercase tracking-wider text-xs skew-x-[-10deg] transition shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer"
            >
              <span className="skew-x-[10deg] flex items-center justify-center gap-2">
                <Ticket size={14} />
                ENTER VIP GIVEAWAY
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ─── Spotlight Race Banner (Monaco GP) ─── */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 bg-neutral-900/80 border border-white/10 rounded-2xl overflow-hidden relative"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-red-600 text-white font-mono text-xs font-black rounded uppercase tracking-wider">
                  ROUND 08 • SPOTLIGHT
                </span>
                <span className="text-gray-400 text-xs font-mono uppercase tracking-widest flex items-center gap-1">
                  <MapPin size={12} className="text-red-500" />
                  Circuit de Monaco, Monte Carlo 🇲🇨
                </span>
                <span className="text-yellow-400 text-xs font-mono uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} />
                  MAY 22 - 24, 2026
                </span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black italic uppercase tracking-tight text-white mt-2">
                MONACO GRAND PRIX : <span className="text-red-500">THE HARBOR TAKEOVER</span>
              </h2>
              <p className="text-gray-400 text-sm mt-3 leading-relaxed max-w-2xl">
                Experience the most prestigious motorsport weekend on earth. As title beverage partner, Adrenaline commands Port Hercule with an exclusive 150ft superyacht lounge, rooftop DJ sets, and trackside energy fueling stations directly above the Nouvelle Chicane.
              </p>

              <div className="grid grid-cols-3 gap-4 mt-6 p-4 bg-black/40 rounded-xl border border-white/5 max-w-lg font-mono">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Track Length</span>
                  <span className="text-sm font-bold text-white">3.337 KM</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Total Laps</span>
                  <span className="text-sm font-bold text-white">78 LAPS</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Adrenaline Yacht</span>
                  <span className="text-sm font-bold text-cyan-400">PORT HERCULE</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button 
                onClick={() => setSelectedRaceForPass(F1_RACES[2])}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 rounded transition cursor-pointer"
              >
                <Ticket size={16} />
                REQUEST MONACO VIP PADDOCK PASS
              </button>
              <div className="text-xs text-gray-400 font-mono flex items-center gap-1.5">
                <Radio size={14} className="text-green-400 animate-pulse" />
                OFFICIAL BROADCAST & TRACKSIDE SPONSOR
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-gradient-to-br from-red-950/40 via-neutral-900 to-black p-6 sm:p-10 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-center">
            <h3 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-4 flex items-center gap-2">
              <Activity size={14} />
              COCKPIT TELEMETRY METRICS
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-gray-400">Driver Cognitive Focus</span>
                  <span className="text-green-400">99.4% (+14%)</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-[99%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-gray-400">Reflex Reaction Speed</span>
                  <span className="text-cyan-400">0.12s (Optimal)</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full w-[94%]" />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-mono mb-1">
                  <span className="text-gray-400">Electrolyte Replenishment</span>
                  <span className="text-red-400">Rapid Cellular</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-[90%]" />
                </div>
              </div>
            </div>
            <p className="text-[11px] text-gray-500 mt-6 leading-tight">
              Formula 1 drivers lose up to 3kg of fluids in a 2-hour GP. Adrenaline Apex formulation is designed to maintain neural conduction without glycemic crash.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ─── Grand Prix Calendar Section ─── */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-white/10 pb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tight text-white flex items-center gap-3">
            <Calendar className="text-red-500" />
            2026 RACE CALENDAR & FAN ACTIVATIONS
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Catch the Adrenaline crew, grab ice-cold cans at trackside fan hubs, and experience live sim-rig challenges.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'ALL', label: 'ALL ROUNDS' },
            { id: 'STREET', label: 'STREET TRACKS' },
            { id: 'SPEED', label: 'HIGH SPEED' },
            { id: 'NIGHT', label: 'NIGHT RACES' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full transition cursor-pointer ${
                filter === tab.id
                  ? 'bg-red-600 text-white font-bold shadow-[0_0_15px_rgba(220,38,38,0.5)]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Race Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRaces.map((race, index) => (
          <motion.div
            key={race.round}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className={`relative bg-neutral-900 border ${race.accentColor} rounded-xl p-6 flex flex-col justify-between overflow-hidden group hover:border-white/40 transition-all duration-300 shadow-lg`}
          >
            {/* Top Row: Round & Flag */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/60 border border-white/10 text-gray-300">
                  ROUND {race.round}
                </span>
                <span className="text-sm">{race.country}</span>
              </div>

              <h3 className="text-xl font-black italic uppercase tracking-tight text-white group-hover:text-red-500 transition-colors">
                {race.name}
              </h3>
              <p className="text-xs text-gray-400 font-mono mt-1 flex items-center gap-1.5">
                <MapPin size={12} className="text-red-500 shrink-0" />
                {race.circuit}
              </p>

              {/* Race Date & Tag */}
              <div className="mt-4 flex items-center justify-between py-2 border-y border-white/5 text-xs font-mono">
                <span className="text-yellow-400 font-bold flex items-center gap-1">
                  <Calendar size={12} />
                  {race.date}
                </span>
                <span className="text-gray-400 bg-white/5 px-2 py-0.5 rounded">
                  {race.trackType}
                </span>
              </div>

              {/* Circuit Specs */}
              <div className="grid grid-cols-3 gap-2 my-4 text-center font-mono text-[11px] bg-black/40 p-2.5 rounded">
                <div>
                  <span className="text-gray-500 block text-[9px]">LENGTH</span>
                  <span className="font-bold text-gray-200">{race.length}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[9px]">LAPS</span>
                  <span className="font-bold text-gray-200">{race.laps}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[9px]">MAX SPEED</span>
                  <span className="font-bold text-red-400">{race.topSpeed}</span>
                </div>
              </div>

              {/* Brand Activation Callout */}
              <div className="mt-2 text-xs bg-red-950/20 border border-red-900/30 p-3 rounded text-gray-300">
                <span className="font-mono text-[10px] uppercase text-red-400 font-bold block mb-1 flex items-center gap-1">
                  <Zap size={11} /> ADRENALINE ZONE ACTIVATION
                </span>
                {race.activation}
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
              <button
                onClick={() => setSelectedRaceForPass(race)}
                className="w-full py-2.5 bg-white/5 hover:bg-red-600 hover:text-white text-gray-200 font-bold text-xs uppercase tracking-wider rounded transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Ticket size={14} />
                ENTER FOR PADDOCK PASS
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── Paddock Hospitality & Trackside Experience Section ─── */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 border border-white/10 p-6 rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mb-4">
            <Flag size={24} />
          </div>
          <h4 className="text-lg font-black italic uppercase text-white">Trackside Fuel Stations</h4>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Free, ice-cold Adrenaline cans distributed at all official F1 Fan Zones throughout the Grand Prix weekend. Scan your ticket barcode for instant access.
          </p>
        </div>

        <div className="bg-neutral-900 border border-white/10 p-6 rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-4">
            <Gauge size={24} />
          </div>
          <h4 className="text-lg font-black italic uppercase text-white">Sim-Rig Apex Challenge</h4>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Compete on full-motion hydraulic racing simulators in the Adrenaline Dome. Set the fastest lap of the weekend to win signed driver helmets and a 1-year drink supply.
          </p>
        </div>

        <div className="bg-neutral-900 border border-white/10 p-6 rounded-xl">
          <div className="w-12 h-12 rounded-lg bg-yellow-600/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 mb-4">
            <Award size={24} />
          </div>
          <h4 className="text-lg font-black italic uppercase text-white">VIP Paddock Club Hospitality</h4>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">
            Five-star culinary cuisine, open pit lane walks, live driver telemetry debriefs, and prime elevated views above the starting grid.
          </p>
        </div>
      </div>

      {/* ─── Modal for Paddock Pass Raffle Entry ─── */}
      <AnimatePresence>
        {selectedRaceForPass && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="bg-neutral-900 border border-white/15 p-6 md:p-8 w-full max-w-lg relative rounded-2xl shadow-2xl overflow-hidden"
            >
              <button 
                onClick={() => setSelectedRaceForPass(null)} 
                className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded-full cursor-pointer transition"
              >
                <X size={20} />
              </button>

              {isSubmitted ? (
                <div className="py-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-green-500/20 border border-green-500 rounded-full flex items-center justify-center text-green-400 mb-4 animate-bounce">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-2xl font-black italic uppercase text-white">
                    TELEMETRY TRANSMITTED!
                  </h3>
                  <p className="text-gray-300 text-sm mt-2 max-w-sm">
                    Your VIP hospitality entry for the <span className="text-red-400 font-bold">{selectedRaceForPass.name}</span> has been confirmed. Winners will be contacted 14 days prior to race weekend.
                  </p>
                  <div className="mt-6 px-4 py-2 bg-white/5 border border-white/10 rounded font-mono text-xs text-cyan-400">
                    STATUS: PADDOCK_RAFFLE_ACTIVE
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-xs font-mono text-red-500 uppercase tracking-widest mb-1">
                    <Flame size={14} /> ADRENALINE VIP HOSPITALITY INVITATIONAL
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black italic uppercase text-white">
                    {selectedRaceForPass.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-1">
                    {selectedRaceForPass.circuit} • {selectedRaceForPass.date}
                  </p>

                  <form onSubmit={handlePassSubmit} className="mt-6 space-y-4">
                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                        Driver Full Name
                      </label>
                      <input 
                        type="text" 
                        required
                        value={passForm.name}
                        onChange={e => setPassForm({...passForm, name: e.target.value})}
                        placeholder="e.g. Max Sterling"
                        className="w-full bg-black/60 border border-white/10 px-4 py-2.5 rounded text-white text-sm focus:border-red-500 focus:outline-none font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                        Contact Email
                      </label>
                      <input 
                        type="email" 
                        required
                        value={passForm.email}
                        onChange={e => setPassForm({...passForm, email: e.target.value})}
                        placeholder="driver@adrenaline.test"
                        className="w-full bg-black/60 border border-white/10 px-4 py-2.5 rounded text-white text-sm focus:border-red-500 focus:outline-none font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                          Pass Tier
                        </label>
                        <select 
                          value={passForm.driverTier}
                          onChange={e => setPassForm({...passForm, driverTier: e.target.value})}
                          className="w-full bg-black/60 border border-white/10 px-3 py-2.5 rounded text-white text-xs focus:border-red-500 focus:outline-none font-sans"
                        >
                          <option value="VIP Paddock Club">VIP Paddock Club</option>
                          <option value="Garage Tour Pass">Garage Tour Pass</option>
                          <option value="Grandstand Apex">Grandstand Apex</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-gray-400 uppercase tracking-wider mb-1">
                          Pass Quantity
                        </label>
                        <select 
                          value={passForm.guests}
                          onChange={e => setPassForm({...passForm, guests: e.target.value})}
                          className="w-full bg-black/60 border border-white/10 px-3 py-2.5 rounded text-white text-xs focus:border-red-500 focus:outline-none font-sans"
                        >
                          <option value="1">1 Pass</option>
                          <option value="2">2 Passes (Pair)</option>
                          <option value="4">4 Passes (Team)</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-red-600 hover:bg-white hover:text-black text-white font-black uppercase tracking-wider text-xs skew-x-[-10deg] transition shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer"
                      >
                        <span className="skew-x-[10deg] flex items-center justify-center gap-2">
                          <Ticket size={16} />
                          CONFIRM & TRANSMIT ENTRY
                        </span>
                      </button>
                      <p className="text-[10px] text-gray-500 font-mono text-center mt-2">
                        NO PURCHASE NECESSARY. POWERED BY ADRENALINE TELEMETRY ENGINE.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

