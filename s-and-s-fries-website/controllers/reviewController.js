const reviewModel = require("../models/reviewModel");
const menuModel = require("../models/menuModel");

// Fetch all reviews & menu items
function getAllReviews(req, res) {
    reviewModel.getAllReviews((err, reviews) => {
        if (err) {
            return res.status(500).json({ error: "Database error" });
        }

        // Fetch menu items to pass into the dropdown
        menuModel.getAllMenuItems((menuErr, menuItems) => {
            if (menuErr) {
                return res.status(500).json({ error: "Error fetching menu items" });
            }

            res.render("reviews", {
                reviews,
                menuItems,
                user: req.user
            });
        });
    });
}

// Add a new review (Only Authenticated Users)
function addReview(req, res) {
    if (!req.user) {
        return res.status(403).json({ error: "You must be logged in to submit a review" });
    }

    const { menu_item_id, rating, review_text } = req.body;
    const customer_name = req.user.username; // Use logged-in user's name

    if (!menu_item_id || !rating || !review_text) {
        return res.status(400).json({ error: "All fields are required" });
    }

    reviewModel.addReview(menu_item_id, customer_name, rating, review_text, (err, result) => {
        if (err) {
            console.error("Error adding review:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ response: "Review Added", id: result.id });
    });
}

// Delete a review (Admins Only)
function deleteReview(req, res) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Only admins can delete reviews" });
    }

    const review_id = req.params.id;

    reviewModel.deleteReview(review_id, (err, result) => {
        if (err) {
            console.error("Error deleting review:", err.message);
            return res.status(500).json({ error: "Failed to delete review" });
        }
        res.json({ response: "Review Deleted" });
    });
}

module.exports = { getAllReviews, addReview, deleteReview };
