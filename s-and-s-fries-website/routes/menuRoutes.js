const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { authenticateToken, checkAdmin } = require("../middleware/authMiddleware");

// Route to render the menu page with all items and categories
router.get("/", menuController.getMenuPage);

// API routes
router.get("/api", menuController.getAllMenuItemsAPI); // Fetch all menu items (JSON)
router.get("/api/categories", menuController.getAllCategoriesAPI); // Fetch all categories (JSON)
router.get("/api/category/:category", menuController.getMenuItemsByCategory); // Fetch items by category
router.get("/api/:id", menuController.getMenuItemById); // Fetch a single menu item

// 🔹 Protected Routes (Admins Only)
router.post("/api", authenticateToken, checkAdmin, menuController.addMenuItem); // Add a new menu item
router.delete("/api/:id", authenticateToken, checkAdmin, menuController.deleteMenuItem); // Delete a menu item

module.exports = router;
