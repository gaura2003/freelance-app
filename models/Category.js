import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true
  },
  description: { type: String },
  icon: { type: String },
  parentCategory: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category' 
  },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parentCategory'
});

export default mongoose.model('Category', categorySchema);
