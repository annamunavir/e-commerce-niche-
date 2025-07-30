const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const auth = require('../middleware/auth');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

// -------------------------------------------
// ✅ 1. Place a New Order (User)
// -------------------------------------------
router.post('/', auth, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      deliveryStatus,
      totalPrice,
      discount,
      deliveryFee,
      totalAmount,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided' });
    }

    // ✅ Fetch the user before trying to clear their cart
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newOrder = new Order({
      user: req.userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentStatus || 'pending',
      deliveryStatus: deliveryStatus || 'processing',
      totalPrice,
      discount,
      deliveryFee,
      totalAmount,
    });

    const savedOrder = await newOrder.save();
    // ✅ Clear the user's cart
    user.cart = [];
    await user.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', error: err.message });
  }
});

// -------------------------------------------
// ✅ 2. Get Current Logged-in User's Orders
// -------------------------------------------
router.get('/myorders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate({
        path: 'orderItems.product',
        select: 'productName price offerPrice image',
        model: 'Product',
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get user orders', error: err.message });
  }
});

// -------------------------------------------
// ✅ 3. Admin: Get All Orders
// -------------------------------------------
router.get('/', auth, adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'userName email')
      .populate({
        path: 'orderItems.product',
        select: 'productName price offerPrice image',
        model: 'Product',
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all orders', error: err.message });
  }
});

// -------------------------------------------
// ✅ 4. Get a Single Order by ID
// -------------------------------------------
router.get('/:id', auth, async (req, res) => {
  try {
    const orderDetails = await Order.findById(req.params.id)
      .populate('orderItems.product')
      .populate('user', 'userName email');

    if (!orderDetails) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(orderDetails);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching order', error: err.message });
  }
});

// -------------------------------------------
// ✅ 5. Admin: Update Payment/Delivery Status
// -------------------------------------------
router.put('/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { paymentStatus, deliveryStatus } = req.body;

    const foundOrder = await Order.findById(req.params.id);
    if (!foundOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (paymentStatus) {
      foundOrder.paymentStatus = paymentStatus;
      if (paymentStatus === 'paid') {
        foundOrder.paymentAt = new Date();
      }
    }

    if (deliveryStatus) {
      foundOrder.deliveryStatus = deliveryStatus;
      if (deliveryStatus === 'delivered') {
        foundOrder.deliveredAt = new Date();
      }
    }

    const updatedOrder = await foundOrder.save();
    res.json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
});

module.exports = router;
