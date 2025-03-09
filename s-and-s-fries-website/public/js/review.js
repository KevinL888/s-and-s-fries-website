document.addEventListener("DOMContentLoaded", () => {
    // Delete review logic with confirmation
    document.querySelectorAll(".delete-form").forEach(form => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            const reviewId = this.action.split("/").pop();

            const confirmDelete = confirm("Are you sure you want to delete this review?");
            if (!confirmDelete) {
                return;
            }

            fetch(`/review/${reviewId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                alert("Review successfully deleted.");
                location.reload();
            })
            .catch(error => {
                console.error("Error deleting review:", error);
                alert("Failed to delete review. Please try again.");
            });
        });
    });

    // Review sorting logic
    const reviewFilter = document.getElementById("reviewFilter");
    if (reviewFilter) {
        reviewFilter.addEventListener("change", function() {
            window.location.href = `/review?sort=${this.value}`;
        });

        // Set the selected value based on query param (to maintain state on reload)
        const urlParams = new URLSearchParams(window.location.search);
        const currentSort = urlParams.get("sort") || "recent";
        reviewFilter.value = currentSort;
    }
});
