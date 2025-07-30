const express = require('express');
const Razorpay = require('razorpay');
const router = express.Router();

require('dotenv').config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

router.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  try {
    const options = {
      amount: amount * 100, // in paisa
      currency: 'INR',
      receipt: 'receipt_order_' + Math.random().toString(36).slice(2),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Razorpay order failed', error: err.message });
  }
});

module.exports = router;
