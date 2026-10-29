const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const aiAssistantService = require('../services/aiAssistantService');

// Rate limiter for AI chat requests: max 60 per 15 minutes
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  message: {
    success: false,
    error: 'AI telemetry rate threshold reached. Please wait before transmitting new prompts.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Optional auth helper: decodes JWT if present without rejecting guests
const optionalAuth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.split(' ')[1];
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
    } catch {
      // Ignore invalid token for optional auth
    }
  }
  next();
};

router.post('/chat', chatLimiter, optionalAuth, async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message parameter is required.',
      });
    }

    const response = await aiAssistantService.processMessage(message, req.user);
    res.json({
      success: true,
      ...response,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'AI Copilot processing interrupted: ' + err.message,
    });
  }
});

module.exports = router;
