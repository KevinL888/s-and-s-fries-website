const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

// API Route to fetch all reviews
router.get("/api", reviewController.getAllReviews);

// API Route to add a new review
router.post("/api", reviewController.addReview);

module.exports = router; // ✅ Ensure this is exported
