import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

const AI_RESPONSES = [
  {
    keywords: ['shipping', 'track', 'order', 'delivery', 'drop'],
    reply: 'All fuel drop-zones are actively monitored. Once an order is placed, your telemetry will track it live via the Order History grid.'
  },
  {
    keywords: ['caffeine', 'energy', 'strong', 'mg'],
    reply: 'Adrenaline utilizes a high-octane 180mg synthetic caffeine payload per can, engineered for 2.9s neural linkage. Consume responsibly.'
  },
  {
    keywords: ['antigravity', 'mode', 'red', 'blue'],
    reply: 'Antigravity Mode simulates F1 aerodynamics. ON (Red) enables extreme-yield caffeinated profiles. OFF (Blue) restricts the grid to non-caffeinated endurance protocols.'
  },
  {
    keywords: ['price', 'cost', 'buy', 'cart'],
    reply: 'Standard fuel cells are $4.99 per unit. Bulk requisitions (12+ units) engage automatic wholesale parameters at checkout.'
  },
  {
    keywords: ['refund', 'return', 'cancel', 'broken'],
    reply: 'Compromised containment vessels (damaged cans) can be refunded natively through the Order History log within 48 hours of drop-zone arrival.'
  },
  {
    keywords: ['flavor', 'flavors', 'taste', 'options', 'arsenal'],
    reply: 'Our Arsenal Selection features 8 distinct profiles: Cranberry, Blueberry, Minty Lagoon, Peach Water, Green Apple, Sour Cherry, Black Currant, and Tangy Orange.'
  }
];

const DEFAULT_REPLY = "Negative inference. My logic parameters couldn't parse that. Can I clarify details regarding shipping, flavors, caffeine yields, or Antigravity tuning?";

export default function AgentWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "ADRENALINE AI CORE ONLINE. How can I assist your telemetry today, Driver?", sender: 'ai' }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const userMessage = { id: Date.now(), text: inputVal, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputVal('');
    setIsTyping(true);

    const lowercaseInput = userMessage.text.toLowerCase();
    
    // Semantic Matching Logic
    let replyText = DEFAULT_REPLY;
    for (const data of AI_RESPONSES) {
      if (data.keywords.some(word => lowercaseInput.includes(word))) {
        replyText = data.reply;
        break;
      }
    }

    // Simulate Processing Delay
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, text: replyText, sender: 'ai' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col items-end max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mb-4 w-full sm:w-80 md:w-96 bg-neutral-900 border border-white/10 shadow-2xl overflow-hidden flex flex-col h-[400px] sm:h-[500px]"
          >
            {/* Header */}
            <div className="bg-black border-b border-red-900/40 p-4 flex justify-between items-center relative">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 to-red-900" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center border border-red-500/50 relative overflow-hidden">
                  <Bot size={18} />
                  <motion.div 
                    animate={{ opacity: [0, 0.5, 0] }} 
                    transition={{ repeat: Infinity, duration: 2 }} 
                    className="absolute inset-0 bg-red-500" 
                  />
                </div>
                <div>
                  <h3 className="font-black italic uppercase text-sm">AI Copilot</h3>
                  <p className="text-[9px] text-green-400 font-mono">SYSTEM_ONLINE</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white transition">
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-gradient-to-b from-black/20 to-neutral-900/50">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border ${msg.sender === 'user' ? 'bg-white/10 border-white/20 text-gray-300' : 'bg-red-900/20 border-red-500/30 text-red-400'}`}>
                    {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3 text-sm leading-relaxed ${msg.sender === 'user' ? 'bg-white/10 text-white rounded-l-xl rounded-br-xl' : 'bg-black/60 border border-white/5 text-gray-300 rounded-r-xl rounded-bl-xl font-mono tracking-tight'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3 max-w-[80%] self-start">
                  <div className="w-8 h-8 rounded-full bg-red-900/20 border-red-500/30 text-red-500 flex items-center justify-center flex-shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="bg-black/60 border border-white/5 p-4 rounded-r-xl rounded-bl-xl flex gap-1 items-center">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Form */}
            <div className="p-3 border-t border-white/10 bg-black flex gap-2">
              <input 
                type="text" 
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Query AI Parameters..."
                className="flex-1 bg-white/5 border border-white/10 px-4 py-2 text-sm focus:outline-none focus:border-red-500 transition text-white placeholder-gray-600 font-mono"
              />
              <button 
                onClick={handleSend}
                disabled={!inputVal.trim() || isTyping}
                className="bg-red-600 hover:bg-white text-white hover:text-black transition px-4 py-2 disabled:opacity-50 disabled:hover:bg-red-600 disabled:hover:text-white flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.3)] flex items-center justify-center transition-colors border ${isOpen ? 'bg-black border-red-500 text-red-500' : 'bg-red-600 border-red-500 hover:bg-red-700 text-white'}`}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </motion.button>
    </div>
  );
}
