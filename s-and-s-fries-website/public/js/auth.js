document.addEventListener("DOMContentLoaded", function () {
    const accountBtn = document.getElementById("accountBtn");
    const loginRegisterOptions = document.getElementById("loginRegisterOptions");
    const logoutOption = document.getElementById("logoutOption");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const logoutBtn = document.getElementById("logoutBtn");

    console.log("🔹 Fetching user data from /api/auth/me...");

    // Fetch user info from cookies
    fetch("/api/auth/me", {
        method: "GET",
        credentials: "include" // Ensures cookies are sent with the request
    })
    .then(response => response.ok ? response.json() : null)
    .then(user => {
        if (user) {
            console.log("User authenticated:", user);
            if (accountBtn) {
                accountBtn.innerHTML = user.role === "admin" ? "Admin" : user.username;
            }
            if (loginRegisterOptions) loginRegisterOptions.classList.add("d-none");
            if (logoutOption) logoutOption.classList.remove("d-none");
        } else {
            console.log("Not authenticated");
        }
    })
    .catch(err => console.error("Error fetching user data:", err));

    // Prevent duplicate event listeners
    function addEventListenerOnce(element, eventType, handler) {
        if (element && !element.dataset.listenerAttached) {
            element.addEventListener(eventType, handler);
            element.dataset.listenerAttached = "true"; // Mark that listener is attached
        }
    }

    // Login Form Submission
    addEventListenerOnce(loginForm, "submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Login failed: " + data.error);
            } else {
                location.reload();
            }
        })
        .catch(err => console.error("Login error:", err));
    });

    // Register Form Submission
    addEventListenerOnce(registerForm, "submit", function (e) {
        e.preventDefault();

        const username = document.getElementById("registerUsername").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username, email, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert("Registration failed: " + data.error);
            } else {
                alert("Registration successful! Logging in...");
                location.reload();
            }
        })
        .catch(err => console.error("Registration error:", err));
    });

    // Logout Logic
    addEventListenerOnce(logoutBtn, "click", function () {
        fetch("/api/auth/logout", { method: "POST", credentials: "include" })
        .then(() => {
            location.reload();
        })
        .catch(err => console.error("Logout error:", err));
    });
});
