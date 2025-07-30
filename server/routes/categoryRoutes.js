const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage });

const Category = require('../models/category');

// ✅ Add new category
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { category, subCategory } = req.body;
    const image = req.file?.path;

    if (!category || !image) {
      return res.status(400).json({ message: 'Category name and image are required' });
    }

    const subCategoryArray = subCategory
      ? subCategory.split(',').map(sub => sub.trim()).filter(Boolean)
      : [];

    const newCategory = new Category({
      category,
      subCategory: subCategoryArray,
      image
    });

    await newCategory.save();
    res.status(201).json({ message: 'Category added', category: newCategory });
  } catch (err) {
    console.error('❌ Category creation error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' });
  }
});

// ✅ Get a single category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category' });
  }
});

// ✅ Delete a category
router.delete('/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category' });
  }
});
// ✅ Update category
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { category, subCategory } = req.body;
    const image = req.file?.path;

    const updatedFields = {
      category,
      subCategory: subCategory ? subCategory.split(',').map(sub => sub.trim()) : []
    };

    if (image) {
      updatedFields.image = image;
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category updated successfully', category: updatedCategory });
  } catch (err) {
    console.error('❌ Update category error:', err.message);
    res.status(500).json({ message: 'Failed to update category', error: err.message });
  }
});


module.exports = router;
