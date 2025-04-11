import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  path: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true }
});

const applicationSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  proposedBudget: { type: Number, required: true },
  estimatedDuration: { type: String },
  attachments: [attachmentSchema],
  status: { 
    type: String, 
    enum: ['pending', 'shortlisted', 'accepted', 'rejected'], 
    default: 'pending' 
  },
  clientNotes: { type: String },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

// Ensure a freelancer can only apply once to a project
applicationSchema.index({ projectId: 1, freelancerId: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
