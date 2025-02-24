const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const mustacheExpress = require("mustache-express");
const reviewModel = require("./models/reviewModel");
const path = require("path");
const app = express();
const port = 3000;

// Configure Mustache as the view engine
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public"))); // Serve static files (CSS, images)
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // To handle form data

// Connect to SQLite database
const db = new sqlite3.Database("sns_fries.db");

// Home Route - Render index.mustache
app.get("/", (req, res) => {
    reviewModel.getAllReviews((err, reviews) => {
        if (err) {
            console.error("Error fetching reviews:", err);
            return res.status(500).send("Error fetching reviews");
        }

        // Truncate long reviews before passing them to Mustache
        const truncatedReviews = reviews.map(review => ({
            ...review,
            short_review_text: review.review_text.length > 150 ? review.review_text.substring(0, 150) + "..." : review.review_text
        }));

        res.render("index", { reviews: truncatedReviews });
    });
});

// Get all menu items
app.get("/api/menu", (req, res) => {
    db.all("SELECT * FROM menu_items", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get a menu item by ID
app.get("/api/menu/:id", (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM menu_items WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row || { error: "Menu item not found" });
    });
});

// Add a new menu item
app.post("/api/menu", (req, res) => {
    const { name, description, price, category, image_url } = req.body;
    db.run(
        `INSERT INTO menu_items (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)`,
        [name, description, price, category, image_url],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ response: "MENU ITEM INSERTED", id: this.lastID });
        }
    );
});

// Delete a menu item
app.delete("/api/menu/:id", (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM menu_items WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ response: "MENU ITEM DELETED" });
    });
});

// Get all reviews
app.get("/api/reviews", (req, res) => {
    reviewModel.getAllReviews((err, reviews) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(reviews);
    });
});

// Add a new review
app.post("/api/reviews", (req, res) => {
    const { menu_item_id, customer_name, rating, review_text } = req.body;

    // Validate inputs (optional)
    if (!menu_item_id || !customer_name || !rating || !review_text) {
        return res.status(400).json({ error: "All fields are required" });
    }

    reviewModel.addReview(menu_item_id, customer_name, rating, review_text, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ response: "REVIEW ADDED", id: result.id });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`S & S Fries API running on http://localhost:${port}`);
    console.log(`Homepage available at http://localhost:${port}/`);
});
