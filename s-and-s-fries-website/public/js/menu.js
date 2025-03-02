document.addEventListener("DOMContentLoaded", function () {
    const categoryFilter = document.getElementById("categoryFilter");
    const menuItems = document.querySelectorAll(".menu-item");

    // Category filter functionality
    categoryFilter.addEventListener("change", function () {
        const selectedCategory = categoryFilter.value;

        menuItems.forEach(item => {
            const itemCategory = item.getAttribute("data-category");

            if (selectedCategory === "All" || itemCategory === selectedCategory) {
                item.classList.remove("d-none");
            } else {
                item.classList.add("d-none");
            }
        });
    });

    // 🔹 Admin Controls: Ensure Element Exists Before Modifying
    const adminControls = document.getElementById("adminControls");

    if (adminControls) {
        const token = localStorage.getItem("token");

        if (token) {
            const decoded = parseJwt(token);
            if (decoded.role === "admin") {
                adminControls.classList.remove("d-none"); // Show "Add Menu Item" button
                document.querySelectorAll(".deleteMenuItem").forEach(btn => btn.classList.remove("d-none")); // Show delete buttons
            }
        }
    }

    // 🔹 Delete Menu Item
    document.querySelectorAll(".deleteMenuItem").forEach(button => {
        button.addEventListener("click", function () {
            const menuItemId = this.getAttribute("data-id");
            const token = localStorage.getItem("token");

            if (!token) {
                alert("You need to be logged in as an admin.");
                return;
            }

            if (confirm("Are you sure you want to delete this menu item?")) {
                fetch(`/menu/api/${menuItemId}`, {
                    method: "DELETE",
                    headers: { "Authorization": `Bearer ${token}` }
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    location.reload(); // Refresh the page after deleting
                })
                .catch(error => console.error("Error deleting item:", error));
            }
        });
    });

    // 🔹 Helper function to decode JWT
    function parseJwt(token) {
        try {
            return JSON.parse(atob(token.split(".")[1]));
        } catch (e) {
            return {};
        }
    }
});
