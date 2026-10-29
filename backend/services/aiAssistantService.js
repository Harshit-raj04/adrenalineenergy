const Product = require('../models/Product');
const Order = require('../models/Order');
const mongoose = require('mongoose');
const { SEED_PRODUCTS } = require('../routes/productRoutes');

const isDbConnected = () => mongoose.connection.readyState === 1;

const STORE_POLICIES = {
  shipping: 'Adrenaline delivers worldwide via high-velocity air freight. Standard drop-zone delivery completes within 48-72 hours. All orders above $25 unlock zero-cost priority dispatch.',
  returns: 'Compromised containment vessels (damaged or defective cans) are eligible for an immediate refund or replacement within 48 hours of drop-zone arrival. Submit a return request through your Shipment Logs.',
  antigravity: 'Antigravity Mode simulates aerodynamic performance. ON (Red) unleashes our extreme caffeinated formulas (180mg-200mg synthetic caffeine). OFF (Blue) restricts the arsenal to caffeine-free electrolyte hydration profiles.',
  ingredients: 'Formulated with ultra-pure taurine, B-vitamin complex (B3, B6, B12), essential hydration electrolytes (sodium, potassium, magnesium), and zero synthetic colors.',
  contact: 'Adrenaline HQ Pit Crew is available 24/7 at support@adrenaline.io or via our live telemetry radio in Monaco.',
};

class AIAssistantService {
  constructor() {
    this.tools = {
      searchProducts: this.toolSearchProducts.bind(this),
      getProductDetails: this.toolGetProductDetails.bind(this),
      compareProducts: this.toolCompareProducts.bind(this),
      getRecommendations: this.toolGetRecommendations.bind(this),
      getMyOrders: this.toolGetMyOrders.bind(this),
      getOrderStatus: this.toolGetOrderStatus.bind(this),
      searchStorePolicies: this.toolSearchStorePolicies.bind(this),
    };
  }

  // Tool 1: searchProducts
  async toolSearchProducts({ query, category, maxPrice, minCaffeine, inStockOnly }) {
    if (!isDbConnected()) {
      let filtered = [...SEED_PRODUCTS];
      if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));
      }
      if (category) filtered = filtered.filter(p => p.category === category.toUpperCase());
      if (maxPrice !== undefined) filtered = filtered.filter(p => p.price <= Number(maxPrice));
      if (minCaffeine !== undefined) filtered = filtered.filter(p => p.caffeine >= Number(minCaffeine));
      if (inStockOnly) filtered = filtered.filter(p => p.stock > 0);

      return {
        count: filtered.length,
        products: filtered.slice(0, 6).map(p => ({
          slug: p.slug,
          name: p.name,
          price: `$${p.price.toFixed(2)}`,
          caffeine: `${p.caffeine}mg`,
          sugar: `${p.sugar}g`,
          stock: p.stock,
          isAvailable: p.stock > 0,
          img: p.img,
          desc: p.desc,
        })),
      };
    }

    const filter = {};
    if (query && typeof query === 'string') {
      const q = query.trim();
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { desc: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ];
    }
    if (category) filter.category = category.toUpperCase();
    if (maxPrice !== undefined) filter.price = { $lte: Number(maxPrice) };
    if (minCaffeine !== undefined) filter.caffeine = { $gte: Number(minCaffeine) };
    if (inStockOnly) filter.stock = { $gt: 0 };

    const products = await Product.find(filter).limit(6).lean();
    return {
      count: products.length,
      products: products.map(p => ({
        slug: p.slug,
        name: p.name,
        price: `$${p.price.toFixed(2)}`,
        caffeine: `${p.caffeine}mg`,
        sugar: `${p.sugar}g`,
        stock: p.stock,
        isAvailable: p.stock > 0,
        img: p.img,
        desc: p.desc,
      })),
    };
  }

  // Tool 2: getProductDetails
  async toolGetProductDetails({ slug }) {
    if (!slug) return { error: 'Product slug is required' };
    const cleanSlug = slug.toLowerCase();

    if (!isDbConnected()) {
      const p = SEED_PRODUCTS.find(item => item.slug === cleanSlug);
      if (!p) return { error: `Product with identifier "${slug}" not found in arsenal.` };
      return {
        product: {
          slug: p.slug,
          name: p.name,
          desc: p.desc,
          price: `$${p.price.toFixed(2)}`,
          category: p.category,
          caffeine: `${p.caffeine}mg`,
          sugar: `${p.sugar}g`,
          stock: p.stock,
          rating: p.rating,
          img: p.img,
          isAvailable: p.stock > 0,
        },
      };
    }

    const p = await Product.findOne({ slug: cleanSlug }).lean();
    if (!p) return { error: `Product with identifier "${slug}" not found in arsenal.` };
    return {
      product: {
        slug: p.slug,
        name: p.name,
        desc: p.desc,
        price: `$${p.price.toFixed(2)}`,
        category: p.category,
        caffeine: `${p.caffeine}mg`,
        sugar: `${p.sugar}g`,
        stock: p.stock,
        rating: p.rating,
        img: p.img,
        isAvailable: p.stock > 0,
      },
    };
  }

  // Tool 3: compareProducts
  async toolCompareProducts({ slugs }) {
    if (!slugs || !Array.isArray(slugs) || slugs.length < 2) {
      return { error: 'Please specify at least 2 product slugs to compare.' };
    }
    const cleanSlugs = slugs.map(s => s.toLowerCase());

    if (!isDbConnected()) {
      const products = SEED_PRODUCTS.filter(p => cleanSlugs.includes(p.slug));
      return {
        comparison: products.map(p => ({
          name: p.name,
          slug: p.slug,
          price: `$${p.price.toFixed(2)}`,
          caffeine: `${p.caffeine}mg`,
          sugar: `${p.sugar}g`,
          category: p.category,
          stock: p.stock,
          img: p.img,
        })),
      };
    }

    const products = await Product.find({ slug: { $in: cleanSlugs } }).lean();
    return {
      comparison: products.map(p => ({
        name: p.name,
        slug: p.slug,
        price: `$${p.price.toFixed(2)}`,
        caffeine: `${p.caffeine}mg`,
        sugar: `${p.sugar}g`,
        category: p.category,
        stock: p.stock,
        img: p.img,
      })),
    };
  }

  // Tool 4: getRecommendations
  async toolGetRecommendations({ category, preferredCaffeine }) {
    if (!isDbConnected()) {
      let recs = SEED_PRODUCTS.filter(p => p.stock > 0);
      if (category) recs = recs.filter(p => p.category === category.toUpperCase());
      if (preferredCaffeine === 'zero') recs = recs.filter(p => p.caffeine === 0);
      else if (preferredCaffeine === 'high') recs = recs.filter(p => p.caffeine >= 180);

      return {
        recommendations: recs.slice(0, 3).map(p => ({
          slug: p.slug,
          name: p.name,
          desc: p.desc,
          price: `$${p.price.toFixed(2)}`,
          caffeine: `${p.caffeine}mg`,
          rating: p.rating,
          img: p.img,
        })),
      };
    }

    const filter = { stock: { $gt: 0 } };
    if (category) filter.category = category.toUpperCase();
    if (preferredCaffeine === 'zero') filter.caffeine = 0;
    else if (preferredCaffeine === 'high') filter.caffeine = { $gte: 180 };

    const recommendations = await Product.find(filter).sort({ rating: -1, reviewsCount: -1 }).limit(3).lean();
    return {
      recommendations: recommendations.map(p => ({
        slug: p.slug,
        name: p.name,
        desc: p.desc,
        price: `$${p.price.toFixed(2)}`,
        caffeine: `${p.caffeine}mg`,
        rating: p.rating,
        img: p.img,
      })),
    };
  }

  // Tool 5: getMyOrders (Authorization scoped to user)
  async toolGetMyOrders({ userId }) {
    if (!userId) return { error: 'Authentication required to access driver order logs.' };
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(5).lean();
    return {
      orders: orders.map(o => ({
        id: o._id,
        orderNumber: o.razorpayOrderId,
        status: o.status,
        date: o.createdAt,
        total: o.totalAmount,
        itemsCount: o.items.reduce((acc, it) => acc + (it.cartQuantity || 1), 0),
        items: o.items.map(it => `${it.cartQuantity}x ${it.name}`),
      })),
    };
  }

  // Tool 6: getOrderStatus
  async toolGetOrderStatus({ orderId, userId }) {
    if (!orderId) return { error: 'Order reference number is required.' };
    const filter = {
      $or: [
        { _id: orderId.match(/^[0-9a-fA-F]{24}$/) ? orderId : null },
        { razorpayOrderId: orderId }
      ].filter(f => Object.values(f)[0] !== null),
    };

    if (userId) filter.user = userId; // Never permit access to other users' orders

    const order = await Order.findOne(filter).lean();
    if (!order) return { error: 'No matching order manifest found for your driver credentials.' };

    return {
      orderId: order._id,
      trackingRef: order.razorpayOrderId,
      status: order.status,
      total: order.totalAmount,
      datePlaced: order.createdAt,
      items: order.items.map(it => `${it.cartQuantity}x ${it.name}`),
    };
  }

  // Tool 7: searchStorePolicies
  toolSearchStorePolicies({ topic }) {
    const t = (topic || '').toLowerCase();
    if (t.includes('ship') || t.includes('deliver') || t.includes('track') || t.includes('time')) {
      return { policy: STORE_POLICIES.shipping };
    }
    if (t.includes('refund') || t.includes('return') || t.includes('damage') || t.includes('cancel')) {
      return { policy: STORE_POLICIES.returns };
    }
    if (t.includes('antigravity') || t.includes('f1') || t.includes('mode')) {
      return { policy: STORE_POLICIES.antigravity };
    }
    if (t.includes('caffeine') || t.includes('ingredient') || t.includes('sugar') || t.includes('safe')) {
      return { policy: STORE_POLICIES.ingredients };
    }
    return {
      allPolicies: STORE_POLICIES,
    };
  }

  // Main Orchestrator
  async processMessage(userMessage, currentUser = null) {
    const raw = (userMessage || '').trim();
    const lower = raw.toLowerCase();
    const userId = currentUser ? currentUser.id : null;

    // 1. Intent: Order Status / Tracking
    if (lower.includes('my order') || lower.includes('track order') || lower.includes('where is my order') || lower.includes('recent order')) {
      if (!userId) {
        return {
          reply: 'To retrieve your telemetry logs, please authenticate into your Driver Profile first.',
          toolCalled: 'getMyOrders',
          requiresAuth: true,
        };
      }
      const data = await this.toolGetMyOrders({ userId });
      if (!data.orders || data.orders.length === 0) {
        return {
          reply: 'No previous requisition logs found under your driver account. Deploy an order in the Pit Lane to begin telemetry tracking.',
          toolCalled: 'getMyOrders',
          data,
        };
      }
      const latest = data.orders[0];
      return {
        reply: `You have ${data.orders.length} orders in our grid. Your most recent deployment (Order #${latest.orderNumber}) is currently in **${latest.status}** status totaling ${latest.total}. Items: ${latest.items.join(', ')}.`,
        toolCalled: 'getMyOrders',
        data,
      };
    }

    // 2. Intent: Compare Products
    if (lower.includes('compare') || (lower.includes('difference between') && (lower.includes('cran') || lower.includes('blue') || lower.includes('cherry')))) {
      const slugsToCompare = [];
      const knownSlugs = ['cran', 'blue', 'mint', 'peach', 'apple', 'cherry', 'currant', 'orange'];
      for (const s of knownSlugs) {
        if (lower.includes(s) || lower.includes(s.slice(0, 4))) {
          slugsToCompare.push(s);
        }
      }
      // If user just said "compare", pick 2 popular ones
      const finalSlugs = slugsToCompare.length >= 2 ? slugsToCompare.slice(0, 3) : ['cran', 'peach'];
      const compData = await this.toolCompareProducts({ slugs: finalSlugs });
      return {
        reply: `Here is the telemetry comparison between ${compData.comparison.map(c => c.name).join(' vs ')}:`,
        toolCalled: 'compareProducts',
        data: compData,
      };
    }

    // 3. Intent: Price / Budget filter (e.g. "under $5", "under 150", "cheapest")
    const priceMatch = lower.match(/(?:under|below|less than)\s*[$₹]?\s*(\d+(\.\d+)?)/);
    if (priceMatch) {
      const maxPrice = parseFloat(priceMatch[1]);
      const searchRes = await this.toolSearchProducts({ maxPrice: maxPrice > 50 ? 5.00 : maxPrice });
      return {
        reply: `Found ${searchRes.count} formula(s) fitting your price threshold of under $${maxPrice > 50 ? '5.00' : maxPrice}:`,
        toolCalled: 'searchProducts',
        data: searchRes,
      };
    }

    // 4. Intent: Specific Caffeine / Zero Sugar / Recommendations
    if (lower.includes('zero caffeine') || lower.includes('caffeine free') || lower.includes('hydration') || lower.includes('recovery')) {
      const recs = await this.toolGetRecommendations({ preferredCaffeine: 'zero' });
      return {
        reply: 'For zero-caffeine hydration and muscular recovery, I recommend our PEACH HYDRATION matrix (0mg caffeine, rich in electrolytes):',
        toolCalled: 'getRecommendations',
        data: recs,
      };
    }

    if (lower.includes('high caffeine') || lower.includes('strongest') || lower.includes('highest energy') || lower.includes('focus')) {
      const recs = await this.toolGetRecommendations({ preferredCaffeine: 'high' });
      return {
        reply: 'For maximum reaction acceleration (180mg-200mg synthetic caffeine), our premier recommendations are:',
        toolCalled: 'getRecommendations',
        data: recs,
      };
    }

    // 5. Intent: Specific Product Details
    const matchSlug = ['cranberry', 'blueberry', 'mint', 'peach', 'apple', 'cherry', 'currant', 'orange'].find(f => lower.includes(f));
    if (matchSlug && (lower.includes('what is') || lower.includes('tell me about') || lower.includes('details') || lower.includes('ingredients'))) {
      const slugMap = { cranberry: 'cran', blueberry: 'blue', mint: 'mint', peach: 'peach', apple: 'apple', cherry: 'cherry', currant: 'currant', orange: 'orange' };
      const details = await this.toolGetProductDetails({ slug: slugMap[matchSlug] });
      if (details.product) {
        return {
          reply: `**${details.product.name}** [${details.product.price}]: ${details.product.desc}. Contains ${details.product.caffeine} caffeine and ${details.product.sugar} sugar. Current live stock: ${details.product.stock} units.`,
          toolCalled: 'getProductDetails',
          data: details,
        };
      }
    }

    // 6. Intent: Shipping, policies, returns
    if (lower.includes('ship') || lower.includes('deliver') || lower.includes('refund') || lower.includes('return') || lower.includes('antigravity') || lower.includes('policy')) {
      const policyData = this.toolSearchStorePolicies({ topic: lower });
      return {
        reply: policyData.policy || STORE_POLICIES.shipping,
        toolCalled: 'searchStorePolicies',
        data: policyData,
      };
    }

    // 7. General search fallback on MongoDB
    const fallbackSearch = await this.toolSearchProducts({ query: raw.length > 20 ? raw.slice(0, 15) : raw });
    if (fallbackSearch.count > 0) {
      return {
        reply: `Here are matching formulas found in our live MongoDB catalog:`,
        toolCalled: 'searchProducts',
        data: fallbackSearch,
      };
    }

    return {
      reply: "Telemetry received. I can assist you with real-time product discovery, comparing caffeine/sugar across formulas, checking your live orders, or clarifying store drop-zone policies. What do you need, Driver?",
      toolCalled: null,
    };
  }
}

module.exports = new AIAssistantService();
