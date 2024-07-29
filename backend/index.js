const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => {
    console.log('Connected to MongoDB');
});

const tradersRouter = require('./routes/traders');
app.use('/api/traders', tradersRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
const notificationsRouter = require('./routes/notifications');
app.use('/api/notifications', notificationsRouter);
