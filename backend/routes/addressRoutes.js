const router = require('express').Router();
const Address = require('../models/Address');
const authMiddleware = require('../middleware/authMiddleware');

const mongoose = require('mongoose');
const IN_MEMORY_ADDRESSES = [];

// ALL routes below require a valid JWT token
router.use(authMiddleware);

// GET /api/addresses - Fetch all addresses for logged-in user
router.get('/', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const addresses = await Address.find({ user: req.user.id }).sort({ createdAt: -1 });
            return res.json(addresses);
        }
        const userAddresses = IN_MEMORY_ADDRESSES.filter(a => a.user === req.user.id);
        res.json(userAddresses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve drop-zone coordinates.' });
    }
});

// POST /api/addresses - Save a new address
router.post('/', async (req, res) => {
    try {
        const { street, city, state, postalCode, country } = req.body;
        
        if (mongoose.connection.readyState === 1) {
            const newAddress = new Address({
                user: req.user.id,
                street, city, state, postalCode, country
            });
            const savedAddress = await newAddress.save();
            return res.status(201).json(savedAddress);
        }

        const memAddress = {
            _id: 'inmem_addr_' + Date.now(),
            user: req.user.id,
            street, city, state, postalCode, country,
            createdAt: new Date().toISOString()
        };
        IN_MEMORY_ADDRESSES.unshift(memAddress);
        res.status(201).json(memAddress);
    } catch (error) {
        res.status(500).json({ error: 'Failed to lock-in new drop-zone.' });
    }
});

// DELETE /api/addresses/:id - Delete an address
router.delete('/:id', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user.id });
            if (!address) return res.status(404).json({ error: 'Coordinate not found.' });
            return res.json({ message: 'Coordinate wiped.' });
        }

        const idx = IN_MEMORY_ADDRESSES.findIndex(a => a._id === req.params.id && a.user === req.user.id);
        if (idx === -1) return res.status(404).json({ error: 'Coordinate not found.' });
        IN_MEMORY_ADDRESSES.splice(idx, 1);
        res.json({ message: 'Coordinate wiped.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete drop-zone.' });
    }
});

module.exports = router;
