const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const router = express.Router();
const SECRET_KEY = "supersecret"; // 🔹 Change this in production!

// Register Route
router.post("/register", (req, res) => {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required" });
    }

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.status(500).json({ error: "Error hashing password" });

        userModel.registerUser(username, email, hash, role || "user", (err, userId) => {
            if (err) return res.status(500).json({ error: "User registration failed" });
            res.status(201).json({ message: "User registered successfully", userId });
        });
    });
});

// Login Route
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    userModel.getUserByEmail(email, (err, user) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Internal server error" });
        }

        if (!user) {
            return res.status(401).json({ error: "User not found. Please register first." });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            if (!isMatch) {
                return res.status(401).json({ error: "Incorrect password" });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, email: user.email, role: user.role },
                SECRET_KEY,
                { expiresIn: "1h" }
            );
            
            res.json({ message: "Login successful", token });
        });
    });
});

module.exports = router;
