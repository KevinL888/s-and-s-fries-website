const menuModel = require("../models/menuModel");

// Render the menu page with menu items
function getMenuPage(req, res) {
    menuModel.getAllMenuItems((err, menuItems) => {
        if (err) {
            return res.status(500).send("Database error");
        }
        res.render("menu", { menuItems }); // Send data to Mustache template
    });
}

// API: Fetch all menu items (JSON)
function getAllMenuItemsAPI(req, res) {
    menuModel.getAllMenuItems((err, menuItems) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(menuItems);
    });
}

// API: Fetch a single menu item by ID
function getMenuItemById(req, res) {
    const id = req.params.id;
    menuModel.getMenuItemById(id, (err, menuItem) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!menuItem) return res.status(404).json({ error: "Menu item not found" });
        res.json(menuItem);
    });
}

// API: Add a new menu item
function addMenuItem(req, res) {
    const { name, description, price, category, image_url } = req.body;
    if (!name || !description || !price || !category) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    menuModel.addMenuItem(name, description, price, category, image_url, (err, id) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.status(201).json({ message: "Menu item added", id });
    });
}

// API: Delete a menu item
function deleteMenuItem(req, res) {
    const id = req.params.id;
    menuModel.deleteMenuItem(id, (err) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "Menu item deleted" });
    });
}

// Export all controller functions
module.exports = {
    getMenuPage,
    getAllMenuItemsAPI,
    getMenuItemById,
    addMenuItem,
    deleteMenuItem,
};
