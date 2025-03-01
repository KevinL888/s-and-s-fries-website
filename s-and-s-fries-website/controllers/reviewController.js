const reviewModel = require("../models/reviewModel");

// Fetch all reviews
function getAllReviews(req, res) {
    reviewModel.getAllReviews((err, reviews) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(reviews);
    });
}

// Add a new review
function addReview(req, res) {
    const { menu_item_id, customer_name, rating, review_text } = req.body;

    if (!menu_item_id || !customer_name || !rating || !review_text) {
        return res.status(400).json({ error: "All fields are required" });
    }

    reviewModel.addReview(menu_item_id, customer_name, rating, review_text, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ response: "Review Added", id: result.id });
    });
}

module.exports = { getAllReviews, addReview };
