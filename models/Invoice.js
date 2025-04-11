import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  },
  contractId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contract' 
  },
  issueDate: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  dueDate: { 
    type: Date, 
    required: true 
  },
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    amount: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  taxRate: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  notes: { type: String },
  terms: { type: String },
  status: { 
    type: String, 
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'], 
    default: 'draft' 
  },
  paymentMethod: { type: String },
  paymentDate: { type: Date },
  paymentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Payment' 
  }
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
