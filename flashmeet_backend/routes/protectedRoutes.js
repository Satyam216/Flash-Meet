const express = require("express");
const authMiddleware = require("../firebaseAuth"); // Make sure the path is correct
const router = express.Router();

router.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});


module.exports = router;
