const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Callsign (name), email, and password credentials are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) return res.status(400).json({ success: false, error: 'Driver log-on already exists in grid.' });

    // Hash the password for local security
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ 
      name, 
      email: email.toLowerCase(), 
      passwordHash,
      role: email.toLowerCase().includes('admin') ? 'admin' : 'driver',
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, process.env.JWT_SECRET || 'super_secret_adrenaline_key_2026', { expiresIn: '7d' });
    res.status(201).json({ success: true, token, user: { id: newUser._id, name, email: newUser.email, role: newUser.role } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal HQ Server Error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Driver logon email and security code password required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ success: false, error: 'Invalid driver telemetry (email).' });

    const validPass = await bcrypt.compare(password, user.passwordHash);
    if (!validPass) return res.status(400).json({ success: false, error: 'Invalid security code (password).' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'super_secret_adrenaline_key_2026', { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal HQ Server Error' });
  }
});

module.exports = router;
