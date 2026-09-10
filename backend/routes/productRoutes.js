const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');

// Seed data for all 8 Adrenaline flavors
const SEED_PRODUCTS = [
  { slug: 'cran',    name: 'CRANBERRY',    desc: 'Fierce sweet-tart energy rush',    img: '/can-cranberry.png',    imgSplash: '/can-cranberry-splash.png',    color: 'from-red-600 to-red-900',       price: 4.99, stock: 100 },
  { slug: 'blue',    name: 'BLUEBERRY',    desc: 'Electric blue focus blend',        img: '/can-blueberry.png',    imgSplash: '/can-blueberry-splash.png',    color: 'from-blue-600 to-indigo-900',   price: 4.99, stock: 100 },
  { slug: 'mint',    name: 'MINTY LAGOON', desc: 'Cool refreshing hyper-chill',      img: '/can-mintylagoon.png',  imgSplash: '/can-mintylagoon-splash.png',  color: 'from-teal-400 to-cyan-900',     price: 4.99, stock: 100 },
  { slug: 'peach',   name: 'PEACH WATER',  desc: 'Smooth performance hydration',     img: '/can-peachwater.png',   imgSplash: '/can-peachwater-splash.png',   color: 'from-orange-400 to-rose-700',   price: 4.99, stock: 100 },
  { slug: 'apple',   name: 'GREEN APPLE',  desc: 'Crisp neon orchard blast',         img: '/can-greenapple.png',   imgSplash: '/can-greenapple-splash.png',   color: 'from-green-500 to-lime-900',    price: 4.99, stock: 100 },
  { slug: 'cherry',  name: 'SOUR CHERRY',  desc: 'Aggressive tart power',            img: '/can-sourcherry.png',   imgSplash: '/can-sourcherry-splash.png',   color: 'from-pink-600 to-rose-900',     price: 4.99, stock: 100 },
  { slug: 'currant', name: 'BLACK CURRANT',desc: 'Deep violet dark energy',          img: '/can-blackcurrant.png', imgSplash: '/can-blackcurrant-splash.png', color: 'from-purple-600 to-fuchsia-900',price: 4.99, stock: 100 },
  { slug: 'orange',  name: 'TANGY ORANGE', desc: 'High-voltage citrus shock',        img: '/can-tangyorange.png',  imgSplash: '/can-tangyorange-splash.png',  color: 'from-orange-500 to-yellow-800', price: 4.99, stock: 100 },
];

// ─── GET /api/products ─────────────────────────────────────────────
// Public: return all products with live stock data
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ slug: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});

// ─── POST /api/products/seed ───────────────────────────────────────
// Admin: upsert all 8 seed products into DB
router.post('/seed', authMiddleware, async (req, res) => {
  try {
    const ops = SEED_PRODUCTS.map(p => ({
      updateOne: {
        filter: { slug: p.slug },
        update: { $setOnInsert: p },   // only insert if not existing
        upsert: true,
      },
    }));
    const result = await Product.bulkWrite(ops);
    res.json({ message: 'Database seeded successfully', result });
  } catch (err) {
    res.status(500).json({ message: 'Seeding failed', error: err.message });
  }
});

// ─── PUT /api/products/:slug/stock ────────────────────────────────
// Admin: set stock directly (e.g. from admin panel)
router.put('/:slug/stock', authMiddleware, async (req, res) => {
  const { stock } = req.body;
  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ message: 'Invalid stock value. Must be a non-negative number.' });
  }
  try {
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      { stock },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update stock', error: err.message });
  }
});

module.exports = router;
module.exports.SEED_PRODUCTS = SEED_PRODUCTS;
