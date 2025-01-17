const express = require("express");
const router = express.Router();

// Mock route
router.get("/", (req, res) => {
  res.json({ message: "All builds will be displayed here." });
});

module.exports = router;
