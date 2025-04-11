import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['deposit', 'withdrawal', 'payment', 'refund', 'fee', 'transfer'], 
    required: true 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  currency: { 
    type: String, 
    default: 'USD' 
  },
  description: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'cancelled'], 
    default: 'pending' 
  },
  relatedId: { 
    type: mongoose.Schema.Types.ObjectId 
  },
  relatedType: { 
    type: String, 
    enum: ['payment', 'contract', 'project', 'withdrawal'] 
  },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

const walletSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    unique: true
  },
  balance: { 
    type: Number, 
    default: 0,
    min: 0
  },
  currency: { 
    type: String, 
    default: 'USD' 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  pendingBalance: { 
    type: Number, 
    default: 0 
  },
  transactions: [transactionSchema],
  paymentMethods: [{
    type: { 
      type: String, 
      enum: ['bank_account', 'paypal', 'credit_card', 'crypto'], 
      required: true 
    },
    isDefault: { type: Boolean, default: false },
    details: { type: mongoose.Schema.Types.Mixed },
    lastUsed: { type: Date }
  }]
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('Wallet', walletSchema);
