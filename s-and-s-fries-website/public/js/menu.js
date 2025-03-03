document.addEventListener("DOMContentLoaded", function () {
    const categoryFilter = document.getElementById("categoryFilter");
    const menuItems = document.querySelectorAll(".menu-item");

    // 🔹 Category Filter Functionality
    if (categoryFilter) {
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
    }

    // 🔹 Check if User is Admin
    fetch("/api/auth/me", {
        method: "GET",
        credentials: "include"  // ✅ Use cookies for authentication
    })
    .then(response => response.ok ? response.json() : null)
    .then(user => {
        if (user && user.role === "admin") {
            console.log("✅ User is an admin.");
            document.querySelectorAll(".deleteMenuItem, .editMenuItem").forEach(btn => btn.classList.remove("d-none"));
            document.getElementById("adminControls")?.classList.remove("d-none"); // Show "Add Menu Item" button if exists
        } else {
            console.warn("⚠️ User is not an admin or not logged in.");
        }
    })
    .catch(err => console.error("❌ Error fetching user data:", err));

    // 🔹 Delete Menu Item
    document.querySelectorAll(".deleteMenuItem").forEach(button => {
        button.addEventListener("click", function () {
            const menuItemId = this.getAttribute("data-id");

            if (confirm("Are you sure you want to delete this menu item?")) {
                fetch(`/menu/api/${menuItemId}`, {
                    method: "DELETE",
                    credentials: "include", // ✅ Send authentication cookies
                })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    location.reload(); // Refresh the page after deleting
                })
                .catch(error => console.error("❌ Error deleting item:", error));
            }
        });
    });

    // 🔹 Handle Add Menu Item Submission
    const addMenuItemForm = document.getElementById("addMenuItemForm");

    if (addMenuItemForm) {
        addMenuItemForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("menuItemName").value;
            const description = document.getElementById("menuItemDescription").value;
            const price = document.getElementById("menuItemPrice").value;
            const category = document.getElementById("menuItemCategory").value;
            const imageInput = document.getElementById("menuItemImage").files[0];

            if (!imageInput) {
                alert("Please select an image.");
                return;
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", price);
            formData.append("category", category);
            formData.append("image", imageInput);

            fetch("/menu/api", {
                method: "POST",
                credentials: "include",
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert("Error adding menu item: " + data.error);
                } else {
                    alert("✅ Menu item added successfully!");
                    location.reload();
                }
            })
            .catch(error => console.error("❌ Error adding menu item:", error));
        });
    }

    // 🔹 Update Menu Item Logic
    const editMenuItemModal = new bootstrap.Modal(document.getElementById("editMenuItemModal"));
    const editMenuItemForm = document.getElementById("editMenuItemForm");
    let currentEditingItemId = null;

    // Open Edit Modal & Populate Fields
    document.querySelectorAll(".editMenuItem").forEach(button => {
        button.addEventListener("click", function () {
            currentEditingItemId = this.getAttribute("data-id");

            fetch(`/menu/api/${currentEditingItemId}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById("editMenuItemName").value = data.name;
                    document.getElementById("editMenuItemDescription").value = data.description;
                    document.getElementById("editMenuItemPrice").value = data.price;
                    document.getElementById("editMenuItemCategory").value = data.category;
                    editMenuItemModal.show();
                })
                .catch(error => console.error("❌ Error fetching menu item:", error));
        });
    });

    // Handle Update Submission
    if (editMenuItemForm) {
        editMenuItemForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const updatedItem = {
                name: document.getElementById("editMenuItemName").value,
                description: document.getElementById("editMenuItemDescription").value,
                price: parseFloat(document.getElementById("editMenuItemPrice").value),
                category: document.getElementById("editMenuItemCategory").value
            };

            fetch(`/menu/api/${currentEditingItemId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(updatedItem)
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                location.reload();
            })
            .catch(error => console.error("❌ Error updating menu item:", error));
        });
    }
});
