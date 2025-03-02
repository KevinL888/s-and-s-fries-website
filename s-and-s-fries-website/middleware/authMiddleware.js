const jwt = require("jsonwebtoken");
const SECRET_KEY = "supersecret"; // Change this in production

// Middleware: Verify JWT Token
function authenticateToken(req, res, next) {
    console.log("Authenticate Token Middleware Triggered");  // Debugging
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        console.log("No token found");
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            console.log("Invalid Token");
            return res.status(403).json({ error: "Invalid token" });
        }
        console.log("Token Verified, User:", user);
        req.user = user;
        next();
    });
}

// Middleware: Check if user is admin
function checkAdmin(req, res, next) {
    console.log("Check Admin Middleware Triggered");  // Debugging
    if (!req.user || req.user.role !== "admin") {
        console.log("User is not admin");
        return res.status(403).json({ error: "Admins only!" });
    }
    console.log("User is admin");
    next();
}

module.exports = { authenticateToken, checkAdmin };
