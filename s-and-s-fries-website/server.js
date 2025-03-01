const express = require("express");
const bodyParser = require("body-parser");
const mustacheExpress = require("mustache-express");
const path = require("path");
const reviewModel = require("./models/reviewModel");

const app = express();
const port = 3000;

// Configure Mustache as the view engine
app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public"))); // Serve static files (CSS, images)
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true })); // To handle form data

// Import Routes
const menuRoutes = require("./routes/menuRoutes");
const reviewRoutes = require("./routes/reviewRoutes"); // ✅ Added back reviewRoutes

// Home Route - Render index.mustache
app.get("/", (req, res) => {
    reviewModel.getAllReviews((err, reviews) => {
        if (err) {
            console.error("Error fetching reviews:", err);
            return res.status(500).send("Error fetching reviews");
        }

        // Truncate long reviews before passing them to Mustache
        const truncatedReviews = reviews.map(review => ({
            ...review,
            short_review_text: review.review_text.length > 150 ? review.review_text.substring(0, 150) + "..." : review.review_text
        }));

        res.render("index", { reviews: truncatedReviews });
    });
});

// Use Routes
app.use("/menu", menuRoutes);
app.use("/reviews", reviewRoutes);

// Start the server
app.listen(port, () => {
    console.log(`S & S Fries API running on http://localhost:${port}`);
    console.log(`Homepage available at http://localhost:${port}/`);
});
