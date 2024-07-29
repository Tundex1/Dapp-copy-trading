const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    tradeType: String, // e.g., 'buy' or 'sell'
    amount: Number,
    price: Number
});

const traderSchema = new mongoose.Schema({
    name: String,
    performance: Number,
    trades: [tradeSchema]
});

module.exports = mongoose.model('Trader', traderSchema);
