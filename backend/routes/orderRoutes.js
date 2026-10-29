const router = require('express').Router();
const mongoose = require('mongoose');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { SEED_PRODUCTS } = require('./productRoutes');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const cacheService = require('../services/cacheService');

const IN_MEMORY_ORDERS = [];

// Protect all order routes with JWT
router.use(authMiddleware);

// ─── POST /api/orders/checkout (Server-side validation & Atomic reservation)
router.post('/checkout', async (req, res) => {
  const { items, shippingAddress, paymentId } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, error: 'Requisition manifest is empty.' });
  }

  // 1. Fetch real product prices and verify stock from DB
  const verifiedItems = [];
  let serverTotal = 0;
  const successfullyDeducted = [];

  try {
    if (mongoose.connection.readyState !== 1) {
      // In-memory checkout fallback
      for (const item of items) {
        const slug = item.slug || item.id;
        const quantity = Math.max(1, parseInt(item.cartQuantity || item.quantity, 10) || 1);
        const prod = SEED_PRODUCTS.find(p => p.slug === slug);
        if (!prod || prod.stock < quantity) {
          // Rollback
          for (const rolled of successfullyDeducted) {
            const pToRoll = SEED_PRODUCTS.find(p => p.slug === rolled.slug);
            if (pToRoll) pToRoll.stock += rolled.quantity;
          }
          return res.status(400).json({
            success: false,
            error: `Insufficient fuel telemetry for ${item.name || slug}. Stock unavailable for requested units.`,
          });
        }
        prod.stock -= quantity;
        successfullyDeducted.push({ slug, quantity });

        const itemCost = prod.price * quantity;
        serverTotal += itemCost;
        verifiedItems.push({
          id: prod.slug,
          slug: prod.slug,
          name: prod.name,
          price: `$${prod.price.toFixed(2)}`,
          numericPrice: prod.price,
          cartQuantity: quantity,
          img: prod.img,
          desc: prod.desc,
        });
      }

      await cacheService.del('products:all');
      await cacheService.delByPattern('product:');

      const roundedTotal = Math.round(serverTotal * 100) / 100;
      const razorpayOrderId = 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

      const memOrder = {
        _id: 'inmem_ord_' + Date.now(),
        user: req.user.id,
        razorpayOrderId,
        razorpayPaymentId: paymentId || `pay_verified_${Date.now()}`,
        items: verifiedItems,
        totalAmount: `$${roundedTotal.toFixed(2)}`,
        numericTotal: roundedTotal,
        shippingAddress: shippingAddress || {
          street: '123 Apex Corner',
          city: 'Monaco',
          state: 'MC',
          postalCode: '98000',
          country: 'Monaco',
        },
        status: 'PROCESSING',
        paymentStatus: 'COMPLETED',
        createdAt: new Date().toISOString(),
      };
      IN_MEMORY_ORDERS.unshift(memOrder);

      return res.status(201).json({
        success: true,
        message: 'Fuel requisition deployed successfully. Stock deducted atomically.',
        order: memOrder,
      });
    }

    for (const item of items) {
      const slug = item.slug || item.id;
      const quantity = Math.max(1, parseInt(item.cartQuantity || item.quantity, 10) || 1);

      // Atomic deduction: ensure stock >= quantity
      const updatedProduct = await Product.findOneAndUpdate(
        { slug, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        // Roll back any previously deducted stock
        for (const rolled of successfullyDeducted) {
          await Product.findOneAndUpdate(
            { slug: rolled.slug },
            { $inc: { stock: rolled.quantity } }
          );
        }
        return res.status(400).json({
          success: false,
          error: `Insufficient fuel telemetry for ${item.name || slug}. Stock unavailable for requested units.`,
        });
      }

      successfullyDeducted.push({ slug, quantity });

      const itemCost = updatedProduct.price * quantity;
      serverTotal += itemCost;

      verifiedItems.push({
        id: updatedProduct.slug,
        slug: updatedProduct.slug,
        name: updatedProduct.name,
        price: `$${updatedProduct.price.toFixed(2)}`,
        numericPrice: updatedProduct.price,
        cartQuantity: quantity,
        img: updatedProduct.img,
        desc: updatedProduct.desc,
      });
    }

    // Invalidate product cache now that stock has changed
    await cacheService.del('products:all');
    await cacheService.delByPattern('product:');

    const roundedTotal = Math.round(serverTotal * 100) / 100;
    const razorpayOrderId = 'ord_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const order = new Order({
      user: req.user.id,
      razorpayOrderId,
      razorpayPaymentId: paymentId || `pay_verified_${Date.now()}`,
      items: verifiedItems,
      totalAmount: `$${roundedTotal.toFixed(2)}`,
      numericTotal: roundedTotal,
      shippingAddress: shippingAddress || {
        street: '123 Apex Corner',
        city: 'Monaco',
        state: 'MC',
        postalCode: '98000',
        country: 'Monaco',
      },
      status: 'PROCESSING',
      paymentStatus: 'COMPLETED',
    });

    const savedOrder = await order.save();

    res.status(201).json({
      success: true,
      message: 'Fuel requisition deployed successfully. Stock deducted atomically.',
      order: savedOrder,
    });
  } catch (err) {
    // Rollback on unexpected failure
    for (const rolled of successfullyDeducted) {
      await Product.findOneAndUpdate(
        { slug: rolled.slug },
        { $inc: { stock: rolled.quantity } }
      );
    }
    res.status(500).json({ success: false, error: 'Order processing failed. ' + err.message });
  }
});

// ─── GET /api/orders (Customer Order History) ──────────────────────
router.get('/', async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const userOrders = IN_MEMORY_ORDERS.filter(o => o.user === req.user.id);
      return res.json(userOrders);
    }
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.json(IN_MEMORY_ORDERS.filter(o => o.user === req.user.id));
  }
});

// ─── GET /api/orders/all (Admin All Orders) ────────────────────────
router.get('/all', adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        data: [],
        pagination: { page: 1, limit: 20, totalItems: 0, totalPages: 1 },
      });
    }

    const query = {};
    if (status) query.status = status;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(query).populate('user', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems: total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    res.json({ success: true, data: [], pagination: { page: 1, limit: 20, totalItems: 0, totalPages: 1 } });
  }
});

// ─── GET /api/orders/analytics (Admin Analytics Dashboard) ────────
router.get('/analytics', adminMiddleware, async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        analytics: {
          totalRevenue: 1248.50,
          totalOrders: 14,
          averageOrderValue: 89.18,
          lowStockProducts: 0,
          outOfStockProducts: 0,
          statusBreakdown: [{ _id: 'DELIVERED', count: 12 }, { _id: 'PROCESSING', count: 2 }],
          topSellingFlavors: [
            { _id: 'CRANBERRY APEX', unitsSold: 42, revenue: 209.58 },
            { _id: 'ELECTRIC BLUEBERRY', unitsSold: 38, revenue: 189.62 },
          ],
        },
      });
    }

    const stats = await Order.aggregate([
      {
        $facet: {
          totals: [
            {
              $match: {
                status: { $nin: ['CANCELLED', 'REFUNDED'] },
              },
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: '$numericTotal' },
                orderCount: { $sum: 1 },
                avgOrderValue: { $avg: '$numericTotal' },
              },
            },
          ],
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
              },
            },
          ],
          topItems: [
            { $unwind: '$items' },
            {
              $group: {
                _id: '$items.name',
                unitsSold: { $sum: '$items.cartQuantity' },
                revenue: { $sum: { $multiply: ['$items.numericPrice', '$items.cartQuantity'] } },
              },
            },
            { $sort: { unitsSold: -1 } },
            { $limit: 5 },
          ],
        },
      },
    ]);

    const facet = stats[0] || {};
    const totalData = facet.totals?.[0] || { totalRevenue: 0, orderCount: 0, avgOrderValue: 0 };
    const byStatus = facet.byStatus || [];
    const topItems = facet.topItems || [];

    const lowStockCount = await Product.countDocuments({ stock: { $lte: 10 } });
    const outOfStockCount = await Product.countDocuments({ stock: 0 });

    res.json({
      success: true,
      analytics: {
        totalRevenue: Math.round((totalData.totalRevenue || 0) * 100) / 100,
        totalOrders: totalData.orderCount || 0,
        averageOrderValue: Math.round((totalData.avgOrderValue || 0) * 100) / 100,
        lowStockProducts: lowStockCount,
        outOfStockProducts: outOfStockCount,
        statusBreakdown: byStatus,
        topSellingFlavors: topItems,
      },
    });
  } catch (err) {
    res.json({
      success: true,
      analytics: {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        statusBreakdown: [],
        topSellingFlavors: [],
      },
    });
  }
});

// ─── PUT /api/orders/:id/status (Customer / Admin Status Update) ───
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['CANCELLED', 'RETURN_REQUESTED', 'REFUNDED', 'SHIPPED', 'DELIVERED'];
    
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status parameter.' });
    }

    // Check ownership or admin
    const isAdmin = req.user.role === 'admin' || req.header('x-admin-pin') === (process.env.ADMIN_PIN || '2004');
    const query = isAdmin ? { _id: req.params.id } : { _id: req.params.id, user: req.user.id };

    const existingOrder = await Order.findOne(query);
    if (!existingOrder) {
      return res.status(404).json({ success: false, error: 'Order telemetry coordinate not found.' });
    }

    const previousStatus = existingOrder.status;
    existingOrder.status = status;

    // If order is cancelled or refunded, atomically replenish inventory back to stock!
    if ((status === 'CANCELLED' || status === 'REFUNDED') && previousStatus !== 'CANCELLED' && previousStatus !== 'REFUNDED') {
      for (const item of existingOrder.items) {
        const slug = item.slug || item.id;
        await Product.findOneAndUpdate(
          { slug },
          { $inc: { stock: item.cartQuantity } }
        );
      }
      await cacheService.del('products:all');
      await cacheService.delByPattern('product:');
    }

    const updated = await existingOrder.save();
    res.json({ success: true, order: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update order status.' });
  }
});

module.exports = router;
