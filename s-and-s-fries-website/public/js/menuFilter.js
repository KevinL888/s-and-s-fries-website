document.addEventListener("DOMContentLoaded", function () {
    const categoryFilter = document.getElementById("categoryFilter");
    const menuItems = document.querySelectorAll(".menu-item");

    categoryFilter.addEventListener("change", function () {
        const selectedCategory = categoryFilter.value;

        menuItems.forEach(item => {
            const itemCategory = item.getAttribute("data-category");

            if (selectedCategory === "All" || itemCategory === selectedCategory) {
                item.classList.remove("d-none"); // Show item
            } else {
                item.classList.add("d-none"); // Hide item
            }
        });
    });
});
