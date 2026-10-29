const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['driver', 'admin'], default: 'driver', index: true },
  wishlist: [{ type: String }], // product slugs
  recentlyViewed: [{ type: String }], // product slugs
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
