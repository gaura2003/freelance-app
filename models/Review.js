import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  projectId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Project', 
    required: true 
  },
  contractId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Contract', 
    required: true 
  },
  reviewerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  receiverId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true,
    min: 1,
    max: 5
  },
  comment: { type: String, maxlength: 1000 },
  reviewType: { 
    type: String, 
    enum: ['client_to_freelancer', 'freelancer_to_client'],
    required: true
  },
  skills: [{
    skill: { type: String },
    rating: { type: Number, min: 1, max: 5 }
  }],
  isPublic: { type: Boolean, default: true },
  response: {
    content: { type: String },
    createdAt: { type: Date }
  },
  attributes: {
    communication: { type: Number, min: 1, max: 5 },
    qualityOfWork: { type: Number, min: 1, max: 5 },
    valueForMoney: { type: Number, min: 1, max: 5 },
    professionalism: { type: Number, min: 1, max: 5 },
    hireAgain: { type: Boolean }
  }
}, { timestamps: true });

// Ensure one review per user per contract
reviewSchema.index({ contractId: 1, reviewerId: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
