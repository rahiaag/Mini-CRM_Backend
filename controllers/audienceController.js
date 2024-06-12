// server/controllers/audienceController.js
const Audience = require('../models/Audience');
const Customer = require('../models/Customer');

exports.checkAudienceSize = async (req, res) => {
  try {
    const { rules } = req.body;

    // Validate input data
    if (!Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty rules array' });
    }

    // Build query based on rules
    const query = buildQueryFromRules(rules);

    // Get audience size
    const audienceSize = await Customer.countDocuments(query);

    res.json({ size: audienceSize });
  } catch (error) {
    console.error('Error checking audience size:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.saveAudience = async (req, res) => {
  try {
    const { rules } = req.body;

    // Validate input data
    if (!Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty rules array' });
    }

    // Save audience with rules
    const newAudience = new Audience({ rules });
    await newAudience.save();

    res.status(201).json(newAudience);
  } catch (error) {
    console.error('Error saving audience:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper function to build MongoDB query from rules
const buildQueryFromRules = (rules) => {
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
