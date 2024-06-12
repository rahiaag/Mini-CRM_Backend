// server/controllers/orderController.js
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const { ObjectId } = require('mongoose').Types;

exports.createOrder = async (req, res) => {
    try {
        // Extract customerId and amount from request body
        const { customerId, amount } = req.body;

        // Check if customerId and amount are provided
        if (!customerId || !amount) {
            return res.status(400).json({ error: 'Customer ID and Amount are required' });
        }

        // Validate customerId to ensure it is a valid ObjectId
        if (!ObjectId.isValid(customerId)) {
            return res.status(400).json({ error: 'Invalid Customer ID' });
        }

        // Create new order
        const order = new Order({ customerId, amount });
        await order.save();

        // Update customer's total spends and visits
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
        }
        customer.totalSpends += amount;
        customer.visits += 1;
        customer.lastVisit = new Date();
        await customer.save();

        // Send success response with created order object
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        // Send error response with appropriate status code and error message
        res.status(500).json({ error: 'Internal server error' });
    }
};
