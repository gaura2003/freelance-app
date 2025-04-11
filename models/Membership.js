const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    enum: ['Basic', 'Premium', 'Pro'],
    default: 'Basic'
  },
  price: { 
    type: Number, 
    required: true 
  },
  duration: { 
    type: Number, // in months
    required: true,
    default: 1
  },
  features: [{ 
    type: String 
  }],
  projectBidsPerMonth: {
    type: Number,
    default: 10
  },
  featuredProfile: {
    type: Boolean,
    default: false
  },
  prioritySupport: {
    type: Boolean,
    default: false
  },
  commissionRate: {
    type: Number, // percentage
    default: 10
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, { timestamps: true });

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;
