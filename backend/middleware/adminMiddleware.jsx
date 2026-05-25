// 📄 Location: backend/middleware/adminMiddleware.js

const isAdmin = (req, res, next) => {
  // `req.user` tabhi milega jab tum `protect` middleware pehle use karoge
  if (req.user && req.user.role === 'admin') {
    next(); // Admin hai, aage badho
  } else {
    // Admin nahi hai, access block karo
    res.status(403).json({ 
      success: false, 
      message: "Access denied: Admin clearance required." 
    });
  }
};

module.exports = { isAdmin };