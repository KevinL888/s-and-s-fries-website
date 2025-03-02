app.post("/auth/login", (req, res) => {
    const { email, password } = req.body;

    // Fetch user from DB (Example)
    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid credentials" });
            }

            const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

            // Set token as an HTTP-only cookie
            res.cookie("token", token, { httpOnly: true, secure: false }); // Secure should be true in production
            res.json({ message: "Login successful", role: user.role });
        });
    });
});
