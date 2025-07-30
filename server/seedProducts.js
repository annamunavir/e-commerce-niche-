const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/product'); // ✅ Adjust path if needed

dotenv.config();

const sampleProducts = [
  {
    productName: "Soft Teddy Bear",
    description: "Plush teddy bear made with hypoallergenic materials.",
    brand: "CuddleSoft",
    price: 899,
    offerPercentage: 10,
    offerPrice: 809.1,
    stock: 25,
    category: "Toys",
    subcategory: "Soft Toys",
    ageGroup: "1-3 Years",
    gender: "Unisex",
    image: "https://res.cloudinary.com/demo/image/upload/v1623411234/teddy_bear.jpg"
  },
  {
    productName: "Kids Winter Jacket",
    description: "Warm and stylish winter jacket for toddlers.",
    brand: "KidWear",
    price: 1999,
    offerPercentage: 15,
    offerPrice: 1699.15,
    stock: 10,
    category: "Fashion",
    subcategory: "Winter Wear",
    ageGroup: "3-6 Years",
    gender: "Boys",
    image: "https://res.cloudinary.com/demo/image/upload/v1623411234/winter_jacket.jpg"
  },
  {
    productName: "Educational Puzzle Board",
    description: "Wooden alphabet puzzle board for early learning.",
    brand: "EduPlay",
    price: 499,
    offerPercentage: 0,
    offerPrice: 499,
    stock: 40,
    category: "Toys",
    subcategory: "Educational",
    ageGroup: "1-3 Years",
    gender: "Unisex",
    image: "https://res.cloudinary.com/demo/image/upload/v1623411234/puzzle_board.jpg"
  },
  {
    productName: "Velcro Baby Shoes",
    description: "Comfortable and easy-to-wear shoes for infants.",
    brand: "TinyFeet",
    price: 799,
    offerPercentage: 5,
    offerPrice: 759.05,
    stock: 30,
    category: "Footwear",
    subcategory: "Shoes",
    ageGroup: "6-12 Months",
    gender: "Girls",
    image: "https://res.cloudinary.com/demo/image/upload/v1623411234/baby_shoes.jpg"
  },
  {
    productName: "School Backpack with Cartoon Print",
    description: "Durable school bag with compartments and fun design.",
    brand: "SchoolBuddy",
    price: 1299,
    offerPercentage: 20,
    offerPrice: 1039.2,
    stock: 15,
    category: "Educational",
    subcategory: "Bags",
    ageGroup: "6-11 Years",
    gender: "Boys",
    image: "https://res.cloudinary.com/demo/image/upload/v1623411234/school_bag.jpg"
  },
  {
    productName: "Maternity Nursing Pillow",
    description: "Ergonomic pillow for comfortable feeding support.",
    brand: "MomEase",
    price: 1599,
    offerPercentage: 10,
    offerPrice: 1439.1,
    stock: 8,
    category: "Maternity",
    subcategory: "Pillows",
    ageGroup: "Ladies",
    gender: "Ladies",
    image: "https://res.cloudinary.com/demo/image/upload/v1623411234/nursing_pillow.jpg"
  }
];

// Duplicate to reach 60 products
const products = Array.from({ length: 60 }, (_, index) => {
  const item = sampleProducts[index % sampleProducts.length];
  return {
    ...item,
    productName: `${item.productName} #${index + 1}`,
    image: item.image.replace(/\.jpg/, `_${index + 1}.jpg`) // fake unique image
  };
});

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Product.deleteMany(); // optional: clears existing products
    await Product.insertMany(products);
    console.log("✅ Products seeded successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Failed to seed products:", error);
    process.exit(1);
  }
};

importData();
