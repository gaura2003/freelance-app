import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['like', 'comment', 'share', 'save', 'apply', 'post'], 
    required: true 
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // For tracking in analytics
  metadata: { type: Object },
}, { timestamps: true });

// Add indexes for efficient querying
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ projectId: 1, type: 1 });

export default mongoose.model('Activity', activitySchema);
