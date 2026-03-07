const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String }, // Populated after success
    items: [{
        id: String,
        name: String,
        price: String, // e.g. "$4.99"
        cartQuantity: Number,
        img: String,
        desc: String
    }],
    totalAmount: { type: String, required: true }, // Store as string for direct display compatibility
    status: { 
        type: String, 
        enum: ['PROCESSING', 'SHIPPED', 'CANCELLED', 'RETURN_REQUESTED', 'REFUNDED'], 
        default: 'PROCESSING' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
