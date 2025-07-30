const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/category'); // ✅ Capitalized and correct model name

dotenv.config();

const subcategoryMap = {
  Toys: ['Educational', 'Soft Toys', 'Remote Control', 'Outdoor'],
  Fashion: ['Winter Wear', 'Summer Wear', 'Party Wear'],
  Footwear: ['Sandals', 'Shoes', 'Boots'],
  KidsGrocery: ['Books', 'Bags', 'Stationery', 'Baby Food'],
  MomsAndMaternity: ['Feeding', 'Prenatal Care', 'Clothing'],
  BabyEssentials: ['Diapers', 'Creams', 'Wipes'],
  Nursery: ['Cribs', 'Chairs', 'Tables', 'Mat'],
  BathAndSkinCare: ['SkinCare', 'BathEssentials']
};

// 🌟 Generate dummy Cloudinary image URLs
const generateImage = (category) => {
  return `https://res.cloudinary.com/demo/image/upload/v1623411234/${category.toLowerCase()}.jpg`;
};

// ✅ Convert map to array with correct keys matching the schema
const categories = Object.entries(subcategoryMap).map(([category, subcategories]) => ({
  category,
  subCategory: subcategories, // ✅ matches schema key
  image: generateImage(category)
}));

// 🌱 Import data
const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Category.deleteMany(); // clear old data
    await Category.insertMany(categories); // insert new data
    console.log(`✅ Inserted ${categories.length} categories successfully.`);
    process.exit();
  } catch (error) {
    console.error('❌ Failed to seed categories:', error);
    process.exit(1);
  }
};

importData();
