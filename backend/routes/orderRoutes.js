const router = require('express').Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all order routes
router.use(authMiddleware);

// POST /api/orders/create-razorpay-order 
// Normally this would ping the actual Razorpay API using a secret backend key to generate an Order ID.
// For demonstration, we simply generate a mock ID and insert the pending order into MongoDB.
router.post('/create-razorpay-order', async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        
        const mockRazorpayOrderId = 'order_mock_' + Date.now();

        const newOrder = new Order({
            user: req.user.id,
            razorpayOrderId: mockRazorpayOrderId,
            items,
            totalAmount
        });

        await newOrder.save();
        res.json({ 
            orderId: newOrder._id,
            razorpayOrderId: mockRazorpayOrderId,
            amount: totalAmount // In a real app, amount should be recalculated on the backend to prevent tampering
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to generate payload manifest.' });
    }
});

// POST /api/orders/verify-payment
router.post('/verify-payment', async (req, res) => {
    try {
        const { orderDbId, razorpayPaymentId } = req.body;
        
        // In reality, you'd use crypto to verify the razorpay signature here
        const order = await Order.findOneAndUpdate(
            { _id: orderDbId, user: req.user.id },
            { 
                razorpayPaymentId, 
                status: 'PROCESSING'
            },
            { new: true }
        );

        if (!order) return res.status(404).json({ error: 'Order not found.' });

        // ── Deduct inventory stock ──────────────────────────────────
        // For each item in the verified order, decrement the product stock
        const stockOps = (order.items || []).map(item => ({
            updateOne: {
                filter: { slug: item.id, stock: { $gte: item.cartQuantity } },
                update: { $inc: { stock: -item.cartQuantity } },
            }
        }));

        if (stockOps.length > 0) {
            await Product.bulkWrite(stockOps);
        }
        // ────────────────────────────────────────────────────────────

        res.json({ success: true, order });
    } catch (error) {
        res.status(500).json({ error: 'Payment verification failed.' });
    }
});

// GET /api/orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve manifest logs.' });
    }
});

// PUT /api/orders/:id/status
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        
        if (!['CANCELLED', 'RETURN_REQUESTED', 'REFUNDED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status override.' });
        }

        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { status },
            { new: true }
        );

        res.json(order);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update delivery matrix.' });
    }
});

module.exports = router;
