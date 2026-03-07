require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Engine Online: connected to Adrenaline telemetry.'))
  .catch(err => console.error('MongoDB Failure:', err));

// Core Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OPTIMAL_READY', message: 'Adrenaline API is live.' });
});

// Import API Routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

app.listen(PORT, () => {
    console.log(`Adrenaline API listening on port ${PORT}`);
});
