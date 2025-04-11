import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // For nested comments/replies
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
  // For moderation
  isHidden: { type: Boolean, default: false },
}, { timestamps: true });

// Add indexes for efficient querying
commentSchema.index({ projectId: 1, createdAt: -1 });
commentSchema.index({ parentId: 1 });

export default mongoose.model('Comment', commentSchema);
