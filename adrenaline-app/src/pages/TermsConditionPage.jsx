import React from 'react';
import { motion } from 'framer-motion';

export default function TermsConditionPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 pt-24 pb-32 relative z-10 min-h-[calc(100vh-80px)]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-12 border-b border-white/10 pb-6">
          <h2 className="text-4xl font-black italic uppercase">Terms & <span className="text-red-500">Conditions</span></h2>
          <p className="text-gray-400 mt-2 tracking-widest text-sm uppercase">Effective Date: March 2026</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">1. Assumption of Risk</h3>
            <p>By consuming Adrenaline products, especially under "Antigravity Mode," you acknowledge the extreme performance yields (180mg caffeine). You agree to consume responsibly and consult a physician if you are sensitive to high-voltage neural stimulation.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">2. Product Deployment</h3>
            <p>All fuel drops (orders) are subject to availability. Adrenaline Inc. reserves the right to cancel or modify deployments if operational hazards or logistical anomalies occur. In such events, a full refund of credits will be initiated.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">3. Return Parameters</h3>
            <p>Given the consumable nature of our fuel, returns are only authorized for compromised containment vessels (damaged cans) or incorrect flavor payloads. Claims must be filed via the HQ Comms (Support) grid within 48 hours of drop-zone arrival.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">4. Intellectual Property</h3>
            <p>The concepts "Adrenaline," "Antigravity Mode," "Defy Gravity," and all associated telemetry graphics, 3D assets, and flavor designations are the exclusive property of Adrenaline Inc. Reproduction without authorization is grounds for immediate termination.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
