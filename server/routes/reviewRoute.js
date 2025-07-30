const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Product = require('../models/product');

// ✅ POST: Add a new review to a product
router.post('/:id/review', auth, async (req, res) => {
  const { rating, review } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // 🔒 Prevent duplicate reviews by same user
    const alreadyReviewed = product.reviews.some(
      (r) => r.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You already reviewed this product' });
    }

    const newReview = {
      user: req.user.id,
      rating: Number(rating),
      review,
    };

    product.reviews.push(newReview);

    // 🧮 Update rating stats
    product.numReviews = product.reviews.length;
    product.averageRating = Number(
      product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.numReviews
    ).toFixed(1);

    await product.save();

    res.status(201).json({ message: 'Review added successfully', reviewId: newReview._id });
  } catch (err) {
    res.status(500).json({ message: 'Error adding review', error: err.message });
  }
});

// ✅ GET: Get current user's review for a product
router.get('/:productId/myreview', auth, async (req, res) => {
  const { productId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const review = product.reviews.find(r => r.user.toString() === req.user.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    res.json(review);
  } catch (err) {
    console.error('Failed to fetch review:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ GET: Fetch all reviews for a product with reviewer name
router.get('/:id/reviews', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews.user', 'userName');

    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product.reviews);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reviews', error: err.message });
  }
});


// ✅ PUT: Update a user's review for a product
router.put('/:productId/review/:reviewId', auth, async (req, res) => {
  const { rating, review } = req.body;

  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const reviewToUpdate = product.reviews.find(
      (r) =>
        r._id.toString() === req.params.reviewId &&
        r.user.toString() === req.user.id
    );

    if (!reviewToUpdate) {
      return res.status(403).json({ message: 'Review not found or unauthorized' });
    }

    reviewToUpdate.rating = Number(rating);
    reviewToUpdate.review = review;

    // 🧮 Recalculate average rating
    product.averageRating = Number(
      product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.reviews.length
    ).toFixed(1);

    await product.save();
    res.json({ message: 'Review updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating review', error: err.message });
  }
});

// ✅ DELETE: Remove a user's review
router.delete('/:productId/review/:reviewId', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const reviewIndex = product.reviews.findIndex(
      (r) =>
        r._id.toString() === req.params.reviewId &&
        r.user.toString() === req.user.id
    );

    if (reviewIndex === -1) {
      return res.status(403).json({ message: 'Review not found or unauthorized' });
    }

    product.reviews.splice(reviewIndex, 1);

    // 🧮 Update rating stats
    if (product.reviews.length > 0) {
      product.numReviews = product.reviews.length;
      product.averageRating = Number(
        product.reviews.reduce((acc, item) => acc + item.rating, 0) / product.numReviews
      ).toFixed(1);
    } else {
      product.numReviews = 0;
      product.averageRating = 0;
    }

    await product.save();
    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review', error: err.message });
  }
});

module.exports = router;
