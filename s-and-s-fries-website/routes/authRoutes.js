const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel"); // ✅ Import userModel
const SECRET_KEY = process.env.SECRET_KEY || "supersecret"; // Use env variable in production

// ✅ Register Route
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // ✅ Check if email already exists
        const existingUser = await userModel.getUserByEmail(email);
        if (existingUser) return res.status(400).json({ error: "Email is already registered" });

        // ✅ Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Insert user into DB
        const userId = await userModel.registerUser(username, email, hashedPassword, "user");

        // ✅ Generate JWT
        const token = jwt.sign(
            { id: userId, username, email, role: "user" },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        // ✅ Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Change to true in production (HTTPS required)
            sameSite: "Strict"
        });

        res.json({ message: "Registration successful", user: { id: userId, username, email, role: "user" } });

    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Error registering user" });
    }
});

// ✅ Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.getUserByEmail(email);
        if (!user) return res.status(401).json({ error: "Invalid email or password" });

        // ✅ Compare hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.status(401).json({ error: "Invalid email or password" });

        // ✅ Generate JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email, role: user.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );

        // ✅ Set HTTP-only cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // Change to true in production (HTTPS required)
            sameSite: "Strict"
        });

        res.json({ message: "Login successful", user: { id: user.id, username: user.username, role: user.role } });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ✅ User Info Route (`/api/auth/me`)
router.get("/me", (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    try {
        const user = jwt.verify(token, SECRET_KEY);
        res.json(user);
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
});

// ✅ Logout Route
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

module.exports = router;
