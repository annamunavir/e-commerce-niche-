const User = require('../models/user'); // 👈 match the actual filename

const adminAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    req.isAdmin = true; // Optional flag for routes to check
    next();
  } catch (error) {
    res.status(500).json({ message: 'Admin check failed', error: error.message });
  }
};

module.exports = adminAuth;
