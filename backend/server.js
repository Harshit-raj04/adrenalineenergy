require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cacheService = require('./services/cacheService');

const app = express();
const PORT = process.env.PORT || 5000;

// Security & Parsing Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/adrenaline';
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('🏎️  MongoDB Engine Online: Connected to Adrenaline telemetry.'))
    .catch(err => console.error('⚠️  MongoDB Connection Error:', err.message));
} else {
  mongoose.set('bufferCommands', false);
}

// ─── Health & Observability Endpoints ──────────────────────────────
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'OPTIMAL_READY',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + 's',
    service: 'adrenaline-backend',
  });
});

app.get(['/ready', '/api/ready'], (req, res) => {
  const isMongoReady = mongoose.connection.readyState === 1;
  const cacheMetrics = cacheService.getMetrics();

  const isReady = isMongoReady || process.env.NODE_ENV === 'test';

  res.status(isReady ? 200 : 503).json({
    status: isReady ? 'READY' : 'DEGRADED',
    database: {
      connected: isMongoReady,
      state: mongoose.connection.readyState,
    },
    cache: cacheMetrics,
    memoryUsageMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
  });
});

// Cache stats endpoint
app.get('/api/cache/stats', (req, res) => {
  res.json({
    success: true,
    stats: cacheService.getMetrics(),
  });
});

// ─── Core API Routers ──────────────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// ─── Global Error Handler ──────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Telemetry Exception:', err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal HQ Server Anomaly. Telemetry team dispatched.' 
      : err.message,
  });
});

// Start Server (only if executed directly, not imported in tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Adrenaline Core API listening on port ${PORT}`);
  });
}

module.exports = app;
