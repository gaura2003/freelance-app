import mongoose from 'mongoose';

const disputeSchema = new mongoose.Schema({
  contractId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contract', 
    required: true 
  },
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  initiatorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  respondentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  reason: { 
    type: String, 
    enum: [
      'payment_issue', 
      'work_quality', 
      'communication_problem',
      'scope_change',
      'deadline_missed',
      'terms_violation',
      'other'
    ],
    required: true
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['open', 'under_review', 'resolved', 'closed'], 
    default: 'open' 
  },
  resolution: {
    outcome: { 
      type: String, 
      enum: ['in_favor_of_client', 'in_favor_of_freelancer', 'compromise', 'no_resolution'] 
    },
    description: { type: String },
    compensationAmount: { type: Number },
    resolvedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    resolvedAt: { type: Date }
  },
  attachments: [{
    filename: { type: String },
    originalName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    url: { type: String }
  }],
  messages: [{
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User' 
    },
    content: { type: String },
    attachments: [{
      filename: { type: String },
      url: { type: String }
    }],
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Dispute', disputeSchema);
