const mongoose = require('mongoose');


const addressSchema = new mongoose.Schema({
  name:{type:String},
  phoneNumber:{type:String},
  house: { type: String, default: '' },
  street: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  pincode: { type: String, default: '' }
}, { _id: false }); // prevents automatic _id for each address





const userSchema = new mongoose.Schema({
 userName: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: { 
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'client'],
    default: 'admin' // always set default as 'client'
  },
      profile: {
    fullName: { type: String, default: '' },
    avatar: { type: String, default: '' },
    phone: { type: String, default: '' },
      // ✅ address is now an array (max 2)
    addresses: {
      type: [addressSchema],
      validate: [arrayLimit, '{PATH} exceeds the limit of 2']
    }
  },
  
  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 }
    }
  ],
  shortlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  ]


}, {
  timestamps: true
});


// Function to validate max 2 addresses
function arrayLimit(val) {
  return val.length <= 2;
}



module.exports = mongoose.models.User || mongoose.model('User', userSchema)
