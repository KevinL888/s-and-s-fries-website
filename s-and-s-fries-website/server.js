const express = require("express");
const bodyParser = require("body-parser");
const mustacheExpress = require("mustache-express"); // ✅ Ensure mustache-express is imported
const path = require("path");
const reviewModel = require("./models/reviewModel");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || "supersecret"; // Use env variable in production

// ✅ Configure Mustache as the view engine (Fixing the issue)
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views")); // Ensure views path is correct

// ✅ Debugging: Log if views directory is accessible
console.log("🔍 Mustache Views Directory:", app.get("views"));

// ✅ CORS Configuration (Supports Local + Production)
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

// ✅ Middleware
app.use(express.static(path.join(__dirname, "public"))); // Serve static files
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ Function to extract user from JWT
function getUserFromToken(req) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return null;
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error) {
        return null;
    }
}

// ✅ Middleware to make `req.user` available in all requests
app.use((req, res, next) => {
    req.user = getUserFromToken(req);
    res.locals.user = req.user;
    next();
});

// ✅ Import Routes
const menuRoutes = require("./routes/menuRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

// ✅ Home Route
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
        res.render("index", { reviews: truncatedReviews, user }); // Ensure index.mustache exists
    });
});

// ✅ Use Routes
app.use("/menu", menuRoutes);
app.use("/reviews", reviewRoutes);
app.use("/auth", userRoutes);
app.use("/api/auth", authRoutes);

// ✅ Start Server
app.listen(port, () => {
    console.log(`🚀 S & S Fries API running on port ${port}`);
    console.log(`🌍 Homepage available at http://localhost:${port}/`);
});
