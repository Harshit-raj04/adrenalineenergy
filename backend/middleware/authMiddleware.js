const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Expected format: "Bearer <token>"
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access Denied. Invalid Authorization telemetry.' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attach the decoded user payload to the request object
        next();
    } catch (err) {
        res.status(400).json({ error: 'Corrupt JWT telemetry. Re-authentication required.' });
    }
};
