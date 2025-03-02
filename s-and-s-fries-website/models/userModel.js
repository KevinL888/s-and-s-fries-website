const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("sns_fries.db");

// ✅ Fetch user by email using Promises
function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
            if (err) reject(err);
            else resolve(user);
        });
    });
}

// ✅ Register a new user using Promises
function registerUser(username, email, password, role = "user") {
    return new Promise((resolve, reject) => {
        db.run(
            "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
            [username, email, password, role],
            function (err) {
                if (err) reject(err);
                else resolve(this.lastID); // Return the user ID of the inserted row
            }
        );
    });
}

// ✅ Export the updated functions
module.exports = {
    getUserByEmail,
    registerUser,
};
