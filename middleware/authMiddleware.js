const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

const requireAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token from header
      token = req.headers.authorization.split(" ")[1];

      // verify the token
      const decorded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decorded.id).select("-password");

      next();
    } catch (error) {
      res.status(401).json("Not authorized or token expires");
    }
  }

  if (!token) {
    res.status(401).json("Not authorized, no token");
  }
});
module.exports = { requireAuth };
