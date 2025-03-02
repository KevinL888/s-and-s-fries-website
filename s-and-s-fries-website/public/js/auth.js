document.addEventListener("DOMContentLoaded", function () {
    const accountBtn = document.getElementById("accountBtn");
    const loginRegisterOptions = document.getElementById("loginRegisterOptions");
    const logoutOption = document.getElementById("logoutOption");

    console.log("🔹 Fetching user data from /api/auth/me...");

    fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",  // ✅ Ensures cookies are sent
    })
    .then(response => {
        if (!response.ok) {
            console.log("❌ Not authenticated");
            return null;
        }
        return response.json();
    })
    .then(user => {
        if (user) {
            console.log("✅ User authenticated:", user);
            accountBtn.innerHTML = user.role === "admin" ? "Admin" : user.username;
            loginRegisterOptions.classList.add("d-none"); // Hide login/register buttons
            logoutOption.classList.remove("d-none"); // Show logout button
        }
    })
    .catch(err => console.error("Error fetching user data:", err));

    // Logout Logic
    document.getElementById("logoutBtn").addEventListener("click", function () {
        fetch("/api/auth/logout", { method: "POST", credentials: "include" }) // ✅ Ensure logout request includes credentials
        .then(() => {
            console.log("✅ Logged out successfully");
            window.location.href = "/"; // Redirect to home after logout
        });
    });
});
