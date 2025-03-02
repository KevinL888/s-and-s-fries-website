const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("sns_fries.db");

// Fetch user by email
function getUserByEmail(email, callback) {
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return callback(err, null);
        callback(null, user);
    });
}

// Register a new user
function registerUser(username, email, password, role, callback) {
    db.run(
        "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
        [username, email, password, role],
        function (err) {
            if (err) return callback(err, null);
            callback(null, this.lastID);
        }
    );
}

// Ensure the exports are correct
module.exports = {
    getUserByEmail,
    registerUser,
};
