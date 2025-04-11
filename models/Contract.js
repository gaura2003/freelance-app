import mongoose from 'mongoose';

const contractSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
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
  proposalId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Proposal' 
  },
  terms: {
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    paymentType: { type: String, enum: ['fixed', 'hourly'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    description: { type: String, required: true }
  },
  milestones: [{
    title: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    dueDate: { type: Date },
    status: { 
      type: String, 
      enum: ['pending', 'in_progress', 'submitted', 'approved', 'rejected', 'paid'], 
      default: 'pending' 
    },
    submissionDate: { type: Date },
    approvalDate: { type: Date },
    paymentDate: { type: Date },
    feedback: { type: String }
  }],
  status: { 
    type: String, 
    enum: ['draft', 'active', 'completed', 'terminated', 'disputed'], 
    default: 'draft' 
  },
  clientSigned: { type: Boolean, default: false },
  freelancerSigned: { type: Boolean, default: false },
  signedDate: { type: Date },
  completedDate: { type: Date },
  terminationReason: { type: String },
  attachments: [{
    filename: { type: String },
    originalName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    url: { type: String }
  }]
}, { timestamps: true });

export default mongoose.model('Contract', contractSchema);
