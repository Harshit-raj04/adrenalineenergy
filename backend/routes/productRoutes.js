const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const cacheService = require('../services/cacheService');

// Seed data for all 8 Adrenaline flavors with rich telemetry attributes
const SEED_PRODUCTS = [
  { 
    slug: 'cran',    
    name: 'CRANBERRY APEX',    
    desc: 'Fierce sweet-tart high-octane energy rush for extreme cognitive clarity.',    
    img: '/can-cranberry.png',    
    imgSplash: '/can-cranberry-splash.png',    
    color: 'from-red-600 to-red-900',       
    price: 4.99, 
    stock: 100,
    category: 'HIGH_OCTANE',
    caffeine: 180,
    sugar: 0,
    rating: 4.9,
    reviewsCount: 148,
    tags: ['focus', 'pre-race', 'zero-sugar', 'high-caffeine', 'tart'],
    featured: true
  },
  { 
    slug: 'blue',    
    name: 'BLUEBERRY VOLT',    
    desc: 'Electric blue focus blend engineered for 2.9s neural reaction speed.',        
    img: '/can-blueberry.png',    
    imgSplash: '/can-blueberry-splash.png',    
    color: 'from-blue-600 to-indigo-900',   
    price: 4.99, 
    stock: 100,
    category: 'HIGH_OCTANE',
    caffeine: 180,
    sugar: 2,
    rating: 4.9,
    reviewsCount: 215,
    tags: ['electric', 'speed', 'neural', 'berries'],
    featured: true
  },
  { 
    slug: 'mint',    
    name: 'MINTY LAGOON', 
    desc: 'Cool refreshing hyper-chill endurance formula for prolonged stints.',      
    img: '/can-mintylagoon.png',  
    imgSplash: '/can-mintylagoon-splash.png',  
    color: 'from-teal-400 to-cyan-900',     
    price: 4.99, 
    stock: 100,
    category: 'ENDURANCE',
    caffeine: 100,
    sugar: 0,
    rating: 4.7,
    reviewsCount: 89,
    tags: ['chill', 'endurance', 'cooling', 'zero-sugar'],
    featured: false
  },
  { 
    slug: 'peach',   
    name: 'PEACH HYDRATION',  
    desc: 'Smooth performance electrolyte hydration matrix with zero caffeine jitter.',     
    img: '/can-peachwater.png',   
    imgSplash: '/can-peachwater-splash.png',   
    color: 'from-orange-400 to-rose-700',   
    price: 4.99, 
    stock: 100,
    category: 'RECOVERY',
    caffeine: 0,
    sugar: 0,
    rating: 4.8,
    reviewsCount: 112,
    tags: ['caffeine-free', 'electrolytes', 'hydration', 'smooth'],
    featured: false
  },
  { 
    slug: 'apple',   
    name: 'GREEN APPLE TURBO',  
    desc: 'Crisp neon orchard blast with immediate burst acceleration.',         
    img: '/can-greenapple.png',   
    imgSplash: '/can-greenapple-splash.png',   
    color: 'from-green-500 to-lime-900',    
    price: 4.99, 
    stock: 100,
    category: 'HIGH_OCTANE',
    caffeine: 180,
    sugar: 3,
    rating: 4.8,
    reviewsCount: 96,
    tags: ['crisp', 'turbo', 'sour-sweet', 'burst'],
    featured: true
  },
  { 
    slug: 'cherry',  
    name: 'SOUR CHERRY OVERDRIVE',  
    desc: 'Aggressive tart power formulated for maximum physical power output.',            
    img: '/can-sourcherry.png',   
    imgSplash: '/can-sourcherry-splash.png',   
    color: 'from-pink-600 to-rose-900',     
    price: 4.99, 
    stock: 100,
    category: 'HIGH_OCTANE',
    caffeine: 200,
    sugar: 0,
    rating: 4.9,
    reviewsCount: 174,
    tags: ['aggressive', 'high-caffeine', 'overdrive', 'zero-sugar'],
    featured: true
  },
  { 
    slug: 'currant', 
    name: 'BLACK CURRANT SHADOW',
    desc: 'Deep violet dark energy blend with sustained antioxidant support.',          
    img: '/can-blackcurrant.png', 
    imgSplash: '/can-blackcurrant-splash.png', 
    color: 'from-purple-600 to-fuchsia-900',
    price: 4.99, 
    stock: 100,
    category: 'ENDURANCE',
    caffeine: 140,
    sugar: 0,
    rating: 4.7,
    reviewsCount: 78,
    tags: ['dark-energy', 'antioxidants', 'sustained', 'zero-sugar'],
    featured: false
  },
  { 
    slug: 'orange',  
    name: 'TANGY ORANGE CIRCUIT', 
    desc: 'High-voltage citrus shock infused with vitamins and rapid recharge salts.',        
    img: '/can-tangyorange.png',  
    imgSplash: '/can-tangyorange-splash.png',  
    color: 'from-orange-500 to-yellow-800', 
    price: 4.99, 
    stock: 100,
    category: 'RECOVERY',
    caffeine: 80,
    sugar: 4,
    rating: 4.8,
    reviewsCount: 130,
    tags: ['citrus', 'vitamins', 'recharge', 'electrolytes'],
    featured: false
  },
];

// ─── GET /api/products (Cache-aside) ──────────────────────────────
router.get('/', async (req, res) => {
  try {
    const result = await cacheService.getOrSet('products:all', async () => {
      if (mongoose.connection.readyState !== 1) {
        return SEED_PRODUCTS;
      }
      let prods = await Product.find().sort({ slug: 1 });
      if (!prods || prods.length === 0) {
        // Auto-seed if empty database
        await Product.insertMany(SEED_PRODUCTS);
        prods = await Product.find().sort({ slug: 1 });
      }
      return prods;
    }, 180); // 3 minutes TTL

    res.json(result.data || SEED_PRODUCTS);
  } catch (err) {
    res.json(SEED_PRODUCTS);
  }
});

// ─── GET /api/products/search (Advanced Filter, Sort, Paginate) ─────
router.get('/search', async (req, res) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      minCaffeine,
      maxCaffeine,
      maxSugar,
      inStockOnly,
      sort = 'popularity',
      page = 1,
      limit = 12,
    } = req.query;

    if (mongoose.connection.readyState !== 1) {
      // In-memory filter fallback when Mongo is disconnected
      let filtered = [...SEED_PRODUCTS];
      if (q && q.trim()) {
        const cleanQ = q.trim().toLowerCase();
        filtered = filtered.filter(p =>
          p.name.toLowerCase().includes(cleanQ) ||
          p.desc.toLowerCase().includes(cleanQ) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(cleanQ)))
        );
      }
      if (category && category !== 'ALL') {
        filtered = filtered.filter(p => p.category === category.toUpperCase());
      }
      if (minPrice !== undefined) filtered = filtered.filter(p => p.price >= Number(minPrice));
      if (maxPrice !== undefined) filtered = filtered.filter(p => p.price <= Number(maxPrice));
      if (minCaffeine !== undefined) filtered = filtered.filter(p => p.caffeine >= Number(minCaffeine));
      if (maxCaffeine !== undefined) filtered = filtered.filter(p => p.caffeine <= Number(maxCaffeine));
      if (maxSugar !== undefined) filtered = filtered.filter(p => p.sugar <= Number(maxSugar));
      if (inStockOnly === 'true' || inStockOnly === true) filtered = filtered.filter(p => p.stock > 0);

      if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
      else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
      else if (sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
      else if (sort === 'caffeine_desc') filtered.sort((a, b) => b.caffeine - a.caffeine);
      else if (sort === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
      const skip = (pageNum - 1) * limitNum;
      const paginated = filtered.slice(skip, skip + limitNum);

      return res.json({
        success: true,
        data: paginated,
        pagination: {
          page: pageNum,
          limit: limitNum,
          totalItems: filtered.length,
          totalPages: Math.ceil(filtered.length / limitNum),
        },
      });
    }

    const query = {};

    // Text search or regex match
    if (q && q.trim()) {
      const cleanQ = q.trim();
      query.$or = [
        { name: { $regex: cleanQ, $options: 'i' } },
        { desc: { $regex: cleanQ, $options: 'i' } },
        { tags: { $in: [new RegExp(cleanQ, 'i')] } }
      ];
    }

    // Category filter
    if (category && category !== 'ALL') {
      query.category = category.toUpperCase();
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
    }

    // Caffeine filter
    if (minCaffeine !== undefined || maxCaffeine !== undefined) {
      query.caffeine = {};
      if (minCaffeine !== undefined) query.caffeine.$gte = Number(minCaffeine);
      if (maxCaffeine !== undefined) query.caffeine.$lte = Number(maxCaffeine);
    }

    // Sugar filter
    if (maxSugar !== undefined) {
      query.sugar = { $lte: Number(maxSugar) };
    }

    // Stock availability
    if (inStockOnly === 'true' || inStockOnly === true) {
      query.stock = { $gt: 0 };
    }

    // Sorting
    let sortOptions = { rating: -1, reviewsCount: -1 };
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'caffeine_desc') sortOptions = { caffeine: -1 };
    else if (sort === 'name') sortOptions = { name: 1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [products, totalCount] = await Promise.all([
      Product.find(query).sort(sortOptions).skip(skip).limit(limitNum),
      Product.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: pageNum,
        limit: limitNum,
        totalItems: totalCount,
        totalPages: Math.ceil(totalCount / limitNum),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Search query failed', error: err.message });
  }
});

// ─── GET /api/products/:slug (Details + Recommendations) ───────────
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const cacheKey = `product:${slug}`;

    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: cached });
    }

    if (mongoose.connection.readyState !== 1) {
      const product = SEED_PRODUCTS.find(p => p.slug === slug);
      if (!product) return res.status(404).json({ success: false, message: 'Product profile not found' });
      const related = SEED_PRODUCTS.filter(p => p.slug !== slug && p.category === product.category).slice(0, 3);
      const payload = { product, related };
      await cacheService.set(cacheKey, payload, 300);
      return res.json({ success: true, data: payload });
    }

    const product = await Product.findOne({ slug });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product profile not found' });
    }

    // Find related products in same category or matching tags
    const related = await Product.find({
      slug: { $ne: slug },
      category: product.category,
      stock: { $gt: 0 },
    }).limit(3);

    const payload = {
      product,
      related,
    };

    await cacheService.set(cacheKey, payload, 300);
    res.json({ success: true, data: payload });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve product details', error: err.message });
  }
});

// ─── POST /api/products/seed ───────────────────────────────────────
// Admin/dev: upsert all 8 seed products and clear cache
router.post('/seed', async (req, res) => {
  try {
    const ops = SEED_PRODUCTS.map(p => ({
      updateOne: {
        filter: { slug: p.slug },
        update: { $set: p },
        upsert: true,
      },
    }));
    const result = await Product.bulkWrite(ops);
    await cacheService.del('products:all');
    await cacheService.delByPattern('product:');
    res.json({ success: true, message: 'Database seeded with enhanced telemetry data', result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Seeding failed', error: err.message });
  }
});

// ─── PUT /api/products/:slug/stock ────────────────────────────────
// Set stock directly (admin panel) with atomic update and cache invalidation
router.put('/:slug/stock', async (req, res) => {
  const { stock } = req.body;
  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ success: false, message: 'Invalid stock value. Must be a non-negative number.' });
  }
  try {
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      { $set: { stock } },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Invalidate cache
    await cacheService.del('products:all');
    await cacheService.del(`product:${req.params.slug}`);

    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update stock', error: err.message });
  }
});

module.exports = router;
module.exports.SEED_PRODUCTS = SEED_PRODUCTS;
