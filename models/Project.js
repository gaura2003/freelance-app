// // import mongoose from 'mongoose';

// // const projectSchema = new mongoose.Schema({
// //   title: { 
// //     type: String, 
// //     required: true,
// //     trim: true,
// //     maxlength: 100
// //   },
// //   description: { 
// //     type: String, 
// //     required: true,
// //     maxlength: 5000
// //   },
// //   clientId: { 
// //     type: mongoose.Schema.Types.ObjectId, 
// //     ref: 'User', 
// //     required: true 
// //   },
// //   category: { 
// //     type: mongoose.Schema.Types.ObjectId, 
// //     ref: 'Category', 
// //     required: true 
// //   },
// //   subcategories: [{ type: String }],
// //   skills: [{ type: String }],
// //   budget: {
// //     type: { type: String, enum: ['fixed', 'hourly'], required: true },
// //     minAmount: { type: Number },
// //     maxAmount: { type: Number },
// //     currency: { type: String, default: 'USD' }
// //   },
// //   duration: {
// //     type: { type: String, enum: ['short', 'medium', 'long'] },
// //     estimatedHours: { type: Number }
// //   },
// //   status: { 
// //     type: String, 
// //     enum: ['draft', 'open', 'in_progress', 'completed', 'cancelled'], 
// //     default: 'open' 
// //   },
// //   visibility: {
// //     type: String,
// //     enum: ['public', 'private', 'invite_only'],
// //     default: 'public'
// //   },
// //   attachments: [{
// //     filename: { type: String },
// //     originalName: { type: String },
// //     mimeType: { type: String },
// //     size: { type: Number },
// //     url: { type: String }
// //   }],
// //   location: {
// //     type: { type: String, enum: ['remote', 'onsite', 'hybrid'] },
// //     country: { type: String },
// //     city: { type: String }
// //   },
// //   deadline: { type: Date },
// //   experienceLevel: { 
// //     type: String, 
// //     enum: ['entry', 'intermediate', 'expert'] 
// //   },
// //   invitedFreelancers: [{ 
// //     type: mongoose.Schema.Types.ObjectId, 
// //     ref: 'User' 
// //   }],
// //   featured: { type: Boolean, default: false },
// //   views: { type: Number, default: 0 }
// // }, { 
// //   timestamps: true,
// //   toJSON: { virtuals: true },
// //   toObject: { virtuals: true }
// // });

// // // Virtual for proposals
// // projectSchema.virtual('proposals', {
// //   ref: 'Proposal',
// //   localField: '_id',
// //   foreignField: 'projectId'
// // });

// // export default mongoose.model('Project', projectSchema);
// import mongoose from 'mongoose';

// const projectSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   budget: { type: Number, required: true },
//   deadline: { type: Date, required: true },
//   category: { type: String, required: true },
//   skills: [{ type: String }],
//   status: { 
//     type: String, 
//     enum: ['open', 'in_progress', 'completed', 'cancelled'], 
//     default: 'open' 
//   },
//   attachments: [{ 
//     name: String, 
//     url: String, 
//     type: String 
//   }],
//   // Social features
//   likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   shares: { type: Number, default: 0 },
//   views: { type: Number, default: 0 },
//   savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
//   // Visibility settings
//   visibility: { 
//     type: String, 
//     enum: ['public', 'private', 'connections'], 
//     default: 'public' 
//   },
//   // For featured/promoted projects
//   featured: { type: Boolean, default: false },
//   featuredUntil: { type: Date },
// }, { timestamps: true });

// // Add indexes for efficient querying
// projectSchema.index({ status: 1, category: 1 });
// projectSchema.index({ skills: 1 });
// projectSchema.index({ clientId: 1 });
// projectSchema.index({ createdAt: -1 });

// export default mongoose.model('Project', projectSchema);
import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  budget: { type: Number, required: true },
  deadline: { type: Date, required: true },
  category: { type: String, required: true },
  skills: [{ type: String }],
  status: { 
    type: String, 
    enum: ['draft', 'open', 'in_progress', 'completed', 'cancelled'], 
    default: 'open' 
  },
  visibility: { type: String, enum: ['public', 'private', 'invite_only'], default: 'public' },
  location: { type: String },
  attachments: [{
    name: { type: String },
    url: { type: String },
    type: { type: String }
  }],
  views: { type: Number, default: 0 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  savedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  shares: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  assignedFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicationCount: { type: Number, default: 0 },
  featuredUntil: { type: Date }
}, { timestamps: true });

// Add text index for search functionality
projectSchema.index({ title: 'text', description: 'text', skills: 'text' });

export default mongoose.model('Project', projectSchema);
