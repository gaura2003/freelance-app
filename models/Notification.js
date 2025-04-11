import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: [
      'new_message', 
      'proposal_received', 
      'proposal_accepted', 
      'contract_created',
      'payment_received',
      'milestone_approved',
      'project_completed',
      'review_received',
      'project_invitation',
      'system'
    ],
    required: true
  },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  readAt: { type: Date },
  entityId: { type: mongoose.Schema.Types.ObjectId }, // Reference to related entity
  entityType: { 
    type: String, 
    enum: ['project', 'proposal', 'contract', 'message', 'payment', 'review'] 
  },
  metadata: { type: mongoose.Schema.Types.Mixed },
  priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' }
}, { timestamps: true });

// Index for quick user notification queries
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Notification', notificationSchema);
