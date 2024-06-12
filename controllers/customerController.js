// server/controllers/customerController.js
const Customer = require('../models/Customer');

exports.createCustomer = async (req, res) => {
    try {
        // Extract name and email from request body
        const { name, email } = req.body;

        // Check if name and email are provided
        if (!name || !email) {
            return res.status(400).json({ error: 'Name and Email are required' });
        }

        // Create new customer
        const newCustomer = new Customer({ name, email });
        await newCustomer.save();

        // Send success response with created customer object
        res.status(201).json(newCustomer);
    } catch (error) {
        console.error('Error creating customer:', error);
        // Send error response with appropriate status code and error message
        res.status(500).json({ error: 'Internal server error' });
    }
};
