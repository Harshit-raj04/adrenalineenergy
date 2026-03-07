import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ChevronDown } from 'lucide-react';

const FAQS = [
  { q: "How do I trigger a refund?", a: "Navigate to your Order History from the profile menu. If your fuel drop is eligible and within the 14-day window, you will see a 'REQUEST REFUND' option next to the ticket. Bank processing takes 3-5 business cycles." },
  { q: "Can I cancel my shipment?", a: "Shipments can be cancelled directly from the Order History page as long as the status is still 'PROCESSING'. Once the status updates to 'SHIPPED', it is out of our hands and you must wait for delivery to request a return." },
  { q: "How do I track my order?", a: "Active deployments will show their live coordinates and status directly in the Order Logs. You will also receive automated telemetry updates via your registered Driver Logon email." },
  { q: "What is Adrenaline's Antigravity Mode?", a: "Antigravity Mode simulates high-octane F1 aerodynamics, delivering extreme performance yields (180mg Caffeine, Zero Sugar). Switch it off in the Telemetry bar for a smoother hydration-focused layout." }
];

export default function HelpSupportPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 pt-24 pb-32 relative z-10 min-h-[calc(100vh-80px)]">
      <div className="mb-8 md:mb-12 border-b border-white/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black italic uppercase">HQ <span className="text-cyan-500">Comms</span></h2>
          <p className="text-gray-400 text-sm md:text-base mt-2">Intelligence briefing and direct support channels.</p>
        </div>
        <a 
          href="mailto:support@adrenaline.test"
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/10 hover:bg-white text-white hover:text-black transition px-6 py-3 font-bold tracking-widest text-sm"
        >
          <Mail size={16} />
          CONTACT SUPPORT
        </a>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold tracking-widest text-gray-400 mb-6">FREQUENTLY ASKED QUESTIONS</h3>
        {FAQS.map((faq, i) => (
          <div key={i} className="border border-white/10 bg-neutral-900 overflow-hidden">
            <button 
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="w-full text-left p-6 font-bold tracking-widest flex justify-between items-center hover:bg-white/5 transition"
            >
              {faq.q}
              <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
                <ChevronDown size={20} className="text-cyan-500" />
              </motion.div>
            </button>
            <AnimatePresence>
              {openFaq === i && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="px-6 pb-6 text-gray-400 leading-relaxed text-sm"
                >
                  <div className="pt-4 border-t border-white/5">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
