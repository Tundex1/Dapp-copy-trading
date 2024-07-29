const express = require('express');
const Trader = require('../models/Trader');

const router = express.Router();

// Get top traders
router.get('/', async (req, res) => {
    try {
        const traders = await Trader.find().sort({ performance: -1 }).limit(10);
        res.json(traders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new trader (for testing)
router.post('/', async (req, res) => {
    const trader = new Trader({
        name: req.body.name,
        performance: req.body.performance
    });

    try {
        const newTrader = await trader.save();
        res.status(201).json(newTrader);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
