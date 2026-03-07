import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true);

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
        <p className="text-gray-400 text-xs md:text-sm mb-8 leading-relaxed">
          {isSignIn ? 'Enter your telemetry data to continue.' : 'Register new driver profile.'}
        </p>
        
        <form className="flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
          {!isSignIn && (
            <input 
              type="text" 
              placeholder="CALLSIGN (NAME)" 
              className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-red-600 transition tracking-widest text-sm"
            />
          )}
          <input 
            type="email" 
            placeholder="DRIVER LOGON (EMAIL)" 
            className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-red-600 transition tracking-widest text-sm"
          />
          <input 
            type="password" 
            placeholder="SECURITY KEY (PASSWORD)" 
            className="w-full bg-black/50 border border-white/10 px-4 py-3 focus:outline-none focus:border-red-600 transition tracking-widest text-sm"
          />
          
          <button className="w-full bg-red-600 hover:bg-white text-white hover:text-black transition py-4 font-black italic tracking-widest mt-4 flex justify-center items-center gap-2">
            {isSignIn ? 'INITIALIZE LAUNCH' : 'CREATE PROFILE'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-500 tracking-wider">
          {isSignIn ? "Don't have a profile? " : "Already registered? "}
          <button 
            onClick={() => setIsSignIn(!isSignIn)}
            className="text-white hover:text-red-500 font-bold transition uppercase ml-1"
          >
            {isSignIn ? 'Sign Up' : 'Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
