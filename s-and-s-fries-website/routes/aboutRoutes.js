const express = require("express");
const router = express.Router();

// GET request to render the About Us page
router.get("/", (req, res) => {
    res.render("about", { user: req.user });
});

module.exports = router;
