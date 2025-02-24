const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("sns_fries.db");

// Fetch all menu items
function getAllMenuItems(callback) {
    db.all("SELECT * FROM menu_items", [], (err, rows) => {
        if (err) {
            console.error("Error fetching menu items:", err.message);
            return callback(err, null);
        }
        callback(null, rows);
    });
}

// Fetch a menu item by ID
function getMenuItemById(id, callback) {
    db.get("SELECT * FROM menu_items WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error("Error fetching menu item:", err.message);
            return callback(err, null);
        }
        callback(null, row);
    });
}

// Add a new menu item
function addMenuItem(name, description, price, category, image_url, callback) {
    db.run(
        "INSERT INTO menu_items (name, description, price, category, image_url) VALUES (?, ?, ?, ?, ?)",
        [name, description, price, category, image_url],
        function (err) {
            if (err) {
                console.error("Error adding menu item:", err.message);
                return callback(err, null);
            }
            callback(null, this.lastID);
        }
    );
}

// Delete a menu item
function deleteMenuItem(id, callback) {
    db.run("DELETE FROM menu_items WHERE id = ?", [id], function (err) {
        if (err) {
            console.error("Error deleting menu item:", err.message);
            return callback(err);
        }
        callback(null);
    });
}

module.exports = { getAllMenuItems, getMenuItemById, addMenuItem, deleteMenuItem };
