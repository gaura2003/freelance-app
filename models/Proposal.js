import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  coverLetter: { 
    type: String, 
    required: true,
    maxlength: 2000
  },
  proposedBudget: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    type: { type: String, enum: ['fixed', 'hourly'], required: true }
  },
  estimatedDuration: {
    value: { type: Number },
    unit: { type: String, enum: ['hours', 'days', 'weeks', 'months'] }
  },
  attachments: [{
    filename: { type: String },
    originalName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    url: { type: String }
  }],
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'], 
    default: 'pending' 
  },
  milestones: [{
    title: { type: String },
    description: { type: String },
    amount: { type: Number },
    dueDate: { type: Date }
  }],
  isClientViewed: { type: Boolean, default: false },
  clientFeedback: { type: String }
}, { timestamps: true });

// Compound index to ensure one proposal per freelancer per project
proposalSchema.index({ projectId: 1, freelancerId: 1 }, { unique: true });

export default mongoose.model('Proposal', proposalSchema);
