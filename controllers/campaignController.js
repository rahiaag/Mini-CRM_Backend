// server/controllers/campaignController.js
const Campaign = require('../models/Campaign');
const Audience = require('../models/Audience');
const Customer = require('../models/Customer');

exports.createCampaign = async (req, res) => {
  const { audienceId, message } = req.body;

  try {
    // Find audience by ID
    const audience = await Audience.findById(audienceId);
    if (!audience) {
      return res.status(404).json({ error: 'Audience not found' });
    }

    // Create new campaign
    const newCampaign = new Campaign({ audienceId, message });
    await newCampaign.save();

    // Retrieve customers based on audience rules
    const customers = await Customer.find(buildQuery(audience.rules));

    // Send messages to customers asynchronously
    customers.forEach(customer => {
      sendDummyMessage(customer, message, newCampaign._id);
    });

    res.status(201).json(newCampaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to build MongoDB query from rules
const buildQuery = (rules) => {
  const query = {};
  rules.forEach(rule => {
    switch (rule.field) {
      case 'totalSpends':
        query.totalSpends = { $gt: rule.value };
        break;
      case 'visits':
        query.visits = { $lte: rule.value };
        break;
      case 'lastVisit':
        const date = new Date();
        date.setMonth(date.getMonth() - rule.value);
        query.lastVisit = { $lt: date };
        break;
      default:
        // Ignore unrecognized fields
        break;
    }
  });
  return query;
};

// Helper function to simulate sending a message to a customer
const sendDummyMessage = (customer, message, campaignId) => {
  // Simulate API call to send message
  setTimeout(() => {
    const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
    // Update campaign status
    Campaign.updateOne({ _id: campaignId }, { status }).exec();
    console.log(`Message to ${customer.name} ${status}`);
  }, 1000);
};
