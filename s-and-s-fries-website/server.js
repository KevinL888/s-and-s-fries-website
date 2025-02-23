const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database("sns_fries.db");

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
    db.all("SELECT * FROM reviews", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Add a review
app.post("/api/reviews", (req, res) => {
    const { menu_item_id, customer_name, rating, review_text } = req.body;
    db.run(
        `INSERT INTO reviews (menu_item_id, customer_name, rating, review_text) VALUES (?, ?, ?, ?)`,
        [menu_item_id, customer_name, rating, review_text],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ response: "REVIEW ADDED", id: this.lastID });
        }
    );
});

app.listen(port, () => {
    console.log(`S & S Fries API running on http://localhost:${port}/api`);
});
