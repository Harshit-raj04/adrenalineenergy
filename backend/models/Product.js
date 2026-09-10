const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: { type: String, required: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },
  imgSplash: { type: String, required: true },
  color: { type: String, required: true },
  price: { type: Number, required: true, default: 4.99 },
  stock: { type: Number, required: true, default: 100, min: 0 },
}, { timestamps: true });

// Virtual: is available if stock > 0
productSchema.virtual('isAvailable').get(function () {
  return this.stock > 0;
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
