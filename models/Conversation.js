import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }],
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project' 
  },
  lastMessage: {
    content: { type: String },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date }
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Ensure unique conversation between participants
conversationSchema.index({ participants: 1 }, { unique: true });

export default mongoose.model('Conversation', conversationSchema);
