const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const mongoose = require('mongoose');
const IN_MEMORY_USERS = new Map();

// Pre-seed an admin account for offline convenience
(async () => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('admin123', salt);
  IN_MEMORY_USERS.set('admin@adrenaline.com', {
    _id: 'inmem_admin_001',
    name: 'Chief Race Engineer',
    email: 'admin@adrenaline.com',
    passwordHash: hash,
    role: 'admin',
  });
})();

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Callsign (name), email, and password credentials are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) return res.status(400).json({ success: false, error: 'Driver log-on already exists in grid.' });

      // Hash the password for local security
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const newUser = new User({ 
        name: name.trim(), 
        email: cleanEmail, 
        passwordHash,
        role: cleanEmail.includes('admin') ? 'admin' : 'driver',
      });
      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, role: newUser.role, name: newUser.name, email: newUser.email },
        process.env.JWT_SECRET || 'super_secret_adrenaline_key_2026',
        { expiresIn: '7d' }
      );
      return res.status(201).json({ success: true, token, user: { id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role } });
    }

    // In-memory fallback
    if (IN_MEMORY_USERS.has(cleanEmail)) {
      return res.status(400).json({ success: false, error: 'Driver log-on already exists in grid.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = 'inmem_' + Date.now();
    const role = cleanEmail.includes('admin') ? 'admin' : 'driver';

    const memoryUser = {
      _id: userId,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role,
    };
    IN_MEMORY_USERS.set(cleanEmail, memoryUser);

    const token = jwt.sign(
      { id: userId, role, name: memoryUser.name, email: cleanEmail },
      process.env.JWT_SECRET || 'super_secret_adrenaline_key_2026',
      { expiresIn: '7d' }
    );
    return res.status(201).json({
      success: true,
      token,
      user: { id: userId, name: memoryUser.name, email: cleanEmail, role },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal HQ Server Error: ' + error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Driver logon email and security code password required.' });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) return res.status(400).json({ success: false, error: 'Invalid driver telemetry (email).' });

      const validPass = await bcrypt.compare(password, user.passwordHash);
      if (!validPass) return res.status(400).json({ success: false, error: 'Invalid security code (password).' });

      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name, email: user.email },
        process.env.JWT_SECRET || 'super_secret_adrenaline_key_2026',
        { expiresIn: '7d' }
      );
      return res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    }

    // In-memory fallback
    const user = IN_MEMORY_USERS.get(cleanEmail);
    if (!user) return res.status(400).json({ success: false, error: 'Invalid driver telemetry (email).' });

    const validPass = await bcrypt.compare(password, user.passwordHash);
    if (!validPass) return res.status(400).json({ success: false, error: 'Invalid security code (password).' });

    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'super_secret_adrenaline_key_2026',
      { expiresIn: '7d' }
    );
    return res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal HQ Server Error: ' + error.message });
  }
});

module.exports = router;
