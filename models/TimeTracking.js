import mongoose from 'mongoose';

const timeTrackingSchema = new mongoose.Schema({
  contractId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contract', 
    required: true 
  },
  freelancerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
  hours: { 
    type: Number, 
    required: true,
    min: 0.1
  },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'paid'], 
    default: 'pending' 
  },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  approvedAt: { type: Date },
  paymentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Payment' 
  },
  screenshots: [{
    timestamp: { type: Date },
    imageUrl: { type: String },
    activityLevel: { type: Number, min: 0, max: 100 }
  }],
  tasks: [{ type: String }],
  memo: { type: String }
}, { timestamps: true });

// Index for efficient queries
timeTrackingSchema.index({ contractId: 1, date: 1 });
timeTrackingSchema.index({ freelancerId: 1, status: 1 });

export default mongoose.model('TimeTracking', timeTrackingSchema);
