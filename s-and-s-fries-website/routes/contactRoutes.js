const express = require("express");
const router = express.Router();

// 🔹 GET Contact Page
router.get("/", (req, res) => {
    res.render("contact", { user: req.user });
});

// 🔹 POST Contact Form (Placeholder for Future Logic)
router.post("/", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: "All fields are required" });
    }
    res.json({ response: "✅ Message received (this is a placeholder response)." });
});

module.exports = router;
