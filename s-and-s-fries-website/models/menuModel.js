const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("sns_fries.db");
const path = require("path");
const fs = require("fs");

function getAllMenuItems(callback) {
    const defaultCategories = ["Fries/OnionRings", "Poutine", "Platters", "Sandwiches", "Drinks", "Extras"];

    db.all("SELECT * FROM menu_items", [], (err, rows) => {
        if (err) {
            console.error("Error fetching menu items:", err.message);
            return callback(err, null);
        }

        // Sort items based on default category order
        rows.sort((a, b) => {
            let indexA = defaultCategories.indexOf(a.category);
            let indexB = defaultCategories.indexOf(b.category);

            // If category is not in defaults, push it to the end
            if (indexA === -1) indexA = defaultCategories.length;
            if (indexB === -1) indexB = defaultCategories.length;

            return indexA - indexB;
        });

        callback(null, rows);
    });
}


//  **Fetch a Single Menu Item by ID**
function getMenuItemById(id, callback) {
    db.get("SELECT * FROM menu_items WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error("Error fetching menu item:", err.message);
            return callback(err, null);
        }
        callback(null, row);
    });
}

//  **Add a New Menu Item**
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

// **Update an Existing Menu Item with Image Retention**
function updateMenuItem(id, name, description, price, category, image_url, callback) {
    getMenuItemById(id, (err, existingItem) => {
        if (err || !existingItem) {
            return callback(new Error("Menu item not found"));
        }

        // Use existing image if new image is not provided
        const finalImage = image_url || existingItem.image_url;

        db.run(
            "UPDATE menu_items SET name = ?, description = ?, price = ?, category = ?, image_url = ? WHERE id = ?",
            [name, description, price, category, finalImage, id],
            function (err) {
                if (err) {
                    console.error("Error updating menu item:", err.message);
                    return callback(err);
                }
                callback(null);
            }
        );
    });
}

//  **Delete a Menu Item (Also Removes Image)**
function deleteMenuItem(id, callback) {
    getMenuItemById(id, (err, menuItem) => {
        if (err || !menuItem) {
            console.error("Menu item not found.");
            return callback(new Error("Menu item not found"));
        }

        // Delete image file if it exists
        if (menuItem.image_url) {
            const imagePath = path.join(__dirname, "../public/images/", menuItem.image_url);
            fs.unlink(imagePath, (unlinkErr) => {
                if (unlinkErr && unlinkErr.code !== "ENOENT") {
                    console.error("Error deleting image:", unlinkErr);
                }
            });
        }

        // Delete menu item from database
        db.run("DELETE FROM menu_items WHERE id = ?", [id], function (dbErr) {
            if (dbErr) {
                console.error("Error deleting menu item:", dbErr.message);
                return callback(dbErr);
            }
            callback(null);
        });
    });
}

//  **Fetch Unique Categories**
function getAllCategories(callback) {
    const defaultCategories = ["Fries/OnionRings", "Poutine", "Platters", "Sandwiches", "Drinks", "Extras"];

    db.all("SELECT DISTINCT category FROM menu_items", [], (err, rows) => {
        if (err) {
            return callback(err, null);
        }

        let categories = rows.map(row => row.category); // Extract categories from database

        // Merge categories, ensuring default ones stay on top
        let sortedCategories = [...defaultCategories, ...categories.filter(c => !defaultCategories.includes(c))];

        callback(null, sortedCategories);
    });
}



// **Export All Functions**
module.exports = {
    getAllMenuItems,
    getMenuItemById,
    addMenuItem,
    updateMenuItem,  // Added update function
    deleteMenuItem,
    getAllCategories
};
