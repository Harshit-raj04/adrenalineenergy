const router = require('express').Router();
const Address = require('../models/Address');
const authMiddleware = require('../middleware/authMiddleware');

// ALL routes below require a valid JWT token
router.use(authMiddleware);

// GET /api/addresses - Fetch all addresses for logged-in user
router.get('/', async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve drop-zone coordinates.' });
    }
});

// POST /api/addresses - Save a new address
router.post('/', async (req, res) => {
    try {
        const { street, city, state, postalCode, country } = req.body;
        
        const newAddress = new Address({
            user: req.user.id,
            street, city, state, postalCode, country
        });

        const savedAddress = await newAddress.save();
        res.status(201).json(savedAddress);
    } catch (error) {
        res.status(500).json({ error: 'Failed to lock-in new drop-zone.' });
    }
});

// DELETE /api/addresses/:id - Delete an address
router.delete('/:id', async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        if (!address) return res.status(404).json({ error: 'Coordinate not found.' });
        res.json({ message: 'Coordinate wiped.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete drop-zone.' });
    }
});

module.exports = router;
