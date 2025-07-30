const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const authRoutes = require('./routes/auth');
const orderRout=require('./routes/orderRout')
const razorpay =require('./routes/razorpay')
const reviewRoute =require('./routes/reviewRoute')
const testimonialRoutes =require('./routes/testimonialRoutes')
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/', authRoutes); // Used for /register and /login
app.use('/api/orders',orderRout)
app.use('/api/razorpay',razorpay );
app.use ('/api/products',reviewRoute)
app.use('/api/feedback',testimonialRoutes)
// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.log('❌ MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
