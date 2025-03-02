const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const menuController = require("../controllers/menuController");
const { authenticateToken, checkAdmin } = require("../middleware/authMiddleware");
const multer = require("multer");

// 🔹 Set up Multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage: storage });

// ✅ **Ensure `req.user` is available in `/menu`**
router.get("/", authenticateToken, (req, res) => {
    console.log("🔹 Request received at /menu");
    console.log("🔍 Incoming Headers:", req.headers);

    menuController.getMenuPage(req, res);
});

// 📌 Public API Routes
router.get("/api", menuController.getAllMenuItemsAPI);
router.get("/api/categories", menuController.getAllCategoriesAPI);
router.get("/api/category/:category", menuController.getMenuItemsByCategory);
router.get("/api/:id", menuController.getMenuItemById);

// 🔐 Protected Routes (Admins Only)
router.post("/api", authenticateToken, checkAdmin, upload.single("image"), menuController.addMenuItem);

// 🔥 Delete Menu Item & Image
router.delete("/api/:id", authenticateToken, checkAdmin, async (req, res) => {
    const menuItemId = req.params.id;

    menuController.getMenuItemById({ params: { id: menuItemId } }, {
        json: (menuItem) => {
            if (!menuItem || !menuItem.image_url) {
                return res.status(404).json({ error: "Menu item not found" });
            }

            const imagePath = path.join(__dirname, "../public/images/", menuItem.image_url);

            // Delete image file
            fs.unlink(imagePath, (err) => {
                if (err && err.code !== "ENOENT") {
                    console.error("Error deleting image:", err);
                }
            });

            // Delete menu item from DB
            menuController.deleteMenuItem(req, res);
        },
        status: () => res, // Mock `res.status()` to chain responses
    });
});

module.exports = router;
