// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const customerRoutes = require('./routes/customerRoutes');
const orderRoutes = require('./routes/orderRoutes');
const audienceRoutes = require('./routes/audienceRoutes');
const campaignRoutes = require('./routes/campaignRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://rahiaag:123456@cluster0.pzh9cvd.mongodb.net/mini-crm', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => console.log(err));

// Routes
app.use('/api/audience', audienceRoutes);
app.use('/api/orders', orderRoutes); // Change route to /api/orders
app.use('/api/campaign', campaignRoutes);
app.use('/api/customers', customerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
