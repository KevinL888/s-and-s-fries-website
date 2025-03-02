const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "supersecret"; // Use env variable in production

// Mock user database
const users = [{ id: 1, username: "admin", email: "garylai220@gmail.com", role: "admin", password: "password123" }];

// Login Route (Set JWT Cookie)
router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    // Set the token as an HTTP-only cookie
    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // Change to `true` in production (HTTPS required)
        sameSite: "Strict"
    });

    res.json({ message: "Login successful", user });
});

// **✅ Add /me Route to Return User Info**
router.get("/me", (req, res) => {
    const token = req.cookies.token; // Extract token from cookie
    if (!token) {
        return res.status(401).json({ error: "Not authenticated" });
    }

    try {
        const user = jwt.verify(token, SECRET_KEY);
        res.json(user);
    } catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
});

// Logout Route (Clear Cookie)
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out" });
});

module.exports = router;
