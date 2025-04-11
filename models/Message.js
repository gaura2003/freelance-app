import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  contractId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  attachments: [{
    filename: { type: String },
    originalName: { type: String },
    mimeType: { type: String },
    size: { type: Number },
    url: { type: String }
  }],
  messageType: { 
    type: String, 
    enum: ['text', 'file', 'system'], 
    default: 'text' 
  }
}, { timestamps: true });

// Index for conversation queries
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ projectId: 1 });

export default mongoose.model('Message', messageSchema);
