const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: { type: Number, required: true }
    }
  ],
  shippingAddress: {
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: {type:String,required:true}
},

  paymentMethod: {
     type: String,
    enum: ['card', 'netbanking', 'upi', 'cod'],
     required: true
   },
   paymentStatus: {
     type: String,
     enum: ['pending', 'paid', 'failed', 'refunded'],
   default: 'pending'
   },
  deliveryStatus: {
    type: String,
    enum: ['processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'processing'
  },
  totalPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },

  isCancelled: { type: Boolean, default: false },

  orderedAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date },
   paymentAt: { type: Date }
}, { timestamps: true });


module.exports = mongoose.model('Order', orderSchema);
