const express = require("express");
const bodyParser = require("body-parser");
const mustacheExpress = require("mustache-express");
const path = require("path");
const reviewModel = require("./models/reviewModel");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || "supersecret"; 

// Configure Mustache as the view engine
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));
console.log("🔍 Mustache Views Directory:", app.get("views"));

// CORS Configuration
const allowedOrigins = [
    "http://localhost:3000",
    "https://your-production-domain.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Function to extract user from JWT
function getUserFromToken(req) {
    const token = req.cookies.token;
    if (!token) return null;
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
}

// Middleware to make `req.user` available in all requests
app.use((req, res, next) => {
    req.user = getUserFromToken(req);
    res.locals.user = req.user;
    res.locals.isAdmin = req.user && req.user.role === "admin"; 
    res.locals.isAllowed = req.user && (req.user.role === "user" || req.user.role === "admin"); 
    next();
});


// Import Routes
const menuRoutes = require("./routes/menuRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Home Route
app.get("/", (req, res) => {
    const user = req.user;
    reviewModel.getAllReviews((err, reviews) => {
        if (err) {
            console.error("❌ Error fetching reviews:", err);
            return res.status(500).send("Error fetching reviews");
        }

        const truncatedReviews = reviews.map(review => ({
            ...review,
            short_review_text: review.review_text.length > 150
                ? review.review_text.substring(0, 150) + "..."
                : review.review_text
        }));

        console.log("✅ Rendering index.mustache");
        res.render("index", { reviews: truncatedReviews, user });
    });
});

// Use Routes
app.use("/menu", menuRoutes);
app.use("/review", reviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/contact", contactRoutes);

// Start Server
app.listen(port, () => {
    console.log(`🚀 S & S Fries API running on port ${port}`);
    console.log(`🌍 Homepage available at http://localhost:${port}/`);
});