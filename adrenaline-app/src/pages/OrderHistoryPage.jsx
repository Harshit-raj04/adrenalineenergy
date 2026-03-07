import React from 'react';
import { motion } from 'framer-motion';

export default function OrderHistoryPage({ orders, setOrders }) {
  
  const handleAction = (orderId, actionType) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        let newStatus = o.status;
        if (actionType === 'CANCEL') newStatus = 'CANCELLED';
        if (actionType === 'RETURN') newStatus = 'RETURN REQUESTED';
        if (actionType === 'REFUND') newStatus = 'REFUND PROCESSING';
        return { ...o, status: newStatus };
      }
      return o;
    }));
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-6 pt-24 pb-32 relative z-10 min-h-[calc(100vh-80px)]">
      <div className="mb-12 border-b border-white/10 pb-6">
        <h2 className="text-4xl font-black italic uppercase">Shipment <span className="text-red-500">Logs</span></h2>
        <p className="text-gray-400 mt-2">Track your past fuel acquisitions and manage active deployments.</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-neutral-950 border border-white/5">
          <p className="text-gray-500 font-mono tracking-widest">NO SHIPMENT LOGS FOUND.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} key={order.id}
              className="bg-neutral-900 border border-white/10 p-6 flex flex-col md:flex-row gap-6 relative"
            >
              <div className="flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-xs text-gray-500 font-mono mb-1">ORDER #{order.id}</div>
                    <div className="font-bold text-xl">{new Date(order.date).toLocaleDateString()}</div>
                  </div>
                  <div className={`px-3 py-1 text-xs font-black tracking-widest ${
                    order.status.includes('CANCEL') || order.status.includes('REFUND') ? 'bg-red-900/50 text-red-500' : 
                    order.status === 'SHIPPED' ? 'bg-green-900/50 text-green-400' : 'bg-white/10 text-white'
                  }`}>
                    {order.status}
                  </div>
                </div>
                
                <div className="space-y-3 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm text-gray-300">
                      <span>{item.cartQuantity}x {item.name}</span>
                      <span className="font-mono">${(parseFloat(item.price.replace('$','')) * item.cartQuantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-white/10 pt-4 flex justify-between items-center font-bold">
                  <span className="text-gray-400 tracking-widest">TOTAL</span>
                  <span className="text-2xl font-mono">${order.total}</span>
                </div>
              </div>

              <div className="md:w-48 flex flex-col gap-3 justify-center border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0 md:pl-6">
                {(order.status === 'PROCESSING' || order.status === 'SHIPPED') && (
                  <button 
                    onClick={() => handleAction(order.id, 'CANCEL')}
                    className="w-full border border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white py-3 text-xs font-bold tracking-widest transition"
                  >
                    CANCEL ORDER
                  </button>
                )}
                {order.status === 'DELIVERED' && (
                  <button 
                    onClick={() => handleAction(order.id, 'RETURN')}
                    className="w-full border border-white/20 text-white hover:bg-white hover:text-black py-3 text-xs font-bold tracking-widest transition"
                  >
                    RETURN ITEMS
                  </button>
                )}
                {(order.status === 'CANCELLED' || order.status === 'RETURN REQUESTED') && (
                  <button 
                    onClick={() => handleAction(order.id, 'REFUND')}
                    className="w-full bg-red-600 hover:bg-red-500 text-white py-3 text-xs font-bold tracking-widest transition"
                  >
                    REQUEST REFUND
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
