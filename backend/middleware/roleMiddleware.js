// Specific roles ko allow karne ke liye
const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Sirf ${roles.join(", ")} hi yeh kar sakte hain.`,
      });
    }
    next();
  };
};

module.exports = { allowRoles };