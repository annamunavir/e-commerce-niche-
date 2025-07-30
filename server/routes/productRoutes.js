const express = require('express');
const multer = require('multer');
const router = express.Router();
const Product = require('../models/product'); // ✅ Capital P
const { storage } = require('../config/cloudinary');
const mongoose = require('mongoose');

const upload = multer({ storage });

//*************search product ***************

  router.get("/search",async(req,res)=>{
    const query =req.query.query;
    if(!query || query.trim() === ""){
      return res.status(400).json({message:"search query is required"})
    }
    try {
      const regex = new RegExp(query,'i');
      const products =await Product.find({
        $or:[{productName:regex},{brand:regex},{category:regex}]
      });
      res.json(products)
    } catch (error) {
      res.status(500).json({message:"server error"})
    }
  })








// ************ ADD PRODUCT ************
router.post('/', upload.single('image'), async (req, res) => {
  try {
    console.log('📥 Add product triggered');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'Image upload failed' });
    }

    const imageUrl = req.file.path;

    const price = Number(req.body.price);
    const offerPercentage = Number(req.body.offerPercentage) || 0;
    const offerPrice = offerPercentage
      ? Math.round(price - (offerPercentage / 100) * price)
      : price;

    const newProduct = new Product({
      ...req.body,
      price,
      offerPercentage: offerPercentage || null,
      offerPrice,
      image: imageUrl,
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (err) {
    console.error('❌ Error creating product:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// **************Get products****************
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    if (page && limit) {
      // ✅ Paginated
      const skip = (page - 1) * limit;
      const products = await Product.find().skip(skip).limit(limit);
      const total = await Product.countDocuments();
      return res.json({
        page,
        totalPages: Math.ceil(total / limit),
        products
      });
    } else {
      // ✅ All Products
      const products = await Product.find();
      return res.json(products);
    }
  } catch (err) {
    console.error('❌ Fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch products', error: err.message });
  }
});






// ************ GET PRODUCT BY ID ************
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid product ID' });
  }

  try {
    const product = await Product.findById(id); // ✅
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error('❌ Error fetching product:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});


// ************ DELETE PRODUCT ************
router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id); // ✅
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('❌ Error deleting product:', err.message);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});


// ************ UPDATE PRODUCT ************
// router.put('/:id', upload.single('image'), async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid product ID' });
//     }

//     const existingProduct = await Product.findById(id);
//     if (!existingProduct) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     // Image handling
//     const imageUrl = req.file?.path || existingProduct.image;

//     // Prepare updated fields
//     const updatedFields = {
//       ...req.body,
//       image: imageUrl,
//     };

//     // Convert number fields safely
//     updatedFields.price = Number(updatedFields.price) || 0;
//     updatedFields.stock = Number(updatedFields.stock) || 0;

//     if (updatedFields.offerPercentage === '' || updatedFields.offerPercentage === null || updatedFields.offerPercentage === undefined) {
//       updatedFields.offerPercentage = null;
//     } else {
//       updatedFields.offerPercentage = Number(updatedFields.offerPercentage);
//     }

//     const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, { new: true });

//     res.json({ message: 'Product updated successfully', product: updatedProduct });

//   } catch (err) {
//     console.error('❌ Error updating product:', err.message);
//     res.status(500).json({ message: 'Server error while updating product' });
//   }
// });

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Handle image upload or use existing
    const imageUrl = req.file?.path || existingProduct.image;

    // Prepare updated fields
    const updatedFields = {
      ...req.body,
      image: imageUrl,
    };

    // Convert and calculate numeric fields
    const price = Number(updatedFields.price);
    const stock = Number(updatedFields.stock);
    const offerPercentage =
      updatedFields.offerPercentage === '' ||
      updatedFields.offerPercentage === null ||
      updatedFields.offerPercentage === undefined
        ? null
        : Number(updatedFields.offerPercentage);

    const offerPrice =
      offerPercentage !== null
        ? Math.round(price - (offerPercentage / 100) * price)
        : price;

    updatedFields.price = price;
    updatedFields.stock = stock;
    updatedFields.offerPercentage = offerPercentage;
    updatedFields.offerPrice = offerPrice;

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (err) {
    console.error('❌ Error updating product:', err.message);
    res.status(500).json({ message: 'Server error while updating product' });
  }
});



module.exports = router;

