const e = require("express");
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    name = decoded.name;
    email = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};