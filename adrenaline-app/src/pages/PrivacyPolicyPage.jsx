import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 pt-24 pb-32 relative z-10 min-h-[calc(100vh-80px)]">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-12 border-b border-white/10 pb-6">
          <h2 className="text-4xl font-black italic uppercase">Privacy <span className="text-red-500">Policy</span></h2>
          <p className="text-gray-400 mt-2 tracking-widest text-sm uppercase">Last Updated: March 2026</p>
        </div>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">1. Telemetry Collection</h3>
            <p>Adrenaline Inc. ("we", "us", or "our") collects vital telemetry data to ensure optimal fuel delivery and driver performance. This includes standard identifiers such as your callsign (name), driver logon (email), and drop-zone coordinates (shipping address).</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">2. Data Usage</h3>
            <p>Your telemetry is utilized strictly for:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-400">
              <li>Processing and deploying high-octane fuel orders.</li>
              <li>Transmitting active tracking coordinates for your shipments.</li>
              <li>Monitoring account performance and offering specialized Antigravity tuning.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">3. Security Protocols</h3>
            <p>We implement military-grade encryption to protect your data. Payment telemetry is transmitted securely via our certified gateway partners (Razorpay). Adrenaline Inc. does not store encrypted security keys (passwords) or full credit card parameters on our internal grid.</p>
          </section>

          <section>
            <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wider">4. Third-Party Transmission</h3>
            <p>We do not sell, trade, or rent your telemetry. Data is only shared with trusted delivery logistics partners for the sole purpose of executing fuel drops to your coordinates.</p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
