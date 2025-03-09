const jwt = require("jsonwebtoken");
const SECRET_KEY = "supersecret"; // Use an environment variable in production

// Middleware: Verify JWT Token (Supports Cookies & Headers)
function authenticateToken(req, res, next) {
    let token = req.cookies.token || req.cookies["authjs.session-token"] || null;
    if (!token) {
        const authHeader = req.headers["authorization"];
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1]; // Extract token from Authorization header
        }
    }

    if (!token) {
        req.user = null; // Allow public access when token is missing
        return next();
    }

    // Verify token
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            req.user = null;
        } else {
            req.user = user;
        }
        next();
    });
}

// Middleware: Check if user is an admin
function checkAdmin(req, res, next) {
    if (!req.user || req.user.role !== "admin") {
        return res.status(403).json({ error: "Admins only!" });
    }
    next();
}

module.exports = { authenticateToken, checkAdmin };
