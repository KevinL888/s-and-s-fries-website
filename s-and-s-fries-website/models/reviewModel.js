const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("sns_fries.db");

// Fetch all reviews
function getAllReviews(callback) {
    db.all("SELECT * FROM reviews", [], (err, rows) => {
        if (err) return callback(err, null);
        callback(null, rows);
    });
}

// Add a new review
function addReview(menu_item_id, customer_name, rating, review_text, callback) {
    db.run(
        `INSERT INTO reviews (menu_item_id, customer_name, rating, review_text) VALUES (?, ?, ?, ?)`,
        [menu_item_id, customer_name, rating, review_text],
        function (err) {
            if (err) return callback(err);
            callback(null, { id: this.lastID });
        }
    );
}

module.exports = {
    getAllReviews,
    addReview
};
