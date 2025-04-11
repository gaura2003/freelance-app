import mongoose from 'mongoose';
import bcrypt from 'mongoose-bcrypt';

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: { 
    type: String, 
    required: true 
  },
  profile: {
    fullName: { type: String, trim: true },
    bio: { type: String, maxlength: 500 },
    skills: [{ type: String }],
    location: { type: String },
    profileImageUrl: { type: String },
    hourlyRate: { type: Number },
    title: { type: String },
    languages: [{ 
      language: { type: String },
      proficiency: { type: String, enum: ['basic', 'conversational', 'fluent', 'native'] }
    }],
    education: [{
      institution: { type: String },
      degree: { type: String },
      fieldOfStudy: { type: String },
      from: { type: Date },
      to: { type: Date },
      current: { type: Boolean, default: false }
    }],
    experience: [{
      company: { type: String },
      position: { type: String },
      description: { type: String },
      from: { type: Date },
      to: { type: Date },
      current: { type: Boolean, default: false }
    }]
  },
  role: { 
    type: String, 
    enum: ['freelancer', 'client', 'admin'], 
    default: 'freelancer' 
  },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  isDarkMode: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  accountStatus: { 
    type: String, 
    enum: ['active', 'suspended', 'deactivated'], 
    default: 'active' 
  },
  socialProfiles: {
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    twitter: { type: String }
  },
  savedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  notifications: {
    email: { type: Boolean, default: true },
    projectInvites: { type: Boolean, default: true },
    messages: { type: Boolean, default: true },
    marketing: { type: Boolean, default: false }
  },
  membership: {
    type: {
      type: String,
      enum: ['Basic', 'Premium', 'Pro'],
      default: 'Basic'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: function() {
        // Default to 1 month from now
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
      }
    },
    autoRenew: {
      type: Boolean,
      default: false
    },
    membershipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Membership'
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for reviews received
userSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'receiverId'
});

// Virtual for average rating
userSchema.virtual('averageRating').get(function() {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / this.reviews.length).toFixed(1);
  }
  return null;
});

// Add password hashing plugin
userSchema.plugin(bcrypt, { fields: ['passwordHash'] });

export default mongoose.model('User', userSchema);
