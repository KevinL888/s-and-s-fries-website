const jwt = require("jsonwebtoken");
const SECRET_KEY = "supersecret"; // Use an environment variable in production

// Middleware: Verify JWT Token (Supports Cookies & Headers)
function authenticateToken(req, res, next) {
    console.log("🔹 Authenticate Token Middleware Triggered");

    let token = req.cookies.token || req.cookies["authjs.session-token"] || null; // ✅ Check both keys
    if (!token) {
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1]; // Extract token from Authorization header
        }
    }

    if (!token) {
        console.log("⚠️ No Token Found");
        req.user = null; // Allow public access when token is missing
        return next();
    }

    // Verify token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log("❌ Invalid Token:", err.message);
            req.user = null;
        } else {
            console.log("✅ Token Verified, User:", user);
            req.user = user;
        }
        next();
    });
}

// Middleware: Check if user is an admin
function checkAdmin(req, res, next) {
    console.log("🔹 Check Admin Middleware Triggered");

    if (!req.user || req.user.role !== "admin") {
        console.log("❌ User is not an admin");
        return res.status(403).json({ error: "Admins only!" });
    }
    console.log("✅ User is admin");
    next();
}

module.exports = { authenticateToken, checkAdmin };
