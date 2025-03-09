const express = require("express");
const router = express.Router();
const reviewModel = require("../models/reviewModel");
const menuModel = require("../models/menuModel"); // Import menuModel
const { authenticateToken } = require("../middleware/authMiddleware");

// Middleware: Ensure only "user" or "admin" can post reviews
function checkUserOrAdmin(req, res, next) {
    if (!req.user) {
        return res.status(403).send("You must be logged in to submit a review.");
    }
    if (req.user.role !== "user" && req.user.role !== "admin") {
        return res.status(403).send("You are not authorized to submit a review.");
    }
    next();
}

// 🔹 GET all reviews and menu items, then render reviews page
router.get("/", authenticateToken, (req, res) => {
    reviewModel.getAllReviews((err, reviews) => {
        if (err) {
            console.error("Error fetching reviews:", err);
            return res.status(500).send("Error fetching reviews");
        }

        // Fetch menu items to populate the dropdown
        menuModel.getAllMenuItems((menuErr, menuItems) => {
            if (menuErr) {
                console.error("Error fetching menu items:", menuErr);
                return res.status(500).send("Error fetching menu items");
            }

            res.render("review", { reviews, menuItems, user: req.user });
        });
    });
});

// 🔹 POST route to submit a new review (only for "user" or "admin")
router.post("/", authenticateToken, checkUserOrAdmin, (req, res) => {
    const { menu_item_id, rating, review_text } = req.body;

    // Ensure required fields are present
    if (!menu_item_id || !rating || !review_text) {
        return res.status(400).send("All fields are required!");
    }

    // Use the logged-in user's name instead of letting them input one
    const customer_name = req.user.username;

    reviewModel.addReview(menu_item_id, customer_name, rating, review_text, (err) => {
        if (err) {
            console.error("Error adding review:", err);
            return res.status(500).send("Error adding review");
        }
        res.redirect("/review");
    });
});

// 🔹 DELETE a review (Admins Only)
router.delete("/:id", authenticateToken, (req, res) => {
    const reviewId = req.params.id;

    // Ensure only admins can delete reviews
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Only admins can delete reviews" });
    }

    reviewModel.deleteReview(reviewId, (err) => {
        if (err) {
            console.error("Error deleting review:", err);
            return res.status(500).json({ error: "Failed to delete review" });
        }
        res.json({ response: "Review Deleted" });
    });
});

module.exports = router;
