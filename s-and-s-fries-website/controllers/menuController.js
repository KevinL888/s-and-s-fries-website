const menuModel = require("../models/menuModel");
const path = require("path");
const fs = require("fs");

//  **Render Menu Page**
function getMenuPage(req, res) {
    menuModel.getAllMenuItems((err, menuItems) => {
        if (err) return res.status(500).send("Database error");

        menuModel.getAllCategories((err, categories) => {
            if (err) return res.status(500).send("Database error");

            // Ensure `user` is always defined
            const user = req.user || null;
            const isAdmin = user && user.role === "admin";

            console.log("🔹 Debugging User in getMenuPage:", user);
            console.log("🔹 isAdmin Value in getMenuPage:", isAdmin);

            // Pass user and admin status to Mustache
            res.render("menu", { 
                menuItems, 
                categories,
                user,
                isAdmin
            });
        });
    });
}


//  **Fetch All Menu Items (JSON)**
function getAllMenuItemsAPI(req, res) {
    menuModel.getAllMenuItems((err, menuItems) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(menuItems);
    });
}

//  **Fetch Menu Items by Category (JSON)**
function getMenuItemsByCategory(req, res) {
    const category = req.params.category;
    menuModel.getAllMenuItems((err, menuItems) => {
        if (err) return res.status(500).json({ error: "Database error" });

        const filteredItems = menuItems.filter(item => item.category === category);
        res.json(filteredItems);
    });
}

//  **Fetch All Categories (JSON)**
function getAllCategoriesAPI(req, res) {
    menuModel.getAllCategories((err, categories) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(categories);
    });
}

//  **Fetch a Single Menu Item by ID (JSON)**
function getMenuItemById(req, res) {
    const id = req.params.id;
    menuModel.getMenuItemById(id, (err, menuItem) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!menuItem) return res.status(404).json({ error: "Menu item not found" });
        res.json(menuItem);
    });
}

//  **Add New Menu Item (Image Upload Handled in `menuRoutes.js`)**
function addMenuItem(req, res) {
    const { name, description, price, category } = req.body;
    const image_url = req.file ? req.file.filename : null; // Save image filename

    if (!name || !description || !price || !category) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    menuModel.addMenuItem(name, description, price, category, image_url, (err, id) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(201).json({ message: "Menu item added successfully", id });
    });
}

// **Update Menu Item (Retains Existing Image if Not Provided)**
function updateMenuItem(req, res) {
    const id = req.params.id; // 🔹 Take ID from URL param instead of req.body.id
    const { name, description, price, category } = req.body;
    const newImage = req.file ? req.file.filename : null; // Save new image if uploaded

    if (!name || !description || !price || !category) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Get the existing menu item to check its current image
    menuModel.getMenuItemById(id, (err, existingItem) => {
        if (err || !existingItem) {
            return res.status(404).json({ error: "Menu item not found" });
        }

        // Preserve existing image if no new image was uploaded
        const finalImage = newImage || existingItem.image_url;

        menuModel.updateMenuItem(id, name, description, price, category, finalImage, (err) => {
            if (err) return res.status(500).json({ error: "Database error" });

            res.json({ message: "✅ Menu item updated successfully!" });
        });
    });
}

// **Delete Menu Item (Removes Image)**
function deleteMenuItem(req, res) {
    const id = req.params.id;

    menuModel.getMenuItemById(id, (err, menuItem) => {
        if (err || !menuItem) {
            return res.status(404).json({ error: "Menu item not found" });
        }

        // Delete the menu item from DB
        menuModel.deleteMenuItem(id, (err) => {
            if (err) return res.status(500).json({ error: "Database error" });

            // If an image exists, delete it from /public/images/
            if (menuItem.image_url) {
                const imagePath = path.join(__dirname, "../public/images/", menuItem.image_url);
                fs.unlink(imagePath, (unlinkErr) => {
                    if (unlinkErr && unlinkErr.code !== "ENOENT") {
                        console.error("Error deleting image:", unlinkErr);
                    }
                });
            }

            res.json({ message: "Menu item deleted successfully" });
        });
    });
}

// **Export All Controller Functions**
module.exports = {
    getMenuPage,
    getAllMenuItemsAPI,
    getMenuItemsByCategory,
    getAllCategoriesAPI,
    getMenuItemById,
    addMenuItem,
    deleteMenuItem,
    updateMenuItem,
};
