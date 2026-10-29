const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  razorpayOrderId: { type: String, required: true, index: true },
  razorpayPaymentId: { type: String, index: true },
  items: [{
    id: { type: String, required: true },
    slug: { type: String },
    name: { type: String, required: true },
    price: { type: String, required: true }, // e.g. "$4.99"
    numericPrice: { type: Number, default: 4.99 },
    cartQuantity: { type: Number, required: true, min: 1 },
    img: String,
    desc: String,
  }],
  totalAmount: { type: String, required: true }, // e.g. "$9.98"
  numericTotal: { type: Number, required: true, default: 0, index: true }, // 9.98
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: { type: String, default: 'Global' },
  },
  paymentStatus: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
    default: 'COMPLETED',
    index: true,
  },
  status: { 
    type: String, 
    enum: ['PROCESSING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURN_REQUESTED', 'REFUNDED'], 
    default: 'PROCESSING',
    index: true,
  },
}, { timestamps: true });

// Compound indexes for user order queries and admin analytics
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
