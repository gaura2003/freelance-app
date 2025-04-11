import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
  milestoneId: { type: mongoose.Schema.Types.ObjectId },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  paymentMethod: { 
    type: String, 
    enum: ['credit_card', 'paypal', 'bank_transfer', 'escrow', 'wallet'],
    required: true
  },
  paymentType: { 
    type: String, 
    enum: ['milestone', 'hourly', 'deposit', 'refund', 'platform_fee'],
    required: true
  },
  description: { type: String },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'disputed'], 
    default: 'pending' 
  },
  transactionId: { type: String },
  paymentDate: { type: Date },
  platformFee: { type: Number },
  taxAmount: { type: Number, default: 0 },
  invoiceId: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
