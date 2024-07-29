const express = require('express');
const Notification = require('../models/Notification');
const router = express.Router();

// Get notifications for a user
router.get('/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark notification as read
router.put('/:id', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        notification.read = true;
        await notification.save();
        res.json(notification);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
