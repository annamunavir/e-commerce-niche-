const mongoose = require('mongoose');

// 📌 Review subdocument schema
const reviewSchema = new mongoose.Schema({
  user: {
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
  review: {
    type: String
  },
  reviewedAt: {
    type: Date,
    default: Date.now
  },
  title: {
    type: String
  },
  images: [String]
}, { timestamps: true });

// 📦 Main Product schema
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  offerPercentage: {
    type: Number,
    default: null
  },
  offerPrice: {
    type: Number,
    default: null
  },
  stock: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: String
  },
  ageGroup: {
    type: String,
    enum: ['0-6 Months', '6-12 Months', '1-3 Years', '3-6 Years', '6-11 Years', '11+ Years', 'Ladies']
  },
  gender: {
    type: String,
    enum: ['Boys', 'Girls', 'Unisex', 'Ladies']
  },
  image: {
    type: String
  },

  // ✅ Reviews and rating summary
  reviews: [reviewSchema],
  averageRating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
