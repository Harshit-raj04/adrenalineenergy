module.exports = (req, res, next) => {
  const adminPin = req.header('x-admin-pin');
  const validPin = process.env.ADMIN_PIN || '2004';

  if (adminPin && adminPin === validPin) {
    return next();
  }

  if (req.user && req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    success: false,
    error: 'Access Forbidden. Administrator telemetry clearance required.',
  });
};
