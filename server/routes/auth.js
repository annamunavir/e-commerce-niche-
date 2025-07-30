const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const multer = require('multer');
const { storage } = require('../config/cloudinary'); // from your existing config
const upload = multer({ storage });

require('dotenv').config();

// Helper functions
const getInitials = (name = '') => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

const getRandomColor = () => {
  const colors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFD93D', '#C04CFD', '#FF8C42'];
  return colors[Math.floor(Math.random() * colors.length)];
};





// ==============================
// ✅ LOGIN ROUTE
// ==============================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;


  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // ✅ Include role in the token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, role: user.role, userName: user.userName });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ==============================
// ✅ REGISTER ROUTE
// ==============================
router.post('/register', async (req, res) => {
  const { email, password, userName } = req.body;

  try {
    console.log("Register request:", req.body);

    if (!email || !password || !userName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already used' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      role: 'client' // ✅ set explicitly
    });

    await newUser.save();

    res.status(201).json({ message: 'Account created successfully' });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// add new address to profile 

router.post("/profile/newAddress", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phoneNumber, house, street, city, state, pincode } = req.body;

    if (!name || !phoneNumber || !house || !street || !city || !state || !pincode) {
      return res.status(400).json({ message: "Missing address fields" });
    }

    const newAddress = {
      name,
      phoneNumber,
      house,
      street,
      city,
      state,
      pincode,
    };

    if (!user.profile.addresses) {
      user.profile.addresses = [newAddress];
    } else if (user.profile.addresses.length >= 2) {
      return res.status(400).json({ message: "Maximum 2 addresses allowed" });
    } else {
      user.profile.addresses.push(newAddress);
    }

    await user.save();
    res.json({ message: "Address added successfully", addresses: user.profile.addresses });
  } catch (error) {
    console.error("Error adding address:", error);
    return res.status(500).json({ message: "Server error while adding address" });
  }
});

// DELETE address by index (0 or 1)
router.delete('/profile/address/:index', auth, async (req, res) => {
  try {
    const { index } = req.params;
    const user = await User.findById(req.user.id);
    if (!user || !user.profile?.addresses) {
      return res.status(404).json({ message: 'User or addresses not found' });
    }

    const idx = parseInt(index);
    if (isNaN(idx) || idx < 0 || idx >= user.profile.addresses.length) {
      return res.status(400).json({ message: 'Invalid address index' });
    }

    user.profile.addresses.splice(idx, 1);
    await user.save();

    res.json({ message: 'Address deleted', addresses: user.profile.addresses });
  } catch (err) {
    console.error('Error deleting address:', err);
    res.status(500).json({ message: 'Server error deleting address' });
  }
});



// ==============================
// ✅ UPDATE USER PROFILE (with 2 addresses)
// ==============================
router.put('/profile', auth, upload.single('avatar'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { fullName, phone, addresses } = req.body;

    if (!user.profile) user.profile = {};

    user.profile.fullName = fullName || user.profile.fullName;
    user.profile.phone = phone || user.profile.phone;

    // ✅ Parse and assign addresses if sent
    if (addresses) {
      try {
        const parsedAddresses = JSON.parse(addresses);
        if (Array.isArray(parsedAddresses)) {
          user.profile.addresses = parsedAddresses;
        }
      } catch (err) {
        return res.status(400).json({ message: 'Invalid address format' });
      }
    }

    // ✅ Handle avatar upload
    if (req.file && req.file.path) {
      user.profile.avatar = req.file.path;
    }

    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
});




// ==============================
// ✅ GET USER PROFILE (with 2 addresses)
// ==============================
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const profile = user.profile || {};
    // const addresses = profile.addresses || [];
    const addressesWithDefaults=user.profile.addresses.map((addr)=>({
      ...addr.toObject(),
      name :addr.name ||user.profile. fullName,
      phoneNumber:addr.phoneNumber || user.profile.phone
    }))


    const response = {
      userName: user.userName,
      email: user.email,
      role: user.role,
      profile: {
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        avatar: profile.avatar || '',
        addresses: addressesWithDefaults,
      }
    };

    // Set initials & background color if no avatar
    if (!response.profile.avatar) {
      response.profile.initials = getInitials(user.userName);
      response.profile.bgColor = getRandomColor();
    }

    res.json(response);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// ✅ GET USER CART - Full Product Info
  router.get('/cart', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.cart); // Each cart item will now include full product info
  } catch (err) {
    console.error('❌ Error fetching cart:', err);
    res.status(500).json({ message: 'Error fetching cart' });
  }
});
// ADD TO CART

router.post('/cart/add/:productId', auth, async (req, res) => {
  const { productId } = req.params;
  try {
    const user = req.user;
    const exists = user.cart.find(item => item.product.toString() === productId);

    if (!exists) {
      user.cart.push({ product: productId, quantity: 1 });
      await user.save();
      return res.json({ message: 'Product added to cart', cart: user.cart });
    }

    res.status(400).json({ message: 'Product already in cart' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding to cart' });
  }
});

// UPDATE CART ITEM QUANTITY

router.put('/cart/update/:productId', auth, async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  try {
    const user = req.user;
    const item = user.cart.find(item => item.product.toString() === productId);

    if (item) {
      item.quantity = quantity;
      await user.save();
      return res.json({ message: 'Quantity updated', cart: user.cart });
    }

    res.status(404).json({ message: 'Product not found in cart' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating cart' });
  }
});

// ==============================
// ✅ REMOVE ITEM FROM CART
// ==============================
router.delete('/cart/:productId', auth, async (req, res) => {
  const { productId } = req.params;
  try {
    const user = req.user;
    user.cart = user.cart.filter(item => item.product.toString() !== productId);
    await user.save();
    res.json({ message: 'Item removed', cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: 'Error removing item from cart' });
  }
});

// // Clear entire cart
// router.delete('/cart/clear', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);

//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.cart = []; // Clear cart
//     await user.save(); // Save changes to DB

//     res.json({ message: 'Cart cleared successfully' });
//   } catch (error) {
//     console.error('Error clearing cart:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });






// ==============================
// ✅ GET SHORTLIST
// ==============================
router.get('/shortlist', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('shortlist')
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user.shortlist); // return the populated shortlist
  } catch (err) {
    console.error("Error fetching shortlist:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ==============================
// ✅ ADD TO SHORTLIST
// ==============================
router.post('/shortlist/:productId', auth, async (req, res) => {
  const { productId } = req.params;
  try {
    const user = req.user;
    if (!user.shortlist.includes(productId)) {
      user.shortlist.push(productId);
      await user.save();
    }
    res.json({ message: 'Shortlist updated', shortlist: user.shortlist });
  } catch (err) {
    res.status(500).json({ message: 'Error updating shortlist' });
  }
});

// ==============================
// ✅ REMOVE FROM SHORTLIST
// ==============================
router.delete('/shortlist/:productId', auth, async (req, res) => {
  const { productId } = req.params;
  try {
    const user = req.user;
    user.shortlist = user.shortlist.filter(id => id.toString() !== productId);
    await user.save();
    res.json({ message: 'Item removed from shortlist', shortlist: user.shortlist });
  } catch (err) {
    res.status(500).json({ message: 'Error removing from shortlist' });
  }
});





module.exports = router;
