import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Zap, Sparkles, Scale, Package, ChevronRight } from 'lucide-react';
import { API_BASE, getAuthHeader } from '../utils/auth';

const SUGGESTED_QUERIES = [
  "Find zero-sugar drinks",
  "Which drink has the highest caffeine?",
  "Compare Cranberry and Peach",
  "Where is my order?",
  "What is your shipping policy?"
];

export default function AgentWidget({ addToCart }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "ADRENALINE AI CORE ONLINE. Powered by real-time telemetry tools. How can I assist your pit stop today, Driver?", 
      sender: 'ai',
      toolCalled: null,
      data: null
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (customText = null) => {
    const textToSend = customText || inputVal;
    if (!textToSend.trim()) return;

    const userMessage = { id: Date.now(), text: textToSend, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    if (!customText) setInputVal('');
    setIsTyping(true);

    try {
      const res = await fetch(`${API_BASE}/api/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ message: textToSend })
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now() + 1, 
            text: result.reply, 
            sender: 'ai',
            toolCalled: result.toolCalled,
            data: result.data
          }
        ]);
      } else {
        setMessages(prev => [
          ...prev, 
          { 
            id: Date.now() + 1, 
            text: result.error || "Telemetry glitch encountered while connecting to AI Core.", 
            sender: 'ai',
            isError: true
          }
        ]);
      }
    } catch (err) {
      // Local fallback if server unreachable
      setMessages(prev => [
        ...prev, 
        { 
          id: Date.now() + 1, 
          text: "Telemetry relay timeout. Ensure your Adrenaline backend server is active on port 5001.", 
          sender: 'ai',
          isError: true
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col items-end max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="mb-4 w-full sm:w-96 md:w-[420px] bg-neutral-900 border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col h-[520px] rounded-xl"
          >
            {/* Header */}
            <div className="bg-black/90 border-b border-white/10 p-4 flex justify-between items-center relative backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 via-yellow-500 to-red-600" />
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/50 relative overflow-hidden">
                  <Bot size={20} />
                  <motion.div 
                    animate={{ opacity: [0, 0.4, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }} 
                    className="absolute inset-0 bg-red-500" 
                  />
                </div>
                <div>
                  <h3 className="font-black italic uppercase text-sm tracking-wider flex items-center gap-2">
                    AI Copilot
                    <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.2 rounded font-mono font-normal">v2.0 TOOLS</span>
                  </h3>
                  <p className="text-[9px] text-green-400 font-mono tracking-widest">GRID_TELEMETRY_LINKED</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-gray-400 hover:text-white transition p-1 hover:bg-white/10 rounded-full cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gradient-to-b from-black/60 to-neutral-950/80">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 max-w-[90%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center border text-xs ${msg.sender === 'user' ? 'bg-white/10 border-white/20 text-gray-300' : 'bg-red-900/30 border-red-500/40 text-red-400'}`}>
                    {msg.sender === 'user' ? <User size={13} /> : <Bot size={13} />}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className={`p-3 text-xs leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-red-600 text-white font-medium rounded-2xl rounded-tr-none' 
                        : msg.isError
                          ? 'bg-red-950/80 border border-red-500/40 text-red-300 rounded-2xl rounded-tl-none font-mono text-[11px]'
                          : 'bg-black/70 border border-white/10 text-gray-200 rounded-2xl rounded-tl-none font-sans'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Rich Data Display: Products list */}
                    {msg.data && (msg.data.products || msg.data.recommendations) && (
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {(msg.data.products || msg.data.recommendations).map(p => (
                          <div key={p.slug} className="bg-neutral-900 border border-white/10 p-2.5 rounded-lg flex flex-col items-center text-center">
                            <img src={p.img} alt={p.name} className="w-12 h-16 object-contain mb-1" />
                            <span className="text-[10px] font-black italic uppercase line-clamp-1">{p.name}</span>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[9px] font-mono text-gray-400">
                              <span className="text-white font-bold">{p.price}</span>
                              {p.caffeine && <span className="text-red-400">{p.caffeine}</span>}
                            </div>
                            {addToCart && (
                              <button 
                                onClick={() => addToCart({ id: p.slug, name: p.name, price: p.price, img: p.img, desc: p.desc }, 1)}
                                className="w-full mt-2 bg-red-600/80 hover:bg-red-600 text-white text-[9px] py-1 font-bold rounded tracking-wider transition uppercase cursor-pointer"
                              >
                                Add to Cart
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Rich Data Display: Comparison Table */}
                    {msg.data && msg.data.comparison && (
                      <div className="bg-black/80 border border-white/10 rounded-lg p-2.5 mt-1 font-mono text-[10px]">
                        <div className="flex items-center gap-1.5 text-yellow-400 font-bold mb-2 pb-1 border-b border-white/10 uppercase">
                          <Scale size={12} />
                          Telemetry Comparison
                        </div>
                        <div className="grid grid-cols-3 gap-1 font-bold text-gray-400 border-b border-white/10 pb-1 mb-1">
                          <span>Metric</span>
                          {msg.data.comparison.map(c => (
                            <span key={c.slug} className="text-white truncate">{c.name.split(' ')[0]}</span>
                          ))}
                        </div>
                        <div className="grid grid-cols-3 gap-1 py-0.5">
                          <span className="text-gray-400">Price</span>
                          {msg.data.comparison.map(c => <span key={c.slug}>{c.price}</span>)}
                        </div>
                        <div className="grid grid-cols-3 gap-1 py-0.5 text-red-400">
                          <span className="text-gray-400">Caffeine</span>
                          {msg.data.comparison.map(c => <span key={c.slug}>{c.caffeine}</span>)}
                        </div>
                        <div className="grid grid-cols-3 gap-1 py-0.5 text-cyan-400">
                          <span className="text-gray-400">Sugar</span>
                          {msg.data.comparison.map(c => <span key={c.slug}>{c.sugar}</span>)}
                        </div>
                        <div className="grid grid-cols-3 gap-1 py-0.5 text-green-400">
                          <span className="text-gray-400">Stock</span>
                          {msg.data.comparison.map(c => <span key={c.slug}>{c.stock} units</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 max-w-[80%] self-start">
                  <div className="w-7 h-7 rounded-full bg-red-900/30 border border-red-500/40 text-red-500 flex items-center justify-center flex-shrink-0">
                    <Bot size={13} />
                  </div>
                  <div className="bg-black/60 border border-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1.5 items-center">
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick suggestion chips */}
            <div className="px-3 py-2 bg-black/60 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {SUGGESTED_QUERIES.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={isTyping}
                  className="whitespace-nowrap px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 rounded-full text-[10px] text-gray-300 transition shrink-0 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-white/10 bg-black flex gap-2">
              <input 
                type="text" 
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask telemetry, search drinks, track orders..."
                className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-xs focus:outline-none focus:border-red-500 transition text-white placeholder-gray-500 font-sans rounded"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!inputVal.trim() || isTyping}
                className="bg-red-600 hover:bg-white text-white hover:text-black transition px-3 py-2 disabled:opacity-50 disabled:hover:bg-red-600 disabled:hover:text-white flex items-center justify-center rounded cursor-pointer"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-[0_0_25px_rgba(220,38,38,0.4)] flex items-center justify-center transition-all border ${isOpen ? 'bg-black border-red-500 text-red-500' : 'bg-red-600 border-red-400 hover:bg-red-700 text-white'}`}
      >
        {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
      </motion.button>
    </div>
  );
}
