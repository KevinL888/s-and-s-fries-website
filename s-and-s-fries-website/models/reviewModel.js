const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("sns_fries.db");

// Fetch all reviews with menu item names and sorting
function getAllReviews(sortBy = "recent", callback) {
    let orderByClause = "ORDER BY reviews.created_at DESC"; // Default sorting by most recent

    if (sortBy === "rating") {
        orderByClause = "ORDER BY reviews.rating DESC, reviews.created_at DESC"; // Highest rating first, then most recent
    }

    const query = `
        SELECT reviews.*, menu_items.name AS menu_item_name 
        FROM reviews 
        JOIN menu_items ON reviews.menu_item_id = menu_items.id
        ${orderByClause}
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Error fetching reviews:", err.message);
            return callback(err, null);
        }
        callback(null, rows);
    });
}

// Add a new review with validation
function addReview(menu_item_id, customer_name, rating, review_text, callback) {
    // Check if menu_item_id exists
    db.get("SELECT id FROM menu_items WHERE id = ?", [menu_item_id], (err, row) => {
        if (err) {
            console.error("Error checking menu item:", err.message);
            return callback(err, null);
        }
        if (!row) {
            return callback(new Error("Invalid menu item ID"), null);
        }

        db.run(
            `INSERT INTO reviews (menu_item_id, customer_name, rating, review_text, created_at) 
             VALUES (?, ?, ?, ?, datetime('now'))`,  // Ensure created_at is added
            [menu_item_id, customer_name, rating, review_text],
            function (err) {
                if (err) {
                    console.error("Error adding review:", err.message);
                    return callback(err, null);
                }
                callback(null, { id: this.lastID });
            }
        );
    });
}

// Delete a review by ID
function deleteReview(review_id, callback) {
    db.run(`DELETE FROM reviews WHERE id = ?`, [review_id], function (err) {
        if (err) {
            console.error("Error deleting review:", err.message);
            return callback(err, null);
        }
        callback(null, { message: "Review deleted successfully" });
    });
}

module.exports = { getAllReviews, addReview, deleteReview };
