const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true,
  },
  name: { type: String, required: true, trim: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },
  imgSplash: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true, default: 4.99, min: 0, index: true },
  stock: { type: Number, required: true, default: 100, min: 0, index: true },
  category: { 
    type: String, 
    enum: ['HIGH_OCTANE', 'ENDURANCE', 'ZERO_SUGAR', 'RECOVERY'], 
    default: 'HIGH_OCTANE',
    index: true,
  },
  caffeine: { type: Number, default: 180, min: 0, index: true }, // mg
  sugar: { type: Number, default: 0, min: 0, index: true }, // grams
  rating: { type: Number, default: 4.9, min: 1, max: 5 },
  reviewsCount: { type: Number, default: 42, min: 0 },
  tags: [{ type: String, trim: true }],
  featured: { type: Boolean, default: true, index: true },
}, { timestamps: true });

// Text search index on name, desc, tags
productSchema.index({ name: 'text', desc: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ caffeine: 1, sugar: 1 });

// Virtual: is available if stock > 0
productSchema.virtual('isAvailable').get(function () {
  return this.stock > 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
